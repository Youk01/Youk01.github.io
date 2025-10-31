// Shared UI script for theme, mobile menu, accordions, fade-in, and simple workshop storage
(function () {
  'use strict';

  // safe feather.replace helper
  function replaceFeather() {
    try { if (window.feather) window.feather.replace(); } catch (e) { }
  }



  // --- Mobile menu ---
  document.querySelectorAll('.mobile-menu-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const target = document.querySelector(toggle.dataset.target || '.mobile-menu');
      if (target) target.classList.toggle('open');
    });
  });

  // --- Accordions ---
  document.querySelectorAll('.accordion .accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const accordion = header.closest('.accordion');
      const content = accordion.querySelector('.accordion-content');
      accordion.classList.toggle('active');
      if (accordion.classList.contains('active')) content.style.maxHeight = content.scrollHeight + 'px';
      else content.style.maxHeight = null;
    });
  });

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  }

  // --- Workshops helpers ---
  function loadWorkshops() { try { return JSON.parse(localStorage.getItem('workshops') || '[]'); } catch (e) { return []; } }
  // --- Fade-in on load for .fade-in cards ---
  document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
      }, { threshold: 0.15 });
      document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
    } else {
      // Fallback for old browsers
      document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }
  });
  function saveWorkshop(workshop) { const list = loadWorkshops(); list.push(workshop); localStorage.setItem('workshops', JSON.stringify(list)); }
  window.handleWorkshopSubmit = function (e) { e.preventDefault(); const form = e.target; const title = form.querySelector('[name="title"]').value || ''; const notes = form.querySelector('[name="notes"]').value || ''; const workshop = { id: Date.now(), title, notes, date: new Date().toISOString() }; saveWorkshop(workshop); addWorkshopToDOM(workshop); form.reset(); };
  function addWorkshopToDOM(workshop) {
    const list = document.getElementById('workshops-list');
    if (!list) return;
    const el = document.createElement('div');
    el.className = 'workshop-item';
    el.innerHTML = `<h3>${escapeHtml(workshop.title)}</h3><p>${escapeHtml(workshop.notes)}</p><div class="workshop-meta"><span class="status completed">✓ Completed</span></div>`;
    list.appendChild(el);
    replaceFeather();
  }
  
  // --- Timeline helper: add a timeline entry (used on workshops list)
  window.addWorkshopTimelineEntry = function (opts) {
    // opts: { href, title: {en,nl} | string, date: {en,nl}|string, statusLabel: {en,nl}|string, description: {en,nl}|string }
    try {
      const container = document.querySelector('.timeline');
      if (!container) return;
      const a = document.createElement('a');
      a.href = opts.href || '#';
      // build inner HTML with data- attributes for bilingual swapping
      const wrap = document.createElement('div');
      wrap.className = 'entry';
      const title = (typeof opts.title === 'object') ? opts.title.en : opts.title;
      const titleNl = (typeof opts.title === 'object') ? opts.title.nl : '';
      const date = (typeof opts.date === 'object') ? opts.date.en : opts.date || '';
      const dateNl = (typeof opts.date === 'object') ? opts.date.nl : '';
      const status = (typeof opts.statusLabel === 'object') ? opts.statusLabel.en : (opts.statusLabel || 'Completed');
      const statusNl = (typeof opts.statusLabel === 'object') ? opts.statusLabel.nl : '';
      const desc = (typeof opts.description === 'object') ? opts.description.en : (opts.description || '');
      const descNl = (typeof opts.description === 'object') ? opts.description.nl : '';
      a.innerHTML = `<h2 data-en="${escapeHtml(title)}" data-nl="${escapeHtml(titleNl)}">${escapeHtml(title)}</h2>`;
      a.innerHTML += `<p class="date" data-en="${escapeHtml(date)}" data-nl="${escapeHtml(dateNl)}">${escapeHtml(date)}</p>`;
      a.innerHTML += `<p class="status">✓ <span data-en="${escapeHtml(status)}" data-nl="${escapeHtml(statusNl)}">${escapeHtml(status)}</span></p>`;
      a.innerHTML += `<p data-en="${escapeHtml(desc)}" data-nl="${escapeHtml(descNl)}">${escapeHtml(desc)}</p>`;
      wrap.appendChild(a);
      container.appendChild(wrap);
      // re-run language update to apply current lang to this new element
      const cur = localStorage.getItem('lang') || 'en';
      updateLanguage(cur);
      replaceFeather();
      return wrap;
    } catch (e) { console.error(e); }
  };
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
  loadWorkshops().forEach(addWorkshopToDOM);
  replaceFeather();

  // --- Auto-update copyright year ---
  (function updateCopyrightYear(){
    try {
      const year = new Date().getFullYear();
      // update any element whose text contains © YYYY
      document.querySelectorAll('body *').forEach(el => {
        if (!el.children.length) {
          const txt = el.textContent || '';
          const replaced = txt.replace(/©\s*\d{4}/g, `© ${year}`);
          if (replaced !== txt) el.textContent = replaced;
        }
      });
      // also update data-en / data-nl attributes if they contain a year
      document.querySelectorAll('[data-en],[data-nl]').forEach(el => {
        ['en','nl'].forEach(k => {
          const attr = el.getAttribute('data-' + k);
          if (!attr) return;
          const replaced = attr.replace(/©\s*\d{4}/g, `© ${year}`);
          if (replaced !== attr) el.setAttribute('data-' + k, replaced);
        });
      });
    } catch (e) { /* silent */ }
  })();
})();