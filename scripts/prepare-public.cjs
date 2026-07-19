const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist");
const directories = ["assets", "data", "pages"];
const files = ["index.html", "register.html", "config.js", "_redirects"];

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyDirectory(from, to);
    else if (entry.isFile()) fs.copyFileSync(from, to);
  }
}

fs.rmSync(publicDir, { recursive: true, force: true });
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

for (const directory of directories) {
  copyDirectory(path.join(root, directory), path.join(publicDir, directory));
}

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(publicDir, file));
}

console.log("Prepared independent static site in public/");
