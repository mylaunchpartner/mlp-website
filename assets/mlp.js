/* My Launch Partner site behaviour. Loaded by loader.js after the page is built. */
(function () {
  var root = document.getElementById('mlp-fs');
  if (!root) return;
  root.classList.add('mlp-js');

  /* Strip GHL container padding / max-width from every ancestor so the
     embed sits edge-to-edge (section → row → column → code element). */
  function breakout() {
    var el = root.parentElement;
    while (el && el !== document.body) {
      var cs = getComputedStyle(el);
      if (cs.maxWidth !== 'none') el.style.setProperty('max-width', 'none', 'important');
      if (parseFloat(cs.paddingLeft) || parseFloat(cs.paddingRight)) {
        el.style.setProperty('padding-left', '0', 'important');
        el.style.setProperty('padding-right', '0', 'important');
      }
      if (parseFloat(cs.paddingTop) || parseFloat(cs.paddingBottom)) {
        el.style.setProperty('padding-top', '0', 'important');
        el.style.setProperty('padding-bottom', '0', 'important');
      }
      if (cs.overflow !== 'visible' || cs.overflowX !== 'visible') {
        el.style.setProperty('overflow', 'visible', 'important');
      }
      /* transforms on ancestors break position:fixed (the nav) */
      if (cs.transform !== 'none') el.style.setProperty('transform', 'none', 'important');
      el = el.parentElement;
    }
    /* Ancestors are now edge-to-edge, so trade the 100vw fallback
       (which includes the scrollbar) for an exact fit. */
    var p = root.parentElement.getBoundingClientRect();
    if (Math.abs(p.left) < 1 && Math.abs(p.width - document.documentElement.clientWidth) < 2) {
      root.style.setProperty('width', '100%', 'important');
      root.style.setProperty('max-width', '100%', 'important');
      root.style.setProperty('left', '0');
      root.style.setProperty('margin-left', '0', 'important');
    }
  }
  breakout();
  window.addEventListener('load', breakout);

  /* Nav: scrolled state + mobile menu */
  var nav = root.querySelector('.mlp-nav');
  var links = document.getElementById('mlp-links');
  var burger = document.getElementById('mlp-burger');
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
    if (!links.classList.contains('is-open') && dd && dd.classList.contains('is-open')) {
      dd.classList.remove('is-open'); ddBtn.setAttribute('aria-expanded', 'false');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* Specialty Industries dropdown: hover on desktop, tap everywhere */
  var dd = document.getElementById('mlp-dd');
  var ddBtn = document.getElementById('mlp-dd-btn');
  ddBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = dd.classList.toggle('is-open');
    ddBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', function (e) {
    if (!dd.contains(e.target)) { dd.classList.remove('is-open'); ddBtn.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { dd.classList.remove('is-open'); ddBtn.setAttribute('aria-expanded', 'false'); }
  });

  /* Smooth in-page scrolling with offset for the fixed nav */
  root.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#mlp-"], a[href^="/#mlp-"]');
    if (!a) return;
    var href = a.getAttribute('href');
    /* "/#…" links belong to the homepage: only scroll locally when we're on it */
    if (href.charAt(0) === '/' && location.pathname.replace(/\/+$/, '') !== '') return;
    var target = document.getElementById(href.split('#')[1]);
    if (!target) return;
    e.preventDefault();
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    var y = target.getBoundingClientRect().top + window.scrollY - (target.id === 'mlp-top' ? 9999 : 64);
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  });

  /* Reveal on scroll */
  var items = root.querySelectorAll('.mlp-reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Only one FAQ open at a time */
  var faqs = root.querySelectorAll('.mlp-faq details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* Label table cells for the stacked mobile layout */
  var heads = root.querySelectorAll('.mlp-table thead th');
  root.querySelectorAll('.mlp-table tbody tr').forEach(function (tr) {
    tr.querySelectorAll('td').forEach(function (td, i) {
      var h = heads[i + 1];
      if (h) td.setAttribute('data-l', h.textContent);
    });
  });

  /* Content arrives after the browser's own #hash jump, so do it ourselves */
  if (location.hash.indexOf('#mlp-') === 0) {
    var h = document.getElementById(location.hash.slice(1));
    if (h) setTimeout(function () {
      window.scrollTo({ top: Math.max(0, h.getBoundingClientRect().top + window.scrollY - 64) });
    }, 250);
  }

  var yr = document.getElementById('mlp-year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
