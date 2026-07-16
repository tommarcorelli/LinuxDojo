// i18n/levels.en.js — Traductions anglaises des scénarios de levels.js.
//
// Chargé juste APRÈS js/levels.js. Indexé par id de chapitre puis id de
// mission. Pour chaque mission on ne fournit que les champs visibles à
// traduire ; le reste (cmd, xp, fs, check, flags/cmd des exemples) vient de
// levels.js et reste inchangé. Les tableaux lesson.options / lesson.examples
// contiennent, par index, la traduction du champ desc / comment.
//
// overlayLevels() (js/i18n.js) applique cet overlay sur CHAPTERS UNIQUEMENT
// si LANG === "en" : en français, ce fichier ne modifie rien.

const LEVELS_EN = {

  // ══ Scénario 1 — Le serveur est tombé ══
  1: {
    title: "🔥 Scenario 1 — The server went down",
    scenario: "It's 3 a.m. An alert wakes you up: the site is down. You connect over SSH. You don't know what happened. It's up to you to find out.",
    missions: {
      1: {
        name: "Step 1 — See what's there",
        lesson: {
          title: "The <code>ls</code> command — List files",
          intro: "You've just landed on the server. You don't know what's there. <code>ls</code> (list) is your flashlight — it shows you everything in the current directory.",
          syntax: "ls [options] [path]",
          options: [
            "Long format: permissions, size, modification date",
            "Shows hidden files (those starting with .)",
            "Human-readable sizes: KB, MB, GB (use with -l)",
            "Combined: long + hidden — the most used in practice",
          ],
          examples: [
            "# simple listing of the current directory",
            "# with size, date, permissions",
            "# show everything, including hidden files",
            "# list another directory",
          ],
          tip: "On an unknown server, the first command every admin types is `ls -la`. Make it a reflex.",
        },
        desc: "You've just connected. What's on this server? Explore the current directory.",
        hint: "The command to list files is called ls",
        explanation: "You can see there's a <code>logs/</code> directory and a <code>config.json</code> file. That's where we'll dig into what happened. <code>ls</code> is always the starting point.",
      },
      2: {
        name: "Step 2 — Enter the logs",
        lesson: {
          title: "The <code>cd</code> command — Navigate",
          intro: "You saw there's a <code>logs/</code> directory. To go into it, you use <code>cd</code> (Change Directory). It's like double-clicking a folder, but on the command line.",
          syntax: "cd [path]",
          options: [
            "Enter the logs directory (relative path)",
            "Go up one level (parent directory)",
            "Return to your home directory",
            "Go straight to /var (absolute path)",
          ],
          examples: [
            "# enter logs/",
            "# go up one level",
            "# back to home",
          ],
          tip: "After a `cd`, always run `ls` to see what's in the new directory. That's the cd → ls reflex.",
        },
        desc: "You spotted the <code>logs/</code> directory in the previous step. Go into it.",
        hint: "cd followed by the directory name",
        explanation: "You're now inside the <code>logs/</code> directory. The natural reflex is: cd into the folder → ls to see what it contains. That's exactly what we'll do next.",
      },
      3: {
        name: "Step 3 — View the logs",
        lesson: {
          title: "<code>ls -la</code> — The detailed format",
          intro: "You're in the logs/ directory. You want to see every file, including hidden ones, with their modification dates. That's where <code>ls -la</code> becomes useful.",
          syntax: "ls -la",
          options: [
            "Shows permissions, size, and date",
            "Includes hidden files (starting with .)",
          ],
          examples: [
            "# show everything in detailed format",
            "# same, but sizes in KB/MB/GB",
          ],
          tip: "The modification date in `ls -la` is precious: if a file was changed the night of the crash, that's a clue.",
        },
        desc: "You're in the <code>logs/</code> directory. List everything it contains in detailed format to see the dates.",
        hint: "ls with the -la options to see everything in detail",
        explanation: "You see two files: <code>access.log</code> (the HTTP requests) and <code>error.log</code> (the errors). And a hidden file <code>.debug.log</code>. The one you care about to understand the crash is <code>error.log</code>.",
      },
      4: {
        name: "Step 4 — Read the error log",
        lesson: {
          title: "The <code>cat</code> command — Read a file",
          intro: "<code>cat</code> prints a file's contents to the terminal. It's the most direct way to read a file without opening an editor.",
          syntax: "cat [file]",
          options: [
            "Show line numbers",
          ],
          examples: [
            "# read the error file",
            "# read a config",
            "# with line numbers",
          ],
          tip: "For short files, `cat` is perfect. For files of thousands of lines, use `less` instead.",
        },
        desc: "You spotted <code>error.log</code>. Read its contents to understand what crashed the server.",
        hint: "cat followed by the file name to display its contents",
        explanation: "You found the cause: <strong>the disk is full</strong>. The server could no longer write to /tmp/cache, then crashed. Now you know what to fix. This is exactly how it goes in real life: ls → cd → cat → diagnosis.",
      },
      5: {
        name: "Step 5 — Count the errors",
        lesson: {
          title: "The <code>grep</code> command — Filter",
          intro: "You know the log contains errors, but you only want the ERROR lines. <code>grep</code> filters a file and shows only the lines that contain the pattern you're looking for.",
          syntax: "grep pattern file",
          options: [
            "Case-insensitive: ERROR = error = Error",
            "Show the line number",
            "Count the number of matching lines",
            "Invert: lines that do NOT contain the pattern",
          ],
          examples: [
            "# all lines with ERROR",
            "# ERROR, Error, error...",
            "# how many lines with ERROR?",
          ],
          tip: "In production, `grep ERROR /var/log/app.log` is often the first command you type when something breaks.",
        },
        desc: "You want to isolate only the error lines in <code>error.log</code>. Filter them with grep.",
        hint: "grep ERROR followed by the file name",
        explanation: "You filtered only the ERROR lines — the INFO lines are gone. You clearly see the 4 errors. That's much more readable than reading the whole file. On a 100,000-line log, grep is a lifesaver.",
      },
      6: {
        name: "Step 6 — How many errors?",
        lesson: {
          title: "Combining grep and <code>wc -l</code> with a pipe",
          intro: "The pipe <code>|</code> connects two commands: the output of the first becomes the input of the second. It's the most powerful concept in the terminal.",
          syntax: "command1 | command2",
          options: [
            "Count the number of lines received",
            "Count the number of words",
          ],
          examples: [
            "# how many errors?",
            "# how many files?",
            "# a chain of 3 commands",
          ],
          tip: "The `grep | wc -l` combo is a classic. You can chain as many pipes as you want.",
        },
        desc: "Your boss asks: exactly how many errors since this morning? Use grep and wc together.",
        hint: "grep ERROR error.log | wc -l — connect grep and wc with the pipe |",
        explanation: "4 errors. You can now answer your boss precisely. The pipe connected grep (which filters) and wc -l (which counts). Each command does one thing, but together they're powerful.",
      },
    },
  },

  // ══ Scénario 2 — Préparer un déploiement ══
  2: {
    title: "📦 Scenario 2 — Prepare a deployment",
    scenario: "You need to deploy a new version of the application. That means creating directories, backing up what exists, and preparing the config files.",
    missions: {
      7: {
        name: "Step 1 — Create the structure",
        lesson: {
          title: "The <code>mkdir</code> command — Create directories",
          intro: "<code>mkdir</code> creates a new directory. Simple, but essential to organize a project.",
          syntax: "mkdir [options] name",
          options: [
            "Create missing parent directories in a single command",
          ],
          examples: [
            "# create a backup directory",
            "# create the whole tree",
            "# several directories at once",
          ],
          tip: "The `-p` option is very handy: `mkdir -p a/b/c` creates a/, then a/b/, then a/b/c/ in a single command.",
        },
        desc: "Before deploying, you need a <code>backup</code> directory to save the old version. Create it.",
        hint: "mkdir followed by the name of the directory to create",
        explanation: "The <code>backup/</code> directory is created. Now you can copy the old version into it before deploying the new one. That's the good practice: always back up before making changes.",
      },
      8: {
        name: "Step 2 — Back up the config",
        lesson: {
          title: "The <code>cp</code> command — Copy",
          intro: "<code>cp</code> copies a file. The source stays intact, a copy is created at the destination.",
          syntax: "cp source destination",
          options: [
            "Recursive copy — required to copy a whole directory",
            "Verbose: shows each copied file",
          ],
          examples: [
            "# copy into the backup directory",
            "# copy with a new name",
            "# copy a whole directory",
          ],
          tip: "Before editing a config file in production, ALWAYS make a copy. If it breaks, you can restore.",
        },
        desc: "Copy <code>config.json</code> into the <code>backup/</code> directory before modifying it.",
        hint: "cp takes the source and the destination: cp config.json backup/",
        explanation: "The config is saved in <code>backup/</code>. If the deployment breaks, you can restore with <code>cp backup/config.json config.json</code>. That's your safety net.",
      },
      9: {
        name: "Step 3 — Update the config",
        lesson: {
          title: "<code>echo</code> and the <code>&gt;</code> redirection",
          intro: "<code>echo</code> prints text. Combined with <code>&gt;</code>, it writes that text into a file. It's the fastest way to write to a file from the terminal.",
          syntax: 'echo "text" > file',
          options: [
            "Redirects to a file. OVERWRITES the existing content.",
            "Appends to the end of the file without overwriting.",
          ],
          examples: [
            "# create/overwrite .env",
            "# append a line to .env",
            "# write the version",
          ],
          tip: "Mind the difference: `>` overwrites everything, `>>` appends. One mistake and you lose the file's contents!",
        },
        desc: "Update the <code>VERSION</code> file to indicate this is version <code>2.0.0</code>.",
        hint: 'echo "2.0.0" > VERSION',
        explanation: "You overwrote the VERSION file with the new value. The <code>&gt;</code> redirects echo's output to the file instead of printing it in the terminal. Simple and fast.",
      },
      10: {
        name: "Step 4 — Rename the old version",
        lesson: {
          title: "The <code>mv</code> command — Move / Rename",
          intro: "<code>mv</code> does two things: rename a file, or move it to another directory. It's the same command for both.",
          syntax: "mv source destination",
          options: [
            "Shows what is moved/renamed",
          ],
          examples: [
            "# rename the file",
            "# move into backup/",
            "# move all the .log files",
          ],
          tip: "Unlike `cp`, `mv` removes the original. The file is moved/renamed, not copied.",
        },
        desc: "Rename <code>app.js</code> to <code>app.v1.js</code> to keep a trace of the old version.",
        hint: "mv followed by the old name and the new name",
        explanation: "The old <code>app.js</code> is now <code>app.v1.js</code>. You can now deploy v2 without losing v1. If v2 breaks, you still have v1 on hand.",
      },
      11: {
        name: "Step 5 — Clean up old logs",
        lesson: {
          title: "The <code>rm</code> command — Delete ⚠️",
          intro: "<code>rm</code> deletes files permanently. There's no trash on Linux. What's deleted is gone.",
          syntax: "rm [options] file",
          options: [
            "Delete a directory and all its contents (recursive)",
            "Ask for confirmation before each deletion",
            "Force without confirmation",
          ],
          examples: [
            "# delete a file",
            "# delete a whole directory",
            "# with confirmation",
          ],
          tip: "⚠️ Always double-check before typing rm. There's no undo.",
        },
        desc: "The <code>debug.log</code> file is old and taking up space. Delete it.",
        hint: "rm followed by the name of the file to delete",
        explanation: "File deleted permanently. In production, old logs are cleaned up regularly to keep the disk from filling up — exactly the problem we diagnosed in scenario 1.",
      },
      12: {
        name: "Step 6 — Archive the backup",
        lesson: {
          title: "The <code>tar</code> command — Archive",
          intro: "<code>tar</code> compresses a whole directory into a single archive file. It's the standard tool for backups on Linux.",
          syntax: "tar -czf archive.tar.gz directory/",
          options: [
            "Create an archive",
            "Extract an archive",
            "Compress with gzip",
            "Specify the archive file name",
          ],
          examples: [
            "# compress the backup/ directory",
            "# extract the archive",
            "# list the contents without extracting",
          ],
          tip: "Memorize: `-czf` to create, `-xzf` to extract. The `z` is for gzip (compression).",
        },
        desc: "Archive the <code>backup/</code> directory into a single <code>backup.tar.gz</code> file to store it cleanly.",
        hint: "tar -czf backup.tar.gz backup/",
        explanation: "You created a compressed archive of your backup. It can now be transferred to another server or stored safely. The deployment is ready.",
      },
    },
  },

  // ══ Scénario 3 — Enquête forensique ══
  3: {
    title: "🔍 Scenario 3 — Forensic investigation",
    scenario: "Someone accessed the server without authorization. You have to analyze the logs, track down the intruder, and understand what they did.",
    missions: {
      13: {
        name: "Step 1 — Look for suspicious connections",
        lesson: {
          title: "<code>grep -i</code> — Case-insensitive search",
          intro: "<code>grep</code> searches for a pattern in a file and shows the matching lines. The <code>-i</code> option ignores the upper/lowercase difference.",
          syntax: "grep -i pattern file",
          options: [
            "Case-insensitive: FAILED = failed = Failed",
            "Show the line number",
            "Search across all files in a directory",
            "Invert: lines that do NOT contain the pattern",
          ],
          examples: [
            "# all failed attempts",
            "# invalid users",
            "# errors with line numbers",
          ],
          tip: "Authentication logs live in `/var/log/auth.log` on a real Linux server. It's the first thing you check after a break-in.",
        },
        desc: "There's an <code>auth.log</code> file. Look for all the failed login attempts (the word <code>failed</code>).",
        hint: "grep -i failed auth.log",
        explanation: "You see 4 failed attempts from <code>45.33.32.156</code>, then a successful one. It's a brute-force attack: the attacker tried passwords in a loop until they found the right one. And they succeeded.",
      },
      14: {
        name: "Step 2 — Identify the suspicious IP",
        lesson: {
          title: "The <code>sort</code> command — Sort",
          intro: "<code>sort</code> sorts lines alphabetically or numerically. Combined with a pipe, you can sort the output of any command.",
          syntax: "sort [options] [file]",
          options: [
            "Reverse sort (Z→A, high→low)",
            "Numeric sort (otherwise 10 comes before 2)",
            "Remove duplicates",
          ],
          examples: [
            "# alphabetical sort",
            "# sort IPs",
            "# unique IPs only",
          ],
          tip: "The `grep | sort | uniq -c | sort -rn` combo is a classic for counting and ranking occurrences in a log.",
        },
        desc: "Extract all the IPs from <code>auth.log</code> by searching for 'from' and sort them to spot the duplicates.",
        hint: "grep 'from' auth.log | sort",
        explanation: "Sorted, you clearly see that <code>45.33.32.156</code> appears 5 times, versus just once for <code>192.168.1.1</code>. The suspicious IP is identified.",
      },
      15: {
        name: "Step 3 — Count the attempts",
        lesson: {
          title: "<code>wc -l</code> — Count lines",
          intro: "<code>wc -l</code> counts the number of lines. With a pipe from grep, you count exactly how many times something appears in a file.",
          syntax: "grep pattern file | wc -l",
          options: [
            "Count lines",
            "Count words",
            "Count characters",
          ],
          examples: [
            "# how many failed attempts?",
            "# how many files?",
          ],
          tip: "This combo is used daily by sysadmins and security analysts.",
        },
        desc: "Your security report needs the exact number of failed attempts from the suspicious IP. Count them.",
        hint: "grep Failed auth.log | wc -l",
        explanation: "4 failed attempts, then 1 successful. The attacker found the password on the 5th try. This type of attack is called a brute-force attack. In real life, you'd block the IP with <code>iptables</code> or <code>fail2ban</code>.",
      },
      16: {
        name: "Step 4 — Find modified files",
        lesson: {
          title: "The <code>find</code> command — Find files",
          intro: "<code>find</code> searches for files by criteria: name, extension, modification date, size... It's far more powerful than searching by hand.",
          syntax: "find [path] [criteria]",
          options: [
            "Search by name or extension",
            "Modified less than 24h ago",
            "Files only (not directories)",
            "Directories only",
          ],
          examples: [
            "# all shell scripts",
            "# all log files",
            "# config files in /etc",
          ],
          tip: "The `.` means 'the current directory and all its subdirectories'. It's a classic starting point.",
        },
        desc: "The intruder may have left scripts behind. Find all the <code>.sh</code> files on the server.",
        hint: "find . -name '*.sh' to find all shell scripts",
        explanation: "You found two .sh files: <code>start.sh</code> (normal) and <code>malware.sh</code> (suspicious). The intruder left a malicious script. You can read its contents with <code>cat malware.sh</code> to see what it does.",
      },
      17: {
        name: "Step 5 — Read the suspicious script",
        lesson: {
          title: "Analyze a suspicious file with <code>cat</code>",
          intro: "You found a suspicious file. Before deleting it, you need to understand what it does. <code>cat</code> lets you read its contents without running it.",
          syntax: "cat file",
          options: [
            "Show line numbers — useful for scripts",
          ],
          examples: [
            "# read the suspicious script",
            "# with line numbers",
          ],
          tip: "NEVER run a suspicious script. Always read it first with `cat`.",
        },
        desc: "Read the contents of <code>malware.sh</code> to understand what the intruder was trying to do.",
        hint: "cat malware.sh to read the file's contents",
        explanation: "The script downloads a payload from the attacker's server and installs it in crontab to run every 5 minutes. It's a classic backdoor. Next step: delete this script and check the crontab.",
      },
      18: {
        name: "Step 6 — Remove the backdoor",
        lesson: {
          title: "Delete a malicious file with <code>rm</code>",
          intro: "You identified the malicious file. You know what it does. Time to delete it. <code>rm</code> deletes permanently — no trash.",
          syntax: "rm file",
          options: [
            "Ask for confirmation before deleting",
          ],
          examples: [
            "# delete the malicious script",
            "# delete the .sh files with confirmation",
          ],
          tip: "In security, before deleting, always make a copy of the malicious file in a safe place for analysis. Here we simplify.",
        },
        desc: "Delete the <code>malware.sh</code> file to eliminate the backdoor.",
        hint: "rm followed by the name of the malicious file",
        explanation: "Backdoor removed. You ran a real forensic investigation: log analysis, attacker identification, malware discovery, cleanup. That's exactly what security analysts do.",
      },
    },
  },

  // ══ Scénario 4 — Sécuriser le serveur ══
  4: {
    title: "🔐 Scenario 4 — Secure the server",
    scenario: "After the break-in, you have to secure the server: fix permissions, deal with suspicious processes, and lock down access.",
    missions: {
      19: {
        name: "Step 1 — Audit the permissions",
        lesson: {
          title: "Read permissions with <code>ls -l</code>",
          intro: "Every Linux file has permissions: who can read it (r), write it (w), execute it (x). There are 3 levels: the owner, the group, and everyone else.",
          syntax: "ls -l",
          examples: [
            "# see the permissions of everything",
            "# permissions of a specific file",
          ],
          tip: "Format: `-rwxrwxrwx` — owner/group/others. `r`=read, `w`=write, `x`=execute, `-`=no permission.",
        },
        desc: "Audit the permissions of the server's sensitive files. Which are too permissive?",
        hint: "ls -l to see all the permissions",
        explanation: "You see two problems: <code>deploy.sh</code> is executable by everyone (rwxrwxrwx) and <code>secret.key</code> is readable by everyone (rw-rw-rw-). These permissions are dangerous. We'll fix them.",
      },
      20: {
        name: "Step 2 — Fix the permissions",
        lesson: {
          title: "The <code>chmod</code> command — Change permissions",
          intro: "<code>chmod</code> changes a file's permissions. You can use letters (+x, -w) or octal numbers (755, 600).",
          syntax: "chmod permissions file",
          options: [
            "Add the execute permission",
            "Remove the write permission",
            "rw------- : only the owner can read/write",
            "rwxr-xr-x : owner everything, group+others execute only",
            "rw-r--r-- : owner reads/writes, others read only",
          ],
          examples: [
            "# secret file: owner access only",
            "# script: executable but not editable by all",
            "# add execution",
          ],
          tip: "Remember: `600` for secret files, `644` for normal files, `755` for scripts.",
        },
        desc: "The <code>secret.key</code> file is readable by everyone. Fix that with permissions <code>600</code>.",
        hint: "chmod 600 secret.key to restrict access to the owner only",
        explanation: "With <code>chmod 600 secret.key</code>, only the owner can read and write this file. The group and others get no rights. That's the correct permission for an SSH private key or a certificate.",
      },
      21: {
        name: "Step 3 — Spot suspicious processes",
        lesson: {
          title: "The <code>ps aux</code> command — See the processes",
          intro: "<code>ps aux</code> shows all the processes running on the system. It's the command-line equivalent of the Task Manager.",
          syntax: "ps aux",
          options: [
            "All users",
            "Readable format with CPU and memory",
            "Includes processes without a terminal",
          ],
          examples: [
            "# all processes",
            "# is python running?",
            "# check nginx",
          ],
          tip: "Key columns: USER (who started it), PID (identifier), %CPU, %MEM, COMMAND (the command).",
        },
        desc: "Check the running processes. There may still be attacker processes running.",
        hint: "ps aux to see all the running processes",
        explanation: "You see the normal processes (bash, nginx) but also a suspicious one. The PID is the unique identifier — you'll need it to stop the suspicious process.",
      },
      22: {
        name: "Step 4 — Kill the suspicious process",
        lesson: {
          title: "The <code>kill</code> command — Stop a process",
          intro: "<code>kill</code> sends a signal to a process to stop it. By default it asks it to stop cleanly. <code>kill -9</code> forces it to stop immediately.",
          syntax: "kill [signal] PID",
          options: [
            "Clean stop (SIGTERM signal)",
            "Forced stop (SIGKILL signal) — if the first doesn't work",
          ],
          examples: [
            "# ask process 1337 to stop",
            "# force the stop",
            "# kill all node processes",
          ],
          tip: "Always try `kill PID` first. If it doesn't work, then `kill -9 PID`.",
        },
        desc: "The suspicious process is running with PID <code>1337</code>. Stop it.",
        hint: "kill followed by the PID of the process to stop",
        explanation: "Process 1337 terminated. By combining <code>ps aux | grep suspect</code> to find the PID, then <code>kill PID</code> to stop it, you have the full workflow of an admin cleaning up a compromised server.",
      },
      23: {
        name: "Step 5 — Check who is logged in",
        lesson: {
          title: "<code>whoami</code> and <code>id</code> — Your identity on the system",
          intro: "On Linux, every action runs as a user with specific rights. These commands tell you who you are in the system's eyes.",
          syntax: "whoami",
          examples: [
            "# your username",
            "# your UID, GID, and groups",
            "# your groups",
          ],
          tip: "If `whoami` returns `root`, you have all rights. That's powerful but dangerous — one mistake and you can break everything.",
        },
        desc: "After the break-in, check which user you're currently working as.",
        hint: "whoami is a command that returns your username",
        explanation: "You're working as <code>user</code>. The attacker had managed to log in as <code>root</code>. If you'd been root, you should have immediately changed the password with <code>passwd</code>.",
      },
      24: {
        name: "Step 6 — Check the environment variables",
        lesson: {
          title: "Environment variables",
          intro: "Environment variables store important information for the system and programs. The attacker could have changed some to leave a backdoor.",
          syntax: "echo $VARIABLE",
          examples: [
            "# where Linux looks for programs",
            "# your home directory",
            "# your username",
            "# all the variables at once",
          ],
          tip: "An attacker can change `$PATH` so your commands point to their malicious scripts instead of the real ones. Always check after a break-in.",
        },
        desc: "Check the <code>$PATH</code> variable to make sure it hasn't been compromised.",
        hint: "echo $PATH to see where Linux looks for programs",
        explanation: "The PATH looks normal: it points to <code>/usr/bin</code>, <code>/bin</code>, etc. If the attacker had added <code>/tmp</code> at the start of PATH, your system commands could have been hijacked to their scripts.",
      },
    },
  },

  // ══ Scénario 5 — Optimiser le serveur ══
  5: {
    title: "⚡ Scenario 5 — Optimize the server",
    scenario: "The server is running slowly. You need to analyze resource usage, clean up useless files, and prepare a migration.",
    missions: {
      25: {
        name: "Step 1 — Check the disk",
        lesson: {
          title: "<code>df -h</code> — Available disk space",
          intro: "<code>df</code> (Disk Free) shows the disk space of each partition. The <code>-h</code> option shows sizes in KB/MB/GB instead of bytes.",
          syntax: "df -h",
          options: [
            "Human-readable: KB, MB, GB instead of bytes",
          ],
          examples: [
            "# space of all partitions",
            "# size of the /var/log directory",
            "# size of each item here",
          ],
          tip: "A disk at 90%+ is an emergency. Applications start crashing when the disk is full.",
        },
        desc: "The server is slow. Start by checking whether the disk is full.",
        hint: "df -h to see the available disk space",
        explanation: "You see the usage of each partition. If a partition is at 95%+, that's the cause of the problem. Logs and temporary files are often the culprits.",
      },
      26: {
        name: "Step 2 — Find the big files",
        lesson: {
          title: "<code>find</code> with advanced criteria",
          intro: "You know the disk is full. But which files are taking up space? <code>find</code> can search by size.",
          syntax: "find . -name '*.log'",
          options: [
            "Search by name/extension",
            "Files larger than 10 MB",
            "Files only",
          ],
          examples: [
            "# all log files",
            "# logs in /var",
            "# temporary files",
          ],
          tip: ".log and .tmp files are often the culprits when the disk is full. `find` lets you locate them all in one command.",
        },
        desc: "Find all the <code>.log</code> files in the current directory — they're probably the ones filling the disk.",
        hint: "find . -name '*.log' to find all the log files",
        explanation: "You found 4 .log files. In production, these files can reach several gigabytes. Now you know what to clean up.",
      },
      27: {
        name: "Step 3 — Analyze a log with sed",
        lesson: {
          title: "The <code>sed</code> command — Edit text",
          intro: "<code>sed</code> (Stream Editor) edits text on the fly. Its main use: replace text in a file without opening it in an editor.",
          syntax: "sed 's/old/new/g' file",
          options: [
            "Replace x with y (1st occurrence per line)",
            "Replace x with y everywhere (global)",
            "Edit the file directly (in-place)",
          ],
          examples: [
            "# print with replacement",
            "# edit the file",
            "# remove the word DEBUG",
          ],
          tip: "Always test without `-i` first to check the result. Add `-i` only when you're sure.",
        },
        desc: "In <code>config.json</code>, replace <code>localhost</code> with <code>prod.monserveur.com</code> to prepare the migration.",
        hint: "sed 's/localhost/prod.monserveur.com/g' config.json",
        explanation: "You replaced every occurrence of localhost with the production address. The trailing `g` is crucial: without it, only the first occurrence on each line would be replaced.",
      },
      28: {
        name: "Step 4 — Test the API",
        lesson: {
          title: "The <code>curl</code> command — HTTP requests",
          intro: "<code>curl</code> makes HTTP requests from the terminal. Essential for testing APIs, checking that a service responds, or downloading files.",
          syntax: "curl [options] URL",
          options: [
            "Show only the headers (not the body)",
            "Send a POST request",
            "Save the response to a file",
          ],
          examples: [
            "# simple GET request",
            "# check the HTTP status",
            "# health endpoint",
          ],
          tip: "Most APIs have a `/health` or `/ping` endpoint to check they're working. It's the first thing to test after a deployment.",
        },
        desc: "Check that the new server responds correctly by making a request to <code>https://prod.monserveur.com</code>.",
        hint: "curl followed by the server URL",
        explanation: "The server responds. In real life you'd check the HTTP code (200 = OK, 500 = server error). <code>curl -I https://prod.monserveur.com</code> shows just the headers, faster when you only want to know if it responds.",
      },
      29: {
        name: "Step 5 — Create a deployment link",
        lesson: {
          title: "Symbolic links — Zero-downtime deployment",
          intro: "A symbolic link points to a file or directory. Changing the link changes the destination instantly — with no service interruption. It's the zero-downtime deployment technique.",
          syntax: "ln -s target link_name",
          options: [
            "Create a symbolic link (soft link)",
            "Force: replace the existing link",
          ],
          examples: [
            "# current points to v2",
            "# update to v3",
          ],
          tip: "Classic technique: you prepare v2 completely, then just switch the `current` link from v1 to v2. The switch is instant and reversible.",
        },
        desc: "You have two versions of the app: <code>app-v1</code> and <code>app-v2</code>. Create an <code>app-current</code> link pointing to <code>app-v2</code>.",
        hint: "ln -s app-v2 app-current",
        explanation: "The <code>app-current</code> link now points to <code>app-v2</code>. If v2 breaks, a single command to roll back: <code>ln -sf app-v1 app-current</code>. That's the instant rollback.",
      },
      30: {
        name: "Step 6 — Analyze CSV data",
        lesson: {
          title: "The <code>awk</code> command — Extract columns",
          intro: "<code>awk</code> processes files column by column. Perfect for extracting structured data from CSVs, logs with fixed columns, etc.",
          syntax: "awk -F',' '{print $1}' file.csv",
          options: [
            "Sets the comma as the column separator",
            "Column number to print",
            "Number of the current line",
          ],
          examples: [
            "# 1st column (space separator)",
            "# 2nd column of a CSV",
            "# user and PID of each process",
          ],
          tip: "`awk` is a mini programming language. To start, just remember `-F` for the separator and `$N` for column N.",
        },
        desc: "You have a performance report <code>metrics.csv</code>. Extract only the server names (first column).",
        hint: "awk -F',' '{print $1}' metrics.csv for the first column",
        explanation: "You extracted only the server names. You can see that <code>prod-db-01</code> is WARNING with 95% CPU and 88% memory — it's probably the one slowing everything down. <code>awk</code> let you isolate that information in one line.",
      },
    },
  },

  // ══ Scénario 6 — Intrusion détectée ══
  6: {
    title: "🚨 Scenario 6 — Intrusion detected",
    scenario: "Monday, 7:02 a.m. Monitoring is screaming: someone broke into the server over the weekend. You're the analyst on duty. Traces, IP, rogue processes — run the investigation and write the report.",
    missions: {
      31: {
        name: "Step 1 — The latest traces",
        lesson: {
          title: "The <code>tail</code> command — The end of the logs",
          intro: "In a log file, the most recent lines are <strong>at the end</strong>. <code>tail</code> shows the last lines — it's THE analyst's reflex: \"what just happened?\". And thanks to <strong>paths</strong>, no need to move around: <code>tail logs/auth.log</code> targets the file directly.",
          syntax: "tail [-n N] path/file",
          options: [
            "Show the last 5 lines (10 by default)",
            "\"follow\" mode: shows new lines live (irreplaceable in prod)",
          ],
          examples: [
            "# the last 5 authentication events",
            "# absolute path: the end of the system log",
            "# follow the log in real time (Ctrl+C to quit)",
          ],
          tip: "`head` = the start, `tail` = the end. For an investigation, always start with `tail`: the incident is recent, so at the bottom of the file.",
        },
        desc: "The authentication log is in <code>logs/auth.log</code>. Without moving around, show its <strong>last 5 lines</strong> — that's where the break-in played out.",
        hint: "tail -n 5 logs/auth.log  (the path replaces moving around)",
        explanation: "Look at the last attempt: after a burst of <code>FAILED</code>, an <code>ACCEPTED root</code> at 23:41:40. Someone finally <strong>got in as root</strong> from 203.0.113.66. It's officially a break-in — the investigation begins.",
      },
      32: {
        name: "Step 2 — Measure the attack",
        lesson: {
          title: "<code>grep -c</code> and <code>grep -v</code> — Count and exclude",
          intro: "You know <code>grep</code> for filtering. Two options turn it into an analysis tool: <code>-c</code> (count) directly gives the <strong>number</strong> of matching lines, <code>-v</code> (invert) keeps the lines that do <strong>NOT</strong> contain the pattern.",
          syntax: "grep -c PATTERN path/file",
          options: [
            "Count matching lines (instead of printing them)",
            "Invert: lines WITHOUT the pattern",
            "Ignore upper/lowercase",
          ],
          examples: [
            "# how many failed logins?",
            "# everything that isn't normal",
            "# equivalent of -c, as a pipeline",
          ],
          tip: "An incident report demands precise figures. \"Lots of attempts\" means nothing; \"7 attempts in 31 seconds\" qualifies a brute-force.",
        },
        desc: "For the report, you need numbers: <strong>how many failed attempts</strong> (<code>FAILED</code> lines) does <code>logs/auth.log</code> contain?",
        hint: "grep -c FAILED logs/auth.log  (or grep FAILED logs/auth.log | wc -l)",
        explanation: "<strong>7 failed attempts in 31 seconds</strong>, then a successful one: that's the signature of a brute-force (a bot trying passwords in a loop). A human doesn't type 7 passwords in 31 seconds.",
      },
      33: {
        name: "Step 3 — Identify the attacker",
        lesson: {
          title: "Extract a column from a log — <code>awk</code> / <code>cut</code>",
          intro: "Each log line has 4 columns: <code>time status user ip</code>. To isolate the IPs, you chain: <code>grep</code> filters the interesting lines, then <code>awk '{print $4}'</code> (or <code>cut -d' ' -f4</code>) extracts the 4th column. It's THE log-analysis pipeline.",
          syntax: "grep PATTERN file | awk '{print $N}'",
          options: [
            "awk: the 4th column (separator = spaces)",
            "cut: same thing, explicit space separator",
          ],
          examples: [
            "# the IPs of the failures",
            "# same with cut",
            "# all the PIDs",
          ],
          tip: "filter (`grep`) THEN slice (`awk`/`cut`): remember this duo, it solves 80% of log analyses.",
        },
        desc: "Where does the attack come from? Extract <strong>only the IPs</strong> (4th column) of the <code>FAILED</code> lines in <code>logs/auth.log</code>.",
        hint: "grep FAILED logs/auth.log | awk '{print $4}'",
        explanation: "A single IP behind the 7 failures: <strong>203.0.113.66</strong>. Every attempt comes from the same machine. You've got your suspect — now confirm it's really the most aggressive one.",
      },
      34: {
        name: "Step 4 — The IP ranking",
        lesson: {
          title: "<code>sort | uniq -c</code> — The occurrence counter",
          intro: "The sysadmin's most famous pipeline: <code>sort</code> groups identical lines (uniq only sees <strong>adjacent</strong> duplicates!), then <code>uniq -c</code> counts each group. Result: an instant histogram.",
          syntax: "sort file | uniq -c",
          options: [
            "Prefixes each line with its occurrence count",
            "(bonus) re-sorts the result by ascending count",
          ],
          examples: [
            "# how many times each IP?",
            "# final ranking, worst at the bottom",
          ],
          tip: "Without `sort` first, `uniq` misses distant duplicates. sort → uniq, ALWAYS in that order.",
        },
        desc: "The firewall extracted all the week's IPs into <code>ips.txt</code>. Count the occurrences of each IP to prove which one dominates.",
        hint: "sort ips.txt | uniq -c",
        explanation: "<strong>6 occurrences for 203.0.113.66</strong>, far ahead of the legitimate internal IPs. No more doubt. This IP will be banned — but first, let's check what the intruder left behind.",
      },
      35: {
        name: "Step 5 — The backdoor",
        lesson: {
          title: "Hunt a process — <code>ps aux | grep</code> then <code>kill</code>",
          intro: "An intruder often leaves a running process (a \"backdoor\") to come back later. <code>ps aux</code> lists everything running; you filter with <code>grep</code>, spot the <strong>PID</strong> (2nd column), and kill it with <code>kill</code>.",
          syntax: "ps aux | grep PATTERN   then   kill PID",
          options: [
            "All the machine's processes",
            "Clean stop (SIGTERM)",
            "Forced stop (SIGKILL) — last resort",
          ],
          examples: [
            "# the running python processes",
            "# clean stop of PID 1235",
            "# if it resists",
          ],
          tip: "Before killing a process, note its name and PID for the report. On a real compromised machine, you capture the evidence first.",
        },
        desc: "The intruder left a suspicious <code>python3 app.py</code> process running. Spot its <strong>PID</strong> with <code>ps aux</code> (filter with grep if you want), then <strong>kill it</strong>.",
        hint: "ps aux | grep python  → spot the PID (2nd column) →  kill 1235",
        explanation: "The backdoor is dead. The <code>python3 app.py</code> process (PID 1235) was the intruder's way back in. On a real incident, you'd also have checked <code>crontab -l</code> and any added SSH keys — intruders love leaving several doors.",
      },
      36: {
        name: "Step 6 — The incident report",
        lesson: {
          title: "Record and protect — <code>echo ></code> then <code>chmod 600</code>",
          intro: "An incident without a report doesn't exist. You record the facts in a file (<code>echo \"...\" > report</code>), then <strong>protect</strong> it: <code>chmod 600</code> = read/write for you alone. An incident report contains sensitive info — it must not sit around as 644.",
          syntax: 'echo "text" > file   then   chmod 600 file',
          options: [
            "rw------- : you alone (secrets, reports, keys)",
            "rw-r--r-- : readable by all (normal files)",
            "rwxr-xr-x : executable by all (scripts)",
          ],
          examples: [
            "# record",
            "# protect",
            "# check: -rw-------",
          ],
          tip: "Remember the trio: 600 for secrets, 644 for files, 755 for scripts. 777, on the other hand, is NEVER the right answer.",
        },
        desc: "Final step: create the report (<code>echo \"IP 203.0.113.66 bannie - brute force\" > rapport-incident.txt</code>), then <strong>protect it as 600</strong> so only you can read it.",
        hint: 'echo "IP 203.0.113.66 banned" > rapport-incident.txt  then  chmod 600 rapport-incident.txt',
        explanation: "Investigation wrapped up: intrusion identified (SSH brute-force), attacker confirmed (203.0.113.66), backdoor eliminated (PID 1235), report written and protected as <code>-rw-------</code>. That's exactly how a real incident response unfolds. 🛡️ Nice work, analyst.",
      },
    },
  },

  // ══ Scénario 7 — Automatiser (scripting) ══
  7: {
    title: "🤖 Scenario 7 — Automate (scripting)",
    scenario: "You're tired of repeating the same commands by hand. Time to do what every good admin does: automate. Variables, loops, conditions, scripts — the shell becomes a real language.",
    missions: {
      37: {
        name: "Step 1 — A variable",
        lesson: {
          title: "<code>variables</code> — remember a value",
          intro: "A variable stores a value you reuse later. You write it <strong>without spaces</strong> around the <code>=</code>: <code>name=value</code>. To read its value, prefix it with a <code>$</code>: <code>$name</code>. Simple, but it's the basis of every script.",
          syntax: "name=value      then      echo $name",
          options: [
            "Assigns 5 to x (no space around the =)",
            "Reads the value of x",
            "DOUBLE quotes: the variable is read",
            "SINGLE quotes: literal, no expansion",
          ],
          examples: [
            "# we remember",
            "# → web-01",
            "# → host: web-01",
          ],
          tip: "Classic pitfall: `x = 5` (with spaces) does NOT work. It's `x=5`, no spaces.",
        },
        desc: "Store the name <strong>web-01</strong> in a variable called <code>serveur</code>, then print it with <code>echo</code>.",
        hint: "serveur=web-01   then   echo $serveur",
        explanation: "You just created your first variable. Once defined, it lives for the whole session: you can read it as many times as you want with <code>$serveur</code>. It's the building block of automation.",
      },
      38: {
        name: "Step 2 — Capture an output",
        lesson: {
          title: "Command substitution <code>$(…)</code>",
          intro: "The real power: putting the <strong>result of a command</strong> into a variable or into some text. You wrap the command in <code>$(</code> and <code>)</code>. Bash runs what's inside first, then replaces it with its output.",
          syntax: "variable=$(command)     ·     echo \"... $(command) ...\"",
          options: [
            "Replaced by the file listing",
            "Replaced by the contents of f",
            "You can put a whole pipeline in it",
          ],
          examples: [
            "# n = number of .log files",
            "# → there are 3 logs",
            "# inject the date",
          ],
          tip: "Read `$( … )` from the inside out: first the inner command, then the replacement.",
        },
        desc: "Count the <strong>.log</strong> files and print exactly <code>total: N</code> (where N is the count), in a single command with <code>$(…)</code>.",
        hint: 'echo "total: $(ls *.log | wc -l)"',
        explanation: "You captured the output of a pipeline (<code>ls | wc -l</code>) directly into text. That's what lets scripts <em>react</em> to the system's real data instead of hardcoded values.",
      },
      39: {
        name: "Step 3 — A for loop",
        lesson: {
          title: "The <code>for</code> loop — repeat without repeating yourself",
          intro: "Do the same action on several items? That's <code>for</code>'s job. It iterates over a list (words, files via <code>*</code>, a sequence…) and runs the block between <code>do</code> and <code>done</code> for each. The loop variable takes each value in turn.",
          syntax: "for VAR in list; do  commands  ; done",
          options: [
            "Loop over all the .txt files",
            "The repeated block (the loop body)",
            "The current item, on each pass",
          ],
          examples: [
            "# print each .log",
            "# n1 n2 n3",
            "# count each file",
          ],
          tip: "On a single line, separate with `;`: `for … ; do … ; done`. On multiple lines, the prompt becomes `>` while waiting for `done`.",
        },
        desc: "For <strong>each .txt file</strong>, print its name. Use a <code>for</code> loop with the <code>*.txt</code> wildcard.",
        hint: "for f in *.txt; do echo $f; done",
        explanation: "One loop, three files handled automatically — and it would work the same with 3,000 files. That's exactly how you rename in bulk, back up folders, process logs. You'll never repeat yourself again.",
      },
      40: {
        name: "Step 4 — Loop + useful action",
        lesson: {
          title: "A loop that <em>works</em>",
          intro: "In a loop body, you can put any command — not just <code>echo</code>. That's where automation gets concrete: count the lines of each log, search a pattern in each file, back up each folder…",
          syntax: "for f in *.log; do  wc -l $f  ; done",
          options: [
            "Count the lines of the current file",
            "Search X in each file",
            "Back up each file",
          ],
          examples: [
            "# lines of each log",
            "# the port of each conf",
          ],
          tip: "The body can hold several commands, separated by `;`. Each pass runs them all.",
        },
        desc: "For <strong>each .log file</strong>, print its <strong>line count</strong> (<code>for</code> loop + <code>wc -l</code>).",
        hint: "for f in *.log; do wc -l $f; done",
        explanation: "Each log counted in one gesture. Replace <code>wc -l</code> with <code>grep ERROR</code> and you have a mini analysis tool; with <code>cp … backup/</code> and you have an automatic backup. The loop is the admin's Swiss army knife.",
      },
      41: {
        name: "Step 5 — A condition",
        lesson: {
          title: "The <code>if</code> / <code>test</code> conditions",
          intro: "A smart script makes decisions. <code>if</code> runs a block <strong>only if</strong> a condition is true. The condition is written with <code>test</code> or its short form <code>[ … ]</code> (mind the spaces around the brackets!).",
          syntax: "if [ condition ]; then  …  else  …  ; fi",
          options: [
            "True if the file exists",
            "True if the directory exists",
            "True if equal (text)",
            "True if n > 3 (-lt -eq -ge…)",
          ],
          examples: [
            "# if the file is there",
            "",
          ],
          tip: "Spaces are MANDATORY: `[ -f x ]` works, `[-f x]` doesn't. And it closes with `fi` (if backwards).",
        },
        desc: "Check whether the file <code>config.json</code> exists: <strong>if so, print <code>present</code></strong>. Use <code>if</code> with <code>[ -f … ]</code>.",
        hint: "if [ -f config.json ]; then echo present; fi",
        explanation: "Your script can now <em>react</em>: it only acts if the condition is met. Combine <code>if</code> with a loop and you get scripts that check, filter and decide — real automation, the kind that runs without you at 3 a.m.",
      },
      42: {
        name: "Step 6 — Run a real script",
        lesson: {
          title: "Run a complete <code>script</code>",
          intro: "A script is a series of commands stored in a <code>.sh</code> file. You run it with <code>bash file.sh</code> (or <code>./file.sh</code> if it's executable). All the power — variables, loops, conditions — gathered in a single reusable file. It's the culmination of scripting.",
          syntax: "bash script.sh      or      ./script.sh",
          options: [
            "Runs the script with bash",
            "Runs it directly (if chmod +x)",
            "Read it first to know what it does!",
          ],
          examples: [
            "# ALWAYS read a script before running it",
            "# then run it",
          ],
          tip: "Safety rule: NEVER run a script without reading it first (`cat`). A script can do anything to your machine.",
        },
        desc: "The <code>deploy.sh</code> script automates deployment (it contains a loop). Read it if you want, then <strong>run it</strong>.",
        hint: "cat deploy.sh   to read it, then   bash deploy.sh",
        explanation: "You just ran a real automation script: it looped over three services and \"deployed\" them on its own. Variables, loops, conditions, scripts — you now have the tools to turn any repetitive chore into a single command. Welcome to the real admins. 🤖",
      },
    },
  },

  // ══ Scénario 8 — Versionner avec Git ══
  8: {
    title: "🌱 Scenario 8 — Version with Git",
    scenario: "The project is growing, the team is expanding. Time to stop emailing files around and learn the tool every developer uses daily: Git. History, backups, branches — you'll never lose a line of code again.",
    missions: {
      43: {
        name: "Step 1 — Initialize a repository",
        lesson: {
          title: "<code>git init</code> — Create a Git repository",
          intro: "Git tracks a folder's history. Before you can record anything, you have to turn that folder into a <strong>Git repository</strong> (a \"repo\"). That creates a hidden <code>.git/</code> subfolder that will hold the whole history — but your files themselves don't move.",
          syntax: "git init",
          options: [
            "Initializes a repository in the current folder",
            "The hidden folder created (visible with ls -a)",
          ],
          examples: [
            "# → Initialized empty Git repository in .../.git/",
            "# the .git folder appears",
          ],
          tip: "You only run `git init` ONCE per project, at the very beginning. No need to redo it for each commit.",
        },
        desc: "Turn this folder into a Git repository with <code>git init</code>.",
        hint: "git init",
        explanation: "The folder is now a Git repository: Git can track every change from here on. Nothing is recorded yet — just the tracking that started. Next step: tell it WHAT to track.",
      },
      44: {
        name: "Step 2 — Stage (add)",
        lesson: {
          title: "<code>git add</code> — Add to the index (staging)",
          intro: "Git doesn't save everything automatically. You explicitly choose which files go into the next save with <code>git add</code> — that's the \"staging area\". <code>git status</code> constantly shows you what's ready and what isn't.",
          syntax: "git add file      ·      git add .",
          options: [
            "Stages ONE file",
            "Stages ALL the folder's files",
            "Shows what's staged / untracked",
          ],
          examples: [
            "# see the state before",
            "# stage app.py",
            "# app.py shows up in green",
          ],
          tip: "`git add .` is handy but dangerous on a real project: always re-read `git status` first, so you don't add a secret file by mistake.",
        },
        desc: "Check the repository state with <code>git status</code>, then stage <strong>all the files</strong> with <code>git add .</code>.",
        hint: "git init && git add .",
        explanation: "Your files are now \"staged\": ready to be recorded in history at the next commit. Nothing is final yet — you can still add or remove files before committing.",
      },
      45: {
        name: "Step 3 — Commit",
        lesson: {
          title: "<code>git commit</code> — Record a snapshot",
          intro: "A <strong>commit</strong> is a photo of your project at a moment in time, with a message explaining what changed. Every commit stays forever in the history: you can always go back. The message (<code>-m</code>) must be clear — it's what the whole team will read.",
          syntax: 'git commit -m "clear message"',
          options: [
            "The commit message (required here)",
            "To review the history afterward",
          ],
          examples: [
            "# records what's staged",
            "# check that the commit exists",
          ],
          tip: "A good commit message describes the WHY, not just the what: `\"fix login bug\"` beats `\"fix\"`.",
        },
        desc: "Commit the staged files with a message that is exactly <code>initial commit</code>.",
        hint: 'git init && git add . && git commit -m "initial commit"',
        explanation: "First commit done! It's no longer just a copy of files: it's a point in your project's history, dated, signed, and recoverable forever. It's the building block of all teamwork.",
      },
      46: {
        name: "Step 4 — Consult the history",
        lesson: {
          title: "<code>git log</code> — The commit history",
          intro: "After several commits, how do you know what was done, when, and why? <code>git log</code> shows the full history: unique identifier (hash), author, and message of each commit, from newest to oldest.",
          syntax: "git log",
          options: [
            "Unique identifier of the save",
            "What you typed after -m",
          ],
          examples: [
            "# lists all commits, newest to oldest",
          ],
          tip: "The hash (e.g. `71c89e0`) uniquely identifies a commit — that's what you'd use to go back to it later.",
        },
        desc: "Make two successive commits (any messages), then consult the history with <code>git log</code>.",
        hint: 'git init && git add app.py && git commit -m "app" && git add readme.md && git commit -m "readme" && git log',
        explanation: "You can now read the project's full story. On a real repo with hundreds of commits, `git log` (with options like `--oneline`) is the number-one tool to understand \"who did what, and when\".",
      },
      47: {
        name: "Step 5 — Work on a branch",
        lesson: {
          title: "<code>branches</code> — work without breaking main",
          intro: "A branch is a parallel line of development. The <code>main</code> branch stays stable while you experiment elsewhere, risk-free. <code>git checkout -b name</code> creates a new branch AND switches to it in a single command.",
          syntax: "git branch name          ·          git checkout -b name",
          options: [
            "Lists the branches (* = the active one)",
            "Creates a branch WITHOUT switching to it",
            "Switches to an existing branch",
            "Creates AND switches in a single command",
          ],
          examples: [
            "# new working branch",
            "# feature-login is marked *",
          ],
          tip: "Classic team convention: `main` always stays stable and deployable; all new work happens on a dedicated branch.",
        },
        desc: "Create a new branch called <code>feature-login</code> and switch to it directly, in a single command.",
        hint: "git init && git checkout -b feature-login",
        explanation: "You're now on your own branch: any commit you make here won't affect <code>main</code> until you merge it in. That's what lets several people work in parallel without stepping on each other.",
      },
      48: {
        name: "Step 6 — The complete workflow",
        lesson: {
          title: "The basic <code>Git workflow</code>, end to end",
          intro: "In real life, you always chain the same steps: initialize (once), edit files, <code>add</code> to pick what's ready, <code>commit</code> to record, and <code>status</code> at any time to check where you stand. It's this cycle you'll repeat thousands of times in your career.",
          syntax: "git init → git add → git commit -m \"...\" → git status",
          options: [
            "Your best friend: type it whenever in doubt",
          ],
          examples: [
            "# only once",
            "# prepare",
            "# commit",
            "# check that everything is clean",
          ],
          tip: "If `git status` says \"nothing to commit, working tree clean\", all your work is safe in the history.",
        },
        desc: "Initialize the repository, add <strong>all</strong> the files, commit with the message <code>mission finale</code>, then finish with a <code>git status</code> that must be clean.",
        hint: 'git init && git add . && git commit -m "mission finale" && git status',
        explanation: "You now master the basic Git cycle — the one millions of developers use every day, from the smallest startup to the biggest open-source projects. The natural next step once on the job: <code>git push</code> to a remote repo like GitHub, to share your work with a team. 🌱",
      },
    },
  },

  // ══ Scénario 9 — Réseau & administration distante ══
  9: {
    title: "🌐 Scenario 9 — Network & remote administration",
    scenario: "The project now runs on real servers, not just locally. Time to learn to connect remotely, transfer files securely, and diagnose a server you've never physically set foot near.",
    missions: {
      49: {
        name: "Step 1 — Connect over SSH",
        lesson: {
          title: "<code>ssh</code> — Connect to a remote machine",
          intro: "SSH (Secure Shell) is THE protocol to administer a server remotely, encrypted. Once connected, your terminal no longer controls your machine: it controls the remote server. The prompt changes to remind you of that at all times.",
          syntax: "ssh user@host",
          options: [
            "Connects as admin to 'serveur'",
            "Disconnect and return to local",
          ],
          examples: [
            "# connection to the web server",
          ],
          tip: "Look closely at the prompt after connecting: `admin@webserver01` instead of `user@dojo` — it's your only visual clue that you're now ELSEWHERE.",
        },
        desc: "Connect over SSH to the <code>webserver01</code> server with the user <code>admin</code>.",
        hint: "ssh admin@webserver01",
        explanation: "There you are, connected remotely. On a real server, absolutely everything you type now runs OVER THERE, not on your machine — it's powerful, and it can hurt if you're not careful.",
      },
      50: {
        name: "Step 2 — Inspect the active services",
        lesson: {
          title: "<code>netstat</code> — See what's listening on the network",
          intro: "Once on a server, one of the first questions to ask: which services are running, and on which ports? <code>netstat</code> (or its modern equivalent <code>ss</code>) answers that — essential to diagnose or secure a machine.",
          syntax: "netstat",
          options: [
            "The service is actively waiting for connections on this port",
            "SSH port, open for remote administration",
            "Web ports (HTTP / HTTPS)",
          ],
          examples: [
            "# connect first",
            "# list the listening services",
          ],
          tip: "A service listening on a port you don't recognize is often the first sign of a compromised server. Make it a reflex.",
        },
        desc: "Connect to <code>webserver01</code>, then list the listening services with <code>netstat</code>.",
        hint: "ssh admin@webserver01 && netstat",
        explanation: "You can now read a server's network activity at a glance: sshd on 22, nginx on 80/443, mysqld on 3306... each line tells you which service is running and where.",
      },
      51: {
        name: "Step 3 — Transfer a file (scp)",
        lesson: {
          title: "<code>scp</code> — Copy a file to a remote server",
          intro: "How do you drop a file onto a server with no GUI or FTP? <code>scp</code> (secure copy) copies a file using the same encryption as SSH, in a single command, without ever needing to connect first.",
          syntax: "scp file user@host:/destination/path",
          options: [
            "The local file to send",
            "Where to send it on the remote machine",
          ],
          examples: [
            "# send a script to the server",
          ],
          tip: "`scp` is typed from YOUR machine, before connecting — no need to open an SSH session to transfer a file.",
        },
        desc: "Send the <code>deploy.sh</code> file to <code>/var/www</code> on the <code>webserver01</code> server, user <code>admin</code>.",
        hint: "scp deploy.sh admin@webserver01:/var/www",
        explanation: "File sent, encrypted end to end. This reflex (send first, connect afterward to verify) is exactly the workflow sysadmins use daily to deploy without a GUI.",
      },
      52: {
        name: "Step 4 — Disconnect cleanly",
        lesson: {
          title: "<code>exit</code> in SSH — Return to your machine",
          intro: "Staying connected to a server you no longer use is bad practice (security risk, a forgotten open session). <code>exit</code> closes the SSH connection and brings you back to your local machine — the prompt becomes the dojo's again.",
          syntax: "exit",
          examples: [
            "# connection",
            "# clean disconnection",
          ],
          tip: "Always check your prompt before typing a destructive command: if you're still connected to a server, it's NOT your machine you're about to modify.",
        },
        desc: "Connect to <code>webserver01</code> as <code>admin</code>, then disconnect cleanly.",
        hint: "ssh admin@webserver01 && exit",
        explanation: "Back home, clean and tidy. This simple reflex avoids many ghost sessions left open on production servers — a real security risk if someone else sits down at your keyboard.",
      },
      53: {
        name: "Step 5 — Check before connecting",
        lesson: {
          title: "Diagnose before acting: <code>ping</code> + <code>ssh</code>",
          intro: "Before wasting time trying to connect to a server, a good admin reflex: check that it responds on the network. <code>ping</code> confirms the machine is reachable before you even attempt an SSH connection.",
          syntax: "ping host   then   ssh user@host",
          options: [
            "Checks that the machine responds on the network",
            "Good sign: the machine is indeed reachable",
          ],
          examples: [
            "# check first",
            "# connect afterward",
          ],
          tip: "On a real corporate network, a ping that doesn't respond can mean: machine off, firewall blocking, or wrong address — it saves you from hunting a bug elsewhere for nothing.",
        },
        desc: "Check that <code>dbserver02</code> responds with <code>ping</code>, then connect to it as user <code>root</code>.",
        hint: "ping dbserver02 && ssh root@dbserver02",
        explanation: "Diagnose before acting: this simple reflex (checking a server is reachable before hammering at it) saves huge amounts of time in a real incident, where every minute counts.",
      },
      54: {
        name: "Step 6 — The complete deployment workflow",
        lesson: {
          title: "The complete <code>network workflow</code>, end to end",
          intro: "In real situations, you chain: send the needed file (<code>scp</code>), connect to check everything is in order (<code>ssh</code> then <code>netstat</code>), then leave cleanly (<code>exit</code>). It's exactly the cycle a sysadmin uses for a manual deployment.",
          syntax: "scp → ssh → netstat → exit",
          examples: [
            "# 1. send the file",
            "# 2. connect to check",
            "# 3. check the active services",
            "# 4. leave cleanly",
          ],
          tip: "This scp → ssh → check → exit cycle is THE basic workflow of remote system administration. You just did it end to end.",
        },
        desc: "Send <code>backup.sql</code> to <code>/backups</code> on <code>dbserver02</code> (user <code>root</code>), connect to check the active services, then disconnect.",
        hint: "scp backup.sql root@dbserver02:/backups && ssh root@dbserver02 && netstat && exit",
        explanation: "You just ran a real remote-administration cycle, from file transfer to clean disconnection. Add the Git mastery from the previous scenario, and you have the exact basics of a sysadmin's or backend developer's daily life. 🌐",
      },
    },
  },

  // ══ Scénario 10 — Conteneuriser avec Docker ══
  10: {
    title: "🐳 Scenario 10 — Containerize with Docker",
    scenario: "Your app runs locally, but \"works on my machine\" isn't enough for production. Enter Docker: package the app with everything it needs, in a container that runs the same everywhere.",
    missions: {
      55: {
        name: "Step 1 — Build an image",
        lesson: {
          title: "<code>docker build</code> — Build an image",
          intro: "A <code>Dockerfile</code> describes how to build an <strong>image</strong>: the base system, the code copied into it, the command to run at startup. <code>docker build</code> reads this Dockerfile and produces the image, like a recipe turned into a ready-to-serve dish.",
          syntax: "docker build -t name .",
          options: [
            "Tags (names) the built image",
            "Build context: the current folder, where the Dockerfile is",
          ],
          examples: [
            "# builds and tags the “monapp” image",
            "# with an explicit version",
          ],
          tip: "The trailing dot (`.`) isn't decorative: it's the build CONTEXT, the folder Docker sends to the daemon. Forget it and the command fails.",
        },
        desc: "The folder contains a <code>Dockerfile</code> and the app's code. Build an image named <code>monapp</code>.",
        hint: "docker build -t monapp .",
        explanation: "Your image is built: a frozen snapshot of the app and its whole environment (system, dependencies, code). From now on, you can run it anywhere — your machine, a server, the cloud — the result will be identical.",
      },
      56: {
        name: "Step 2 — List the images",
        lesson: {
          title: "<code>docker images</code> — See the local images",
          intro: "Once built (or downloaded), images stay stored locally. <code>docker images</code> lists them, with their name, tag (version) and unique identifier — a bit like <code>ls</code>, but for Docker images.",
          syntax: "docker images",
          examples: [
            "# lists all the local images",
          ],
          tip: "An unused image still takes up disk space. In real use, `docker image prune` cleans up orphaned images.",
        },
        desc: "Build the <code>monapp</code> image, then check that it shows up in the list of local images.",
        hint: "docker build -t monapp . && docker images",
        explanation: "The image is right there, ready to run. Unlike a simple script, a Docker image carries EVERYTHING needed to run — no more \"I'm missing a dependency\" on the prod server.",
      },
      57: {
        name: "Step 3 — Start a container",
        lesson: {
          title: "<code>docker run</code> — Start a container",
          intro: "An image is the frozen recipe. A <strong>container</strong> is the dish served: a running instance of that image. <code>docker run</code> starts a container from an image.",
          syntax: "docker run [-d] [--name name] image",
          options: [
            "Detached mode: the container runs in the background",
            "Gives the container a readable name (otherwise a random one)",
          ],
          examples: [
            "# starts “monapp” in the background, named “web”",
          ],
          tip: "Without -d, the container runs in the foreground and blocks your terminal — useful for debugging, but -d is the reflex in normal use.",
        },
        desc: "Build the <code>monapp</code> image, then start a background container named <code>web</code> from that image.",
        hint: "docker build -t monapp . && docker run -d --name web monapp",
        explanation: "The “web” container is now running, isolated from the rest of the system, with exactly the environment defined in the Dockerfile. You can launch several identical ones side by side — that's the basis of horizontal scaling.",
      },
      58: {
        name: "Step 4 — List the active containers",
        lesson: {
          title: "<code>docker ps</code> — See the running containers",
          intro: "Just as <code>ps</code> lists the system's processes, <code>docker ps</code> lists the running <strong>containers</strong>: their identifier, the image used, their status, their name.",
          syntax: "docker ps [-a]",
          options: [
            "ALSO shows stopped containers (by default, only the running ones are listed)",
          ],
          examples: [
            "# running containers only",
            "# all containers, running or stopped",
          ],
          tip: "If your container doesn't show up in `docker ps`, two possibilities: it never started, or it crashed right after startup. `docker ps -a` and `docker logs` help you tell them apart.",
        },
        desc: "Start the <code>web</code> container from the <code>monapp</code> image, then check it's running with the list of active containers.",
        hint: "docker build -t monapp . && docker run -d --name web monapp && docker ps",
        explanation: "“web” shows up as active (Up). It's the first reflex after a deployment: is the container really running, or did it crash silently?",
      },
      59: {
        name: "Step 5 — Consult the logs",
        lesson: {
          title: "<code>docker logs</code> — See a container's output",
          intro: "A container runs in the background, but everything it prints (like <code>console.log</code> in a Node app) goes somewhere. <code>docker logs</code> retrieves that output — essential to debug without connecting INTO the container.",
          syntax: "docker logs name",
          examples: [
            "# shows everything the “web” container produced",
          ],
          tip: "In real use, `docker logs -f name` follows the logs live, exactly like `tail -f` on a file.",
        },
        desc: "Start the <code>web</code> container, then consult its logs to check it started correctly.",
        hint: "docker build -t monapp . && docker run -d --name web monapp && docker logs web",
        explanation: "The logs confirm the server started on port 3000. Without this command, a container running in the background would be a total black box.",
      },
      60: {
        name: "Step 6 — Stop cleanly",
        lesson: {
          title: "<code>docker stop</code> — Stop a container",
          intro: "A running container consumes resources. <code>docker stop</code> stops it cleanly (it sends a \"polite\" stop signal, giving the app time to shut down properly, before cutting it off if it doesn't respond).",
          syntax: "docker stop name",
          examples: [
            "# stops the “web” container",
          ],
          tip: "A stopped container isn't deleted: it stays visible with `docker ps -a`. To remove it permanently, `docker rm name` (only if it's already stopped).",
        },
        desc: "Run the full cycle: build the image, start the <code>web</code> container, then stop it cleanly.",
        hint: "docker build -t monapp . && docker run -d --name web monapp && docker stop web",
        explanation: "Build → run → ps → logs → stop: you just ran a container's complete lifecycle, the one every backend developer repeats dozens of times a day. With Git from the previous scenario, you now have the two tools that structure modern development. 🐳",
      },
    },
  },

  // ══ Scénario 11 — Le site est tombé (services & logs) ══
  11: {
    title: "🚨 Scenario 11 — The website is down (services & logs)",
    scenario: "Monday morning, 8:12 AM: the company website stopped responding. On a real Linux server, applications run as services managed by systemd. Your move: diagnose, read the logs, find the culprit and bring the service back up.",
    missions: {
      61: {
        name: "Step 1 — Assess the situation",
        lesson: {
          title: "<code>systemctl status</code> — A service's state",
          intro: "On a modern Linux server, the programs that run continuously (web server, SSH, database…) are <strong>services</strong> managed by <code>systemd</code>. <code>systemctl status</code> is THE first reflex when something stops responding: it says whether the service is up (<code>active (running)</code>), stopped (<code>inactive</code>) or crashed (<code>failed</code>).",
          syntax: "systemctl status service",
          options: [
            "The service is running normally",
            "The service is stopped (on purpose, or never started)",
            "The service CRASHED — it tried to start and couldn't",
          ],
          examples: [
            "# state of the nginx web server",
            "# overview of every service",
          ],
          tip: "\"The website stopped responding\" doesn't say WHY. The \"Active:\" line of systemctl status does: cleanly stopped (inactive) and crashed (failed) are two very different investigations.",
        },
        desc: "The website (served by <code>nginx</code>) stopped responding. Start the investigation: check the state of the <code>nginx</code> service.",
        hint: "systemctl status nginx",
        explanation: "Verdict: \"Active: failed\" — nginx tried to start and crashed (status=1/FAILURE). This is not a voluntary stop, it's a crash. The next logical step: read the service's logs to understand WHY it refused to start.",
      },
      62: {
        name: "Step 2 — Read the service's logs",
        lesson: {
          title: "<code>journalctl</code> — The systemd journal",
          intro: "systemd centralizes the logs of ALL services into a single journal. <code>journalctl</code> reads it, and the <code>-u</code> (unit) option filters on a single service — without it, you drown in the whole machine's logs.",
          syntax: "journalctl -u service [-n N]",
          options: [
            "Only shows THIS service's logs",
            "Only the last 20 lines",
          ],
          examples: [
            "# all the logs of the nginx service",
            "# the last 10 lines",
          ],
          tip: "In real use, `journalctl -u nginx -f` follows the logs live (like `tail -f`), and `--since \"10 min ago\"` limits to the last minutes. The -u reflex, though, is universal.",
        },
        desc: "The status says <code>nginx</code> crashed at startup, but not why. Check the service's logs to find the exact cause.",
        hint: "journalctl -u nginx",
        explanation: "The cause is written in plain sight: \"bind() to 0.0.0.0:80 failed (98: Address already in use)\". nginx couldn't attach to port 80… because someone else already occupies it. A port can only be listened to by ONE service at a time — now to find the squatter.",
      },
      63: {
        name: "Step 3 — Find and stop the squatter",
        lesson: {
          title: "<code>systemctl stop</code> — Stop a service",
          intro: "The logs point the finger: port 80 is already taken. <code>systemctl list-units --type=service</code> lists the active services — and among them, <code>apache2</code>, ANOTHER web server, left running after the weekend maintenance. Two web servers, one port 80: there's the conflict. <code>systemctl stop</code> stops a service cleanly.",
          syntax: "systemctl stop service",
          options: [
            "Stops the service now (it will start again at next boot if it's enabled)",
          ],
          examples: [
            "# who's running right now?",
            "# stop the competing web server",
          ],
          tip: "systemctl stop succeeds silently — no message, and that's normal! On Linux, no news is good news. Check with systemctl status if you want confirmation.",
        },
        desc: "List the services to identify the competing web server left running, then stop it: it's the one occupying <code>nginx</code>'s port 80.",
        hint: "systemctl stop apache2",
        explanation: "apache2 is stopped, port 80 is freed. This scenario is a classic: a maintenance installs or wakes up a second web server, and at the next reboot, both fight for the same port. First come, first served — the other one crashes.",
      },
      64: {
        name: "Step 4 — Start the service again",
        lesson: {
          title: "<code>systemctl start</code> — Start a service",
          intro: "Port 80 is free, nginx can now start. <code>systemctl start</code> launches a service right away. Mind the nuance with <code>restart</code>: <code>start</code> starts a stopped service, <code>restart</code> stops THEN restarts a running one (useful after a configuration change).",
          syntax: "systemctl start service",
          options: [
            "Starts a stopped service",
            "Stops then restarts (reloads the config along the way)",
          ],
          examples: [
            "# starts the web server",
            "# after changing its configuration",
          ],
          tip: "If the service crashes again immediately on start, back to square journalctl -u: the cause of the crash is always written there. Diagnosing BEFORE restarting in a loop is what separates an admin from a button-masher.",
        },
        desc: "The squatter is neutralized (stop <code>apache2</code> if you haven't already), port 80 is free: start <code>nginx</code>.",
        hint: "systemctl stop apache2 && systemctl start nginx",
        explanation: "nginx started — silently, therefore without error. Note that if you had tried to start it BEFORE stopping apache2, it would have crashed again with the same port error: the order of operations matters, and the diagnosis is what gave it to you.",
      },
      65: {
        name: "Step 5 — Check the site is back",
        lesson: {
          title: "Verify after fixing — the reflex that saves you",
          intro: "An incident isn't over when you've typed the repair command: it's over when you've VERIFIED everything is back. Re-check the status (it must say <code>active (running)</code>) and glance at the recent logs to confirm a clean start.",
          syntax: "systemctl status service",
          options: [
            "What you want to see after the repair",
            "The service's main process — proof that it's running",
          ],
          examples: [
            "# the status must be “active (running)”",
            "# the last 5 lines: clean startup?",
          ],
          tip: "On a real incident, verification goes all the way: a curl on the site to see the page respond. Checking the service is good; checking the SERVICE DELIVERED is better.",
        },
        desc: "Run the full repair path again (stop <code>apache2</code>, start <code>nginx</code>), then check <code>nginx</code>'s status: it must be <code>active (running)</code>.",
        hint: "systemctl stop apache2 && systemctl start nginx && systemctl status nginx",
        explanation: "\"Active: active (running)\" — the website is back online. Diagnosis → cause → fix → verification: you just ran the exact loop of a real incident response, the one on-call engineers repeat every week.",
      },
      66: {
        name: "Step 6 — Make sure it never happens again",
        lesson: {
          title: "<code>systemctl enable</code> — Surviving the reboot",
          intro: "Last trap: <code>start</code> only counts for NOW. At the server's next reboot, systemd only relaunches <strong>enabled</strong> services. If nginx stayed <code>disabled</code>, the site will go down again at the first update — and apache2 will come back squatting the port if it stayed enabled. <code>enable</code> and <code>disable</code> set the behavior at boot.",
          syntax: "systemctl enable|disable service",
          options: [
            "The service will start automatically at every boot",
            "The service will no longer start automatically (but can still be started with start)",
          ],
          examples: [
            "# nginx will survive reboots",
            "# apache2 won't come back squatting port 80",
          ],
          tip: "start/stop = right now; enable/disable = at boot. The two are independent: a service can be active but disabled (it will drop at reboot), or inactive but enabled (it will come back). Mixing them up is THE classic cause of \"it was working again, why did it go down?\"",
        },
        desc: "Close the incident properly: enable <code>nginx</code>'s automatic start at boot, and disable <code>apache2</code>'s so it never comes back squatting port 80.",
        hint: "systemctl enable nginx && systemctl disable apache2",
        explanation: "Incident closed, AND the root cause is handled: nginx will come back on its own at every boot, apache2 will no longer fight for port 80. status → journalctl → stop/start → enable: you now hold the full systemd toolkit, the one that runs almost every Linux server in production. 🚨",
      },
    },
  },

  // ══ Scénario 12 — Une nouvelle recrue (utilisateurs & groupes) ══
  12: {
    title: "👥 Scenario 12 — A new recruit (users & groups)",
    scenario: "Sarah joins the admin team on Monday. Your job: prepare her arrival — understand how Linux stores accounts, create hers, give her a password and the right permissions, without breaking anyone else's.",
    missions: {
      67: {
        name: "Step 1 — The map of accounts",
        lesson: {
          title: "<code>/etc/passwd</code> — The account registry",
          intro: "On Linux, the list of accounts is a plain text file: <code>/etc/passwd</code>. One line per account, 7 fields separated by <code>:</code> — name, password (an <code>x</code>: the real hash lives elsewhere, in <code>/etc/shadow</code>), UID, GID, description, home directory, shell.",
          syntax: "name:x:UID:GID:description:/home/name:/bin/bash",
          options: [
            "The account's numeric identifier — 0 = root, ≥1000 = humans",
            "The password is NOT here: it's hashed in /etc/shadow, unreadable without root",
            "The shell launched at login (nologin = service account, login forbidden)",
          ],
          examples: [
            "# every account on the machine",
            "# the line of one specific account",
          ],
          tip: "Accounts with /usr/sbin/nologin (www-data, daemon…) aren't humans: they're service accounts, running programs with no right to log in. A server is full of them, that's normal.",
        },
        desc: "Before creating Sarah's account, look at how the existing ones are made: display <code>/etc/passwd</code>.",
        hint: "cat /etc/passwd",
        explanation: "Four accounts: root (UID 0, the superuser), two locked service accounts (daemon, www-data — their shell is nologin), and you (user, UID 1000). Sarah will get the next free UID. This file is the reference: every account-management tool merely edits it cleanly.",
      },
      68: {
        name: "Step 2 — Create the account",
        lesson: {
          title: "<code>useradd</code> — Create a user",
          intro: "<code>useradd</code> creates an account: it adds the line in <code>/etc/passwd</code>, assigns a UID, and — ONLY if you pass <code>-m</code> — creates the <code>/home/name</code> home directory. Without <code>-m</code>, the account exists but has nowhere to put its files: the classic beginner trap.",
          syntax: "useradd -m name",
          options: [
            "Creates the /home/name home directory (NEVER forget it for a human)",
          ],
          examples: [
            "# creates the account AND its /home/sarah",
            "# check the new line",
          ],
          tip: "useradd succeeds silently (no message = no error). Check your work with grep sarah /etc/passwd or ls /home — trust doesn't exclude control.",
        },
        desc: "Create Sarah's account — username <code>sarah</code> — with her home directory.",
        hint: "useradd -m sarah",
        explanation: "The account exists: a new line in /etc/passwd (UID 1001, look with grep sarah /etc/passwd) and a brand-new /home/sarah thanks to -m. But Sarah can't log in yet: her account has no password.",
      },
      69: {
        name: "Step 3 — A real password",
        lesson: {
          title: "<code>passwd</code> — Set the password",
          intro: "An account freshly created by <code>useradd</code> is <strong>locked</strong>: no password, so no login possible. <code>passwd name</code> sets it (typing is hidden: nothing shows up as you type, that's normal — not even stars on a real system).",
          syntax: "passwd [name]",
          options: [
            "Without argument: changes YOUR password",
            "Changes sarah's (reserved to root/sudo in real life)",
          ],
          examples: [
            "# sets the sarah account's password",
          ],
          tip: "The password hash lands in /etc/shadow, readable only by root — that's why /etc/passwd only shows an “x”. Splitting the two files fixed a real historical Unix flaw.",
        },
        desc: "Sarah's account exists (recreate it if needed) but it's locked. Set her password.",
        hint: "useradd -m sarah && passwd sarah",
        explanation: "“password updated successfully” — Sarah can now log in. All she's missing is permissions: by default, a new account can administer nothing at all, and that's exactly right (principle of least privilege).",
      },
      70: {
        name: "Step 4 — The keys to sudo",
        lesson: {
          title: "<code>usermod -aG</code> — Add to a group",
          intro: "Permissions on Linux go through <strong>groups</strong>: belonging to the <code>sudo</code> group lets you run commands as an administrator. <code>usermod -aG group name</code> adds a user to a group. The <code>-a</code> (append) is VITAL: <code>-G</code> alone REPLACES the group list instead of adding — the user loses all their other groups at once.",
          syntax: "usermod -aG group name",
          options: [
            "ADDS to the group (existing groups are kept)",
            "⚠️ REPLACES all secondary groups with this one — almost never what you want",
          ],
          examples: [
            "# sarah joins the sudo group",
            "# check her groups",
          ],
          tip: "-G without -a is a famous trap: admins have lost their own sudo access while trying to add themselves to a docker group. Reflex to engrave: usermod is ALWAYS -aG.",
        },
        desc: "Sarah joins the admin team: add her to the <code>sudo</code> group (recreate her account first if needed — and don't forget the <code>-a</code>).",
        hint: "useradd -m sarah && usermod -aG sudo sarah",
        explanation: "Sarah is in the sudo group — she can now administer the machine. Thanks to -a, her primary group “sarah” is intact. Remember the logic: you don't grant rights to a person, you add them to a group that holds them.",
      },
      71: {
        name: "Step 5 — Verify the access",
        lesson: {
          title: "<code>groups</code> & <code>id</code> — Audit an account",
          intro: "Never take a change at its word: <code>groups name</code> lists a user's groups, and <code>id name</code> gives the detailed version (UID, GID, groups with their numbers). It's also your audit toolbox: “why doesn't this colleague have access?” always starts with an <code>id</code>.",
          syntax: "groups [name]  ·  id [name]",
          options: [
            "Simple list of groups (yours without an argument)",
            "UID + GID + groups with numeric identifiers",
          ],
          examples: [
            "# sarah : sarah sudo",
            "# uid=1001(sarah) gid=1001(sarah) groups=…",
          ],
          tip: "On a real system, a user added to a group must log out and back in for new sessions to inherit it — when “it doesn't work”, it's often just that.",
        },
        desc: "Redo the full account setup (creation + sudo group), then check with <code>groups</code> that Sarah is indeed in <code>sudo</code>.",
        hint: "useradd -m sarah && usermod -aG sudo sarah && groups sarah",
        explanation: "“sarah : sarah sudo” — the permissions are in place and VERIFIED. Like in the previous scenario: an unverified change doesn't exist. Last step: step into Sarah's shoes to test her account from the inside.",
      },
      72: {
        name: "Step 6 — In Sarah's shoes",
        lesson: {
          title: "<code>su</code> — Switch identity",
          intro: "<code>su name</code> (switch user) opens a session as another user, inside your terminal: the prompt changes, and <code>whoami</code> confirms it. It's THE way to test a freshly created account — if you can't use it, the user won't either. <code>exit</code> gives you your identity back.",
          syntax: "su name  ·  exit",
          options: [
            "Becomes that user (password required — the account must have one!)",
            "Leaves the session and becomes the previous user again",
          ],
          examples: [
            "# become sarah (her password is required)",
            "# → sarah: the proof",
          ],
          tip: "su on an account WITHOUT a password fails (Authentication failure) — that's why su root fails on Ubuntu: the root account is deliberately locked there, you go through sudo instead.",
        },
        desc: "Final test: recreate the full account (with a password!), become <code>sarah</code> with <code>su</code>, and prove it with <code>whoami</code>.",
        hint: "useradd -m sarah && passwd sarah && su sarah && whoami",
        explanation: "The prompt shows sarah@dojo and whoami answers “sarah”: the account works end to end. Creation, password, groups, verification, real test — you just ran a user's complete onboarding, the move every admin repeats at each team arrival. Type exit to become yourself again. 👥",
      },
    },
  },

};

if (typeof overlayLevels === "function") overlayLevels(LEVELS_EN);
