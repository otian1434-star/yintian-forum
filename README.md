# 胤天天堂獨立官方站

這個資料夾是一份可獨立部署的靜態網站，品牌、設定與服務入口皆與其他網站分離。

## 部署原則

- 本資料夾本身就是獨立 Git／部署專案，不得把上層既有網站一起推送。
- 使用新的網域或子網域，不覆蓋任何既有網站。
- 正式上線前，在 `config.js` 填入胤天專屬 LINE、下載與贊助資料。
- 未設定的服務會顯示「籌備中」，不會導向其他品牌。

## 內容維護

- 首頁品牌樣式：`assets/css/homepage.css`
- 攻略內頁樣式：`assets/css/style.css` + `assets/css/yintian-theme.css`
- 全站設定：`config.js` 與 `data/site.json`
- 公告資料：`data/posts.json`
- 修改頁面後執行：`node scripts/build-search-index.js`
- 部署建置：`npm run build`（會把靜態內容整理到未追蹤的 `dist/`）

本站不設文章後台與網站帳號申請。`register.html` 僅作為官方 LINE 轉址相容入口，不含表單或資料蒐集。
