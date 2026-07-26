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
})();
