# Diário de desenvolvimento — Enem Acessível

Padrão: uma instrução de terminal por vez; teste e envio sempre encadeados com `&&` (lição do GIN, sprint-048).
Projeto em `~/projetos/enem-acessivel` (Termux nativo). Repositório público TechAlly96/enem-acessivel.

sprint-000: chore(repo) - (06/11/2026) repositório público criado com `gh repo create --add-readme --clone`
(commit 616ee1e), e-mail noreply e nome configurados só neste repositório. SPRINT 0 CONCLUÍDA.
FIM-sprint-000

sprint-001: feat(base) - (06/11/2026) base do projeto, reaproveitando o desenho validado do GIN:
- conteudo/: 9 partes em Markdown (apostila "Treinamento Completo para o Enem"), 280 questões
  (270 + as duas versões de língua estrangeira) conferidas automaticamente contra o gabarito do Inep: 0 divergências.
- gerador/montar_dados.py: Markdown -> JSON (um capítulo por "## "), texto falado sem marcação,
  milhares "1 800" -> "1800" para a voz. Biblioteca padrão.
- gerador/narrar.py: adaptado do boletim.py do GIN. Um .ogg por parte com capítulos; cache por questão
  (hash do texto); reaproveita o áudio publicado se nada mudou; --sentence-silence 0.35 (com reserva sem a opção).
  Testado com voz simulada: geração, capítulos, reaproveitamento e estimativa (~4 h de áudio no total).
- app/: PWA sem dependências. Media Session (tela apagada, tela de bloqueio, fone), continuar de onde parou,
  velocidade 0,75 a 1,75, download por parte para uso offline, service worker com Range (do GIN),
  reserva com a voz do celular enquanto o áudio não existe, alto contraste claro/escuro, texto ampliável,
  alvos de toque de 56 px, link "pular para o conteúdo", anúncios para leitor de tela.
  Testado no Chromium emulando Pixel 7: tocar questão, próxima, continuar de onde parei, reserva sem áudio.
- .github/workflows/publicar.yml: narra só o que mudou e publica no Pages (ffmpeg estático e Piper em cache,
  cache de áudio salvo mesmo se a narração parar no meio, publicação com 2 tentativas — lições do GIN 047 e 051).
PENDENTE: primeira narração real no GitHub; ativar Pages em modo workflow; testar com TalkBack e tela apagada.
FIM-sprint-001
