(() => {
  const $ = s => document.querySelector(s), box = $('#gameStage'), tabs = document.querySelectorAll('.g-tab');
  if (!box) return;
  const O = window.SITE_OVERRIDES || {}; let best = {}, cur = '', stop = () => {};
  try { best = JSON.parse(localStorage.getItem('g_best') || '{}'); } catch (e) {}
  const showBest = k => $('#gameBest').textContent = '🏆 ' + (best[k] != null ? best[k] : '—');
  const save = (k, v, low) => { if (best[k] == null || (low ? v < best[k] : v > best[k])) { best[k] = v; localStorage.setItem('g_best', JSON.stringify(best)); } showBest(k); };
  const confetti = () => { for (let i = 0; i < 28; i++) { const s = document.createElement('span'); s.className = 'cf'; s.textContent = ['🎉', '✨', '⭐', '💎'][i % 4]; s.style.cssText = `left:${Math.random() * 100}vw;--d:${1.5 + Math.random() * 1.5}s;--x:${Math.random() * 200 - 100}px`; document.body.appendChild(s); setTimeout(() => s.remove(), 3200); } };
  const win = m => { confetti(); box.insertAdjacentHTML('beforeend', `<div class="g-win"><div>${m}</div><button class="btn-glow" id="again">↻ Play again</button></div>`); $('#again').onclick = () => start(cur); };

  function memory() {
    const e = ['🚀', '💻', '🎮', '🔥', '⚡', '🧠', '🛡️', '🎧'], c = [...e, ...e].sort(() => Math.random() - .5);
    box.innerHTML = `<div class="g-bar"><span>Moves: <b id="mv">0</b></span><span>Find all pairs</span></div><div class="mem">${c.map(x => `<button class="mc"><i>?</i><b>${x}</b></button>`).join('')}</div>`;
    let a = null, lock = false, m = 0, done = 0;
    box.querySelectorAll('.mc').forEach(b => b.onclick = () => {
      if (lock || b.classList.contains('on')) return; b.classList.add('on');
      if (!a) { a = b; return; }
      $('#mv').textContent = ++m;
      if (a.lastChild.textContent === b.lastChild.textContent) { a.classList.add('ok'); b.classList.add('ok'); a = null; if (++done === 8) { save('memory', m, 1); win(`🎉 ${m} moves`); } }
      else { lock = true; setTimeout(() => { a.classList.remove('on'); b.classList.remove('on'); a = null; lock = false; }, 700); }
    });
  }
  function tap() {
    box.innerHTML = `<div class="g-bar"><span>⏱ <b id="tm">20</b>s</span><span>🎯 <b id="sc">0</b> · 💣 = -3</span></div><div class="holes">${'<button class="hole"></button>'.repeat(9)}</div>`;
    const hs = [...box.querySelectorAll('.hole')]; let s = 0, t = 20, cur = -1;
    const pop = () => { hs.forEach(h => h.textContent = ''); cur = Math.floor(Math.random() * 9); hs[cur].textContent = Math.random() < .2 ? '💣' : '🐞'; };
    hs.forEach((h, i) => h.onclick = () => { if (i !== cur || !h.textContent) return; s += h.textContent === '💣' ? -3 : 1; h.textContent = ''; $('#sc').textContent = s; pop(); });
    pop(); const p = setInterval(pop, 800), c = setInterval(() => { $('#tm').textContent = --t; if (t <= 0) { clearInterval(p); clearInterval(c); save('tap', s); win(`🎯 ${s}`); } }, 1000);
    return () => { clearInterval(p); clearInterval(c); };
  }
  function snake() {
    box.innerHTML = `<div class="g-bar"><span>🍎 <b id="sc">0</b></span><span>⌨️ arrows / swipe</span></div><canvas id="sn" width="320" height="320"></canvas>`;
    const cv = $('#sn'), x = cv.getContext('2d'), N = 16, S = 20; let sn = [[8, 8], [7, 8], [6, 8]], d = [1, 0], nd = d, f = [12, 8], sc = 0, sx, sy;
    const key = e => { const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key]; if (!m) return; e.preventDefault(); if (m[0] + d[0] || m[1] + d[1]) nd = m; };
    const ts = e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const te = e => { const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy, m = Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]; if (m[0] + d[0] || m[1] + d[1]) nd = m; };
    addEventListener('keydown', key); cv.addEventListener('touchstart', ts, { passive: true }); cv.addEventListener('touchend', te);
    const L = setInterval(() => {
      d = nd; const h = [sn[0][0] + d[0], sn[0][1] + d[1]];
      if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || sn.some(p => p[0] === h[0] && p[1] === h[1])) { clearInterval(L); save('snake', sc); return win(`🐍 ${sc}`); }
      sn.unshift(h);
      if (h[0] === f[0] && h[1] === f[1]) { $('#sc').textContent = ++sc; f = [Math.random() * N | 0, Math.random() * N | 0]; } else sn.pop();
      x.fillStyle = '#050a18'; x.fillRect(0, 0, 320, 320); x.fillStyle = '#f87171'; x.fillRect(f[0] * S + 2, f[1] * S + 2, 16, 16);
      x.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent-color'); sn.forEach(p => x.fillRect(p[0] * S + 1, p[1] * S + 1, 18, 18));
    }, 110);
    return () => { clearInterval(L); removeEventListener('keydown', key); };
  }
  const DQ = [["2, 4, 8, 16, ... ?", ["24", "32", "20", "64"], 1], ["ឆ្មា២ចាប់កណ្ដុរ២ក្នុង២នាទី។ ឆ្មា២០ចាប់កណ្ដុរ២០ ប៉ុន្មាននាទី?", ["២០", "១០", "២", "១"], 2], ["ភាសាអ្វីដែលប្រើច្រើនក្នុង FiveM scripts?", ["Python", "Lua", "Java", "C++"], 1], ["បក្សី៥ នៅលើមែក បាញ់ត្រូវ១ នៅសល់ប៉ុន្មាន?", ["៤", "៣", "២", "០"], 3], ["អ្នករត់វ៉ាដាច់អ្នកលេខ២ តើអ្នកនៅលេខប៉ុន្មាន?", ["១", "២", "៣", "៤"], 1], ["Server-side script ក្នុង FiveM គឺ?", ["HTML", "Client Lua", "Server Lua", "CSS"], 2], ["ខែណាមួយមាន ២៨ ឬ ២៩ ថ្ងៃ?", ["មេសា", "កុម្ភៈ", "ធ្នូ", "មិថុនា"], 1], ["ទា៣ពង៣ក្នុង៣ថ្ងៃ។ ទា១២ក្នុង១២ថ្ងៃ ពងប៉ុន្មាន?", ["១២", "២៤", "៤៨", "១៤៤"], 2]];
  function quiz() {
    const Q = (O.quiz && O.quiz.length ? O.quiz : DQ).slice().sort(() => Math.random() - .5).slice(0, 10); let i = 0, s = 0, t;
    const show = () => {
      if (i >= Q.length) { save('quiz', s); return win(`🧠 ${s}/${Q.length}`); }
      const [q, o, a] = Q[i];
      box.innerHTML = `<div class="g-bar"><span>${i + 1}/${Q.length}</span><span>⭐ ${s}</span></div><h3 class="question-text">${q}</h3><div class="options-grid">${o.map((v, k) => `<button class="option-btn" data-k="${k}">${v}</button>`).join('')}</div>`;
      const bs = box.querySelectorAll('.option-btn');
      bs.forEach(b => b.onclick = () => { bs.forEach(x => x.disabled = 1); const k = +b.dataset.k; b.classList.add(k === a ? 'correct' : 'wrong'); if (k === a) s++; else bs[a].classList.add('correct'); t = setTimeout(() => { i++; show(); }, 900); });
    };
    show(); return () => clearTimeout(t);
  }
  function type() {
    const W = 'lua node react mysql qbcore server client export event thread native config async await fetch deploy debug'.split(' ');
    box.innerHTML = `<div class="g-bar"><span>⏱ <b id="tm">30</b>s</span><span>✅ <b id="sc">0</b></span></div><div class="tw" id="tw"></div><input id="ti" class="g-input" autocomplete="off" autocapitalize="off" placeholder="type here…">`;
    let s = 0, t = 30, w; const nx = () => { w = W[Math.random() * W.length | 0]; $('#tw').textContent = w; }; nx();
    const ti = $('#ti'); ti.focus(); ti.oninput = () => { if (ti.value.trim() === w) { $('#sc').textContent = ++s; ti.value = ''; nx(); } };
    const c = setInterval(() => { $('#tm').textContent = --t; if (!t) { clearInterval(c); ti.disabled = 1; save('type', s); win(`⌨️ ${s} words`); } }, 1000);
    return () => clearInterval(c);
  }
  const games = { memory, tap, snake, quiz, type };
  function start(k) { stop(); cur = k; tabs.forEach(t => t.classList.toggle('active', t.dataset.g === k)); showBest(k); stop = games[k]() || (() => {}); }
  tabs.forEach(t => t.onclick = () => start(t.dataset.g));
  start('memory');
})();
