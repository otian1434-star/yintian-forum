# 工作區規則（所有 AI 必讀）

這個工作區裡有**兩個完全獨立的網站**。它們共用一個資料夾樹，但**絕對不可以互相混用**。

## 兩站對照表

| | 曜舞天堂 | 胤天天堂 |
|---|---|---|
| 資料夾 | `GIT論壇開發/` 根目錄 | `GIT論壇開發/胤天論壇資料/` |
| GitHub repo | `otian1434-star/my-gas-link` | `otian1434-star/yintian-forum` |
| 線上網址 | https://otian1434-star.github.io/my-gas-link/ | https://otian1434-star.github.io/yintian-forum/ |
| Git 身分 | otian1434-star | otian1434-star |

`胤天論壇資料/` 有自己的 `.git`，是巢狀在外層 repo 內的**獨立 repo**，外層只把它當 untracked 目錄，不會追蹤它的內容。

## 硬性規則

1. **兩邊網址永遠分開，不可強碰。** 不准把任一站部署到 `otian1434-star.github.io` 根網址（那會佔用 user site，蓋掉另一個）。兩站都必須是 project site，各自待在自己的 `/repo名/` 子路徑下。

2. **不可跨站推送。** 胤天的檔案只能進 `yintian-forum` repo；曜舞的檔案只能進 `my-gas-link` repo。改動前先確認自己在哪個資料夾（`git remote -v` 對一下）。

3. **不可把兩站的內容互相覆蓋。** 兩站的 `config.js`、`assets/`、`pages/`、`data/` 檔名高度相似，複製貼上前務必確認目標路徑。

4. **commit 署名一律 `otian1434-star <otian1434-star@users.noreply.github.com>`。**
   這台電腦的**全域** git 身分是使用者的個人 Gmail 帳號（`git config --global user.email` 可查），那組身分**禁止**出現在這兩個專案的任何 commit、文件或網址裡。
   兩個 repo 都已各自設好 local 身分覆蓋全域值；在這個工作區新建任何 repo 時，**第一件事**就是設定 local 身分，否則會自動繼承到個人帳號。

5. **不要在文件、程式碼或網址裡寫入使用者的個人帳號名與信箱。** 需要提及時一律用「個人帳號」代稱。

## 胤天的建置流程

`胤天論壇資料/` 是 Vite + 靜態站。source 本身就能直接跑（GitHub Pages 服務根目錄的 `index.html`）。

- `config.js` 與 `data/site.json` 是全站設定的 source of truth
- 這兩個檔在 `public/` 與 `dist/client/` 各有一份副本，但**都在 `.gitignore` 內**，repo 只追蹤 source
- 改完設定跑 `npm run build` 同步副本（本機預覽用；GitHub Pages 不需要）
- 根目錄有 `.nojekyll`，停用 Jekyll 處理

## 曜舞的部署

deploy-from-branch 模式，GitHub 依檔案內容變化自動觸發。**空 commit 不會觸發部署**，要有實際檔案變更。驗證是否上線請直接用 WebFetch 抓網址看內容，不要用匿名 GitHub API 輪詢（每小時 60 次上限，會誤判）。
