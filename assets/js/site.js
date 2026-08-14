(() => {
  const config = window.YINTIAN_CONFIG || {};
  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node && value) node.textContent = value;
  };

  setText("[data-opening-date]", config.openingDate);
  setText("[data-version]", config.version);

  document.querySelectorAll("[data-line-link]").forEach((link) => {
    link.href = config.lineUrl || "#";
    if (!config.lineUrl || config.lineUrl === "#" || config.lineUrl === "#service-pending") {
      link.classList.add("is-disabled");
      link.setAttribute("aria-disabled", "true");
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.alert("胤天專屬 LINE 正在籌備，正式上線前會更新入口。");
      });
    }
  });

  /* 左右浮動快捷：連結一律以 config.js 為準，未設定就隱藏 */
  [
    ["[data-sponsor-link]", config.sponsorUrl],
    ["[data-promo-report-link]", config.promoReportUrl],
  ].forEach(([selector, url]) => {
    document.querySelectorAll(selector).forEach((link) => {
      if (url && url !== "#" && url !== "#service-pending") {
        link.href = url;
      } else {
        link.remove();
      }
    });
  });

  document.querySelectorAll("[data-community-link]").forEach((link) => {
    const url = config.communityUrl;
    if (url && url !== "#" && url !== "#service-pending") {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
    } else {
      link.href = config.lineUrl || "#";
    }
  });

  // 職業卡：滑鼠移入播放動態展示，移出歸零（手機無 hover，維持靜態縮圖）
  document.querySelectorAll(".class-card").forEach((card) => {
    const video = card.querySelector("video");
    if (!video) return;
    card.addEventListener("mouseenter", () => {
      const played = video.play();
      if (played && played.catch) played.catch(() => {});
    });
    card.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  toggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open") ?? false;
    toggle.setAttribute("aria-expanded", String(open));
  });

  /* 首頁活動公告列表：以 data/posts.json 的「活動」分類為準，
     HTML 內已有一份靜態備援，抓不到資料時維持原樣。 */
  const eventFeatured = document.getElementById("event-featured");
  const eventList = document.getElementById("event-list");
  if (eventFeatured && eventList) {
    const escapeHTML = (value) =>
      String(value ?? "").replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const shortDate = (value) => {
      const parts = String(value || "").split("/");
      return parts.length === 3 ? `${parts[1]}/${parts[2]}` : String(value || "");
    };
    const stripEmoji = (value) => String(value || "").replace(/^[^一-龥A-Za-z0-9]+/, "").trim();
    const badgeOf = (post) => {
      const head = stripEmoji(post.title).split("──")[0].trim();
      return head || post.category || "活動";
    };
    const titleOf = (post) => stripEmoji(post.title).replace(/\s*──\s*/, " ── ");

    fetch("data/posts.json", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("posts not found"))))
      .then((data) => {
        const events = (data.posts || [])
          .filter((post) => post.category === "活動" && post.published !== false)
          .sort((a, b) => {
            const endedA = a.status === "已結束" ? 1 : 0;
            const endedB = b.status === "已結束" ? 1 : 0;
            if (endedA !== endedB) return endedA - endedB;
            if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
            return String(b.date || "").localeCompare(String(a.date || ""));
          });
        if (!events.length) return;

        const [first, ...rest] = events;
        const setSlot = (attr, value) => {
          const node = eventFeatured.querySelector(`[${attr}]`);
          if (node) node.textContent = value;
        };
        setSlot("data-event-badge", badgeOf(first));
        setSlot("data-event-title", titleOf(first));
        setSlot("data-event-excerpt", first.excerpt || "");

        eventList.innerHTML =
          rest.slice(0, 3).map((post) =>
            `<a class="news-item" href="pages/events.html"><time>${escapeHTML(shortDate(post.date))}</time>` +
            `<strong>${escapeHTML(titleOf(post))}</strong></a>`
          ).join("") +
          '<a class="news-item" href="pages/events.html"><time>全部</time><strong>查看所有活動公告 →</strong></a>';
      })
      .catch(() => {});
  }
})();
