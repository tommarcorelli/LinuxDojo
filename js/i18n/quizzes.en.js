// i18n/quizzes.en.js — Traductions anglaises des quiz de quizzes.js.
//
// Chargé juste APRÈS js/quizzes.js. Indexé par id de chapitre, tableau
// parallèle aux questions : chaque entrée fournit { q, options }. L'indice de
// la bonne réponse (answer) vient de quizzes.js et ne change pas (indépendant
// de la langue). overlayQuizzes() (js/i18n.js) applique cet overlay sur
// QUIZZES uniquement si LANG === "en".

const QUIZZES_EN = {
  1: [
    { q: "Which command ALSO shows hidden files?", options: ["ls", "ls -a", "cat -h", "cd -a"] },
    { q: "How do you know which directory you're in?", options: ["cd", "pwd", "whoami", "ls -l"] },
    { q: "To read a very long file page by page?", options: ["cat", "echo", "less", "touch"] },
  ],
  2: [
    { q: "Which command creates a directory?", options: ["touch", "mkdir", "cp", "cd"] },
    { q: "Which command renames OR moves a file?", options: ["cp", "mv", "rm", "ln"] },
    { q: "What does the « > » redirection do?", options: ["Appends to the end", "Overwrites the file", "Deletes the file", "Lists the directory"] },
  ],
  3: [
    { q: "Which command counts the number of lines?", options: ["sort", "wc -l", "ls", "grep -n"] },
    { q: "What is the pipe « | » for?", options: ["Delete a file", "Connect one command's output to another's input", "Create a directory", "Sort"] },
    { q: "What does grep's -i option do?", options: ["Inverts the result", "Ignores case (upper/lower)", "Counts the lines", "Shows line numbers"] },
  ],
  4: [
    { q: "How do you make a script executable?", options: ["chmod +x script.sh", "chmod 644 script.sh", "rm script.sh", "ls -l script.sh"] },
    { q: "Which command lists the running processes?", options: ["ls", "ps aux", "df -h", "grep"] },
    { q: "$HOME is…", options: ["a command", "a hidden file", "an environment variable", "a temporary directory"] },
  ],
  5: [
    { q: "How do you create a compressed archive?", options: ["tar -xzf a.tar.gz", "tar -czf a.tar.gz folder/", "curl a.tar.gz", "sed a.tar.gz"] },
    { q: "Which command replaces text in a stream?", options: ["sed", "wc", "cat", "ls"] },
    { q: "How do you extract the 1st column of a CSV?", options: ["grep ',' data.csv", "sort data.csv", "awk -F',' '{print $1}' data.csv", "wc -l data.csv"] },
  ],
  6: [
    { q: "To see the MOST RECENT events in a log?", options: ["head auth.log", "tail auth.log", "cat auth.log", "sort auth.log"] },
    { q: "Count the FAILED lines of a file?", options: ["wc FAILED f.log", "grep -c FAILED f.log", "count FAILED f.log", "grep -v FAILED f.log"] },
    { q: "chmod 600 rapport.txt — what does it give?", options: ["Readable by everyone", "Executable by all", "Read/write for the owner only", "File deleted"] },
  ],
  7: [
    { q: "How do you correctly define a variable?", options: ["x = 5", "x=5", "$x=5", "set x 5"] },
    { q: "What does $(ls | wc -l) do?", options: ["Shows an error", "Creates a file", "Replaces with the number of files", "Nothing"] },
    { q: "A for loop closes with…", options: ["end", "fi", "done", "stop"] },
    { q: "Which condition tests whether file f exists?", options: ["[ -d f ]", "[ -f f ]", "[ -x f ]", "[ f exists ]"] },
  ],
  8: [
    { q: "Which command turns a folder into a Git repository?", options: ["git start", "git init", "git new", "git create"] },
    { q: "How do you stage ALL files before a commit?", options: ["git commit .", "git save .", "git add .", "git stage all"] },
    { q: "What is « -m » for in git commit -m \"...\"?", options: ["Silent mode", "The commit message", "Automatic merge", "Number of files"] },
    { q: "Which command creates a branch AND switches to it at once?", options: ["git branch -b name", "git switch name", "git checkout -b name", "git new name"] },
  ],
  9: [
    { q: "Which command lets you connect remotely to a server?", options: ["remote", "ssh user@host", "connect host", "remote host"] },
    { q: "How do you return to your local machine after an SSH connection?", options: ["quit", "back", "exit", "stop"] },
    { q: "Which command sends a file to a remote server?", options: ["send", "scp file user@host:/path", "push file", "upload file"] },
    { q: "What does « LISTEN » mean in netstat's output?", options: ["The service crashed", "The service is waiting for connections on this port", "The port is closed", "The service is paused"] },
  ],
  10: [
    { q: "What does « docker build -t monapp . » do?", options: ["Starts a container", "Builds an image named « monapp »", "Deletes the « monapp » image", "Lists the active containers"] },
    { q: "Which « docker run » option starts the container in the background?", options: ["-a", "-d", "-r", "-b"] },
    { q: "Which command shows only the RUNNING containers?", options: ["docker ps -a", "docker images", "docker ps", "docker logs"] },
    { q: "How do you view the output (console.log, etc.) of a background container?", options: ["docker ps", "docker logs name", "docker build name", "docker images name"] },
  ],
  11: [
    { q: "A service shows « Active: failed ». What does that mean?", options: ["It was stopped on purpose", "It tried to start and crashed", "It's running normally", "It doesn't exist"] },
    { q: "How do you see the logs of ONLY the nginx service?", options: ["journalctl", "journalctl -u nginx", "systemctl logs nginx", "cat nginx.log"] },
    { q: "What does the « Address already in use » error mean when a web server starts?", options: ["The disk is full", "Another service already occupies the same port", "The config file is missing", "The service isn't installed"] },
    { q: "What's the difference between « start » and « enable »?", options: ["None, they're synonyms", "start = at next boot, enable = right now", "start = right now, enable = automatically at every boot", "enable is reserved for root"] },
  ],
  12: [
    { q: "What does /etc/passwd actually contain?", options: ["Plain-text passwords", "The list of accounts (the hashes live in /etc/shadow)", "Only the root account", "The login history"] },
    { q: "What is the -m for in « useradd -m sarah »?", options: ["Silent mode", "Also create the /home/sarah home directory", "Grant sudo rights", "Set the password"] },
    { q: "Why ALWAYS -aG (and not -G alone) with usermod?", options: ["It's faster", "-G alone is forbidden", "Without -a, the group list is REPLACED instead of extended", "-a makes the change permanent"] },
    { q: "What happens with « su sarah » if the account has no password?", options: ["It works right away", "The account is deleted", "Authentication failure: you must run passwd sarah first", "su creates the password"] },
  ],
  13: [
    { q: "What does the cron line « 0 3 * * * » mean?", options: ["Every 3 minutes", "Every day at 3:00 AM", "On the 3rd of every month", "3 times per hour"] },
    { q: "In what order do the 5 time fields come?", options: ["hour minute day month year", "minute hour day-of-month month day-of-week", "day month hour minute second", "second minute hour day month"] },
    { q: "What does */5 mean in the minute field?", options: ["At minute 5 exactly", "5 times a day", "Every 5 minutes", "For 5 minutes"] },
    { q: "What does « crontab -r » do?", options: ["Reloads the crontab", "Shows the crontab", "Renames the crontab", "Removes the WHOLE crontab, without confirmation"] },
  ],
};

if (typeof overlayQuizzes === "function") overlayQuizzes(QUIZZES_EN);
