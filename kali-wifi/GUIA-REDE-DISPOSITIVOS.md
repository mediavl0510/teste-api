# 🌐 Analisar a Rede e os Dispositivos com Kali — Do Zero

> [!warning] ⚖️ MESMA REGRA DE SEMPRE
> Só faça isso na **SUA rede** ou num **laboratório seu**. Escanear a rede ou os aparelhos **dos outros sem permissão é CRIME** (Lei 12.737/2012). Aqui você aprende a "olhar pra dentro" da sua própria casa digital pra entender e proteger.

> Este arquivo é a continuação do guia de WiFi. Lá você aprende a **entrar/auditar o WiFi**. Aqui você aprende, **já dentro da rede**, a ver **quem está conectado e o que cada aparelho tem aberto**.

---

## 🍼 Entendendo a ideia (versão bebê)

Imagine que a sua rede é um **prédio**. Cada aparelho (celular, TV, notebook, câmera) é um **apartamento**. Cada apartamento tem **portas** (chamadas "portas de rede"). Algumas portas estão abertas (tem serviço atrás, tipo um site, um compartilhamento de arquivo) e outras fechadas.

Analisar a rede é:
1. **Fazer a chamada (lista de presença)** → quem são os apartamentos? (descobrir os aparelhos)
2. **Bater nas portas de cada apartamento** → quais portas estão abertas? (escanear portas)
3. **Perguntar "quem mora aí?"** → qual programa/serviço está atrás de cada porta? (identificar serviços)

### Palavras novas (decora essas 4)

| Palavra | Versão bebê |
|---------|-------------|
| **IP** | O "número da casa" de cada aparelho na rede. Ex.: `192.168.0.15`. |
| **MAC** | O "RG" do aparelho (não muda fácil). Ex.: `AA:BB:CC:11:22:33`. |
| **Porta** | Uma "portinha" numerada no aparelho. Cada serviço usa uma (ex.: site = porta 80/443). |
| **Serviço** | O programa atrás da porta (servidor de site, impressora, câmera, etc.). |

> [!note] Como descobrir o "endereço" da sua rede
> No Kali, digite:
> ```bash
> ip a
> ```
> Procure algo tipo `192.168.0.10/24`. Isso quer dizer que sua rede é a **`192.168.0.0/24`** (todos os aparelhos vão de `192.168.0.1` até `192.168.0.254`). Guarde isso.

---

## 🔢 Passo 1 — Descobrir QUEM está na rede (lista de presença)

### Jeito mais fácil: netdiscover
```bash
sudo netdiscover -r 192.168.0.0/24
```
Ele mostra uma lista com: **IP**, **MAC** e às vezes o **fabricante** do aparelho (ex.: "Samsung", "Apple", "TP-Link"). Assim você já adivinha o que é cada coisa.

### Jeito clássico: nmap (ping scan)
```bash
sudo nmap -sn 192.168.0.0/24
```
- `-sn` = só "quem está vivo?", sem bater nas portas ainda.
- Lista todos os aparelhos ligados.

### Vendo a tabela ARP (quem o seu Kali já "conhece")
```bash
arp -a
```

> [!tip] 🕵️ Descobrir aparelho intruso
> Rode o `netdiscover`, depois desligue um aparelho seu e rode de novo. O que sobrou e você **não reconhece** pode ser um xereta na sua rede. Pelo fabricante (MAC) dá pra desconfiar.

---

## 🚪 Passo 2 — Ver as PORTAS abertas de um aparelho

Pegue o IP de um aparelho da lista (ex.: `192.168.0.15`) e escaneie:

```bash
# Escaneamento básico de portas
nmap 192.168.0.15
```

### Escaneamento mais completo (recomendado)
```bash
sudo nmap -sV -O 192.168.0.15
```
- `-sV` = descobre **qual serviço e versão** está atrás de cada porta.
- `-O` = tenta adivinhar o **sistema operacional** (Windows? Android? Linux?).

### Escanear a rede inteira de uma vez
```bash
nmap 192.168.0.0/24
```

### Portas mais comuns que você vai ver

| Porta | Serviço | Versão bebê |
|-------|---------|-------------|
| **22** | SSH | Acesso remoto por terminal |
| **80** | HTTP | Site (sem cadeado) |
| **443** | HTTPS | Site com cadeado 🔒 |
| **53** | DNS | "Lista telefônica" da internet |
| **445 / 139** | SMB | Compartilhamento de arquivos do Windows |
| **3389** | RDP | Área de trabalho remota do Windows |
| **8080 / 8443** | Web alt. | Painel de roteador, câmera, etc. |
| **23** | Telnet | Acesso remoto **inseguro** (sinal de aparelho antigo/vulnerável) |

> [!warning] ⚠️ Vá com calma
> O `nmap` "bate" em muitas portas rapidinho. Em rede dos outros isso é detectado e é ilegal. Na sua, tranquilo. Para ir mais devagar, existe `-T2` (ex.: `nmap -T2 192.168.0.15`).

---

## 🔎 Passo 3 — Investigar um serviço encontrado

Achou um site/painel na porta 80 ou 8080? Veja o que é:

```bash
# Ver os "cabeçalhos" do site (que servidor é, etc.)
curl -I http://192.168.0.1

# Abrir no navegador do Kali
firefox http://192.168.0.1
```

Muitas vezes o `192.168.0.1` é o **painel do seu roteador**. É lá que você muda senha, desliga WPS, etc. (veja a parte de defesa).

### Ferramentas que aprofundam (só pra conhecer)
| Ferramenta | Pra que serve |
|------------|---------------|
| **whatweb** | Diz qual tecnologia um site usa (`whatweb http://192.168.0.1`) |
| **nikto** | Procura problemas conhecidos num servidor web |
| **enum4linux** | Investiga compartilhamentos do Windows (porta 445) |
| **smbclient** | Lista/acessa pastas compartilhadas |

```bash
whatweb http://192.168.0.1
```

---

## 👀 Passo 4 — Olhar o tráfego da rede passando (com cuidado)

Lembrando: na maioria dos sites o conteúdo está **criptografado** (HTTPS 🔒), então você vê que passou, mas não lê. Isso é a segurança funcionando.

### Ver os pacotes de forma simples (terminal)
```bash
sudo tcpdump -i wlan0
```
Mostra os pacotes "voando". Aperte `Ctrl + C` pra parar.

### Ver de forma bonita (tela gráfica)
```bash
sudo wireshark
```
Escolha sua placa de rede e veja tudo. Útil pra **aprender** como os aparelhos conversam.

> [!note] Por que às vezes só vejo MEU tráfego?
> Numa rede com switch/WiFi moderno, cada aparelho só recebe o que é dele. Pra ver o dos outros o atacante teria que fazer um truque chamado **ARP spoofing / MITM** — e isso só é legal no SEU laboratório. Em redes WiFi protegidas com criptografia recente, isso fica bem mais difícil (de novo: a segurança funcionando).

---

## 🤖 Passo 5 — Ferramentas que fazem tudo junto (pra iniciante)

| Ferramenta | O que faz | Comando |
|------------|-----------|---------|
| **nmap** | O canivete suíço: descobre aparelhos, portas e serviços | `nmap 192.168.0.0/24` |
| **Zenmap** | O nmap com tela gráfica (mais fácil de ver) | `zenmap` |
| **netdiscover** | Lista rápida de quem está na rede | `sudo netdiscover` |
| **arp-scan** | Outra forma de listar aparelhos | `sudo arp-scan --localnet` |
| **Wireshark** | Raio-X do tráfego | `sudo wireshark` |

---

## 🛡️ Defesa — proteger seus aparelhos (o mais importante)

Achou portas abertas demais? Hora de fechar a casa:

- ✅ **Mude a senha de admin do roteador** (entrando em `192.168.0.1` ou `192.168.1.1`).
- ✅ **Atualize os aparelhos** (celular, TV, câmera, roteador) — versões antigas têm buracos.
- ✅ **Desligue serviços que não usa** (compartilhamento de arquivo, acesso remoto, Telnet).
- ✅ **Câmeras e babás eletrônicas**: troque a senha padrão! É o alvo n°1 de invasores.
- ✅ **Crie uma rede de visitantes** separada para aparelhos "inteligentes" (IoT).
- ✅ **Veja a lista de aparelhos** conectados no painel do roteador de vez em quando — se tiver alguém estranho, troque a senha do WiFi.
- ✅ **Use HTTPS e VPN** em redes públicas.

> [!tip] 🎯 Resumo numa frase
> **Descobrir aparelhos (netdiscover) → ver portas (nmap) → fechar o que não usa + atualizar tudo + trocar senhas padrão.** Isso já te deixa na frente de 99% dos riscos domésticos.

---

## 🧾 Cola rápida (rede e dispositivos)

```bash
# --- DESCOBRIR MINHA REDE ---
ip a                                   # ver meu IP e a faixa da rede

# --- QUEM ESTÁ NA REDE ---
sudo netdiscover -r 192.168.0.0/24     # lista aparelhos (IP, MAC, fabricante)
sudo nmap -sn 192.168.0.0/24           # "quem está vivo?"
sudo arp-scan --localnet               # outra forma de listar

# --- PORTAS E SERVIÇOS DE UM APARELHO ---
nmap 192.168.0.15                      # portas básicas
sudo nmap -sV -O 192.168.0.15          # serviços + sistema operacional
nmap 192.168.0.0/24                    # rede inteira

# --- INVESTIGAR UM SITE/PAINEL ---
curl -I http://192.168.0.1             # cabeçalhos
whatweb http://192.168.0.1             # tecnologias usadas

# --- OLHAR O TRÁFEGO ---
sudo tcpdump -i wlan0                  # simples (terminal)
sudo wireshark                         # bonito (gráfico)
```

---

*Material de estudo pessoal. Use só na sua própria rede ou laboratório autorizado. Analisar serve pra você fechar as portas e se defender melhor. 🛡️*
