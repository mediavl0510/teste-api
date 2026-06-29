# 02 — Preparação: adaptador e modo monitor

[[00-INDICE|⬅ Voltar ao índice]]

## Placa wireless compatível

Você precisa de um adaptador que suporte **modo monitor** e **injeção de pacotes**. A placa interna do notebook geralmente **não** serve bem.

Chipsets populares para auditoria:
- **Atheros AR9271** (ex.: TP-Link TL-WN722N **v1**) — só 2.4 GHz, clássico p/ estudo
- **Realtek RTL8812AU** — 2.4 + 5 GHz (precisa instalar driver)
- **Ralink RT3070 / MT7612U**

> [!warning] Cuidado com versões
> A TL-WN722N **v2/v3** mudou de chipset e **não** funciona como a v1. Confira a versão antes de comprar.

## Ver as interfaces de rede

```bash
# Lista interfaces wireless
iwconfig
ip link

# Ferramenta da suíte aircrack
airmon-ng
```

Sua placa vai aparecer como algo tipo `wlan0`.

## Matar processos que atrapalham

O `NetworkManager` e o `wpa_supplicant` brigam com o modo monitor:

```bash
sudo airmon-ng check kill
```

## Entrar e sair do modo monitor

```bash
# Ativar modo monitor (vira wlan0mon ou wlan0 em modo monitor)
sudo airmon-ng start wlan0

# Conferir
iwconfig            # deve mostrar "Mode:Monitor"

# Desativar e voltar ao normal
sudo airmon-ng stop wlan0mon
sudo systemctl restart NetworkManager
```

### Modo manual (sem airmon-ng)

```bash
sudo ip link set wlan0 down
sudo iw wlan0 set monitor control
sudo ip link set wlan0 up
```

> [!tip] MAC aleatório (privacidade nos testes)
> ```bash
> sudo ip link set wlan0 down
> sudo macchanger -r wlan0
> sudo ip link set wlan0 up
> ```

## Atualizar o Kali

```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y aircrack-ng hashcat hcxdumptool hcxtools reaver bully wireshark
```
