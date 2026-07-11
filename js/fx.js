// fx.js — Effets visuels et sonores de folie pour LinuxDojo

/* ── 1. MOTEUR SONORE ─────────────────────────────────────── */
class SoundEngine {
  constructor() { this.ctx = null; this.enabled = true; this.volume = 0.08; }
  _ensure() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext||window.webkitAudioContext)(); } catch(e) { this.enabled = false; } }
  }
  _beep(freq, dur, type="sine", vol=null) {
    if (!this.enabled) return;
    this._ensure(); if (!this.ctx) return;
    const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol ?? this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + dur);
  }
  key()     { this._beep(180 + Math.random()*80, 0.03, "square", 0.02); }
  enter()   { this._beep(320, 0.05, "square", 0.03); }
  success() { [523,659,784,1046].forEach((f,i)=>setTimeout(()=>this._beep(f,0.15,"sine",0.06),i*80)); }
  error()   { this._beep(140,0.15,"sawtooth",0.05); setTimeout(()=>this._beep(100,0.2,"sawtooth",0.05),100); }
  badge()   { [659,784,988,1318].forEach((f,i)=>setTimeout(()=>this._beep(f,0.2,"triangle",0.07),i*100)); }
  levelup() { [392,523,659,784,1046,1318].forEach((f,i)=>setTimeout(()=>this._beep(f,0.18,"sine",0.06),i*70)); }
  boot()    { this._beep(220,0.3,"sine",0.04); setTimeout(()=>this._beep(440,0.4,"sine",0.05),200); }
  glitch()  { for(let i=0;i<5;i++) setTimeout(()=>this._beep(80+Math.random()*400,0.04,"sawtooth",0.03),i*40); }
}
const SFX = new SoundEngine();

/* ── 2. MATRIX RAIN ───────────────────────────────────────── */
class MatrixRain {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "matrix-canvas";
    this.canvas.style.cssText = "position:fixed;inset:0;z-index:0;opacity:0.10;pointer-events:none;";
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.chars = "アイウエオカキクケコ0123456789ABCDEF$#@%&*<>[]{}|/\\";
    this.running = false;
    this._resize();
    window.addEventListener("resize", () => this._resize());
  }
  _resize() {
    this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight;
    this.cols = Math.floor(this.canvas.width/14);
    this.drops = Array(this.cols).fill(1);
  }
  start() { if (this.running) return; this.running = true; this._loop(); }
  stop()  { this.running = false; }
  _loop() {
    if (!this.running) return;
    this.ctx.fillStyle = "rgba(8,8,16,0.08)";
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.font = "14px monospace";
    for (let i=0;i<this.drops.length;i++) {
      const ch = this.chars[Math.floor(Math.random()*this.chars.length)];
      const x = i*14, y = this.drops[i]*14, g = Math.random();
      this.ctx.fillStyle = g>0.9 ? "#a78bfa" : g>0.7 ? "#3b82f6" : "#7c3aed";
      this.ctx.fillText(ch, x, y);
      if (y > this.canvas.height && Math.random() > 0.975) this.drops[i] = 0;
      this.drops[i]++;
    }
    requestAnimationFrame(() => this._loop());
  }
}

/* ── 3. BOOT SEQUENCE ─────────────────────────────────────── */
class BootSequence {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.lines = [
      { t:"LinuxDojo BIOS v3.0.1 — Initializing...", d:250 },
      { t:"Memory Test: 16384 MB ..................... OK", d:150 },
      { t:"Detecting CPU: Quantum Core i9 @ 4.2GHz ... OK", d:120 },
      { t:"Loading kernel modules ................... OK", d:150 },
      { t:"Mounting virtual filesystem .............. OK", d:120 },
      { t:"Starting terminal emulator ............... OK", d:120 },
      { t:"Loading skill trees ...................... OK", d:150 },
      { t:"Establishing secure connection ........... OK", d:150 },
      { t:"", d:100 },
      { t:"  ██╗     ██╗███╗   ██╗██╗   ██╗██╗  ██╗", d:35 },
      { t:"  ██║     ██║████╗  ██║██║   ██║╚██╗██╔╝", d:35 },
      { t:"  ██║     ██║██╔██╗ ██║██║   ██║ ╚███╔╝ ", d:35 },
      { t:"  ██║     ██║██║╚██╗██║██║   ██║ ██╔██╗ ", d:35 },
      { t:"  ███████╗██║██║ ╚████║╚██████╔╝██╔╝ ██╗", d:35 },
      { t:"  ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝", d:35 },
      { t:"          D O J O   —   v3.0", d:100 },
      { t:"", d:150 },
      { t:"System ready. Press any key to enter...", d:100 },
    ];
  }
  run() {
    const overlay = document.createElement("div");
    overlay.id = "boot-overlay";
    overlay.style.cssText = "position:fixed;inset:0;background:#000;z-index:9999;font-family:'JetBrains Mono',monospace;font-size:13px;color:#4ade80;padding:40px;overflow:hidden;line-height:1.6;";
    const pre = document.createElement("div");
    overlay.appendChild(pre);
    document.body.appendChild(overlay);
    let i = 0;
    const done = () => {
      SFX.boot();
      const skip = () => { overlay.style.transition="opacity 0.5s"; overlay.style.opacity="0"; setTimeout(()=>{overlay.remove(); this.onComplete&&this.onComplete();},500); document.removeEventListener("keydown",skip); overlay.removeEventListener("click",skip); };
      document.addEventListener("keydown", skip);
      overlay.addEventListener("click", skip);
    };
    const showNext = () => {
      if (i >= this.lines.length) { done(); return; }
      const line = this.lines[i];
      const div = document.createElement("div");
      if (line.t.includes("█")) div.style.color = "#7c3aed";
      if (line.t.includes("DOJO")) div.style.color = "#a78bfa";
      if (line.t.includes(" OK")) {
        div.innerHTML = line.t.replace(" OK", ' <span style="color:#4ade80">OK</span>');
      } else div.textContent = line.t;
      pre.appendChild(div);
      if (line.t && !line.t.includes("█")) SFX.key();
      i++;
      setTimeout(showNext, line.d);
    };
    overlay.addEventListener("click", () => { if (i >= 3) i = this.lines.length; });
    showNext();
  }
}

/* ── 4. ACHIEVEMENT POPUP ─────────────────────────────────── */
function showAchievement(icon, title, desc) {
  SFX.badge();
  const el = document.createElement("div");
  el.className = "achievement-popup";
  el.innerHTML = `<div class="ach-icon">${icon}</div><div class="ach-text"><div class="ach-title">🏆 Succès débloqué</div><div class="ach-name">${title}</div><div class="ach-desc">${desc}</div></div><div class="ach-shine"></div>`;
  document.body.appendChild(el);
  setTimeout(()=>el.classList.add("show"),50);
  setTimeout(()=>{el.classList.remove("show");setTimeout(()=>el.remove(),500);},4000);
}

/* ── 5. PARTICULES ────────────────────────────────────────── */
function burstParticles(x, y) {
  const colors = ["#7c3aed","#3b82f6","#06b6d4","#10b981","#eab308"];
  for (let i=0;i<40;i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const angle = (Math.PI*2*i)/40, vel = 60+Math.random()*120;
    const col = colors[Math.floor(Math.random()*colors.length)];
    p.style.cssText = `left:${x}px;top:${y}px;background:${col};box-shadow:0 0 8px ${col};`;
    document.body.appendChild(p);
    const dx = Math.cos(angle)*vel, dy = Math.sin(angle)*vel;
    p.animate([{transform:"translate(0,0) scale(1)",opacity:1},{transform:`translate(${dx}px,${dy+80}px) scale(0)`,opacity:0}],{duration:800+Math.random()*400,easing:"cubic-bezier(0.1,0.8,0.3,1)"}).onfinish=()=>p.remove();
  }
}

/* ── 6. GLITCH ────────────────────────────────────────────── */
function glitchElement(el, duration=600) {
  SFX.glitch();
  el.classList.add("glitching");
  setTimeout(()=>el.classList.remove("glitching"),duration);
}

/* ── 7. TYPEWRITER ────────────────────────────────────────── */
function typewriter(el, text, speed=30, cb) {
  el.textContent = ""; let i = 0;
  const tick = () => {
    if (i < text.length) { el.textContent += text[i]; if (text[i]!==" ") SFX.key(); i++; setTimeout(tick, speed); }
    else if (cb) cb();
  };
  tick();
}

/* ── 8. RANGS ─────────────────────────────────────────────── */
const RANKS = [
  { min: 0,    name: "Bleu",         icon: "🥚", color: "#94a3b8" },
  { min: 100,  name: "Novice",       icon: "🌱", color: "#10b981" },
  { min: 250,  name: "Apprenti",     icon: "⚡", color: "#3b82f6" },
  { min: 500,  name: "Opérateur",    icon: "🔧", color: "#06b6d4" },
  { min: 800,  name: "Hacker",       icon: "💻", color: "#7c3aed" },
  { min: 1200, name: "Sysadmin",     icon: "🛡️", color: "#a78bfa" },
  { min: 1800, name: "Root",         icon: "👑", color: "#eab308" },
  { min: 2500, name: "Légende",      icon: "🔥", color: "#f97316" },
];
function getRank(xp) { let r = RANKS[0]; for (const rank of RANKS) if (xp >= rank.min) r = rank; return r; }
function getNextRank(xp) { for (const rank of RANKS) if (xp < rank.min) return rank; return null; }

/* ── 10. RECHERCHE ARRIÈRE DANS L'HISTORIQUE (Ctrl+R, façon bash) ────── */
// Réutilisable par n'importe quel terminal du dojo qui possède déjà un
// historique de commandes (tableau du plus récent [0] au plus ancien).
// Affiche l'état de la recherche dans le placeholder du champ (le champ
// reste vide pendant la recherche, comme un vrai `(reverse-i-search)`).
class ReverseSearch {
  constructor(inputEl, getHistory) {
    this.input = inputEl;
    this.getHistory = getHistory;
    this.active = false;
    this.query = "";
    this.matchIdx = -1;
    this.savedValue = "";
    this.savedPlaceholder = "";
  }
  _search(fromIdx) {
    const hist = this.getHistory() || [];
    if (!this.query) { this.matchIdx = hist.length ? 0 : -1; return hist[0] ?? null; }
    const q = this.query.toLowerCase();
    for (let i = Math.max(fromIdx, 0); i < hist.length; i++) {
      if (hist[i].toLowerCase().includes(q)) { this.matchIdx = i; return hist[i]; }
    }
    this.matchIdx = -1;
    return null;
  }
  _render(match) {
    this.input.value = "";
    this.input.placeholder = `(recherche inversée) \`${this.query}': ${match !== null ? match : "aucune correspondance"}`;
  }
  start() {
    if (this.active) return;
    this.active = true;
    this.query = "";
    this.savedValue = this.input.value;
    this.savedPlaceholder = this.input.placeholder;
    this._render(this._search(0));
  }
  _restore() {
    this.active = false;
    this.input.value = this.savedValue;
    this.input.placeholder = this.savedPlaceholder;
  }
  // Traite une touche. Renvoie "run" si Entrée a validé un résultat (l'appelant doit
  // exécuter la commande maintenant présente dans le champ), true si la touche a été
  // consommée sans rien d'autre à faire, ou false si l'appelant doit la gérer normalement.
  handleKey(e) {
    const ctrlR = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r";
    if (!this.active) {
      if (ctrlR) { e.preventDefault(); this.start(); return true; }
      return false;
    }
    if (ctrlR) { e.preventDefault(); this._render(this._search(this.matchIdx + 1)); return true; }
    if (e.key === "Escape") { e.preventDefault(); this._restore(); return true; }
    if (e.key === "Enter") {
      e.preventDefault();
      const hist = this.getHistory() || [];
      const match = this.matchIdx >= 0 ? hist[this.matchIdx] : null;
      this.active = false;
      this.input.placeholder = this.savedPlaceholder;
      this.input.value = match || this.savedValue;
      return "run";
    }
    if (e.key === "Backspace") { e.preventDefault(); this.query = this.query.slice(0, -1); this._render(this._search(0)); return true; }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      this.query += e.key;
      this._render(this._search(0));
      return true;
    }
    // Toute autre touche (flèches, Tab...) annule la recherche et suit son cours normal
    this._restore();
    return false;
  }
}

/* ── 11. KONAMI CODE ──────────────────────────────────────── */
class EasterEggs {
  constructor() {
    this.konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    this.buffer = [];
    document.addEventListener("keydown", e => this._check(e));
  }
  _check(e) {
    this.buffer.push(e.key);
    if (this.buffer.length > this.konami.length) this.buffer.shift();
    if (this.buffer.join(",") === this.konami.join(",")) { this._activate(); this.buffer = []; }
  }
  _activate() {
    showAchievement("🎮","KONAMI CODE","Code secret trouvé ! +500 XP");
    if (typeof addXP === "function") addXP(500);
    if (typeof markSecret === "function") markSecret("konami");
    document.body.classList.add("rainbow-mode");
    SFX.levelup();
    setTimeout(()=>document.body.classList.remove("rainbow-mode"),8000);
  }
}
