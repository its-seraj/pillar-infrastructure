/* ============================================================
   PILLAR INFRASTRUCTURE PVT. LTD. — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Module 1: Navbar Scroll ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Module 2: Mobile Hamburger Menu ─────────────────────── */
  const toggle   = document.querySelector('.navbar__toggle');
  const navMenu  = document.querySelector('.navbar__nav');
  if (toggle && navMenu) {
    const closeMenu = () => {
      toggle.classList.remove('open');
      navMenu.classList.remove('mobile-open');
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('mobile-open');
      toggle.classList.toggle('open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('.navbar__link').forEach(link =>
      link.addEventListener('click', closeMenu)
    );

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) closeMenu();
    });
  }

  /* ── Module 3: Active Nav Link ───────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Module 4: Stats Counter ─────────────────────────────── */
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const counters = statsSection.querySelectorAll('.stats__number[data-target]');

    function animateCounter(el, target, duration) {
      const suffix = el.dataset.suffix || '';
      const start  = performance.now();
      const step   = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 4); // easeOutQuart
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(el => animateCounter(el, parseInt(el.dataset.target, 10), 2200));
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* ── Module 5: AOS Initialization ───────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-quart',
      once: true,
      offset: 80,
    });
  }

  /* ── Module 6: Project Filter ────────────────────────────── */
  const filterContainer = document.querySelector('.projects__filter');
  if (filterContainer) {
    const filterBtns  = filterContainer.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        projectCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          if (match) {
            card.style.display = 'block';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              if (card.style.opacity === '0') card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /* ── Module 7: Project Modal ─────────────────────────────── */
  const modal = document.getElementById('project-modal');
  if (modal) {
    const modalImg      = modal.querySelector('.modal__img');
    const modalTag      = modal.querySelector('.modal__tag');
    const modalTitle    = modal.querySelector('.modal__title');
    const modalLocation = modal.querySelector('.modal__location');
    const modalArea     = modal.querySelector('.modal__area');
    const modalDesc     = modal.querySelector('.modal__desc');

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    };

    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        if (modalImg)      modalImg.src             = card.querySelector('.project-card__img')?.src || '';
        if (modalImg)      modalImg.alt             = card.dataset.projectTitle || '';
        if (modalTag)      modalTag.textContent      = card.dataset.category || '';
        if (modalTitle)    modalTitle.textContent    = card.dataset.projectTitle || '';
        if (modalLocation) modalLocation.textContent = card.dataset.projectLocation || '';
        if (modalArea)     modalArea.textContent     = card.dataset.projectArea || '';
        if (modalDesc)     modalDesc.textContent     = card.dataset.projectDesc || '';
        modal.classList.add('active');
        document.body.classList.add('modal-open');
      });
    });

    modal.querySelector('.modal__close')?.addEventListener('click', closeModal);
    modal.querySelector('.modal__overlay')?.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  /* ── Module 8: Contact Form Validation ───────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    const showError = (fieldName, msg) => {
      const el = form.querySelector(`#${fieldName}-error`);
      if (el) el.textContent = msg;
    };
    const clearErrors = () =>
      form.querySelectorAll('.form-error').forEach(el => (el.textContent = ''));

    form.addEventListener('submit', (e) => {
      clearErrors();
      let valid = true;

      const name    = form.elements['name']?.value.trim() || '';
      const email   = form.elements['email']?.value.trim() || '';
      const phone   = form.elements['phone']?.value.trim() || '';
      const service = form.elements['service']?.value || '';
      const message = form.elements['message']?.value.trim() || '';

      if (name.length < 2) {
        showError('name', 'Please enter your full name.');
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'Please enter a valid email address.');
        valid = false;
      }
      if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
        showError('phone', 'Enter a valid 10-digit Indian mobile number.');
        valid = false;
      }
      if (!service) {
        showError('service', 'Please select the service you need.');
        valid = false;
      }
      if (message.length < 15) {
        showError('message', 'Please describe your project (at least 15 characters).');
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
        const firstError = form.querySelector('.form-error:not(:empty)');
        firstError?.previousElementSibling?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    /* Show success state if Formspree redirects back with ?success */
    if (window.location.search.includes('success')) {
      form.style.display = 'none';
      const success = form.nextElementSibling;
      if (success?.classList.contains('form__success')) success.style.display = 'block';
    }
  }

});
