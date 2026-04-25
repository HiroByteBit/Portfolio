/* ══════════════════════════════════════════
  main.js — Premium Redesign Logic
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initNavbar();
  initCustomCursor();
  initSkillBars();
  initSideDots();
  initCountUp();
});

/* ── 1. SCROLL REVEALS ── */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el, i) => {
    // Add staggered delay to children if they are reveals
    if (el.parentElement.classList.contains('reveal-group')) {
      const index = Array.from(el.parentElement.children).indexOf(el);
      el.style.transitionDelay = `${Math.min(index * 0.1, 0.5)}s`;
    }
    observer.observe(el);
  });
}

/* ── 2. NAVBAR SCROLL ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }, { passive: true });
}

/* ── 3. CUSTOM CURSOR ── */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const outline = document.getElementById('custom-cursor-outline');
  if (!cursor || !outline) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animate() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

    outlineX += (mouseX - outlineX) * 0.1;
    outlineY += (mouseY - outlineY) * 0.1;
    outline.style.transform = `translate3d(${outlineX - 16}px, ${outlineY - 16}px, 0)`;

    requestAnimationFrame(animate);
  }
  animate();

  // Hover states
  const interactables = document.querySelectorAll('a, button, .card, input, textarea');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => outline.classList.remove('cursor-hover'));
  });
}

/* ── 4. SKILL BARS ── */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ── 5. SIDE DOTS ── */
function initSideDots() {
  const dots = document.querySelectorAll('.side-dots a');
  const sections = ['works', 'hero', 'about', 'experience', 'skills', 'projects', 'contact'];

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
}

/* ── 6. COUNT-UP STATS ── */
function initCountUp() {
  const nums = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetStr = el.dataset.target;
        if (!targetStr) return; // Skip if no numeric target (like infinity symbol)
        
        const target = parseInt(targetStr);
        const suffix = el.innerText.replace(/[0-9]/g, '');
        let count = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            el.innerText = target + suffix;
            clearInterval(timer);
          } else {
            el.innerText = Math.floor(count) + suffix;
          }
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => {
    const numericValue = n.innerText.replace(/[^0-9]/g, '');
    if (numericValue) {
      n.dataset.target = numericValue;
      observer.observe(n);
    }
  });
}

/* ── MOBILE MENU ── */
window.toggleMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
};
