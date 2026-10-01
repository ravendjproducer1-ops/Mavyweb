(() => {
  let L = null;
  try { L = JSON.parse(localStorage.getItem('site_config') || 'null'); } catch (e) {}
  window.SITE_OVERRIDES = L || window.SITE_DEFAULTS || {};
})();
