(function () {
  'use strict';

  const META = {
    weapons: {
      title: '武器庫查詢',
      icon: '⚔️',
      intro: '可依名稱、類別、材質與能力快速搜尋武器資料。',
      filters: ['類別', '材質'],
      primary: ['傷害', '安定值', '攻擊成功', '額外攻擊點數', '材質', '重量', '使用職業'],
    },
    armors: {
      title: '防具庫查詢',
      icon: '🛡️',
      intro: '整理防具、防禦、材質、重量與穿戴限制等資料。',
      filters: ['類別', '材質'],
      primary: ['防禦', '安定值', '材質', '重量', '使用職業', '可否交易'],
    },
    items: {
      title: '道具列表',
      icon: '🎒',
      intro: '集中查找消耗品、材料、卷軸與一般道具。',
      filters: ['類別', '材質'],
      primary: ['類別', '材質', '重量', '可否交易', '可否刪除'],
    },
    mobs: {
      title: '怪物列表',
      icon: '👹',
      intro: '查詢怪物等級、防禦、血量、經驗、出現地點與掉落資訊。',
      filters: ['等級', '特殊屬性', '怪物體型', '懼怕屬性'],
      primary: ['等級', '防禦', '體力', '魔力', '經驗值', '魔法防禦', '怪物體型', '懼怕屬性', '主動攻擊'],
    },
  };

  const PAGE_SIZE = 240;

  function root() {
    const path = window.location.pathname;
    return (path.includes('/pages/') || path.includes('/admin/')) ? '../' : './';
  }

  function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function resolveAsset(url) {
    if (!url) return '';
    if (/^(https?:|data:|#)/.test(url)) return url;
    return root() + String(url).replace(/^\.\//, '');
  }

  function fetchJson(url) {
    return fetch(url, { cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error(url + ' load failed');
      return res.json();
    });
  }

  function itemText(item) {
    const fields = item.fields || {};
    const attrs = item.attributes || {};
    return normalize([item.name].concat(Object.values(fields), Object.values(attrs)).filter(Boolean).join(' '));
  }

  function uniqueOptions(items, field) {
    const values = new Set();
    items.forEach(function (item) {
      const value = (item.fields && item.fields[field]) || (item.attributes && item.attributes[field]) || '';
      if (value && String(value).length <= 24) values.add(value);
    });
    return Array.from(values).sort(function (a, b) {
      const na = Number(a);
      const nb = Number(b);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
      return String(a).localeCompare(String(b), 'zh-Hant');
    });
  }

  function fieldValue(item, field) {
    return (item.fields && item.fields[field]) || (item.attributes && item.attributes[field]) || '';
  }

  function summaryFields(item, fields) {
    return fields.map(function (field) {
      const value = fieldValue(item, field);
      return value ? '<span><b>' + escapeHTML(field) + '</b>' + escapeHTML(value) + '</span>' : '';
    }).filter(Boolean).join('');
  }

  function iconHTML(item, fallback) {
    if (item.icon) {
      return '<img src="' + escapeHTML(resolveAsset(item.icon)) + '" alt="' + escapeHTML(item.name || '') + '" loading="lazy">';
    }
    return '<span>' + escapeHTML(fallback || '✦') + '</span>';
  }

  function renderIndex(shell) {
    fetchJson(root() + 'data/game-db/manifest.json').then(function (manifest) {
      const cards = Object.keys(META).map(function (kind) {
        const info = manifest.collections && manifest.collections[kind] ? manifest.collections[kind] : {};
        const meta = META[kind];
        return '<a class="game-db-home-card" href="' + escapeHTML(root() + String(info.page || ('pages/game-database.html?type=' + kind)).replace(/^\.\//, '')) + '">' +
          '<span class="game-db-home-icon">' + escapeHTML(meta.icon) + '</span>' +
          '<strong>' + escapeHTML(meta.title) + '</strong>' +
          '<em>' + Number(info.count || 0).toLocaleString() + ' 筆資料</em>' +
          '<p>' + escapeHTML(meta.intro) + '</p>' +
        '</a>';
      }).join('');
      shell.innerHTML = '<div class="game-db-home-grid">' + cards + '</div>';
    }).catch(function () {
      shell.innerHTML = '<div class="notice red">資料庫索引讀取失敗，請稍後重新整理頁面。</div>';
    });
  }

  function renderCollection(shell, data) {
    const kind = data.kind;
    const meta = META[kind] || { title: data.label || '資料庫', icon: '✦', filters: [], primary: data.summaryFields || [] };
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    let visibleLimit = PAGE_SIZE;

    shell.innerHTML = '<div class="game-db-toolbar">' +
      '<div class="game-db-title-block">' +
        '<span>' + escapeHTML(meta.icon) + '</span>' +
        '<div><strong>' + escapeHTML(meta.title) + '</strong><p>' + escapeHTML(meta.intro || '') + '</p></div>' +
      '</div>' +
      '<div class="game-db-controls">' +
        '<input class="game-db-search-input" type="search" placeholder="搜尋名稱、類別、掉落、能力..." value="' + escapeHTML(initialQuery) + '">' +
        '<div class="game-db-filter-row"></div>' +
      '</div>' +
      '<div class="game-db-count"></div>' +
    '</div>' +
    '<div class="game-db-grid"></div>' +
    '<div class="game-db-more-wrap"><button class="game-db-more" type="button">顯示更多</button></div>' +
    '<div class="game-db-detail-overlay" hidden></div>';

    const input = shell.querySelector('.game-db-search-input');
    const filterRow = shell.querySelector('.game-db-filter-row');
    const grid = shell.querySelector('.game-db-grid');
    const count = shell.querySelector('.game-db-count');
    const moreButton = shell.querySelector('.game-db-more');
    const overlay = shell.querySelector('.game-db-detail-overlay');

    filterRow.innerHTML = (meta.filters || []).map(function (field) {
      const options = uniqueOptions(data.items || [], field).map(function (value) {
        return '<option value="' + escapeHTML(value) + '">' + escapeHTML(value) + '</option>';
      }).join('');
      return '<label><span>' + escapeHTML(field) + '</span><select data-game-db-filter="' + escapeHTML(field) + '">' +
        '<option value="">全部</option>' + options +
      '</select></label>';
    }).join('');

    function filters() {
      return Array.from(shell.querySelectorAll('[data-game-db-filter]')).map(function (select) {
        return { field: select.getAttribute('data-game-db-filter'), value: select.value };
      }).filter(function (item) { return item.value; });
    }

    function matches(item, query, activeFilters) {
      if (query && !itemText(item).includes(normalize(query))) return false;
      return activeFilters.every(function (filter) {
        return String(fieldValue(item, filter.field)) === filter.value;
      });
    }

    function card(item, index) {
      const fields = meta.primary || data.summaryFields || [];
      return '<button class="game-db-card" type="button" data-game-db-index="' + index + '">' +
        '<div class="game-db-card-icon">' + iconHTML(item, meta.icon) + '</div>' +
        '<div class="game-db-card-body">' +
          '<h2>' + escapeHTML(item.name || '未命名') + '</h2>' +
          '<div class="game-db-card-meta">' + summaryFields(item, fields.slice(0, 4)) + '</div>' +
        '</div>' +
      '</button>';
    }

    function render() {
      const query = input.value.trim();
      const activeFilters = filters();
      const all = data.items || [];
      const matchesList = all.map(function (item, index) {
        return { item: item, index: index };
      }).filter(function (entry) {
        return matches(entry.item, query, activeFilters);
      });
      const shown = matchesList.slice(0, visibleLimit);

      count.textContent = '共 ' + all.length.toLocaleString() + ' 筆，目前顯示 ' + shown.length.toLocaleString() + ' / ' + matchesList.length.toLocaleString() + ' 筆';
      grid.innerHTML = shown.map(function (entry) { return card(entry.item, entry.index); }).join('');
      moreButton.hidden = shown.length >= matchesList.length;

      const nextUrl = query ? '?q=' + encodeURIComponent(query) : window.location.pathname;
      window.history.replaceState(null, '', nextUrl);
    }

    function renderTable(table) {
      if (!table || !Array.isArray(table.rows) || !table.rows.length) return '';
      const headers = Array.isArray(table.headers) ? table.headers : [];
      return '<section class="game-db-detail-table">' +
        '<h3>' + escapeHTML(table.title || '詳細資料') + '</h3>' +
        '<div><table>' +
          (headers.length ? '<thead><tr>' + headers.map(function (head) { return '<th>' + escapeHTML(head) + '</th>'; }).join('') + '</tr></thead>' : '') +
          '<tbody>' + table.rows.map(function (row) {
            return '<tr>' + row.map(function (cell) { return '<td>' + escapeHTML(cell) + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody>' +
        '</table></div>' +
      '</section>';
    }

    function openDetail(item) {
      const attrs = item.attributes || item.fields || {};
      const attrHtml = Object.keys(attrs).filter(function (key) {
        return attrs[key] !== '' && key !== '名稱';
      }).map(function (key) {
        return '<div><span>' + escapeHTML(key) + '</span><strong>' + escapeHTML(attrs[key]) + '</strong></div>';
      }).join('');
      const tables = (item.tables || []).map(renderTable).filter(Boolean).join('');

      overlay.hidden = false;
      overlay.innerHTML = '<div class="game-db-detail" role="dialog" aria-modal="true">' +
        '<button class="game-db-detail-close" type="button" aria-label="關閉">×</button>' +
        '<div class="game-db-detail-head">' +
          '<div class="game-db-detail-icon">' + iconHTML(item, meta.icon) + '</div>' +
          '<div><span>' + escapeHTML(meta.title) + '</span><h2>' + escapeHTML(item.name || '未命名') + '</h2></div>' +
        '</div>' +
        '<div class="game-db-attr-grid">' + attrHtml + '</div>' +
        (tables || '<div class="notice gold">此項目目前沒有額外表格資料。</div>') +
      '</div>';
      document.body.style.overflow = 'hidden';
    }

    function closeDetail() {
      overlay.hidden = true;
      overlay.innerHTML = '';
      document.body.style.overflow = '';
    }

    input.addEventListener('input', function () {
      visibleLimit = PAGE_SIZE;
      render();
    });
    filterRow.addEventListener('change', function () {
      visibleLimit = PAGE_SIZE;
      render();
    });
    moreButton.addEventListener('click', function () {
      visibleLimit += PAGE_SIZE;
      render();
    });
    grid.addEventListener('click', function (event) {
      const button = event.target.closest('[data-game-db-index]');
      if (!button) return;
      const item = data.items[Number(button.getAttribute('data-game-db-index'))];
      if (item) openDetail(item);
    });
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay || event.target.closest('.game-db-detail-close')) closeDetail();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !overlay.hidden) closeDetail();
    });

    render();
  }

  function init() {
    const shell = document.querySelector('[data-game-db-kind]');
    if (!shell) return;
    const kind = shell.getAttribute('data-game-db-kind') || 'index';
    const type = new URLSearchParams(window.location.search).get('type');
    const activeKind = type || kind;

    if (activeKind === 'index') {
      renderIndex(shell);
      return;
    }

    shell.innerHTML = '<div class="game-db-loading">資料庫載入中...</div>';
    fetchJson(root() + 'data/game-db/' + activeKind + '.json').then(function (data) {
      renderCollection(shell, data);
    }).catch(function () {
      shell.innerHTML = '<div class="notice red">資料庫讀取失敗，請稍後重新整理頁面。</div>';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
