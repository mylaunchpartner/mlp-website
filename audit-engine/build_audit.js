#!/usr/bin/env node
/*
  MLP $1 SEO Audit: branded PDF builder.
  Usage: node build_audit.js path/to/audit.json [out.pdf]
  Needs Playwright with Chromium (preinstalled in Claude's workspace; elsewhere: npm i playwright && npx playwright install chromium).

  The JSON holds all content (see samples/sample-audit.json for every field). This file holds layout only.
  Status words: pass | warn | fail.  Rankings: organic / maps = position number, or null when not in the top results checked.
  Client-facing rules: never mention AI. Never invent volumes, reviews or rankings. Leave a field out rather than guess.
*/
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const inPath = process.argv[2];
if (!inPath) { console.error('Usage: node build_audit.js audit.json [out.pdf]'); process.exit(1); }
const A = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const slug = (A.business.name || 'audit').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const outPath = process.argv[3] || path.join(HERE, 'out', `MLP-SEO-Audit-${slug}-${A.date}.pdf`);

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const b64 = f => fs.readFileSync(f).toString('base64');
const font = (fam, w, file) => `@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(HERE, 'fonts', file))}) format('woff2');}`;
const fonts = [400, 500, 600, 700, 800].map(w => font('Jakarta', w, `plus-jakarta-sans-latin-${w}-normal.woff2`)).join('')
  + [500, 700].map(w => font('Mono', w, `jetbrains-mono-latin-${w}-normal.woff2`)).join('');
const logoFile = path.join(HERE, '..', 'assets', 'logo.png');
const logo = fs.existsSync(logoFile) ? `data:image/png;base64,${b64(logoFile)}` : '';

const fmtDate = d => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const scoreColor = n => n >= 75 ? '#059669' : n >= 50 ? '#D97706' : '#DC2626';
const ring = (n, size, stroke, track = 'rgba(255,255,255,.14)', text = '#fff') => {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(100, n)) / 100);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track}" stroke-width="${stroke}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${scoreColor(n)}" stroke-width="${stroke}" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Jakarta" font-weight="800" font-size="${size * 0.32}" fill="${text}">${n}</text>
  </svg>`;
};
const chip = st => {
  const m = { pass: ['Good', 'ok'], warn: ['Needs work', 'warn'], fail: ['Fix', 'bad'] }[st] || [esc(st), 'warn'];
  return `<span class="chip ${m[1]}">${m[0]}</span>`;
};
const pos = p => {
  if (p == null) return `<span class="chip bad">Not found</span>`;
  const cls = p <= 3 ? 'ok' : p <= 10 ? 'okish' : p <= 20 ? 'warn' : 'bad';
  const label = p <= 10 ? `#${p}` : `#${p} · page ${Math.ceil(p / 10)}`;
  return `<span class="chip ${cls}">${label}</span>`;
};
const mapsPos = p => {
  if (p == null) return `<span class="chip bad">Not found</span>`;
  const cls = p <= 3 ? 'ok' : p <= 6 ? 'warn' : 'bad';
  return `<span class="chip ${cls}">#${p}${p <= 3 ? ' · map pack' : ''}</span>`;
};
const sec = (kicker, title, body, opts = {}) => `<section class="sec${opts.newPage ? ' np' : ''}">
  <div class="kicker">${esc(kicker)}</div><h2>${esc(title)}</h2>${body}</section>`;

const B = A.business, S = A.score;

/* ---------- sections ---------- */
const cover = `<div class="cover">
  <div class="glow a"></div><div class="glow b"></div>
  <div class="brand">${logo ? `<img src="${logo}">` : ''}My Launch Partner</div>
  <div class="cv-body">
    <div class="kicker lil">SEO AUDIT · ${esc(fmtDate(A.date).toUpperCase())}</div>
    <h1>${esc(B.name)}</h1>
    <div class="site">${esc(B.website || 'No website yet')}${B.city ? ` · ${esc(B.city)}` : ''}</div>
    <div class="cv-score">${ring(S.overall, 210, 18)}<div><div class="lbl">Overall visibility score</div>
      <p>How easily customers in your area can find you on Google today, out of 100.</p></div></div>
  </div>
  <div class="cv-foot">Prepared by Samantha Martinez | My Launch Partner</div>
</div>`;

const short = sec('THE SHORT VERSION', 'What we found', `
  <p class="lead">${esc(A.summary)}</p>
  <div class="cats">${S.categories.map(c => `<div class="cat">
    <div class="cat-top"><span>${esc(c.name)}</span><b style="color:${scoreColor(c.score)}">${c.score}</b></div>
    <div class="bar"><i style="width:${c.score}%;background:${scoreColor(c.score)}"></i></div>
    <div class="cat-note">${esc(c.note)}</div></div>`).join('')}</div>
  <h3>Your 3 biggest wins</h3>
  <div class="fixes">${A.top_fixes.map((f, i) => `<div class="fix">
    <div class="fix-n">0${i + 1}</div>
    <div><div class="fix-t">${esc(f.title)}</div><p>${esc(f.why)}</p>
    <div class="fix-meta"><span class="chip ${f.impact === 'High' ? 'violet' : 'blue'}">${esc(f.impact)} impact</span>${f.effort ? `<span class="chip grey">${esc(f.effort)}</span>` : ''}</div></div></div>`).join('')}</div>`);

const rankings = sec('WHERE YOU SHOW UP', 'Your 5 searches on Google', `
  <p class="sub">We searched each of these as a customer in ${esc(B.city || 'your area')} would. "Search results" is the regular list of websites. "Map results" is the Google Maps list, where the top 3 get most of the calls.</p>
  <table><thead><tr><th>Search</th><th>Search results</th><th>Map results</th><th>Who's winning it</th></tr></thead><tbody>
  ${A.rankings.map(r => `<tr><td class="q">"${esc(r.query)}"</td><td>${pos(r.organic)}</td><td>${mapsPos(r.maps)}</td><td>${esc(r.leader || '')}</td></tr>`).join('')}
  </tbody></table>
  ${A.competitors && A.competitors.length ? (() => {
    const max = Math.max(...A.competitors.map(c => c.reviews || 0), 1);
    return `<h3>You vs. the competition</h3><div class="comps">${A.competitors.map(c => `<div class="comp${c.you ? ' you' : ''}">
      <div class="comp-h"><div><div class="comp-n">${esc(c.name)}</div><div class="comp-w">${esc(c.website || '')}</div></div>
      <div class="comp-r">${c.rating != null ? `<b>${c.rating}</b>★` : ''}</div></div>
      <div class="rv"><div class="bar"><i style="width:${Math.max(2, (c.reviews || 0) / max * 100)}%"></i></div><span>${c.reviews ?? 0} reviews</span></div>
      <p>${esc(c.edge || '')}</p></div>`).join('')}</div>`;
  })() : ''}`, { newPage: true });

const W = A.website || {};
const sp = W.speed;
const website = W.checks ? sec('YOUR WEBSITE', 'Website health check', `
  ${sp ? `<div class="speed">
    <div class="g">${ring(sp.mobile, 104, 10, '#E2E5F0', '#0B1026')}<div><b>Phone speed</b><span>Most of your customers search on a phone.</span></div></div>
    <div class="g">${ring(sp.desktop, 104, 10, '#E2E5F0', '#0B1026')}<div><b>Computer speed</b><span>Out of 100, from Google's own speed test.</span></div></div>
    <div class="vit">${sp.lcp ? `<div><span>Main content loads in</span><b>${esc(sp.lcp)}</b></div>` : ''}${sp.inp ? `<div><span>Responds to taps in</span><b>${esc(sp.inp)}</b></div>` : ''}${sp.cls ? `<div><span>Layout shift</span><b>${esc(sp.cls)}</b></div>` : ''}</div>
  </div>` : ''}
  <div class="checks">${W.checks.map(c => `<div class="ck"><div class="ck-t">${esc(c.check)}</div>${chip(c.status)}<div class="ck-d">${esc(c.detail)}</div></div>`).join('')}</div>`, { newPage: true }) : '';

const gbp = A.gbp ? sec('GOOGLE BUSINESS PROFILE', 'Your Google Maps listing', `
  <p class="sub">This is the listing that shows up in Google Maps and the map box at the top of search results. For local businesses, it often brings in more calls than the website.</p>
  <div class="checks">${A.gbp.map(c => `<div class="ck"><div class="ck-t">${esc(c.check)}</div>${chip(c.status)}<div class="ck-d">${esc(c.detail)}</div></div>`).join('')}</div>`, { newPage: true }) : '';

const opps = A.opportunities && A.opportunities.length ? sec('UNTAPPED SEARCHES', 'Searches you could win next', `
  <div class="opps">${A.opportunities.map(o => `<div class="opp"><div class="q">"${esc(o.query)}"</div><p>${esc(o.note)}</p></div>`).join('')}</div>`) : '';

const plan = sec('THE PLAN', 'Your next 90 days', `
  <div class="plan">${A.plan.map(p => `<div class="pl"><div class="pl-w">${esc(p.when)}</div><div class="pl-t">${esc(p.what)}</div></div>`).join('')}</div>
  <div class="cta">
    <div class="glow a"></div>
    <div class="kicker lil">WANT US TO DO IT FOR YOU?</div>
    <h2>Pay for results, not promises.</h2>
    <p>With our performance plan, you only pay performance fees when your searches hit page 1 of Google. On our call we'll walk through this audit together and show you exactly what we'd fix first.</p>
    <div class="cta-line">mylaunchpartner.ai</div>
  </div>`, { newPage: true });

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
@page { size: Letter; margin: 0.6in 0.6in 0.75in; }
@page :first { margin: 0; }
:root { --navy:#0B1026; --ink:#283052; --muted:#5B6482; --violet:#7C3AED; --lilac:#C4B5FD; --ground:#F6F7FC; --line:#E2E5F0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Jakarta, sans-serif; color: var(--ink); font-size: 10.5pt; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
h1, h2, h3, p { margin: 0; }
.kicker { font-family: Mono, monospace; font-weight: 700; font-size: 8pt; letter-spacing: .14em; color: var(--violet); }
.kicker.lil { color: var(--lilac); }
.chip { display: inline-block; font-weight: 700; font-size: 8pt; padding: 3px 9px; border-radius: 99px; white-space: nowrap; }
.chip.ok { background: #D1FAE5; color: #047857; } .chip.okish { background: #E0F2FE; color: #0369A1; }
.chip.warn { background: #FEF3C7; color: #B45309; } .chip.bad { background: #FEE2E2; color: #B91C1C; }
.chip.violet { background: #EDE9FE; color: #6D28D9; } .chip.blue { background: #E0F2FE; color: #0369A1; } .chip.grey { background: var(--ground); color: var(--muted); }
.bar { height: 7px; background: var(--line); border-radius: 99px; overflow: hidden; } .bar i { display: block; height: 100%; border-radius: 99px; background: var(--violet); }
.glow { position: absolute; border-radius: 50%; filter: blur(90px); }

/* cover */
.cover { position: relative; overflow: hidden; height: 11in; background: var(--navy); color: #fff; padding: .7in; display: flex; flex-direction: column; break-after: page; }
.cover .glow.a { width: 6in; height: 6in; left: -2in; top: -2.6in; background: rgba(124,58,237,.55); }
.cover .glow.b { width: 5in; height: 5in; right: -2in; bottom: -2in; background: rgba(34,211,238,.28); }
.brand { position: relative; display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 13pt; }
.brand img { width: 30px; height: 30px; }
.cv-body { position: relative; margin-top: auto; margin-bottom: auto; }
.cover h1 { margin-top: 14px; font-weight: 800; font-size: 44pt; line-height: 1.02; letter-spacing: -.03em; }
.site { margin-top: 12px; font-size: 14pt; color: #D4D8E8; }
.cv-score { margin-top: .55in; display: flex; align-items: center; gap: 28px; }
.cv-score .lbl { font-weight: 800; font-size: 17pt; } .cv-score p { margin-top: 6px; color: #AEB4CC; max-width: 3in; }
.cv-foot { position: relative; font-size: 9pt; color: #8E95B2; }

/* sections */
.sec { margin-bottom: 26px; } .sec.np { break-before: page; }
.sec > h2 { margin-top: 4px; font-weight: 800; font-size: 22pt; letter-spacing: -.02em; color: var(--navy); margin-bottom: 12px; }
h3 { font-weight: 800; font-size: 13.5pt; color: var(--navy); margin: 22px 0 10px; }
.lead { font-size: 12pt; color: var(--ink); }
.sub { color: var(--muted); margin-bottom: 14px; }
.cats { margin-top: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px 22px; }
.cat-top { display: flex; justify-content: space-between; font-weight: 700; color: var(--navy); margin-bottom: 6px; } .cat-top b { font-size: 12pt; }
.cat-note { margin-top: 5px; font-size: 9pt; color: var(--muted); }
.fixes { display: grid; gap: 10px; }
.fix { display: grid; grid-template-columns: 38px 1fr; gap: 12px; border: 1.5px solid var(--line); border-radius: 14px; padding: 13px 15px; break-inside: avoid; }
.fix-n { width: 38px; height: 38px; border-radius: 50%; background: var(--violet); color: #fff; display: grid; place-items: center; font-family: Mono; font-weight: 700; font-size: 10pt; }
.fix-t { font-weight: 800; color: var(--navy); font-size: 11.5pt; } .fix p { margin-top: 3px; color: var(--muted); font-size: 9.5pt; }
.fix-meta { margin-top: 7px; display: flex; gap: 6px; }
table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
th { text-align: left; font-family: Mono; font-size: 7.5pt; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); font-weight: 700; padding: 8px 8px; border-bottom: 1.5px solid var(--line); }
td { padding: 9px 8px; border-bottom: 1px solid var(--line); vertical-align: middle; } td.q { font-weight: 700; color: var(--navy); }
tr { break-inside: avoid; }
.comps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.comp { border: 1.5px solid var(--line); border-radius: 14px; padding: 12px 13px; break-inside: avoid; }
.comp.you { border-color: var(--violet); background: #FAF8FF; }
.comp-h { display: flex; justify-content: space-between; gap: 8px; } .comp-n { font-weight: 800; color: var(--navy); font-size: 10pt; line-height: 1.25; }
.comp-w { font-size: 8pt; color: var(--muted); } .comp-r { font-size: 10pt; color: #D97706; white-space: nowrap; } .comp-r b { color: var(--navy); }
.rv { margin: 10px 0 8px; } .rv span { display: block; margin-top: 4px; font-size: 8.5pt; font-weight: 700; color: var(--navy); }
.comp p { font-size: 8.5pt; color: var(--muted); line-height: 1.4; }
.speed { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: var(--ground); border-radius: 16px; padding: 16px; margin-bottom: 16px; break-inside: avoid; }
.speed .g { display: flex; align-items: center; gap: 14px; } .speed .g b { display: block; color: var(--navy); font-size: 11pt; } .speed .g span { font-size: 9pt; color: var(--muted); }
.vit { grid-column: 1 / -1; display: flex; gap: 10px; } .vit div { flex: 1; background: #fff; border-radius: 10px; padding: 8px 12px; }
.vit span { display: block; font-size: 8pt; color: var(--muted); } .vit b { font-size: 12pt; color: var(--navy); }
.checks { display: grid; gap: 0; }
.ck { display: grid; grid-template-columns: 1.6in 0.95in 1fr; gap: 10px; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--line); break-inside: avoid; }
.ck-t { font-weight: 700; color: var(--navy); } .ck-d { color: var(--muted); font-size: 9.5pt; }
.opps { display: grid; gap: 9px; } .opp { background: var(--ground); border-radius: 12px; padding: 11px 14px; break-inside: avoid; }
.opp .q { font-weight: 800; color: var(--navy); } .opp p { color: var(--muted); font-size: 9.5pt; margin-top: 2px; }
.plan { display: grid; gap: 10px; margin-bottom: 22px; }
.pl { display: grid; grid-template-columns: 1.15in 1fr; gap: 14px; border-left: 3px solid var(--violet); padding: 4px 0 4px 14px; break-inside: avoid; }
.pl-w { font-family: Mono; font-weight: 700; font-size: 9pt; color: var(--violet); padding-top: 2px; } .pl-t { color: var(--ink); }
.cta { position: relative; overflow: hidden; background: var(--navy); color: #fff; border-radius: 20px; padding: 26px 28px; break-inside: avoid; }
.cta .glow.a { width: 3.5in; height: 3.5in; right: -1in; top: -1.8in; background: rgba(124,58,237,.6); }
.cta > *:not(.glow) { position: relative; } .cta h2 { margin-top: 8px; font-weight: 800; font-size: 20pt; letter-spacing: -.02em; }
.cta p { margin-top: 8px; color: #D4D8E8; } .cta-line { margin-top: 14px; font-family: Mono; font-weight: 700; color: var(--lilac); }
</style></head><body>${cover}${short}${rankings}${website}${gbp}${opps}${plan}</body></html>`;

(async () => {
  const { chromium } = require('playwright');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const htmlPath = outPath.replace(/\.pdf$/, '.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(htmlPath));
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: outPath, format: 'Letter', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: `<div style="width:100%;font-family:Helvetica,Arial,sans-serif;font-size:7.5px;color:#8E95B2;padding:0 0.6in;display:flex;justify-content:space-between;">
      <span>${esc(B.name)} · SEO Audit · Prepared by Samantha Martinez | My Launch Partner</span><span class="pageNumber"></span></div>`
  });
  await browser.close();
  console.log(outPath);
})();
