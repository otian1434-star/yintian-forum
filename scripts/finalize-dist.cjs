const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const metadataDir = path.join(distDir, ".openai");

if (!fs.existsSync(path.join(distDir, "server", "index.js"))) {
  throw new Error("vinext build did not create dist/server/index.js");
}

fs.mkdirSync(metadataDir, { recursive: true });
fs.copyFileSync(
  path.join(root, ".openai", "hosting.json"),
  path.join(metadataDir, "hosting.json"),
);

console.log("Finalized Sites deployment metadata in dist/");
