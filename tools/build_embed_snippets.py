#!/usr/bin/env python3
"""Build GHL paste-in snippets for the funnel embeds (the $1 SEO audit pages).

Same idea as build_snippets.py: each snippet carries a static copy of the
section inside its data-mlp-embed div, so search and AI crawlers that don't run
JavaScript still see the full text, headings and links. embed.js then replaces
it with the live version from this repo, so visitors always get the latest.

Run after changing an embed's copy, then re-paste the changed snippet in GHL:
    python3 tools/build_embed_snippets.py
"""
import os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOST = 'https://mylaunchpartner.github.io/mlp-website/'

# embed name -> extra attributes on the mount div (must match the README snippets)
EMBEDS = {
    'seo-audit/checkout-top': '',
    'seo-audit/checkout-bottom': ' data-min-height="0"',
}

def strip(html):
    html = re.sub(r'<!--.*?-->', '', html, flags=re.S)
    html = re.sub(r'<script\b.*?</script>', '', html, flags=re.S)  # embed.js re-runs the live scripts
    html = re.sub(r'\n\s*\n+', '\n', html)
    return re.sub(r'[ \t]+', ' ', html).strip()

out_dir = os.path.join(ROOT, 'snippets')
os.makedirs(out_dir, exist_ok=True)
for name, attrs in EMBEDS.items():
    body = open(os.path.join(ROOT, 'embeds', name + '.html'), encoding='utf-8').read()
    snippet = ('<div data-mlp-embed="%s"%s>%s</div>\n'
               '<script src="%sembeds/embed.js"></script>\n') % (name, attrs, strip(body), HOST)
    snippet = snippet.encode('ascii', 'xmlcharrefreplace').decode()  # safe whatever charset GHL serves
    out = os.path.join(out_dir, 'embed--' + name.replace('/', '--') + '.html')
    open(out, 'w', encoding='utf-8').write(snippet)
    print('%-50s %6d bytes' % (os.path.relpath(out, ROOT), len(snippet)))
