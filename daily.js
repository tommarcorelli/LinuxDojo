// daily.js — Défi du jour : un défi par jour, +50 XP bonus, une seule fois

// Pool de défis quotidiens (indépendants du mode Défis normal)
const DAILY_POOL = [
  {
    title: "🔍 Traque d'erreurs",
    desc: "Un serveur a planté cette nuit. Trouve les lignes contenant <strong>ERROR</strong> dans <code>server.log</code>.",
    fs: { "server.log": { type:"file", content:"INFO démarrage\nERROR timeout DB\nINFO ok\nERROR disk full\nWARN memory low\nERROR crash\nINFO fin" } },
    check: (out) => /timeout|disk|crash/i.test(out) && !/warn/i.test(out),
    hint: "grep ERROR server.log"
  },
  {
    title: "📊 Comptage rapide",
    desc: "Combien de lignes contient <code>data.txt</code> ? Trouve le nombre exact.",
    fs: { "data.txt": { type:"file", content:"a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl" } },
    check: (out) => /\b12\b/.test(out),
    hint: "wc -l data.txt"
  },
  {
    title: "🗂️ Chasse aux .log",
    desc: "Trouve tous les fichiers <code>.log</code> dans le répertoire courant.",
    fs: { "app.log":{type:"file",content:""}, "error.log":{type:"file",content:""}, "note.txt":{type:"file",content:""}, "config.json":{type:"file",content:""}, "debug.log":{type:"file",content:""} },
    check: (out) => /app\.log/.test(out) && /error\.log/.test(out) && /debug\.log/.test(out) && !/\.json|\.txt/.test(out),
    hint: "find . -name '*.log'"
  },
  {
    title: "🕵️ Cachette",
    desc: "Un fichier caché contient un secret. Liste TOUS les fichiers pour le repérer.",
    fs: { "visible.txt":{type:"file",content:""}, ".secret":{type:"file",content:"trouvé !"}, ".env":{type:"file",content:"KEY=x"} },
    check: (out) => /\.secret|\.env/.test(out),
    hint: "ls -a  ou  ls -la"
  },
  {
    title: "📝 Signature de version",
    desc: "Écris exactement <strong>v2.0.0</strong> dans un fichier nommé <code>VERSION</code>.",
    fs: {},
    check: (out, s) => s.redirect === "VERSION",
    hint: 'echo "v2.0.0" > VERSION'
  },
  {
    title: "🔤 Tri alphabétique",
    desc: "Trie <code>fruits.txt</code> par ordre alphabétique. La 1ère ligne du résultat doit commencer par 'a'.",
    fs: { "fruits.txt":{type:"file",content:"banane\npomme\nabricot\ncerise\nananas"} },
    check: (out) => { const l = out.split("\n").filter(Boolean); return l[0] === "abricot" || l[0] === "ananas"; },
    hint: "sort fruits.txt"
  },
  {
    title: "🔐 Décodage Base64",
    desc: "Le fichier <code>msg.b64</code> contient un message caché. Décode-le.",
    fs: { "msg.b64":{type:"file",content:"QmllbiBqb3XDqSA6KQ=="} },  // "Bien joué :)"
    check: (out) => /bien|jou/i.test(out),
    hint: "base64 -d msg.b64"
  },
  {
    title: "🧮 Comptage d'erreurs",
    desc: "Compte le nombre exact d'occurrences de <strong>ERROR</strong> dans <code>app.log</code>.",
    fs: { "app.log":{type:"file",content:"INFO\nERROR 1\nINFO\nERROR 2\nWARN\nERROR 3\nINFO"} },
    check: (out) => /\b3\b/.test(out),
    hint: "grep ERROR app.log | wc -l"
  },
  {
    title: "🎯 Extraction de colonne",
    desc: "Affiche uniquement les noms (1ère colonne) de <code>users.csv</code>.",
    fs: { "users.csv":{type:"file",content:"Alice,25,Paris\nBob,30,Lyon\nCarla,22,Nice"} },
    check: (out) => /alice/i.test(out) && /bob/i.test(out) && !/25|30|22/.test(out),
    hint: "awk -F',' '{print $1}' users.csv"
  },
  {
    title: "🔀 Renommage",
    desc: "Renomme <code>draft.txt</code> en <code>final.txt</code>.",
    fs: { "draft.txt":{type:"file",content:"brouillon"} },
    check: (out, s) => s.mv === "final.txt",
    hint: "mv draft.txt final.txt"
  },
  {
    title: "🧙 ROT13",
    desc: "Le fichier <code>msg.rot</code> est chiffré en ROT13. Déchiffre-le.",
    fs: { "msg.rot":{type:"file",content:"Uryyb Yvahk !"} },  // "Hello Linux !"
    check: (out) => /hello|linux/i.test(out),
    hint: "rot13 msg.rot"
  },
  {
    title: "🔎 Recherche insensible",
    desc: "Trouve toutes les lignes mentionnant Linux (LINUX, Linux, linux...) dans <code>notes.txt</code>.",
    fs: { "notes.txt":{type:"file",content:"J'aime Linux\nLINUX est puissant\nMac est différent\nlinux domine"} },
    check: (out) => (out.match(/linux/gi) || []).length >= 3,
    hint: "grep -i linux notes.txt"
  },
];

const DAILY_KEY = "linuxdojo_daily";  // { date: "YYYY-MM-DD", done: false, idx: N }

function _todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
function _dayIndex() {
  // Index déterministe basé sur le nombre de jours depuis 2020-01-01
  const d = new Date(); const ref = new Date(2020,0,1);
  const days = Math.floor((d - ref) / 86400000);
  return ((days % DAILY_POOL.length) + DAILY_POOL.length) % DAILY_POOL.length;
}
function _loadDaily() {
  try { return JSON.parse(localStorage.getItem(DAILY_KEY)) || {}; } catch { return {}; }
}
function _saveDaily(state) { localStorage.setItem(DAILY_KEY, JSON.stringify(state)); }

function dailyStatus() {
  const st = _loadDaily();
  const today = _todayKey();
  return (st.date === today && st.done) ? "done" : "todo";
}

function updateDailyBanner() {
  const status = dailyStatus();
  const badge = document.getElementById("daily-banner-status");
  const sub   = document.getElementById("daily-banner-sub");
  const btn   = document.getElementById("daily-banner-btn");
  const dayName = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  if (!badge || !sub || !btn) return;
  if (status === "done") {
    badge.textContent = " ✓";
    badge.style.color = "var(--green-li)";
    sub.textContent = "Reviens demain pour un nouveau défi.";
    btn.textContent = "Revoir";
  } else {
    badge.textContent = "";
    sub.textContent = "Résous le défi du " + dayName + " pour +50 XP bonus.";
    btn.textContent = "Relever le défi";
  }
}

// État de la modale
let _dailyTerm = null;

function openDaily() {
  const idx = _dayIndex();
  const ch  = DAILY_POOL[idx];
  const state = _loadDaily();
  const today = _todayKey();
  const alreadyDone = state.date === today && state.done;

  document.getElementById("daily-date").textContent = "📅 " + new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" });
  document.getElementById("daily-reward").textContent = alreadyDone ? "✓ Terminé aujourd'hui" : "+50 XP bonus";
  document.getElementById("daily-title").textContent = ch.title;
  document.getElementById("daily-desc").innerHTML = ch.desc + (alreadyDone ? '<br><span style="color:var(--green-li);font-size:12px">Tu peux le refaire pour t\'entraîner (sans récompense).</span>' : "");
  document.getElementById("daily-status").innerHTML = "";

  // Init terminal si pas déjà fait
  const termEl = document.getElementById("daily-terminal");
  termEl.innerHTML = "";
  _dailyTerm = new Terminal(termEl);
  _dailyTerm.loadFS(ch.fs);
  _dailyTerm.printInfo("🎯 " + ch.title);
  _dailyTerm.printOut("");
  _dailyTerm.printOut("Astuce cachée : " + (alreadyDone ? ch.hint : "clique 3 fois sur le titre pour voir l'indice"));

  // Astuce à révéler
  let clicks = 0;
  const titleEl = document.getElementById("daily-title");
  titleEl.style.cursor = "pointer";
  titleEl.onclick = () => {
    clicks++;
    if (clicks === 3 && !alreadyDone) {
      _dailyTerm.printInfo("💡 " + ch.hint);
      titleEl.onclick = null;
    }
  };

  document.getElementById("modal-daily").classList.add("open");
  setTimeout(() => document.getElementById("daily-cmd").focus(), 150);
}

function _dailyRun() {
  const idx = _dayIndex();
  const ch  = DAILY_POOL[idx];
  const input = document.getElementById("daily-cmd");
  const raw = input.value.trim();
  if (!raw) return;
  input.value = "";
  if (typeof bumpStat === "function") bumpStat(raw.split(/\s+/)[0]);

  const result = _dailyTerm.run(raw);
  const out = result.output || "";

  let ok = false;
  try { ok = ch.check(out.toLowerCase(), _dailyTerm.state); } catch(e) {}
  if (!ok) return;

  const state = _loadDaily();
  const today = _todayKey();
  const first = !(state.date === today && state.done);

  if (first) {
    _saveDaily({ date: today, done: true, idx });
    if (typeof addXP === "function") addXP(50);
    if (typeof SFX !== "undefined") SFX.success();
    if (typeof burstParticles === "function") burstParticles(window.innerWidth/2, window.innerHeight*0.35);
    _dailyTerm.printOk("✅ Défi du jour réussi ! +50 XP bonus");
    document.getElementById("daily-status").innerHTML = '<div class="daily-success">🎉 Bravo ! Reviens demain pour un nouveau défi.</div>';
    if (typeof showAchievement === "function") showAchievement("📅", "Défi du jour", "Bonus quotidien débloqué !");
    updateDailyBanner();
  } else {
    _dailyTerm.printOk("✅ Correct ! (déjà validé aujourd'hui)");
  }
}

function initDailyModal() {
  const runBtn = document.getElementById("daily-run");
  const input  = document.getElementById("daily-cmd");
  const close  = document.getElementById("daily-close");
  if (!runBtn || !input) return;
  runBtn.addEventListener("click", _dailyRun);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") _dailyRun();
    else if (e.key === "Tab") { e.preventDefault(); if (_dailyTerm) _dailyTerm.autocomplete(input); }
  });
  close.addEventListener("click", () => document.getElementById("modal-daily").classList.remove("open"));
  document.getElementById("modal-daily").addEventListener("click", e => {
    if (e.target.id === "modal-daily") document.getElementById("modal-daily").classList.remove("open");
  });
}
