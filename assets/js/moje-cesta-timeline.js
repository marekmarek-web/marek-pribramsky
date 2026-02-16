/**
 * Moje cesta – timeline křivka vlevo + detail karta vpravo
 * GSAP ScrollTrigger, getPointAtLength pro pozice bodů po křivce
 */
(function () {
  var MILESTONES = [
    { year: '2013', title: 'První kroky v OVB', text: 'Během studia 5. ročníku na ekonomické VŠ jsem začal pracovat v OVB Allfinanz a.s.' },
    { year: '2015', title: 'Přestup do FINGO', text: 'Pochopení, že existují lepší možnosti – přestup do F&P Consulting s.r.o. (dnešní FINGO)' },
    { year: '2016', title: 'Fulltime v Broker Trust', text: 'Ukončení zaměstnání a přechod na fulltime režim do financí v Broker Trust a.s.' },
    { year: '2019', title: 'Založení Premium Brokers', text: 'Založení vlastní firmy Premium Brokers s.r.o. pod záštitou Beplan finanční plánování s.r.o.' },
    { year: '2021', title: 'Nové pobočky', text: 'Otevření nových poboček v Litoměřicích, Štětí a Praze k současné Roudnické' },
    { year: '2024', title: 'Premium Brokers Reality', text: 'Založení realitní kanceláře Premium Brokers Reality s.r.o.' },
    { year: '2026', title: 'Lovosice a tým', text: 'Otevření pobočky v Lovosicích, velké posílení týmu ve financích i realitách' }
  ];

  var section, pathEl, dotsContainer, detailCard, detailYear, detailTitle, detailText, glowEl;
  var dotEls = [];
  var pathLength = 0;
  var scrollTriggerInstance = null;
  var activeIndex = 0;
  var resizeTimeout = null;
  var DEBOUNCE_MS = 150;

  function debounce(fn) {
    return function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(fn, DEBOUNCE_MS);
    };
  }

  function placeDots() {
    if (!pathEl || !dotsContainer) return;
    pathLength = pathEl.getTotalLength();
    var count = MILESTONES.length;
    dotsContainer.innerHTML = '';
    dotEls = [];

    for (var i = 0; i < count; i++) {
      var t = count > 1 ? i / (count - 1) : 0;
      var pt = pathEl.getPointAtLength(t * pathLength);
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'timeline-dot absolute w-4 h-4 rounded-full bg-brand-navy/40 border-2 border-white shadow-sm transition-all duration-300 hover:scale-125 hover:bg-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 pointer-events-auto';
      dot.setAttribute('data-index', String(i));
      dot.setAttribute('aria-label', 'Milník ' + MILESTONES[i].year);
      dot.style.left = (pt.x / 200 * 100) + '%';
      dot.style.top = (pt.y / 600 * 100) + '%';
      dot.style.transform = 'translate(-50%, -50%)';
      dotsContainer.appendChild(dot);
      dotEls.push({ el: dot, index: i });

      dot.addEventListener('click', function (e) {
        var idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        setActive(idx);
      });
    }
  }

  function setActive(index) {
    if (index < 0 || index >= MILESTONES.length) return;
    activeIndex = index;
    var m = MILESTONES[index];

    if (detailYear) detailYear.textContent = m.year;
    if (detailTitle) detailTitle.textContent = m.title;
    if (detailText) detailText.textContent = m.text;

    dotEls.forEach(function (d) {
      var isActive = d.index === index;
      d.el.classList.toggle('timeline-dot--active', isActive);
      d.el.classList.toggle('scale-125', isActive);
      d.el.classList.toggle('bg-brand-cyan', isActive);
      d.el.classList.toggle('bg-brand-navy/40', !isActive);
    });

    if (glowEl && pathEl) {
      var t = MILESTONES.length > 1 ? index / (MILESTONES.length - 1) : 0;
      var pt = pathEl.getPointAtLength(t * pathLength);
      glowEl.style.left = (pt.x / 200 * 100) + '%';
      glowEl.style.top = (pt.y / 600 * 100) + '%';
      glowEl.style.transform = 'translate(-50%, -50%)';
      glowEl.style.opacity = '1';
    }
  }

  function initTimeline() {
    section = document.getElementById('moje-cesta');
    if (!section) return;

    var desktop = document.getElementById('moje-cesta-desktop');
    if (!desktop || window.innerWidth < 1024) return;

    pathEl = document.getElementById('timeline-path');
    dotsContainer = document.getElementById('timeline-dots');
    detailCard = document.getElementById('timeline-detail-card');
    detailYear = document.getElementById('timeline-detail-year');
    detailTitle = document.getElementById('timeline-detail-title');
    detailText = document.getElementById('timeline-detail-text');
    glowEl = document.getElementById('timeline-active-glow');

    if (!pathEl || !dotsContainer || typeof gsap === 'undefined' || !gsap.registerPlugin) return;

    gsap.registerPlugin(ScrollTrigger);
    placeDots();
    setActive(0);

    if (glowEl) {
      glowEl.style.background = 'radial-gradient(circle, rgba(79,198,242,0.35) 0%, transparent 70%)';
    }

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: section,
      start: 'top 30%',
      end: 'bottom 30%',
      scrub: 0.5,
      onUpdate: function (self) {
        var progress = self.progress;
        var idx = Math.round(progress * (MILESTONES.length - 1));
        idx = Math.max(0, Math.min(idx, MILESTONES.length - 1));
        setActive(idx);
      }
    });
  }

  function destroyTimeline() {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }
    dotEls = [];
    dotsContainer = dotsContainer || document.getElementById('timeline-dots');
    if (dotsContainer) dotsContainer.innerHTML = '';
    if (glowEl) glowEl.style.opacity = '0';
  }

  function checkAndInit() {
    var desktop = document.getElementById('moje-cesta-desktop');
    if (window.innerWidth >= 1024 && desktop) {
      initTimeline();
    } else {
      destroyTimeline();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    checkAndInit();
  });

  window.addEventListener('resize', debounce(function () {
    destroyTimeline();
    checkAndInit();
  }));
})();
