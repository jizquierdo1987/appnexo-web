(() => {
  const KEY = 'appnexo-theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(KEY);
  const preferredDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = saved || (preferredDark ? 'dark' : 'light');

  function updateLabels() {
    const isDark = root.dataset.theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const label = document.documentElement.lang === 'en'
        ? (isDark ? 'Switch to light theme' : 'Switch to dark theme')
        : (isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  }

  window.AppNexoTheme = { updateLabels };
  document.addEventListener('DOMContentLoaded', () => {
    updateLabels();
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem(KEY, next);
      updateLabels();
    }));
  });
})();