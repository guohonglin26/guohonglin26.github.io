// 可信 RSI 系列专用组件（依赖 series.js 的 S）
(function () {
  'use strict';
  var R = {};
  var TAG = { rsi: 'RSI 直接', rel: '相关系统', arg: '原文推论' };
  R.tag = function (k) { return '<span class="evt ' + k + '">' + TAG[k] + '</span>'; };
  R.lv = function (k) { return '<span class="lv ' + k + '">' + { u: '单次更新', s: '后继', m: '元改进' }[k] + '</span>'; };

  // 分阶段对照：rows = [{k:'S1', t:'改进诊断', q, risk, ev, guard, lim}]
  R.stages = function (root, rows) {
    root.classList.add('stg');
    root.innerHTML = '';
    var seg = S.h('div', { class: 'seg', role: 'group', 'aria-label': '选择阶段' }, root);
    rows.forEach(function (r, i) {
      S.h('button', { 'data-v': String(i), 'aria-pressed': i ? 'false' : 'true', text: r.k + ' ' + r.t }, seg);
    });
    var q = S.h('p', { class: 'stg-q' }, root);
    var g = S.h('div', { class: 'stg-grid', 'aria-live': 'polite' }, root);
    function show(i) {
      var r = rows[i];
      q.innerHTML = r.q || '';
      g.innerHTML = '';
      [['r', '风险', r.risk], ['e', '失败证据', r.ev], ['g', '已有保障', r.guard], ['l', '局限 / 还缺什么', r.lim]].forEach(function (c) {
        if (!c[2]) return;
        var d = S.h('div', { class: 'stg-cell ' + c[0] }, g);
        S.h('h5', { text: c[1] }, d);
        (Array.isArray(c[2]) ? c[2] : [c[2]]).forEach(function (t) { S.h('p', { html: t }, d); });
      });
    }
    S.seg(seg, function (v) { show(+v); });
    show(0);
  };

  // 分步流程：steps = [{t, d}]，配合 S.stepper
  R.flow = function (root, steps, onStep) {
    var ol = S.h('ol', { class: 'flow2' }, root);
    var lis = steps.map(function (s) { return S.h('li', { html: s.t + (s.d ? '<small>' + s.d + '</small>' : '') }, ol); });
    return S.stepper(root, steps.length, function (i) {
      lis.forEach(function (li, j) { li.className = j === i ? 'on' : j < i ? 'done' : ''; });
      if (onStep) onStep(i);
    });
  };

  // 研究条目列表：items = [{n, sub, html}]
  R.studies = function (root, items) {
    root.innerHTML = '';
    var box = S.h('div', { class: 'studies' }, root);
    var det = S.h('div', { class: 'sdet', 'aria-live': 'polite' }, root);
    var bs = items.map(function (it, i) {
      var b = S.h('button', { class: 'st', type: 'button', 'aria-pressed': i ? 'false' : 'true', html: '<b>' + it.n + '</b><small>' + it.sub + '</small>' }, box);
      b.addEventListener('click', function () { pick(i); });
      return b;
    });
    function pick(i) {
      bs.forEach(function (b, j) { b.setAttribute('aria-pressed', String(i === j)); });
      det.innerHTML = items[i].html;
    }
    pick(0);
  };

  window.R = R;
})();
