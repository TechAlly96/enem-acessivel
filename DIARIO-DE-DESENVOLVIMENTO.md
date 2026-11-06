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

sprint-002: feat(curso) - (06/11/2026) início do CURSO COMPLETO, do zero, cobrindo todas as matérias do Enem.
- PLANO-DO-CURSO.md: 29 módulos baseados na Matriz de Referência do Enem (Inep), padrão de aula e numeração.
- Módulo 11 "Ler e entender qualquer texto": abertura + 7 aulas com exercício rápido e treino final.
- montar_dados.py: arquivos 1x-4x viram grupo "curso" (título curto tirado do "# Curso, módulo N."), contagem de aulas.
- app.js: grupo "Curso completo: aprenda do zero" na tela inicial, mostrando o número de aulas.
FIM-sprint-002

sprint-003: feat(curso) - (06/11/2026) módulo 41 "Matemática 1: números, operações, frações e potências":
abertura + 8 aulas (valor posicional, quatro operações e ordem das contas, negativos, frações, decimais,
potências e notação científica, raízes, unidades de medida), cada uma com exercício rápido e ligações
com as questões resolvidas da prova de 2023.
FIM-sprint-003

sprint-003 (resultado): narração incremental validada no GitHub — só o módulo 41 foi narrado (13,8 min, 0 falhas);
as outras 10 partes reaproveitaram o áudio publicado. Total: 4,4 h em 11 partes, 58,1 MB.
Primeira narração completa (sprint-001): 4,0 h em 8,5 min, 9 partes, 0 falhas, 52,3 MB.

sprint-004: feat(curso) - (06/11/2026) módulo 12 "Funções da linguagem, figuras de linguagem e coesão":
abertura + 8 aulas (elementos da comunicação, as seis funções, figuras de comparação, de intensidade e
oposição, de som e repetição, coesão por retomada, conectivos), ligadas às questões resolvidas de 2023 e 2024.
FIM-sprint-004

sprint-005: feat(curso) - (06/11/2026) PRIORIDADE: módulos do 1º dia antes da prova de 08/11.
Módulo 26 "Filosofia": abertura + 8 aulas em linha do tempo (pré-socráticos e sofistas; Sócrates e Platão;
Aristóteles; fé e razão na Idade Média; racionalistas e empiristas; Maquiavel, contratualistas e Iluminismo;
Kant; contemporâneos: Marx, Nietzsche, Sartre, Beauvoir, Arendt, Adorno e Horkheimer, Foucault),
com "palavras-chave" de cada filósofo e ligação com as questões de 2023 e 2024.
FIM-sprint-005

sprint-006: feat(curso) - (06/11/2026) módulo 27 "Sociologia": abertura + 8 aulas (Durkheim, Weber e Marx;
cultura, etnocentrismo e patrimônio; estratificação e desigualdade; racismo estrutural e leis; gênero e família;
trabalho: taylorismo, fordismo, toyotismo e uberização; cidadania, direitos e movimentos sociais; globalização,
Bauman, Hall, Castells e fake news), com ligação às questões de 2023 e 2024 e dica de repertório para a redação.
FIM-sprint-006

sprint-007: feat(curso) - (06/11/2026) módulo 51 "Redação do zero à nota mil": abertura + 9 aulas (o que o Enem pede
e nota zero; as cinco competências; ler o tema sem tangenciar, com os temas de 2017 a 2025 — 2025 conferido:
"Perspectivas acerca do envelhecimento na sociedade brasileira"; tese; introdução; desenvolvimento; proposta com
os 5 elementos; repertórios por assunto; revisão e erros comuns). Menção ao atendimento especializado do Inep.
- montar_dados.py: módulos 5x (Redação) também entram no grupo "curso".
FIM-sprint-007

sprint-008: feat(curso) - (06/11/2026) módulo 21 "História do Brasil: Colônia e Império": abertura + 8 aulas
(povos originários e chegada portuguesa; capitanias, Governo-Geral, açúcar e plantation; escravidão, quilombos e
Palmares; ouro e Minas; Inconfidência e Conjuração Baiana; família real e Independência; Primeiro Reinado, regências
e Segundo Reinado; abolição e Proclamação da República), ligado às questões de 2023 e 2024.
FIM-sprint-008

sprint-009: feat(curso) - (06/11/2026) módulo 22 "História do Brasil: República": abertura + 8 aulas (Primeira República
e coronelismo; revoltas: Canudos, Contestado, Vacina, Chibata, tenentismo, Semana de 22; Era Vargas; 1946-1964;
ditadura militar e AI-5; abertura e Diretas Já; Constituição de 1988 e Nova República; temas transversais).
FIM-sprint-009

sprint-010: feat(curso) - (06/11/2026) módulo 23 "História Geral": abertura + 9 aulas (Grécia e Roma; Idade Média;
Renascimento, Reformas, Navegações, absolutismo e mercantilismo; conquista da América; Iluminismo e revoluções,
incluindo o Haiti; Revolução Industrial e imperialismo; Primeira Guerra, Revolução Russa, 1929 e totalitarismos;
Segunda Guerra, Holocausto e ONU; Guerra Fria, descolonização e apartheid), ligado às questões de 2023 e 2024.
FIM-sprint-010

sprint-011: feat(curso) - (06/11/2026) módulos 24 e 25 de Geografia — CIÊNCIAS HUMANAS COMPLETAS (21 a 27).
- 24 "Geografia física": 8 aulas (mapas, escala e coordenadas; fusos e projeções; placas e rochas; relevo e solos;
  clima; seis biomas; hidrografia e aquíferos; problemas ambientais globais e acordos).
- 25 "Geografia humana": 8 aulas (população e transição demográfica, Censo 2022; migrações; urbanização;
  espaço agrário; indústria e energia; transportes e redes; globalização e blocos; geopolítica e conflitos).
FIM-sprint-011
