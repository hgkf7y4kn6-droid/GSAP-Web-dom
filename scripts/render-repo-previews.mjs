// Renders a preview image of a repository's front page (its top-level files
// and README) for projects that have no live site. Run it from a folder that
// holds local clones of the repositories:
//
//   node scripts/render-repo-previews.mjs <clones-dir>
//
// Needs `playwright` and `marked`. They are not project dependencies, so
// install them globally (npm i -g playwright marked) or point PREVIEW_TOOLS
// at a node_modules folder that has them. Output: public/images/previews/.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const OWNER = "hgkf7y4kn6-droid";
const REPOS = [
  "Capstone-Healthcare-Agent",
  "Cost-Comparison-Tool",
  "news-agent",
  "Misadventures-of-Havoc-and-Chaos",
];
const WIDTH = 960;
const HEIGHT = 600;

const load = async (name) => {
  try {
    return await import(name);
  } catch {
    const dir = process.env.PREVIEW_TOOLS;
    if (!dir) throw new Error(`Install ${name} or set PREVIEW_TOOLS`);
    const pkg = path.join(dir, name);
    const { module, main, exports } = JSON.parse(
      fs.readFileSync(path.join(pkg, "package.json"), "utf8"),
    );
    const entry =
      exports?.["."]?.import?.default ?? exports?.["."]?.import ?? module ?? main;
    return import(pathToFileURL(path.join(pkg, typeof entry === "string" ? entry : "index.js")));
  }
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clones = path.resolve(process.argv[2] ?? ".");
const outDir = path.join(root, "public/images/previews");
fs.mkdirSync(outDir, { recursive: true });

const { marked } = await load("marked");
const { chromium } = await load("playwright");

const git = (repo, ...args) =>
  execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();
const esc = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const icon = {
  dir: '<svg viewBox="0 0 16 16"><path d="M1.75 2.5h4l1.5 1.75h7v8.5a.75.75 0 0 1-.75.75H1.75A.75.75 0 0 1 1 12.75v-9.5a.75.75 0 0 1 .75-.75Z" fill="currentColor"/></svg>',
  file: '<svg viewBox="0 0 16 16"><path d="M3.75 1.5h5.5L13 5.25v9a.75.75 0 0 1-.75.75h-8.5A.75.75 0 0 1 3 14.25V2.25a.75.75 0 0 1 .75-.75Z" fill="none" stroke="currentColor" stroke-width="1.25"/></svg>',
};

// Folders that say nothing about what the project does.
const NOISE = new Set(["__pycache__", "logs", "node_modules", "data", "docker"]);

const structure = (dir, entries) => {
  const folders = entries.filter((e) => e.dir && !e.name.startsWith(".") && !NOISE.has(e.name));
  const blocks = folders.map((f) => {
    const files = git(dir, "ls-tree", "--name-only", `HEAD:${f.name}`)
      .split("\n")
      .filter((n) => n && !n.startsWith("__") && !n.startsWith("."));
    const list = files.slice(0, 4).map((n) => `<code>${esc(n)}</code>`).join(" ");
    const extra = files.length > 4 ? ` <span class="none">+${files.length - 4}</span>` : "";
    return `<div class="tree"><b>${esc(f.name)}/</b> ${list}${extra}</div>`;
  });
  return blocks.join("");
};

const page = (repo, dir) => {
  const branch = git(dir, "rev-parse", "--abbrev-ref", "HEAD");
  const [sha, date, subject] = git(dir, "log", "-1", "--format=%h%x09%cs%x09%s").split("\t");
  const entries = git(dir, "ls-tree", "HEAD")
    .split("\n")
    .map((line) => {
      const [meta, name] = line.split("\t");
      return { name, dir: meta.split(" ")[1] === "tree" };
    })
    .sort((a, b) => b.dir - a.dir || a.name.localeCompare(b.name));
  const shown = entries.slice(0, 11);
  const more = entries.length - shown.length;

  const readmePath = ["README.md", "readme.md", "README"]
    .map((f) => path.join(dir, f))
    .find((f) => fs.existsSync(f));
  // Images in a README point at repo-relative paths that don't exist here.
  // Without a README, show what's inside each source folder instead.
  const readme = readmePath
    ? marked.parse(fs.readFileSync(readmePath, "utf8")).replace(/<img[^>]*>/g, "")
    : structure(dir, entries);
  const label = readmePath ? path.basename(readmePath) : "Project structure";

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0}
  body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;background:#0a0d14;color:#e6e9ef;
    font:13px/1.55 Inter,system-ui,sans-serif;padding:26px 28px}
  header{display:flex;align-items:center;gap:10px;font-size:19px}
  header .owner{color:#8b93a5} header b{font-weight:600}
  .badge{font:500 11px Inter;border:1px solid rgb(255 255 255 / .18);color:#8b93a5;border-radius:99px;padding:2px 9px;margin-left:4px}
  .commit{margin-top:8px;color:#8b93a5;font:12px "DejaVu Sans Mono",monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .commit .branch{color:#3fd8ff}
  .grid{display:grid;grid-template-columns:270px 1fr;gap:18px;margin-top:18px;height:${HEIGHT - 120}px}
  .panel{border:1px solid rgb(255 255 255 / .09);border-radius:12px;background:rgb(30 41 59 / .45);overflow:hidden}
  ul{list-style:none;padding:6px 0}
  li{display:flex;align-items:center;gap:9px;padding:6px 14px;border-top:1px solid rgb(255 255 255 / .05)}
  li:first-child{border-top:0} li svg{width:14px;height:14px;flex:none}
  li.d svg{color:#3fd8ff} li.f svg{color:#8b93a5}
  li.more{color:#8b93a5;font-size:12px}
  .readme{position:relative;padding:4px 22px 0}
  .readme .label{font:500 11px "DejaVu Sans Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:#8b93a5;
    padding:12px 0 10px;border-bottom:1px solid rgb(255 255 255 / .07);margin-bottom:12px}
  .readme::after{content:"";position:absolute;inset:auto 0 0;height:90px;background:linear-gradient(transparent,#141b28)}
  .readme h1{font-size:22px;line-height:1.25;margin:2px 0 10px;font-weight:650}
  .readme h2{font-size:16px;margin:16px 0 8px;font-weight:600}
  .readme h3{font-size:14px;margin:12px 0 6px}
  .readme p,.readme ul,.readme ol,.readme pre,.readme table,.readme blockquote{margin-bottom:10px}
  .readme ul,.readme ol{padding-left:20px} .readme li{display:list-item;border:0;padding:1px 0}
  .readme a{color:#3fd8ff;text-decoration:none} .readme strong{color:#fff}
  .readme code{font:12px "DejaVu Sans Mono",monospace;background:rgb(255 255 255 / .07);padding:1px 5px;border-radius:5px}
  .readme pre{background:rgb(0 0 0 / .35);padding:10px 12px;border-radius:8px;overflow:hidden}
  .readme pre code{background:none;padding:0}
  .readme table{border-collapse:collapse;font-size:12px} .readme td,.readme th{border:1px solid rgb(255 255 255 / .1);padding:4px 8px;text-align:left}
  .readme blockquote{border-left:3px solid #3fd8ff;padding-left:10px;color:#b8c0cf}
  .readme hr{border:0;border-top:1px solid rgb(255 255 255 / .08);margin:12px 0}
  .none{color:#8b93a5;font-style:italic}
  .tree{padding:7px 0;border-bottom:1px solid rgb(255 255 255 / .05);line-height:2}
  .tree b{color:#3fd8ff;font:600 13px "DejaVu Sans Mono",monospace;margin-right:6px}
  .tree code{margin-right:2px}
  </style></head><body>
  <header>${icon.dir.replace("<svg", '<svg width="18" height="18" style="color:#8b93a5"')}
    <span><span class="owner">${OWNER} /</span> <b>${esc(repo)}</b></span><span class="badge">Public</span></header>
  <p class="commit"><span class="branch">${esc(branch)}</span> · ${esc(sha)} · ${esc(subject)} · ${esc(date)}</p>
  <div class="grid">
    <div class="panel"><ul>
      ${shown.map((e) => `<li class="${e.dir ? "d" : "f"}">${e.dir ? icon.dir : icon.file}${esc(e.name)}</li>`).join("")}
      ${more > 0 ? `<li class="more">+ ${more} more</li>` : ""}
    </ul></div>
    <div class="panel readme"><p class="label">${esc(label)}</p>${readme}</div>
  </div></body></html>`;
};

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);
const tab = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
for (const repo of REPOS) {
  const dir = path.join(clones, repo);
  if (!fs.existsSync(dir)) {
    console.warn(`skip ${repo}: no clone at ${dir}`);
    continue;
  }
  await tab.setContent(page(repo, dir), { waitUntil: "load" });
  const out = path.join(outDir, `${repo.toLowerCase()}.jpg`);
  await tab.screenshot({ path: out, type: "jpeg", quality: 82 });
  console.log(`${out} ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
}
await browser.close();
