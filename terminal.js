// terminal.js — Simulateur de terminal Linux

class Terminal {
  constructor(outputEl) {
    this.el = outputEl;
    this.cwd = "/home/user";
    this.fs = {};       // filesystem virtuel de la mission
    this.state = {};    // état interne (mkdir créé, cp, etc.)
    this.cmdLog = [];   // historique de session (commande history)
    this._envVars = {}; // variables d'environnement injectées (bandit, etc.)
  }

  // Charge le filesystem d'une mission
  loadFS(fs) {
    this.fs = JSON.parse(JSON.stringify(fs || {}));
    this.cwd = "/home/user";
    this.state = {};
    this._envVars = {};
  }

  clear() {
    this.el.innerHTML = "";
  }

  // ── Affichage ──────────────────────────────────────────────────
  _line(text, cls = "t-out") {
    const d = document.createElement("div");
    d.className = "t-line " + cls;
    d.textContent = text || "";
    this.el.appendChild(d);
    this.el.scrollTop = this.el.scrollHeight;
    return d;
  }

  printPrompt(cmd) {
    const d = document.createElement("div");
    d.className = "t-line t-prompt-line";
    d.innerHTML = `<span class="t-ps1">user@dojo:~$</span><span class="t-cmd"> ${this._esc(cmd)}</span>`;
    this.el.appendChild(d);
  }

  printOut(text)  { if (text !== null && text !== "") this._line(text, "t-out"); }
  printErr(text)  { this._line(text, "t-err"); }
  printOk(text)   { this._line(text, "t-ok"); }
  printInfo(text) { this._line(text, "t-info"); }
  printWarn(text) { this._line(text, "t-warn"); }
  printSep()      { this._line("─".repeat(50), "t-sep"); }

  _esc(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  // ── Suggestion de fichier (si faute de frappe) ─────────────
  _suggestFile(name) {
    const files = Object.keys(this.fs);
    if (!files.length) return null;
    // Cherche un fichier qui commence pareil
    const startsWith = files.find(f => f.startsWith(name.slice(0, 3)));
    if (startsWith) return startsWith;
    // Cherche par distance de Levenshtein simplifiée
    let best = null, bestScore = Infinity;
    files.forEach(f => {
      const score = this._levenshtein(name.toLowerCase(), f.toLowerCase());
      if (score < bestScore && score <= 3) { bestScore = score; best = f; }
    });
    return best;
  }

  _levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({length: m+1}, (_, i) => Array.from({length: n+1}, (_, j) => i === 0 ? j : j === 0 ? i : 0));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[m][n];
  }

  // ── Commande introuvable — message pédagogique ─────────────
  _cmdNotFound(cmd, args) {
    // Typos fréquentes
    const typos = {
      "sl": "ls (tu as inversé les lettres — essaie : ls)",
      "ks": "ls",
      "cd..": "cd .. (il faut un espace : cd ..)",
      "cd/": "cd / (il faut un espace : cd /)",
      "lsa": "ls -a (il faut un tiret : ls -a)",
      "lsl": "ls -l (il faut un tiret : ls -l)",
      "gerp": "grep",
      "grpe": "grep",
      "cta": "cat",
      "car": "cat",
      "mdir": "mkdir",
      "mkd": "mkdir",
      "mkdr": "mkdir",
      "tuch": "touch",
      "touc": "touch",
      "gre": "grep",
      "fin": "find",
      "pythoon": "python3",
      "pyhon": "python3",
    };

    if (typos[cmd]) {
      return `${cmd}: commande introuvable\n💡 Voulais-tu dire : ${typos[cmd]} ?`;
    }

    // Commandes connues proches
    const known = ["ls","cd","cat","less","more","pwd","mkdir","touch","cp","mv","rm","chmod","grep","find","wc","sort","echo","ps","kill","whoami","id","df","ln","tar","curl","sed","awk","clear","help","head","tail","uniq","cut","tr","tree","du","date","uname","hostname","uptime","free","history","man","whatis","env","ping"];
    const close = known.find(k => this._levenshtein(cmd, k) <= 2);
    if (close) {
      return `${cmd}: commande introuvable\n💡 Voulais-tu dire : ${close} ?`;
    }

    // Option invalide détectée (ex: ls -x)
    if (args.length && args[0].startsWith("-")) {
      const cmdHelp = {
        "ls":    "Options valides pour ls : -l (détails), -a (cachés), -la (les deux), -h (tailles lisibles)",
        "grep":  "Options valides pour grep : -i (casse), -n (numéros), -r (récursif), -v (inverser), -c (compter)",
        "find":  "Options valides pour find : -name 'motif', -type f, -type d, -mtime N, -size +NM",
        "tar":   "Options valides pour tar : -czf (créer), -xzf (extraire), -tzf (lister)",
        "chmod": "Exemples chmod : chmod +x script.sh | chmod 755 script.sh | chmod 600 secret.key",
      };
      if (cmdHelp[cmd]) return `${cmd}: option invalide '${args[0]}'\n💡 ${cmdHelp[cmd]}`;
    }

    return `${cmd}: commande introuvable\nTape 'help' pour voir les commandes disponibles.`;
  }

  // ── Autocomplétion Tab ─────────────────────────────────────
  // Appelle cette méthode depuis le keydown de l'input
  autocomplete(inputEl) {
    const val   = inputEl.value;
    const parts = val.trimStart().split(" ");
    const last  = parts[parts.length - 1];

    // Complétion de commande (premier mot)
    if (parts.length === 1) {
      const cmds = ["ls","cd","cat","less","more","pwd","mkdir","touch","cp","mv","rm","chmod","grep","find","wc","sort","echo","ps","kill","whoami","id","df","ln","tar","curl","sed","awk","clear","help","head","tail","uniq","cut","tr","tree","du","date","uname","hostname","uptime","free","history","man","whatis","env","export","ping","base64","rot13","xxd"];
      const matches = cmds.filter(c => c.startsWith(last));
      if (matches.length === 1) {
        inputEl.value = matches[0] + " ";
      } else if (matches.length > 1) {
        this.printOut("");
        this.printOut(matches.join("  "), "t-info");
        // Compléter jusqu'au préfixe commun
        const prefix = this._commonPrefix(matches);
        if (prefix.length > last.length) inputEl.value = prefix;
      }
      return;
    }

    // Complétion de fichier/dossier (arguments)
    if (!last) return;
    const files = Object.keys(this.fs);
    const matches2 = files.filter(f => f.startsWith(last));
    if (matches2.length === 1) {
      parts[parts.length - 1] = matches2[0];
      inputEl.value = parts.join(" ");
    } else if (matches2.length > 1) {
      this.printOut("");
      this.printOut(matches2.join("  "), "t-info");
      const prefix = this._commonPrefix(matches2);
      if (prefix.length > last.length) {
        parts[parts.length - 1] = prefix;
        inputEl.value = parts.join(" ");
      }
    }
  }

  _commonPrefix(arr) {
    if (!arr.length) return "";
    let prefix = arr[0];
    for (let i = 1; i < arr.length; i++) {
      while (!arr[i].startsWith(prefix)) prefix = prefix.slice(0, -1);
    }
    return prefix;
  }

  // ── Base64 (navigateur : atob/btoa ; node/test : Buffer) ───
  _b64decode(s) {
    if (typeof atob === "function") {
      return decodeURIComponent(escape(atob(s)));
    }
    return Buffer.from(s, "base64").toString("utf8");
  }
  _b64encode(s) {
    if (typeof btoa === "function") {
      return btoa(unescape(encodeURIComponent(s)));
    }
    return Buffer.from(s, "utf8").toString("base64");
  }

  // ── Exécution ──────────────────────────────────────────────────
  run(raw) {
    if (!raw.trim()) return { output: "", error: false };
    this.printPrompt(raw);
    this.cmdLog.push(raw.trim());

    // Pipe
    if (raw.includes("|")) {
      return this._runPipe(raw);
    }
    // Redirection >> (ajout) puis > (écrasement)
    if (raw.includes(">>")) {
      return this._runRedirect(raw, true);
    }
    if (raw.includes(">")) {
      return this._runRedirect(raw, false);
    }

    const parts = this._parse(raw);
    return this._exec(parts);
  }

  _parse(s) {
    // Simple split qui gère les guillemets
    const parts = [];
    let cur = "";
    let inQ = false;
    let qChar = "";
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (inQ) {
        if (c === qChar) { inQ = false; }
        else { cur += c; }
      } else if (c === '"' || c === "'") {
        inQ = true; qChar = c;
      } else if (c === " " || c === "\t") {
        if (cur) { parts.push(cur); cur = ""; }
      } else {
        cur += c;
      }
    }
    if (cur) parts.push(cur);
    return parts;
  }

  _runPipe(raw) {
    const segments = raw.split("|").map(s => s.trim()).filter(Boolean);
    let prevOut = "";
    let lastOut = "";
    for (let i = 0; i < segments.length; i++) {
      const parts = this._parse(segments[i]);
      const res = this._exec(parts, prevOut, true);
      prevOut = res.output;
      lastOut = res.output;
    }
    if (lastOut) lastOut.split("\n").forEach(l => this.printOut(l));
    return { output: lastOut, error: false };
  }

  _runRedirect(raw, append) {
    const sep = append ? ">>" : ">";
    const idx = raw.indexOf(sep);
    const left  = raw.slice(0, idx);
    const fname = raw.slice(idx + sep.length).trim();
    const parts = this._parse(left.trim());
    const res = this._exec(parts, "", true);
    if (fname) {
      if (append && this.fs[fname] && this.fs[fname].type === "file") {
        this.fs[fname].content = (this.fs[fname].content || "") + "\n" + res.output;
        this.state.append = fname;
      } else {
        this.fs[fname] = { type: "file", content: res.output };
        if (append) this.state.append = fname;
      }
      this.state.redirect = fname;
      // pas d'affichage, redirigé
    }
    return { output: res.output, error: false };
  }

  // ── Expansion de glob (*.txt → fichiers correspondants) ────
  _globList(pattern) {
    if (!pattern.includes("*")) return null;
    const rx = new RegExp("^" + pattern.split("*").map(s => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$");
    const matches = Object.keys(this.fs).filter(f => rx.test(f) && this.fs[f].type !== "dir");
    return matches.length ? matches : null;
  }
  // Étend chaque argument non-option contenant * (si au moins un fichier correspond)
  _expandFileArgs(args) {
    const out = [];
    args.forEach(a => {
      if (!a.startsWith("-") && a.includes("*")) {
        const m = this._globList(a);
        if (m) { out.push(...m); return; }
      }
      out.push(a);
    });
    return out;
  }

  // ── Commandes ──────────────────────────────────────────────────
  _exec(parts, stdin = "", silent = false) {
    const [cmd, ...args] = parts;
    if (!cmd) return { output: "", error: false };

    let out = "";
    let err = false;

    switch (cmd) {

      case "ls": {
        const hasA = args.some(a => a.startsWith("-") && a.includes("a"));
        const hasL = args.some(a => a.startsWith("-") && a.includes("l"));
        const target = args.find(a => !a.startsWith("-"));
        let files = Object.keys(this.fs);
        if (target && this.fs[target] && this.fs[target].type === "dir") {
          // ls dossier → liste les fichiers "dossier/xxx"
          files = files.filter(f => f.startsWith(target + "/")).map(f => f.slice(target.length + 1));
          if (!files.length) { out = ""; break; }
        } else if (target && !this.fs[target]) {
          const g = this._globList(target);
          if (g) files = g;
          else { out = `ls: ${target}: Aucun fichier ou dossier de ce type`; err = true; break; }
        }
        if (!hasA) files = files.filter(f => !f.startsWith("."));
        if (hasL) {
          out = files.map(f => {
            const node = this.fs[f] || this.fs[(target || "") + "/" + f] || { type: "file" };
            const perms = node.perms || (node.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--");
            const size = node.content ? node.content.length : 0;
            return `${perms}  1 user user ${String(size).padStart(6)}  ${f}`;
          }).join("\n");
        } else {
          // Dans un pipe ou une redirection, ls sort une entrée par ligne (comme le vrai ls)
          out = files.join(silent ? "\n" : "  ");
        }
        break;
      }

      case "cat": {
        const fnames = this._expandFileArgs(args.filter(a => !a.startsWith("-")));
        if (!fnames.length) {
          if (stdin) { out = stdin; break; }
          out = "cat: manque le nom de fichier\nUsage : cat FICHIER\nExemple : cat readme.txt\n\nAstuce : tape 'ls' pour voir les fichiers disponibles."; err = true; break;
        }
        const chunks = [];
        for (const fname of fnames) {
          const node = this.fs[fname];
          if (!node) {
            const sugg = this._suggestFile(fname);
            out = `cat: ${fname}: Aucun fichier ou dossier de ce type${sugg ? "\nVoulais-tu dire : " + sugg + " ?" : "\n\nTape 'ls' pour voir les fichiers disponibles."}`;
            err = true; break;
          }
          if (node.type === "dir") { out = `cat: ${fname}: est un dossier\nPour lister son contenu : ls ${fname}`; err = true; break; }
          chunks.push(node.content || "");
        }
        if (err) break;
        out = chunks.join("\n");
        break;
      }

      case "less":
      case "more": {
        const fname = args[0];
        if (!fname) { out = `${cmd}: manque le nom de fichier`; err = true; break; }
        const node = this.fs[fname];
        if (!node) { out = `${cmd}: ${fname}: Aucun fichier ou dossier de ce type`; err = true; break; }
        out = node.content || "";
        break;
      }

      case "pwd": {
        out = this.cwd;
        break;
      }

      case "cd": {
        const target = args[0] || "~";
        if (target === "~" || target === "") {
          this.cwd = "/home/user";
          this.state.cwd = "home";
          out = "";
        } else if (target === "..") {
          this.cwd = "/home";
          out = "";
        } else {
          const node = this.fs[target];
          if (node && node.type === "dir") {
            this.cwd = "/home/user/" + target;
            this.state.cwd = target;
            out = "";
          } else if (!node) {
            const sugg = this._suggestFile(target);
            out = `cd: ${target}: Aucun fichier ou dossier de ce type${sugg ? "\nVoulais-tu dire : cd " + sugg + " ?" : "\n\nTape 'ls' pour voir les dossiers disponibles."}`;
            err = true;
          } else {
            out = `cd: ${target}: N'est pas un dossier`; err = true;
          }
        }
        break;
      }

      case "mkdir": {
        const p = args.filter(a => !a.startsWith("-"))[0];
        if (!p) { out = "mkdir: manque un opérande\nUsage : mkdir NOM_DOSSIER\nExemple : mkdir projets"; err = true; break; }
        this.fs[p] = { type: "dir" };
        this.state.mkdir = p;
        out = "";
        break;
      }

      case "touch": {
        const p = args[0];
        if (!p) { out = "touch: manque le nom du fichier"; err = true; break; }
        if (!this.fs[p]) this.fs[p] = { type: "file", content: "" };
        this.state.touch = p;
        out = "";
        break;
      }

      case "cp": {
        const noFlag = args.filter(a => !a.startsWith("-"));
        if (noFlag.length < 2) { out = "cp: manque les arguments\nUsage : cp SOURCE DESTINATION\nExemple : cp config.json config.backup.json\n\nPour copier un dossier entier : cp -r dossier/ copie/"; err = true; break; }
        const [src, dst] = noFlag;
        if (!this.fs[src]) {
          const sugg = this._suggestFile(src);
          out = `cp: ${src}: Aucun fichier ou dossier de ce type${sugg ? "\nVoulais-tu dire : cp " + sugg + " " + (dst||"destination") + " ?" : ""}`;
          err = true; break;
        }
        this.fs[dst] = JSON.parse(JSON.stringify(this.fs[src]));
        this.state.cp = dst;
        out = "";
        break;
      }

      case "mv": {
        const [src, dst] = args.filter(a => !a.startsWith("-"));
        if (!src || !dst) { out = "mv: manque les arguments\nUsage : mv SOURCE DESTINATION\nExemple (renommer) : mv ancien.txt nouveau.txt\nExemple (déplacer) : mv fichier.txt dossier/"; err = true; break; }
        if (!this.fs[src]) {
          const sugg = this._suggestFile(src);
          out = `mv: ${src}: Aucun fichier ou dossier de ce type${sugg ? "\nVoulais-tu dire : mv " + sugg + " " + dst + " ?" : ""}`;
          err = true; break;
        }
        this.fs[dst] = this.fs[src];
        delete this.fs[src];
        this.state.mv = dst;
        out = "";
        break;
      }

      case "rm": {
        const flags = args.filter(a => a.startsWith("-")).join("");
        const targets = this._expandFileArgs(args.filter(a => !a.startsWith("-")));
        if ((flags.includes("r") && flags.includes("f")) && (targets[0] === "/" || targets[0] === "/*")) {
          out = "💀 rm -rf / — SÉRIEUSEMENT ?!\n\nSur un vrai système, tu viendrais d'effacer TOUT :\nle système, tes fichiers, tes regrets... tout.\n\nLe dojo te pardonne. Un vrai serveur, non.\n(GNU rm moderne refuse d'ailleurs avec --no-preserve-root)";
          err = true; break;
        }
        const p = targets[0];
        if (!p) { out = "rm: manque le nom du fichier\nUsage : rm FICHIER\nExemple : rm temp.log\n\n⚠️  Attention : pas de corbeille sous Linux, la suppression est définitive !"; err = true; break; }
        if (!this.fs[p]) {
          const sugg = this._suggestFile(p);
          out = `rm: impossible de supprimer '${p}': Aucun fichier ou dossier de ce type${sugg ? "\nVoulais-tu dire : rm " + sugg + " ?" : ""}`;
          err = true; break;
        }
        targets.forEach(t => { if (this.fs[t]) delete this.fs[t]; });
        this.state.rm = p;
        out = "";
        break;
      }

      case "chmod": {
        const target = args[args.length - 1];
        if (!target) { out = "chmod: manque les arguments"; err = true; break; }
        if (this.fs[target]) {
          this.fs[target].perms = "-rwxr-xr-x";
        }
        this.state.chmod = target;
        out = "";
        break;
      }

      case "grep": {
        const flags = args.filter(a => a.startsWith("-")).join("");
        const noFlag = args.filter(a => !a.startsWith("-"));
        const caseFlag = flags.includes("i");
        const numFlag  = flags.includes("n");
        const invFlag  = flags.includes("v");
        const cntFlag  = flags.includes("c");
        const pattern  = noFlag[0];
        let   fname    = noFlag[1];
        if (!pattern) { out = "grep: manque le motif de recherche\nUsage : grep MOTIF FICHIER\nExemple : grep ERROR app.log\n\nOptions utiles :\n  -i  ignorer la casse\n  -n  afficher les numéros de ligne\n  -v  inverser (lignes SANS le motif)\n  -c  compter les résultats"; err = true; break; }

        if (fname && !this.fs[fname] && fname.includes("*")) {
          const g = this._globList(fname);
          if (g) fname = g[0];
        }
        let content = stdin;
        if (fname && this.fs[fname]) content = this.fs[fname].content || "";
        else if (fname && !this.fs[fname]) { out = `grep: ${fname}: Aucun fichier ou dossier de ce type`; err = true; break; }

        const lines = content.split("\n");
        let matched = lines
          .map((l, i) => ({ line: l, num: i + 1 }))
          .filter(({ line }) => caseFlag ? line.toLowerCase().includes(pattern.toLowerCase()) : line.includes(pattern));
        if (invFlag) {
          const keep = new Set(matched.map(m => m.num));
          matched = lines.map((l, i) => ({ line: l, num: i + 1 })).filter(m => !keep.has(m.num));
        }
        if (cntFlag) { out = String(matched.length); break; }
        out = matched.map(({ line, num }) => numFlag ? `${num}:${line}` : line).join("\n");
        break;
      }

      case "find": {
        const nameIdx = args.indexOf("-name");
        let pat = nameIdx >= 0 ? (args[nameIdx + 1] || "").replace(/[*'"]/g, "") : "";
        let files = Object.keys(this.fs);
        if (pat) files = files.filter(f => f.endsWith(pat));
        out = files.map(f => "./" + f).join("\n");
        break;
      }

      case "wc": {
        const hasL = args.includes("-l");
        const hasW = args.includes("-w");
        const hasC = args.includes("-c");
        const fnames = this._expandFileArgs(args.filter(a => !a.startsWith("-")));
        const count = (content, fname) => {
          const lines = content.split("\n").length;
          const words = content.split(/\s+/).filter(Boolean).length;
          const chars = content.length;
          if (hasL) return `${lines}${fname ? " " + fname : ""}`;
          if (hasW) return `${words}${fname ? " " + fname : ""}`;
          if (hasC) return `${chars}${fname ? " " + fname : ""}`;
          return `${lines} ${words} ${chars}${fname ? " " + fname : ""}`;
        };
        if (!fnames.length) { out = count(stdin, ""); break; }
        const rows = [];
        for (const fname of fnames) {
          if (!this.fs[fname]) { out = `wc: ${fname}: Aucun fichier ou dossier de ce type`; err = true; break; }
          rows.push(count(this.fs[fname].content || "", fname));
        }
        if (err) break;
        out = rows.join("\n");
        break;
      }

      case "sort": {
        const fname = args.filter(a => !a.startsWith("-"))[0];
        const rev  = args.includes("-r");
        const num  = args.includes("-n");
        const uniq = args.includes("-u");
        let content = stdin;
        if (fname && this.fs[fname]) content = this.fs[fname].content || "";
        let lines = content.split("\n").filter(Boolean);
        if (uniq) lines = [...new Set(lines)];
        lines.sort(num ? (a, b) => parseFloat(a) - parseFloat(b) : (a, b) => a.localeCompare(b));
        if (rev) lines.reverse();
        out = lines.join("\n");
        break;
      }

      case "echo": {
        const joined = args.join(" ");
        // Résoudre les variables (injectées puis standard)
        out = joined.replace(/\$(\w+)/g, (m, name) => {
          if (this._envVars && this._envVars[name] !== undefined) return this._envVars[name];
          const std = { HOME: "/home/user", USER: "user", SHELL: "/bin/bash", PWD: this.cwd,
                        PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" };
          return std[name] !== undefined ? std[name] : "";
        });
        break;
      }

      case "env":
      case "printenv": {
        const base = {
          HOME: "/home/user", USER: "user", SHELL: "/bin/bash", PWD: this.cwd, LANG: "fr_FR.UTF-8",
          PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin", TERM: "xterm-256color",
          ...(this._envVars || {})
        };
        out = Object.entries(base).map(([k, v]) => `${k}=${v}`).join("\n");
        break;
      }

      case "export": {
        const kv = args.join(" ").match(/^(\w+)=(.*)$/);
        if (!kv) { out = "export: usage: export NOM=valeur"; err = true; break; }
        this._envVars[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
        this.state.export = kv[1];
        out = "";
        break;
      }

      case "ps": {
        out = [
          "USER       PID %CPU %MEM    COMMAND",
          "user         1  0.0  0.1    /sbin/init",
          "user       101  0.0  0.3    bash",
          "user      1234  2.1  1.4    nginx",
          "user      1235  0.0  0.8    python3 app.py",
          "user      9999  0.1  0.2    ps aux"
        ].join("\n");
        break;
      }

      case "kill": {
        const pid = args.filter(a => !a.startsWith("-"))[0];
        if (!pid) { out = "kill: manque le PID\nUsage : kill PID\nExemple : kill 1234\n\nPour forcer l'arrêt : kill -9 PID\nPour trouver les PIDs : ps aux"; err = true; break; }
        this.state.kill = pid;
        out = `[Processus ${pid} terminé]`;
        break;
      }

      case "whoami": { out = "user"; break; }
      case "id":     { out = "uid=1000(user) gid=1000(user) groupes=1000(user),27(sudo)"; break; }

      case "df": {
        out = [
          "Filesystem      Size  Used Avail Use% Mounted on",
          "/dev/sda1        50G   12G   36G  25% /",
          "tmpfs           2.0G     0  2.0G   0% /dev/shm",
          "tmpfs           2.0G  1.2M  2.0G   1% /run"
        ].join("\n");
        break;
      }

      case "ln": {
        const sFlag = args.includes("-s");
        const noFlag2 = args.filter(a => !a.startsWith("-"));
        const dst2 = noFlag2[1];
        if (sFlag && dst2) {
          this.state.symlink = dst2;
          out = "";
        } else {
          out = "ln: arguments invalides"; err = true;
        }
        break;
      }

      case "tar": {
        const fIdx = args.indexOf("-f") >= 0 ? args.indexOf("-f") + 1 : args.findIndex(a => a.endsWith(".tar.gz") || a.endsWith(".tar"));
        const fname2 = args[fIdx] || args.find(a => a.includes(".tar"));
        if (fname2) {
          this.state.tar = fname2;
          out = "";
        } else {
          out = "tar: manque le nom d'archive\nUsage : tar -czf ARCHIVE.tar.gz DOSSIER/\nExemple : tar -czf backup.tar.gz www/\n\nPour extraire : tar -xzf archive.tar.gz\nPour lister : tar -tzf archive.tar.gz";
          err = true;
        }
        break;
      }

      case "curl": {
        const url = args.find(a => a.startsWith("http"));
        if (!url) { out = "curl: manque l'URL"; err = true; break; }
        out = `HTTP/1.1 200 OK\n<!DOCTYPE html>\n<html><head><title>Example Domain</title></head>\n<body><h1>Example Domain</h1></body></html>`;
        break;
      }

      case "sed": {
        const expr = args.find(a => a.startsWith("s/"));
        const fname3 = args.filter(a => !a.startsWith("-") && !a.startsWith("s/")).pop();
        let content2 = stdin;
        if (fname3 && this.fs[fname3]) content2 = this.fs[fname3].content || "";
        if (expr) {
          const m = expr.match(/^s\/([^\/]+)\/([^\/]*)\/([g]?)$/);
          if (m) {
            const [, from, to, flag] = m;
            if (flag === "g") {
              out = content2.split("\n").map(l => l.split(from).join(to)).join("\n");
            } else {
              out = content2.split("\n").map(l => l.replace(from, to)).join("\n");
            }
          } else {
            out = "sed: expression invalide"; err = true;
          }
        } else {
          out = content2;
        }
        break;
      }

      case "awk": {
        // -F peut être séparé ("-F" ",") ou collé ("-F,")
        let fSep = " ";
        const fIdx = args.indexOf("-F");
        if (fIdx >= 0 && args[fIdx+1]) fSep = args[fIdx+1];
        else {
          const collapsed = args.find(a => a.startsWith("-F") && a.length > 2);
          if (collapsed) fSep = collapsed.slice(2);
        }
        const prog = args.find(a => a.includes("{print"));
        const fname4 = args.filter(a => !a.startsWith("-F") && a !== "-F" && !a.startsWith("{") && a !== fSep).pop();
        let content3 = stdin;
        if (fname4 && this.fs[fname4]) content3 = this.fs[fname4].content || "";
        if (prog) {
          const colM = prog.match(/\$(\d+)/);
          const col = colM ? parseInt(colM[1]) - 1 : 0;
          out = content3.split("\n").filter(Boolean).map(l => (l.split(fSep)[col] || "")).join("\n");
        } else {
          out = content3;
        }
        break;
      }

      case "base64": {
        const dec = args.includes("-d") || args.includes("--decode");
        const fname = args.filter(a => !a.startsWith("-"))[0];
        let src = stdin;
        if (fname && this.fs[fname]) src = this.fs[fname].content || "";
        else if (fname && !this.fs[fname]) { out = `base64: ${fname}: Fichier introuvable`; err = true; break; }
        src = (src || "").trim();
        try {
          if (dec) out = this._b64decode(src);
          else out = this._b64encode(src);
        } catch(e) { out = "base64: entrée invalide"; err = true; }
        break;
      }

      case "rot13": {
        const fname = args.filter(a => !a.startsWith("-"))[0];
        let src = stdin;
        if (fname && this.fs[fname]) src = this.fs[fname].content || "";
        out = (src || "").replace(/[a-zA-Z]/g, c => {
          const base = c <= "Z" ? 65 : 97;
          return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
        });
        break;
      }

      case "xxd": {
        const rev = args.includes("-r");
        const plain = args.includes("-p");
        const fname = args.filter(a => !a.startsWith("-"))[0];
        let src = stdin;
        if (fname && this.fs[fname]) src = this.fs[fname].content || "";
        src = src || "";
        if (rev && plain) {
          // hex → texte
          const hex = src.replace(/\s+/g, "");
          try {
            out = (hex.match(/.{1,2}/g) || []).map(h => String.fromCharCode(parseInt(h, 16))).join("");
          } catch(e) { out = "xxd: hex invalide"; err = true; }
        } else if (plain) {
          // texte → hex compact
          out = src.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
        } else {
          // dump simple
          out = src.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
        }
        break;
      }

      case "head":
      case "tail": {
        let n = 10;
        const nIdx = args.indexOf("-n");
        if (nIdx >= 0 && args[nIdx+1]) n = parseInt(args[nIdx+1]) || 10;
        else {
          const dash = args.find(a => /^-\d+$/.test(a));
          if (dash) n = parseInt(dash.slice(1));
        }
        const realNames = this._expandFileArgs(args.filter((a, i) => !a.startsWith("-") && !(args[i-1] === "-n" && /^\d+$/.test(a))));
        const fname = realNames[0];
        let content = stdin;
        if (fname && this.fs[fname]) content = this.fs[fname].content || "";
        else if (fname && !this.fs[fname]) { out = `${cmd}: ${fname}: Aucun fichier ou dossier de ce type`; err = true; break; }
        const lines = content.split("\n");
        out = (cmd === "head" ? lines.slice(0, n) : lines.slice(-n)).join("\n");
        break;
      }

      case "uniq": {
        const cFlag = args.includes("-c");
        const fname = this._expandFileArgs(args.filter(a => !a.startsWith("-")))[0];
        let content = stdin;
        if (fname && this.fs[fname]) content = this.fs[fname].content || "";
        else if (fname && !this.fs[fname]) { out = `uniq: ${fname}: Aucun fichier ou dossier de ce type`; err = true; break; }
        const lines = content.split("\n");
        const res = [];
        let prev = null, cnt = 0;
        const flush = () => { if (prev !== null) res.push(cFlag ? `${String(cnt).padStart(7)} ${prev}` : prev); };
        lines.forEach(l => {
          if (l === prev) cnt++;
          else { flush(); prev = l; cnt = 1; }
        });
        flush();
        out = res.join("\n");
        break;
      }

      case "cut": {
        // cut -d',' -f1  ou  -d, -f 1  ou  -f1,3
        let sep = "\t", fields = null;
        args.forEach((a, i) => {
          if (a.startsWith("-d")) sep = a.length > 2 ? a.slice(2).replace(/^["']|["']$/g, "") : (args[i+1] || "\t");
          if (a.startsWith("-f")) fields = a.length > 2 ? a.slice(2) : (args[i+1] || "");
        });
        if (!fields) { out = "cut: il faut préciser les champs\nUsage : cut -d',' -f1 fichier.csv\n  -d  séparateur (ex: -d',')\n  -f  numéro(s) de colonne (ex: -f1 ou -f1,3)"; err = true; break; }
        const wanted = fields.split(",").map(x => parseInt(x)).filter(x => !isNaN(x));
        const fname = this._expandFileArgs(args.filter((a, i) => !a.startsWith("-") && args[i-1] !== "-d" && args[i-1] !== "-f"))[0];
        let content = stdin;
        if (fname && this.fs[fname]) content = this.fs[fname].content || "";
        else if (fname && !this.fs[fname]) { out = `cut: ${fname}: Aucun fichier ou dossier de ce type`; err = true; break; }
        out = content.split("\n").map(l => {
          const cols = l.split(sep);
          return wanted.map(w => cols[w-1] ?? "").join(sep);
        }).join("\n");
        break;
      }

      case "tr": {
        // tr 'a-z' 'A-Z'  ·  tr -d 'x'
        const del = args.includes("-d");
        const sets = args.filter(a => !a.startsWith("-"));
        const expand = (s) => {
          let res = "";
          for (let i = 0; i < s.length; i++) {
            if (s[i+1] === "-" && s[i+2]) {
              const a = s.charCodeAt(i), b = s.charCodeAt(i+2);
              for (let c = a; c <= b; c++) res += String.fromCharCode(c);
              i += 2;
            } else res += s[i];
          }
          return res;
        };
        const from = expand(sets[0] || "");
        if (!from) { out = "tr: usage: tr 'a-z' 'A-Z'  (ou tr -d 'x' pour supprimer)"; err = true; break; }
        let src = stdin || "";
        if (del) {
          out = src.split("").filter(c => !from.includes(c)).join("");
        } else {
          const to = expand(sets[1] || "");
          if (!to) { out = "tr: il manque le second ensemble\nExemple : tr 'a-z' 'A-Z'"; err = true; break; }
          out = src.split("").map(c => {
            const i = from.indexOf(c);
            return i >= 0 ? (to[Math.min(i, to.length-1)]) : c;
          }).join("");
        }
        break;
      }

      case "tree": {
        const files = Object.keys(this.fs).sort();
        const roots = files.filter(f => !f.includes("/"));
        const res = ["."];
        roots.forEach((f, i) => {
          const isLast = i === roots.length - 1;
          const node = this.fs[f];
          res.push((isLast ? "└── " : "├── ") + f + (node.type === "dir" ? "/" : ""));
          if (node.type === "dir") {
            const children = files.filter(k => k.startsWith(f + "/"));
            children.forEach((c, j) => {
              const cl = j === children.length - 1;
              res.push((isLast ? "    " : "│   ") + (cl ? "└── " : "├── ") + c.slice(f.length + 1));
            });
          }
        });
        const nd = files.filter(f => this.fs[f].type === "dir").length;
        const nf = files.length - nd;
        res.push("");
        res.push(`${nd} répertoire${nd>1?"s":""}, ${nf} fichier${nf>1?"s":""}`);
        out = res.join("\n");
        break;
      }

      case "du": {
        const files = Object.keys(this.fs).filter(f => this.fs[f].type !== "dir");
        out = files.map(f => {
          const size = (this.fs[f].content || "").length;
          const h = args.includes("-h") ? (size > 1024 ? (size/1024).toFixed(1)+"K" : size+"B") : Math.max(1, Math.ceil(size/512));
          return `${h}\t./${f}`;
        }).join("\n") || "0\t.";
        break;
      }

      case "date": {
        out = new Date().toLocaleString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit", second:"2-digit" });
        break;
      }

      case "uname": {
        out = args.includes("-a")
          ? "Linux dojo 6.8.0-dojo #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"
          : "Linux";
        break;
      }

      case "hostname": { out = "dojo"; break; }

      case "uptime": {
        const mins = Math.floor(performance.now() / 60000);
        out = ` ${new Date().toLocaleTimeString("fr-FR")} up ${mins} min,  1 user,  load average: 0.42, 0.13, 0.07`;
        break;
      }

      case "free": {
        out = [
          "               total       utilisé      libre",
          "Mem:        16384 Mo      4242 Mo    12142 Mo",
          "Swap:        2048 Mo         0 Mo     2048 Mo"
        ].join("\n");
        break;
      }

      case "history": {
        out = this.cmdLog.map((c, i) => `  ${String(i+1).padStart(3)}  ${c}`).join("\n") || "(historique vide)";
        break;
      }

      case "man": {
        const topic = args[0];
        if (!topic) { out = "Quelle page de manuel voulez-vous ?\nUsage : man COMMANDE   (ex: man grep)"; err = true; break; }
        if (typeof GLOSSARY === "undefined") { out = `man: pas de manuel pour ${topic}`; err = true; break; }
        const entry = GLOSSARY.find(g => g.cmd === topic || g.cmd.split(" ")[0] === topic || g.cmd.split(" / ").includes(topic));
        if (!entry) { out = `man: aucune entrée de manuel pour ${topic}\n💡 Consulte l'onglet Glossaire pour la liste complète.`; err = true; break; }
        this.state.man = topic;
        const L = [];
        L.push(`${topic.toUpperCase()}(1)                    Manuel LinuxDojo                    ${topic.toUpperCase()}(1)`);
        L.push("");
        L.push("NOM");
        L.push(`       ${entry.cmd} — ${entry.desc}`);
        L.push("");
        L.push("SYNOPSIS");
        L.push(`       ${entry.syntax}`);
        if (entry.options && entry.options.length) {
          L.push("");
          L.push("OPTIONS");
          entry.options.forEach(o => L.push(`       ${o[0].padEnd(14)} ${o[1]}`));
        }
        if (entry.examples && entry.examples.length) {
          L.push("");
          L.push("EXEMPLES");
          entry.examples.forEach(e => L.push(`       $ ${e[0].padEnd(28)} # ${e[1]}`));
        }
        out = L.join("\n");
        break;
      }

      case "whatis": {
        const topic = args[0];
        if (!topic || typeof GLOSSARY === "undefined") { out = `whatis: usage: whatis COMMANDE`; err = true; break; }
        const entry = GLOSSARY.find(g => g.cmd === topic || g.cmd.split(" ")[0] === topic);
        out = entry ? `${topic} (1) — ${entry.desc}` : `${topic} : rien d'approprié.`;
        if (!entry) err = true;
        break;
      }

      case "ping": {
        const host = args.find(a => !a.startsWith("-")) || "localhost";
        out = [
          `PING ${host} (127.0.0.1) 56(84) octets de données.`,
          `64 octets de ${host}: icmp_seq=1 ttl=64 temps=0.042 ms`,
          `64 octets de ${host}: icmp_seq=2 ttl=64 temps=0.038 ms`,
          `64 octets de ${host}: icmp_seq=3 ttl=64 temps=0.040 ms`,
          "",
          `--- statistiques ping ${host} ---`,
          "3 paquets transmis, 3 reçus, 0% perte de paquets"
        ].join("\n");
        break;
      }

      /* ── Easter eggs & culture Linux ─────────────────────── */
      case "cowsay": {
        const msg = (stdin || args.join(" ") || "Meuh ?").trim();
        const line = "─".repeat(Math.min(msg.length + 2, 42));
        out = [
          ` ┌${line}┐`,
          ` │ ${msg} │`,
          ` └${line}┘`,
          "        \\   ^__^",
          "         \\  (oo)\\_______",
          "            (__)\\       )\\/\\",
          "                ||----w |",
          "                ||     ||"
        ].join("\n");
        break;
      }

      case "fortune": {
        const F = [
          "« Tout est fichier. » — Philosophie UNIX",
          "« Parle peu, pipe beaucoup. » — Sagesse du shell",
          "Il n'y a pas de nuage, juste l'ordinateur de quelqu'un d'autre.",
          "chmod 777 est rarement la réponse. Presque jamais. Non.",
          "Un bon admin est un admin paresseux : il automatise tout.",
          "« rm -rf » ne pardonne pas. Réfléchis avant Entrée.",
          "La commande la plus dangereuse : celle qu'on copie-colle sans lire.",
          "Debugger, c'est être détective dans un crime dont tu es aussi le coupable.",
          "Ctrl+C, Ctrl+V : les deux piliers du génie logiciel moderne.",
          "Si ça marche pas : man. Si ça marche : commit."
        ];
        out = F[Math.floor(Math.random() * F.length)];
        break;
      }

      case "sl": {
        out = [
          "🚂 Tchou tchou ! Tu as encore tapé 'sl' au lieu de 'ls'...",
          "",
          "      ====        ________                ___________",
          "  _D _|  |_______/        \\__I_I_____===__|_________|",
          "   |(_)---  |   H\\________/ |   |        =|___ ___|  ",
          "   /     |  |   H  |  |     |   |         ||_| |_||  ",
          "  |      |  |   H  |__--------------------| [___] |  ",
          "  | ________|___H__/__|_____/[][]~\\_______|       |  ",
          "  |/ |   |-----------I_____I [][] []  D   |=======|__",
          "",
          "(le vrai 'sl' sous Linux affiche une locomotive qui traverse ton terminal)"
        ].join("\n");
        break;
      }

      case "sudo": {
        if (args.join(" ").includes("sandwich")) { out = "D'accord. 🥪"; break; }  // xkcd 149
        out = "user n'apparaît pas dans le fichier sudoers.\nCet incident sera signalé. 👮\n\n(Ici, pas besoin de sudo — tu es déjà maître du dojo.)";
        err = true;
        break;
      }

      case "vim":
      case "vi": {
        out = "Tu es entré dans Vim.\n\n⚠️  Statistiquement, tu vas y rester coincé 2 heures.\nPour sortir : Échap puis :q!  (ici, tape juste :q!)";
        this.state.vim = true;
        break;
      }
      case ":q!":
      case ":wq": {
        out = this.state.vim ? "Ouf. Tu es sorti de Vim. Peu y parviennent du premier coup. 🏆" : "E492: Commande inconnue (tu n'es même pas dans Vim)";
        this.state.vim = false;
        break;
      }
      case "nano": { out = "GNU nano — l'éditeur de ceux qui veulent juste que ça marche. (simulé)\nCtrl+X pour quitter. Ici, rien à éditer."; break; }
      case "emacs": { out = "Emacs : un excellent système d'exploitation.\nIl ne lui manque qu'un bon éditeur de texte. 😈"; break; }

      case "exit":
      case "logout": {
        out = "On ne quitte pas le dojo aussi facilement. 🥋\n(Ferme l'onglet si tu veux vraiment partir... lâcheur.)";
        break;
      }

      case "clear":
        this.clear();
        return { output: "", error: false };

      case "help":
        out = [
          "═══ COMMANDES DU DOJO ═══",
          "Navigation   : ls [-la], cd, pwd, tree, find",
          "Fichiers     : cat, less, head, tail, touch, mkdir, cp, mv, rm, ln -s, chmod",
          "Texte        : grep [-invc], sort, uniq [-c], wc [-lwc], cut -d -f, tr, sed, awk",
          "Système      : ps aux, kill, whoami, id, df -h, du, free, uptime, uname -a, date",
          "Environnement: echo $VAR, env, export VAR=x, history, hostname",
          "Réseau       : curl, ping",
          "Décodage     : base64 [-d], rot13, xxd -r -p",
          "Aide         : man CMD, whatis CMD, help",
          "",
          "Pipes & redirections :  cmd1 | cmd2   ·   cmd > fichier   ·   cmd >> fichier (ajout)",
          "Jokers :  cat *.txt  ·  rm *.log",
          "Astuces : Tab autocomplète · ↑/↓ historique · man grep pour le manuel",
          "",
          "🥚 Il paraît que le dojo cache des secrets... (cowsay ? sl ? fortune ? vim ?)"
        ].join("\n");
        break;

      default:
        // Erreurs pédagogiques — suggestions selon la proximité
        out = this._cmdNotFound(cmd, args);
        err = true;
    }

    if (!silent) {
      if (err) {
        this.printErr(out);
      } else if (out !== null && out !== "") {
        out.split("\n").forEach(l => this.printOut(l));
      }
    }

    return { output: out, error: err };
  }
}

if (typeof module !== "undefined") module.exports = { Terminal };
