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

sprint-012: feat(curso) - (06/11/2026) módulos 13 e 14 de Linguagens.
- 13 "Variação linguística, gramática que cai e sentido das palavras": 7 aulas (variação; tipos; preconceito
  linguístico; norma-padrão e adequação; concordância, crase, porquês, mas/mais, há/a; denotação, polissemia,
  ambiguidade e estrangeirismos; linguagem verbal, não verbal e multimodal).
- 14 "Literatura brasileira": 9 aulas (Quinhentismo e Barroco; Arcadismo; Romantismo; Realismo e Naturalismo;
  Parnasianismo, Simbolismo e Pré-Modernismo; Modernismo 1ª e 2ª fases; de Guimarães Rosa a Conceição Evaristo;
  como responder questões). Citações só de obras em domínio público (antes de 1929).
FIM-sprint-012

sprint-013: feat(curso) - (06/11/2026) módulo 15 "Artes, Educação Física, tecnologias e língua estrangeira": 8 aulas
(vanguardas; arte contemporânea e popular; música, teatro e dança; corpo, saúde e sociedade; esporte e inclusão,
com goalball e futebol de cegos; TICs, fake news e acessibilidade digital; inglês e falsos cognatos; espanhol e
falsos amigos). MARCO: todos os módulos do 1º DIA prontos (Linguagens 11-15, Humanas 21-27, Redação 51).
FIM-sprint-013

sprint-014: feat(curso) - (06/11/2026) início de Ciências da Natureza (2º dia, 15/11).
- 31 "Física 1: movimento e forças": 7 aulas (velocidade e eco; aceleração e queda livre; inércia; 2ª e 3ª leis,
  massa e peso; atrito e movimento circular; alavancas, polias e plano inclinado; pressão e empuxo).
- 32 "Física 2: energia, calor, ondas e luz": 8 aulas (formas e conservação da energia; potência, kWh e rendimento;
  temperatura e calor; calor sensível e latente, gases; ondas; som; luz, cores e lentes; espectro e radiação).
FIM-sprint-014

sprint-015: feat(curso) - (06/11/2026)
- 33 "Física 3: eletricidade e magnetismo": 7 aulas (carga; corrente, tensão e resistência; potência e kWh;
  série e paralelo, disjuntor, terra e DR; magnetismo e eletroímã; indução e usinas; segurança e uso consciente).
- 34 "Química 1": 7 aulas (matéria e misturas; separação de misturas e tratamento de água; átomo e modelos;
  tabela periódica e eletronegatividade; ligações; polaridade, solubilidade e detergentes; propriedades e densidade).
FIM-sprint-015

sprint-016: feat(curso) - (06/11/2026) QUÍMICA COMPLETA (34-36).
- 35 "Química 2": 8 aulas (reações e Lavoisier; mol e massa molar; estequiometria e limitante; soluções e
  concentração; ácidos, bases e pH; velocidade das reações; equilíbrio e Le Chatelier; oxirredução e pilhas).
- 36 "Química 3": 7 aulas (carbono e cadeias; nomenclatura; funções orgânicas; isomeria e carbono quiral;
  petróleo, biocombustíveis e polímeros; química ambiental; remédios, alimentos e radioatividade, Goiânia 1987).
FIM-sprint-016

sprint-017: feat(curso) - (06/11/2026) BIOLOGIA COMPLETA (37-39) => CIÊNCIAS DA NATUREZA COMPLETAS (31-39).
- 37 "Célula e genética": 7 aulas (célula; organelas; mitose e meiose; DNA, RNA e proteínas; Mendel; ABO,
  herança ligada ao sexo e síndrome de Down; biotecnologia).
- 38 "Ecologia e evolução": 7 aulas (conceitos; cadeias e energia; ciclos; relações; problemas e conservação;
  Lamarck e Darwin; evidências e história da vida).
- 39 "Corpo humano, saúde e seres vivos": 8 aulas (digestão; respiração e circulação; nervoso e hormônios;
  reprodução; imunidade e vacinas; doenças e prevenção; grupos de seres vivos; fisiologia de plantas e animais).
- Corrigido itálico com asterisco simples (não suportado pelo gerador) em 39.
FIM-sprint-017

sprint-018: feat(curso) - (06/11/2026)
- 42 "Matemática 2: razão, proporção, porcentagem e juros": 8 aulas (razão; proporção direta e inversa; regra de
  três; porcentagem e atalhos; aumentos e descontos com fator, armadilha dos percentuais seguidos; juros simples;
  juros compostos; problemas do dia a dia e comparação de planos).
- 43 "Matemática 3: equações e funções": 8 aulas (equação como balança; montar equações; sistemas; função;
  primeiro grau; segundo grau e vértice; exponencial; logaritmo e leitura de gráficos).
FIM-sprint-018

sprint-019: feat(curso) - (06/11/2026) geometria com orientação tátil (objetos reais para sentir as formas).
- 44 "Geometria plana": 8 aulas (ângulos; triângulos e semelhança; Pitágoras; trigonometria SOH CAH TOA;
  quadriláteros e polígonos; perímetro e área; círculo e pi; escala, simetria e plano cartesiano).
- 45 "Geometria espacial": 7 aulas (sólidos, faces, arestas, vértices e planificação; prismas e cubo; cilindro;
  pirâmides e cones, um terço; esfera; área de superfície e embalagens; vistas e semelhança no espaço).
FIM-sprint-019

sprint-020: feat(curso) - (06/11/2026) CURSO COMPLETO: 29 de 29 módulos.
- 46 "Estatística e probabilidade": 8 aulas (gráficos; média e ponderada; mediana e moda; amplitude e desvio padrão;
  probabilidade; eventos combinados; aplicações; amostra, margem de erro e correlação x causa).
- 47 "Contagem, sequências, logaritmo e trigonometria": 7 aulas + encerramento do curso (princípio multiplicativo;
  permutação, arranjo e combinação; sequências; PA e soma de Gauss; PG; logaritmo; ciclo trigonométrico e periódicos).
Totais do curso: 29 módulos, cerca de 230 aulas, além das 280 questões resolvidas.
FIM-sprint-020

sprint-021: feat(app) - (06/11/2026) apresentação do autor e organização visual.
- 00_inicio reescrito para o app: apresentação de Marlon Myaggy, ideia do aplicativo, como usar
  (tocador, tela apagada, continuar, baixar sem internet, instalar) e por onde começar.
- Tela inicial: subtítulos por área no curso (Linguagens, Humanas, Natureza, Matemática, Redação),
  texto de abertura citando o curso e crédito "Criado por Marlon Myaggy" no rodapé.
- sw.js: cache da casca enem-app-v2.
FIM-sprint-021
