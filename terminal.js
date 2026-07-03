// terminal.js — Simulateur de terminal Linux

class Terminal {
  constructor(outputEl) {
    this.el = outputEl;
    this.cwd = "/home/user";
    this.fs = {};       // filesystem virtuel de la mission
    this.state = {};    // état interne (mkdir créé, cp, etc.)
  }

  // Charge le filesystem d'une mission
  loadFS(fs) {
    this.fs = JSON.parse(JSON.stringify(fs || {}));
    this.cwd = "/home/user";
    this.state = {};
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
    const known = ["ls","cd","cat","less","more","pwd","mkdir","touch","cp","mv","rm","chmod","grep","find","wc","sort","echo","ps","kill","whoami","id","df","ln","tar","curl","sed","awk","clear","help"];
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
      const cmds = ["ls","cd","cat","less","more","pwd","mkdir","touch","cp","mv","rm","chmod","grep","find","wc","sort","echo","ps","kill","whoami","id","df","ln","tar","curl","sed","awk","clear","help"];
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

    // Pipe
    if (raw.includes("|")) {
      return this._runPipe(raw);
    }
    // Redirection >
    if (raw.includes(">")) {
      return this._runRedirect(raw);
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

  _runRedirect(raw) {
    const [left, right] = raw.split(/>(.+)/).filter(Boolean);
    const fname = right ? right.trim() : "";
    const parts = this._parse(left.trim());
    const res = this._exec(parts, "", true);
    if (fname) {
      this.fs[fname] = { type: "file", content: res.output };
      this.state.redirect = fname;
      // pas d'affichage, redirigé
    }
    return { output: res.output, error: false };
  }

  // ── Commandes ──────────────────────────────────────────────────
  _exec(parts, stdin = "", silent = false) {
    const [cmd, ...args] = parts;
    if (!cmd) return { output: "", error: false };

    let out = "";
    let err = false;

    switch (cmd) {

      case "ls": {
        const hasA = args.some(a => a.includes("a"));
        const hasL = args.some(a => a.includes("l"));
        let files = Object.keys(this.fs);
        if (!hasA) files = files.filter(f => !f.startsWith("."));
        if (hasL) {
          out = files.map(f => {
            const node = this.fs[f];
            const perms = node.perms || (node.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--");
            const size = node.content ? node.content.length : 0;
            return `${perms}  1 user user ${String(size).padStart(6)}  ${f}`;
          }).join("\n");
        } else {
          out = files.join("  ");
        }
        break;
      }

      case "cat": {
        const fname = args[0];
        if (!fname) { out = "cat: manque le nom de fichier\nUsage : cat FICHIER\nExemple : cat readme.txt\n\nAstuce : tape 'ls' pour voir les fichiers disponibles."; err = true; break; }
        const node = this.fs[fname];
        if (!node) {
          const sugg = this._suggestFile(fname);
          out = `cat: ${fname}: Aucun fichier ou dossier de ce type${sugg ? "\nVoulais-tu dire : " + sugg + " ?" : "\n\nTape 'ls' pour voir les fichiers disponibles."}`;
          err = true; break;
        }
        if (node.type === "dir") { out = `cat: ${fname}: est un dossier\nPour lister son contenu : ls ${fname}`; err = true; break; }
        out = node.content || "";
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
        const p = args.filter(a => !a.startsWith("-"))[0];
        if (!p) { out = "rm: manque le nom du fichier\nUsage : rm FICHIER\nExemple : rm temp.log\n\n⚠️  Attention : pas de corbeille sous Linux, la suppression est définitive !"; err = true; break; }
        if (!this.fs[p]) {
          const sugg = this._suggestFile(p);
          out = `rm: impossible de supprimer '${p}': Aucun fichier ou dossier de ce type${sugg ? "\nVoulais-tu dire : rm " + sugg + " ?" : ""}`;
          err = true; break;
        }
        delete this.fs[p];
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
        const noFlag = args.filter(a => !a.startsWith("-"));
        const caseFlag = args.includes("-i") || args.includes("-ni") || args.includes("-in");
        const numFlag  = args.includes("-n") || args.includes("-ni");
        const pattern  = noFlag[0];
        const fname    = noFlag[1];
        if (!pattern) { out = "grep: manque le motif de recherche\nUsage : grep MOTIF FICHIER\nExemple : grep ERROR app.log\n\nOptions utiles :\n  -i  ignorer la casse\n  -n  afficher les numéros de ligne\n  -c  compter les résultats"; err = true; break; }

        let content = stdin;
        if (fname && this.fs[fname]) content = this.fs[fname].content || "";
        else if (fname && !this.fs[fname]) { out = `grep: ${fname}: Aucun fichier ou dossier de ce type`; err = true; break; }

        const lines = content.split("\n");
        const matched = lines
          .map((l, i) => ({ line: l, num: i + 1 }))
          .filter(({ line }) => caseFlag ? line.toLowerCase().includes(pattern.toLowerCase()) : line.includes(pattern));
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
        const fname = args.filter(a => !a.startsWith("-"))[0];
        let content = stdin;
        if (fname && this.fs[fname]) content = this.fs[fname].content || "";
        const lines = content.split("\n").length;
        const words = content.split(/\s+/).filter(Boolean).length;
        const chars = content.length;
        if (hasL) out = `${lines}${fname ? " " + fname : ""}`;
        else if (hasW) out = `${words}${fname ? " " + fname : ""}`;
        else if (hasC) out = `${chars}${fname ? " " + fname : ""}`;
        else out = `${lines} ${words} ${chars}${fname ? " " + fname : ""}`;
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
        // Résoudre les variables
        out = joined
          .replace(/\$HOME/g, "/home/user")
          .replace(/\$USER/g, "user")
          .replace(/\$PATH/g, "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin")
          .replace(/\$SHELL/g, "/bin/bash")
          .replace(/\$(\w+)/g, "");
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

      case "clear":
        this.clear();
        return { output: "", error: false };

      case "help":
        out = [
          "Commandes disponibles :",
          "  ls, ls -la, cat, less, pwd, cd, mkdir, touch",
          "  cp, mv, rm, chmod, grep, find, wc, sort",
          "  echo, ps aux, kill, whoami, df -h",
          "  ln -s, tar, curl, sed, awk",
          "  base64 [-d], rot13, xxd -r -p   (décodage)",
          "",
          "Astuces : Tab autocomplète · ↑/↓ historique · | pour les pipes · > pour rediriger"
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
