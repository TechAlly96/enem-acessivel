#!/usr/bin/env python3
"""Enem Acessivel - transforma o conteudo (conteudo/*.md) nos dados do app (JSON).

Fonte da verdade: os arquivos Markdown em conteudo/, escritos para serem OUVIDOS.
Cada titulo "## " vira um capitulo (uma questao ou um topico); o texto antes do
primeiro "## " vira o capitulo de abertura da parte.
Saida: <saida>/partes.json e <saida>/<parte>/conteudo.json
Somente biblioteca padrao (roda no Termux e no GitHub).
Uso: python3 gerador/montar_dados.py [pasta_de_saida]   (padrao: dados)"""
import html
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CONTEUDO = RAIZ / "conteudo"

# Organizacao das partes no app: dia da prova e area (para filtros e "ouvir tudo")
INFO = {
    "00_inicio": ("geral", "Apresentação e como estudar"),
    "01_linguagens_2023": ("dia1", "Linguagens 2023"),
    "02_humanas_2023": ("dia1", "Humanas 2023"),
    "03_natureza_2023": ("dia2", "Natureza 2023"),
    "04_matematica_2023": ("dia2", "Matemática 2023"),
    "05_linguagens_2024": ("dia1", "Linguagens 2024"),
    "06_humanas_2024": ("dia1", "Humanas 2024"),
    "07_estrategia_redacao": ("geral", "Estratégia e redação"),
    "08_vespera": ("geral", "Resumo de véspera"),
}


def inline_html(texto):
    """Escapa o texto e converte **negrito** (unica marcacao usada no conteudo)."""
    seguro = html.escape(texto, quote=False)
    return re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", seguro)


def texto_falado(texto):
    """Texto que vai para a voz: sem marcacao, sem espacos repetidos."""
    texto = texto.replace("**", "")
    return re.sub(r"\s+", " ", texto).strip()


def blocos(linhas):
    """Agrupa linhas em paragrafos (separados por linha vazia ou ---)."""
    atual, saida = [], []
    for linha in linhas:
        if not linha.strip() or linha.strip() == "---":
            if atual:
                saida.append(" ".join(atual))
                atual = []
            continue
        atual.append(linha.strip())
    if atual:
        saida.append(" ".join(atual))
    return saida


def capitulo(cid, titulo, paragrafos):
    resposta = None
    for p in paragrafos:
        m = re.search(r"Resposta: letra ([A-E])", p)
        if m:
            resposta = m.group(1)
    if any("anulada" in p.lower() and "inep" in p.lower() for p in paragrafos):
        resposta = "anulada"
    frases = [titulo] + [texto_falado(p) for p in paragrafos]
    fala = " ".join(f if f.endswith((".", "!", "?", ":")) else f + "." for f in frases)
    # "1 800" e "500 000" (separador de milhar com espaco) viram 1800 e 500000 para a voz ler certo
    fala = re.sub(r"\b(\d{1,3})((?: \d{3})+)\b", lambda m: m.group(1) + m.group(2).replace(" ", ""), fala)
    return {
        "id": cid,
        "titulo": titulo,
        "html": "".join(f"<p>{inline_html(p)}</p>" for p in paragrafos),
        "fala": fala,
        "resposta": resposta,
    }


def ler_parte(arquivo):
    linhas = arquivo.read_text(encoding="utf-8").splitlines()
    titulo_parte = next(l[2:].strip() for l in linhas if l.startswith("# "))
    caps, cab, corpo, n = [], None, [], 0

    def fechar():
        nonlocal n
        if cab is None:
            if blocos(corpo):
                caps.append(capitulo("c00", "Abertura", blocos(corpo)))
        else:
            n += 1
            caps.append(capitulo(f"c{n:02d}", cab, blocos(corpo)))

    for linha in linhas:
        if linha.startswith("# "):
            continue
        if linha.startswith("## "):
            fechar()
            cab, corpo = linha[3:].strip(), []
        else:
            corpo.append(linha)
    fechar()
    # Anuncio da parte no inicio do audio: no modo guiado o app passa sozinho
    # de uma parte para a outra, e o aluno precisa ouvir onde esta.
    if caps:
        anuncio = titulo_parte if titulo_parte.endswith((".", "!", "?")) else titulo_parte + "."
        caps[0]["fala"] = anuncio + " " + caps[0]["fala"]
    return titulo_parte, caps


def main(saida):
    saida = Path(saida)
    saida.mkdir(parents=True, exist_ok=True)
    partes = []
    for arquivo in sorted(CONTEUDO.glob("*.md")):
        pid = arquivo.stem
        titulo, caps = ler_parte(arquivo)
        if pid in INFO:
            dia, curto = INFO[pid]
        elif pid[:1] in "12345":  # curso completo: 1x Linguagens, 2x Humanas, 3x Natureza, 4x Matematica, 5x Redacao
            dia, curto = "curso", re.sub(r"^Curso, m[óo]dulo \d+\.\s*", "", titulo)
        else:
            dia, curto = "geral", titulo
        questoes = sum(1 for c in caps if c["resposta"]) if dia != "curso" else 0
        aulas = sum(1 for c in caps if c["titulo"].startswith("Aula "))
        pasta = saida / pid
        pasta.mkdir(exist_ok=True)
        (pasta / "conteudo.json").write_text(json.dumps(
            {"id": pid, "titulo": titulo, "curto": curto, "dia": dia, "capitulos": caps},
            ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        partes.append({"id": pid, "titulo": titulo, "curto": curto, "dia": dia,
                       "capitulos": len(caps), "questoes": questoes, "aulas": aulas})
        print(f"{pid}: {len(caps)} capitulos, {questoes} questoes, {aulas} aulas")
    (saida / "partes.json").write_text(json.dumps(partes, ensure_ascii=False, separators=(",", ":")),
                                       encoding="utf-8")
    print(f"Total: {len(partes)} partes, {sum(p['questoes'] for p in partes)} questoes")
    return 0


def duracoes(saida):
    """Depois da narracao: copia a duracao de cada audio.json para partes.json (mostrada no app)."""
    saida = Path(saida)
    partes = json.loads((saida / "partes.json").read_text(encoding="utf-8"))
    for p in partes:
        info = saida / p["id"] / "audio.json"
        if info.exists():
            p["duracao"] = json.loads(info.read_text(encoding="utf-8"))["duracao"]
    (saida / "partes.json").write_text(json.dumps(partes, ensure_ascii=False, separators=(",", ":")),
                                       encoding="utf-8")
    total = sum(p.get("duracao", 0) for p in partes)
    print(f"Audio total: {total / 3600:.1f} h em {sum(1 for p in partes if 'duracao' in p)} de {len(partes)} partes")
    return 0


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    pasta = args[0] if args else "dados"
    sys.exit(duracoes(pasta) if "--duracoes" in sys.argv else main(pasta))
