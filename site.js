(() => {
  const O = window.SITE_OVERRIDES || {}, $ = s => document.querySelector(s), L = O.links || {}, F = O.flags || {};
  if (O.brand) $('.brand-name').firstChild.textContent = O.brand + ' ';
  if (L.email) { const c = $('#copyEmailBtn'); c.dataset.email = L.email; c.querySelector('.email-text-val').textContent = L.email; }
  if (L.telegram) document.querySelectorAll('a[href*="t.me/"]').forEach(a => a.href = L.telegram);
  if (L.github) document.querySelectorAll('a[href*="github.com/"]').forEach(a => a.href = L.github);
  if (L.linkedin) $('.social-btn.linkedin').href = L.linkedin;
  if (F.games === false) document.querySelectorAll('#iqgame,a[href="#iqgame"]').forEach(e => e.style.display = 'none');
  if (F.rain === false) $('#matrixCanvas').style.display = 'none';
  if (O.theme && !localStorage.getItem('site_theme_color')) { $('.color-dot.' + O.theme)?.click(); localStorage.removeItem('site_theme_color'); }

  // announcement banner
  const bt = O.banner && O.banner.text;
  if (bt && sessionStorage.getItem('ann') !== bt) {
    const b = document.createElement('div'); b.className = 'announce';
    b.innerHTML = `<span>📢 ${bt}</span><button aria-label="close">✕</button>`;
    b.querySelector('button').onclick = () => { b.remove(); sessionStorage.setItem('ann', bt); };
    document.body.prepend(b);
  }

  // typewriter roles
  const R = O.roles && O.roles.length ? O.roles : ['FiveM Developer', 'Lua Scripter', 'System Admin', 'UI/UX Builder'], d = $('.hero-desc');
  if (d) {
    const p = document.createElement('p'); p.className = 'typer'; p.innerHTML = '⚡ <span></span><i class="caret"></i>'; d.before(p);
    const t = p.querySelector('span'); let r = 0, i = 0, del = 0;
    const step = () => {
      const w = R[r]; i += del ? -1 : 1; t.textContent = w.slice(0, i); let ms = del ? 35 : 70;
      if (!del && i === w.length) { del = 1; ms = 1400; } else if (del && i === 0) { del = 0; r = (r + 1) % R.length; ms = 300; }
      setTimeout(step, ms);
    };
    matchMedia('(prefers-reduced-motion: reduce)').matches ? t.textContent = R[0] : step();
  }

  // floating buttons + website QR
  const fw = document.createElement('div'); fw.className = 'fab-wrap';
  fw.innerHTML = '<button class="fab" id="qrBtn" title="QR">▦</button><button class="fab" id="topBtn" title="Top">↑</button>'; document.body.append(fw);
  const m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = '<div class="modal-card"><button class="modal-x">×</button><h3>QR Code · គេហទំព័រ</h3><div id="qrBox"></div><small id="qrUrl"></small><div class="qr-actions"><button class="btn-glow" id="qrDl">⬇ PNG</button><button class="btn-glass" id="qrCopy">🔗 Copy link</button></div></div>'; document.body.append(m);
  const url = O.siteUrl || location.href.split('#')[0]; $('#qrUrl').textContent = url; let made = 0;
  const open = o => {
    m.classList.toggle('open', o);
    if (o && !made && window.QRCode) { new QRCode($('#qrBox'), { text: url, width: 240, height: 240, colorDark: '#0b1020', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H }); made = 1; }
  };
  $('#qrBtn').onclick = () => open(1); m.querySelector('.modal-x').onclick = () => open(0);
  m.onclick = e => e.target === m && open(0); addEventListener('keydown', e => e.key === 'Escape' && open(0));
  $('#qrDl').onclick = () => { const c = $('#qrBox canvas'), a = document.createElement('a'); a.href = c ? c.toDataURL('image/png') : $('#qrBox img').src; a.download = 'website-qr.png'; a.click(); };
  $('#qrCopy').onclick = e => navigator.clipboard.writeText(url).then(() => { e.target.textContent = '✅ Copied'; setTimeout(() => e.target.textContent = '🔗 Copy link', 1500); });
  const tb = $('#topBtn'); tb.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  addEventListener('scroll', () => tb.classList.toggle('show', scrollY > 600), { passive: true });
})();
