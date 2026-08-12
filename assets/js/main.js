document.documentElement.classList.add('js');
(() => {
  const LANG_KEY = 'appnexo-language';
  const dict = window.APPNEXO_I18N || {};
  const config = window.APPNEXO_CONFIG || {};

  function queryLang() {
    const v = new URLSearchParams(location.search).get('lang');
    return v === 'en' || v === 'es' ? v : null;
  }
  function browserLang() { return (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en'; }
  let currentLang = queryLang() || localStorage.getItem(LANG_KEY) || browserLang();
  if (!dict[currentLang]) currentLang = 'es';

  function t(key) { return dict[currentLang]?.[key] ?? dict.es?.[key] ?? key; }
  function setMeta() {
    const page = document.body.dataset.page || 'home';
    document.title = t(`${page}.meta.title`);
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t(`${page}.meta.description`));
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (ogTitle) ogTitle.content = t(`${page}.meta.title`);
    if (ogDesc) ogDesc.content = t(`${page}.meta.description`);
    if (twTitle) twTitle.content = t(`${page}.meta.title`);
    if (twDesc) twDesc.content = t(`${page}.meta.description`);
  }
  function updateLinks() {
    document.querySelectorAll('a[data-internal]').forEach(a => {
      const url = new URL(a.getAttribute('href'), location.origin);
      if (currentLang === 'en') url.searchParams.set('lang','en'); else url.searchParams.delete('lang');
      a.setAttribute('href', url.pathname + url.search + url.hash);
    });
  }
  function applyLanguage(lang, persist=true) {
    if (!dict[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    if (persist) localStorage.setItem(LANG_KEY, lang);

    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    document.querySelectorAll('[data-i18n-title]').forEach(el => el.setAttribute('title', t(el.dataset.i18nTitle)));
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder)));
    document.querySelectorAll('[data-lang]').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    setMeta(); updateLinks();
    if (window.AppNexoTheme) window.AppNexoTheme.updateLabels();

    const url = new URL(location.href);
    if (lang === 'en') url.searchParams.set('lang','en'); else url.searchParams.delete('lang');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

  function setupLanguage() {
    document.querySelectorAll('[data-lang]').forEach(btn => btn.addEventListener('click', () => applyLanguage(btn.dataset.lang)));
    applyLanguage(currentLang, false);
  }
  function setupMenu() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const menu = document.querySelector('[data-nav-menu]');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open'); document.body.classList.remove('menu-open'); toggle.setAttribute('aria-expanded','false');
    }));
  }
  function setupHeader() {
    const h = document.querySelector('[data-header]');
    if (!h) return;
    const f = () => h.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', f, {passive:true}); f();
  }
  function setupReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(el=>el.classList.add('visible')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), {threshold:.08});
    els.forEach(el => io.observe(el));
  }
  function setupProjectFilters() {
    const buttons = document.querySelectorAll('[data-project-filter]');
    const cards = document.querySelectorAll('[data-project-card]');
    const empty = document.querySelector('[data-project-empty]');
    if (!buttons.length) return;
    buttons.forEach(btn => btn.addEventListener('click', () => {
      buttons.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
      const filter = btn.dataset.projectFilter; let shown=0;
      cards.forEach(card => { const categories=(card.dataset.projectCard || '').split(/\s+/); const ok = filter==='all' || categories.includes(filter); card.hidden=!ok; if(ok) shown++; });
      if (empty) empty.hidden = shown>0;
    }));
  }
  function setupExternalLinks() {
    document.querySelectorAll('[data-youtube]').forEach(a => a.href = config.youtube || '#');
    document.querySelectorAll('[data-blog]').forEach(a => a.href = config.blog || 'https://blog.appnexo.dev');
    document.querySelectorAll('[data-tiktok]').forEach(a => { if(config.tiktok) a.href=config.tiktok; else a.hidden=true; });
    document.querySelectorAll('[data-facebook]').forEach(a => { if(config.facebook) a.href=config.facebook; else a.hidden=true; });
    document.querySelectorAll('[data-github]').forEach(a => { if(config.github) a.href=config.github; else a.hidden=true; });
    document.querySelectorAll('[data-linkedin]').forEach(a => { if(config.linkedin) a.href=config.linkedin; else a.hidden=true; });
    document.querySelectorAll('[data-email]').forEach(a => { a.href='mailto:'+config.contactEmail; if(a.dataset.showEmail==='true') a.textContent=config.contactEmail; });
    document.querySelectorAll('[data-whatsapp]').forEach(a => {
      if (!config.whatsappNumber) { a.hidden=true; return; }
      const msg = currentLang==='en' ? 'Hi AppNexo, I visited appnexo.dev and would like to discuss a project.' : 'Hola AppNexo, visité appnexo.dev y quisiera conversar sobre un proyecto.';
      a.href='https://wa.me/'+config.whatsappNumber+'?text='+encodeURIComponent(msg);
    });
  }
  function setupContactForm() {
    const form = document.querySelector('[data-contact-form]'); if(!form) return;
    const count = form.querySelector('[data-message-count]'); const msg = form.querySelector('[name="message"]');
    if(msg && count) { const c=()=>count.textContent=msg.value.length; msg.addEventListener('input',c); c(); }
    form.addEventListener('submit', e => {
      e.preventDefault(); if(!form.reportValidity()) return;
      const fd = new FormData(form); const lang=currentLang;
      const subject = lang==='en' ? `AppNexo project inquiry - ${fd.get('name')}` : `Consulta de proyecto AppNexo - ${fd.get('name')}`;
      const lines = lang==='en' ? [
        `Name: ${fd.get('name')}`, `Email: ${fd.get('email')}`, `Phone: ${fd.get('phone')||'-'}`, `Project type: ${fd.get('service')}`, `Budget: ${fd.get('budget')||'-'}`, '', 'Project:', fd.get('message')
      ] : [
        `Nombre: ${fd.get('name')}`, `Correo: ${fd.get('email')}`, `Teléfono: ${fd.get('phone')||'-'}`, `Tipo de proyecto: ${fd.get('service')}`, `Presupuesto: ${fd.get('budget')||'-'}`, '', 'Proyecto:', fd.get('message')
      ];
      const body=lines.join('\n');
      const status=form.querySelector('[data-form-status]'); if(status) status.textContent=t('contact.form.prepared');
      if(config.whatsappNumber) window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(subject+'\n\n'+body)}`,'_blank','noopener');
      else location.href=`mailto:${config.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupLanguage(); setupMenu(); setupHeader(); setupReveal(); setupProjectFilters(); setupExternalLinks(); setupContactForm();
  });
})();