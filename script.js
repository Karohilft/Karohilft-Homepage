/* ═══════════════════════════════════════════════
   KARO HILFT — Interactions & Animations
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── NAV SCROLL EFFECT ── */
  const nav = document.getElementById('nav');

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ── MOBILE NAV ── */
  const burger       = document.getElementById('navBurger');
  const mobileNav    = document.getElementById('mobileNav');
  const mobileClose  = document.getElementById('mobileClose');
  const mobileOverlay= document.getElementById('mobileOverlay');
  const mobileLinks  = mobileNav.querySelectorAll('a');

  function openNav() {
    mobileNav.classList.add('open');
    mobileOverlay.classList.add('open');
    burger.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('open');
    burger.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', openNav);
  mobileClose.addEventListener('click', closeNav);
  mobileOverlay.addEventListener('click', closeNav);
  mobileLinks.forEach(link => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeNav();
  });


  /* ── SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 88;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // stagger siblings within the same parent
      const parent = entry.target.parentElement;
      const siblings = [...parent.querySelectorAll(':scope > .reveal')];
      const idx = siblings.indexOf(entry.target);
      const delay = Math.max(0, idx * 90);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObs.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  revealEls.forEach(el => revealObs.observe(el));

  // Hero elements animate in immediately on load
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 130);
  });


  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.count[data-target]');

  function animateCounter(el) {
    const target  = parseInt(el.dataset.target, 10);
    const duration = target > 100 ? 2200 : 1600;
    const start   = Date.now();

    function tick() {
      const elapsed  = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString('de-AT');
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObs.observe(el));


  /* ── PARALLAX: EMOTIONAL SECTION ── */
  const emotionalBg = document.querySelector('.emotional-bg');

  if (emotionalBg) {
    const section = emotionalBg.closest('section');

    function parallax() {
      const rect = section.getBoundingClientRect();
      const vh   = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;

      const progress = (vh - rect.top) / (vh + rect.height);
      const shift    = (progress - 0.5) * 70;
      emotionalBg.style.transform = `translateY(${shift}px) scale(1.12)`;
    }

    window.addEventListener('scroll', parallax, { passive: true });
    parallax();
  }


  /* ── FLOATING CTA ── */
  const floatingCta = document.getElementById('floatingCta');
  const heroSection = document.getElementById('hero');

  if (floatingCta && heroSection) {
    const ctaObs = new IntersectionObserver((entries) => {
      // Show floating CTA when hero is no longer visible
      if (!entries[0].isIntersecting) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    }, { threshold: 0.1 });

    ctaObs.observe(heroSection);
  }


  /* ── CARD TILT ON HOVER (subtle 3D) ── */
  const tiltCards = document.querySelectorAll('.service-card, .hero-stat-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 4;
      const rotY   =  dx * 4;

      card.style.transform = `
        translateY(-8px)
        perspective(800px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ── SERVICE CARD ENTRANCE STAGGER ── */
  const serviceCards = document.querySelectorAll('.service-card');

  const serviceObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const cards = [...serviceCards];
      const idx   = cards.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 120);
      serviceObs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  serviceCards.forEach(card => {
    card.classList.add('reveal');
    serviceObs.observe(card);
  });


  /* ── CONTACT FORM ── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('.cform-submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 11-4.2-7.6"/></svg> Wird gesendet …';
      btn.disabled = true;

      try {
        const data = new FormData(form);
        const res  = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.hidden = true;
          formSuccess.hidden = false;
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          btn.innerHTML = originalText;
          btn.disabled  = false;
          alert('Etwas ist schiefgelaufen. Bitte rufen Sie uns direkt an: +43 677 614 82 115');
        }
      } catch {
        // Fallback: open email client if fetch fails (e.g. form ID not configured)
        window.location.href = 'mailto:office@karohilft.at?subject=Anfrage%20von%20der%20Website';
        btn.innerHTML = originalText;
        btn.disabled  = false;
      }
    });
  }


  /* ── SERVICE CARD EXPAND ── */
  document.querySelectorAll('.service-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card   = btn.closest('.service-card');
      const detail = card.querySelector('.service-detail');
      const open   = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', String(!open));
      detail.classList.toggle('open', !open);
      btn.firstChild.textContent = open ? 'Mehr erfahren' : 'Weniger ';
    });
  });


  /* ── MOBILE LEISTUNGEN SUB-MENU ── */
  document.querySelectorAll('.mobile-sub-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const sub  = toggle.nextElementSibling;
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      sub.hidden = open;
    });
  });


  /* ── ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObs.observe(s));

})();
