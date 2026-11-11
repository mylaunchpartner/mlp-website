/* My Launch Partner — GHL embed loader for standalone sections (funnels, sales pages).
   Each GHL Custom JS/HTML element holds only:
     <div data-mlp-embed="seo-audit/checkout-top"></div>
     <script src="https://mylaunchpartner.github.io/mlp-website/embeds/embed.js"></script>
   This script fetches embeds/<name>.html from the repo, inserts it, and runs its scripts.
   Updates in the repo show on the live page within ~5 minutes. No re-pasting in GHL. */
(function () {
  var self = document.currentScript;
  var BASE = self.src.replace(/[?#].*$/, '').replace(/[^\/]*$/, '');
  if (!window.__mlpPixelTag) { window.__mlpPixelTag = 1; var px = document.createElement('script'); px.src = BASE + '../assets/pixel.js'; px.async = true; document.head.appendChild(px); } // Meta Pixel
  var BUST = 'v=' + Math.floor(Date.now() / 300000);
  window.MLP_EMBED_BASE = BASE;
  window.MLP_EMBED_BUST = BUST;

  function run(mount) {
    if (mount.getAttribute('data-mlp-loaded')) return;
    mount.setAttribute('data-mlp-loaded', '1');
    var name = (mount.getAttribute('data-mlp-embed') || '').replace(/[^a-z0-9\/-]/gi, '');
    if (!name) return;
    mount.style.minHeight = mount.getAttribute('data-min-height') || '60vh';
    fetch(BASE + name + '.html?' + BUST).then(function (r) {
      if (!r.ok) throw new Error(name + ' → ' + r.status);
      return r.text();
    }).then(function (html) {
      mount.innerHTML = html;
      mount.style.minHeight = '';
      // innerHTML doesn't run <script> tags, so re-create them in order.
      Array.prototype.forEach.call(mount.querySelectorAll('script'), function (old) {
        var s = document.createElement('script');
        for (var i = 0; i < old.attributes.length; i++) s.setAttribute(old.attributes[i].name, old.attributes[i].value);
        s.text = old.text;
        old.parentNode.replaceChild(s, old);
      });
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
    }).catch(function (err) {
      if (window.console) console.error('[MLP embed]', err);
      mount.style.minHeight = '';
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-mlp-embed]'), run);
})();
