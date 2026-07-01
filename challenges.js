// challenges.js — Mode défis style cmdchallenge

const CHALLENGES = [
  {
    id: 1,
    category: "Navigation",
    desc: "Affiche le contenu du répertoire courant.",
    xp: 10,
    timeLimit: 60,
    fs: { "app.js": { type:"file", content:"// app" }, "readme.txt": { type:"file", content:"readme" }, "logs": { type:"dir" } },
    check: (out) => /app|readme|logs/.test(out),
    solution: "ls"
  },
  {
    id: 2,
    category: "Navigation",
    desc: "Affiche le chemin absolu du répertoire courant.",
    xp: 10,
    timeLimit: 45,
    fs: {},
    check: (out) => /\/home\/user/.test(out),
    solution: "pwd"
  },
  {
    id: 3,
    category: "Fichiers",
    desc: "Affiche le contenu du fichier <strong>message.txt</strong>.",
    xp: 15,
    timeLimit: 60,
    fs: { "message.txt": { type:"file", content:"Bonjour depuis le défi !" } },
    check: (out) => /bonjour/i.test(out),
    solution: "cat message.txt"
  },
  {
    id: 4,
    category: "Fichiers cachés",
    desc: "Liste <strong>tous</strong> les fichiers, y compris les cachés.",
    xp: 15,
    timeLimit: 60,
    fs: { "visible.txt": { type:"file", content:"" }, ".cache": { type:"file", content:"caché" }, ".env": { type:"file", content:"secret" } },
    check: (out) => /\.cache|\.env/.test(out),
    solution: "ls -a"
  },
  {
    id: 5,
    category: "Grep",
    desc: "Trouve les lignes contenant <strong>ERROR</strong> dans <strong>app.log</strong>.",
    xp: 20,
    timeLimit: 90,
    fs: { "app.log": { type:"file", content:"INFO démarrage\nERROR timeout\nINFO ok\nERROR crash\nINFO succès" } },
    check: (out) => /timeout|crash/i.test(out) && !/info/i.test(out),
    solution: "grep ERROR app.log"
  },
  {
    id: 6,
    category: "Création",
    desc: "Crée un dossier nommé <strong>archive</strong>.",
    xp: 15,
    timeLimit: 45,
    fs: {},
    check: (out, s) => s.mkdir === "archive",
    solution: "mkdir archive"
  },
  {
    id: 7,
    category: "Grep",
    desc: "Cherche <strong>linux</strong> dans <strong>notes.txt</strong> sans tenir compte de la casse.",
    xp: 20,
    timeLimit: 90,
    fs: { "notes.txt": { type:"file", content:"J'aime Linux\nLINUX est puissant\nlinux domine les serveurs\nMac est différent" } },
    check: (out) => out.toLowerCase().split("\n").filter(l => /linux/i.test(l)).length >= 2,
    solution: "grep -i linux notes.txt"
  },
  {
    id: 8,
    category: "Pipes",
    desc: "Liste les fichiers et filtre uniquement les <strong>.log</strong> avec un pipe.",
    xp: 25,
    timeLimit: 90,
    fs: { "app.js": { type:"file", content:"" }, "error.log": { type:"file", content:"" }, "access.log": { type:"file", content:"" }, "style.css": { type:"file", content:"" } },
    check: (out) => /\.log/.test(out) && !/\.js|\.css/.test(out),
    solution: "ls | grep .log"
  },
  {
    id: 9,
    category: "Comptage",
    desc: "Compte le nombre de lignes dans <strong>data.txt</strong>.",
    xp: 25,
    timeLimit: 90,
    fs: { "data.txt": { type:"file", content:"ligne1\nligne2\nligne3\nligne4\nligne5" } },
    check: (out) => /5/.test(out),
    solution: "wc -l data.txt"
  },
  {
    id: 10,
    category: "Recherche",
    desc: "Trouve tous les fichiers <strong>.sh</strong> dans le répertoire courant.",
    xp: 30,
    timeLimit: 120,
    fs: { "deploy.sh": { type:"file", content:"" }, "backup.sh": { type:"file", content:"" }, "app.js": { type:"file", content:"" }, "readme.txt": { type:"file", content:"" } },
    check: (out) => /deploy\.sh/.test(out) && /backup\.sh/.test(out) && !/\.js|\.txt/.test(out),
    solution: "find . -name '*.sh'"
  },
  {
    id: 11,
    category: "Pipes avancé",
    desc: "Compte combien de lignes contiennent <strong>ERROR</strong> dans <strong>app.log</strong>.",
    xp: 35,
    timeLimit: 120,
    fs: { "app.log": { type:"file", content:"INFO ok\nERROR crash\nINFO ok\nERROR timeout\nERROR null\nINFO ok" } },
    check: (out) => /3/.test(out),
    solution: "grep ERROR app.log | wc -l"
  },
  {
    id: 12,
    category: "Tri",
    desc: "Trie le fichier <strong>noms.txt</strong> par ordre alphabétique.",
    xp: 25,
    timeLimit: 90,
    fs: { "noms.txt": { type:"file", content:"Zara\nAlice\nMike\nBob\nCarla" } },
    check: (out) => { const l = out.split("\n").filter(Boolean); return l[0] === "Alice" || l[0] === "Bob"; },
    solution: "sort noms.txt"
  },
  {
    id: 13,
    category: "Remplacement",
    desc: "Remplace <strong>dev</strong> par <strong>prod</strong> dans <strong>config.txt</strong>.",
    xp: 40,
    timeLimit: 120,
    fs: { "config.txt": { type:"file", content:"HOST=dev.server.com\nDB=dev.db.com\nENV=dev" } },
    check: (out) => /prod/.test(out) && !/dev/.test(out),
    solution: "sed 's/dev/prod/g' config.txt"
  },
  {
    id: 14,
    category: "Permissions",
    desc: "Affiche les permissions détaillées de tous les fichiers.",
    xp: 20,
    timeLimit: 60,
    fs: { "script.sh": { type:"file", perms:"-rwxr-xr-x", content:"" }, "config.txt": { type:"file", perms:"-rw-r--r--", content:"" } },
    check: (out) => /rwx|rw-|r--/.test(out),
    solution: "ls -l"
  },
  {
    id: 15,
    category: "Extraction",
    desc: "Affiche seulement la première colonne de <strong>data.csv</strong> (séparateur virgule).",
    xp: 50,
    timeLimit: 150,
    fs: { "data.csv": { type:"file", content:"Alice,25,Paris\nBob,30,Lyon\nCarla,22,Marseille" } },
    check: (out) => /alice|bob|carla/i.test(out) && !/25|30|22/.test(out),
    solution: "awk -F',' '{print $1}' data.csv"
  }
];

class ChallengeMode {
  constructor(opts) {
    this.termEl   = opts.termEl;
    this.inputEl  = opts.inputEl;
    this.runBtn   = opts.runBtn;
    this.descEl   = opts.descEl;
    this.numEl    = opts.numEl;
    this.catEl    = opts.catEl;
    this.xpEl     = opts.xpEl;
    this.timerBar = opts.timerBar;
    this.timerLbl = opts.timerLbl;
    this.skipBtn  = opts.skipBtn;
    this.dotsEl   = opts.dotsEl;

    this.current  = 0;
    this.timer    = null;
    this.timeLeft = 0;
    this.term     = new Terminal(this.termEl);

    this._bindEvents();
  }

  init() {
    this.current = 0;
    this._loadChallenge(0);
    this._renderDots();
  }

  _bindEvents() {
    this.runBtn.addEventListener("click", () => this._run());
    this.inputEl.addEventListener("keydown", e => {
      if (e.key === "Enter") this._run();
      else if (e.key === "Tab") { e.preventDefault(); this.term.autocomplete(this.inputEl); }
    });
    this.skipBtn.addEventListener("click", () => this._next());
  }

  _loadChallenge(idx) {
    const ch = CHALLENGES[idx];
    if (!ch) return;

    this.term.clear();
    this.term.loadFS(ch.fs);
    this.term.printInfo("⚡ Défi " + (idx+1) + "/" + CHALLENGES.length + " — " + ch.category);
    this.term.printOut("");

    this.numEl.textContent = "Défi " + (idx+1);
    this.catEl.textContent = ch.category;
    this.xpEl.textContent  = "+" + ch.xp + " XP";
    this.descEl.innerHTML  = ch.desc;

    this._startTimer(ch.timeLimit);
    this._renderDots();
    this.inputEl.focus();
  }

  _run() {
    const raw = this.inputEl.value.trim();
    if (!raw) return;
    this.inputEl.value = "";

    const result = this.term.run(raw);
    const out    = result.output || "";
    const ch     = CHALLENGES[this.current];

    let success = false;
    try { success = ch.check(out.toLowerCase(), this.term.state); } catch(e) {}

    if (success) {
      clearInterval(this.timer);
      setTimeout(() => {
        this.term.printOk("✅ Défi réussi ! +" + ch.xp + " XP");
        if (typeof addXP === "function") addXP(ch.xp);
        showToast("⚡ +" + ch.xp + " XP");
        setTimeout(() => this._next(), 1200);
      }, 200);
    }
  }

  _next() {
    clearInterval(this.timer);
    if (this.current < CHALLENGES.length - 1) {
      this.current++;
      this._loadChallenge(this.current);
    } else {
      this.term.printInfo("🏆 Tous les défis terminés !");
    }
  }

  _startTimer(seconds) {
    clearInterval(this.timer);
    this.timeLeft = seconds;
    this._updateTimer();
    this.timer = setInterval(() => {
      this.timeLeft--;
      this._updateTimer();
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.term.printErr("⏰ Temps écoulé ! Solution : " + CHALLENGES[this.current].solution);
        setTimeout(() => this._next(), 2000);
      }
    }, 1000);
  }

  _updateTimer() {
    const ch  = CHALLENGES[this.current];
    const pct = (this.timeLeft / ch.timeLimit) * 100;
    this.timerBar.style.width = pct + "%";
    this.timerBar.style.background = pct > 50 ? "var(--grad-main)" : pct > 25 ? "var(--orange)" : "var(--red)";
    this.timerLbl.textContent = this.timeLeft + "s";
  }

  _renderDots() {
    this.dotsEl.innerHTML = "";
    CHALLENGES.forEach((_, i) => {
      const d = document.createElement("div");
      d.className = "ch-dot" + (i === this.current ? " active" : "") + (i < this.current ? " done" : "");
      this.dotsEl.appendChild(d);
    });
  }
}
