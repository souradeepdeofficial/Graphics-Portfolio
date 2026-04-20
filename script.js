/**
 * Souradeep De — Portfolio Website
 * Main JavaScript — Interactions, Animations & Form Handling
 */

(function () {
  'use strict';

  // ===== DOM REFERENCES =====
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = mobileNav?.querySelectorAll('a');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card, .portfolio__featured');
  const revealElements = document.querySelectorAll('.reveal');

  // ===== MOBILE NAV =====
  function toggleMobileNav() {
    const isOpen = hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileNav() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', toggleMobileNav);

  mobileNavLinks?.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== NAVBAR SHADOW =====
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 10) {
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)';
    } else {
      navbar.style.boxShadow = 'none';
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ===== SCROLL REVEAL =====
  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const revealPoint = 80;
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - revealPoint) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll();

  // ===== PORTFOLIO FILTERING =====
  filterPills.forEach(pill => {
    pill.addEventListener('click', function () {
      filterPills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          card.style.display = '';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          });
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ===== CONTACT FORM =====
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(id, show) {
    const errorEl = document.getElementById(id);
    if (errorEl) errorEl.classList.toggle('visible', show);
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
  }

  contactForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();
    let isValid = true;
    if (!name) { showError('name-error', true); isValid = false; }
    if (!email || !validateEmail(email)) { showError('email-error', true); isValid = false; }
    if (!message) { showError('message-error', true); isValid = false; }
    if (!isValid) return;
    const submitBtn = document.getElementById('form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.classList.add('visible');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }, 1200);
  });

  document.getElementById('form-name')?.addEventListener('blur', function () {
    showError('name-error', !this.value.trim());
  });
  document.getElementById('form-email')?.addEventListener('blur', function () {
    showError('email-error', this.value.trim() && !validateEmail(this.value.trim()));
  });
  document.getElementById('form-message')?.addEventListener('blur', function () {
    showError('message-error', !this.value.trim());
  });

  // ===== STAT COUNTER ANIMATION =====
  function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-card__number');
    statNumbers.forEach(el => {
      if (el.dataset.animated) return;
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      el.dataset.animated = 'true';
      const text = el.textContent;
      const number = parseFloat(text);
      const suffix = text.replace(/[\d.]/g, '');
      const duration = 1500;
      const startTime = performance.now();
      const isDecimal = text.includes('.');
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * number;
        if (isDecimal) { el.textContent = current.toFixed(1) + suffix; }
        else { el.textContent = Math.floor(current) + suffix; }
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();

  // ===== ACTIVE NAV HIGHLIGHTING =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  function highlightNavLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) { link.style.color = '#1A1A1A'; }
          else { link.style.color = ''; }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // ===== PARALLAX =====
  const heroVisual = document.querySelector('.hero__visual');
  function heroParallax() {
    if (!heroVisual || window.innerWidth < 768) return;
    const scrollY = window.scrollY;
    if (scrollY < 600) { heroVisual.style.transform = `translateY(${scrollY * 0.08}px)`; }
  }
  window.addEventListener('scroll', heroParallax, { passive: true });

  console.log('%c✨ Souradeep De — Portfolio Website', 'font-size: 16px; font-weight: bold; color: #2AABB8;');
  console.log('%cDesigned & Built with care', 'font-size: 12px; color: #6B7280;');

})();