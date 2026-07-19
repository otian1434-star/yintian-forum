const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const metadataDir = path.join(distDir, ".openai");
const workerBuildDir = path.join(distDir, "yintian_lineage_official");
const serverDir = path.join(distDir, "server");

if (!fs.existsSync(path.join(workerBuildDir, "index.js"))) {
  throw new Error("Vite build did not create the Worker entry point");
}

fs.rmSync(serverDir, { recursive: true, force: true });
fs.mkdirSync(serverDir, { recursive: true });
fs.copyFileSync(
  path.join(workerBuildDir, "index.js"),
  path.join(serverDir, "index.js"),
);
fs.copyFileSync(
  path.join(workerBuildDir, "wrangler.json"),
  path.join(serverDir, "wrangler.json"),
);

fs.mkdirSync(metadataDir, { recursive: true });
fs.copyFileSync(
  path.join(root, ".openai", "hosting.json"),
  path.join(metadataDir, "hosting.json"),
);

console.log("Finalized Sites deployment metadata in dist/");
