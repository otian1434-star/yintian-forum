const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const pagesDir = path.join(rootDir, 'pages');

const categoryMap = {
  'index.html': '首頁',
  'register.html': '玩家服務',
  'download.html': '遊戲下載',
  'version.html': '版本設定',
  'updates.html': '公告',
  'news.html': '公告',
  'events.html': '公告',
  'disclaimer.html': '規章制度',
  'rules.html': '規章制度',
  'anti-cheat.html': '規章制度',
  'anti-detect.html': '規章制度',
  'job-transfer.html': '玩家服務',
  'accelerator.html': '玩家服務',
  'office.html': '玩家服務',
  'sponsor.html': '玩家服務',
  'faq.html': '玩家服務',
  'promo.html': '玩家服務',
  'stream.html': '玩家服務',
  'equipment-arrogance-gem.html': '遊戲特色',
  'equipment-hero-badge.html': '遊戲特色',
  'equipment-fishing-talisman.html': '遊戲特色',
  'equipment-dragon-seal.html': '遊戲特色',
};

function decodeEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, function (_, code) {
      return String.fromCharCode(Number(code));
    });
}

function cleanText(value) {
  return decodeEntities(String(value || '')
    .replace(/\$\{[^}]+\}/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[{}()[\];=]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function extractFirst(html, pattern) {
  const match = html.match(pattern);
  return match ? cleanText(match[1]) : '';
}

function extractScriptTemplateText(html) {
  const chunks = [];
  html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, function (_, script) {
    const backticks = script.matchAll(/`([\s\S]*?)`/g);
    for (const match of backticks) chunks.push(match[1]);
  });
  return cleanText(chunks.join(' '));
}

function stripScripts(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
}

function categoryFor(filePath) {
  const name = path.basename(filePath);
  if (categoryMap[name]) return categoryMap[name];
  if (/^features/.test(name)) return '遊戲特色';
  if (/^(boss|dolls|transform|map)/.test(name)) return '遊戲資料';
  if (/^(weapons|armor|items)/.test(name)) return '裝備道具';
  return '固定頁面';
}

function urlFor(filePath) {
  return path.relative(rootDir, filePath).replace(/\\/g, '/');
}

function buildRecord(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const title = extractFirst(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i) ||
    extractFirst(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i).replace(/\s*[-·]\s*胤天天堂.*$/, '');
  const description = extractFirst(html, /<div\b[^>]*class=["'][^"']*page-hdr[^"']*["'][\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/i) ||
    extractFirst(html, /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const visibleText = cleanText(stripScripts(html));
  const scriptText = extractScriptTemplateText(html);
  const content = [title, description, visibleText, scriptText]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 18000);

  return {
    title: title || path.basename(filePath, '.html'),
    category: categoryFor(filePath),
    url: urlFor(filePath),
    description,
    content,
  };
}

function main() {
  const htmlFiles = [
    path.join(rootDir, 'index.html'),
    path.join(rootDir, 'register.html'),
    ...fs.readdirSync(pagesDir)
      .filter(function (name) {
        return name.endsWith('.html') && name !== 'search.html';
      })
      .sort()
      .map(function (name) {
        return path.join(pagesDir, name);
      }),
  ];

  const records = htmlFiles
    .filter(function (filePath) {
      return fs.existsSync(filePath);
    })
    .map(buildRecord);

  const output = {
    generatedAt: new Date().toISOString(),
    records,
  };

  const outPath = path.join(rootDir, 'data', 'search-index.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${records.length} search records to ${path.relative(rootDir, outPath)}`);
}

main();
