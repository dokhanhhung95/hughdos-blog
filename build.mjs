// Hugh Do – trình tạo site tĩnh. Đọc content/, xuất dist/.
// Chạy: node build.mjs          (build)
//       node build.mjs --serve  (build + máy chủ xem thử ở http://localhost:4321)
//       thêm --drafts để hiện cả bài nháp
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { Marked } from 'marked';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, 'dist');
const args = process.argv.slice(2);
const SHOW_DRAFTS = args.includes('--drafts');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'));
const SITE_URL = (process.env.SITE_URL || site.url).replace(/\/$/, '');
const cats = site.categories;
const catBySlug = Object.fromEntries(cats.map(c => [c.slug, c]));

// ---------- tiện ích ----------
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fold = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const slugify = s => fold(s).replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'muc';
const fmtDate = d => `${d.slice(8, 10)}.${d.slice(5, 7)}.${d.slice(0, 4)}`;
const stripTags = h => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const clip = (s, n) => s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n)).replace(/[,.;:–-]+$/, '') + '…';
const catUrl = slug => `/chuyen-muc/${slug}/`;

function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: src };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v === 'true' || v === 'false') v = v === 'true';
    else if (v.startsWith('[')) { try { v = JSON.parse(v); } catch { v = v.slice(1, -1).split(',').map(x => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean); } }
    else if (v.startsWith('"')) { try { v = JSON.parse(v); } catch { v = v.slice(1, -1); } }
    else if (v.startsWith("'")) v = v.slice(1, -1).replace(/''/g, "'");
    data[kv[1]] = v;
  }
  return { data, body: src.slice(m[0].length) };
}

// ---------- đọc bài viết ----------
function loadPosts() {
  const dir = path.join(ROOT, 'content/posts');
  const posts = [];
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const { data, body } = parseFrontmatter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (data.draft && !SHOW_DRAFTS) continue;
    if (!data.title) { console.warn('  bỏ qua (thiếu title):', file); continue; }
    const stamp = String(data.date || file.slice(0, 10)).trim(); // 2026-11-27 hoặc 2026-11-27T08:46
    const date = stamp.slice(0, 10);
    const slug = data.slug || file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const url = data.wp_url || `/${date.slice(0, 4)}/${date.slice(5, 7)}/${date.slice(8, 10)}/${slug}/`;
    const category = catBySlug[data.category] ? data.category : 'more';

    const toc = []; const used = new Set();
    const renderer = {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        let id = slugify(stripTags(html)), base = id, n = 2;
        while (used.has(id)) id = `${base}-${n++}`;
        used.add(id);
        if (depth === 2) toc.push({ id, text: stripTags(html) });
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
      image({ href, title, text }) {
        return `<img src="${esc(href)}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ''} loading="lazy" decoding="async">`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const ext = /^https?:\/\//.test(href) && !href.startsWith(SITE_URL);
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${ext ? ' target="_blank" rel="noopener"' : ''}>${inner}</a>`;
      }
    };
    const md = new Marked({ gfm: true, breaks: false });
    md.use({ renderer });
    let html = md.parse(body);
    html = html.replace(/<img (?![^>]*loading=)/g, '<img loading="lazy" decoding="async" ');

    const text = stripTags(html);
    const words = text.split(' ').filter(Boolean).length;
    const firstP = (html.match(/<p>([\s\S]*?)<\/p>/) || [, ''])[1];
    const excerpt = data.excerpt || clip(stripTags(firstP) || text, 180);
    const cover = data.cover || (html.match(/<img[^>]+src="([^"]+)"/) || [])[1] || '';
    posts.push({ file, title: data.title, date, stamp: stamp.length > 10 ? stamp.replace(' ', 'T') : stamp + 'T00:00', category, tags: Array.isArray(data.tags) ? data.tags : [], url, cover,
      excerpt, html, toc, readMin: Math.max(1, Math.round(words / 220)), draft: !!data.draft });
  }
  return posts.sort((a, b) => b.stamp.localeCompare(a.stamp) || a.title.localeCompare(b.title));
}

// ---------- mảnh giao diện ----------
const LOGO_D1 = 'M153 150.2 L84 189 L84 421 L153 459.8 L153 336.5 L326 336.5 L326 404.8 L394 366.5 L394 243.5 L326 205.2 L326 273.5 L153 273.5 Z';
const LOGO_D2 = 'M299 68 L205 120.9 L205 249.5 L273 249.5 L273 131.4 L446 228.7 L446 381.3 L273 478.6 L273 360.5 L205 360.5 L205 489.1 L299 542 L514 421 L514 189 Z';
const logo = (w, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} width="${w}" height="${Math.round(w * 474 / 430)}" viewBox="84 68 430 474" aria-hidden="true"><path d="${LOGO_D1}"/><path d="${LOGO_D2}"/></svg>`;
const CURSOR_PATH = 'M1.31 0.49 L13.69 5.11 Q15 5.6 13.71 6.15 L9.69 7.85 Q8.4 8.4 7.85 9.69 L6.15 13.71 Q5.6 15 5.11 13.69 L0.49 1.31 Q0 0 1.31 0.49 Z';
const cursorSvg = size => `<svg width="${size}" height="${size}" viewBox="0 0 15 15" aria-hidden="true"><path d="${CURSOR_PATH}" fill="#D92D20" stroke="#fff" stroke-width="1.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`;
const inlineCursor = size => `<span class="inline-cursor" aria-hidden="true">${cursorSvg(size)}<span class="cursor-label">hughdo</span></span>`;
const ICON_SEARCH = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
const ICON_SUN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const ICON_MOON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';

const searchForm = id => `<form class="search" role="search" action="/tim-kiem/" method="get"><label class="sr-only" for="${id}">Tìm kiếm</label>${ICON_SEARCH}<input id="${id}" type="search" name="q" placeholder="Tìm kiếm…" autocomplete="off"></form>`;
const themeToggle = () => `<div class="theme-toggle" role="group" aria-label="Giao diện"><button type="button" data-theme-set="light" aria-pressed="true" aria-label="Giao diện sáng">${ICON_SUN}<span>Sáng</span></button><button type="button" data-theme-set="dark" aria-pressed="false" aria-label="Giao diện tối">${ICON_MOON}<span>Tối</span></button></div>`;

function header(current) {
  const nav = cats.map(c => `<a href="${catUrl(c.slug)}"${current === c.slug ? ' aria-current="page"' : ''}><span class="lbl">${esc(c.name)}</span></a>`).join('');
  return `<header class="site-header">
  <div class="left"><a class="logo-link" href="/" aria-label="Trang chủ">${logo(30)}</a>${searchForm('q-top')}</div>
  <div class="right"><nav class="top-nav" aria-label="Chuyên mục">${nav}</nav>${themeToggle()}</div>
</header>`;
}

const footer = () => `<footer class="site-footer"><div class="inner">
  <span class="copy">© ${new Date().getFullYear()} ${esc(site.title)}</span>
  <nav aria-label="Liên kết cuối trang"><a href="/tat-ca/">Tất cả bài viết</a><a href="/gioi-thieu/">Giới thiệu</a><a href="/rss.xml">RSS</a><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></nav>
</div></footer>`;

function layout({ title, description, url, body, image, type = 'website', bodyClass = '' }) {
  const fullTitle = title ? `${title} – ${site.title}` : `${site.title} – ${site.tagline}`;
  const desc = description || site.tagline;
  const canonical = SITE_URL + url;
  const img = image ? (image.startsWith('http') ? image : SITE_URL + image) : SITE_URL + '/og-image.png';
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:site_name" content="${esc(site.title)}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title || site.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0E0E0F" media="(prefers-color-scheme: dark)">
<script>try{var t=localStorage.getItem('hd-theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}</script>
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="application/rss+xml" title="${esc(site.title)}" href="/rss.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@200;300;400;500;600&display=swap">
<link rel="stylesheet" href="/assets/style.css?v=${BUILD_ID}">
<script src="/assets/site.js?v=${BUILD_ID}" defer></script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${body}
</body>
</html>
`;
}
const BUILD_ID = Date.now().toString(36);

const postRow = (p, { excerpt = false, cat = true } = {}) => `<a class="post-row" href="${p.url}" data-cat="${p.category}">
  <span class="t"><span class="title">${esc(p.title)}</span>${excerpt ? `<span class="ex">${esc(p.excerpt)}</span>` : ''}</span>
  ${cat ? `<span class="cat">${esc(catBySlug[p.category].name)}</span>` : ''}<span class="date">${fmtDate(p.date)}</span>
</a>`;
const coverImg = (src, alt, eager = false) => src ? `<img src="${esc(src)}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">` : '';

// ---------- các trang ----------
function homePage(posts) {
  const [latest, ...rest] = posts;
  const nav = cats.map((c, i) => `<a href="${catUrl(c.slug)}" data-i="${i}"><span class="lbl">${c.slug === 'more' ? '<span class="amp">&amp; </span>' : ''}${esc(c.name)}</span></a>`).join('');
  const art = `<svg id="art" viewBox="-150 -60 900 700" fill="none" aria-hidden="true">
<g style="stroke: var(--art-line)" stroke-width="1"><line x1="-200" y1="348.8" x2="800" y2="-214.0" vector-effect="non-scaling-stroke"/><line x1="-200" y1="-212.8" x2="800" y2="350.0" vector-effect="non-scaling-stroke"/><line x1="-200" y1="261.2" x2="800" y2="824.0" vector-effect="non-scaling-stroke"/><line x1="-200" y1="822.8" x2="800" y2="260.0" vector-effect="non-scaling-stroke"/><line x1="84" y1="-120" x2="84" y2="720" vector-effect="non-scaling-stroke"/><line x1="514" y1="-120" x2="514" y2="720" vector-effect="non-scaling-stroke"/><line x1="299" y1="-120" x2="299" y2="720" stroke-dasharray="4 6" vector-effect="non-scaling-stroke"/><line x1="-200" y1="305" x2="800" y2="305" stroke-dasharray="4 6" vector-effect="non-scaling-stroke"/></g>
<text x="566" y="220" style="fill: var(--art-text)" font-size="14" font-family="Be Vietnam Pro, sans-serif" letter-spacing="1">30°</text>
<g id="art-d"><path d="${LOGO_D2}" style="fill: var(--art-d)"/></g>
<g id="art-h"><path id="art-path" d="M84 305 L84 189 L153 150.2 L153 273.5 L326 273.5 L326 205.2 L394 243.5 L394 366.5 L326 404.8 L326 336.5 L153 336.5 L153 459.8 L84 421 L84 305 Z" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" style="stroke: var(--art-h)" stroke-width="0.7"/>
<g id="art-marks" style="fill: var(--art-mark)"><rect x="81" y="186" width="6" height="6"/><rect x="81" y="418" width="6" height="6"/><rect x="323" y="333.5" width="6" height="6"/><rect x="391" y="240.5" width="6" height="6"/><rect x="150" y="270.5" width="6" height="6"/></g>
<g id="art-cursor" class="cursor" role="button" tabindex="0" aria-label="Vẽ lại logo" style="pointer-events: all"><title>Vẽ lại</title><rect x="-6" y="-6" width="70" height="40" fill="transparent"/><path d="${CURSOR_PATH}" fill="#D92D20" stroke="#FFFFFF" stroke-width="1.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/><rect x="13" y="13" width="44" height="15" rx="4" fill="#D92D20"/><text x="35" y="23.6" text-anchor="middle" fill="#FFFFFF" font-size="9.5" font-weight="600" font-family="Be Vietnam Pro, sans-serif">hughdo</text></g></g>
</svg>`;
  const body = `<div class="home-bar">${searchForm('q-home')}${themeToggle()}</div>
<main>
<section class="hero">
  ${logo(230, 'logo-bg')}
  <div class="wrap">
    <div class="text">
      <h1 class="sr-only">${esc(site.title)} – ${esc(site.tagline)}</h1>
      <nav class="hero-nav" aria-label="Chuyên mục">${nav}<button type="button" class="nav-cursor" aria-label="Chạy lại con trỏ" tabindex="-1">${cursorSvg(18)}<span class="cursor-label">hughdo</span></button></nav>
      <p class="quote"><span class="dash"></span><span>${esc(site.quote)}</span></p>
    </div>
    <div class="art">${art}</div>
  </div>
</section>
${latest ? `<section class="latest wrap" aria-labelledby="latest-h">
  <p class="label">Mới nhất</p>
  <div class="latest-inner">
    <div class="head">
      <h2 id="latest-h"><a href="${latest.url}">${esc(latest.title)}</a></h2>
      <div class="side"><p>${esc(latest.excerpt)}</p><div class="meta"><span>${esc(catBySlug[latest.category].name)}</span><span>${fmtDate(latest.date)}</span><span>${latest.readMin} phút đọc</span></div></div>
    </div>
    ${latest.cover ? `<a class="cover" href="${latest.url}" tabindex="-1" aria-hidden="true">${coverImg(latest.cover, '')}</a>` : ''}
  </div>
</section>` : ''}
${rest.length ? `<section class="all-posts wrap" aria-labelledby="by-cat-h">
  <div class="section-head"><h2 id="by-cat-h">Theo chuyên mục</h2><a class="text-link" href="/tat-ca/">Tất cả bài viết</a></div>
  <div class="cat-tabs" role="tablist" aria-label="Chuyên mục" hidden>${cats.filter(c => posts.some(p => p.category === c.slug)).map((c, i) => `<button type="button" role="tab" class="chip" data-tab="${c.slug}" aria-selected="${i === 0}">${esc(c.name)} <span class="n">${posts.filter(p => p.category === c.slug).length}</span></button>`).join('')}</div>
  <div class="cat-groups">${cats.map(c => {
    const all = posts.filter(p => p.category === c.slug);
    const shown = rest.filter(p => p.category === c.slug).slice(0, 3);
    if (!all.length) return '';
    return `<div class="cat-group" data-group="${c.slug}" role="tabpanel">
      <a class="cg-head" href="${catUrl(c.slug)}"><span class="name">${esc(c.name)}</span><span class="n">${all.length} bài</span></a>
      ${shown.map((p, i) => `<a class="cg-post${i === shown.length - 1 ? ' last' : ''}" href="${p.url}"><span class="title">${esc(p.title)}</span><span class="date">${fmtDate(p.date)}</span></a>`).join('')}
      ${all.length > shown.length + (latest.category === c.slug ? 1 : 0) ? `<a class="cg-more" href="${catUrl(c.slug)}">Xem tất cả ${esc(c.name)} →</a>` : ''}
    </div>`;
  }).join('')}</div>
</section>` : ''}
</main>
${footer()}`;
  return layout({ title: '', url: '/', body, bodyClass: 'home' });
}

function postPage(p, posts) {
  const others = posts.filter(x => x !== p);
  const next = [...others.filter(x => x.category === p.category), ...others.filter(x => x.category !== p.category)].slice(0, 3);
  const c = catBySlug[p.category];
  const toc = p.toc.length >= 2 ? `<details class="toc" data-toc><summary><span>Mục lục <span class="n">· ${p.toc.length} mục</span></span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary><ol>${p.toc.map(t => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></details>` : '<aside class="toc" aria-hidden="true"></aside>';
  const body = `${header(p.category)}
<main>
<article>
  <header class="post-head wrap">
    <p class="eyebrow"><span class="dash"></span><a class="c" href="${catUrl(c.slug)}">${esc(c.name)}</a><time datetime="${p.date}">${fmtDate(p.date)}</time><span>${p.readMin} phút đọc</span>${p.draft ? '<span>Bản nháp</span>' : ''}</p>
    <h1>${esc(p.title)}</h1>
  </header>
  ${p.cover ? `<div class="wrap"><figure class="post-cover" style="margin:0">${coverImg(p.cover, p.title, true)}</figure></div>` : ''}
  <div class="post-body wrap">
    ${toc}
    <div class="prose">
${p.html}
      <div class="author">
        <div class="who">${logo(36)}<div><p class="name">${esc(site.title)}</p><p class="q">${esc(site.quote)}</p></div></div>
        <button type="button" class="btn" data-copy-link>Sao chép liên kết</button>
      </div>
    </div>
  </div>
</article>
${next.length ? `<section class="read-next wrap"><p class="label">Đọc tiếp</p><div class="list">${next.map(x => postRow(x)).join('')}<div class="list-end"></div></div></section>` : ''}
</main>
${footer()}`;
  return layout({ title: p.title, description: p.excerpt, url: p.url, body, image: p.cover, type: 'article' });
}

function categoryPage(c, posts) {
  const list = posts.filter(p => p.category === c.slug);
  const [first, ...rest] = list;
  const body = `${header(c.slug)}
<main class="wrap">
  <section class="page-head cat-head">
    <h1 class="big-title">${esc(c.name)}</h1>
    <div class="desc"><p>${esc(c.description)}</p><span class="n">${list.length} bài viết</span></div>
  </section>
  ${first ? `<a class="feature" href="${first.url}">
    ${first.cover ? `<span class="img">${coverImg(first.cover, '', true)}</span>` : ''}
    <span class="t"><span class="meta"><span>Mới nhất</span><span>${fmtDate(first.date)}</span><span>${first.readMin} phút đọc</span></span><span class="title">${esc(first.title)}</span><span class="ex">${esc(first.excerpt)}</span></span>
  </a>` : '<p class="empty">Chưa có bài nào trong chuyên mục này.</p>'}
  ${rest.length ? `<section class="section"><p class="label">Các bài khác</p><div class="list">${rest.map(p => postRow(p, { excerpt: true, cat: false })).join('')}<div class="list-end"></div></div></section>` : ''}
</main>
${footer()}`;
  return layout({ title: c.name, description: c.description, url: catUrl(c.slug), body });
}

function archivePage(posts) {
  const years = [...new Set(posts.map(p => p.date.slice(0, 4)))];
  const chips = [`<button type="button" class="chip" data-filter="all" aria-pressed="true">Tất cả <span class="n">${posts.length}</span></button>`,
    ...cats.map(c => { const n = posts.filter(p => p.category === c.slug).length; return n ? `<button type="button" class="chip" data-filter="${c.slug}" aria-pressed="false">${esc(c.name)} <span class="n">${n}</span></button>` : ''; })].join('');
  const body = `${header('')}
<main class="wrap">
  <section class="page-head">
    <h1 class="archive-title">Tất cả bài viết</h1>
    <div class="chips" role="group" aria-label="Lọc theo chuyên mục">${chips}</div>
    ${years.map(y => `<div class="year-group" data-year="${y}"><h2>${y}</h2><div class="list">${posts.filter(p => p.date.startsWith(y)).map(p => postRow(p)).join('')}<div class="list-end"></div></div></div>`).join('')}
  </section>
</main>
${footer()}`;
  return layout({ title: 'Tất cả bài viết', url: '/tat-ca/', body });
}

function searchPage() {
  const body = `${header('')}
<main class="wrap">
  <section class="page-head">
    <form class="big-search" role="search" action="/tim-kiem/" method="get"><label class="sr-only" for="q-big">Tìm kiếm</label><input id="q-big" type="search" name="q" placeholder="Tìm kiếm…" autocomplete="off" autofocus></form>
    <p class="label" id="search-status" aria-live="polite" style="margin-top:24px"></p>
    <div class="list" id="search-results"></div>
    <div class="empty" id="search-empty" hidden><p>Không tìm thấy bài nào. Thử một chủ đề khác?</p><div class="chips">${cats.map(c => `<a class="pill" href="${catUrl(c.slug)}">${esc(c.name)}</a>`).join('')}</div></div>
  </section>
</main>
${footer()}`;
  return layout({ title: 'Tìm kiếm', url: '/tim-kiem/', body });
}

function aboutPage() {
  const a = site.about;
  const body = `${header('')}
<main class="wrap">
  <section class="about-hero">
    <div class="text">
      <h1>${esc(a.heading_line1)}${inlineCursor(30)}<br>${esc(a.heading_line2)}</h1>
      <p class="intro">${esc(a.intro)}</p>
    </div>
    <div class="logo-side">${logo(360)}</div>
  </section>
  <section><p class="label">Mình viết về</p>${cats.map(c => `<a class="topic" href="${catUrl(c.slug)}"><span class="n">${esc(c.name)}</span><span class="d">${esc(c.description)}</span></a>`).join('')}<div class="list-end"></div></section>
  <section class="contact">
    <div><p class="label">Liên hệ</p><p class="mail"><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p></div>
    <a class="btn" href="/rss.xml">Theo dõi qua RSS</a>
  </section>
</main>
${footer()}`;
  return layout({ title: 'Giới thiệu', description: a.intro, url: '/gioi-thieu/', body });
}

function notFoundPage() {
  const body = `${header('')}
<main class="wrap">
  <section class="nf">
    <div class="text">
      <p class="num" aria-hidden="true">40<span>4${inlineCursor(26)}</span></p>
      <h1>Trang này đi lạc mất rồi.</h1>
      <p class="lead">Có thể đường dẫn đã đổi khi blog chuyển nhà, hoặc bài viết không còn nữa. Thử tìm lại xem sao.</p>
      <div class="actions"><a class="btn solid" href="/">Về trang chủ</a><a class="btn" href="/tim-kiem/">Tìm kiếm</a></div>
    </div>
    <div class="logo-side">${logo(360)}</div>
  </section>
</main>
${footer()}`;
  return layout({ title: 'Không tìm thấy trang', url: '/404', body });
}

// ---------- feed, sitemap ----------
const absolutize = h => h.replace(/(src|href)="\/(?!\/)/g, `$1="${SITE_URL}/`);
function rss(posts) {
  const items = posts.slice(0, 30).map(p => `<item><title>${esc(p.title)}</title><link>${SITE_URL}${p.url}</link><guid isPermaLink="true">${SITE_URL}${p.url}</guid><pubDate>${new Date(p.date + 'T08:00:00+07:00').toUTCString()}</pubDate><category>${esc(catBySlug[p.category].name)}</category><description><![CDATA[${absolutize(p.html).replace(/]]>/g, ']]]]><![CDATA[>')}]]></description></item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${esc(site.title)}</title><link>${SITE_URL}/</link><description>${esc(site.tagline)}</description><language>vi</language>
<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
</channel></rss>
`;
}

// ---------- ghi file ----------
function write(rel, content) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function build() {
  const t0 = Date.now();
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.cpSync(path.join(ROOT, 'public'), OUT, { recursive: true });
  const posts = loadPosts();
  const published = posts.filter(p => !p.draft);
  const listed = SHOW_DRAFTS ? posts : published;

  write('index.html', homePage(listed));
  for (const p of posts) write(p.url + 'index.html', postPage(p, listed));
  for (const c of cats) write(catUrl(c.slug) + 'index.html', categoryPage(c, listed));
  write('tat-ca/index.html', archivePage(listed));
  write('tim-kiem/index.html', searchPage());
  write('gioi-thieu/index.html', aboutPage());
  write('404.html', notFoundPage());
  write('rss.xml', rss(published));
  write('search-index.json', JSON.stringify(listed.map(p => ({ t: p.title, u: p.url, c: catBySlug[p.category].name, d: fmtDate(p.date), e: p.excerpt, k: p.tags.join(' '), b: clip(stripTags(p.html), 4000) }))));
  const urls = ['/', '/tat-ca/', '/gioi-thieu/', ...cats.map(c => catUrl(c.slug)), ...published.map(p => p.url)];
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
  write('robots.txt', `User-agent: *\nDisallow: /admin/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  console.log(`✓ ${posts.length} bài, ${cats.length} chuyên mục → dist/ (${Date.now() - t0}ms)`);
}

build();

// ---------- máy chủ xem thử ----------
if (args.includes('--serve')) {
  const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.yml': 'text/yaml', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
  const port = Number(process.env.PORT) || 4321;
  http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(OUT, p);
    if (!file.startsWith(OUT)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    let status = 200;
    if (!fs.existsSync(file)) { file = path.join(OUT, '404.html'); status = 404; }
    res.writeHead(status, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  }).listen(port, () => console.log(`→ http://localhost:${port}`));
  let timer;
  for (const d of ['content', 'public']) fs.watch(path.join(ROOT, d), { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(() => { try { build(); } catch (e) { console.error(e); } }, 150); });
}
