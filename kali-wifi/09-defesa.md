# 09 — Defesa (a parte mais importante) 🛡️

[[00-INDICE|⬅ Voltar ao índice]]

> Estudar ataque só vale a pena se vira **proteção**. Aqui está como blindar uma rede contra tudo que vimos.

## Checklist do roteador doméstico

- [ ] **Senha WiFi forte**: 16+ caracteres, aleatória, sem palavra de dicionário. (Mata [[05-quebra-senha]], [[08-pmkid]])
- [ ] **Use WPA3**; se não der, **WPA2-AES (CCMP)**. Nunca WEP/WPA/TKIP. ([[01-fundamentos-wifi]])
- [ ] **Desligue o WPS**. (Mata [[06-ataque-wps]])
- [ ] **Ative PMF / 802.11w** (Protected Management Frames). (Dificulta deauth e evil twin — [[07-deauth-evil-twin]])
- [ ] **Troque a senha de admin** padrão do roteador.
- [ ] **Atualize o firmware** do roteador regularmente.
- [ ] **Desligue gestão remota** (admin pela internet) se não usar.
- [ ] **Rede de visitantes** separada para IoT e convidados.
- [ ] **Esconder SSID ajuda pouco** — não é segurança real, mas reduz alvos casuais.
- [ ] **Filtro de MAC ajuda pouco** — MAC é facilmente clonável; use como camada extra, não como defesa principal.

## Para empresas

- **WPA2/WPA3-Enterprise (802.1X)** com RADIUS.
- **EAP-TLS** (certificado em vez de senha) — imune a phishing de senha.
- **WIDS/WIPS** para detectar APs falsos (evil twin) e deauth.
- Segmentação de rede (VLANs) e monitoramento.

## Como detectar ataques

| Sinal | Possível ataque |
|-------|-----------------|
| Desconexões frequentes e súbitas | Deauth flood |
| Dois APs com o mesmo SSID | Evil twin |
| Cliente desconhecido insistente | Tentativa de associação/WPS |
| Pico de tráfego de gerência | Deauth/disassoc |

Ferramentas defensivas: **Kismet** (detecta rogue AP), **nzyme**, logs do controlador WiFi.

> [!tip] Resumo de uma frase
> **WPA3 + senha longa aleatória + WPS desligado + firmware atualizado** derruba a grande maioria dos ataques deste material.
