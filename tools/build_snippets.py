#!/usr/bin/env python3
"""Build the GHL paste-in snippet for each website page.

Each snippet carries a static copy of the page inside #mlp-root, so search and
AI crawlers that don't run JavaScript still see the full text, headings and
links. loader.js then replaces it with the live version from this repo, so
visitors always get the latest content.

Run after changing page copy, then re-paste the changed snippet(s) in GHL:
    python3 tools/build_snippets.py
"""
import os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOST = 'https://mylaunchpartner.github.io/mlp-website/'
PAGES = ['home', 'privacy-policy', 'terms'] + ['specialty/' + f[:-5] for f in sorted(os.listdir(os.path.join(ROOT, 'pages/specialty'))) if f.endswith('.html')]

def read(p):
    return open(os.path.join(ROOT, p), encoding='utf-8').read()

def strip(html):
    html = re.sub(r'<!--.*?-->', '', html, flags=re.S)
    html = re.sub(r'<script\b.*?</script>', '', html, flags=re.S)
    html = re.sub(r'<iframe\b.*?</iframe>', '', html, flags=re.S)  # calendar loads with the live page
    html = re.sub(r'\n\s*\n+', '\n', html)
    return re.sub(r'[ \t]+', ' ', html).strip()

os.makedirs(os.path.join(ROOT, 'snippets'), exist_ok=True)
for page in PAGES:
    body = read('pages/%s.html' % page)
    sub = re.search(r'<!--\s*book-sub:\s*([\s\S]*?)\s*-->', body)
    booking = read('partials/booking.html').replace('{{BOOK_SUB}}', sub.group(1) if sub else '')
    static = read('partials/sprite.svg') + '<div id="mlp-fs">' + read('partials/nav.html') + body + booking + read('partials/footer.html') + '</div>'
    snippet = ('<link rel="stylesheet" href="%sassets/mlp.css">\n'
               '<div id="mlp-root" data-page="%s">%s</div>\n'
               '<script src="%sloader.js"></script>\n') % (HOST, page, strip(static), HOST)
    out = os.path.join(ROOT, 'snippets', page.replace('/', '--') + '.html')
    snippet = snippet.encode('ascii', 'xmlcharrefreplace').decode()  # safe whatever charset GHL serves
    open(out, 'w', encoding='utf-8').write(snippet)
    print('%-45s %6d bytes' % (os.path.relpath(out, ROOT), len(snippet)))
