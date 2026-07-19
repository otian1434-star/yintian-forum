(function () {
  'use strict';

  function root() {
    return window.location.pathname.includes('/pages/') ? '../' : './';
  }

  function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function stripHTML(value) {
    return String(value || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  function sortPosts(posts) {
    return posts.slice().sort(function (a, b) {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
  }

  function loadPosts() {
    return fetch(root() + 'data/posts.json', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('posts not found');
        return res.json();
      })
      .then(function (data) {
        return sortPosts((data.posts || []).filter(function (post) {
          return post.published !== false;
        }));
      });
  }

  function loadHomeUpdates(fallbackUpdates) {
    if (Array.isArray(fallbackUpdates)) {
      return Promise.resolve(fallbackUpdates);
    }
    return fetch(root() + 'data/home.json', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('home data not found');
        return res.json();
      })
      .then(function (data) {
        return Array.isArray(data.updates) ? data.updates : [];
      })
      .catch(function () {
        if (typeof FORUM_CONFIG !== 'undefined' && Array.isArray(FORUM_CONFIG.updates)) {
          return FORUM_CONFIG.updates;
        }
        return [];
      });
  }

  function isUpdateCategory(category) {
    var value = String(category || '').trim();
    return value === '更新' || value === '更新歷程';
  }

  function updateText(item) {
    var title = String(item.title || '').trim();
    var content = String(item.content || '').trim();
    if (title && content && title !== content) return title + ' - ' + content;
    return content || title || '';
  }

  function sortUpdateItems(items) {
    return items.slice().sort(function (a, b) {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
  }

  function dedupeUpdateItems(items) {
    var seen = {};
    return items.filter(function (item) {
      var key = [
        item.date || '',
        item.tag || '',
        item.title || '',
        item.content || '',
      ].join('|');
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function withUpdateAnchors(items) {
    return items.map(function (item, index) {
      return Object.assign({}, item, { anchor: 'update-' + index });
    });
  }

  function loadUpdateItems(fallbackUpdates) {
    return Promise.allSettled([
      loadPosts(),
      loadHomeUpdates(fallbackUpdates),
    ]).then(function (parts) {
      var posts = parts[0].status === 'fulfilled' ? parts[0].value : [];
      var manualUpdates = parts[1].status === 'fulfilled' ? parts[1].value : [];
      var postItems = posts.map(function (post, index) {
        return { post: post, newsIndex: index };
      }).filter(function (item) {
        return isUpdateCategory(item.post.category);
      }).map(function (item) {
        var post = item.post;
        return {
          type: 'post',
          post: post,
          newsIndex: item.newsIndex,
          date: post.date || '',
          tag: post.category || '更新',
          title: post.title || '未命名更新',
          content: post.excerpt || '',
          pinned: post.pinned,
        };
      });
      var manualItems = (manualUpdates || []).filter(function (item) {
        return item && item.visible !== false;
      }).map(function (item) {
        return {
          type: 'manual',
          date: item.date || '',
          tag: item.tag || '更新',
          title: item.title || '',
          content: item.content || '',
          pinned: item.pinned,
        };
      });
      return withUpdateAnchors(dedupeUpdateItems(sortUpdateItems(postItems.concat(manualItems))));
    });
  }

  function renderAnnouncements(target, fallbackConfig) {
    loadPosts().then(function (posts) {
      if (!posts.length) throw new Error('empty posts');
      const tagMap = { '公告': 'tag-sys', '活動': 'tag-event', '更新': 'tag-update', '規章': 'tag-sys', '攻略': 'tag-new', '下載': 'tag-update', '制裁名單': 'tag-sys' };
      target.innerHTML = posts.slice(0, 4).map(function (post, index) {
        const tagClass = tagMap[post.category] || 'tag-event';
        return '<a class="ann-card" href="pages/news.html#post-' + index + '">' +
          '<div class="ann-card-meta">' +
          '<span class="ann-tag ' + tagClass + '">' + escapeHTML(post.category) + '</span>' +
          '<span class="ann-date">' + escapeHTML(post.date) + '</span>' +
          '</div>' +
          '<div class="ann-card-title">' + escapeHTML(post.title) + '</div>' +
          '<div class="ann-card-excerpt">' + escapeHTML(post.excerpt || stripHTML(post.body || post.customHtml || '')) + '</div>' +
          '<div class="ann-card-more">閱讀更多 →</div>' +
          '</a>';
      }).join('');
    }).catch(function () {
      renderFallbackAnnouncements(target, fallbackConfig);
    });
  }

  function renderFallbackAnnouncements(target, C) {
    if (C.updates && C.updates.length) {
      const tagMap = { '開服': 'tag-new', '活動': 'tag-event', '系統': 'tag-sys', '更新': 'tag-update' };
      target.innerHTML = C.updates.slice(0, 4).map(function (u) {
        const tagClass = tagMap[u.tag] || 'tag-event';
        return '<a class="ann-card" href="pages/updates.html">' +
          '<div class="ann-card-meta">' +
          '<span class="ann-tag ' + tagClass + '">' + escapeHTML(u.tag) + '</span>' +
          '<span class="ann-date">' + escapeHTML(u.date) + '</span>' +
          '</div>' +
          '<div class="ann-card-title">' + escapeHTML(u.title || String(u.content || '').substring(0, 30)) + '</div>' +
          '<div class="ann-card-excerpt">' + escapeHTML(u.content) + '</div>' +
          '<div class="ann-card-more">閱讀更多 →</div>' +
          '</a>';
      }).join('');
    } else {
      target.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:30px 0;letter-spacing:2px;">暫無公告</p>';
    }
  }

  function inlineMarkdown(value) {
    var text = escapeHTML(value);
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/\[TAG:([^\]]+)\]/g, function (_, tag) {
      var colorMap = { '開服': 'red', '活動': 'red', '維護': 'blue', '更新': 'blue', '重要': 'red', '提示': 'blue', '完成': 'green', '成功': 'green' };
      var cls = colorMap[tag] || 'gold';
      return '<span class="cms-tag ' + cls + '">' + escapeHTML(tag) + '</span>';
    });
    return text;
  }

  function splitShortcodeParts(value) {
    return String(value || '').split('|').map(function (part) {
      return part.trim();
    });
  }

  function renderShortcodeLine(trimmed) {
    var match = trimmed.match(/^\[\[(HERO|GRID|PANEL|BUTTON):([\s\S]*)\]\]$/);
    if (!match) return '';
    var type = match[1];
    var parts = splitShortcodeParts(match[2]);

    if (type === 'HERO') {
      return '<div class="cms-hero-strip">' +
        '<h2>' + inlineMarkdown(parts[0] || '重點標題') + '</h2>' +
        (parts[1] ? '<p>' + inlineMarkdown(parts[1]) + '</p>' : '') +
        (parts[2] ? '<a class="cms-button" href="' + escapeHTML(parts[3] || '#') + '">' + inlineMarkdown(parts[2]) + '</a>' : '') +
        '</div>';
    }

    if (type === 'GRID') {
      return '<div class="cms-grid">' +
        '<div class="cms-panel"><h3>' + inlineMarkdown(parts[0] || '左側標題') + '</h3><p>' + inlineMarkdown(parts[1] || '左側內容') + '</p></div>' +
        '<div class="cms-panel"><h3>' + inlineMarkdown(parts[2] || '右側標題') + '</h3><p>' + inlineMarkdown(parts[3] || '右側內容') + '</p></div>' +
        '</div>';
    }

    if (type === 'PANEL') {
      return '<div class="cms-panel"><h3>' + inlineMarkdown(parts[0] || '卡片標題') + '</h3><p>' + inlineMarkdown(parts[1] || '卡片內容') + '</p></div>';
    }

    if (type === 'BUTTON') {
      return '<a class="cms-button" href="' + escapeHTML(parts[1] || '#') + '">' + inlineMarkdown(parts[0] || '查看詳情') + '</a>';
    }

    return '';
  }

  function markdownLite(value) {
    var lines = String(value || '').split('\n');
    var html = '';
    var inUl = false;
    var inOl = false;
    var inTable = false;

    function closeList() {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
    }

    function closeTable() {
      if (inTable) { html += '</tbody></table></div>'; inTable = false; }
    }

    lines.forEach(function (line) {
      var trimmed = line.trim();

      if (trimmed.indexOf('|') === 0 && trimmed.lastIndexOf('|') === trimmed.length - 1) {
        var cells = trimmed.slice(1, -1).split('|').map(function (cell) { return cell.trim(); });
        if (cells.every(function (cell) { return /^[-: ]+$/.test(cell); })) return;
        closeList();
        if (!inTable) {
          html += '<div class="cms-table-wrap" tabindex="0" aria-label="可左右滑動查看完整表格"><table><thead><tr>';
          cells.forEach(function (cell) { html += '<th>' + inlineMarkdown(cell) + '</th>'; });
          html += '</tr></thead><tbody>';
          inTable = true;
        } else {
          html += '<tr>';
          cells.forEach(function (cell) { html += '<td>' + inlineMarkdown(cell) + '</td>'; });
          html += '</tr>';
        }
        return;
      }

      closeTable();

      if (!trimmed) {
        closeList();
        return;
      }
      var shortcode = renderShortcodeLine(trimmed);
      if (shortcode) {
        closeList();
        html += shortcode;
        return;
      }
      if (trimmed.indexOf('### ') === 0) {
        closeList();
        html += '<h3>' + inlineMarkdown(trimmed.slice(4)) + '</h3>';
        return;
      }
      if (trimmed.indexOf('## ') === 0) {
        closeList();
        html += '<h2>' + inlineMarkdown(trimmed.slice(3)) + '</h2>';
        return;
      }
      if (trimmed.indexOf('# ') === 0) {
        closeList();
        html += '<h2>' + inlineMarkdown(trimmed.slice(2)) + '</h2>';
        return;
      }
      if (trimmed === '---') {
        closeList();
        html += '<hr>';
        return;
      }
      if (trimmed === '===') {
        closeList();
        html += '<div class="cms-divider">- * * * -</div>';
        return;
      }
      if (trimmed.indexOf('!!! ') === 0) {
        closeList();
        html += '<div class="cms-callout red">' + inlineMarkdown(trimmed.slice(4)) + '</div>';
        return;
      }
      if (trimmed.indexOf('??? ') === 0) {
        closeList();
        html += '<div class="cms-callout blue">' + inlineMarkdown(trimmed.slice(4)) + '</div>';
        return;
      }
      if (trimmed.indexOf('+++ ') === 0) {
        closeList();
        html += '<div class="cms-callout green">' + inlineMarkdown(trimmed.slice(4)) + '</div>';
        return;
      }
      if (trimmed.indexOf('> ') === 0) {
        closeList();
        html += '<blockquote>' + inlineMarkdown(trimmed.slice(2)) + '</blockquote>';
        return;
      }
      if (trimmed.indexOf('- ') === 0 || trimmed.indexOf('* ') === 0 || trimmed.indexOf('• ') === 0) {
        if (inOl) { html += '</ol>'; inOl = false; }
        if (!inUl) { html += '<ul>'; inUl = true; }
        html += '<li>' + inlineMarkdown(trimmed.slice(2)) + '</li>';
        return;
      }
      if (/^\d+\.\s/.test(trimmed)) {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (!inOl) { html += '<ol>'; inOl = true; }
        html += '<li>' + inlineMarkdown(trimmed.replace(/^\d+\.\s/, '')) + '</li>';
        return;
      }

      closeList();
      html += '<p>' + inlineMarkdown(trimmed) + '</p>';
    });

    closeList();
    closeTable();
    return html;
  }

  function sanitizeTrustedHTML(value) {
    var template = document.createElement('template');
    template.innerHTML = String(value || '');
    template.content.querySelectorAll('script').forEach(function (node) {
      node.remove();
    });
    template.content.querySelectorAll('*').forEach(function (node) {
      Array.from(node.attributes).forEach(function (attr) {
        var name = attr.name.toLowerCase();
        var value = String(attr.value || '').trim().toLowerCase();
        if (name.indexOf('on') === 0 || value.indexOf('javascript:') === 0) {
          node.removeAttribute(attr.name);
        }
      });
    });
    return template.innerHTML;
  }

  function renderPostBody(post) {
    var parts = [];
    if (post.coverImage) {
      parts.push('<img class="post-cover" src="' + escapeHTML(post.coverImage) + '" alt="' + escapeHTML(post.title) + '">');
    }
    if (post.body || post.excerpt) {
      parts.push('<div class="cms-markdown">' + sanitizeTrustedHTML(markdownLite(post.body || post.excerpt || '')) + '</div>');
    }
    if (post.customHtml) {
      parts.push('<div class="cms-custom-html">' + sanitizeTrustedHTML(post.customHtml) + '</div>');
    }
    return parts.join('');
  }

  function enhanceScrollableTables(scope) {
    if (!scope) return;
    var wraps = scope.querySelectorAll('.cms-table-wrap');
    wraps.forEach(function (wrap) {
      var check = function () {
        wrap.classList.toggle('is-scrollable', wrap.scrollWidth > wrap.clientWidth + 2);
      };
      check();
      if (window.ResizeObserver) {
        var observer = new ResizeObserver(check);
        observer.observe(wrap);
      } else {
        window.addEventListener('resize', check);
      }
    });
  }

  function scrollToCurrentHash(scope) {
    if (!scope || !window.location.hash) return;

    var id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    var target = document.getElementById(id);
    if (!target || !scope.contains(target)) return;

    window.requestAnimationFrame(function () {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add('is-hash-target');
      window.setTimeout(function () {
        target.classList.remove('is-hash-target');
      }, 1800);
    });
  }

  function renderNewsList(target) {
    loadPosts().then(function (posts) {
      target.innerHTML = posts.length ? posts.map(function (post, index) {
        return '<article class="post-card post-layout-' + escapeHTML(post.layout || 'standard') + '" id="post-' + index + '">' +
          '<h2>' + escapeHTML(post.title) + '</h2>' +
          '<div class="post-meta"><span>' + escapeHTML(post.category) + '</span><span>' + escapeHTML(post.date) + '</span>' + (post.pinned ? '<span>置頂</span>' : '') + '</div>' +
          '<div class="post-body cms-rich">' + renderPostBody(post) + '</div>' +
          '</article>';
      }).join('') : '<div class="notice blue">目前尚無文章。</div>';
      enhanceScrollableTables(target);
      scrollToCurrentHash(target);
    }).catch(function () {
      target.innerHTML = '<div class="notice red">文章資料讀取失敗，請確認 data/posts.json 是否存在。</div>';
    });
  }

  function renderUpdatesEmpty(target) {
    target.innerHTML = '<div class="content-card" style="text-align:center;padding:60px 40px;">' +
      '<div style="font-size:64px;margin-bottom:20px;">📭</div>' +
      '<h2 style="color:var(--gold);font-size:1.6em;margin-bottom:15px;letter-spacing:2px;">暫無更新記錄</h2>' +
      '<p style="color:var(--text-secondary);font-size:1.05em;line-height:1.8;max-width:500px;margin:0 auto 25px;">目前尚無版本更新記錄。請到後台「文章管理」新增文章，並將分類設為「更新」，發布後會自動同步到此頁。</p>' +
      '<div class="notice gold" style="max-width:500px;margin:0 auto;text-align:left;"><strong>📌 管理員說明</strong><br>若只需要簡短條列，也可在後台「首頁底板管理」的更新歷程清單補充。</div>' +
      '</div>';
  }

  function renderUpdatesSummary(target, fallbackUpdates, options) {
    var opts = options || {};
    var limit = opts.limit || 6;
    loadUpdateItems(fallbackUpdates).then(function (items) {
      if (!items.length) {
        target.innerHTML = opts.emptyHTML || '<p style="color:var(--text-dim);text-align:center;padding:30px 0;letter-spacing:2px;">暫無更新記錄</p>';
        return;
      }
      target.innerHTML = items.slice(0, limit).map(function (item) {
        var href = root() + 'pages/updates.html#' + item.anchor;
        return '<a class="update-item" href="' + escapeHTML(href) + '">' +
          '<span class="update-date">' + escapeHTML(item.date || '') + '</span>' +
          '<span class="update-tag">' + escapeHTML(item.tag || '更新') + '</span>' +
          '<span class="update-content">' + escapeHTML(updateText(item)) + '</span>' +
          '</a>';
      }).join('');
    }).catch(function () {
      target.innerHTML = opts.errorHTML || '<div class="notice red">更新歷程讀取失敗，請確認 data/posts.json 是否存在。</div>';
    });
  }

  function renderUpdateFullItem(item) {
    if (item.type === 'post' && item.post) {
      var post = item.post;
      return '<article class="post-card post-layout-' + escapeHTML(post.layout || 'standard') + '" id="' + escapeHTML(item.anchor) + '">' +
        '<h2>' + escapeHTML(post.title || '未命名更新') + '</h2>' +
        '<div class="post-meta">' +
          '<span>' + escapeHTML(post.category || '更新') + '</span>' +
          '<span>' + escapeHTML(post.date || '') + '</span>' +
          (post.pinned ? '<span>置頂</span>' : '') +
          (typeof item.newsIndex === 'number' ? '<span><a href="' + escapeHTML(root() + 'pages/news.html#post-' + item.newsIndex) + '">文章頁</a></span>' : '') +
        '</div>' +
        '<div class="post-body cms-rich">' + renderPostBody(post) + '</div>' +
        '</article>';
    }
    return '<div class="update-item" id="' + escapeHTML(item.anchor) + '">' +
      '<span class="update-date">' + escapeHTML(item.date || '') + '</span>' +
      '<span class="update-tag">' + escapeHTML(item.tag || '更新') + '</span>' +
      '<span class="update-content">' + escapeHTML(updateText(item)) + '</span>' +
      '</div>';
  }

  function renderUpdatesFullList(target, fallbackUpdates) {
    loadUpdateItems(fallbackUpdates).then(function (items) {
      if (!items.length) {
        renderUpdatesEmpty(target);
        return;
      }
      target.innerHTML = items.map(renderUpdateFullItem).join('');
      enhanceScrollableTables(target);
      scrollToCurrentHash(target);
    }).catch(function () {
      target.innerHTML = '<div class="notice red">更新歷程讀取失敗，請確認 data/posts.json 是否存在。</div>';
    });
  }

  function renderEventsList(target) {
    loadPosts().then(function (posts) {
      var events = posts.filter(function (post) { return post.category === '活動'; });
      // 已結束的活動排到最下方（其餘維持置頂/日期排序，sort 為穩定排序）
      events.sort(function (a, b) { return (a.status === '已結束' ? 1 : 0) - (b.status === '已結束' ? 1 : 0); });
      if (!events.length) {
        target.innerHTML = '<div class="content-card" style="text-align:center;padding:60px 40px;">' +
          '<div style="font-size:64px;margin-bottom:20px;">🗓️</div>' +
          '<h2 style="color:var(--gold);font-size:1.6em;margin-bottom:15px;letter-spacing:2px;">暫無活動公告</h2>' +
          '<p style="color:var(--text-dim);font-size:1.05em;line-height:1.8;max-width:500px;margin:0 auto 25px;">目前尚無進行中的活動。請持續關注本頁面，管理團隊將在此公告各類限時活動、節慶特典與特別賽事。</p>' +
          '<div class="notice gold" style="max-width:500px;margin:0 auto;text-align:left;"><strong>📌 管理員說明</strong><br>活動公告將由管理團隊定期更新。重大活動亦會同步發布於官方 LINE@ 群組，請務必加入以接收即時通知。</div>' +
          '</div>';
        return;
      }
      target.innerHTML = '<div class="event-list">' + events.map(function (post) {
        var ended = post.status === '已結束';
        return '<div class="event-item' + (ended ? ' is-ended' : (post.pinned ? ' is-pinned' : '')) + '">' +
          '<button class="event-head" type="button" aria-expanded="false">' +
            '<span class="event-date">' + escapeHTML(post.date) + '</span>' +
            '<span class="event-title">' + escapeHTML(post.title) + '</span>' +
            '<span class="event-badge' + (ended ? ' ended' : '') + '">' + (ended ? '已結束' : '進行中') + '</span>' +
            '<span class="event-arrow" aria-hidden="true">▾</span>' +
          '</button>' +
          '<div class="event-body cms-rich" hidden>' + renderPostBody(post) + '</div>' +
        '</div>';
      }).join('') + '</div>';
      enhanceScrollableTables(target);
      Array.prototype.forEach.call(target.querySelectorAll('.event-head'), function (head) {
        head.addEventListener('click', function () {
          var body = head.nextElementSibling;
          if (body.hasAttribute('hidden')) {
            body.removeAttribute('hidden');
            head.classList.add('is-open');
            head.setAttribute('aria-expanded', 'true');
          } else {
            body.setAttribute('hidden', '');
            head.classList.remove('is-open');
            head.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }).catch(function () {
      target.innerHTML = '<div class="notice red">活動資料讀取失敗，請確認 data/posts.json 是否存在。</div>';
    });
  }

  window.ForumCmsPosts = {
    loadPosts,
    loadUpdateItems,
    renderAnnouncements,
    renderNewsList,
    renderUpdatesSummary,
    renderUpdatesFullList,
    renderEventsList,
  };
})();
