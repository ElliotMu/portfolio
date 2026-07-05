/* ==========================================================================
   Elliot Musart — Portfolio interactions
   Deliberately restrained: a scrolled-state on the nav, scrollspy for the
   active link, and a soft fade-up reveal for content as it enters view.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav shadow on scroll ---------- */
  const nav = document.querySelector('.navbar');
  function updateNavState() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  updateNavState();
  window.addEventListener('scroll', updateNavState, { passive: true });

  /* ---------- Scrollspy ---------- */
  const navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link'));
  const sections = navLinks
    .map(link => {
      const href = link.getAttribute('href') || '';
      const id = href.includes('#') ? href.split('#')[1] : null;
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  function setActiveLink() {
    if (!sections.length) return;
    let currentId = sections[0].id;
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) currentId = section.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const id = href.includes('#') ? href.split('#')[1] : null;
      link.classList.toggle('is-active', id === currentId);
    });
  }
  if (sections.length) {
    setActiveLink();
    window.addEventListener('scroll', setActiveLink, { passive: true });
  }

  /* ---------- Projects carousel (loops) ---------- */
  const track = document.getElementById('projectsTrack');
  const prevBtn = document.getElementById('projectsPrev');
  const nextBtn = document.getElementById('projectsNext');

  if (track && prevBtn && nextBtn) {
    function scrollAmount() {
      const slide = track.querySelector('.project-slide');
      if (!slide) return track.clientWidth;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || '0');
      return slide.getBoundingClientRect().width + gap;
    }

    function maxScroll() {
      return track.scrollWidth - track.clientWidth;
    }

    nextBtn.addEventListener('click', () => {
      if (track.scrollLeft >= maxScroll() - 2) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      }
    });

    prevBtn.addEventListener('click', () => {
      if (track.scrollLeft <= 2) {
        track.scrollTo({ left: maxScroll(), behavior: 'smooth' });
      } else {
        track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }
});