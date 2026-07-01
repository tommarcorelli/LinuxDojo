// gameshell.js — Mode exploration libre style GameShell/Terminus

const WORLD = {
  "/": {
    name: "🌍 Racine du Monde",
    emoji: "🌌",
    desc: "Tu es à la racine. L'arborescence s'étend devant toi. Explore avec ls, cd, cat...",
    files: {
      "bienvenue.txt": "Bienvenue dans le Monde Linux.\n\nCe monde est un vrai filesystem.\nExplore avec ls, cd, cat, less...\n\nDes secrets sont cachés partout.\nBonne chance.",
      "carte.txt": "CARTE DU MONDE\n==============\n/foret      — La Forêt des Processus\n/donjon     — Le Donjon des Permissions\n/ocean      — L'Océan des Données\n/montagne   — La Montagne des Scripts\n/secret     — ??? (caché)",
    },
    dirs: ["foret", "donjon", "ocean", "montagne"],
    secret: null,
    xp: 0
  },
  "/foret": {
    name: "🌲 La Forêt des Processus",
    emoji: "🌲",
    desc: "Une forêt dense. Des processus courent entre les arbres. Tu entends des commandes au loin...",
    files: {
      "arbres.txt": "Les arbres de la forêt représentent les processus.\nChaque arbre est un processus en cours d'exécution.\n\nCommandes utiles ici :\n  ps aux    — voir les processus\n  grep      — filtrer\n  find      — chercher",
      "indice.txt": "Le mot de passe de la clairière est caché\ndans le fichier .secret de ce dossier.\nMais il est caché... utilise ls -la",
      ".secret": "🔑 MOT DE PASSE CLAIRIÈRE : FORET_42\n\nBravo ! Tu as trouvé le fichier caché.\nUtilise 'cd clairiere' pour avancer.",
    },
    dirs: ["clairiere", "marais"],
    secret: "FORET_42",
    xp: 30
  },
  "/foret/clairiere": {
    name: "🌸 La Clairière",
    emoji: "🌸",
    desc: "Une clairière lumineuse. Le sol est couvert de scripts shell.",
    files: {
      "parchemin.txt": "Pour traverser la clairière, tu dois\ntrouvez le nombre d'erreurs dans error.log.\n\nUtilise : grep ERROR error.log | wc -l",
      "error.log": "INFO: démarrage\nERROR: timeout connexion\nINFO: retry\nERROR: disk full\nINFO: ok\nERROR: crash\nINFO: restart\nERROR: null pointer",
      "tresor.txt": "🏆 TRÉSOR DE LA CLAIRIÈRE\n\nTu as trouvé le trésor !\n+50 XP bonus si tu trouves combien d'erreurs\nsont dans error.log (grep ERROR error.log | wc -l)\n\nMot de passe suivant : CLAIRIERE_ERROR_4",
    },
    dirs: [],
    secret: "CLAIRIERE_ERROR_4",
    xp: 50
  },
  "/foret/marais": {
    name: "🌿 Le Marais",
    emoji: "🌿",
    desc: "Un marais sombre et humide. Des fichiers corrompus flottent à la surface...",
    files: {
      "avertissement.txt": "DANGER : Ce marais contient des fichiers corrompus.\nNe supprime rien sans avoir lu son contenu.\n\nUn trésor est caché dans .tresor_cache",
      ".tresor_cache": "💎 Gemme du Marais trouvée !\n\nMot de passe : MARAIS_HIDDEN",
    },
    dirs: [],
    secret: "MARAIS_HIDDEN",
    xp: 40
  },
  "/donjon": {
    name: "🏰 Le Donjon des Permissions",
    emoji: "🏰",
    desc: "Un donjon sombre. Chaque porte a des permissions différentes. Certaines sont verrouillées.",
    files: {
      "regles.txt": "RÈGLES DU DONJON\n================\nChaque fichier ici a des permissions.\nUtilise ls -l pour les voir.\n\nrwx = lecture + écriture + exécution\nr-- = lecture seulement\n--- = aucun accès\n\nLe secret du donjon est dans la salle gardée.",
      "porte_ouverte.txt": "Cette porte est ouverte.\nPermissions : -rw-r--r--\nTout le monde peut lire.",
    },
    dirs: ["salle_gardee", "cachot"],
    secret: null,
    xp: 0
  },
  "/donjon/salle_gardee": {
    name: "⚔️ La Salle Gardée",
    emoji: "⚔️",
    desc: "La salle gardée. Un coffre avec des permissions strictes t'attend.",
    files: {
      "gardien.txt": "Je suis le Gardien des Permissions.\n\nPour obtenir le trésor, tu dois comprendre :\n  chmod 600 = seulement le propriétaire\n  chmod 755 = tout le monde peut lire/exécuter\n  chmod 777 = DANGER tout le monde peut tout faire\n\nLe coffre est dans .coffre (fichier caché)",
      ".coffre": "🗝️ COFFRE DU DONJON OUVERT !\n\nPermissions comprises. Voici ta récompense :\nMot de passe : CHMOD_755_DONJON",
    },
    dirs: [],
    secret: "CHMOD_755_DONJON",
    xp: 60
  },
  "/donjon/cachot": {
    name: "⛓️ Le Cachot",
    emoji: "⛓️",
    desc: "Un cachot humide. Des processus zombies errent ici...",
    files: {
      "prisonnier.txt": "Je suis coincé ici depuis que mon processus\nparent est mort. Je suis un zombie.\n\nPour me libérer : kill -9 PID\n\nMon secret : ZOMBIE_PROCESS_FREE",
    },
    dirs: [],
    secret: "ZOMBIE_PROCESS_FREE",
    xp: 35
  },
  "/ocean": {
    name: "🌊 L'Océan des Données",
    emoji: "🌊",
    desc: "Un océan de données. Des flux de bytes s'écoulent partout. Des pipes relient les îles...",
    files: {
      "bouteille.txt": "Message dans une bouteille :\n\nLes pipes | sont les courants de cet océan.\nIls transportent les données d'une commande à l'autre.\n\nExemple : ls | grep .txt | wc -l\n\nL'île aux trésors est accessible via le pipe :",
      "data.csv": "nom,age,ville\nAlice,25,Paris\nBob,30,Lyon\nCarla,22,Marseille\nDavid,35,Bordeaux",
      ".ile_aux_tresors": "🏝️ ÎLE AUX TRÉSORS TROUVÉE !\n\nTu as navigué jusqu'ici en explorant les fichiers cachés.\nMot de passe : OCEAN_PIPE_DATA",
    },
    dirs: ["recifs"],
    secret: "OCEAN_PIPE_DATA",
    xp: 45
  },
  "/ocean/recifs": {
    name: "🪸 Les Récifs",
    emoji: "🪸",
    desc: "Des récifs dangereux. Des expressions régulières nagent entre les coraux...",
    files: {
      "coraux.txt": "Les récifs sont faits de regex.\ngrep peut les traverser avec des motifs :\n\ngrep '^A' fichier    # lignes commençant par A\ngrep 'txt$' fichier  # lignes finissant par txt\ngrep '[0-9]' fichier # lignes avec des chiffres\n\nSecret caché : .perle",
      ".perle": "🦪 PERLE RARE TROUVÉE !\n\nMot de passe : RECIFS_REGEX_GREP",
    },
    dirs: [],
    secret: "RECIFS_REGEX_GREP",
    xp: 55
  },
  "/montagne": {
    name: "⛰️ La Montagne des Scripts",
    emoji: "⛰️",
    desc: "Une montagne escarpée. Des scripts shell s'accrochent aux parois rocheuses.",
    files: {
      "escalade.txt": "Pour escalader la montagne, tu dois\ncomprendre les scripts shell.\n\n#!/bin/bash        — shebang, définit l'interpréteur\necho 'texte'       — afficher du texte\nvariable='valeur'  — déclarer une variable\nif [ condition ]   — condition\nfor i in liste     — boucle\n\nLe sommet contient le grand secret.",
      "script_exemple.sh": "#!/bin/bash\n# Script d'exemple\necho 'Bonjour depuis la montagne !'\n\nNOM='Aventurier'\necho \"Salut $NOM\"\n\nfor i in 1 2 3; do\n  echo \"Etape $i\"\ndone",
    },
    dirs: ["sommet", "vallee"],
    secret: null,
    xp: 0
  },
  "/montagne/sommet": {
    name: "🏔️ Le Sommet",
    emoji: "🏔️",
    desc: "Tu as atteint le sommet ! La vue est imprenable. Un parchemin ancien t'attend...",
    files: {
      "parchemin_ancien.txt": "🏆 FÉLICITATIONS !\n\nTu as atteint le sommet de la Montagne des Scripts.\n\nLe Grand Secret du Monde Linux :\n'Tout est fichier. Les processus sont des fichiers.\nLes périphériques sont des fichiers.\nLes sockets sont des fichiers.\nMême /dev/null est un fichier.'\n\nMot de passe ultime : SOMMET_TOUT_EST_FICHIER",
      ".cristal": "💎 CRISTAL DE SAGESSE\n\nTu maîtrises maintenant les bases de Linux.\nContinue à explorer, il y a encore des secrets...\n\nMot de passe bonus : CRISTAL_LINUX_MASTER",
    },
    dirs: [],
    secret: "SOMMET_TOUT_EST_FICHIER",
    xp: 100
  },
  "/montagne/vallee": {
    name: "🌄 La Vallée",
    emoji: "🌄",
    desc: "Une vallée tranquille entre les pics. Des fichiers de config s'y reposent.",
    files: {
      "config.ini": "[serveur]\nhost=localhost\nport=8080\nenv=production\n\n[base_de_donnees]\nhost=db.local\nport=5432\nnom=mabase",
      ".vallee_secret": "🌙 SECRET DE LA VALLÉE\n\nMot de passe : VALLEE_CONFIG_INI",
    },
    dirs: [],
    secret: "VALLEE_CONFIG_INI",
    xp: 40
  }
};

class GameShell {
  constructor(termEl, inputEl, runBtn, worldPanel, locationName, locationDesc, visualEl, exitsEl) {
    this.termEl       = termEl;
    this.inputEl      = inputEl;
    this.runBtn       = runBtn;
    this.worldPanel   = worldPanel;
    this.locationName = locationName;
    this.locationDesc = locationDesc;
    this.visualEl     = visualEl;
    this.exitsEl      = exitsEl;

    this.cwd          = "/";
    this.history      = [];
    this.histIdx      = -1;
    this.foundSecrets = new Set();

    this._bindEvents();
  }

  init() {
    this._clearTerm();
    this._print("Bienvenue dans le Monde Linux.", "t-story");
    this._print("", "t-out");
    this._print("Commandes disponibles : ls, ls -la, cd, cat, less, pwd, find, grep, clear, help", "t-info");
    this._print("", "t-out");
    this._updateWorld();
  }

  _bindEvents() {
    this.runBtn.addEventListener("click", () => this._run());
    this.inputEl.addEventListener("keydown", e => {
      if (e.key === "Enter") { this._run(); }
      else if (e.key === "Tab") { e.preventDefault(); this._autocomplete(); }
      else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.histIdx < this.history.length - 1) {
          this.histIdx++;
          this.inputEl.value = this.history[this.histIdx] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.histIdx > 0) { this.histIdx--; this.inputEl.value = this.history[this.histIdx] || ""; }
        else { this.histIdx = -1; this.inputEl.value = ""; }
      }
    });
  }

  _run() {
    const raw = this.inputEl.value.trim();
    if (!raw) return;
    this.history.unshift(raw);
    this.histIdx = -1;
    this.inputEl.value = "";
    this._printPrompt(raw);
    this._exec(raw);
  }

  _exec(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd   = parts[0];
    const args  = parts.slice(1);
    const loc   = WORLD[this.cwd];

    switch(cmd) {
      case "ls": {
        const showHidden = args.includes("-a") || args.includes("-la") || args.includes("-al");
        const showLong   = args.includes("-l") || args.includes("-la") || args.includes("-al");
        let items = [...(loc.dirs || []).map(d => d + "/"), ...Object.keys(loc.files || {})];
        if (!showHidden) items = items.filter(f => !f.startsWith("."));
        if (!items.length) { this._print("(vide)", "t-out"); break; }
        if (showLong) {
          items.forEach(item => {
            const isDir  = item.endsWith("/");
            const isHid  = item.startsWith(".");
            const perms  = isDir ? "drwxr-xr-x" : (isHid ? "-rw-------" : "-rw-r--r--");
            this._print(`${perms}  user  user  ${isDir ? "4096" : "  42"}  ${item}`, "t-out");
          });
        } else {
          this._print(items.join("   "), "t-out");
        }
        break;
      }

      case "cd": {
        const target = args[0];
        if (!target || target === "~") { this.cwd = "/"; this._updateWorld(); break; }
        if (target === "..") {
          const parts2 = this.cwd.split("/").filter(Boolean);
          parts2.pop();
          this.cwd = "/" + parts2.join("/");
          if (!this.cwd.startsWith("/")) this.cwd = "/";
          this._updateWorld(); break;
        }
        const newPath = this.cwd === "/" ? "/" + target : this.cwd + "/" + target;
        if (WORLD[newPath]) {
          this.cwd = newPath;
          this._updateWorld();
        } else if (loc.dirs && loc.dirs.includes(target)) {
          this.cwd = newPath;
          this._updateWorld();
        } else {
          this._print(`cd: ${target}: Aucun dossier de ce type`, "t-err");
        }
        break;
      }

      case "cat":
      case "less": {
        const fname = args[0];
        if (!fname) { this._print(`${cmd}: manque le nom du fichier`, "t-err"); break; }
        const content = loc.files && loc.files[fname];
        if (!content) { this._print(`${cmd}: ${fname}: Fichier introuvable`, "t-err"); break; }
        content.split("\n").forEach(l => this._print(l, "t-out"));
        // Vérifier si c'est un secret
        if (fname.startsWith(".") || fname.includes("secret") || fname.includes("tresor") || fname.includes("cristal") || fname.includes("perle") || fname.includes("coffre") || fname.includes("ile") || fname.includes("vallee") || fname.includes("cachot")) {
          this._checkSecret(loc, fname);
        }
        break;
      }

      case "pwd":
        this._print(this.cwd || "/", "t-out");
        break;

      case "find": {
        const nameIdx = args.indexOf("-name");
        const pat = nameIdx >= 0 ? (args[nameIdx+1] || "").replace(/[*'"]/g,"") : "";
        const results = [];
        const search = (path) => {
          const node = WORLD[path];
          if (!node) return;
          Object.keys(node.files || {}).forEach(f => {
            if (!pat || f.endsWith(pat)) results.push(path + "/" + f);
          });
          (node.dirs || []).forEach(d => search(path === "/" ? "/"+d : path+"/"+d));
        };
        search(this.cwd);
        if (results.length) results.forEach(r => this._print(r, "t-out"));
        else this._print("(aucun résultat)", "t-out");
        break;
      }

      case "grep": {
        const noFlag = args.filter(a => !a.startsWith("-"));
        const pattern = noFlag[0];
        const fname2  = noFlag[1];
        if (!pattern) { this._print("grep: manque le motif", "t-err"); break; }
        if (!fname2)  { this._print("grep: manque le fichier", "t-err"); break; }
        const content2 = loc.files && loc.files[fname2];
        if (!content2) { this._print(`grep: ${fname2}: Fichier introuvable`, "t-err"); break; }
        const lines = content2.split("\n").filter(l => l.toLowerCase().includes(pattern.toLowerCase()));
        if (lines.length) lines.forEach(l => this._print(l, "t-out"));
        else this._print("(aucune correspondance)", "t-out");
        break;
      }

      case "clear":
        this._clearTerm();
        break;

      case "help":
        this._print("Commandes disponibles :", "t-info");
        this._print("  ls / ls -la    — lister les fichiers (cachés avec -la)", "t-out");
        this._print("  cd [dossier]   — changer de dossier", "t-out");
        this._print("  cat [fichier]  — lire un fichier", "t-out");
        this._print("  less [fichier] — lire (paginé)", "t-out");
        this._print("  pwd            — afficher le chemin courant", "t-out");
        this._print("  find . -name   — chercher des fichiers", "t-out");
        this._print("  grep motif f   — filtrer dans un fichier", "t-out");
        this._print("  clear          — effacer le terminal", "t-out");
        break;

      default:
        this._print(`${cmd}: commande introuvable. Tape 'help' pour l'aide.`, "t-err");
    }
  }

  _checkSecret(loc, fname) {
    if (loc.secret && !this.foundSecrets.has(this.cwd)) {
      setTimeout(() => {
        this._print("", "t-out");
        this._print("✨ Secret découvert ! +" + loc.xp + " XP", "t-ok");
        this.foundSecrets.add(this.cwd);
        if (typeof addXP === "function") addXP(loc.xp);
        showToast("🗝️ Secret trouvé : " + loc.secret);
      }, 300);
    }
  }

  _updateWorld() {
    const loc = WORLD[this.cwd];
    if (!loc) return;
    this.locationName.textContent = loc.name;
    this.locationDesc.textContent = loc.desc;
    this.visualEl.innerHTML = `<span style="position:relative;z-index:1;font-size:64px">${loc.emoji}</span>`;

    // Sorties
    this.exitsEl.innerHTML = "";
    if (this.cwd !== "/") {
      const btn = document.createElement("button");
      btn.className = "exit-btn";
      btn.textContent = "↑ Remonter (cd ..)";
      btn.onclick = () => { this.inputEl.value = "cd .."; this._run(); };
      this.exitsEl.appendChild(btn);
    }
    (loc.dirs || []).forEach(d => {
      const btn = document.createElement("button");
      btn.className = "exit-btn";
      btn.textContent = "→ " + d + "/";
      btn.onclick = () => { this.inputEl.value = "cd " + d; this._run(); };
      this.exitsEl.appendChild(btn);
    });

    this._print("", "t-out");
    this._print("📍 " + loc.name, "t-story");
    this._print(loc.desc, "t-out");
    this._print("", "t-out");
  }

  _autocomplete() {
    const val   = this.inputEl.value;
    const parts = val.trimStart().split(" ");
    const last  = parts[parts.length - 1];
    const cmds  = ["ls","cd","cat","less","pwd","find","grep","clear","help","more"];
    if (parts.length === 1) {
      const m = cmds.filter(c => c.startsWith(last));
      if (m.length === 1) { this.inputEl.value = m[0] + " "; }
      else if (m.length > 1) { this._print(""); this._print(m.join("  "), "t-info"); }
      return;
    }
    const loc   = WORLD[this.cwd];
    const files = [...Object.keys(loc.files || {}), ...(loc.dirs || []).map(d => d + "/")];
    const m2    = files.filter(f => f.startsWith(last));
    if (m2.length === 1) { parts[parts.length-1] = m2[0]; this.inputEl.value = parts.join(" "); }
    else if (m2.length > 1) { this._print(""); this._print(m2.join("  "), "t-info"); }
  }

  _clearTerm() { this.termEl.innerHTML = ""; }

  _printPrompt(cmd) {
    const d = document.createElement("div");
    d.className = "t-line t-prompt-line";
    d.innerHTML = `<span class="t-ps1">explorer@monde:${this.cwd}$</span><span class="t-cmd"> ${cmd.replace(/</g,"&lt;")}</span>`;
    this.termEl.appendChild(d);
    this.termEl.scrollTop = this.termEl.scrollHeight;
  }

  _print(text, cls) {
    const d = document.createElement("div");
    d.className = "t-line " + (cls || "t-out");
    d.textContent = text;
    this.termEl.appendChild(d);
    this.termEl.scrollTop = this.termEl.scrollHeight;
  }
}
