/* Lighthouse Baptist Church - shared behavior for every page */

/* ---------- mobile nav ---------- */

function openMobileNav() {
  document.getElementById('mobileNav').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------- scroll to a section, offset by the live header height ---------- */

function scrollToSection(sectionId) {
  var el = document.getElementById(sectionId);
  if (!el) return;
  var header = document.querySelector('.site-header');
  var headerH = header ? header.offsetHeight : 73;
  var top = el.getBoundingClientRect().top + window.pageYOffset - headerH;
  window.scrollTo({ top: top, behavior: 'smooth' });
}

/* cross-page hash links (index.html#visit) land correctly on load. An accordion
   target handles its own scrolling, so only fall back to the section scroll. */
window.addEventListener('load', function () {
  if (!location.hash) return;
  setTimeout(function () {
    if (!openAccordionFromHash()) scrollToSection(location.hash.slice(1));
  }, 60);
});

/* ---------- expandable Scripture pills ---------- */

function toggleVerse(el) {
  var expanded = el.nextElementSibling;
  if (expanded && expanded.classList.contains('verse-expanded')) {
    expanded.remove();
    el.classList.remove('verse-active');
    el.setAttribute('aria-expanded', 'false');
    return;
  }
  var card = el.closest('.belief-section') || el.closest('.gospel-section');
  if (card) {
    card.querySelectorAll('.verse-expanded').forEach(function (v) { v.remove(); });
    card.querySelectorAll('.verse-active').forEach(function (v) {
      v.classList.remove('verse-active');
      v.setAttribute('aria-expanded', 'false');
    });
  }
  var text = el.getAttribute('data-verse');
  if (!text) return;
  var div = document.createElement('div');
  div.className = 'verse-expanded';
  var strong = document.createElement('strong');
  strong.textContent = el.textContent + ' (KJV)';
  div.appendChild(strong);
  div.appendChild(document.createElement('br'));
  div.appendChild(document.createTextNode(text));
  el.parentNode.insertBefore(div, el.nextSibling);
  el.classList.add('verse-active');
  el.setAttribute('aria-expanded', 'true');
}

/* ---------- accordions ---------- */

function setAccordion(btn, open) {
  var panel = document.getElementById(btn.getAttribute('aria-controls'));
  if (!panel) return;
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  panel.hidden = !open;
  var item = btn.closest('.acc-item');
  if (item) item.classList.toggle('open', open);
}

function toggleAccordion(btn) {
  setAccordion(btn, btn.getAttribute('aria-expanded') !== 'true');
}

/* one button that expands everything, then collapses everything */
function toggleAllAccordions(control) {
  var scope = control.closest('section') || document;
  var btns = scope.querySelectorAll('.acc-btn');
  var anyClosed = false;
  btns.forEach(function (b) {
    if (b.getAttribute('aria-expanded') !== 'true') anyClosed = true;
  });
  btns.forEach(function (b) { setAccordion(b, anyClosed); });
  control.textContent = anyClosed ? 'Collapse all' : 'Expand all';
  control.setAttribute('aria-expanded', anyClosed ? 'true' : 'false');
}

/* a link to #the-bible should open that section and scroll to it */
function openAccordionFromHash() {
  if (!location.hash) return false;
  var item = document.getElementById(location.hash.slice(1));
  if (!item || !item.classList.contains('acc-item')) return false;
  var btn = item.querySelector('.acc-btn');
  if (btn) setAccordion(btn, true);
  var header = document.querySelector('.site-header');
  var top = item.getBoundingClientRect().top + window.pageYOffset -
            (header ? header.offsetHeight : 73) - 8;
  window.scrollTo({ top: top, behavior: 'smooth' });
  return true;
}

window.addEventListener('hashchange', openAccordionFromHash);

/* keyboard equivalent for the reference pills (they are spans, not buttons) */
function verseKey(e, el) {
  if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    toggleVerse(el);
  }
}

/* ---------- online giving ----------
   Opens Tithe.ly in a sized popup so the church site stays put behind it, and so
   the giving form runs on Tithe.ly's own origin (their padlock and domain stay
   visible to the donor, and their payment flow is untouched). The anchors keep a
   real href with target="_blank", so if the popup is blocked or JS is off the
   browser's default still works. */

function openGiving(e) {
  var a = e.currentTarget || e.target;
  var url = a.getAttribute('href');
  if (!url) return;
  var w = 480, h = 780;
  var left = Math.max(0, Math.round((window.screen.width - w) / 2));
  var top = Math.max(0, Math.round((window.screen.height - h) / 3));
  var win = window.open(
    url, 'lbcGiving',
    'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top +
    ',resizable=yes,scrollbars=yes'
  );
  if (win) {
    try { win.opener = null; } catch (err) { /* cross-origin, not critical */ }
    win.focus();
    e.preventDefault();   // handled; don't also open a tab
  }
  /* popup blocked: fall through to the anchor's own target="_blank" */
}

/* ---------- coming soon modal ---------- */

function openComingSoon() {
  document.getElementById('comingSoonModal').style.display = 'flex';
}

function closeComingSoon() {
  document.getElementById('comingSoonModal').style.display = 'none';
}

/* ---------- fade-in on scroll ---------- */

(function () {
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(function (el) { io.observe(el); });
})();
