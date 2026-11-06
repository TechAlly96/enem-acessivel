"use strict";
// Enem Acessivel - app de estudo em audio. Toca com a tela apagada e em segundo plano
// (elemento <audio> + Media Session, mesmo desenho do GIN). Sem dependencias.
const DADOS = "../dados/";
const CACHE_AUDIO = "enem-audio-v1";
const CACHE_DADOS = "enem-dados-v1";
const VELOCIDADES = [0.75, 1, 1.25, 1.5, 1.75];
const GRUPOS = [["geral", "Comece por aqui"], ["curso", "Curso completo: aprenda do zero"], ["dia1", "Primeiro dia: Linguagens, Humanas e Redação"], ["dia2", "Segundo dia: Natureza e Matemática"]];
const AREAS = { "1": "Linguagens", "2": "Ciências Humanas", "3": "Ciências da Natureza", "4": "Matemática", "5": "Redação" };
const $ = (id) => document.getElementById(id);

let partes = [];
const memoria = {}; // id -> { conteudo, audio }
const player = { parte: null, cap: -1, velocidade: 1, modo: null, ultimaPosicao: 0, ultimoSalvo: 0, fila: [] };

// ---------- utilidades ----------
function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto != null) e.textContent = texto;
  return e;
}
function guardar(chave, valor) { try { localStorage.setItem(chave, JSON.stringify(valor)); } catch {} }
function recuperar(chave, padrao) { try { const v = localStorage.getItem(chave); return v ? JSON.parse(v) : padrao; } catch { return padrao; } }
function anunciar(texto) { const a = $("anuncio"); a.textContent = ""; setTimeout(() => { a.textContent = texto; }, 50); }
function relogio(s) {
  if (!isFinite(s) || s < 0) s = 0;
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), seg = Math.floor(s % 60);
  return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(seg).padStart(2, "0");
}
function minutos(s) { const m = Math.round(s / 60); return m < 60 ? m + " min" : Math.floor(m / 60) + " h " + (m % 60) + " min"; }
async function obterJSON(caminho, opcional) {
  const r = await fetch(DADOS + caminho, { cache: "no-cache" });
  if (!r.ok) { if (opcional) return null; throw new Error(caminho + ": HTTP " + r.status); }
  return r.json();
}
async function carregarParte(id) {
  if (!memoria[id]) {
    const [conteudo, audio] = await Promise.all([obterJSON(id + "/conteudo.json"), obterJSON(id + "/audio.json", true).catch(() => null)]);
    memoria[id] = { conteudo, audio };
  }
  return memoria[id];
}
const urlAudio = (id) => DADOS + id + "/" + memoria[id].audio.arquivo;

// ---------- tamanho do texto ----------
function aplicarTamanho(px) {
  px = Math.max(16, Math.min(30, px));
  document.documentElement.style.setProperty("--tam", px + "px");
  guardar("enem-tamanho", px);
  return px;
}
aplicarTamanho(recuperar("enem-tamanho", 19));

// ---------- telas ----------
function preparar(titulo, comVoltar) {
  $("titulo-tela").textContent = titulo;
  document.title = titulo === "Enem Acessível" ? titulo : titulo + " · Enem Acessível";
  $("voltar").hidden = !comVoltar;
  const main = $("conteudo");
  main.replaceChildren();
  return main;
}

function telaInicio() {
  const main = preparar("Enem Acessível", false);
  main.append(el("p", "aviso", "Curso completo e provas do Enem resolvidas, tudo em áudio e em linguagem simples. Coloque o fone e toque no botão abaixo: as aulas tocam uma depois da outra, até o fim do curso, e depois recomeçam. Funciona com a tela apagada. Se preferir, escolha uma parte na lista."));
  const prog = recuperar("enem-progresso", null);
  const parteSalva = prog && partes.find((p) => p.id === prog.parte);
  const inicio = sequencia()[0];
  const b = el("button", "botao forte");
  b.type = "button";
  if (parteSalva) {
    b.append(el("strong", null, "▶ Continuar de onde parei"), el("span", null, parteSalva.curto + (prog.titulo ? " · " + prog.titulo : "")));
    b.addEventListener("click", () => tocarParte(prog.parte, null, prog.tempo));
  } else {
    b.append(el("strong", null, "▶ Começar o curso guiado"), el("span", null, "Toque uma vez e só ouça: tudo toca em sequência"));
    b.addEventListener("click", () => tocarParte(inicio, 0));
  }
  main.append(b);
  if (parteSalva) {
    const r = el("button", "botao");
    r.type = "button";
    r.append(el("strong", null, "↺ Recomeçar do início"), el("span", null, "Volta para a apresentação e segue em sequência"));
    r.addEventListener("click", () => tocarParte(inicio, 0));
    main.append(r);
  }
  for (const [grupo, nome] of GRUPOS) {
    const lista = partes.filter((p) => p.dia === grupo);
    if (!lista.length) continue;
    main.append(el("h2", null, nome));
    let areaAtual = null;
    for (const p of lista) {
      const area = grupo === "curso" ? AREAS[p.id[0]] : null;
      if (area && area !== areaAtual) { main.append(el("h3", "area", area)); areaAtual = area; }
      const b = el("button", "botao");
      b.type = "button";
      const detalhes = [p.aulas ? p.aulas + " aulas" : p.questoes ? p.questoes + " questões resolvidas" : p.capitulos + " tópicos"];
      if (p.duracao) detalhes.push(minutos(p.duracao) + " de áudio");
      b.append(el("strong", null, p.curto), el("span", null, detalhes.join(" · ")));
      b.addEventListener("click", () => { location.hash = "#/parte/" + p.id; });
      main.append(b);
    }
  }
  main.append(el("h2", null, "Tamanho do texto"));
  const t = el("div", "tamanho");
  const menor = el("button", null, "A− Diminuir"), maior = el("button", null, "A+ Aumentar");
  menor.type = maior.type = "button";
  menor.addEventListener("click", () => anunciar("Texto com " + aplicarTamanho(recuperar("enem-tamanho", 19) - 2) + " pixels"));
  maior.addEventListener("click", () => anunciar("Texto com " + aplicarTamanho(recuperar("enem-tamanho", 19) + 2) + " pixels"));
  t.append(menor, maior);
  main.append(t);
  const rod = el("p", "rodape");
  rod.innerHTML = 'Criado por Marlon Myaggy. Projeto gratuito e de código aberto. Respostas conferidas no gabarito oficial do Inep. <a href="https://github.com/TechAlly96/enem-acessivel" rel="noopener">Código-fonte no GitHub</a>.';
  main.append(rod);
}

async function telaParte(id) {
  const info = partes.find((p) => p.id === id);
  const main = preparar(info ? info.curto : "Carregando...", true);
  main.append(el("p", "aviso", "Carregando..."));
  let dados;
  try { dados = await carregarParte(id); } catch (e) { main.replaceChildren(el("p", "aviso", "Não foi possível abrir esta parte. Verifique a internet. (" + e.message + ")")); return; }
  const { conteudo, audio } = dados;
  main.replaceChildren();
  $("titulo-tela").textContent = conteudo.curto;
  const acoes = el("div", "acoes");
  const tudo = el("button", "botao forte");
  tudo.type = "button";
  tudo.append(el("strong", null, "▶ Ouvir a parte toda"), el("span", null, (audio ? minutos(audio.duracao) : "leitura pela voz do celular") + ", e segue sozinho para a próxima parte"));
  tudo.addEventListener("click", () => tocarParte(id, 0));
  acoes.append(tudo);
  if (audio && "caches" in window) {
    const baixar = el("button", "botao");
    baixar.type = "button";
    const mb = audio.bytes ? " (" + (audio.bytes / 1048576).toFixed(0) + " MB)" : "";
    const rotulo = el("strong", null, "⬇ Baixar para ouvir sem internet" + mb);
    const status = el("span", null, "Use o Wi-Fi");
    baixar.append(rotulo, status);
    estaBaixada(id).then((ok) => { if (ok) { rotulo.textContent = "✓ Disponível sem internet"; status.textContent = "Já está guardada no celular"; } });
    baixar.addEventListener("click", async () => {
      status.textContent = "Baixando... aguarde";
      anunciar("Baixando a parte, aguarde");
      try { await baixarParte(id); rotulo.textContent = "✓ Disponível sem internet"; status.textContent = "Já está guardada no celular"; anunciar("Parte baixada. Ela funciona sem internet."); }
      catch (e) { status.textContent = "Falhou: " + e.message; anunciar("Não foi possível baixar"); }
    });
    acoes.append(baixar);
  }
  if (!audio) acoes.append(el("p", "aviso", "O áudio gravado desta parte ainda está sendo preparado. Por enquanto, a leitura usa a voz do celular e para se a tela apagar."));
  main.append(acoes);
  conteudo.capitulos.forEach((c, i) => {
    const art = el("article", "capitulo");
    art.id = "cap-" + c.id;
    art.append(el("h3", null, c.titulo));
    const ouvir = el("button", "ouvir-cap", "▶ Ouvir");
    ouvir.type = "button";
    ouvir.setAttribute("aria-label", "Ouvir: " + c.titulo);
    ouvir.addEventListener("click", () => tocarParte(id, i));
    art.append(ouvir);
    const det = el("details");
    det.append(el("summary", null, "Ler o texto"));
    const texto = el("div", "texto");
    texto.innerHTML = c.html; // gerado pelo proprio projeto a partir do conteudo/*.md (texto escapado)
    det.append(texto);
    art.append(det);
    main.append(art);
  });
  marcarTocando();
}

function rota() {
  const m = /^#\/parte\/([\w-]+)$/.exec(location.hash);
  if (m) telaParte(m[1]); else telaInicio();
  $("conteudo").focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

// ---------- download para uso sem internet ----------
async function estaBaixada(id) {
  try { return !!(await (await caches.open(CACHE_AUDIO)).match(new URL(urlAudio(id), location.href).href)); } catch { return false; }
}
async function baixarParte(id) {
  const url = new URL(urlAudio(id), location.href).href;
  const r = await fetch(url);
  if (!r.ok) throw new Error("HTTP " + r.status);
  await (await caches.open(CACHE_AUDIO)).put(url, r);
  const dados = await caches.open(CACHE_DADOS);
  await dados.addAll([DADOS + "partes.json", DADOS + id + "/conteudo.json", DADOS + id + "/audio.json"]);
}

// ---------- modo guiado: tudo em sequencia, como um cao-guia ----------
// Ordem: apresentacao -> curso completo (todas as areas) -> estrategia e redacao
// -> provas do primeiro dia -> provas do segundo dia -> resumo de vespera -> recomeca.
function sequencia() {
  const ordem = (p) => p.id === "00_inicio" ? 0 : p.dia === "curso" ? 1 : p.id.startsWith("07") ? 2 : p.dia === "dia1" ? 3 : p.dia === "dia2" ? 4 : 5;
  return partes.slice().sort((a, b) => ordem(a) - ordem(b) || a.id.localeCompare(b.id)).map((p) => p.id);
}
function vizinha(id, passo) {
  const seq = sequencia();
  const i = seq.indexOf(id);
  return seq[((i < 0 ? 0 : i) + passo + seq.length) % seq.length];
}
async function avancarParte() {
  const seq = sequencia();
  const fimDoCurso = seq.indexOf(player.parte) === seq.length - 1;
  const prox = vizinha(player.parte, 1);
  const info = partes.find((p) => p.id === prox);
  anunciar(fimDoCurso ? "Fim do curso. Recomeçando do início." : "A seguir: " + (info ? info.curto : ""));
  guardar("enem-progresso", { parte: prox, tempo: 0, titulo: "" });
  if (!(await tocarParte(prox, 0))) {
    // sem internet ou falha passageira: tenta de novo uma vez
    setTimeout(() => { if (audio().paused) tocarParte(prox, 0); }, 8000);
  }
}

// ---------- reprodutor ----------
const audio = () => $("audio");
function capitulos() { const d = memoria[player.parte]; return d && d.audio ? d.audio.capitulos : []; }
function capituloEm(t) {
  const caps = capitulos();
  let i = 0;
  while (i + 1 < caps.length && caps[i + 1].inicio <= t + 0.05) i++;
  return i;
}
function tituloCap(i) { const d = memoria[player.parte]; return d ? (d.conteudo.capitulos[i] || {}).titulo || "" : ""; }

async function tocarParte(id, cap, tempo) {
  try {
    pararSintese();
    const dados = await carregarParte(id);
    player.parte = id;
    player.cap = -1;
    player.preparada = null;
    $("player").hidden = false;
    document.body.classList.add("com-player");
    $("player-parte").textContent = dados.conteudo.curto;
    if (!dados.audio) { player.modo = "sintese"; falarCapitulo(cap || 0); return true; }
    player.modo = "audio";
    const a = audio();
    const src = new URL(urlAudio(id), location.href).href;
    const alvo = tempo != null ? tempo : (dados.audio.capitulos[cap || 0] || { inicio: 0 }).inicio;
    if (a.src !== src) {
      a.src = src;
      a.preload = "auto";
      await new Promise((ok, erro) => {
        a.addEventListener("loadedmetadata", ok, { once: true });
        a.addEventListener("error", () => erro(new Error("áudio indisponível")), { once: true });
        a.load();
      });
    }
    a.currentTime = alvo;
    a.playbackRate = player.velocidade;
    await a.play();
    aoMudarCapitulo(capituloEm(alvo));
    return true;
  } catch (e) {
    $("player-titulo").textContent = "Não foi possível tocar: " + e.message;
    anunciar("Não foi possível tocar o áudio. " + e.message);
    return false;
  }
}

function aoMudarCapitulo(i) {
  if (i === player.cap) return;
  player.cap = i;
  const titulo = tituloCap(i);
  $("player-titulo").textContent = titulo;
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: titulo, artist: "Enem Acessível", album: (memoria[player.parte] || { conteudo: {} }).conteudo.curto || "",
      artwork: [{ src: "icone-512.png", sizes: "512x512", type: "image/png" }],
    });
  }
  marcarTocando();
}

function marcarTocando() {
  document.querySelectorAll(".capitulo.tocando").forEach((e) => e.classList.remove("tocando"));
  const d = memoria[player.parte];
  if (!d || player.cap < 0 || location.hash !== "#/parte/" + player.parte) return;
  const c = d.conteudo.capitulos[player.cap];
  const art = c && document.getElementById("cap-" + c.id);
  if (art) art.classList.add("tocando");
}

function irPara(i) {
  if (player.modo === "sintese") { falarCapitulo(i); return; }
  const caps = capitulos();
  if (!caps.length) return;
  i = Math.max(0, Math.min(i, caps.length - 1));
  audio().currentTime = caps[i].inicio;
  aoMudarCapitulo(i);
  anunciar(tituloCap(i));
}
function anterior() {
  if (player.modo === "sintese") { if (player.cap > 0) falarCapitulo(player.cap - 1); else tocarParte(vizinha(player.parte, -1), 0); return; }
  const t = audio().currentTime, i = capituloEm(t);
  if (i === 0 && t - capitulos()[0].inicio <= 3) { tocarParte(vizinha(player.parte, -1), 0); return; }
  irPara(t - capitulos()[i].inicio > 3 ? i : i - 1);
}
function proxima() {
  const atual = player.modo === "sintese" ? player.cap : capituloEm(audio().currentTime);
  const total = player.modo === "sintese" ? ((memoria[player.parte] || { conteudo: { capitulos: [] } }).conteudo.capitulos.length) : capitulos().length;
  if (atual + 1 >= total) { avancarParte(); return; }
  irPara(atual + 1);
}
function saltar(seg) { if (player.modo === "audio") { const a = audio(); a.currentTime = Math.max(0, Math.min(a.currentTime + seg, a.duration || 0)); } }
function alternar() {
  if (player.modo === "sintese") {
    if (speechSynthesis.paused) speechSynthesis.resume(); else if (speechSynthesis.speaking) speechSynthesis.pause(); else falarCapitulo(player.cap);
    atualizarBotaoTocar(!speechSynthesis.paused);
    return;
  }
  const a = audio();
  if (a.paused) a.play(); else a.pause();
}
function atualizarBotaoTocar(tocando) {
  const b = $("p-tocar");
  b.textContent = tocando ? "⏸" : "▶";
  b.setAttribute("aria-label", tocando ? "Pausar" : "Tocar");
}
function salvarProgresso(forcar) {
  if (player.modo !== "audio" || !player.parte) return;
  const t = audio().currentTime;
  if (!forcar && Math.abs(t - player.ultimoSalvo) < 5) return;
  player.ultimoSalvo = t;
  guardar("enem-progresso", { parte: player.parte, tempo: Math.max(0, t - 2), titulo: tituloCap(capituloEm(t)) });
}

// Reserva: voz do celular (so com a tela ligada) enquanto o audio gravado nao existe
function pararSintese() { if ("speechSynthesis" in window) speechSynthesis.cancel(); }
function falarCapitulo(i) {
  const d = memoria[player.parte];
  if (!d || !("speechSynthesis" in window)) { $("player-titulo").textContent = "Leitura por voz indisponível neste aparelho"; return; }
  const caps = d.conteudo.capitulos;
  if (i >= caps.length) { avancarParte(); return; }
  if (i < 0) { atualizarBotaoTocar(false); return; }
  pararSintese();
  aoMudarCapitulo(i);
  const pedacos = caps[i].fala.match(/[^.!?]+[.!?]*/g) || [caps[i].fala];
  const vozes = speechSynthesis.getVoices().filter((v) => v.lang && v.lang.toLowerCase().startsWith("pt"));
  pedacos.forEach((p, n) => {
    const u = new SpeechSynthesisUtterance(p.trim());
    u.lang = "pt-BR";
    u.rate = player.velocidade;
    const br = vozes.find((v) => v.lang.toLowerCase() === "pt-br");
    if (br) u.voice = br;
    if (n === pedacos.length - 1) u.onend = () => { if (player.modo === "sintese" && player.cap === i) falarCapitulo(i + 1); };
    speechSynthesis.speak(u);
  });
  atualizarBotaoTocar(true);
}

// ---------- eventos do reprodutor ----------
$("p-tocar").addEventListener("click", alternar);
$("p-anterior").addEventListener("click", anterior);
$("p-proxima").addEventListener("click", proxima);
$("p-voltar15").addEventListener("click", () => saltar(-15));
$("p-avancar15").addEventListener("click", () => saltar(15));
$("p-velocidade").addEventListener("click", () => {
  player.velocidade = VELOCIDADES[(VELOCIDADES.indexOf(player.velocidade) + 1) % VELOCIDADES.length];
  audio().playbackRate = player.velocidade;
  const txt = String(player.velocidade).replace(".", ",");
  $("p-velocidade").textContent = "Velocidade " + txt + "×";
  $("p-velocidade").setAttribute("aria-label", "Velocidade: " + txt + " vezes");
  guardar("enem-velocidade", player.velocidade);
  anunciar("Velocidade " + txt);
});
$("p-fechar").addEventListener("click", () => {
  salvarProgresso(true);
  audio().pause();
  pararSintese();
  $("player").hidden = true;
  document.body.classList.remove("com-player");
});
$("player-barra").addEventListener("input", (ev) => {
  const a = audio();
  if (player.modo === "audio" && isFinite(a.duration)) a.currentTime = a.duration * ev.target.value / 1000;
});
$("voltar").addEventListener("click", () => { location.hash = ""; });

audio().addEventListener("timeupdate", () => {
  const a = audio();
  if (player.modo !== "audio") return;
  if (isFinite(a.duration)) {
    $("player-barra").value = Math.round(1000 * a.currentTime / a.duration);
    $("player-agora").textContent = relogio(a.currentTime);
    $("player-total").textContent = relogio(a.duration);
  }
  aoMudarCapitulo(capituloEm(a.currentTime));
  salvarProgresso(false);
  if (isFinite(a.duration) && a.duration - a.currentTime < 120 && player.preparada !== player.parte) {
    player.preparada = player.parte; // baixa os dados da proxima parte antes do fim, para a troca ser imediata
    carregarParte(vizinha(player.parte, 1)).catch(() => {});
  }
  if ("mediaSession" in navigator && navigator.mediaSession.setPositionState && isFinite(a.duration)
      && Math.abs(a.currentTime - player.ultimaPosicao) > 5) {
    player.ultimaPosicao = a.currentTime;
    try { navigator.mediaSession.setPositionState({ duration: a.duration, playbackRate: a.playbackRate, position: a.currentTime }); } catch {}
  }
});
audio().addEventListener("play", () => { atualizarBotaoTocar(true); if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing"; });
audio().addEventListener("pause", () => { atualizarBotaoTocar(false); salvarProgresso(true); if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "paused"; });
audio().addEventListener("ended", () => { if (player.modo === "audio") avancarParte(); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") salvarProgresso(true); else marcarTocando(); });

if ("mediaSession" in navigator) {
  const acoes = {
    play: () => alternar(), pause: () => alternar(),
    previoustrack: anterior, nexttrack: proxima,
    seekbackward: (d) => saltar(-(d.seekOffset || 15)), seekforward: (d) => saltar(d.seekOffset || 15),
    seekto: (d) => { if (player.modo === "audio") audio().currentTime = d.seekTime; },
  };
  for (const [acao, fn] of Object.entries(acoes)) { try { navigator.mediaSession.setActionHandler(acao, fn); } catch {} }
}

// ---------- inicio ----------
(async function iniciar() {
  const v = recuperar("enem-velocidade", 1);
  if (VELOCIDADES.includes(v)) { player.velocidade = v; $("p-velocidade").textContent = "Velocidade " + String(v).replace(".", ",") + "×"; }
  try {
    partes = await obterJSON("partes.json");
  } catch (e) {
    preparar("Enem Acessível", false).append(el("p", "aviso", "Sem conexão e sem cópia guardada. Abra o app uma vez com internet. (" + e.message + ")"));
    return;
  }
  window.addEventListener("hashchange", rota);
  rota();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
