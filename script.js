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
  const floatingWa  = document.getElementById('floatingWa');
  const heroSection = document.getElementById('hero');

  if (heroSection) {
    const ctaObs = new IntersectionObserver((entries) => {
      const show = !entries[0].isIntersecting;
      if (floatingCta) floatingCta.classList.toggle('visible', show);
      if (floatingWa)  floatingWa.classList.toggle('visible', show);
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
    form.querySelector('#email').addEventListener('input', (e) => {
      let rt = form.querySelector('[name="_replyto"]');
      if (!rt) { rt = Object.assign(document.createElement('input'), { type: 'hidden', name: '_replyto' }); form.appendChild(rt); }
      rt.value = e.target.value;
    });
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
          form.style.display = 'none';
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


  /* ── VOLUNTEER FORM ── */
  const vForm = document.getElementById('volunteerForm');
  if (vForm) {
    vForm.querySelector('#vEmail').addEventListener('input', (e) => {
      vForm.querySelector('[name="_replyto"]').value = e.target.value;
    });
    vForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn     = vForm.querySelector('.vform-submit');
      const success = document.getElementById('volunteerSuccess');
      const error   = document.getElementById('volunteerError');
      const orig    = btn.innerHTML;
      btn.disabled  = true;
      btn.innerHTML = '… wird gesendet';
      try {
        const res = await fetch(vForm.action, { method: 'POST', body: new FormData(vForm), headers: { Accept: 'application/json' } });
        if (res.ok) {
          vForm.style.display = 'none';
          success.style.display = 'flex';
        } else {
          throw new Error();
        }
      } catch {
        btn.innerHTML = orig;
        btn.disabled  = false;
        error.style.display = 'flex';
      }
    });
  }


  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const open   = btn.getAttribute('aria-expanded') === 'true';
      // close all others
      document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.classList.remove('open');
        }
      });
      btn.setAttribute('aria-expanded', String(!open));
      answer.classList.toggle('open', !open);
    });
  });


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


  /* ── KOSTENRECHNER 24h ── */
  (function initCalc() {
    const PFLEGEGELD = {
      1: 206.20, 2: 380.30, 3: 592.60, 4: 888.50,
      5: 1206.90, 6: 1685.40, 7: 2214.80
    };
    const STUFE_LABEL = ['', 'Stufe 1', 'Stufe 2', 'Stufe 3', 'Stufe 4', 'Stufe 5', 'Stufe 6', 'Stufe 7'];

    function fmtEUR(n) {
      return n.toFixed(2)
        .replace('.', ',')
        .replace(/(\d)(?=(\d{3})+,)/g, '$1.');
    }

    function set(id, val) {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    }

    function calcUpdate() {
      const bl    = document.getElementById('calcBundesland').value;
      const stufe = parseInt(document.getElementById('calcStufe').value, 10);

      const tagessatz28 = 90 * 28;
      const agentur     = 280;
      const reise       = 200;
      const bundesf     = stufe >= 3 ? 800 : 0;
      const landesf     = (bl === 'bgld' && stufe >= 3) ? 500 : 0;
      const pflegegeld  = PFLEGEGELD[stufe];

      const total = Math.max(0, tagessatz28 + agentur + reise - bundesf - landesf - pflegegeld);

      const totalEl = document.getElementById('calcTotal');
      if (totalEl) {
        totalEl.style.opacity = '0.4';
        setTimeout(() => {
          totalEl.textContent = fmtEUR(total);
          totalEl.style.opacity = '1';
        }, 120);
      }

      set('d_tagessatz', fmtEUR(tagessatz28));
      set('d_agentur',   fmtEUR(agentur));
      set('d_reise',     fmtEUR(reise));
      set('d_bundes',    bundesf > 0 ? '− ' + fmtEUR(bundesf) : fmtEUR(0));
      set('d_landes',    landesf > 0 ? '− ' + fmtEUR(landesf) : fmtEUR(0));
      set('d_pflegegeld', '− ' + fmtEUR(pflegegeld));
      set('d_pflegegeld_label', 'Pflegegeld (' + STUFE_LABEL[stufe] + ')');
      set('d_total', fmtEUR(total));
    }

    const blSel = document.getElementById('calcBundesland');
    const stSel = document.getElementById('calcStufe');
    if (!blSel || !stSel) return;

    blSel.addEventListener('change', calcUpdate);
    stSel.addEventListener('change', calcUpdate);
    calcUpdate();

    const toggleBtn  = document.getElementById('calcToggleBtn');
    const detailsDiv = document.getElementById('calcDetails');
    const toggleIcon = document.getElementById('calcToggleIcon');
    const toggleText = document.getElementById('calcToggleText');

    if (toggleBtn && detailsDiv) {
      toggleBtn.addEventListener('click', () => {
        const open = detailsDiv.style.display === 'block';
        detailsDiv.style.display = open ? 'none' : 'block';
        if (toggleIcon) toggleIcon.classList.toggle('open', !open);
        if (toggleText) toggleText.textContent = open ? 'Details anzeigen' : 'Details ausblenden';
      });
    }

    const resetBtn = document.getElementById('calcResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        blSel.value = 'noe';
        stSel.value = '3';
        calcUpdate();
        if (detailsDiv) detailsDiv.style.display = 'none';
        if (toggleIcon) toggleIcon.classList.remove('open');
        if (toggleText) toggleText.textContent = 'Details anzeigen';
      });
    }
  })();

})();
