/* ================================================================
   胤天天堂 - 全站共用 JS  forum.js
   頂部水平導覽列版本
   ================================================================ */

(function () {
  'use strict';

  function init() {
    if (typeof FORUM_CONFIG === 'undefined') { setTimeout(init, 30); return; }
    // 等後台設定（data/site.json）載入合併完再建構；舊版/讀不到時也會立即進行
    (window.FORUM_CONFIG_READY || Promise.resolve()).then(initNow);
  }
  function initNow() {
    buildHeader();
    removeOldNav();
    buildFooter();
    buildFloatingPanel();
    buildSideBanners();
    buildMusicPlayer();
    initPopup();
    highlightNav();
    addPageHdrLine();
    initDesktopDropdowns();
    enhanceArticleTables();
  }

  /* 判斷根路徑 */
  function root() {
    const path = window.location.pathname;
    return (path.includes('/pages/') || path.includes('/admin/')) ? '../' : './';
  }

  function serviceLinkReady(url) {
    return !!(url && url !== '#' && url !== '#service-pending');
  }

  /* ================================================================
     HEADER（頂部導覽列）
  ================================================================ */
  function buildHeader() {
    const C = FORUM_CONFIG;
    const r = root();
    const officialReady = serviceLinkReady(C.lineOfficial);
    const communityLink = serviceLinkReady(C.lineCommunity) && C.lineCommunity !== C.lineOfficial ? C.lineCommunity : '';

    const headerHTML = `
    <header id="top-header">
      <a href="${r}index.html" class="logo-area">
        ${C.brandLogo ? `<img class="logo-img" src="${resolveLink(C.brandLogo, r)}" alt="${escapeHTML(C.forumName)}">` : '<span class="logo-icon">⚔️</span>'}
        <span class="logo-text">${C.forumName}</span>
      </a>
      <div class="logo-divider"></div>

      <nav id="main-nav">
        <!-- 首頁 -->
        <div class="nav-item">
          <a class="nav-link-top" href="${r}index.html">首頁</a>
        </div>
        <!-- 搜尋 -->
        <div class="nav-item">
          <a class="nav-link-top" href="${r}pages/search.html">搜尋</a>
        </div>
        <!-- 遊戲下載 -->
        <div class="nav-item">
          <a class="nav-link-top" href="${r}pages/download.html">遊戲下載</a>
        </div>
        <!-- 版本設定 -->
        <div class="nav-item">
          <a class="nav-link-top" href="${r}pages/version.html">版本設定</a>
        </div>
        <!-- 公告 -->
        <div class="nav-item">
          <button class="nav-link-top">公告 <span class="nav-arrow">▶</span></button>
          <div class="nav-dropdown">
            <a href="${r}pages/updates.html">📋 更新歷程</a>
            <a href="${r}pages/news.html">📰 最新文章</a>
            <a href="${r}pages/events.html">🎉 活動公告</a>
            <div class="nav-dd-divider"></div>
            <div class="nav-dd-label">規章制度</div>
            <a href="${r}pages/disclaimer.html">🦊 免責聲明</a>
            <a href="${r}pages/rules.html">⛔ 遊戲管理規章</a>
            <a href="${r}pages/anti-cheat.html">🚫 外掛懲處條例</a>
            <a href="${r}pages/anti-detect.html">😈 防外掛驗證教學</a>
            <div class="nav-dd-divider"></div>
            <div class="nav-dd-label">服務說明</div>
            <a href="${r}pages/job-transfer.html">🛡️ 轉職服務</a>
            <a href="${r}pages/accelerator.html">🤔 加速器迷思</a>
            <a href="${r}pages/office.html">💻 OFFICE 安裝</a>
          </div>
        </div>
        <!-- 遊戲資料 -->
        <div class="nav-item">
          <button class="nav-link-top">遊戲資料 <span class="nav-arrow">▶</span></button>
          <div class="nav-dropdown">
            <a href="${r}pages/game-database.html">📚 遊戲資料庫</a>
            <div class="nav-dd-divider"></div>
            <div class="nav-dd-label">遊戲特色</div>
            <a href="${r}pages/features-overview.html">⚔️ 遊戲特色總覽</a>
            <a href="${r}pages/features-newbie-guide.html">📚 新手引導</a>
            <a href="${r}pages/features-daily-quest.html">📜 每日任務</a>
            <a href="${r}pages/features-level-rewards.html">🎁 等級獎勵表</a>
            <a href="${r}pages/features-event-coin.html">🎉 活動金幣</a>
            <a href="${r}pages/features-shop.html">💎 商城介紹</a>
            <a href="${r}pages/features-infinite-battle.html">⚔️ 無限大戰</a>
            <a href="${r}pages/features-mage-summon.html">✨ 法師召喚系統</a>
            <a href="${r}pages/features-pet.html">🐾 寵物系統</a>
            <a href="${r}pages/features-hecate.html">🌙 赫卡特介紹</a>
            <a href="${r}pages/features-online-bag.html">🕊️ 在線獎勵</a>
            <a href="${r}pages/features-dragon-whisper.html">🐉 龍之呢喃</a>
            <a href="${r}pages/features-equipment-collection.html">📚 圖鑑收藏</a>
            <a href="${r}pages/equipment-arrogance-gem.html">💎 傲慢寶石</a>
            <a href="${r}pages/equipment-hero-badge.html">🛡️ 勇者徽章</a>
            <a href="${r}pages/equipment-fishing-talisman.html">🎣 釣魚護符</a>
            <a href="${r}pages/equipment-dragon-seal.html">🐉 龍印魔石</a>
            <a href="${r}pages/features-domination-tower.html">🗼 支配之塔</a>
            <a href="${r}pages/features-zodiac.html">♈ 黃道12宮介紹</a>
            <a href="${r}pages/features-transform-fusion.html">🎭 變身卡合成</a>
            <div class="nav-dd-divider"></div>
            <div class="nav-dd-label">裝備道具</div>
            <a href="${r}pages/weapons-overview.html">⚔️ 武器介紹</a>
            <a href="${r}pages/weapons-database.html">🔎 武器庫查詢</a>
            <a href="${r}pages/weapons-enhance.html">📜 武器強化說明</a>
            <a href="${r}pages/armor-overview.html">🛡️ 防具介紹</a>
            <a href="${r}pages/armor-database.html">🔎 防具庫查詢</a>
            <a href="${r}pages/armor-enhance-protect.html">📜 防具強化與防爆</a>
            <a href="${r}pages/armor-anti-magic.html">🔥 滅魔裝備介紹</a>
            <a href="${r}pages/armor-einhasad-belt.html">☀️ 殷海薩腰帶</a>
            <a href="${r}pages/armor-level-badge.html">🏅 等級徽章</a>
            <a href="${r}pages/armor-accessory-enhance.html">📿 飾品強化介紹</a>
            <a href="${r}pages/armor-snappers-ring.html">💍 史奈普戒指</a>
            <a href="${r}pages/armor-roomtis-earring.html">👂 倫提斯耳環</a>
            <a href="${r}pages/armor-stat-shirt.html">👕 能力內衣</a>
            <a href="${r}pages/armor-stat-boots.html">🥾 能力長靴</a>
            <a href="${r}pages/armor-special-shield.html">🛡️ 特殊臂盾介紹</a>
            <a href="${r}pages/armor-shoulder-guard.html">🎖️ 左右肩甲介紹</a>
            <a href="${r}pages/items-overview.html">🎒 道具列表</a>
            <div class="nav-dd-divider"></div>
            <div class="nav-dd-label">圖鑑</div>
            <a href="${r}pages/mobs-overview.html">👹 怪物列表</a>
            <a href="${r}pages/boss-schedule.html">🌍 世界BOSS時刻表</a>
            <a href="${r}pages/dolls-guide.html">🧸 娃娃介紹</a>
            <a href="${r}pages/dolls-list.html">🧸 娃娃圖鑑清單</a>
            <a href="${r}pages/transform-guide.html">🎭 變身圖鑑大全</a>
            <a href="${r}pages/map.html">🗺️ 地圖介紹</a>
            <a href="${r}pages/map-training.html">🗺️ 專屬練功地圖</a>
            <a href="${r}pages/map-dream-island.html">🏝️ 夢幻之島</a>
            <a href="${r}pages/map-elemental-prison.html">🏰 屬性監獄</a>
          </div>
        </div>
        <!-- 道具 -->
        <div class="nav-item">
          <button class="nav-link-top">道具介紹 <span class="nav-arrow">▶</span></button>
          <div class="nav-dropdown">
            <a href="${r}pages/items-dragon-eye.html">👁️ 四龍之魔眼</a>
            <a href="${r}pages/items-candle.html">🕯️ 回憶蠟燭</a>
          </div>
        </div>
        <!-- 玩家服務 -->
        <div class="nav-item">
          <button class="nav-link-top">玩家服務 <span class="nav-arrow">▶</span></button>
          <div class="nav-dropdown">
            <a href="${r}pages/sponsor.html">💎 贊助說明</a>
            <a href="${r}pages/faq.html">❓ 常見問題</a>
            <a href="${r}pages/promo.html">📜 推文說明</a>
            <a href="${r}pages/stream.html">🎥 直播說明</a>
          </div>
        </div>
      </nav>

      <div class="header-right">
        ${communityLink ? `<a href="${communityLink}" target="_blank" rel="noopener" class="btn-line-c">
          💬<span class="btn-label"> 玩家討論區</span>
        </a>` : ''}
        ${officialReady
          ? `<a href="${C.lineOfficial}" target="_blank" rel="noopener" class="btn-line-o">LINE<span class="btn-label"> 官方客服</span></a>`
          : '<span class="btn-line-o is-disabled" aria-disabled="true">LINE<span class="btn-label"> 籌備中</span></span>'}
        ${officialReady
          ? `<a href="${C.lineOfficial}" target="_blank" rel="noopener" class="btn-register">💬<span class="btn-label"> 加入官方 LINE</span></a>`
          : '<span class="btn-register is-disabled" aria-disabled="true">💬<span class="btn-label"> LINE 籌備中</span></span>'}
        <button class="btn-hamburger" id="hamburger-btn" onclick="forumToggleMobile()" aria-label="選單">☰</button>
      </div>
    </header>

    <!-- 行動版選單 -->
    <div id="mobile-menu">
      <div class="mob-section">主要</div>
      <a class="mob-link" href="${r}index.html">🏠 首頁</a>
      <a class="mob-link" href="${r}pages/search.html">🔎 全站搜尋</a>
      <a class="mob-link" href="${r}pages/download.html">📥 遊戲下載</a>
      <a class="mob-link" href="${r}pages/version.html">🔧 版本設定</a>
      <a class="mob-link" href="${r}pages/game-database.html">📚 遊戲資料庫</a>
      <a class="mob-link" href="${r}pages/updates.html">📋 更新歷程</a>
      <a class="mob-link" href="${r}pages/news.html">📰 最新文章</a>
      <a class="mob-link" href="${r}pages/events.html">🎉 活動公告</a>

      <div class="mob-section">系統公告</div>
      <a class="mob-link mob-sub" href="${r}pages/disclaimer.html">🦊 免責聲明</a>
      <a class="mob-link mob-sub" href="${r}pages/rules.html">⛔ 遊戲管理規章</a>
      <a class="mob-link mob-sub" href="${r}pages/anti-cheat.html">🚫 外掛懲處條例</a>
      <a class="mob-link mob-sub" href="${r}pages/anti-detect.html">😈 防外掛驗證教學</a>
      <a class="mob-link mob-sub" href="${r}pages/job-transfer.html">🛡️ 轉職服務</a>
      <a class="mob-link mob-sub" href="${r}pages/accelerator.html">🤔 加速器迷思</a>
      <a class="mob-link mob-sub" href="${r}pages/office.html">💻 OFFICE 安裝</a>

      <div class="mob-section">遊戲特色</div>
      <a class="mob-link mob-sub" href="${r}pages/features-overview.html">⚔️ 遊戲特色總覽</a>
      <a class="mob-link mob-sub" href="${r}pages/features-newbie-guide.html">📚 新手引導</a>
      <a class="mob-link mob-sub" href="${r}pages/features-daily-quest.html">📜 每日任務</a>
      <a class="mob-link mob-sub" href="${r}pages/features-level-rewards.html">🎁 等級獎勵表</a>
      <a class="mob-link mob-sub" href="${r}pages/features-event-coin.html">🎉 活動金幣</a>
      <a class="mob-link mob-sub" href="${r}pages/features-shop.html">💎 商城介紹</a>
      <a class="mob-link mob-sub" href="${r}pages/features-infinite-battle.html">⚔️ 無限大戰</a>
      <a class="mob-link mob-sub" href="${r}pages/features-mage-summon.html">✨ 法師召喚系統</a>
      <a class="mob-link mob-sub" href="${r}pages/features-pet.html">🐾 寵物系統</a>
      <a class="mob-link mob-sub" href="${r}pages/features-hecate.html">🌙 赫卡特介紹</a>
      <a class="mob-link mob-sub" href="${r}pages/features-online-bag.html">🕊️ 在線獎勵</a>
      <a class="mob-link mob-sub" href="${r}pages/features-dragon-whisper.html">🐉 龍之呢喃</a>
      <a class="mob-link mob-sub" href="${r}pages/features-equipment-collection.html">📚 圖鑑收藏</a>
      <a class="mob-link mob-sub" href="${r}pages/equipment-arrogance-gem.html">💎 傲慢寶石</a>
      <a class="mob-link mob-sub" href="${r}pages/equipment-hero-badge.html">🛡️ 勇者徽章</a>
      <a class="mob-link mob-sub" href="${r}pages/equipment-fishing-talisman.html">🎣 釣魚護符</a>
      <a class="mob-link mob-sub" href="${r}pages/equipment-dragon-seal.html">🐉 龍印魔石</a>
      <a class="mob-link mob-sub" href="${r}pages/features-domination-tower.html">🗼 支配之塔</a>
      <a class="mob-link mob-sub" href="${r}pages/features-zodiac.html">♈ 黃道12宮介紹</a>
      <a class="mob-link mob-sub" href="${r}pages/features-transform-fusion.html">🎭 變身卡合成</a>

      <div class="mob-section">裝備道具</div>
      <a class="mob-link mob-sub" href="${r}pages/weapons-overview.html">⚔️ 武器介紹</a>
      <a class="mob-link mob-sub" href="${r}pages/weapons-database.html">🔎 武器庫查詢</a>
      <a class="mob-link mob-sub" href="${r}pages/weapons-enhance.html">📜 武器強化說明</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-overview.html">🛡️ 防具介紹</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-database.html">🔎 防具庫查詢</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-enhance-protect.html">📜 防具強化與防爆</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-anti-magic.html">🔥 滅魔裝備介紹</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-einhasad-belt.html">☀️ 殷海薩腰帶</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-level-badge.html">🏅 等級徽章</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-accessory-enhance.html">📿 飾品強化介紹</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-snappers-ring.html">💍 史奈普戒指</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-roomtis-earring.html">👂 倫提斯耳環</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-stat-shirt.html">👕 能力內衣</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-stat-boots.html">🥾 能力長靴</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-special-shield.html">🛡️ 特殊臂盾介紹</a>
      <a class="mob-link mob-sub" href="${r}pages/armor-shoulder-guard.html">🎖️ 左右肩甲介紹</a>
      <a class="mob-link mob-sub" href="${r}pages/items-overview.html">🎒 道具列表</a>
      <a class="mob-link mob-sub" href="${r}pages/items-dragon-eye.html">👁️ 四龍之魔眼</a>
      <a class="mob-link mob-sub" href="${r}pages/items-candle.html">🕯️ 回憶蠟燭</a>

      <div class="mob-section">圖鑑</div>
      <a class="mob-link mob-sub" href="${r}pages/mobs-overview.html">👹 怪物列表</a>
      <a class="mob-link mob-sub" href="${r}pages/boss-schedule.html">🌍 世界BOSS時刻表</a>
      <a class="mob-link mob-sub" href="${r}pages/dolls-guide.html">🧸 娃娃介紹</a>
      <a class="mob-link mob-sub" href="${r}pages/dolls-list.html">🧸 娃娃圖鑑清單</a>
      <a class="mob-link mob-sub" href="${r}pages/transform-guide.html">🎭 變身圖鑑大全</a>
      <a class="mob-link mob-sub" href="${r}pages/map.html">🗺️ 地圖介紹</a>
      <a class="mob-link mob-sub" href="${r}pages/map-training.html">🗺️ 專屬練功地圖</a>
      <a class="mob-link mob-sub" href="${r}pages/map-dream-island.html">🏝️ 夢幻之島</a>
      <a class="mob-link mob-sub" href="${r}pages/map-elemental-prison.html">🏰 屬性監獄</a>

      <div class="mob-section">玩家服務</div>
      <a class="mob-link mob-sub" href="${r}pages/sponsor.html">💎 贊助說明</a>
      <a class="mob-link mob-sub" href="${r}pages/faq.html">❓ 常見問題</a>
      <a class="mob-link mob-sub" href="${r}pages/promo.html">📜 推文說明</a>
      <a class="mob-link mob-sub" href="${r}pages/stream.html">🎥 直播說明</a>
      ${officialReady
        ? `<a class="mob-link" href="${C.lineOfficial}" target="_blank" rel="noopener">💬 加入官方 LINE</a>`
        : '<span class="mob-link is-disabled" aria-disabled="true">💬 官方 LINE 籌備中</span>'}
    </div>`;

    const slot = document.getElementById('header-slot');
    if (slot) slot.outerHTML = headerHTML;

    // 動態 title
    const h1 = document.querySelector('.page-hdr h1');
    const pageTitle = h1 ? h1.textContent.replace(/^[^\w\u4e00-\u9fff]+/, '') : '';
    document.title = (pageTitle ? pageTitle + ' · ' : '') + C.forumFullName;
  }

  /* 移除舊側欄 slot */
  function removeOldNav() {
    const slot = document.getElementById('nav-slot');
    if (slot) slot.remove();
  }

  /* 頁面標題裝飾線 */
  function addPageHdrLine() {
    const hdr = document.querySelector('.page-hdr');
    if (hdr && !hdr.querySelector('.page-hdr-line')) {
      const line = document.createElement('div');
      line.className = 'page-hdr-line';
      hdr.appendChild(line);
    }
  }

  function initDesktopDropdowns() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    nav.querySelectorAll('.nav-item > button.nav-link-top').forEach(button => {
      button.setAttribute('type', 'button');
      button.setAttribute('aria-expanded', 'false');

      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const item = button.closest('.nav-item');
        if (!item) return;
        const willOpen = !item.classList.contains('open');

        nav.querySelectorAll('.nav-item.open').forEach(openItem => {
          openItem.classList.remove('open');
          const openButton = openItem.querySelector('button.nav-link-top');
          if (openButton) openButton.setAttribute('aria-expanded', 'false');
        });

        if (willOpen) {
          item.classList.add('open');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', () => closeDesktopDropdowns(nav));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeDesktopDropdowns(nav);
    });
  }

  function closeDesktopDropdowns(nav) {
    nav.querySelectorAll('.nav-item.open').forEach(item => {
      item.classList.remove('open');
      const button = item.querySelector('button.nav-link-top');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  }

  /* ================================================================
     FOOTER
  ================================================================ */
  function buildFooter() {
    const C = FORUM_CONFIG;
    const r = root();
    const officialReady = serviceLinkReady(C.lineOfficial);
    const communityLink = serviceLinkReady(C.lineCommunity) && C.lineCommunity !== C.lineOfficial ? C.lineCommunity : '';
    const footerHTML = `
    <footer id="site-footer">
      <div class="footer-inner">
        <div>
          <div class="footer-col-title">⚔️ ${C.forumName}</div>
          <ul class="footer-links">
            <li><span style="color:var(--text-muted);font-size:12px;">${C.forumSlogan || '胤天天堂'}</span></li>
            ${communityLink ? `<li><a href="${communityLink}" target="_blank" rel="noopener">💬 ${escapeHTML(C.lineCommunityName || '玩家討論區')}</a></li>` : ''}
            ${officialReady
              ? `<li><a href="${C.lineOfficial}" target="_blank" rel="noopener">LINE 官方客服</a></li>`
              : '<li><span class="service-pending">LINE 專屬帳號籌備中</span></li>'}
            ${officialReady
              ? `<li><a href="${C.lineOfficial}" target="_blank" rel="noopener">💬 加入官方 LINE</a></li>`
              : '<li><span class="service-pending">官方 LINE 籌備中</span></li>'}
          </ul>
        </div>
        <div>
          <div class="footer-col-title">遊戲資訊</div>
          <ul class="footer-links">
            <li><a href="${r}pages/search.html">全站搜尋</a></li>
            <li><a href="${r}pages/game-database.html">遊戲資料庫</a></li>
            <li><a href="${r}pages/download.html">遊戲下載</a></li>
            <li><a href="${r}pages/version.html">版本設定</a></li>
            <li><a href="${r}pages/updates.html">更新歷程</a></li>
            <li><a href="${r}pages/events.html">活動公告</a></li>
            <li><a href="${r}pages/faq.html">常見問題</a></li>
            <li><a href="${r}pages/boss-schedule.html">BOSS時刻表</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-col-title">規章與服務</div>
          <ul class="footer-links">
            <li><a href="${r}pages/disclaimer.html">免責聲明</a></li>
            <li><a href="${r}pages/rules.html">遊戲管理規章</a></li>
            <li><a href="${r}pages/anti-cheat.html">外掛懲處條例</a></li>
            <li><a href="${r}pages/sponsor.html">贊助說明</a></li>
            <li><a href="${r}pages/promo.html">推文說明</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-copy">
        © ${new Date().getFullYear()} ${C.forumFullName} · 本站為私人架設，與 NC 公司無關 · 遊戲資產版權歸原著作權人所有
      </div>
      <div class="footer-bottom-promo">
        <div class="footer-designer-credit">阿柴美工 LINE @323rffot 美工找我~</div>
        <a class="footer-gamex-link" href="https://www.gamex123.com/lineage.html" target="_blank" rel="noopener" aria-label="私服123">
          <img src="${r}assets/media/private-server-123.gif" alt="私服123">
        </a>
      </div>
    </footer>`;

    const slot = document.getElementById('footer-slot');
    if (slot) slot.outerHTML = footerHTML;
  }

  /* ================================================================
     浮動快捷視窗
  ================================================================ */
  function buildFloatingPanel() {
    const C = FORUM_CONFIG;
    if (!C.floatingPanel || !C.floatingPanel.enabled) return;
    const r = root();
    const links = C.floatingPanel.links || [];
    const html = `
    <div id="floating-panel">
      <button class="float-toggle" onclick="forumToggleFloat()" aria-label="快捷連結">
        <span>快捷</span>
      </button>
      <div class="float-box">
        <div class="float-head">
          <div>
            <strong>${escapeHTML(C.floatingPanel.title || '快捷連結')}</strong>
            <span>${escapeHTML(C.floatingPanel.note || '')}</span>
          </div>
          <button onclick="forumToggleFloat()" aria-label="收合">×</button>
        </div>
        <div class="float-links">
          ${links.map(link => {
            const url = resolveLink(link.url || '#', r);
            const external = /^https?:\/\//.test(url);
            return `<a class="float-link ${escapeHTML(link.style || 'dark')}" href="${url}" ${external ? 'target="_blank" rel="noopener"' : ''}>
              <span>${escapeHTML(link.icon || 'GO')}</span>
              <strong>${escapeHTML(link.label || '連結')}</strong>
            </a>`;
          }).join('')}
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  function buildSideBanners() {
    const C = FORUM_CONFIG;
    if (!C.sideBanners || !C.sideBanners.enabled) return;
    const r = root();
    const items = [
      { side: 'left', ...(C.sideBanners.left || {}) },
      { side: 'right', ...(C.sideBanners.right || {}) },
    ].filter(item => item.image);
    if (!items.length) return;

    const html = `
    <div id="side-floating-banners" aria-label="側邊快捷連結">
      ${items.map(item => {
        const image = resolveLink(item.image, r);
        const alt = escapeHTML(item.alt || '');
        const content = `<img src="${escapeHTML(image)}" alt="${alt}" loading="lazy">`;
        if (!item.url) {
          return `<div class="side-float-banner ${escapeHTML(item.side)} is-disabled" aria-label="${alt}">${content}</div>`;
        }
        const url = resolveLink(item.url, r);
        const external = /^https?:\/\//.test(url);
        return `<a class="side-float-banner ${escapeHTML(item.side)}" href="${escapeHTML(url)}" ${external ? 'target="_blank" rel="noopener"' : ''} aria-label="${alt}">${content}</a>`;
      }).join('')}
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
  }

  function buildMusicPlayer() {
    const C = FORUM_CONFIG;
    if (!C.musicPlayer || !C.musicPlayer.enabled) return;
    const cfg = C.musicPlayer;
    const r = root();
    const title = escapeHTML(cfg.title || '音樂');

    // 整理歌曲清單：過濾沒有 url 的項目，並把路徑解析成正確的相對／絕對網址
    const tracks = (Array.isArray(cfg.tracks) ? cfg.tracks : [])
      .filter(function (t) { return t && t.url; })
      .map(function (t) {
        return {
          title: t.title || '未命名曲目',
          artist: t.artist || '',
          url: resolveLink(t.url, r),
          cover: t.cover ? resolveLink(t.cover, r) : '',
        };
      });

    const ICON = {
      prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 6h2v12H7zm3.5 6 8.5 6V6z"/></svg>',
      next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6h2v12h-2zM5 6l8.5 6L5 18z"/></svg>',
      play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
      shuffle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.41 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.05-3.13z"/></svg>',
    };

    let bodyHtml;
    if (tracks.length) {
      const listHtml = tracks.map(function (t, i) {
        return '<li class="music-item" data-i="' + i + '">' +
                 '<span class="music-item-idx">' + (i + 1) + '</span>' +
                 '<span class="music-item-name">' + escapeHTML(t.title) + '</span>' +
                 '<span class="music-item-artist">' + escapeHTML(t.artist) + '</span>' +
               '</li>';
      }).join('');
      bodyHtml =
        '<div class="music-now">' +
          '<div class="music-cover" data-cover><span>♪</span></div>' +
          '<div class="music-meta">' +
            '<div class="music-track-title" data-title>—</div>' +
            '<div class="music-track-artist" data-artist></div>' +
          '</div>' +
        '</div>' +
        '<div class="music-progress">' +
          '<span class="music-time" data-cur>00:00</span>' +
          '<input type="range" class="music-seek" data-seek min="0" max="1000" value="0" aria-label="播放進度">' +
          '<span class="music-time" data-dur>00:00</span>' +
        '</div>' +
        '<div class="music-controls">' +
          '<button type="button" class="music-btn" data-prev aria-label="上一首">' + ICON.prev + '</button>' +
          '<button type="button" class="music-btn music-btn-play" data-play aria-label="播放／暫停">' + ICON.play + '</button>' +
          '<button type="button" class="music-btn" data-next aria-label="下一首">' + ICON.next + '</button>' +
          '<button type="button" class="music-btn music-btn-mode" data-shuffle aria-label="隨機播放" title="隨機播放">' + ICON.shuffle + '</button>' +
          '<div class="music-volume"><input type="range" class="music-vol" data-vol min="0" max="1" step="0.01" value="0.7" aria-label="音量"></div>' +
        '</div>' +
        '<ul class="music-list" data-list>' + listHtml + '</ul>';
    } else {
      bodyHtml =
        '<div class="music-empty">尚未加入歌曲。<br>' +
        '請把 MP3 放進 <code>assets/media/music/</code>，<br>' +
        '再到 <code>config.js</code> 的 <code>musicPlayer.tracks</code> 列出。</div>';
    }

    const html =
      '<div id="site-music-player" class="is-compact" aria-label="' + title + '">' +
        '<button class="music-toggle" type="button" onclick="forumToggleMusic()" aria-label="開啟音樂播放器" title="' + title + '"><span>♫</span></button>' +
        '<div class="music-panel">' +
          '<div class="music-head"><strong>' + title + '</strong>' +
            '<button type="button" onclick="forumToggleMusic()" aria-label="收合音樂播放器">×</button></div>' +
          '<div class="music-body">' + bodyHtml + '</div>' +
          '<audio data-audio preload="metadata"></audio>' +
        '</div>' +
      '</div>';
    document.body.insertAdjacentHTML('beforeend', html);

    if (tracks.length) initMusicEngine(cfg, tracks);
  }

  // 自架 MP3 播放引擎：播放／暫停、上下首、進度、音量、隨機、清單循環、跨頁續播
  function initMusicEngine(cfg, tracks) {
    const player = document.getElementById('site-music-player');
    if (!player) return;
    const audio = player.querySelector('[data-audio]');
    const sel = function (s) { return player.querySelector(s); };
    const coverEl = sel('[data-cover]');
    const titleEl = sel('[data-title]');
    const artistEl = sel('[data-artist]');
    const curEl = sel('[data-cur]');
    const durEl = sel('[data-dur]');
    const seekEl = sel('[data-seek]');
    const playBtn = sel('[data-play]');
    const prevBtn = sel('[data-prev]');
    const nextBtn = sel('[data-next]');
    const shuffleBtn = sel('[data-shuffle]');
    const volEl = sel('[data-vol]');
    const listItems = Array.prototype.slice.call(player.querySelectorAll('.music-item'));

    const PLAY_ICON = playBtn.innerHTML;
    const PAUSE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
    const STORE_KEY = 'site-music-state';

    let shuffle = cfg.shuffle !== false;
    const loopAll = cfg.loop !== false;
    let order = [];
    let pos = 0;
    let seeking = false;
    let userPaused = false;   // 只有「使用者主動按暫停」才為 true；首頁自動靜音、瀏覽器擋自動播放都不算
    let errCount = 0;
    let saveTimer = 0;

    function buildOrder(keepTrack) {
      order = tracks.map(function (_, i) { return i; });
      if (shuffle) {
        for (let i = order.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const tmp = order[i]; order[i] = order[j]; order[j] = tmp;
        }
      }
      pos = 0;
      if (typeof keepTrack === 'number') {
        const at = order.indexOf(keepTrack);
        if (at >= 0) pos = at;
      }
    }

    function fmt(t) {
      if (!isFinite(t) || t < 0) t = 0;
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    function highlight() {
      const ti = order[pos];
      listItems.forEach(function (li) {
        li.classList.toggle('is-playing', Number(li.dataset.i) === ti);
      });
    }

    function loadTrack(autoplayThis) {
      const t = tracks[order[pos]];
      if (!t) return;
      audio.src = t.url;
      titleEl.textContent = t.title;
      artistEl.textContent = t.artist;
      if (t.cover) {
        coverEl.style.backgroundImage = 'url("' + t.cover + '")';
        coverEl.classList.add('has-cover');
      } else {
        coverEl.style.backgroundImage = '';
        coverEl.classList.remove('has-cover');
      }
      curEl.textContent = '00:00';
      seekEl.value = 0;
      highlight();
      if (autoplayThis) play();
    }

    function play() { const p = audio.play(); if (p && p.catch) p.catch(function () {}); }
    function next() { pos = (pos + 1) % order.length; loadTrack(true); }
    function prev() {
      if (audio.currentTime > 3) { audio.currentTime = 0; return; }
      pos = (pos - 1 + order.length) % order.length;
      loadTrack(true);
    }

    function saveState() {
      try {
        sessionStorage.setItem(STORE_KEY, JSON.stringify({
          track: order[pos],
          time: audio.currentTime,
          vol: audio.volume,
          paused: userPaused,
          shuffle: shuffle,
        }));
      } catch (e) {}
    }
    function saveStateThrottled() {
      if (saveTimer) return;
      saveTimer = setTimeout(function () { saveTimer = 0; saveState(); }, 1000);
    }

    playBtn.addEventListener('click', function () {
      if (audio.paused) { userPaused = false; play(); }
      else { userPaused = true; audio.pause(); }
    });
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    shuffleBtn.addEventListener('click', function () {
      shuffle = !shuffle;
      shuffleBtn.classList.toggle('is-active', shuffle);
      buildOrder(order[pos]);
      highlight();
      saveState();
    });
    volEl.addEventListener('input', function () { audio.volume = Number(volEl.value); saveState(); });
    listItems.forEach(function (li) {
      li.addEventListener('click', function () {
        const at = order.indexOf(Number(li.dataset.i));
        pos = at >= 0 ? at : 0;
        loadTrack(true);
      });
    });

    audio.addEventListener('play', function () { playBtn.innerHTML = PAUSE_ICON; player.classList.add('is-playing'); });
    audio.addEventListener('pause', function () { playBtn.innerHTML = PLAY_ICON; player.classList.remove('is-playing'); });
    audio.addEventListener('playing', function () { errCount = 0; });
    audio.addEventListener('ended', function () {
      if (!loopAll && pos === order.length - 1) return;
      next();
    });
    audio.addEventListener('error', function () {
      // 此首載入失敗（檔名錯誤或格式不支援）→ 跳下一首；全部失敗則停止避免無限迴圈
      errCount++;
      if (errCount >= tracks.length) return;
      next();
    });
    audio.addEventListener('loadedmetadata', function () { durEl.textContent = fmt(audio.duration); });
    audio.addEventListener('timeupdate', function () {
      if (!seeking) {
        curEl.textContent = fmt(audio.currentTime);
        seekEl.value = audio.duration ? (audio.currentTime / audio.duration) * 1000 : 0;
      }
      saveStateThrottled();
    });
    seekEl.addEventListener('input', function () {
      seeking = true;
      if (audio.duration) curEl.textContent = fmt((seekEl.value / 1000) * audio.duration);
    });
    seekEl.addEventListener('change', function () {
      if (audio.duration) audio.currentTime = (seekEl.value / 1000) * audio.duration;
      seeking = false;
    });

    // 還原上次狀態（同一個瀏覽分頁內換頁時，音樂可接續播放）
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null'); } catch (e) {}

    let initVol = (typeof cfg.volume === 'number') ? cfg.volume : 0.7;
    if (saved && typeof saved.vol === 'number') initVol = saved.vol;
    initVol = Math.min(1, Math.max(0, initVol));
    audio.volume = initVol;
    volEl.value = initVol;

    if (saved && typeof saved.shuffle === 'boolean') shuffle = saved.shuffle;
    shuffleBtn.classList.toggle('is-active', shuffle);

    buildOrder(saved && typeof saved.track === 'number' ? saved.track : undefined);
    loadTrack(false);

    if (saved && typeof saved.time === 'number' && saved.time > 0) {
      const restore = function () {
        try { audio.currentTime = saved.time; } catch (e) {}
        audio.removeEventListener('loadedmetadata', restore);
      };
      audio.addEventListener('loadedmetadata', restore);
    }

    // 自動播放：先嘗試，被瀏覽器擋下時，改在使用者第一次「在播放器以外」互動時開始。
    // 播放器內的按鈕（播放/暫停等）自己管控，必須排除，否則點暫停會被這裡又播回去。
    const wantPlay = cfg.autoplay !== false && !(saved && saved.paused === true);
    if (wantPlay) {
      play();
      const events = ['pointerdown', 'keydown', 'touchstart'];
      const kick = function (e) {
        if (e && e.target && player.contains(e.target)) return; // 播放器內的操作不在此處理
        detach();
        if (!userPaused) play();                                // 已被手動暫停就不自動播回
      };
      function detach() { events.forEach(function (ev) { window.removeEventListener(ev, kick, true); }); }
      events.forEach(function (ev) { window.addEventListener(ev, kick, { capture: true, passive: true }); });
      audio.addEventListener('playing', detach, { once: true });
    }

    window.addEventListener('pagehide', saveState);
  }

  function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function resolveLink(url, r) {
    if (/^(https?:|mailto:|tel:|#)/.test(url)) return url;
    return r + url.replace(/^\.\//, '');
  }

  function enhanceArticleTables() {
    const selector = '.content-embed, #js-download-content, .cms-rich';
    const updateWrap = function (wrap) {
      const check = function () {
        wrap.classList.toggle('is-scrollable', wrap.scrollWidth > wrap.clientWidth + 2);
      };
      requestAnimationFrame(check);
      if (wrap.dataset.scrollEnhanced) return;
      wrap.dataset.scrollEnhanced = '1';
      if (window.ResizeObserver) {
        const observer = new ResizeObserver(check);
        observer.observe(wrap);
      } else {
        window.addEventListener('resize', check);
      }
    };
    const process = function () {
      document.querySelectorAll(selector).forEach(function (rootEl) {
        rootEl.querySelectorAll('table').forEach(function (table) {
          if (table.closest('.cms-table-wrap')) return;
          const wrap = document.createElement('div');
          wrap.className = 'cms-table-wrap';
          wrap.tabIndex = 0;
          wrap.setAttribute('aria-label', '可左右滑動查看完整表格');
          table.parentNode.insertBefore(wrap, table);
          wrap.appendChild(table);
        });
        rootEl.querySelectorAll('.cms-table-wrap').forEach(updateWrap);
      });
    };

    process();
    let pending = false;
    const observer = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        process();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ================================================================
     彈出公告
  ================================================================ */
  function initPopup() {
    const C = FORUM_CONFIG;
    if (!C.popup || !C.popup.enabled) return;
    if (C.popup.showOnce && sessionStorage.getItem('popup-shown')) return;

    const overlay = document.createElement('div');
    overlay.id = 'popup-overlay';
    overlay.className = 'open';
    overlay.innerHTML = `
      <div class="popup-box" onclick="event.stopPropagation()">
        <button class="popup-close" onclick="forumClosePopup()">✕</button>
        <div class="popup-title">${C.popup.title}</div>
        <div class="popup-content">${C.popup.content}</div>
        <button class="popup-btn" onclick="forumClosePopup()">我已閱讀，關閉公告</button>
      </div>`;
    overlay.addEventListener('click', forumClosePopup);
    document.body.appendChild(overlay);

    if (C.popup.showOnce) sessionStorage.setItem('popup-shown', '1');
  }

  /* ================================================================
     導覽高亮
  ================================================================ */
  function highlightNav() {
    const path = window.location.pathname;
    document.querySelectorAll('#main-nav .nav-link-top[href], .nav-dropdown a').forEach(a => {
      if (a.getAttribute('href') && path.endsWith(a.getAttribute('href').replace(/^.*\//, ''))) {
        a.classList.add('active');
      }
    });
    document.querySelectorAll('#mobile-menu .mob-link').forEach(a => {
      if (a.getAttribute('href') && path.endsWith(a.getAttribute('href').replace(/^.*\//, ''))) {
        a.style.color = 'var(--gold)';
      }
    });
  }

  // 啟動
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* ================================================================
   全域函式
================================================================ */
function forumToggleMobile() {
  const m = document.getElementById('mobile-menu');
  if (m) m.classList.toggle('open');
}
function forumClosePopup() {
  const o = document.getElementById('popup-overlay');
  if (o) o.classList.remove('open');
}
function forumToggleFloat() {
  const p = document.getElementById('floating-panel');
  if (!p) return;
  p.classList.toggle('open');
  if (p.classList.contains('open')) {
    const m = document.getElementById('site-music-player');
    if (m) m.classList.remove('is-open');   // 開快捷時收起音樂面板，避免左下角重疊
  }
}
function forumToggleMusic() {
  const p = document.getElementById('site-music-player');
  if (!p) return;
  p.classList.toggle('is-open');
  if (p.classList.contains('is-open')) {
    const f = document.getElementById('floating-panel');
    if (f) f.classList.remove('open');       // 開音樂時收起快捷面板
  }
}
