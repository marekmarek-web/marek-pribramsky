/**
 * Reference – Focus Marquee (plynulý pás recenzí)
 */
function initReviewsSlider() {
  var container = document.getElementById('reviews-scroll');
  if (!container) return;

  var dupTrack = document.getElementById('reviews-scroll-dup');

  var GOOGLE_G = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
  var fallback = [
    { author: 'Jan P.', initials: 'JP', rating: 5, date_relative: 'před rokem', source: 'Google', text: 'Profesionální přístup, jasná doporučení.' },
    { author: 'Marie K.', initials: 'MK', rating: 5, date_relative: 'před rokem', source: 'Google', text: 'Komplexní pohled na osobní i firemní finance.' },
    { author: 'Lucie V.', initials: 'LV', rating: 5, date_relative: 'před rokem', source: 'Google', text: 'Spolupráce na hypotéce byla bez stresu.' }
  ];

  var data = [];

  function render(list) {
    data = Array.isArray(list) && list.length ? list.slice() : fallback.slice();

    container.innerHTML = '';
    data.forEach(function (r) {
      var stars = '★'.repeat(r.rating || 5);
      var card = document.createElement('article');
      card.className = 'review-scroll-card';
      card.innerHTML =
        '<div class="review-scroll-stars">' + stars + '</div>' +
        '<p class="review-scroll-quote">' + (r.text || '').replace(/^["„]|[""]$/g, '') + '</p>' +
        '<div class="review-scroll-footer">' +
        '<div class="review-scroll-avatar">' + (r.initials || '?') + '</div>' +
        '<div class="review-scroll-meta"><h4>' + (r.author || '') + '</h4><span>' + (r.date_relative || r.date || 'Google recenze') + '</span></div>' +
        '<div class="review-scroll-google">' + GOOGLE_G + '</div></div>';
      container.appendChild(card);
    });

    // Duplikace obsahu pro plynulý marquee loop
    if (dupTrack) {
      dupTrack.innerHTML = container.innerHTML;
    }

    // Pause marquee jen při najetí na kartu recenze (ne na celou sekci)
    var refMarquee = container.closest('.reference-marquee');
    if (refMarquee) {
      function pauseMarquee() { refMarquee.classList.add('marquee-paused'); }
      function resumeMarquee() { refMarquee.classList.remove('marquee-paused'); }
      container.querySelectorAll('.review-scroll-card').forEach(function (c) {
        c.addEventListener('mouseenter', pauseMarquee);
        c.addEventListener('mouseleave', resumeMarquee);
      });
      if (dupTrack) {
        dupTrack.querySelectorAll('.review-scroll-card').forEach(function (c) {
          c.addEventListener('mouseenter', pauseMarquee);
          c.addEventListener('mouseleave', resumeMarquee);
        });
      }
    }
  }

  try {
    var el = document.getElementById('reviews-data');
    if (el && el.textContent) data = JSON.parse(el.textContent);
  } catch (err) {}

  if (Array.isArray(data) && data.length) {
    render(data);
  } else {
    var base = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/\/[^/]*$/, '/') : '';
    var url = base ? base + '../data/reviews-marek.json' : './assets/data/reviews-marek.json';
    fetch(url)
      .then(function (res) { return res.ok ? res.json() : Promise.reject(res); })
      .then(function (d) {
        render(d);
      })
      .catch(function () {
        render(fallback);
      });
  }
}

/**
 * Hlavní skript – mobilní menu, dropdown Nástroje, formulář
 * Spouští se po DOMContentLoaded i po načtení partials (partialsLoaded)
 */
function init() {
  // Hero – text reveal (Aurora style)
  var revealLines = document.querySelectorAll('.text-reveal-line');
  if (revealLines.length && typeof gsap !== 'undefined') {
    gsap.to(revealLines, {
      y: '0%',
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out',
      delay: 0.2
    });
    var heroSub = document.querySelector('.hero-subtitle');
    if (heroSub) {
      gsap.to(heroSub, { opacity: 1, duration: 1, delay: 1, ease: 'power2.out' });
    }
  }

  // Mobilní menu
  var menuBtn = document.getElementById('mobile-menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    function openMenu() {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    menuBtn.addEventListener('click', function () {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    var backdrop = mobileMenu.querySelector('[data-close-menu]');
    if (backdrop) backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });
  }

  // Dropdown Nástroje (desktop)
  var toolsBtn = document.getElementById('nav-tools-btn');
  var toolsDropdown = document.getElementById('nav-tools-dropdown');
  if (toolsBtn && toolsDropdown) {
    toolsBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toolsDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', function () {
      toolsDropdown.classList.add('hidden');
    });
  }

  // Konverzační lead – krok 1: výběr tématu → krok 2: jméno, e-mail, telefon
  var sfStep1 = document.getElementById('sf-step-1');
  var sfStep2 = document.getElementById('sf-step-2');
  var leadTopicInput = document.getElementById('lead-topic');
  document.querySelectorAll('.smart-choice[data-topic]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var topic = btn.getAttribute('data-topic') || '';
      if (leadTopicInput) leadTopicInput.value = topic;
      if (sfStep1) sfStep1.classList.add('hidden');
      if (sfStep2) { sfStep2.classList.remove('hidden'); sfStep2.querySelector('input, select') && sfStep2.querySelector('input').focus(); }
    });
  });

  // Formulář lead – POST (zachován fetch, přidán telefon)
  var leadForm = document.getElementById('lead-form-el');
  var leadSuccess = document.getElementById('lead-success');
  var leadError = document.getElementById('lead-error');
  if (leadForm && leadSuccess) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (leadError) leadError.classList.add('hidden');
      var btn = leadForm.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Odesílám…'; }
      var fd = new FormData(leadForm);
      var phone = (fd.get('phone') || '').toString().trim();
      var contact = (fd.get('contact') || '').toString().trim();
      if (phone) contact = contact ? contact + ' | ' + phone : phone;
      var payload = {
        _subject: 'Nezávazná konzultace – web',
        name: fd.get('name') || '',
        contact: contact,
        topic: fd.get('topic') || fd.get('message') || '',
        message: fd.get('message') || '',
        phone: phone,
        consent: fd.get('consent') ? 'ano' : 'ne',
        page: location.href,
        created_at: new Date().toISOString()
      };
      fetch('https://formsubmit.co/ajax/pribramsky@premiumbrokers.cz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Network error');
          return res.json().catch(function () { return {}; });
        })
        .then(function () {
          if (sfStep2) sfStep2.classList.add('hidden');
          leadForm.classList.add('hidden');
          leadSuccess.classList.remove('hidden');
        })
        .catch(function () {
          if (leadError) {
            leadError.textContent = 'Nepodařilo se odeslat. Zkuste to prosím znovu.';
            leadError.classList.remove('hidden');
          }
          if (btn) { btn.disabled = false; btn.textContent = 'Nezávazná konzultace'; }
        });
    });
  }

  // Footer – lead form (jméno, email required; telefon volitelné; select)
  var footerQuickLead = document.getElementById('footer-quick-lead');
  var footerMsg = document.getElementById('footer-lead-msg');
  var footerErr = document.getElementById('footer-lead-err');
  if (footerQuickLead) {
    footerQuickLead.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInp = document.getElementById('footer-name');
      var emailInp = document.getElementById('footer-email');
      var name = nameInp && nameInp.value.trim();
      var email = emailInp && emailInp.value.trim();
      if (footerErr) { footerErr.classList.add('hidden'); footerErr.textContent = ''; }
      if (!name) { if (footerErr) { footerErr.textContent = 'Vyplňte jméno.'; footerErr.classList.remove('hidden'); } return; }
      if (!email) { if (footerErr) { footerErr.textContent = 'Vyplňte e-mail.'; footerErr.classList.remove('hidden'); } return; }
      var btn = footerQuickLead.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Odesílám…'; }
      var payload = {
        _subject: 'Nezávazná konzultace – footer',
        name: name,
        email: email,
        phone: (document.getElementById('footer-phone') && document.getElementById('footer-phone').value.trim()) || '',
        interest: (document.getElementById('footer-interest') && document.getElementById('footer-interest').value) || '',
        source: 'footer-lead',
        page: location.href,
        created_at: new Date().toISOString()
      };
      fetch('https://formsubmit.co/ajax/pribramsky@premiumbrokers.cz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Network error');
          return res.json().catch(function () { return {}; });
        })
        .then(function () {
          footerQuickLead.reset();
          if (footerMsg) footerMsg.classList.remove('hidden');
          if (btn) { btn.disabled = false; btn.textContent = 'Odeslat'; }
        })
        .catch(function () {
          var mailto = 'mailto:pribramsky@premiumbrokers.cz?subject=Nezávazná konzultace&body=' + encodeURIComponent('Jméno: ' + name + '\nE-mail: ' + email + '\nTelefon: ' + (payload.phone || '-') + '\nZájem: ' + (payload.interest || '-'));
          window.location.href = mailto;
          if (footerMsg) footerMsg.classList.remove('hidden');
          if (btn) { btn.disabled = false; btn.textContent = 'Odeslat'; }
        });
    });
  }

  // Reference – Apple Watch tiles
  initReviewsSlider();

  // Pro koho – Persona Switcher (Koncept 1)
  var personaBtns = document.querySelectorAll('.persona-btn[data-persona]');
  var personaPanels = document.querySelectorAll('.persona-content');
  function switchPersona(id) {
    personaBtns.forEach(function (btn) {
      var isActive = btn.getAttribute('data-persona') === id;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    personaPanels.forEach(function (panel) {
      var isTarget = panel.id === 'persona-' + id;
      panel.classList.toggle('active', isTarget);
      panel.classList.toggle('hidden', !isTarget);
    });
  }
  personaBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchPersona(btn.getAttribute('data-persona'));
    });
    btn.addEventListener('keydown', function (e) {
      var idx = Array.prototype.indexOf.call(personaBtns, btn);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var dir = e.key === 'ArrowRight' ? 1 : -1;
        var nextIdx = (idx + dir + personaBtns.length) % personaBtns.length;
        personaBtns[nextIdx].focus();
        switchPersona(personaBtns[nextIdx].getAttribute('data-persona'));
      }
      if (e.key === 'Home') {
        e.preventDefault();
        personaBtns[0].focus();
        switchPersona(personaBtns[0].getAttribute('data-persona'));
      }
      if (e.key === 'End') {
        e.preventDefault();
        var last = personaBtns[personaBtns.length - 1];
        last.focus();
        switchPersona(last.getAttribute('data-persona'));
      }
    });
  });

  // FAQ – switcher (bubble, hover + click)
  var faqSwitcher = document.querySelector('.faq-switcher[data-tabs]');
  if (faqSwitcher) {
    var faqTabs = [].slice.call(faqSwitcher.querySelectorAll('.faq-tab'));

    function setFaqActive(tab) {
      var idx = faqTabs.indexOf(tab);
      faqTabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
      faqSwitcher.style.setProperty('--bubble-x', idx * 100 + '%');

      document.querySelectorAll('.faq-panel').forEach(function (p) { p.classList.remove('active'); });
      var panel = document.querySelector('.faq-panel[data-panel="' + tab.dataset.tab + '"]');
      if (panel) panel.classList.add('active');
    }

    faqTabs.forEach(function (t) {
      t.addEventListener('mouseenter', function () { setFaqActive(t); });
      t.addEventListener('click', function (e) { setFaqActive(e.currentTarget); });
    });

    var initTab = faqSwitcher.querySelector('.faq-tab.active') || faqTabs[0];
    if (initTab) setFaqActive(initTab);
  }

  // FAQ – otázky v panelu (klik jen přepíná obsah v boxu, žádný layout shift)
  document.querySelectorAll('.faq-panel').forEach(function (panel) {
    var qs = [].slice.call(panel.querySelectorAll('.faq-q'));

    function setQ(btn) {
      qs.forEach(function (b) { b.classList.toggle('active', b === btn); });
      panel.querySelectorAll('.faq-a').forEach(function (a) { a.classList.remove('active'); });
      var id = btn.dataset.answer;
      var el = panel.querySelector('#' + id);
      if (el) el.classList.add('active');
    }

    qs.forEach(function (b) {
      b.addEventListener('click', function () { setQ(b); });
    });
    var initQ = panel.querySelector('.faq-q.active') || qs[0];
    if (initQ) setQ(initQ);
  });

  var mainHeader = document.getElementById('main-header');
  if (mainHeader) {
    function updateHeaderVisibility() {
      var sy = window.scrollY;
      mainHeader.classList.toggle('visible', sy > 60);
    }
    window.addEventListener('scroll', updateHeaderVisibility, { passive: true });
    updateHeaderVisibility();
  }

  // Můj postup – spotlight mouse tracking
  var postupBento = document.getElementById('postup-bento');
  if (postupBento) {
    postupBento.onmousemove = function (e) {
      var cards = postupBento.getElementsByClassName('postup-item');
      for (var i = 0; i < cards.length; i++) {
        var rect = cards[i].getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        cards[i].style.setProperty('--mouse-x', x + 'px');
        cards[i].style.setProperty('--mouse-y', y + 'px');
      }
    };
  }
  // Proč já – stejný spotlight efekt
  var procJaBento = document.getElementById('proc-ja-bento');
  if (procJaBento) {
    procJaBento.onmousemove = function (e) {
      var cards = procJaBento.getElementsByClassName('postup-item');
      for (var i = 0; i < cards.length; i++) {
        var rect = cards[i].getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        cards[i].style.setProperty('--mouse-x', x + 'px');
        cards[i].style.setProperty('--mouse-y', y + 'px');
      }
    };
  }

  // Scroll handlers – optimalizované s requestAnimationFrame throttling
  var scrollTicking = false;
  var sections = ['proc-ja', 'sluzby', 'moje-cesta', 'pobocky', 'reference', 'kontakt'];
  var processCards = document.querySelectorAll('.process-card');
  var processStack = document.querySelector('.process-stack');

  function updateActiveNav() {
    var scrollY = window.scrollY + 100;
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      var link = document.querySelector('.nav-link[data-section="' + id + '"]');
      if (el && link) {
        var top = el.offsetTop;
        var height = el.offsetHeight;
        link.classList.toggle('bg-brand-cyan/10', scrollY >= top && scrollY < top + height);
        link.classList.toggle('text-brand-navy', scrollY >= top && scrollY < top + height);
      }
    });
  }

  function updateProcessStack() {
    if (!processStack || !processCards.length) return;
    var viewportMid = window.innerHeight * 0.4;
    processCards.forEach(function (card) {
      var cardRect = card.getBoundingClientRect();
      var isInView = cardRect.top < viewportMid && cardRect.bottom > 100;
      card.classList.toggle('stacked', isInView);
    });
  }

  function updateProcJaProcess() {
    var section = document.getElementById('proc-ja');
    var lineFill = document.getElementById('proc-ja-line-fill');
    var axis = document.getElementById('proc-ja-process');
    if (!section || !lineFill || !axis) return;
    var nodes = axis.querySelectorAll('.process-node');
    if (!nodes.length) return;
    var sectionRect = section.getBoundingClientRect();
    var axisRect = axis.getBoundingClientRect();
    var viewportMid = window.innerHeight * 0.5;
    var lineHeight = axisRect.height;
    var lineTop = axisRect.top - sectionRect.top;
    var progress = 0;
    if (sectionRect.top < viewportMid && sectionRect.bottom > 100) {
      var visibleStart = Math.max(0, viewportMid - sectionRect.top - lineTop);
      progress = Math.min(1, visibleStart / lineHeight);
    }
    lineFill.style.height = (progress * 100) + '%';
    var activeIndex = 0;
    nodes.forEach(function (node, i) {
      var r = node.getBoundingClientRect();
      var nodeMid = r.top + r.height / 2;
      if (nodeMid <= viewportMid + 40) activeIndex = i;
      node.classList.toggle('active', i === activeIndex);
    });
  }

  function onScroll() {
    if (!scrollTicking) {
      window.requestAnimationFrame(function() {
        updateActiveNav();
        updateProcessStack();
        updateProcJaProcess();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', function() {
    updateActiveNav();
    updateProcessStack();
    updateProcJaProcess();
  });

  // Scroll-reveal (IntersectionObserver)
  var revealEls = document.querySelectorAll('.scroll-reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('revealed');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  // Služby – spotlight mouse tracking
  var sluzbySection = document.getElementById('sluzby');
  if (sluzbySection) {
    sluzbySection.addEventListener('mousemove', function(e) {
      var cards = sluzbySection.querySelectorAll('.sluzby-card-inner');
      for (var i = 0; i < cards.length; i++) {
        var r = cards[i].getBoundingClientRect();
        cards[i].style.setProperty('--sluzby-mx', (e.clientX - r.left) + 'px');
        cards[i].style.setProperty('--sluzby-my', (e.clientY - r.top) + 'px');
      }
    });
  }

  // Projekce majetku – SVG graf (Aurora Performance styl), data + grid + tilt zachovány
  var wealthSvg = document.getElementById('wealthChartSvg');
  if (wealthSvg) {
    var labels = ['Start', '2 roky', '4 roky', '6 let', '8 let', '10 let'];
    var averageData = [500000, 505000, 510000, 515000, 520000, 526000];
    var strategyData = [500000, 550000, 650000, 750000, 900000, 1100000];
    var yMin = 500000;
    var yMax = 1100000;
    var w = 400;
    var h = 200;
    function yToCoord(val) { return h - ((val - yMin) / (yMax - yMin)) * h; }
    function xToCoord(i) { return (i / (strategyData.length - 1)) * w; }
    function dataToPath(data) {
      var pts = data.map(function(v, i) { return xToCoord(i) + ',' + yToCoord(v); });
      return 'M' + pts.join(' L');
    }
    function dataToPathSmooth(data) {
      var d = '';
      for (var i = 0; i < data.length; i++) {
        var x = xToCoord(i);
        var y = yToCoord(data[i]);
        if (i === 0) d += 'M' + x + ',' + y;
        else {
          var x0 = xToCoord(i - 1);
          var y0 = yToCoord(data[i - 1]);
          var cp1x = x0 + (x - x0) * 0.5;
          var cp2x = x0 + (x - x0) * 0.5;
          d += ' C' + cp1x + ',' + y0 + ' ' + cp2x + ',' + y + ' ' + x + ',' + y;
        }
      }
      return d;
    }
    var pathLine = document.getElementById('wealthChartPathLine');
    var pathFill = document.getElementById('wealthChartPathFill');
    var pathAvg = document.getElementById('wealthChartPathAverage');
    var lineD = dataToPathSmooth(strategyData);
    var fillD = lineD + ' V' + h + ' H0 Z';
    pathLine.setAttribute('d', lineD);
    pathFill.setAttribute('d', fillD);
    pathAvg.setAttribute('d', dataToPathSmooth(averageData));

    // Animace čáry při scrollu (Aurora style)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      var pathLen = pathLine.getTotalLength ? pathLine.getTotalLength() : 0;
      if (pathLen) {
        pathLine.style.strokeDasharray = pathLen;
        pathLine.style.strokeDashoffset = pathLen;
        gsap.to(pathLine, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: wealthSvg, start: 'top 85%', toggleActions: 'play none none reverse' }
        });
      }
    }

    // Tooltip při hoveru (interaktivita)
    var tooltip = document.getElementById('wealthChartTooltip');
    var wrap = wealthSvg.closest('.wealth-chart-svg-wrap');
    if (wrap && tooltip) {
      wrap.addEventListener('mousemove', function(e) {
        var rect = wealthSvg.getBoundingClientRect();
        var wrapRect = wrap.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * w;
        var i = Math.round((x / w) * (strategyData.length - 1));
        i = Math.max(0, Math.min(i, strategyData.length - 1));
        tooltip.textContent = labels[i];
        tooltip.classList.add('visible');
        tooltip.style.left = (e.clientX - wrapRect.left) + 'px';
        tooltip.style.top = (e.clientY - wrapRect.top) + 'px';
      });
      wrap.addEventListener('mouseleave', function() { tooltip.classList.remove('visible'); });
    }
  }

  // Quick-calc widget – plovoucí kalkulačky vpravo dole
  var qcWidget = document.querySelector('.qc-widget');
  if (qcWidget) {
    var qcButton = qcWidget.querySelector('.qc-button');
    var qcPanel = document.getElementById('qc-panel');

    function toggleQc(open) {
      var willOpen = typeof open === 'boolean' ? open : !qcWidget.classList.contains('open');
      qcWidget.classList.toggle('open', willOpen);
      if (qcButton) qcButton.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    }

    if (qcButton) {
      qcButton.addEventListener('click', function () { toggleQc(); });
    }

    document.addEventListener('click', function (e) {
      if (!qcWidget.classList.contains('open')) return;
      if (!qcWidget.contains(e.target)) toggleQc(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') toggleQc(false);
    });
  }

  // Chart card – 3D tilt + mouse-follow glow
  var chartCard = document.querySelector('.chart-card-tilt');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (chartCard && !reducedMotion) {
    chartCard.style.setProperty('--angle', '135deg');
    chartCard.addEventListener('mousemove', function (e) {
      var rect = chartCard.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      chartCard.style.setProperty('--x', x + 'px');
      chartCard.style.setProperty('--y', y + 'px');
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * 8;
      var rotateY = ((x - centerX) / centerX) * -8;
      chartCard.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      chartCard.style.setProperty('--angle', (135 + rotateX - rotateY) + 'deg');
    });
    chartCard.addEventListener('mouseleave', function () {
      chartCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
      chartCard.style.setProperty('--angle', '135deg');
    });
  }

}
document.addEventListener('DOMContentLoaded', function() {
  // Proč já – na mobilu (bez myši) zapnout automatickou animaci doc-stacku
  var docStack = document.getElementById('doc-stack-container');
  if (docStack && window.matchMedia && window.matchMedia('(hover: none)').matches) {
    docStack.classList.add('doc-stack-mobile-animate');
  }

  var loader = document.getElementById('loader');
  var runAfterLoader = function() {
    document.body.classList.add('page-loaded');
    init();
  };

  if (loader && typeof gsap !== 'undefined') {
    var progress = loader.querySelector('.loader-progress');
    var loaderText = loader.querySelector('.loader-text');
    gsap.to(progress, {
      width: '100%',
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: function() {
        var tl = gsap.timeline();
        tl.to(loaderText, { y: '0%', duration: 0.3, ease: 'power3.out' })
          .to(loaderText, { y: '-100%', duration: 0.3, delay: 0.2, ease: 'power3.in' })
          .to(loader, {
            yPercent: -100,
            duration: 0.5,
            ease: 'power4.inOut',
            onComplete: function() {
              runAfterLoader();
            }
          });
      }
    });
  } else {
    runAfterLoader();
  }

  // Page wipe – po animaci skrýt overlay
  var wipe = document.getElementById('page-wipe');
  if (wipe) {
    wipe.addEventListener('animationend', function(e) {
      if (e.animationName !== 'pageWipeUp') return;
      wipe.style.display = 'none';
    }, { once: false });
  }
});
