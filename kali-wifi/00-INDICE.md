# 📡 Kali Linux + Auditoria de Redes WiFi

> [!warning] Leia antes de tudo
> Este material é **educacional** e serve para **testes de segurança AUTORIZADOS**: sua própria rede, um laboratório montado por você (ex.: roteador antigo só para estudo) ou um contrato formal de pentest.
>
> Acessar, interceptar ou atacar redes/dispositivos de terceiros **sem autorização por escrito é crime** (no Brasil, Lei 12.737/2012 — “Lei Carolina Dieckmann” — e Marco Civil da Internet). Estude para **defender**, não para invadir.

---

## 🗂️ Índice das notas

1. [[01-fundamentos-wifi]] — Como o WiFi funciona (bandas, canais, criptografia)
2. [[02-preparacao-adaptador]] — Placa wireless, modo monitor, setup do Kali
3. [[03-reconhecimento-scan]] — Descobrir redes e dispositivos (airodump-ng)
4. [[04-captura-handshake]] — Capturar o handshake WPA/WPA2
5. [[05-quebra-senha]] — Quebrar a senha (aircrack-ng, hashcat, wordlists)
6. [[06-ataque-wps]] — Ataques ao WPS (reaver, bully)
7. [[07-deauth-evil-twin]] — Deautenticação e Evil Twin / Rogue AP
8. [[08-pmkid]] — Ataque PMKID (sem precisar de cliente)
9. [[09-defesa]] — Como se proteger (o mais importante)
10. [[10-referencia-comandos]] — Cola rápida de comandos

---

## 🔁 Fluxo geral de uma auditoria WiFi

```
1. Colocar a placa em modo monitor   (airmon-ng)
2. Escanear o ambiente               (airodump-ng)
3. Focar no alvo autorizado          (canal + BSSID)
4. Capturar handshake ou PMKID
5. Quebrar offline                   (aircrack-ng / hashcat)
6. Documentar + recomendar correções
```

> [!tip] Como ler no iPhone
> - **Obsidian**: copie a pasta `kali-wifi` para o seu cofre (vault). Os links `[[...]]` ficam clicáveis.
> - **Sem Obsidian**: dá pra ler tudo direto pelo app do **GitHub** ou em qualquer leitor de Markdown (ex.: app “MWeb”, “Taio”).

---
*Notas de estudo — uso pessoal e autorizado.*
