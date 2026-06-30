// bandit.js — Mode infiltration style Bandit/OverTheWire

const BANDIT_LEVELS = [
  {
    id: 0,
    title: "Niveau 0 — Connexion",
    desc: "Le mot de passe du niveau suivant est stocké dans un fichier appelé <strong>readme</strong> dans le répertoire home. Trouve-le.",
    hints: ["ls", "cat"],
    password: "boJ9jbbUNNfktd78OOpsqOltutMc3MY1",
    fs: {
      "readme": { type:"file", content:"Le mot de passe pour le niveau 1 est :\nboJ9jbbUNNfktd78OOpsqOltutMc3MY1" },
      "notes.txt": { type:"file", content:"Des notes sans importance." }
    },
    check: (out) => /boJ9jbbUNNfktd78OOpsqOltutMc3MY1/.test(out)
  },
  {
    id: 1,
    title: "Niveau 1 — Fichier caché",
    desc: "Le mot de passe est dans un fichier <strong>caché</strong> dans ce répertoire. Les fichiers cachés commencent par un point.",
    hints: ["ls -la", "cat .fichier"],
    password: "CV1DtqXWVFXTvM2F0k09SHz0YwRINYA9",
    fs: {
      "info.txt": { type:"file", content:"Rien ici..." },
      ".password": { type:"file", content:"CV1DtqXWVFXTvM2F0k09SHz0YwRINYA9" },
      ".bash_history": { type:"file", content:"ls\npwd\n" }
    },
    check: (out) => /CV1DtqXWVFXTvM2F0k09SHz0YwRINYA9/.test(out)
  },
  {
    id: 2,
    title: "Niveau 2 — Chercher dans les dossiers",
    desc: "Le mot de passe est caché quelque part dans le dossier <strong>data/</strong>. Il y a beaucoup de fichiers. Utilise <strong>find</strong> pour localiser le fichier <strong>password.txt</strong>.",
    hints: ["ls", "find . -name 'password.txt'", "cat"],
    password: "UmHadQclWmgdLOKQ3YNgjWxGoRMb5luK",
    fs: {
      "data": { type:"dir" },
      "data/password.txt": { type:"file", content:"UmHadQclWmgdLOKQ3YNgjWxGoRMb5luK" },
      "data/fake1.txt": { type:"file", content:"faux" },
      "data/fake2.txt": { type:"file", content:"faux aussi" },
      "readme.txt": { type:"file", content:"Le mot de passe est quelque part dans data/" }
    },
    check: (out) => /UmHadQclWmgdLOKQ3YNgjWxGoRMb5luK/.test(out)
  },
  {
    id: 3,
    title: "Niveau 3 — Grep dans les logs",
    desc: "Le mot de passe a été loggé dans <strong>server.log</strong> mais noyé dans des milliers de lignes. Il est sur une ligne commençant par <strong>PASSWORD:</strong>",
    hints: ["grep 'PASSWORD:' server.log"],
    password: "pIwrPrtPN36QITb57gnewQ8rLC9B3EAw",
    fs: {
      "server.log": { type:"file", content:"INFO 2024-01-01 démarrage\nINFO 2024-01-01 connexion ok\nDEBUG requête reçue\nINFO traitement\nPASSWORD: pIwrPrtPN36QITb57gnewQ8rLC9B3EAw\nINFO fin de session\nDEBUG nettoyage\nINFO arrêt" }
    },
    check: (out) => /pIwrPrtPN36QITb57gnewQ8rLC9B3EAw/.test(out)
  },
  {
    id: 4,
    title: "Niveau 4 — Compter pour trouver",
    desc: "Il y a plusieurs fichiers dans ce dossier. Le bon fichier est celui qui contient exactement <strong>1 ligne</strong>. Utilise <strong>wc -l</strong> pour trouver lequel.",
    hints: ["wc -l *.txt", "cat fichier_avec_1_ligne.txt"],
    password: "koReBOKuIDDepwhWk7jZC0RTdopnAYKh",
    fs: {
      "file1.txt": { type:"file", content:"ligne1\nligne2\nligne3" },
      "file2.txt": { type:"file", content:"koReBOKuIDDepwhWk7jZC0RTdopnAYKh" },
      "file3.txt": { type:"file", content:"a\nb\nc\nd" },
      "file4.txt": { type:"file", content:"x\ny" }
    },
    check: (out) => /koReBOKuIDDepwhWk7jZC0RTdopnAYKh/.test(out)
  },
  {
    id: 5,
    title: "Niveau 5 — Tri et filtrage",
    desc: "Le fichier <strong>passwords.txt</strong> contient beaucoup de chaînes. Le vrai mot de passe est la seule ligne qui apparaît <strong>une seule fois</strong> (pas de doublon). Utilise <strong>sort</strong> et observe.",
    hints: ["sort passwords.txt", "sort -u passwords.txt"],
    password: "DXjZPULLxYr17uwoI01bNLQbtFemEgo7",
    fs: {
      "passwords.txt": { type:"file", content:"fakepass1\nfakepass2\nfakepass1\nDXjZPULLxYr17uwoI01bNLQbtFemEgo7\nfakepass3\nfakepass2\nfakepass3\nfakepass4\nfakepass4" }
    },
    check: (out) => /DXjZPULLxYr17uwoI01bNLQbtFemEgo7/.test(out)
  },
  {
    id: 6,
    title: "Niveau 6 — Variables d'environnement",
    desc: "Le mot de passe est stocké dans une variable d'environnement. Affiche la valeur de <strong>$SECRET_PASS</strong>.",
    hints: ["echo $SECRET_PASS", "env | grep SECRET"],
    password: "HKBPTKQnIay4Fw76bEy8PvcpvvbGY7zi",
    fs: {},
    envVars: { "SECRET_PASS": "HKBPTKQnIay4Fw76bEy8PvcpvvbGY7zi" },
    check: (out) => /HKBPTKQnIay4Fw76bEy8PvcpvvbGY7zi/.test(out)
  },
  {
    id: 7,
    title: "Niveau 7 — Sed pour décoder",
    desc: "Le fichier <strong>encoded.txt</strong> contient le mot de passe, mais <strong>PASS:</strong> a été remplacé par <strong>XXXX:</strong>. Utilise <strong>sed</strong> pour le retrouver.",
    hints: ["cat encoded.txt", "sed 's/XXXX/PASS/' encoded.txt", "grep PASS encoded.txt"],
    password: "cvX2JJa4CFALtqS87jk27qwqGhBM9plV",
    fs: {
      "encoded.txt": { type:"file", content:"INFO système opérationnel\nXXXX: cvX2JJa4CFALtqS87jk27qwqGhBM9plV\nINFO fin du log" }
    },
    check: (out) => /cvX2JJa4CFALtqS87jk27qwqGhBM9plV/.test(out)
  },
  {
    id: 8,
    title: "Niveau 8 — Extraction CSV",
    desc: "Le fichier <strong>users.csv</strong> contient des utilisateurs. Le mot de passe est dans la 3ème colonne de la ligne de l'utilisateur <strong>admin</strong>. Utilise <strong>grep</strong> puis <strong>awk</strong>.",
    hints: ["grep admin users.csv", "grep admin users.csv | awk -F',' '{print $3}'"],
    password: "UsvVyFSfZZWbi6wgC7dAFyFuR6jQQUhR",
    fs: {
      "users.csv": { type:"file", content:"user,role,password\nalice,viewer,fakepass1\nbob,editor,fakepass2\nadmin,superuser,UsvVyFSfZZWbi6wgC7dAFyFuR6jQQUhR\ncarla,viewer,fakepass3" }
    },
    check: (out) => /UsvVyFSfZZWbi6wgC7dAFyFuR6jQQUhR/.test(out)
  },
  {
    id: 9,
    title: "Niveau 9 — Le boss final",
    desc: "Le mot de passe final est caché en profondeur. Il faut : 1) trouver le fichier avec <strong>find</strong>, 2) filtrer avec <strong>grep</strong>, 3) extraire la valeur avec <strong>awk</strong>. Bonne chance.",
    hints: ["find . -name '*.log'", "grep 'MASTER_KEY' fichier.log", "grep 'MASTER_KEY' fichier.log | awk '{print $2}'"],
    password: "fGrHPx402xGC7U7rXKDaxiWFTOiF0ENq",
    fs: {
      "system.log":  { type:"file", content:"INFO boot\nINFO services started\nDEBUG routine check\n" },
      "access.log":  { type:"file", content:"GET / 200\nGET /api 200\nPOST /login 401\n" },
      "master.log":  { type:"file", content:"INFO system ready\nMASTER_KEY fGrHPx402xGC7U7rXKDaxiWFTOiF0ENq\nINFO encryption active\n" },
      "debug.log":   { type:"file", content:"DEBUG verbose output\nDEBUG memory ok\n" }
    },
    check: (out) => /fGrHPx402xGC7U7rXKDaxiWFTOiF0ENq/.test(out)
  }
];

class BanditMode {
  constructor(opts) {
    this.termEl      = opts.termEl;
    this.inputEl     = opts.inputEl;
    this.runBtn      = opts.runBtn;
    this.levelsList  = opts.levelsList;
    this.badgeEl     = opts.badgeEl;
    this.titleEl     = opts.titleEl;
    this.descEl      = opts.descEl;
    this.hintsEl     = opts.hintsEl;
    this.winModal    = opts.winModal;
    this.winMsg      = opts.winMsg;
    this.winNext     = opts.winNext;
    this.winClose    = opts.winClose;

    this.current     = 0;
    this.completed   = new Set();
    this.term        = new Terminal(this.termEl);

    this._bindEvents();
  }

  init() {
    this._renderLevels();
    this._loadLevel(0);
  }

  _bindEvents() {
    this.runBtn.addEventListener("click", () => this._run());
    this.inputEl.addEventListener("keydown", e => { if (e.key === "Enter") this._run(); });
    this.winClose.addEventListener("click", () => this.winModal.classList.remove("open"));
    this.winNext.addEventListener("click", () => {
      this.winModal.classList.remove("open");
      if (this.current < BANDIT_LEVELS.length - 1) {
        this._loadLevel(this.current + 1);
      }
    });
  }

  _loadLevel(idx) {
    const lv = BANDIT_LEVELS[idx];
    if (!lv) return;
    this.current = idx;

    this.term.clear();
    this.term.loadFS(lv.fs);

    // Injecter les variables d'env si besoin
    if (lv.envVars) {
      this.term._envVars = lv.envVars;
    } else {
      this.term._envVars = {};
    }

    this.term.printInfo("🔐 " + lv.title);
    this.term.printOut("");
    this.term.printOut("Explore le filesystem. Trouve le mot de passe pour passer au niveau suivant.");
    this.term.printOut("");

    this.badgeEl.textContent = "Niveau " + idx;
    this.titleEl.textContent = lv.title;
    this.descEl.innerHTML    = lv.desc;

    this.hintsEl.innerHTML = "";
    lv.hints.forEach(h => {
      const tag = document.createElement("span");
      tag.className = "hint-tag";
      tag.textContent = h;
      this.hintsEl.appendChild(tag);
    });

    this._renderLevels();
    this.inputEl.focus();
  }

  _run() {
    const raw = this.inputEl.value.trim();
    if (!raw) return;
    this.inputEl.value = "";

    // Patch pour les variables d'env
    const lv = BANDIT_LEVELS[this.current];
    if (lv.envVars && raw.startsWith("echo $")) {
      const varName = raw.replace("echo $", "").trim();
      const val = lv.envVars[varName];
      if (val) {
        this.term.printPrompt(raw);
        // Afficher manuellement
        const d = document.createElement("div");
        d.className = "t-line t-out";
        d.textContent = val;
        this.termEl.appendChild(d);
        this.termEl.scrollTop = this.termEl.scrollHeight;
        this._checkWin(val);
        return;
      }
    }

    const result = this.term.run(raw);
    const out    = result.output || "";
    this._checkWin(out);
  }

  _checkWin(out) {
    const lv = BANDIT_LEVELS[this.current];
    let success = false;
    try { success = lv.check(out); } catch(e) {}

    if (success && !this.completed.has(this.current)) {
      this.completed.add(this.current);
      if (typeof addXP === "function") addXP(60);
      setTimeout(() => {
        this.winMsg.textContent = "Mot de passe trouvé : " + lv.password + "\n\n+60 XP";
        const nextLv = BANDIT_LEVELS[this.current + 1];
        this.winNext.style.display = nextLv ? "" : "none";
        this.winModal.classList.add("open");
        this._renderLevels();
      }, 300);
    }
  }

  _renderLevels() {
    this.levelsList.innerHTML = "";
    BANDIT_LEVELS.forEach((lv, i) => {
      const unlocked = i === 0 || this.completed.has(i - 1);
      const isDone   = this.completed.has(i);
      const isActive = i === this.current;

      const item = document.createElement("div");
      item.className = "bandit-level-item"
        + (isActive  ? " active"  : "")
        + (isDone    ? " done"    : "")
        + (!unlocked ? " locked"  : "");

      item.innerHTML = `
        <span class="bli-num">Lv ${i}</span>
        <span class="bli-name">${lv.title.split("—")[1]?.trim() || lv.title}</span>
        ${isDone ? '<span class="bli-check">✓</span>' : (!unlocked ? "🔒" : "")}
      `;

      if (unlocked) item.addEventListener("click", () => this._loadLevel(i));
      this.levelsList.appendChild(item);
    });
  }
}
