# 07 — Deauth, Evil Twin e Rogue AP

[[00-INDICE|⬅ Voltar ao índice]]

> [!warning] Alto impacto
> Estas técnicas afetam diretamente os usuários (derrubam conexão, enganam dispositivos). Use **somente** em laboratório próprio ou pentest contratado.

## Deautenticação (deauth)

Envia pacotes de “desconecte-se”. O 802.11 antigo não autentica esses quadros, então o cliente obedece.

```bash
# Derrubar um cliente específico
sudo aireplay-ng -0 5 -a AA:BB:CC:11:22:33 -c 99:88:77:66:55:44 wlan0mon

# Derrubar todos do AP (broadcast) — isso é um DoS, cuidado
sudo aireplay-ng -0 0 -a AA:BB:CC:11:22:33 wlan0mon
```

Usos legítimos no estudo: **forçar handshake** ([[04-captura-handshake]]) ou testar resiliência da rede.

> [!note] Defesa contra deauth
> O recurso **802.11w (PMF — Protected Management Frames)** assina os quadros de gerência e bloqueia deauth forjado. WPA3 exige PMF.

## Evil Twin / Rogue AP

Conceito: criar um AP **falso** com o mesmo SSID do legítimo. A vítima conecta achando que é a rede real, e você captura credenciais por um **portal cativo** falso (página de “digite a senha do WiFi”).

Ferramentas que automatizam:

| Ferramenta | O que faz |
|------------|-----------|
| **wifiphisher** | Evil twin + portal de phishing automatizado |
| **airgeddon** | Menu completo (evil twin, deauth, handshake, WPS…) |
| **hostapd-wpe** | AP malicioso para testar WPA-Enterprise (captura credenciais RADIUS) |
| **eaphammer** | Ataques a redes WPA2-Enterprise |

```bash
sudo apt install -y airgeddon
sudo airgeddon
```

### Por que funciona
- Dispositivos lembram redes e **reconectam automaticamente** ao SSID conhecido.
- Com deauth na rede real + sinal mais forte do falso, a vítima migra.
- O portal cativo pede a senha — e o usuário digita.

> [!important] Lição de defesa
> - Não conectar em WiFi aberto sem **VPN**.
> - Desconfiar de portais pedindo a senha do WiFi.
> - Usar **WPA3 + PMF**, que dificulta o deauth que viabiliza o evil twin.
> - Em empresas: **certificado** no WPA2-Enterprise (EAP-TLS) em vez de só usuário/senha.
