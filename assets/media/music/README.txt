胤天音樂 — 背景音樂放這裡
============================

1. 把背景音樂的 MP3 檔放進這個資料夾，例如：
     assets/media/music/01.mp3
     assets/media/music/02.mp3
   （想放封面圖也可以一起放，例如 01.jpg）

2. 打開專案根目錄的 config.js，找到 musicPlayer.tracks，照下列格式列出：

     tracks: [
       { title: "歌名一", artist: "演出者", url: "assets/media/music/01.mp3", cover: "assets/media/music/01.jpg" },
       { title: "歌名二", artist: "演出者", url: "assets/media/music/02.mp3" },
     ],

欄位說明
--------
  title  ：顯示用歌名（必填）
  artist ：演出者（可省略）
  url    ：音檔路徑，站內相對路徑或完整 https 網址皆可（必填）
  cover  ：封面圖路徑（可省略，省略時顯示預設音符圖示）

注意事項
--------
- 建議使用 .mp3，瀏覽器相容性最佳（.m4a/.ogg 也可，但不一定每個瀏覽器都支援）。
- 檔名請用英文／數字，避免中文或空格造成路徑問題。
- autoplay（自動播放）受瀏覽器限制：使用者尚未與頁面互動前，瀏覽器會擋下有聲自動播放；
  因此會在使用者「第一次點擊或捲動頁面」時才自動開始，這是正常現象、無法繞過。
- 同一個瀏覽分頁內換頁時，音樂會接續播放（記錄在 sessionStorage）。
