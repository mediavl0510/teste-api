const { onRequest } = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
const OpenAI = require("openai");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

const OPENAI_KEY =
  process.env.OPENAI_API_KEY ||
  (functions.config().openai && functions.config().openai.key);

exports.nora = onRequest(
  {
    cors: [/ouvido-anonimo\.web\.app$/, /localhost:\d+$/],
    region: "southamerica-east1",
    timeoutSeconds: 120,
  },
  async (req, res) => {
    if (!OPENAI_KEY) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }
    if (req.method !== "POST")
      return res.status(405).json({ error: "Use POST" });

    const { history = [], userMessage = "" } = req.body || {};
    if (!userMessage)
      return res.status(400).json({ error: "Mensagem obrigatória" });

    const openai = new OpenAI({ apiKey: OPENAI_KEY });

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é Nora, uma IA acolhedora do Ouvido Anônimo. Fale em português, com empatia, e jamais faça diagnóstico médico. Sugira ajuda profissional se detectar risco.",
          },
          ...history.slice(-10),
          { role: "user", content: userMessage },
        ],
        temperature: 0.6,
      });

      const reply =
        completion.choices?.[0]?.message?.content ??
        "Desculpe, não consegui responder agora.";
      return res.status(200).json({ reply });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Erro ao gerar resposta" });
    }
  }
);

// ---------------------------------------------------------------------------
// Webflow CMS Item Sync
//
// Problema: o Webflow CMS tem ordenação global — mover um item no editor
// afeta todas as páginas onde a coleção aparece.
//
// Solução: esta função armazena uma ordenação customizada por página no
// Firestore. O site busca os itens por aqui em vez de depender do CMS.
//
// Endpoints (todos via query param `action`):
//   GET  ?action=getItems&collectionId=xxx[&pageSlug=yyy]
//        Retorna itens na ordem customizada da página (ou ordem padrão do CMS).
//
//   POST {action:"saveOrder", collectionId, pageSlug, itemIds:[...]}
//        Salva a ordem desejada para uma página específica.
//
//   GET  ?action=fetchItems&collectionId=xxx
//        Busca e retorna itens diretamente do Webflow (para diagnóstico/admin).
// ---------------------------------------------------------------------------
exports.webflowSync = onRequest(
  {
    cors: true,
    region: "southamerica-east1",
    timeoutSeconds: 60,
  },
  async (req, res) => {
    if (req.method === "OPTIONS") return res.status(204).send("");

    const WEBFLOW_TOKEN =
      process.env.WEBFLOW_API_TOKEN ||
      (functions.config().webflow && functions.config().webflow.token);

    if (!WEBFLOW_TOKEN) {
      return res
        .status(500)
        .json({ error: "Webflow API token not configured" });
    }

    const params = req.method === "GET" ? req.query : req.body || {};
    const { action } = params;

    try {
      if (action === "getItems") return await getItems(req, res, WEBFLOW_TOKEN);
      if (action === "saveOrder") return await saveOrder(req, res);
      if (action === "fetchItems") return await fetchItemsDirect(req, res, WEBFLOW_TOKEN);
      return res.status(400).json({ error: "Ação inválida. Use: getItems, saveOrder, fetchItems" });
    } catch (e) {
      console.error("webflowSync error:", e);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

// Retorna itens na ordem customizada da página, caindo no padrão do CMS se
// não houver ordem salva.
async function getItems(req, res, token) {
  const { collectionId, pageSlug } = req.query;
  if (!collectionId) {
    return res.status(400).json({ error: "collectionId é obrigatório" });
  }

  const cmsItems = await fetchFromWebflow(collectionId, token);

  if (!pageSlug) {
    return res.status(200).json({ items: cmsItems, ordered: false });
  }

  const docId = buildDocId(collectionId, pageSlug);
  const orderDoc = await db.collection("webflow_page_orders").doc(docId).get();

  if (!orderDoc.exists) {
    return res.status(200).json({ items: cmsItems, ordered: false });
  }

  const { itemIds } = orderDoc.data();
  const itemMap = new Map(cmsItems.map((item) => [item.id, item]));

  // Itens na ordem salva
  const ordered = itemIds.filter((id) => itemMap.has(id)).map((id) => itemMap.get(id));
  // Itens novos no CMS que ainda não têm posição salva (adicionados ao final)
  const savedSet = new Set(itemIds);
  const remainder = cmsItems.filter((item) => !savedSet.has(item.id));

  return res.status(200).json({ items: [...ordered, ...remainder], ordered: true });
}

// Salva a ordem customizada de uma página específica.
async function saveOrder(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { collectionId, pageSlug, itemIds } = req.body || {};
  if (!collectionId || !pageSlug || !Array.isArray(itemIds)) {
    return res.status(400).json({
      error: "Campos obrigatórios: collectionId, pageSlug, itemIds (array)",
    });
  }

  const docId = buildDocId(collectionId, pageSlug);
  await db.collection("webflow_page_orders").doc(docId).set({
    collectionId,
    pageSlug,
    itemIds,
    updatedAt: new Date().toISOString(),
  });

  return res.status(200).json({ success: true, savedItems: itemIds.length });
}

// Busca itens diretamente do Webflow sem aplicar ordenação salva (admin/debug).
async function fetchItemsDirect(req, res, token) {
  const { collectionId } = req.query;
  if (!collectionId) {
    return res.status(400).json({ error: "collectionId é obrigatório" });
  }

  const items = await fetchFromWebflow(collectionId, token);
  return res.status(200).json({ items, count: items.length });
}

// Busca todos os itens de uma coleção Webflow, paginando automaticamente.
async function fetchFromWebflow(collectionId, token) {
  const items = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const url =
      `https://api.webflow.com/v2/collections/${collectionId}/items` +
      `?limit=${limit}&offset=${offset}`;

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "accept-version": "1.0.0",
      },
    });

    if (!resp.ok) {
      const body = await resp.text();
      throw new Error(`Webflow API ${resp.status}: ${body}`);
    }

    const data = await resp.json();
    const page = data.items || [];

    for (const item of page) {
      items.push({
        id: item.id,
        slug: item.fieldData?.slug ?? "",
        name: item.fieldData?.name ?? "",
        ...item.fieldData,
      });
    }

    if (page.length < limit) break;
    offset += limit;
  }

  return items;
}

function buildDocId(collectionId, pageSlug) {
  // Slug sanitizado para ser chave segura no Firestore
  const safe = pageSlug.replace(/[^a-zA-Z0-9-_]/g, "_");
  return `${collectionId}_${safe}`;
}
