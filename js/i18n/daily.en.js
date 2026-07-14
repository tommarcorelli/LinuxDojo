// i18n/daily.en.js — Traductions anglaises du défi du jour (daily.js).
// Chargé juste après js/daily.js. DAILY_POOL n'a pas d'id → overlay par INDEX
// (tableau parallèle). check()/hint (commande) restent inchangés.
// overlayIndexed() (js/i18n.js) applique si LANG === "en".

const DAILY_POOL_EN = [
  { title: "🔍 Error hunt",
    desc: "A server crashed last night. Find the lines containing <strong>ERROR</strong> in <code>server.log</code>." },
  { title: "📊 Quick count",
    desc: "How many lines does <code>data.txt</code> contain? Find the exact number." },
  { title: "🗂️ .log hunt",
    desc: "Find all the <code>.log</code> files in the current directory." },
  { title: "🕵️ Hideout",
    desc: "A hidden file contains a secret. List ALL files to spot it." },
  { title: "📝 Version signature",
    desc: "Write exactly <strong>v2.0.0</strong> into a file named <code>VERSION</code>." },
  { title: "🔤 Alphabetical sort",
    desc: "Sort <code>fruits.txt</code> alphabetically. The 1st line of the result must start with 'a'." },
  { title: "🔐 Base64 decoding",
    desc: "The <code>msg.b64</code> file contains a hidden message. Decode it." },
  { title: "🧮 Error counting",
    desc: "Count the exact number of <strong>ERROR</strong> occurrences in <code>app.log</code>." },
  { title: "🎯 Column extraction",
    desc: "Display only the names (1st column) of <code>users.csv</code>." },
  { title: "🔀 Renaming",
    desc: "Rename <code>draft.txt</code> to <code>final.txt</code>." },
  { title: "🧙 ROT13",
    desc: "The <code>msg.rot</code> file is encrypted with ROT13. Decrypt it." },
  { title: "🔎 Case-insensitive search",
    desc: "Find all the lines mentioning Linux (LINUX, Linux, linux...) in <code>notes.txt</code>." },
  { title: "👀 Just the start",
    desc: "The report is too long. Display only its <strong>first 2 lines</strong>." },
  { title: "🏁 The end of the story",
    desc: "Display only the <strong>last line</strong> of <code>course.txt</code> to find the winner." },
  { title: "✂️ Column surgery",
    desc: "Extract only the <strong>first names</strong> (2nd column) of <code>equipe.csv</code>, comma separator." },
  { title: "🧬 No duplicates",
    desc: "Count how many <strong>different species</strong> <code>zoo.txt</code> contains (duplicates excluded)." },
];

if (typeof overlayIndexed === "function") overlayIndexed(DAILY_POOL, DAILY_POOL_EN, ["title", "desc"]);
