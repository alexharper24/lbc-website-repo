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

/* cross-page hash links (index.html#visit) land correctly on load */
window.addEventListener('load', function () {
  if (location.hash) {
    setTimeout(function () { scrollToSection(location.hash.slice(1)); }, 60);
  }
});

/* ---------- expandable Scripture pills ---------- */

function toggleVerse(el) {
  var expanded = el.nextElementSibling;
  if (expanded && expanded.classList.contains('verse-expanded')) {
    expanded.remove();
    el.classList.remove('verse-active');
    return;
  }
  var card = el.closest('.belief-section') || el.closest('.gospel-section');
  if (card) {
    card.querySelectorAll('.verse-expanded').forEach(function (v) { v.remove(); });
    card.querySelectorAll('.verse-active').forEach(function (v) { v.classList.remove('verse-active'); });
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
