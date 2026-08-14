// 胤天天堂獨立站設定。
// 所有尚未取得的胤天專屬服務都保持停用，禁止暫接其他品牌。
const YINTIAN_PENDING_LINK = "#service-pending";

const FORUM_CONFIG = {
  forumName: "胤天天堂",
  forumFullName: "胤天天堂｜正統承胤・天命再臨",
  forumSlogan: "正統承胤・天命再臨",
  serverVersion: "3.81 內掛版",
  heroTitle: "胤天",
  heroSubTitle: "正統承胤・天命再臨",
  heroVideo: "",
  heroImage: "assets/media/hero-characters.png",
  brandLogo: "assets/media/yintian-official-logo.jpg",

  lineOfficial: "https://lin.ee/vITIxze",
  lineCommunity: "https://line.me/ti/g2/DW7sRT2ayxamyhEdUFUFxJCfQCGOZeuacrxnqA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
  lineCommunityName: "胤天381內掛討論區",
  lineId: "籌備中",
  teamName: "胤天天堂管理團隊",

  download: {
    mainUrl: "https://drive.google.com/file/d/1EW7l9zh31lFnInee8T18D0F5GtP66-HF/view?usp=sharing",   // 下載點一
    backup1: "https://disk.cloud-shield.app/s/UHn52x",                                               // 下載點二
    backup2: "https://drive.google.com/file/d/1SO3xROODABPeyH3O53XJrKyBpCqUKSMU/view?usp=sharing",   // 下載點三
    backup3: "https://drive.google.com/file/d/1njpBShZ2vOEsrSdhbElYUcvoTGY_4bRS/view?usp=sharing",   // 備用載點
    patchUrl: "",
    updateDate: "2026/08/11",
    anyDeskUrl: "https://anydesk.com/zh-tw/downloads/windows",
  },

  sponsorUrl: "https://web-hosts.net/%E8%83%A4%E5%A4%A9%E5%A4%A9%E5%A0%82.html",   // 自動贊助
  promoReportUrl: "https://web-hosts.net/share/rfFw7RG0",                          // 推廣回報

  floatingPanel: {
    enabled: true,
    title: "胤天王城捷徑",
    note: "官方資料 · 遊戲導覽",
    links: [
      { label: "遊戲資料庫", icon: "典", url: "pages/game-database.html", style: "gold" },
      { label: "遊戲下載", icon: "錄", url: "pages/download.html", style: "blue" },
      { label: "全站搜尋", icon: "查", url: "pages/search.html", style: "dark" },
      { label: "王城公告", icon: "詔", url: "pages/news.html", style: "dark" },
    ],
  },

  sideBanners: { enabled: false },

  musicPlayer: {
    enabled: true,
    title: "胤天王城樂章",
    autoplay: true,
    loop: true,
    shuffle: true,
    volume: 0.62,
    tracks: [
      { title: "王城樂章 1", url: "assets/media/music/music142.mp3" },
      { title: "王城樂章 2", url: "assets/media/music/music146.mp3" },
      { title: "王城樂章 3", url: "assets/media/music/music153.mp3" },
      { title: "王城樂章 4", url: "assets/media/music/music176.mp3" }
    ],
  },

  popup: { enabled: false },

  heroBadges: [
    "✦ 3.81 內掛版",
    "⚔ 正統版本節奏",
    "🔥 08/14（五）20:00 開機"
  ],
};

window.YINTIAN_CONFIG = {
  brandName: "胤天",
  productName: "天堂",
  version: FORUM_CONFIG.serverVersion,
  slogan: FORUM_CONFIG.forumSlogan,
  openingDate: "2026/08/14（五）20:00 開機",
  lineUrl: FORUM_CONFIG.lineOfficial,
  communityUrl: FORUM_CONFIG.lineCommunity,
  communityName: FORUM_CONFIG.lineCommunityName,
  lineId: FORUM_CONFIG.lineId,
  downloadUrl: FORUM_CONFIG.download.mainUrl || YINTIAN_PENDING_LINK,
  sponsorUrl: FORUM_CONFIG.sponsorUrl || YINTIAN_PENDING_LINK,
  promoReportUrl: FORUM_CONFIG.promoReportUrl || YINTIAN_PENDING_LINK,
};

window.FORUM_CONFIG_READY = Promise.resolve(FORUM_CONFIG);
