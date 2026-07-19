(function () {
  'use strict';

  function root() {
    const path = window.location.pathname;
    return (path.includes('/pages/') || path.includes('/admin/')) ? '../' : './';
  }

  function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function stripHTML(value) {
    return String(value || '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function splitTerms(query) {
    return normalize(query).split(/\s+/).filter(Boolean);
  }

  function sortPosts(posts) {
    return posts.slice().sort(function (a, b) {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
  }

  function resolveLink(url) {
    if (!url) return '#';
    if (/^(https?:|mailto:|tel:|#)/.test(url)) return url;
    return root() + String(url).replace(/^\.\//, '');
  }

  function recordText(record) {
    return [record.title, record.category, record.description, record.content, record.date]
      .filter(Boolean)
      .join(' ');
  }

  function scoreRecord(record, terms, query) {
    const title = normalize(record.title);
    const description = normalize(record.description);
    const content = normalize(record.content);
    const category = normalize(record.category);
    const combined = normalize([title, description, content, category].join(' '));

    if (!terms.every(function (term) { return combined.includes(term); })) return 0;

    let score = 0;
    terms.forEach(function (term) {
      if (title.includes(term)) score += 100;
      if (category.includes(term)) score += 42;
      if (description.includes(term)) score += 36;
      if (content.includes(term)) score += 12;
    });
    if (title.includes(query)) score += 90;
    if (description.includes(query)) score += 30;
    if (content.includes(query)) score += 18;
    return score;
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(value, terms) {
    let html = escapeHTML(value);
    terms
      .slice()
      .sort(function (a, b) { return b.length - a.length; })
      .forEach(function (term) {
        if (!term) return;
        const safeTerm = escapeHTML(term);
        html = html.replace(new RegExp(escapeRegExp(safeTerm), 'gi'), '<mark>$&</mark>');
      });
    return html;
  }

  function snippet(record, terms) {
    const source = String(record.description || record.content || record.title || '').replace(/\s+/g, ' ').trim();
    const lower = source.toLowerCase();
    let index = -1;
    terms.some(function (term) {
      index = lower.indexOf(term);
      return index >= 0;
    });
    if (index < 0) index = 0;
    const start = Math.max(0, index - 46);
    const end = Math.min(source.length, index + 118);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < source.length ? '...' : '';
    return highlight(prefix + source.slice(start, end) + suffix, terms);
  }

  function normalizeUrl(url) {
    return String(url || '').replace(/^\.\//, '');
  }

  const HIDDEN_PAGE_URLS = [
    'pages/equipment-dragon-seal.html',
  ];

  const HIDDEN_TEXT_PATTERNS = [
    /🐉\s*龍印魔石\s*專屬魔石升階/g,
    /、?龍印魔石強化卷/g,
    /龍印魔石/g,
  ];

  function cleanHiddenText(value) {
    return HIDDEN_TEXT_PATTERNS.reduce(function (text, pattern) {
      return text.replace(pattern, '');
    }, String(value || '')).replace(/\s+/g, ' ').trim();
  }

  function isHiddenRecord(record) {
    return HIDDEN_PAGE_URLS.includes(normalizeUrl(record.url));
  }

  function visibleRecord(record) {
    if (isHiddenRecord(record)) return null;
    return Object.assign({}, record, {
      title: cleanHiddenText(record.title),
      description: cleanHiddenText(record.description),
      content: cleanHiddenText(record.content),
    });
  }

  function pageRecords(data) {
    return (data.records || []).map(function (record) {
      return visibleRecord({
        type: 'page',
        title: record.title,
        category: record.category || '固定頁面',
        url: normalizeUrl(record.url),
        description: record.description,
        content: record.content,
      });
    }).filter(Boolean);
  }

  function postRecords(data) {
    return sortPosts((data.posts || []).filter(function (post) {
      return post.published !== false;
    })).map(function (post, index) {
      const content = stripHTML([post.body, post.customHtml, post.excerpt].filter(Boolean).join(' '));
      return {
        type: 'post',
        title: post.title || '未命名文章',
        category: post.category || '文章',
        date: post.date || '',
        url: 'pages/news.html#post-' + index,
        description: post.excerpt || content.slice(0, 120),
        content: content,
      };
    });
  }

  function homeRecords(data) {
    const records = [];
    (data.quickLinks || []).forEach(function (item) {
      if (item.visible === false) return;
      records.push({
        type: 'home',
        title: item.title || '快速目錄',
        category: '快速目錄',
        url: normalizeUrl(item.url || 'index.html#quick-title'),
        description: item.description || '',
        content: [item.title, item.description].filter(Boolean).join(' '),
      });
    });
    (data.serverCards || []).forEach(function (card) {
      const rows = (card.rows || []).map(function (row) {
        return [row.label, row.value].filter(Boolean).join(' ');
      }).join(' ');
      records.push({
        type: 'home',
        title: card.title || '伺服器資訊',
        category: '伺服器資訊',
        url: 'index.html#server-title',
        description: card.subtitle || '',
        content: [card.title, card.subtitle, rows].filter(Boolean).join(' '),
      });
    });
    (data.updates || []).forEach(function (item) {
      if (item.visible === false) return;
      records.push({
        type: 'home',
        title: item.title || item.content || '更新歷程',
        category: item.tag || '更新歷程',
        date: item.date || '',
        url: 'pages/updates.html',
        description: item.content || '',
        content: [item.date, item.tag, item.title, item.content].filter(Boolean).join(' '),
      });
    });
    return records;
  }

  function gameDbRecords(data) {
    return (data.records || []).map(function (record) {
      return {
        type: 'game-db',
        title: record.title || '遊戲資料',
        category: record.category || '遊戲資料庫',
        url: normalizeUrl(record.url),
        description: record.description || '',
        content: record.content || '',
      };
    });
  }

  function fetchJson(url) {
    return fetch(url, { cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error(url + ' load failed');
      return res.json();
    });
  }

  function init() {
    const input = document.getElementById('forum-search-input');
    const form = document.getElementById('forum-search-form');
    const results = document.getElementById('forum-search-results');
    const summary = document.getElementById('forum-search-summary');
    const chips = document.querySelectorAll('[data-search-chip]');
    if (!input || !form || !results || !summary) return;

    let records = [];
    let loaded = false;
    let timer = 0;

    function renderLoading() {
      summary.textContent = '搜尋索引載入中...';
      results.innerHTML = '<div class="search-empty">正在整理論壇內容，請稍候。</div>';
    }

    function renderIdle() {
      summary.textContent = '輸入關鍵字後即可搜尋全站內容';
      results.innerHTML = '<div class="search-empty">可以搜尋 BOSS、下載、防毒、娃娃、倍率、贊助、公告等關鍵字。</div>';
    }

    function renderError() {
      summary.textContent = '搜尋資料讀取失敗';
      results.innerHTML = '<div class="notice red">目前無法讀取搜尋索引，請稍後重新整理頁面。</div>';
    }

    function render() {
      if (!loaded) {
        renderLoading();
        return;
      }

      const query = input.value.trim();
      const normalizedQuery = normalize(query);
      const terms = splitTerms(query);
      if (!terms.length) {
        renderIdle();
        return;
      }

      const matches = records.map(function (record) {
        return { record: record, score: scoreRecord(record, terms, normalizedQuery) };
      }).filter(function (item) {
        return item.score > 0;
      }).sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return String(a.record.title || '').localeCompare(String(b.record.title || ''), 'zh-Hant');
      }).slice(0, 60);

      summary.textContent = matches.length ? '找到 ' + matches.length + ' 筆與「' + query + '」相關的內容' : '沒有找到「' + query + '」相關內容';
      if (!matches.length) {
        results.innerHTML = '<div class="search-empty">換個關鍵字試試，例如「BOSS」「下載」「防毒」「倍率」。</div>';
        return;
      }

      results.innerHTML = matches.map(function (item) {
        const record = item.record;
        const url = resolveLink(record.url);
        const external = /^https?:\/\//.test(url);
        return '<a class="search-result-card" href="' + escapeHTML(url) + '"' + (external ? ' target="_blank" rel="noopener"' : '') + '>' +
          '<div class="search-result-meta">' +
            '<span>' + escapeHTML(record.category || '內容') + '</span>' +
            (record.date ? '<span>' + escapeHTML(record.date) + '</span>' : '') +
          '</div>' +
          '<h2>' + highlight(record.title || '未命名內容', terms) + '</h2>' +
          '<p>' + snippet(record, terms) + '</p>' +
        '</a>';
      }).join('');
    }

    function scheduleRender() {
      clearTimeout(timer);
      timer = setTimeout(function () {
        const query = input.value.trim();
        const nextUrl = query ? '?q=' + encodeURIComponent(query) : window.location.pathname;
        window.history.replaceState(null, '', nextUrl);
        render();
      }, 120);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      render();
      input.focus();
    });
    input.addEventListener('input', scheduleRender);
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        input.value = chip.getAttribute('data-search-chip') || '';
        scheduleRender();
      });
    });

    const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
    input.value = initialQuery;
    renderLoading();

    Promise.allSettled([
      fetchJson(root() + 'data/search-index.json').then(pageRecords),
      fetchJson(root() + 'data/posts.json').then(postRecords),
      fetchJson(root() + 'data/home.json').then(homeRecords),
      fetchJson(root() + 'data/game-db/search-index.json').then(gameDbRecords),
    ]).then(function (parts) {
      records = parts.reduce(function (all, part) {
        return part.status === 'fulfilled' ? all.concat(part.value) : all;
      }, []).map(visibleRecord).filter(Boolean);
      loaded = true;
      render();
    }).catch(function () {
      loaded = true;
      renderError();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
