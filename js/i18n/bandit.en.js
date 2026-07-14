// i18n/bandit.en.js — Traductions anglaises du mode Infiltration (bandit.js).
// Chargé juste après js/bandit.js. Indexé par id : { title, desc }.
// Le titre garde le format « Level N — Nom » (le rendu découpe sur « — »).
// Les hints sont des exemples de commandes (laissés tels quels) ; le check()
// teste le mot de passe (chaîne neutre). overlayArray() applique si LANG=en.

const BANDIT_LEVELS_EN = {
  0:  { title: "Level 0 — Connection",
        desc: "The password for the next level is stored in a file called <strong>readme</strong> in the home directory. Find it." },
  1:  { title: "Level 1 — Hidden file",
        desc: "The password is in a <strong>hidden</strong> file in this directory. Hidden files start with a dot." },
  2:  { title: "Level 2 — Search in directories",
        desc: "The password is hidden somewhere in the <strong>data/</strong> directory. There are many files. Use <strong>find</strong> to locate the <strong>password.txt</strong> file." },
  3:  { title: "Level 3 — Grep in the logs",
        desc: "The password was logged in <strong>server.log</strong> but buried among thousands of lines. It's on a line starting with <strong>PASSWORD:</strong>" },
  4:  { title: "Level 4 — Count to find",
        desc: "There are several files in this directory. The right one is the file containing exactly <strong>1 line</strong>. Use <strong>wc -l</strong> to find which." },
  5:  { title: "Level 5 — Sort and filter",
        desc: "The <strong>passwords.txt</strong> file contains many strings. The real password is the only line that appears <strong>only once</strong> (no duplicate). Use <strong>sort</strong> and observe." },
  6:  { title: "Level 6 — Environment variables",
        desc: "The password is stored in an environment variable. Print the value of <strong>$SECRET_PASS</strong>." },
  7:  { title: "Level 7 — Sed to decode",
        desc: "The <strong>encoded.txt</strong> file contains the password, but <strong>PASS:</strong> was replaced with <strong>XXXX:</strong>. Use <strong>sed</strong> to recover it." },
  8:  { title: "Level 8 — CSV extraction",
        desc: "The <strong>users.csv</strong> file contains users. The password is in the 3rd column of the <strong>admin</strong> user's row. Use <strong>grep</strong> then <strong>awk</strong>." },
  9:  { title: "Level 9 — Command chain",
        desc: "The password is hidden deep. You need to: 1) find the file with <strong>find</strong>, 2) filter with <strong>grep</strong>, 3) extract the value with <strong>awk</strong>." },
  10: { title: "Level 10 — Base64",
        desc: "The <strong>secret.b64</strong> file contains the password encoded in <strong>Base64</strong>. Decode it. Tip: <code>cat</code> the file to see the encoding, then <code>base64 -d</code>." },
  11: { title: "Level 11 — ROT13 cipher",
        desc: "The password in <strong>cipher.txt</strong> is encrypted with <strong>ROT13</strong> (each letter shifted by 13). Use <code>rot13</code> to decrypt it." },
  12: { title: "Level 12 — Hexadecimal",
        desc: "The <strong>hex.txt</strong> file contains the password in <strong>hexadecimal</strong>. Convert it to text with <code>xxd -r -p</code>." },
  13: { title: "Level 13 — The Fortress",
        desc: "The password in <strong>forteresse.enc</strong> is <strong>doubly protected</strong>: first encrypted with ROT13, then encoded in Base64. Chain both decodings with a pipe." },
  14: { title: "Level 14 — The Grand Archivist",
        desc: "The archivist buried the password in <strong>registre.csv</strong> (columns: user,role,token). It's the <strong>token</strong> of the only user with the <strong>root</strong> role. Filter then slice." },
};

if (typeof overlayArray === "function") overlayArray(BANDIT_LEVELS, BANDIT_LEVELS_EN, ["title", "desc"]);
