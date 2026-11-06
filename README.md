# Enem Acessível

Estudo para o Enem **em áudio**, pensado para pessoas com deficiência visual.
100% gratuito e de código aberto.

**Abrir o app:** https://techally96.github.io/enem-acessivel/

## O que o app faz

- Explica cada questão das provas do Enem em linguagem simples: a história da questão,
  a teoria, a resolução passo a passo e a resposta, conferida no gabarito oficial do Inep.
- Botão grande **Ouvir** em cada questão e **Ouvir a parte toda**.
- O áudio **continua com a tela apagada e em segundo plano**, com controles na tela de
  bloqueio e no fone Bluetooth (questão anterior/próxima, voltar e avançar 15 segundos).
- **Continua de onde parou**, velocidade ajustável e **download para ouvir sem internet**.
- Funciona com TalkBack e VoiceOver; alto contraste e texto ampliável.

## Como funciona

| Pasta | Conteúdo |
|---|---|
| `conteudo/` | As explicações em Markdown, escritas para serem ouvidas (fonte da verdade) |
| `gerador/montar_dados.py` | Transforma o conteúdo em JSON para o app |
| `gerador/narrar.py` | Narra cada parte com a voz Piper `pt_BR-faber-medium` (um áudio com capítulos por parte) |
| `app/` | PWA sem dependências (HTML, CSS e JavaScript) |
| `.github/workflows/publicar.yml` | Narra só o que mudou e publica no GitHub Pages |

Para corrigir ou acrescentar uma questão, edite o arquivo em `conteudo/` e envie: o GitHub
narra de novo só aquela questão e publica sozinho.

## Conteúdo atual

Provas de 2023 (primeiro e segundo dia) e de 2024 (primeiro dia), com estratégia de prova,
guia de redação e resumo de véspera.

## Licenças

- Código: MIT (arquivo `LICENSE`).
- Explicações em `conteudo/`: Creative Commons BY-SA 4.0.
- As questões são do Inep. Textos de terceiros citados nas provas (poemas, letras de música,
  trechos de livros) não são reproduzidos: são contados com outras palavras.
- Voz: Piper (código aberto), modelo `pt_BR-faber-medium`.
