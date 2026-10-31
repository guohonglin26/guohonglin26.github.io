// 多书对照：展开一站时，把讲这一站的各篇“记下来”里的概念并排列出（取自全站搜索索引，第一次展开时加载）
document.addEventListener('DOMContentLoaded', function () {
  var E = window.EVO, ROOT = '../../', pending = [];
  function esc(x) { return String(x).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function fill(d) {
    var I = window.SEARCH_INDEX, n = E.nodes[d.getAttribute('data-id')], g = d.querySelector('.cmp-g'), html = '';
    n.at.forEach(function (a) {
      var url = 'posts/' + E.series[a[0]].prefix + (a[1] ? '-' + a[1] : '') + '/', pi = -1;
      I.P.forEach(function (p, i) { if (p[0] === url) pi = i; });
      var items = I.R.filter(function (r) { return r[0] === pi && r[2] === '速记'; }).slice(0, 6);
      var tt = window.EVO_TITLES && EVO_TITLES[a[0]] && EVO_TITLES[a[0]][a[1]];
      html += '<div class="cmp-c"><h4><a href="' + ROOT + url + '">' + esc(E.series[a[0]].name + (a[1] ? ' · ' + (a[1] < 10 ? '0' : '') + a[1] : '') + (tt ? ' ' + tt : '')) + '</a></h4><dl>' +
        (items.length ? items.map(function (r) { return '<dt>' + esc(r[3]) + '</dt><dd>' + esc(r[4]) + '</dd>'; }).join('') : '<dd>这一篇没有“记下来”条目，点标题去读原文。</dd>') + '</dl></div>';
    });
    g.innerHTML = html;
  }
  function load(cb) {
    if (window.SEARCH_INDEX) return cb();
    pending.push(cb); if (pending.length > 1) return;
    var sc = document.createElement('script'); sc.src = ROOT + 'assets/search-index.js';
    sc.onload = function () { pending.forEach(function (f) { f(); }); pending = []; };
    document.head.appendChild(sc);
  }
  document.querySelectorAll('.evo-fn[data-id]').forEach(function (row) {
    if (E.nodes[row.getAttribute('data-id')].at.length < 2) return;
    var d = document.createElement('details'); d.className = 'cmp'; d.setAttribute('data-id', row.getAttribute('data-id'));
    d.innerHTML = '<summary>对照各书怎么讲这一站</summary><div class="cmp-g"><p class="cmp-note">载入中…</p></div><p class="cmp-note">每本书取该篇“记下来”的前几条概念；条目是各书自己的说法，放在一起看侧重点的差别。</p>';
    d.addEventListener('toggle', function () { if (d.open && !d.dataset.done) { d.dataset.done = 1; load(function () { fill(d); }); } });
    row.appendChild(d);
  });
});
