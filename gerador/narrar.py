#!/usr/bin/env python3
"""Enem Acessivel - narra uma parte inteira em UM arquivo de audio com capitulos.

Mesmo desenho do boletim do GIN (validado no celular):
- Piper (voz pt_BR-faber-medium) roda como PROGRAMA SEPARADO; ffmpeg converte para Opus.
- Cada capitulo (questao) e narrado uma vez e guardado em cache pelo hash do texto:
  corrigir uma questao so narra de novo aquela questao.
- Se nada mudou na parte, reaproveita o audio ja publicado no Pages (nao narra nada).
- audio.json traz os capitulos (inicio/fim em segundos) para pular entre questoes.
Uso: python3 gerador/narrar.py <parte> [--so-texto]
Variaveis: PIPER_PY, VOZES_DIR, AUDIO_CACHE, DADOS (pasta dos dados, padrao: dados)."""
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import urllib.request
import wave
from datetime import datetime, timezone
from pathlib import Path

SITE = "https://techally96.github.io/enem-acessivel/dados/"
VOZ = "pt_BR-faber-medium"
PAUSA_S = 1.2          # silencio entre questoes
SILENCIO_FRASE = "0.35"  # silencio entre frases (fala mais pausada, para aprender)
VERSAO = "v1"          # mude para forcar nova narracao de tudo


def ler(caminho, padrao=None):
    return json.loads(caminho.read_text(encoding="utf-8")) if caminho.exists() else padrao


def baixar_publicado(parte, arquivo, destino):
    try:
        req = urllib.request.Request(SITE + f"{parte}/{arquivo}", headers={"User-Agent": "enem-acessivel"})
        with urllib.request.urlopen(req, timeout=120) as r:
            destino.write_bytes(r.read())
        return destino.stat().st_size > 0
    except Exception:
        return False


def sintetizar(piper_py, onnx, texto, wav):
    base = [piper_py, "-m", "piper", "-m", str(onnx), "-f", str(wav)]
    for extra in (["--sentence-silence", SILENCIO_FRASE], []):  # se a opcao nao existir, tenta sem
        r = subprocess.run(base + extra, input=texto, capture_output=True, text=True, timeout=900)
        if r.returncode == 0 and wav.exists() and wav.stat().st_size > 1000:
            return True
    print("   falha do Piper:", (r.stderr or "")[-300:])
    return False


def main(parte):
    pasta = Path(os.environ.get("DADOS", "dados")) / parte
    conteudo = ler(pasta / "conteudo.json")
    if not conteudo:
        raise SystemExit(f"{parte}: conteudo.json nao encontrado (rode montar_dados.py antes)")
    caps = conteudo["capitulos"]
    assinatura = hashlib.sha1((VERSAO + VOZ + SILENCIO_FRASE + "\n" + "\n".join(c["fala"] for c in caps))
                              .encode("utf-8")).hexdigest()[:12]
    arquivo = f"audio-{assinatura}.ogg"
    if "--so-texto" in sys.argv:
        total = sum(len(c["fala"]) for c in caps)
        print(f"{parte}: {len(caps)} capitulos | {total} caracteres (~{total / 14 / 60:.0f} min) | {arquivo}")
        return 0
    anterior = ler(pasta / "audio.json", {})
    destino = pasta / arquivo
    if anterior.get("assinatura") == assinatura and (destino.exists() or baixar_publicado(parte, arquivo, destino)):
        print(f"{parte}: sem mudanca, audio reaproveitado ({arquivo})")
        return 0
    if not anterior:
        publicado = Path(tempfile.gettempdir()) / f"{parte}-audio.json"
        if baixar_publicado(parte, "audio.json", publicado):
            anterior = ler(publicado, {})
            if anterior.get("assinatura") == assinatura and baixar_publicado(parte, arquivo, destino):
                (pasta / "audio.json").write_text(publicado.read_text(encoding="utf-8"), encoding="utf-8")
                print(f"{parte}: sem mudanca, audio publicado reaproveitado ({arquivo})")
                return 0
    piper_py = os.environ.get("PIPER_PY", sys.executable)
    vozes = Path(os.environ.get("VOZES_DIR", "vozes")).resolve()
    vozes.mkdir(parents=True, exist_ok=True)
    onnx = vozes / f"{VOZ}.onnx"
    if not onnx.exists():
        subprocess.run([piper_py, "-m", "piper.download_voices", VOZ], cwd=vozes, check=True)
    cache = Path(os.environ.get("AUDIO_CACHE", "audio-cache")) / parte
    cache.mkdir(parents=True, exist_ok=True)
    marcas, quadros, params, t, falhas, novas, usados = [], [], None, 0.0, 0, 0, set()
    with tempfile.TemporaryDirectory() as tmp:
        for n, c in enumerate(caps):
            chave = hashlib.sha1((VERSAO + VOZ + SILENCIO_FRASE + "\n" + c["fala"]).encode("utf-8")).hexdigest()[:16]
            item_ogg = cache / f"{chave}.ogg"
            usados.add(item_ogg.name)
            if not item_ogg.exists():
                novo_wav = Path(tmp) / "novo.wav"
                novo_wav.unlink(missing_ok=True)
                if not sintetizar(piper_py, onnx, c["fala"], novo_wav):
                    falhas += 1
                    continue
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(novo_wav), "-c:a", "libopus",
                                "-b:a", "48k", "-ac", "1", str(item_ogg)], check=True)
                novas += 1
                print(f"   {parte} [{n + 1}/{len(caps)}] {c['titulo'][:60]}", flush=True)
            wav = Path(tmp) / f"{n:03d}.wav"
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(item_ogg), "-ar", "22050",
                            "-ac", "1", "-c:a", "pcm_s16le", str(wav)], check=True)
            with wave.open(str(wav)) as w:
                params = params or w.getparams()
                dados = w.readframes(w.getnframes())
            wav.unlink()
            dur = len(dados) / (params.sampwidth * params.nchannels) / params.framerate
            marcas.append({"id": c["id"], "inicio": round(t, 2), "fim": round(t + dur, 2)})
            quadros.append(dados)
            quadros.append(b"\x00" * int(params.framerate * PAUSA_S) * params.sampwidth * params.nchannels)
            t += dur + PAUSA_S
        if not quadros:
            raise SystemExit(f"{parte}: nenhum capitulo narrado ({falhas} falhas)")
        junto = Path(tmp) / "parte.wav"
        with wave.open(str(junto), "wb") as w:
            w.setparams(params)
            w.writeframes(b"".join(quadros))
        quadros.clear()
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(junto), "-c:a", "libopus",
                        "-b:a", "32k", "-ac", "1", "-application", "voip", str(destino)], check=True)
    for velho in cache.glob("*.ogg"):
        if velho.name not in usados:
            velho.unlink()
    for velho in pasta.glob("audio-*.ogg"):
        if velho.name != arquivo:
            velho.unlink()
    (pasta / "audio.json").write_text(json.dumps({
        "parte": parte, "gerado": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "voz": VOZ, "arquivo": arquivo, "assinatura": assinatura, "duracao": round(t, 1),
        "bytes": destino.stat().st_size, "falhas": falhas, "capitulos": marcas,
    }, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{parte}: audio gerado | {t / 60:.1f} min | {destino.stat().st_size // 1024} KB | falhas {falhas} "
          f"| narrados {novas} novos, {len(marcas) - novas} do cache | {arquivo}")
    return 0 if not falhas else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
