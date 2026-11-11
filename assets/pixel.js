/* My Launch Partner — Meta Pixel (dataset "My Launch Partner", ID 1520209206590271).
   Loaded by loader.js (every site page) and embeds/embed.js (funnel pages), so it
   runs sitewide. Fires once per page load:
     - PageView on every page (re-engagement audiences)
     - ViewContent on the $1 SEO audit checkout page
     - InitiateCheckout the first time someone starts the audit order form
     - Purchase ($1 USD) on the audit thank-you page, once per browser session
     - Nonprofit audit funnel (/better-bridge): ViewContent, InitiateCheckout, Purchase ($5)
   Funnels that don't use loader.js/embed.js load this file from their GHL head tracking code. */
(function () {
  if (window.__mlpPixel) return;
  window.__mlpPixel = true;
  var PIXEL_ID = '1520209206590271';

  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  var path = location.pathname.toLowerCase();
  var isThanks = /thank/.test(path) && /audit/.test(path);
  var isAudit = !isThanks && !/form-received/.test(path) && /(^\/audit\/?$|seo-audit)/.test(path);

  if (isThanks) {
    var key = 'mlp_px_purchase';
    var done = false;
    try { done = sessionStorage.getItem(key) === '1'; } catch (e) {}
    if (!done) {
      fbq('track', 'Purchase', { value: 1.00, currency: 'USD', content_name: '$1 SEO Audit' });
      try { sessionStorage.setItem(key, '1'); } catch (e) {}
    }
  }

  // Nonprofit audit funnel (Better Bridge, "Give $5 Get an Audit")
  var isBBThanks = /better-bridge-thank-you/.test(path);
  var isBB = /^\/better-bridge\/?$/.test(path);
  if (isBBThanks) {
    var k2 = 'mlp_px_purchase_bb', d2 = false;
    try { d2 = sessionStorage.getItem(k2) === '1'; } catch (e) {}
    if (!d2) {
      fbq('track', 'Purchase', { value: 5.00, currency: 'USD', content_name: 'Nonprofit Audit (Better Bridge)' });
      try { sessionStorage.setItem(k2, '1'); } catch (e) {}
    }
  }
  if (isBB) isAudit = true;

  if (isAudit) {
    var nm = isBB ? 'Nonprofit Audit (Better Bridge)' : '$1 SEO Audit', val = isBB ? 5.00 : 1.00;
    fbq('track', 'ViewContent', { content_name: nm, value: val, currency: 'USD' });
    var started = false;
    var start = function (ev) {
      if (started) return;
      var t = ev.target;
      if (!t || !t.closest || !t.closest('form, .c-order-form, [class*="order-form"]')) return;
      started = true;
      fbq('track', 'InitiateCheckout', { content_name: nm, value: val, currency: 'USD' });
    };
    document.addEventListener('focusin', start, true);
    document.addEventListener('click', start, true);
  }
})();
