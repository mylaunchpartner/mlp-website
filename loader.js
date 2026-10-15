/* My Launch Partner — GHL page loader
   Each GHL page holds only:
     <div id="mlp-root" data-page="home"></div>
     <script src="https://<host>/loader.js"></script>
   This script fetches the shared design + that page's content from the
   repo, builds the page, then runs the site behaviour and the calendar. */
(function () {
  var mount = document.getElementById('mlp-root');
  if (!mount || mount.getAttribute('data-mlp-loaded')) return;
  mount.setAttribute('data-mlp-loaded', '1');

  var self = document.currentScript;
  var BASE = self.src.replace(/[?#].*$/, '').replace(/[^\/]*$/, '');
  var BUST = 'v=' + Math.floor(Date.now() / 300000); // picks up updates within ~5 min
  var page = (mount.getAttribute('data-page') || 'home').replace(/[^a-z0-9\/-]/gi, '');

  mount.style.minHeight = '100vh';
  mount.style.background = '#f6f7fc';

  function url(p) { return BASE + p + '?' + BUST; }
  function get(p) {
    return fetch(url(p)).then(function (r) {
      if (!r.ok) throw new Error(p + ' → ' + r.status);
      return r.text();
    });
  }
  function head(tag, attrs) {
    var el = document.createElement(tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    document.head.appendChild(el);
    return el;
  }
  function stylesheet() {
    return new Promise(function (done) {
      var l = head('link', { rel: 'stylesheet', href: url('assets/mlp.css') });
      l.onload = l.onerror = done;
      setTimeout(done, 4000);
    });
  }
  function script(src) {
    return new Promise(function (done, fail) {
      var s = document.createElement('script');
      s.src = src; s.onload = done; s.onerror = fail;
      document.body.appendChild(s);
    });
  }

  head('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' });
  head('link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' });
  head('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap' });

  Promise.all([
    stylesheet(),
    get('partials/sprite.svg'),
    get('partials/nav.html'),
    get('pages/' + page + '.html'),
    get('partials/booking.html'),
    get('partials/footer.html')
  ]).then(function (p) {
    var body = p[3];
    var sub = body.match(/<!--\s*book-sub:\s*([\s\S]*?)\s*-->/);
    var booking = p[4].replace('{{BOOK_SUB}}', sub ? sub[1] : '');

    mount.innerHTML = p[1] + '<div id="mlp-fs">' + p[2] + body + booking + p[5] + '</div>';
    mount.style.minHeight = '';
    mount.style.background = '';

    /* Highlight this page in the Specialty Industries menu */
    if (page.indexOf('specialty/') === 0) {
      var slug = page.split('/')[1];
      var link = mount.querySelector('.mlp-dd-menu a[href="/specialty-industries/' + slug + '"]');
      if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'page'); }
    }

    return script(url('assets/mlp.js'));
  }).then(function () {
    return script('https://api.leadconnectorhq.com/js/form_embed.js');
  }).catch(function (err) {
    if (window.console) console.error('[MLP loader]', err);
    mount.style.minHeight = '';
    mount.innerHTML = '<p style="padding:80px 24px;text-align:center;font:16px/1.6 -apple-system,sans-serif;color:#283052">' +
      'Sorry, this page didn’t load. Please refresh, or email ' +
      '<a href="mailto:hi@mylaunchpartner.ai">hi@mylaunchpartner.ai</a>.</p>';
  });
})();
