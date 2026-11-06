"use strict";
// Enem Acessivel - service worker (mesmo desenho do GIN):
// rede primeiro para o app e os dados; audio baixado fica guardado e e entregue em pedacos
// (Range) para permitir pular entre questoes sem internet.
const CACHE_APP = "enem-app-v3";
const CACHE_AUDIO = "enem-audio-v1";
const CACHE_DADOS = "enem-dados-v1";
const CASCA = ["./", "./index.html", "./app.js", "./estilo.css", "./manifest.json",
  "./icone-192.png", "./icone-512.png", "./icone-maskable-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_APP).then((c) => c.addAll(CASCA)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((chaves) => Promise.all(chaves.filter((k) => ![CACHE_APP, CACHE_AUDIO, CACHE_DADOS].includes(k)).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith(".ogg")) { e.respondWith(audioComReserva(req)); return; }
  e.respondWith(redePrimeiro(req, url.pathname.includes("/dados/") ? CACHE_DADOS : CACHE_APP));
});

// Audio: se ja foi baixado, usa a copia (economiza dados); senao, rede.
async function audioComReserva(req) {
  const salvo = await (await caches.open(CACHE_AUDIO)).match(req.url);
  if (!salvo) return fetch(req);
  const faixa = req.headers.get("range");
  if (!faixa) return salvo;
  const buf = await salvo.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(faixa) || [];
  const ini = m[1] ? parseInt(m[1], 10) : 0;
  const fim = Math.min(m[2] ? parseInt(m[2], 10) : buf.byteLength - 1, buf.byteLength - 1);
  return new Response(buf.slice(ini, fim + 1), {
    status: 206,
    headers: {
      "Content-Type": "audio/ogg", "Accept-Ranges": "bytes",
      "Content-Range": "bytes " + ini + "-" + fim + "/" + buf.byteLength,
      "Content-Length": String(fim - ini + 1),
    },
  });
}

async function redePrimeiro(req, nomeCache) {
  const cache = await caches.open(nomeCache);
  try {
    const resp = await fetch(req);
    if (resp.ok) cache.put(req, resp.clone());
    return resp;
  } catch (erro) {
    const salvo = await cache.match(req, { ignoreSearch: true });
    if (salvo) return salvo;
    throw erro;
  }
}
