const { onRequest } = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
const OpenAI = require("openai");

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
      return res.status(500).json({ error: "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" });
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
              "Você é Nora, uma IA acolhedora do Ouvido Anônimo. Fale em português, com empatia, e jamais faça diagnóstico médico. Sugira ajuda profissional se detectar risco."
          },
          ...history.slice(-10),
          { role: "user", content: userMessage }
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
