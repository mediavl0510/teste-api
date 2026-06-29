# 08 — Ataque PMKID (clientless)

[[00-INDICE|⬅ Voltar ao índice]]

## A grande vantagem

O ataque **PMKID** (descoberto em 2018) não precisa de **nenhum cliente conectado** nem de capturar o handshake completo. Você pede direto ao AP um elemento (o **PMKID**, no primeiro quadro do handshake) e tenta quebrar offline.

- ✅ Não precisa esperar alguém conectar
- ✅ Não precisa fazer deauth
- ⚠️ Só funciona em APs/roteadores que expõem o PMKID (nem todos)

## Capturar o PMKID

```bash
# Ferramenta moderna (pacote hcxdumptool)
sudo hcxdumptool -i wlan0mon -o captura.pcapng
```

Deixe rodando um tempo. Pare com `Ctrl+C`.

> Em versões recentes do hcxdumptool a sintaxe mudou; confira `hcxdumptool --help` (algumas usam `-w` e filtros por `--bpf`/`--enable_status`).

## Converter para hashcat

```bash
hcxpcapngtool -o pmkid.hc22000 captura.pcapng
```

## Quebrar

```bash
hashcat -m 22000 pmkid.hc22000 /usr/share/wordlists/rockyou.txt
hashcat -m 22000 pmkid.hc22000 --show
```

Mesmo modo **22000** do handshake — o hashcat trata os dois juntos.

> [!note] Defesa
> Novamente: **senha forte** torna o PMKID inútil (não há o que adivinhar) e o **WPA3** muda o esquema e mitiga o ataque. Ver [[09-defesa]].
