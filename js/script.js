// Shared UI script for theme, language, mobile menu, accordions, fade-in, and simple workshop storage
(function () {
  'use strict';

  // safe feather.replace helper
  function replaceFeather() {
    try { if (window.feather) window.feather.replace(); } catch (e) { }
  }

  // --- Theme ---
  const themeToggles = document.querySelectorAll('.theme-toggle');
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggles.forEach(btn => {
      const icon = btn.querySelector('i');
      if (!icon) return;
      icon.dataset.icon = theme === 'dark' ? 'sun' : 'moon';
    });
    replaceFeather();
  }
  themeToggles.forEach(btn => btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }));
  (function initTheme() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(stored || (prefersDark ? 'dark' : 'light'));
  })();

  // --- Language ---
  const languageButtons = document.querySelectorAll('.language-toggle');
  function updateLanguage(lang) {
    // update any element that provides data-en / data-nl
    document.querySelectorAll('[data-en]').forEach(el => {
      const en = el.getAttribute('data-en');
      const nl = el.getAttribute('data-nl');
      if (lang === 'en' && en != null) el.textContent = en;
      else if (lang === 'nl' && nl != null) el.textContent = nl;
    });

    // sync language toggle buttons (they may carry data-en / data-nl labels)
    languageButtons.forEach(btn => {
      const ben = btn.getAttribute('data-en');
      const bnl = btn.getAttribute('data-nl');
      if (lang === 'en' && ben != null) btn.textContent = ben;
      else if (lang === 'nl' && bnl != null) btn.textContent = bnl;
      // keep dataset in sync
      btn.dataset.lang = lang;
    });

    replaceFeather();
  }

  // clicking any language toggle should flip the current language
  languageButtons.forEach(btn => btn.addEventListener('click', () => {
    const current = localStorage.getItem('lang') || 'en';
    const next = current === 'en' ? 'nl' : 'en';
    updateLanguage(next);
    localStorage.setItem('lang', next);
  }));

  (function initLang(){ const lang = localStorage.getItem('lang') || 'en'; updateLanguage(lang); })();

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

  // --- Fade-in on scroll ---
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  }

  // --- Workshops helpers ---
  function loadWorkshops() { try { return JSON.parse(localStorage.getItem('workshops') || '[]'); } catch (e) { return []; } }
  function saveWorkshop(workshop) { const list = loadWorkshops(); list.push(workshop); localStorage.setItem('workshops', JSON.stringify(list)); }
  window.handleWorkshopSubmit = function (e) { e.preventDefault(); const form = e.target; const title = form.querySelector('[name="title"]').value || ''; const notes = form.querySelector('[name="notes"]').value || ''; const workshop = { id: Date.now(), title, notes, date: new Date().toISOString() }; saveWorkshop(workshop); addWorkshopToDOM(workshop); form.reset(); };
  function addWorkshopToDOM(workshop) {
    const list = document.getElementById('workshops-list'); if (!list) return; const lang = localStorage.getItem('lang') || 'en'; const title = (typeof workshop.title === 'object') ? (workshop.title[lang] || '') : (workshop.title || ''); const notes = (typeof workshop.notes === 'object') ? (workshop.notes[lang] || '') : (workshop.notes || ''); const el = document.createElement('div'); el.className = 'workshop-item'; el.innerHTML = `<h3>${escapeHtml(title)}</h3><p>${escapeHtml(notes)}</p><div class="workshop-meta"><span class="status completed">✓ ${lang === 'en' ? 'Completed' : 'Voltooid'}</span></div>`; list.appendChild(el); replaceFeather(); }
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