/* My Launch Partner — sitewide SEO head tags + structured data.
   Loaded by loader.js (website pages) and embeds/embed.js (funnel pages).
   Adds only what GHL didn't already output, so GHL settings always win.
   Call window.MLPSEO.page() after page content is in the DOM to add the
   page-level schema (FAQ, breadcrumbs, service). */
(function () {
  if (window.MLPSEO) return;
  var SITE = 'https://mylaunchpartner.ai';
  var BASE = 'https://mylaunchpartner.github.io/mlp-website/';
  var OG = BASE + 'assets/og-image.jpg';
  var ORG_ID = SITE + '/#organization';

  function q(s) { return document.head.querySelector(s); }
  function add(tag, attrs) {
    var el = document.createElement(tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    document.head.appendChild(el);
    return el;
  }
  function meta(key, val, attr) {
    attr = attr || 'property';
    if (!q('meta[' + attr + '="' + key + '"]')) add('meta', (function () { var a = {}; a[attr] = key; a.content = val; return a; })());
  }
  function ld(id, obj) {
    if (document.getElementById(id)) return;
    var s = document.createElement('script');
    s.type = 'application/ld+json'; s.id = id;
    s.text = JSON.stringify(obj);
    document.head.appendChild(s);
  }
  function clean(t) { return (t || '').replace(/\s+/g, ' ').trim(); }

  var path = location.pathname.replace(/\/+$/, '') || '/';
  var here = SITE + (path === '/' ? '' : path);

  /* Canonical + social tags */
  if (!q('link[rel="canonical"]')) add('link', { rel: 'canonical', href: here });
  var desc = (q('meta[name="description"]') || {}).content || '';
  meta('og:site_name', 'My Launch Partner');
  meta('og:url', here);
  meta('og:title', document.title);
  if (desc) meta('og:description', desc);
  meta('og:image', OG);
  meta('og:image:width', '1200');
  meta('og:image:height', '630');
  meta('og:locale', 'en_US');
  meta('twitter:card', 'summary_large_image', 'name');
  meta('twitter:title', document.title, 'name');
  if (desc) meta('twitter:description', desc, 'name');
  meta('twitter:image', OG, 'name');

  /* Who we are (every page) */
  ld('mlp-ld-org', {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': ORG_ID,
        name: 'My Launch Partner',
        legalName: 'My Launch Partner LLC',
        url: SITE + '/',
        logo: BASE + 'assets/logo.png',
        image: OG,
        email: 'hi@mylaunchpartner.ai',
        description: 'Full-stack growth agency: SEO and local search, Meta and Google ads, video creative, web design and custom CRM operations from one team.',
        founder: { '@type': 'Person', name: 'Samantha Martinez' },
        address: { '@type': 'PostalAddress', addressLocality: 'Sedona', addressRegion: 'AZ', addressCountry: 'US' },
        areaServed: { '@type': 'Country', name: 'United States' },
        knowsAbout: ['Search engine optimization', 'Local SEO', 'Google Business Profile', 'Meta Ads', 'Google Ads', 'Video editing', 'Web design', 'Sales funnels', 'GoHighLevel', 'HubSpot', 'Keap', 'CRM automation'],
        sameAs: ['https://www.instagram.com/mylaunchpartner/', 'https://www.facebook.com/542965208900394'],
        makesOffer: {
          '@type': 'Offer',
          name: '$1 SEO Audit',
          url: SITE + '/audit',
          price: '1.00',
          priceCurrency: 'USD',
          description: 'A full SEO audit of your business: where you rank, who is beating you and what to fix first, plus a walkthrough call.'
        }
      },
      { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: 'My Launch Partner', publisher: { '@id': ORG_ID } }
    ]
  });

  /* Page-level schema, built from what's on the page */
  function page() {
    var root = document.getElementById('mlp-root') || document.body;
    var graph = [];
    var h1 = root.querySelector('h1');

    var crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' }];
    if (path.indexOf('/specialty-industries/') === 0) {
      var name = clean((root.querySelector('.mlp-crumb span') || {}).textContent) || clean(document.title.split('|')[0]);
      crumbs.push({ '@type': 'ListItem', position: 2, name: name, item: here });
      graph.push({
        '@type': 'Service',
        '@id': here + '#service',
        name: clean(document.title.split('|')[0]),
        serviceType: 'Marketing agency services',
        description: desc || clean(h1 && h1.textContent),
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'Country', name: 'United States' },
        url: here
      });
    } else if (path === '/seo' || path === '/performance-based-seo') {
      if (path === '/performance-based-seo') crumbs.push({ '@type': 'ListItem', position: 2, name: 'SEO Services', item: SITE + '/seo' });
      crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: path === '/seo' ? 'SEO Services' : 'Performance-Based SEO', item: here });
      graph.push({
        '@type': 'Service',
        '@id': here + '#service',
        name: path === '/seo' ? 'SEO Services' : 'Performance-Based SEO',
        serviceType: 'Search engine optimization',
        description: desc || clean(h1 && h1.textContent),
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'Country', name: 'United States' },
        url: here
      });
    } else if (path !== '/') {
      crumbs.push({ '@type': 'ListItem', position: 2, name: clean(document.title.split('|')[0]), item: here });
    }
    if (crumbs.length > 1) graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs });

    var faqs = [];
    Array.prototype.forEach.call(root.querySelectorAll('details'), function (d) {
      var s = d.querySelector('summary'), a = d.querySelector('p, div');
      if (s && a && clean(s.textContent) && clean(a.textContent)) {
        faqs.push({ '@type': 'Question', name: clean(s.textContent), acceptedAnswer: { '@type': 'Answer', text: clean(a.textContent) } });
      }
    });
    if (faqs.length) graph.push({ '@type': 'FAQPage', '@id': here + '#faq', mainEntity: faqs });

    var old = document.getElementById('mlp-ld-page'); if (old) old.parentNode.removeChild(old);
    if (graph.length) ld('mlp-ld-page', { '@context': 'https://schema.org', '@graph': graph });
  }

  window.MLPSEO = { page: page };
})();
