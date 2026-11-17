#!/usr/bin/env python3
"""Rebuild lli-results.json from the LLI rank log (SEO/RANKINGS.md on Samantha's Mac).

Usage:
  python3 update_lli_results.py RANKINGS.md --articles 135

Reads the newest "## YYYY-MM-DD" table, keeps the searches on page one, and writes
lli-results.json next to this script. The $1 audit sales page reads that file on every load.
It also rewrites the LLI proof numbers on the /seo page (pages/seo.html, the elements
marked data-lli="..."), which loader.js serves live within about 5 minutes.
Only real rank-check numbers go in. Nothing is estimated.
"""
import argparse, datetime, json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[2]
SEO_PAGE = ROOT / 'pages' / 'seo.html'

LAUNCH = datetime.date(2026, 10, 7)        # new LLI site went live
FIRST_PAGE_ONE = datetime.date(2026, 10, 21)  # first rank check: 8 of 12 on page one
BRAND = 'louisville lead inspections'
SHOW = 6

def newest_check(text):
    parts = re.split(r'^## (\d{4}-\d{2}-\d{2})[^\n]*\n', text, flags=re.M)
    if len(parts) < 3:
        raise SystemExit('No dated "## YYYY-MM-DD" section found in the rank log.')
    date, body = parts[1], parts[2]
    rows = []
    for line in body.splitlines():
        m = re.match(r'\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|', line)
        if m:
            pos = m.group(3).strip()
            rows.append({'n': int(m.group(1)), 'search': m.group(2).strip(), 'position': int(pos) if pos.isdigit() else None})
    if not rows:
        raise SystemExit('Newest section %s has no table rows.' % date)
    return datetime.date.fromisoformat(date), rows

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('rankings')
    ap.add_argument('--articles', type=int, required=True, help='LLI blog posts published so far')
    a = ap.parse_args()
    checked, rows = newest_check(pathlib.Path(a.rankings).read_text())
    page_one = sorted([r for r in rows if r['position']], key=lambda r: (r['position'], r['n']))
    brand = next((r for r in rows if r['search'] == BRAND), None)
    weeks = max(1, round((checked - LAUNCH).days / 7))
    days_to_p1 = (FIRST_PAGE_ONE - LAUNCH).days
    stats = []
    if brand and brand['position']:
        stats.append({'value': '#%d' % brand['position'], 'label': 'for "%s"' % BRAND})
    stats.append({'value': '%d of %d' % (len(page_one), len(rows)), 'label': 'target searches on page 1'})
    stats.append({'value': '%d+' % (a.articles // 10 * 10), 'label': 'local articles published in %d weeks' % weeks})
    stats.append({'value': '%d weeks' % round(days_to_p1 / 7), 'label': 'from launch to page 1'})
    out = {
        'client': 'Louisville Lead Inspections',
        'checked': checked.isoformat(),
        'checked_label': checked.strftime('%b ') + str(checked.day) + checked.strftime(', %Y'),
        'stats': stats,
        'rankings': [{'search': r['search'], 'position': r['position']} for r in page_one[:SHOW]],
        'page_one': len(page_one),
        'tracked': len(rows),
        'articles': a.articles,
        'updated_at': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'),
    }
    dest = pathlib.Path(__file__).with_name('lli-results.json')
    dest.write_text(json.dumps(out, indent=2) + '\n')
    print('Wrote %s: checked %s, %d of %d on page one, %d articles' % (dest.name, out['checked'], len(page_one), len(rows), a.articles))
    update_seo_page(out, brand, weeks)

def update_seo_page(out, brand, weeks):
    """Fill the data-lli="..." elements on pages/seo.html with this check's numbers."""
    if not (brand and brand['position']):
        raise SystemExit('"%s" is not on page one this week. JSON written, /seo page left unchanged: review its brand card by hand.' % BRAND)
    pos = brand['position']
    values = {
        'brand': '#%d' % pos,
        'brand-text': 'ranks first' if pos == 1 else 'ranks #%d' % pos,
        'page-one': '%d of %d' % (out['page_one'], out['tracked']),
        'articles': '%d+' % (out['articles'] // 10 * 10),
        'weeks': '%d weeks' % weeks,
        'checked': out['checked_label'],
    }
    html = SEO_PAGE.read_text(encoding='utf-8')
    for key, val in values.items():
        pat = re.compile(r'(<(\w+)[^>]*\bdata-lli="%s"[^>]*>)[^<]*(</\2>)' % re.escape(key))
        html, n = pat.subn(lambda m: m.group(1) + val + m.group(3), html)
        if n != 1:
            raise SystemExit('pages/seo.html: expected one data-lli="%s" element, found %d. Page left unchanged.' % (key, n))
    SEO_PAGE.write_text(html, encoding='utf-8')
    print('Updated pages/seo.html: %s' % ', '.join('%s=%s' % kv for kv in values.items()))

if __name__ == '__main__':
    main()
