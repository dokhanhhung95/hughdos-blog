// Hugh Do – tương tác phía trình duyệt
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Sáng / tối ----------
  function syncToggles() {
    var t = root.dataset.theme || 'light';
    document.querySelectorAll('[data-theme-set]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.themeSet === t)); });
  }
  document.querySelectorAll('[data-theme-set]').forEach(function (b) {
    b.addEventListener('click', function () {
      root.dataset.theme = b.dataset.themeSet;
      try { localStorage.setItem('hd-theme', b.dataset.themeSet); } catch (e) {}
      syncToggles();
    });
  });
  syncToggles();

  // ---------- Trang chủ (desktop): con trỏ vẽ chữ H ----------
  var art = document.getElementById('art');
  if (art) {
    var pts = [[84,305],[84,189],[153,150.2],[153,273.5],[326,273.5],[326,205.2],[394,243.5],[394,366.5],[326,404.8],[326,336.5],[153,336.5],[153,459.8],[84,421],[84,305]];
    var seg = [], total = 0;
    for (var i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i-1][0], pts[i][1] - pts[i-1][1]); seg.push(l); total += l; }
    var gH = document.getElementById('art-h'), gD = document.getElementById('art-d'), stroke = document.getElementById('art-path'),
        marks = document.getElementById('art-marks'), cur = document.getElementById('art-cursor'), raf = 0;
    var clamp = function (v) { return Math.min(1, Math.max(0, v)); };
    function frame(p, mo, sp) {
      var left = p * total, k = 0;
      while (k < seg.length - 1 && left > seg[k]) { left -= seg[k]; k++; }
      var f = seg[k] ? Math.min(1, left / seg[k]) : 0;
      var x = pts[k][0] + (pts[k+1][0] - pts[k][0]) * f, y = pts[k][1] + (pts[k+1][1] - pts[k][1]) * f;
      cur.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
      stroke.setAttribute('stroke-dashoffset', (1 - p).toFixed(4));
      marks.setAttribute('opacity', mo.toFixed(3));
      gH.setAttribute('transform', 'translate(' + (-46 * sp).toFixed(2) + ' ' + (26 * sp).toFixed(2) + ')');
      gD.setAttribute('transform', 'translate(' + (46 * sp).toFixed(2) + ' ' + (-26 * sp).toFixed(2) + ')');
    }
    function play() {
      cancelAnimationFrame(raf);
      if (reduce) { frame(1, 1, 1); return; }
      var t0 = performance.now();
      (function tick(now) {
        var e = now - t0, t = clamp((e - 400) / 5200);
        var ease = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        var s = clamp((e - 6000) / 1800);
        frame(.15 * ease + .85 * t, clamp((e - 5700) / 500), 1 - Math.pow(1 - s, 4));
        if (e < 7800) raf = requestAnimationFrame(tick);
      })(t0);
    }
    frame(0, 0, 0);
    cur.addEventListener('click', play);
    cur.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
    // Chỉ chạy khi phần art đang hiển thị (desktop)
    if (getComputedStyle(art.parentNode).display !== 'none') play(); else frame(1, 1, 1);
  }

  // ---------- Trang chủ (mobile): con trỏ đi qua các mục nav ----------
  var heroNav = document.querySelector('.hero-nav');
  var navCur = heroNav && heroNav.querySelector('.nav-cursor');
  if (navCur && getComputedStyle(navCur).display !== 'none') {
    var links = heroNav.querySelectorAll('a'), timers = [];
    function moveTo(n) {
      var a = links[n]; if (!a) return;
      navCur.style.left = (a.offsetLeft + a.offsetWidth + 10) + 'px';
      navCur.style.top = (a.offsetTop + 14) + 'px';
      navCur.style.opacity = 1;
    }
    function tour() {
      timers.forEach(clearTimeout); timers = [];
      moveTo(0);
      if (reduce) return;
      [1, 2, 3, 0].forEach(function (n, k) { timers.push(setTimeout(function () { moveTo(n); }, 900 + k * 1000)); });
    }
    links.forEach(function (a, n) {
      a.addEventListener('pointerenter', function () { timers.forEach(clearTimeout); moveTo(n); });
      a.addEventListener('touchstart', function () { timers.forEach(clearTimeout); moveTo(n); }, { passive: true });
    });
    navCur.addEventListener('click', tour);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(tour);
    addEventListener('resize', function () { moveTo(0); });
  }

  // ---------- Lưu trữ: lọc chuyên mục ----------
  var chips = document.querySelectorAll('.chip[data-filter]');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.dataset.filter;
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      document.querySelectorAll('.year-group').forEach(function (g) {
        var shown = 0;
        g.querySelectorAll('.post-row').forEach(function (r) { var ok = f === 'all' || r.dataset.cat === f; r.hidden = !ok; if (ok) shown++; });
        g.hidden = !shown;
      });
    });
  });

  // ---------- Tìm kiếm ----------
  function fold(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  // Tô đỏ các từ khoá, so khớp không phân biệt dấu nhưng giữ nguyên chữ gốc
  function highlight(text, terms) {
    var map = [], norm = '';
    for (var i = 0; i < text.length; i++) { var f = fold(text[i]); for (var j = 0; j < f.length; j++) { norm += f[j]; map.push(i); } }
    var hit = new Array(text.length).fill(false);
    terms.forEach(function (t) {
      var from = 0, k;
      while ((k = norm.indexOf(t, from)) !== -1) { for (var m = k; m < k + t.length; m++) hit[map[m]] = true; from = k + t.length; }
    });
    var out = '', open = false;
    for (var n = 0; n < text.length; n++) {
      if (hit[n] && !open) { out += '<mark>'; open = true; }
      if (!hit[n] && open) { out += '</mark>'; open = false; }
      out += esc(text[n]);
    }
    return out + (open ? '</mark>' : '');
  }
  function snippet(body, terms) {
    var nb = fold(body), at = -1;
    terms.forEach(function (t) { var k = nb.indexOf(t); if (k !== -1 && (at === -1 || k < at)) at = k; });
    if (at < 0) return '';
    var s = Math.max(0, at - 60), e = Math.min(body.length, at + 140);
    return (s > 0 ? '…' : '') + body.slice(s, e).trim() + (e < body.length ? '…' : '');
  }
  var big = document.getElementById('q-big');
  if (big) {
    var results = document.getElementById('search-results'), status = document.getElementById('search-status'), empty = document.getElementById('search-empty'), index = null;
    var q0 = new URLSearchParams(location.search).get('q') || '';
    big.value = q0;
    document.querySelectorAll('input[name="q"]').forEach(function (i) { i.value = q0; });
    function run() {
      var q = big.value.trim();
      var url = q ? '?q=' + encodeURIComponent(q) : location.pathname;
      history.replaceState(null, '', url);
      if (!index) return;
      if (!q) { results.innerHTML = ''; empty.hidden = true; status.textContent = index.length + ' bài viết. Gõ để tìm.'; return; }
      var terms = fold(q).split(/\s+/).filter(Boolean);
      var found = index.map(function (p) {
        var t = fold(p.t), hay = t + ' ' + fold(p.c + ' ' + p.k + ' ' + p.e) + ' ' + fold(p.b);
        if (!terms.every(function (x) { return hay.indexOf(x) !== -1; })) return null;
        var score = terms.reduce(function (s, x) { return s + (t.indexOf(x) !== -1 ? 10 : 0) + (fold(p.e).indexOf(x) !== -1 ? 3 : 0) + 1; }, 0);
        return { p: p, score: score };
      }).filter(Boolean).sort(function (a, b) { return b.score - a.score; });
      status.textContent = found.length ? found.length + ' kết quả cho “' + q + '”' : '';
      empty.hidden = !!found.length;
      results.innerHTML = found.map(function (r) {
        var p = r.p, ex = snippet(p.e, terms) || snippet(p.b, terms) || p.e;
        return '<a class="post-row" href="' + p.u + '"><span class="t"><span class="title">' + highlight(p.t, terms) + '</span><span class="ex">' + highlight(ex, terms) + '</span></span><span class="cat">' + esc(p.c) + '</span><span class="date">' + p.d + '</span></a>';
      }).join('') + (found.length ? '<div class="list-end"></div>' : '');
    }
    big.form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    big.addEventListener('input', run);
    fetch('/search-index.json').then(function (r) { return r.json(); }).then(function (d) { index = d; run(); });
  }

  // ---------- Bài viết: sao chép liên kết, mục lục đang đọc ----------
  document.querySelectorAll('[data-copy-link]').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () { var t = b.textContent; b.textContent = 'Đã sao chép ✓'; setTimeout(function () { b.textContent = t; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href.split('#')[0]).then(done, done); else done();
    });
  });
  // Mục lục: desktop luôn mở, mobile mặc định thu gọn
  var tocBox = document.querySelector('[data-toc]');
  if (tocBox) {
    var mq = matchMedia('(min-width: 768px)');
    var syncToc = function () { if (mq.matches) tocBox.open = true; else tocBox.open = false; };
    syncToc();
    if (mq.addEventListener) mq.addEventListener('change', syncToc);
    tocBox.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { if (!mq.matches) tocBox.open = false; }); });
  }
  var tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[decodeURIComponent(a.hash.slice(1))] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { tocLinks.forEach(function (a) { a.classList.remove('active'); }); var a = byId[en.target.id]; if (a) a.classList.add('active'); }
      });
    }, { rootMargin: '0px 0px -70% 0px' });
    Object.keys(byId).forEach(function (id) { var h = document.getElementById(id); if (h) io.observe(h); });
  }
})();
