const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
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

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const directory of directories) {
  copyDirectory(path.join(root, directory), path.join(distDir, directory));
}

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(distDir, file));
}

console.log("Built independent static site in dist/");
