// game.js — Logique principale LinuxDojo v3

const SAVE_KEY = "linuxdojo_v3";

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultSave();
    const s = JSON.parse(raw);
    s.completed = new Set(s.completed || []);
    return s;
  } catch { return defaultSave(); }
}
function defaultSave() { return { xp: 0, completed: new Set(), badges: [] }; }
function persist() {
  const s = { ...GAME, completed: [...GAME.completed] };
  localStorage.setItem(SAVE_KEY, JSON.stringify(s));
}

const BADGES = [
  { id: "first_blood", label: "🩸 Premier sang",  cond: g => g.completed.size >= 1 },
  { id: "chapter1",    label: "📁 Explorateur",   cond: g => [1,2,3,4,5,6].every(id => g.completed.has(id)) },
  { id: "chapter2",    label: "✏️ Artisan",        cond: g => [7,8,9,10,11,12].every(id => g.completed.has(id)) },
  { id: "chapter3",    label: "🔍 Détective",     cond: g => [13,14,15,16,17,18].every(id => g.completed.has(id)) },
  { id: "chapter4",    label: "🔐 Gardien",       cond: g => [19,20,21,22,23,24].every(id => g.completed.has(id)) },
  { id: "master",      label: "⚡ Maître Linux",  cond: g => g.completed.size >= 30 },
  { id: "xp100",       label: "💯 Centurion",     cond: g => g.xp >= 100 },
  { id: "xp500",       label: "🔥 Inferno",       cond: g => g.xp >= 500 },
  { id: "xp1000",      label: "👑 Légende",       cond: g => g.xp >= 1000 },
];

function checkBadges() {
  BADGES.forEach(b => {
    if (!GAME.badges.includes(b.id) && b.cond(GAME)) {
      GAME.badges.push(b.id);
      showToast("🏅 Badge débloqué : " + b.label);
    }
  });
}

function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast-item";
  el.textContent = msg;
  document.getElementById("toast-container").appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function addXP(amount) {
  GAME.xp += amount;
  persist();
  updateXPBar();
  checkBadges();
  updateHomeStats();
}

let GAME = loadSave();
let currentMission = null;
let hintUsed = false;
let cmdHistory = [];
let histIdx = -1;

const $ = id => document.getElementById(id);
const term = new Terminal($("terminal"));

// Navigation
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  $("page-" + id).classList.add("active");
  document.querySelector('.nav-btn[data-page="' + id + '"]')?.classList.add("active");
  if (id === "explore"   && !gsInitialized) { initGameShell();  gsInitialized = true; }
  if (id === "challenge" && !chInitialized) { initChallenges(); chInitialized = true; }
  if (id === "bandit"    && !bnInitialized) { initBandit();     bnInitialized = true; }
  if (id === "learn"     && !learnInit)     { initLearn();      learnInit = true; }
}

let gsInitialized = false, chInitialized = false, bnInitialized = false, learnInit = false;

document.querySelectorAll(".nav-btn[data-page]").forEach(btn => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});
document.querySelectorAll("[data-page]:not(.nav-btn)").forEach(el => {
  el.addEventListener("click", () => showPage(el.dataset.page));
});
$("nav-logo").addEventListener("click", () => showPage("home"));

function updateXPBar() {
  const lv  = Math.floor(GAME.xp / 100) + 1;
  const pct = GAME.xp % 100;
  $("nav-xp-fill").style.width = pct + "%";
  $("nav-lv").textContent    = "Lv " + lv;
  $("nav-xp-label").textContent = GAME.xp + " XP";
}

function updateHomeStats() {
  const done = GAME.completed.size;
  if (done > 0 || GAME.xp > 0) {
    $("home-stats-row").style.display = "flex";
    $("hs-xp").textContent     = GAME.xp;
    $("hs-done").textContent   = done;
    $("hs-lv").textContent     = Math.floor(GAME.xp / 100) + 1;
    $("hs-badges").textContent = GAME.badges.length;
  }
}

// MODE APPRENDRE
function initLearn() {
  renderSidebar();
  const all = CHAPTERS.flatMap(c => c.missions);
  loadMission(all.find(m => !GAME.completed.has(m.id)) || all[0]);
}

function renderSidebar() {
  const list = $("chapter-list");
  list.innerHTML = "";
  CHAPTERS.forEach(ch => {
    const done = ch.missions.filter(m => GAME.completed.has(m.id)).length;
    const block = document.createElement("div");
    block.className = "chapter-block";
    const header = document.createElement("div");
    header.className = "chapter-header";
    header.innerHTML = '<span>' + ch.title + '</span><span class="chapter-progress">' + done + '/' + ch.missions.length + '</span>';
    block.appendChild(header);
    ch.missions.forEach((m, i) => {
      const chPrev  = ch.id === 1 || GAME.completed.has(CHAPTERS[ch.id-2].missions.at(-1).id);
      const prev    = i === 0 || GAME.completed.has(ch.missions[i-1].id);
      const unlock  = chPrev && (i === 0 || prev || GAME.completed.has(m.id));
      const isDone  = GAME.completed.has(m.id);
      const active  = currentMission && currentMission.id === m.id;
      const item    = document.createElement("div");
      item.className = "mission-item" + (active?" active":"") + (isDone?" done":"") + (!unlock?" locked":"");
      item.innerHTML = '<span class="mi-icon">' + (isDone?"✓":(!unlock?"🔒":"○")) + '</span><div class="mi-info"><div class="mi-name">' + m.name + '</div><div class="mi-cmd">' + m.cmd + '</div></div>';
      if (unlock) item.addEventListener("click", () => loadMission(m));
      block.appendChild(item);
    });
    list.appendChild(block);
  });
}

function loadMission(m) {
  currentMission = m;
  hintUsed = false;
  renderLesson(m.lesson);
  showView("lesson");
  renderSidebar();
}

function renderLesson(l) {
  if (!l) { showView("exercise"); loadExercise(); return; }
  $("lesson-title").innerHTML = l.title;
  $("lesson-intro").innerHTML = l.intro;
  $("lesson-syntax").textContent = l.syntax;
  const optEl = $("lesson-options");
  optEl.innerHTML = "";
  if (l.options && l.options.length) {
    $("lesson-options-block").style.display = "";
    l.options.forEach(o => {
      const row = document.createElement("div");
      row.className = "option-row";
      row.innerHTML = '<span class="option-flag">' + o.flag + '</span><span class="option-desc">' + o.desc + '</span>';
      optEl.appendChild(row);
    });
  } else { $("lesson-options-block").style.display = "none"; }
  const exEl = $("lesson-examples");
  exEl.innerHTML = "";
  l.examples.forEach(ex => {
    const row = document.createElement("div");
    row.className = "example-row";
    row.innerHTML = '<span class="example-cmd">$ ' + ex.cmd + '</span><span class="example-comment">' + ex.comment + '</span>';
    exEl.appendChild(row);
  });
  if (l.tip) {
    $("lesson-tip-block").style.display = "flex";
    $("lesson-tip").innerHTML = l.tip.replace(/`([^`]+)`/g, '<code>$1</code>');
  } else { $("lesson-tip-block").style.display = "none"; }
  $("lesson-scroll").scrollTop = 0;
}

function showView(id) {
  $("view-lesson").style.display   = id === "lesson"   ? "flex" : "none";
  $("view-exercise").style.display = id === "exercise" ? "flex" : "none";
}

function loadExercise() {
  const m = currentMission;
  $("mp-name").textContent   = m.name;
  $("mp-xp-tag").textContent = "+" + m.xp + " XP";
  $("mp-desc").innerHTML     = m.desc;
  $("hint-text").style.display = "none";
  term.clear();
  term.loadFS(m.fs);
  term.printInfo("══ Mission " + m.id + "/30 ══");
  term.printOut("");
  $("cmd-input").focus();
}

function runLearnCommand(raw) {
  if (!raw.trim()) return;
  cmdHistory.unshift(raw); histIdx = -1;
  const result = term.run(raw);
  const output = result.output || "";
  if (currentMission && !GAME.completed.has(currentMission.id)) {
    let ok = false;
    try { ok = currentMission.check(output.toLowerCase(), term.state); } catch(e) {}
    if (ok) setTimeout(() => onMissionSuccess(currentMission), 200);
  }
}

function onMissionSuccess(m) {
  GAME.completed.add(m.id);
  addXP(m.xp);
  renderSidebar();
  const all = CHAPTERS.flatMap(c => c.missions);
  const next = all.find(x => x.id === m.id + 1);
  $("win-title").textContent = "Mission accomplie !";
  $("win-xp").textContent    = "+" + m.xp + " XP — Total : " + GAME.xp + " XP";
  $("win-explanation").innerHTML = m.explanation || "";
  const br = $("win-badge-row");
  br.innerHTML = "";
  BADGES.filter(b => GAME.badges.includes(b.id)).slice(-2).forEach(b => {
    const pill = document.createElement("span");
    pill.className = "badge-pill";
    pill.textContent = b.label;
    br.appendChild(pill);
  });
  const bn2 = $("win-next");
  if (next) { bn2.style.display=""; bn2.onclick=()=>{closeModal("modal-win");loadMission(next);}; }
  else { bn2.style.display="none"; }
  openModal("modal-win");
}

$("btn-go-exercise").addEventListener("click", () => { showView("exercise"); loadExercise(); });
$("btn-back-lesson").addEventListener("click", () => { renderLesson(currentMission.lesson); showView("lesson"); });
$("run-btn").addEventListener("click", () => { const v=$("cmd-input").value.trim(); if(v){runLearnCommand(v);$("cmd-input").value="";} });
$("cmd-input").addEventListener("keydown", e => {
  if (e.key==="Enter") { runLearnCommand($("cmd-input").value.trim()); $("cmd-input").value=""; }
  else if (e.key==="ArrowUp") { e.preventDefault(); if(histIdx<cmdHistory.length-1){histIdx++;$("cmd-input").value=cmdHistory[histIdx]||"";} }
  else if (e.key==="ArrowDown") { e.preventDefault(); if(histIdx>0){histIdx--;$("cmd-input").value=cmdHistory[histIdx]||"";}else{histIdx=-1;$("cmd-input").value="";} }
});
$("btn-hint").addEventListener("click", () => {
  if (!currentMission) return;
  const ht = $("hint-text");
  if (ht.style.display==="none"||!ht.style.display) {
    ht.textContent="💡 "+currentMission.hint; ht.style.display="inline";
    if (!hintUsed) { hintUsed=true; GAME.xp=Math.max(0,GAME.xp-5); persist(); updateXPBar(); }
  } else { ht.style.display="none"; }
});

// MODE EXPLORER
let gsObj = null;
function initGameShell() {
  gsObj = new GameShell($("explore-terminal"),$("explore-cmd"),$("explore-run"),null,$("explore-location-name"),$("explore-location-desc"),$("explore-visual"),$("explore-exits"));
  gsObj.init();
}

// MODE DÉFIS
let chObj = null;
function initChallenges() {
  chObj = new ChallengeMode({
    termEl:$("challenge-terminal"),inputEl:$("ch-cmd"),runBtn:$("ch-run"),
    descEl:$("ch-desc"),numEl:$("ch-num"),catEl:$("ch-category"),xpEl:$("ch-xp-reward"),
    timerBar:$("ch-timer-fill"),timerLbl:$("ch-timer-label"),skipBtn:$("ch-skip"),dotsEl:$("ch-dots"),
  });
  chObj.init();
}

// MODE BANDIT
let bnObj = null;
function initBandit() {
  bnObj = new BanditMode({
    termEl:$("bandit-terminal"),inputEl:$("bandit-cmd"),runBtn:$("bandit-run"),
    levelsList:$("bandit-levels-list"),badgeEl:$("bl-badge"),titleEl:$("bl-title"),
    descEl:$("bl-desc"),hintsEl:$("bl-hints"),winModal:$("modal-bandit-win"),
    winMsg:$("bandit-win-msg"),winNext:$("bandit-win-next"),winClose:$("bandit-win-close"),
  });
  bnObj.init();
}

// Modales
function openModal(id)  { $(id).classList.add("open"); }
function closeModal(id) { $(id).classList.remove("open"); }
$("win-close").addEventListener("click", () => closeModal("modal-win"));
$("modal-win").addEventListener("click", e => { if(e.target===$("modal-win")) closeModal("modal-win"); });

// Init
updateXPBar();
updateHomeStats();
