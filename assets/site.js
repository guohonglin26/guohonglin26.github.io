// 深浅色切换：记住读者的选择，读不到存储时按系统设置
(function () {
  var KEY = 'blog-theme';
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}

  function current() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function label(btn) { btn.textContent = current() === 'dark' ? '浅色' : '深色'; }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.theme-btn');
    if (!btn) return;
    label(btn);
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      label(btn);
      document.dispatchEvent(new CustomEvent('themechange'));
    });
  });
})();

// 全站搜索：页眉加“搜索”按钮，⌘K / Ctrl+K 或 / 打开；索引 assets/search-index.js 第一次打开时才加载（由 src/gen_search.py 生成）
(function () {
  var me = document.currentScript && document.currentScript.src;
  if (!me) return;
  var ROOT = me.replace(/assets\/site\.js(\?.*)?$/, '');
  var dlg, input, list, hint, rows = [], sel = 0, loading = false;
  var W = { '篇': 6, '节': 4, '易混': 4, '公式': 3, '速记': 2, '正文': 1 };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mark(s, terms) {
    var h = esc(s);
    terms.forEach(function (t) { if (t) h = h.replace(new RegExp(esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), function (m) { return '<mark>' + m + '</mark>'; }); });
    return h;
  }
  function load(cb) {
    if (window.SEARCH_INDEX) return cb();
    if (loading) return; loading = true;
    hint.textContent = '正在载入索引…';
    var s = document.createElement('script');
    s.src = ROOT + 'assets/search-index.js';
    s.onload = function () { loading = false; cb(); };
    s.onerror = function () { loading = false; hint.textContent = '索引没有载入，请检查网络后重新打开搜索。'; };
    document.head.appendChild(s);
  }
  function run() {
    var q = input.value.trim().toLowerCase();
    if (!window.SEARCH_INDEX) return;
    var I = window.SEARCH_INDEX;
    if (!q) { list.innerHTML = ''; hint.textContent = '共收录 ' + I.P.length + ' 页、' + I.R.length + ' 条：篇名、小节、速记、易混辨析、公式。多个词用空格隔开。'; rows = []; return; }
    var terms = q.split(/\s+/), res = [];
    I.R.forEach(function (r) {
      var t = r[3].toLowerCase(), hay = t + ' ' + r[4].toLowerCase() + ' ' + I.P[r[0]][1].toLowerCase();
      for (var i = 0; i < terms.length; i++) if (hay.indexOf(terms[i]) < 0) return;
      var sc = W[r[2]] || 1;
      if (t.indexOf(q) >= 0) sc += 4;
      if (t.indexOf(q) === 0) sc += 2;
      sc -= Math.min(t.length, 60) / 60;
      res.push([sc, r]);
    });
    res.sort(function (a, b) { return b[0] - a[0]; });
    rows = res.slice(0, 50).map(function (x) { return x[1]; });
    sel = 0;
    hint.textContent = res.length ? '找到 ' + res.length + ' 条' + (res.length > 50 ? '，显示前 50 条' : '') + '。↑↓ 选择，回车打开。' : '没有找到“' + input.value.trim() + '”。试试更短的词，或换成英文缩写。';
    list.innerHTML = rows.map(function (r, i) {
      return '<li><a href="' + ROOT + I.P[r[0]][0] + (r[1] ? '#' + r[1] : '') + '"' + (i === 0 ? ' class="on"' : '') + '><span class="sk">' + r[2] + '</span><span class="st">' + mark(r[3], terms) +
        (r[4] ? '<small>' + mark(r[4], terms) + '</small>' : '') + '<em>' + esc(I.P[r[0]][1]) + '</em></span></a></li>';
    }).join('');
  }
  function move(d) {
    var as = list.querySelectorAll('a'); if (!as.length) return;
    as[sel].classList.remove('on'); sel = (sel + d + as.length) % as.length; as[sel].classList.add('on');
    as[sel].scrollIntoView({ block: 'nearest' });
  }
  function open() {
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.className = 'search';
      dlg.innerHTML = '<form method="dialog" class="search-top"><input type="search" placeholder="搜概念、公式、小节，比如 GRPO、KV Cache、贝尔曼" aria-label="搜索全站"><button type="submit">关闭</button></form><p class="search-hint"></p><ul class="search-res"></ul>';
      document.body.appendChild(dlg);
      input = dlg.querySelector('input'); list = dlg.querySelector('ul'); hint = dlg.querySelector('.search-hint');
      input.addEventListener('input', run);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
        else if (e.key === 'Enter') { var a = list.querySelectorAll('a')[sel]; if (a) { e.preventDefault(); location.href = a.href; dlg.close(); } }
      });
      list.addEventListener('click', function () { dlg.close(); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    }
    dlg.showModal(); input.select();
    load(run);
  }
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase(), typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); open(); }
    else if (e.key === '/' && !typing) { e.preventDefault(); open(); }
  });
  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.site-nav'); if (!nav) return;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'search-btn'; b.title = '搜索全站（⌘K）';
    b.textContent = '搜索';
    b.addEventListener('click', open);
    nav.insertBefore(b, nav.querySelector('.theme-btn'));
  });
})();
