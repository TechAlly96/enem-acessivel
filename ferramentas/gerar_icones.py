#!/usr/bin/env python3
"""Gera os icones do app (requer Pillow; rodar uma vez, os PNG ficam no repositorio)."""
from pathlib import Path
from PIL import Image, ImageDraw

APP = Path(__file__).resolve().parent.parent / "app"
FUNDO, AMARELO = (7, 18, 38), (255, 210, 63)


def desenhar(tam, margem):
    img = Image.new("RGB", (tam, tam), FUNDO)
    d = ImageDraw.Draw(img)
    s = tam / 512
    m = margem * s
    # fone de ouvido: arco + duas conchas (simbolo de ouvir)
    d.arc([110 * s + m * .3, 120 * s + m * .3, 402 * s - m * .3, 412 * s - m * .3], 180, 360, fill=AMARELO, width=int(34 * s))
    for x in (110, 338):
        d.rounded_rectangle([x * s + m * .3 * (1 if x < 200 else -1), 250 * s, (x + 64) * s + m * .3 * (1 if x < 200 else -1), 380 * s],
                            radius=int(22 * s), fill=AMARELO)
    # livro aberto no centro (estudo)
    d.polygon([(256 * s, 300 * s), (190 * s, 278 * s), (190 * s, 360 * s), (256 * s, 382 * s)], fill=(255, 255, 255))
    d.polygon([(256 * s, 300 * s), (322 * s, 278 * s), (322 * s, 360 * s), (256 * s, 382 * s)], fill=(220, 230, 245))
    return img


desenhar(192, 0).save(APP / "icone-192.png")
desenhar(512, 0).save(APP / "icone-512.png")
desenhar(512, 70).save(APP / "icone-maskable-512.png")
print("icones gerados")
