(() => {
  const $ = s => document.querySelector(s), hdr = $('.site-header'), tg = $('#menuToggle'), bar = $('#scrollProgress');
  const setMenu = o => { hdr.classList.toggle('menu-open', o); tg.setAttribute('aria-expanded', o); };
  tg.addEventListener('click', () => setMenu(!hdr.classList.contains('menu-open')));
  hdr.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('resize', () => innerWidth > 1100 && setMenu(false));

  let busy = false;
  const onScroll = () => {
    if (busy) return; busy = true;
    requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
      hdr.classList.toggle('scrolled', scrollY > 20);
      busy = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  links.forEach(a => { const s = $(a.getAttribute('href')); s && io.observe(s); });

  // free cards from AOS transitions after reveal so hover stays snappy
  document.addEventListener('aos:in', e => {
    const el = e.detail;
    setTimeout(() => { el.removeAttribute('data-aos'); el.classList.remove('aos-init', 'aos-animate'); }, 1500);
  });
})();
