// i18n/expert.en.js — Traductions anglaises du Mode Expert (expert.js).
// Chargé juste après js/expert.js. Indexé par id : { name, desc, explanation }.
// hint non affiché (noHints:true) et check() sur sortie/état → non traduits.
// overlayArray() applique si LANG === "en".

const EXPERT_MISSIONS_EN = {
  9001: {
    name: "Expert 1 — Noise elimination",
    desc: "The <code>server.log</code> file mixes several severity levels. Display the NUMBER of lines that are NEITHER <code>DEBUG</code> NOR <code>INFO</code> (i.e. the truly important lines: WARN, ERROR, CRITICAL).",
    explanation: "By chaining two <code>grep -v</code>, you eliminate the levels you don't care about before counting with <code>wc -l</code>. This is the kind of pipeline you actually write to monitor production logs.",
  },
  9002: {
    name: "Expert 2 — The most active IP",
    desc: "In <code>access.log</code>, find the IP address that recurs most often (1st column of each line). Display only the most frequent result, with its count.",
    explanation: "The <code>sort | uniq -c | sort -rn</code> combo is THE classic to count occurrences and surface the most frequent. Here, <code>10.0.0.1</code> recurs 3 times: that's the one to watch.",
  },
  9003: {
    name: "Expert 3 — Bulk cleanup",
    desc: "The directory is full of leftover temporary <code>.tmp</code> files. Find them all at once and delete them in a single command line.",
    explanation: "<code>find</code> locates the files, and <code>xargs</code> turns that list into arguments for <code>rm</code>. No more deleting one by one — it's the combo admins use for bulk cleanup.",
  },
  9004: {
    name: "Expert 4 — Switch to production",
    desc: "The <code>config.ini</code> file is still in <code>development</code> mode. Without modifying the original, create a new <code>config.prod.ini</code> file where <code>development</code> is replaced with <code>production</code>.",
    explanation: "<code>sed</code> transforms the text on the fly, and the <code>&gt;</code> redirection saves the result into a new file without touching the original. Exactly what you need before a deployment.",
  },
  9005: {
    name: "Expert 5 — Unique regions",
    desc: "The <code>sales.csv</code> file contains sales by region, with duplicates. Display the list of regions (1st column), without duplicates, sorted alphabetically.",
    explanation: "<code>cut -d',' -f1</code> extracts the first column of a CSV, and <code>sort -u</code> sorts while removing duplicates in a single pass.",
  },
  9006: {
    name: "Expert 6 — The dangerous file",
    desc: "Among these files, only one has dangerous permissions (writable by everyone). Find it by combining the detailed listing and a filter.",
    explanation: "<code>ls -l | grep rwxrwxrwx</code> instantly spots the file where EVERYONE can read, write AND execute — a real security hole if it's a sensitive file.",
  },
  9007: {
    name: "Expert 7 — The heavyweight",
    desc: "Find the largest file in the current directory, in a single command line.",
    explanation: "<code>du</code> shows the size of each file, <code>sort -rn</code> ranks them from largest to smallest, and <code>head -n 1</code> keeps only the first. Full-disk diagnosis in one line.",
  },
  9008: {
    name: "Expert 8 — Express report",
    desc: "Final test: in <code>events.log</code> (format <code>service:LEVEL:message</code>), find which <b>service</b> generates the most <code>ERROR</code> lines. A single command line, five tools chained.",
    explanation: "The complete pipeline: <code>grep</code> filters the ERRORs, <code>cut</code> isolates the service, <code>sort | uniq -c</code> counts occurrences, and <code>sort -rn</code> surfaces the worst. It's exactly what an admin types while debugging prod at 3 a.m. You're ready.",
  },
};

if (typeof overlayArray === "function") overlayArray(EXPERT_MISSIONS, EXPERT_MISSIONS_EN, ["name", "desc", "explanation"]);
