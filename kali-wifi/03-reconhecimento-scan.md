# 03 — Reconhecimento (scan do ambiente)

[[00-INDICE|⬅ Voltar ao índice]]

Objetivo: descobrir as redes ao redor, em quais canais estão, qual criptografia usam e quais clientes estão conectados.

## Escanear tudo

```bash
sudo airodump-ng wlan0mon
```

### Lendo a tela do airodump-ng

**Parte de cima (APs / redes):**

| Coluna | Significado |
|--------|-------------|
| **BSSID** | MAC do roteador |
| **PWR** | Sinal (mais perto de 0 = mais forte; -30 ótimo, -90 fraco) |
| **CH** | Canal |
| **ENC / CIPHER / AUTH** | Criptografia (WPA2, CCMP, PSK…) |
| **ESSID** | Nome da rede |
| **#Data** | Pacotes de dados capturados |

**Parte de baixo (clientes):**

| Coluna | Significado |
|--------|-------------|
| **STATION** | MAC do dispositivo conectado |
| **BSSID** | A qual AP ele está ligado (ou `not associated`) |

## Focar só no alvo (autorizado!)

Depois de achar o BSSID e o canal do **seu** alvo, trave neles e salve a captura:

```bash
sudo airodump-ng \
  --bssid AA:BB:CC:11:22:33 \
  --channel 6 \
  --write captura_alvo \
  wlan0mon
```

- `--bssid` — só o roteador alvo
- `--channel` — trava no canal (essencial)
- `--write` — salva arquivos `captura_alvo-01.cap`, `.csv` etc.

> [!note] Filtrar por banda
> ```bash
> sudo airodump-ng --band a wlan0mon   # só 5 GHz
> sudo airodump-ng --band bg wlan0mon  # só 2.4 GHz
> ```

> [!tip] Alternativas visuais
> - `wash -i wlan0mon` — lista APs com **WPS** ativo
> - **Kismet** — scanner com interface web, ótimo para mapear
> - **Wireshark** — análise profunda de cada pacote
