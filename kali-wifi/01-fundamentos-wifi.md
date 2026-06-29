# 01 — Fundamentos de WiFi

[[00-INDICE|⬅ Voltar ao índice]]

## Bandas e canais

| Banda | Faixa | Características |
|------|-------|----------------|
| 2.4 GHz | canais 1–14 | Mais alcance, atravessa parede melhor, mais lotada/interferência |
| 5 GHz | muitos canais | Mais rápida, menos alcance, menos interferência |
| 6 GHz (WiFi 6E) | novíssima | Pouco usada ainda; exige hardware recente |

> [!note] Canais que não se sobrepõem (2.4 GHz)
> No Brasil/EUA use **1, 6 e 11**. Eles não interferem entre si.

## Tipos de criptografia (do pior pro melhor)

| Padrão | Segurança | Observação |
|--------|-----------|------------|
| **Aberta** (sem senha) | ❌ Nenhuma | Tráfego pode ser lido por qualquer um |
| **WEP** | ❌ Quebrada | Obsoleta, quebra em minutos. Nunca use |
| **WPA** | ⚠️ Fraca | Antiga, evite |
| **WPA2-PSK** | ✅ Boa | Padrão da maioria das casas. Vulnerável a ataque de dicionário se a senha for fraca |
| **WPA3** | ✅✅ Melhor | Usa SAE/Dragonfly, resiste a ataque offline. Recomendado |

## Conceitos que aparecem o tempo todo

- **SSID** — o “nome” da rede (ex.: `CASA_DO_JOAO`).
- **BSSID** — o endereço MAC do roteador/AP (ex.: `AA:BB:CC:11:22:33`). É o identificador único.
- **AP (Access Point)** — o ponto de acesso (roteador).
- **Cliente / Station** — dispositivo conectado (celular, notebook).
- **Handshake (4-way)** — a “negociação” de 4 mensagens entre cliente e AP ao conectar. É o que capturamos no WPA2 para tentar quebrar a senha **offline**.
- **Modo monitor** — estado da placa wireless que permite “escutar” todo o tráfego do ar, não só o destinado a você.
- **Canal (channel)** — a placa só escuta um canal por vez; por isso travamos no canal do alvo.

> [!important] A senha NÃO trafega pelo ar
> No WPA2 você não “sniffa” a senha diretamente. Você captura o **handshake** (uma prova matemática derivada da senha) e tenta adivinhar a senha **offline**, testando palavras de uma lista. Por isso **senha forte = impossível na prática**.
