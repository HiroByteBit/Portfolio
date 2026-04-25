/* ══════════════════════════════════════════
  script.js — Hiroyuki B. Toyosaki Portfolio
══════════════════════════════════════════ */

/* ── 1. PARTICLE SYSTEM ── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  let mouse = { x: W / 2, y: H / 2 };
  let isDark = document.documentElement.classList.contains('dark');

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }, { passive: true });

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  class Particle {
    constructor() { this.reset(true); }

    reset(randomY = false) {
      this.x  = mouse.x + (Math.random() - 0.5) * 120;
      this.y  = randomY ? Math.random() * H : mouse.y + (Math.random() - 0.5) * 120;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = -(Math.random() * 0.8 + 0.3);
      this.radius  = Math.random() * 2.2 + 0.6;
      this.maxLife = Math.random() * 120 + 80;
      this.life    = 0;
      this.hue = Math.random() < 0.65 ? 196 : 262;
      this.sat = 80 + Math.random() * 20;
      this.lit = 55 + Math.random() * 20;
    }

    update() {
      this.life++;
      this.x  += this.vx;
      this.y  += this.vy;
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1) {
        this.vx += (dx / dist) * 0.012;
        this.vy += (dy / dist) * 0.012;
      }
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.6) {
        this.vx = (this.vx / speed) * 1.6;
        this.vy = (this.vy / speed) * 1.6;
      }
    }

    draw() {
      const progress = this.life / this.maxLife;
      const alpha    = progress < 0.2
        ? progress / 0.2
        : progress > 0.7
          ? (1 - progress) / 0.3
          : 1;

      const finalAlpha = alpha * (isDark ? 0.55 : 0.35);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, ${this.sat}%, ${this.lit}%, ${finalAlpha})`;
      ctx.fill();

      const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
      glow.addColorStop(0, `hsla(${this.hue}, ${this.sat}%, ${this.lit}%, ${finalAlpha * 0.4})`);
      glow.addColorStop(1, `hsla(${this.hue}, ${this.sat}%, ${this.lit}%, 0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }
  }

  const POOL_SIZE = 90;
  const particles = Array.from({ length: POOL_SIZE }, () => new Particle());

  const observer = new MutationObserver(() => {
    isDark = document.documentElement.classList.contains('dark');
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      if (p.life >= p.maxLife) p.reset();
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ── 2. CURSOR GLOW ── */
(function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0;
  let glowX  = 0, glowY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animate() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();


/* ── 3. DARK MODE ── */
(function initDarkMode() {
  const html       = document.documentElement;
  const darkToggle = document.getElementById('darkToggle');
  const iconSun    = document.getElementById('icon-sun');
  const iconMoon   = document.getElementById('icon-moon');
  const navbar     = document.getElementById('navbar');

  function applyTheme(dark) {
    dark ? html.classList.add('dark') : html.classList.remove('dark');
    iconSun.classList.toggle('hidden', !dark);
    iconMoon.classList.toggle('hidden', dark);
    updateNavbarBg();
  }

  function updateNavbarBg() {
    const dark = html.classList.contains('dark');
    if (window.scrollY > 40) {
      navbar.style.background       = dark ? 'rgba(5,10,16,0.88)' : 'rgba(248,250,252,0.88)';
      navbar.style.backdropFilter   = 'blur(18px)';
      navbar.style.webkitBackdropFilter = 'blur(18px)';
      navbar.style.borderBottom     = '1px solid var(--border)';
    } else {
      navbar.style.background       = '';
      navbar.style.backdropFilter   = '';
      navbar.style.webkitBackdropFilter = '';
      navbar.style.borderBottom     = '';
    }
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark);

  darkToggle.addEventListener('click', () => applyTheme(!html.classList.contains('dark')));
  window.addEventListener('scroll', updateNavbarBg, { passive: true });
})();


/* ── 4. MOBILE MENU ── */
(function initMobileMenu() {
  const btn  = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  btn.addEventListener('click', () => menu.classList.toggle('hidden'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.add('hidden')));
})();


/* ── 5. SECTION MOUSE GLOW ── */
document.querySelectorAll('.section-glow').forEach(section => {
  section.addEventListener('mousemove', e => {
    const r = section.getBoundingClientRect();
    section.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
    section.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
  }, { passive: true });
});


/* ── 6. SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();


/* ── 7. SKILL BARS ── */
(function initSkillBars() {
  document.querySelectorAll('.skill-row').forEach(row => {
    const level = row.dataset.level || 75;
    const label = row.dataset.label || '';
    row.innerHTML = `
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-sm font-medium" style="color:var(--text-primary)">${label}</span>
        <span class="text-xs font-mono" style="color:var(--accent)">${level}%</span>
      </div>
      <div class="h-1.5 rounded-full overflow-hidden" style="background:rgba(37,150,190,0.1)">
        <div class="skill-fill h-full rounded-full" data-width="${level}"
            style="width:0%;background:linear-gradient(90deg,#2596be,#818cf8);transition:width 1.2s cubic-bezier(.22,1,.36,1)"></div>
      </div>`;
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.card-glow').forEach(card => obs.observe(card));
})();


/* ── 8. PARALLAX HERO BLOBS ── */
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.parallax-blob').forEach(blob => {
    const speed = parseFloat(blob.dataset.speed || 0.04);
    const x = (e.clientX - window.innerWidth  / 2) * speed;
    const y = (e.clientY - window.innerHeight / 2) * speed;
    blob.style.transform = `translate(${x}px, ${y}px)`;
  });
}, { passive: true });


/* ── 9. EXPERIENCE RESPONSIBILITIES ── */
(function renderResponsibilities() {
  const items = [
    ['🎨', 'Designed UI/UX using Figma — wireframes, prototypes, and design systems'],
    ['📊', 'Created Admin and Employee dashboard interfaces'],
    ['⚛️', 'Collaborated with React & TypeScript development teams'],
    ['📋', 'Translated system requirements into usable, accessible interfaces'],
    ['🔄', 'Designed attendance, payroll, and leave request workflows'],
    ['📱', 'Applied responsive and accessible UI/UX principles throughout'],
  ];

  const expCard = document.querySelector('#experience .card-glow');
  if (!expCard) return;
  const grid = expCard.querySelector('.resp-grid');
  if (!grid) return;

  grid.innerHTML = items.map(([icon, text]) => `
    <div class="flex items-start gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
        style="background:rgba(37,150,190,0.04);border:1px solid rgba(37,150,190,0.08)">
      <span class="text-lg flex-shrink-0">${icon}</span>
      <span class="text-sm leading-relaxed" style="color:var(--text-secondary)">${text}</span>
    </div>`).join('');
})();


/* ── 10. SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ── 11. BUTTON RIPPLE ── */
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('click', e => {
    const rect   = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;border-radius:50%;
      background:rgba(255,255,255,0.25);
      transform:translate(-50%,-50%) scale(0);
      animation:ripple 0.5s ease forwards;
      left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;
      pointer-events:none;`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});


/* ── 12. CARD 3D TILT ── */
document.querySelectorAll('.card-glow').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.width  / 2;
    const cy = r.height / 2;
    const x  = e.clientX - r.left;
    const y  = e.clientY - r.top;
    const tX = ((y - cy) / cy * 3).toFixed(2);
    const tY = (-(x - cx) / cx * 3).toFixed(2);
    card.style.transform = `perspective(800px) rotateX(${tX}deg) rotateY(${tY}deg) translateY(-4px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ── 13. SCROLL PROGRESS BAR ── */
(function initScrollBar() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();


/* ── 14. INK TRAIL ── */
(function initInkTrail() {
  const canvas = document.getElementById('ink-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }, { passive: true });

  const trail = [];

  document.addEventListener('mousemove', e => {
    trail.push({
      x: e.clientX,
      y: e.clientY,
      r: Math.random() * 3 + 1,
      life: 1,
      hue: Math.random() < 0.6 ? 196 : 262,
      sat: 70 + Math.random() * 20,
      lit: 55 + Math.random() * 15
    });

    if (trail.length > 60) trail.shift();
  }, { passive: true });

  const isDark = () => document.documentElement.classList.contains('dark');

  function loop() {
    ctx.clearRect(0, 0, W, H);

    trail.forEach(p => {
      p.life -= 0.03;
      if (p.life <= 0) return;

      const alpha = p.life * (isDark() ? 0.45 : 0.28);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.lit}%, ${alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }

  loop();
})();


/* ── 15. TYPEWRITER ── */
(function initTypewriter() {
  const el = document.getElementById('tw-text');
  if (!el) return;

  const words = [
    'UI/UX Designer.',
    'Front-End Developer.',
    'CS Student.',
    'AI Automation Explorer.',
    'Problem Solver.'
  ];

  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];

    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
      }
    }

    setTimeout(tick, deleting ? 55 : 110);
  }

  setTimeout(tick, 900);
})();


/* ── 16. MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.28;
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.28;
    btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});


/* ── 17. SPOTLIGHT INNER GLOW ── */
document.querySelectorAll('.card-glow').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--sx', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
    card.style.setProperty('--sy', ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
  }, { passive: true });
});


/* ── 18. SIDE NAV DOTS ── */
(function initSideDots() {
  const dots = document.querySelectorAll('.side-dots a');
  const sections = ['hero','about','experience','skills','learning','projects','contact'];

  function update() {
    let active = 'hero';

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
        active = id;
      }
    });

    dots.forEach(dot => {
      dot.classList.toggle('sd-active', dot.getAttribute('href') === '#' + active);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ── 19. COUNT-UP STATS ── */
(function initCountUp() {
  const nums = document.querySelectorAll('.stat-num');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const full = el.textContent.trim();
      const num = parseInt(full);

      if (isNaN(num)) {
        obs.unobserve(el);
        return;
      }

      const suffix = full.replace(num, '');
      let cur = 0;
      const steps = 30;
      const inc = num / steps;

      const timer = setInterval(() => {
        cur += inc;
        if (cur >= num) {
          cur = num;
          clearInterval(timer);
        }
        el.textContent = Math.round(cur) + suffix;
      }, 35);

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => obs.observe(n));
})();

/* ── 20. MUSIC TOGGLE ── */
(function() {
  const btn     = document.getElementById('musicToggle');
  const iconOn  = document.getElementById('icon-music-on');
  const iconOff = document.getElementById('icon-music-off');

  let ctx, playing = false;
  let nodes = [];

  function buildAmbient() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    const freqs = [60, 120, 180, 240, 90];
    freqs.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo  = ctx.createOscillator();
      const lfoG = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      lfo.type = 'sine';
      lfo.frequency.value = 0.08 + i * 0.03;
      lfoG.gain.value = freq * 0.015;

      gain.gain.value = 0;

      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      lfo.start();

      gain.gain.linearRampToValueAtTime(0.04 - i * 0.006, ctx.currentTime + 2);

      nodes.push({ osc, gain, lfo });
    });
  }

  function stopAmbient() {
    if (!ctx) return;
    nodes.forEach(({ osc, gain, lfo }) => {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      setTimeout(() => { try { osc.stop(); lfo.stop(); } catch(e){} }, 1600);
    });
    nodes = [];
    setTimeout(() => { try { ctx.close(); } catch(e){} ctx = null; }, 1700);
  }

  btn.addEventListener('click', () => {
    playing = !playing;
    iconOn.classList.toggle('hidden', !playing);
    iconOff.classList.toggle('hidden', playing);

    if (playing) {
      buildAmbient();
    } else {
      stopAmbient();
    }
  });
})();

/* ── GAME TOGGLE ── */
function loadGame() {
  const placeholder = document.getElementById('game-placeholder');
  const iframe      = document.getElementById('game-iframe');
  if (!iframe || !placeholder) return;

  placeholder.style.opacity = '0';
  placeholder.style.pointerEvents = 'none';
  setTimeout(() => { placeholder.style.display = 'none'; }, 400);

  iframe.src = 'https://ite18-final-project.vercel.app/';
  iframe.onload = () => { iframe.style.opacity = '1'; };

  placeholder.style.transition = 'opacity 0.3s ease';
}

/* ── ping keyframe for game overlay ── */
const s = document.createElement('style');
s.textContent = `@keyframes ping { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.5);opacity:0} }`;
document.head.appendChild(s);


/* ── 21. ALGORITHM TAB SWITCHER (Wheeled Robot RL) ── */
(function initAlgoTabs() {
  const tabGroup = document.getElementById('algo-tabs');
  if (!tabGroup) return;

  tabGroup.addEventListener('click', e => {
    const btn = e.target.closest('.algo-tab');
    if (!btn) return;

    const target = btn.dataset.target;

    /* Update tab active state */
    tabGroup.querySelectorAll('.algo-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    /* Show matching panel */
    document.querySelectorAll('.algo-video-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === target);
    });
  });
})();