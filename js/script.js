/* Carrossel nativo: Web Animations API, máscaras, parallax, teclado e toque. */
(() => {
  'use strict';
  const config = window.CASA_CONFIG;
  const root = document.querySelector('.experience');
  if (!root || !config || !Array.isArray(config.slides) || !config.slides.length) return;

  const layouts = new Set(['hero', 'space', 'rest', 'play', 'kitchen', 'coast']);
  const seenIds = new Set();
  const slides = config.slides.filter(slide => {
    if (!slide || !slide.id || seenIds.has(slide.id)) return false;
    seenIds.add(slide.id);
    return true;
  });
  if (!slides.length) return;

  const host = document.getElementById('scene-host');
  const selectors = document.getElementById('slide-selectors');
  const pauseButton = document.getElementById('pause-button');
  const pauseIcon = document.getElementById('pause-icon');
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('site-nav');
  const ambient = document.getElementById('ambient-image');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const lifecycle = new AbortController();
  const settings = config.carousel || {};
  const interval = Math.max(5000, Number(settings.interval) || 9000);
  const fallbackImage = settings.fallbackImage || 'assets/images/fachada.png';
  const state = {
    index: 0, active: null, busy: false, queued: null, serial: 0,
    elapsed: 0, clock: 0, lastTick: 0,
    userPaused: !settings.autoplay || motionQuery.matches,
    reasons: new Set(), animations: new Set(), destroyed: false,
    pointerStart: null, depthFrame: 0, x: 0, y: 0, targetX: 0, targetY: 0
  };
  const listen = (target, event, fn, options = {}) => target.addEventListener(event, fn, {...options, signal: lifecycle.signal});
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const pad = value => String(value).padStart(2, '0');
  const wrap = value => ((value % slides.length) + slides.length) % slides.length;
  const booking = config.booking || {};
  const phone = String(booking.whatsappNumber || '').replace(/\D/g, '');
  const useWhatsapp = phone.length >= 12 && phone.length <= 15 && phone.startsWith('55');
  let airbnbUrl = 'https://www.airbnb.com.br/rooms/715400608616263860';
  try {
    const candidate = new URL(booking.airbnbUrl);
    if (candidate.protocol === 'https:' || candidate.protocol === 'http:') airbnbUrl = candidate.href;
  } catch (_) { /* Uma configuração inválida mantém o link real do anúncio. */ }
  const ctaUrl = useWhatsapp ? `https://wa.me/${phone}?text=${encodeURIComponent(booking.whatsappMessage || 'Olá! Gostaria de consultar as datas da casa em Peruíbe.')}` : airbnbUrl;
  const ctaLabel = useWhatsapp ? 'CONSULTAR NO WHATSAPP' : 'CONSULTAR DATAS';
  const startingPrice = Number(config.pricing && config.pricing.fromPerPerson);
  const priceText = Number.isFinite(startingPrice) && startingPrice > 0 ? new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:Number.isInteger(startingPrice)?0:2}).format(startingPrice) : '';
  const priceMarkup = priceText ? `<p class="price-offer animate-in"><small>DIÁRIAS A PARTIR DE</small><strong>${esc(priceText)}</strong><span>POR PESSOA</span></p>` : '';

  // Recorte vetorial da foto original: a casa e os postes ficam à frente do nome.
  // O arquivo de imagem não é alterado. Background e recorte usam a mesma escala.
  const housePath = 'M0 525L148 526L166 602L183 626L211 559L228 530L457 532L580 542L608 535L773 537L817 539L960 550V1280H0Z';
  const polesPath = 'M812 386L823 383L834 667L817 667ZM932 384L943 381L960 732L947 733Z';

  function renderScene(index) {
    const slide = slides[index];
    const scene = document.createElement('article');
    const layout = layouts.has(slide.layout) ? slide.layout : 'space';
    scene.className = `scene layout-${layout}`;
    scene.dataset.id = slide.id;
    scene.setAttribute('aria-label', `${index + 1} de ${slides.length}: ${slide.label || slide.id}. ${slide.alt || ''}`);
    scene.style.setProperty('--image-position', slide.position || '50% 50%');
    scene.style.setProperty('--mobile-image-position', slide.mobilePosition || slide.position || '50% 50%');
    const image = slide.image || fallbackImage;
    const clipId = `house-clip-${++state.serial}`;
    const foreground = slide.foreground ? `<svg class="foreground image-layer" viewBox="0 0 960 1280" preserveAspectRatio="xMidYMid slice" focusable="false"><defs><clipPath id="${clipId}"><path d="${housePath}"/><path d="${polesPath}"/></clipPath></defs><image href="${esc(image)}" width="960" height="1280" clip-path="url(#${clipId})"/></svg>` : '';
    const stats = (slide.stats || []).slice(0, 3).map(stat => `<div class="animate-in"><strong>${esc(stat.value)}${stat.unit ? `<span>${esc(stat.unit)}</span>` : ''}</strong><small>${esc(stat.label)}</small></div>`).join('');
    const heading = (Array.isArray(slide.heading) ? slide.heading : [slide.heading || slide.label]).map(line => `<span class="animate-in">${esc(line)}</span>`).join('');
    const facts = Array.isArray(slide.facts) && slide.facts.length ? `<ul class="detail-facts">${slide.facts.map(fact => `<li>${esc(fact)}</li>`).join('')}</ul>` : '';
    scene.innerHTML = `
      <div class="visual-plane" aria-hidden="true">
        <div class="image-layer"><img class="scene-image" src="${esc(image)}" alt="" decoding="async" ${index === 0 ? 'fetchpriority="high"' : ''}></div>
        <div class="color-wash"></div><span class="scene-word">${esc(slide.word || '')}</span>
        ${foreground}<div class="readability-shade"></div>
      </div>
      <div class="scene-stats">${stats}</div>
      <div class="scene-copy"><p class="eyebrow animate-in">${esc(slide.eyebrow)}</p>
        <h2 class="scene-heading">${heading}</h2>
        <p class="mobile-description animate-in">${esc(slide.description)}</p>
        <div class="booking-group"><a class="booking-button ${useWhatsapp ? 'is-whatsapp' : ''} animate-in" href="${esc(ctaUrl)}" target="_blank" rel="noopener noreferrer"><span>${ctaLabel}</span><span class="button-arrow" aria-hidden="true">↗</span></a>${priceMarkup}</div>
      </div>
      <aside class="scene-detail animate-in"><p class="detail-kicker">${esc(slide.detailTitle)}</p><p>${esc(slide.detailText)}</p>${facts}<span class="detail-caption">${esc(slide.detailCaption)}</span></aside>`;
    const sceneImage = scene.querySelector('.scene-image');
    listen(sceneImage, 'error', () => {
      if (sceneImage.dataset.fallback) return;
      sceneImage.dataset.fallback = 'true';
      sceneImage.src = fallbackImage;
      const foregroundImage = scene.querySelector('.foreground image');
      if (foregroundImage) foregroundImage.setAttribute('href', fallbackImage);
    });
    syncForeground(scene, slide);
    return scene;
  }

  function syncForeground(scene, slide) {
    const foreground = scene.querySelector('.foreground');
    if (!foreground) return;
    const rect = root.getBoundingClientRect();
    const width = root.clientWidth || rect.width;
    const height = root.clientHeight || rect.height;
    const position = window.innerWidth <= 700 ? slide.mobilePosition || slide.position : slide.position;
    const coordinates = String(position || '50% 50%').trim().split(/\s+/);
    const percent = coordinates.length > 1 && coordinates[1].endsWith('%') ? parseFloat(coordinates[1])/100 : .5;
    const fullHeight = Math.max(width/960,height/1280)*1280;
    const shift = (fullHeight-height)*(.5-percent);
    foreground.style.setProperty('--foreground-shift', `${shift}px`);
  }

  function updateProgress() {
    const active = selectors.children[state.index];
    if (active) active.style.setProperty('--progress', state.userPaused ? '1' : String(Math.max(.025, Math.min(state.elapsed / interval, 1))));
  }

  function updateControls(announce = false) {
    const slide = slides[state.index];
    document.getElementById('slide-number').textContent = pad(state.index + 1);
    document.getElementById('slide-name').textContent = slide.label || slide.id;
    document.getElementById('counter-current').textContent = pad(state.index + 1);
    document.getElementById('counter-total').textContent = pad(slides.length);
    Array.from(selectors.children).forEach((button, index) => {
      button.setAttribute('aria-current', index === state.index ? 'true' : 'false');
      if (index !== state.index) button.style.setProperty('--progress', '0');
    });
    menu.querySelectorAll('[data-go]').forEach(button => button.setAttribute('aria-current', button.dataset.go === slide.id ? 'true' : 'false'));
    pauseButton.setAttribute('aria-pressed', String(state.userPaused));
    pauseButton.setAttribute('aria-label', state.userPaused ? 'Ativar troca automática' : 'Pausar troca automática');
    pauseIcon.setAttribute('d', state.userPaused ? 'M6 3l10 7-10 7V3Z' : 'M6 4v12M14 4v12');
    updateProgress();
    if (announce) document.getElementById('carousel-announcement').textContent = `Imagem ${state.index + 1} de ${slides.length}: ${slide.label || slide.id}.`;
  }

  function canPlay() { return !state.destroyed && slides.length > 1 && !state.userPaused && !state.reasons.size && !state.busy; }
  function stopClock() {
    if (state.clock) cancelAnimationFrame(state.clock);
    state.clock = 0;
    state.lastTick = 0;
  }
  function tick(now) {
    state.clock = 0;
    if (!canPlay()) { state.lastTick = 0; return; }
    if (state.lastTick) state.elapsed += Math.max(0, now - state.lastTick);
    state.lastTick = now;
    updateProgress();
    if (state.elapsed >= interval) { goTo(state.index + 1, false, 1); return; }
    state.clock = requestAnimationFrame(tick);
  }
  function refreshClock() {
    if (canPlay() && !state.clock) { state.lastTick = 0; state.clock = requestAnimationFrame(tick); }
    else if (!canPlay()) stopClock();
  }
  function pauseFor(reason, paused) {
    if (paused) state.reasons.add(reason);
    else state.reasons.delete(reason);
    refreshClock();
  }

  function animate(element, frames, options) {
    const animation = element.animate(frames, options);
    state.animations.add(animation);
    return animation;
  }

  async function goTo(requestedIndex, manual = true, direction = 1) {
    if (state.destroyed) return;
    const index = wrap(requestedIndex);
    if (index === state.index) { state.queued = null; return; }
    if (state.busy) { state.queued = {index, manual, direction}; return; }
    const oldScene = state.active;
    const newScene = renderScene(index);
    state.busy = true;
    stopClock();
    state.elapsed = 0;
    state.index = index;
    state.active = newScene;
    oldScene.classList.remove('is-current');
    oldScene.inert = true;
    oldScene.setAttribute('aria-hidden', 'true');
    newScene.classList.add('is-current');
    host.appendChild(newScene);
    updateControls(manual);
    const duration = motionQuery.matches ? 0 : Math.max(400, Math.min(2200, Number(settings.transition) || 1100));
    const animations = [];
    if (duration && typeof newScene.animate === 'function') {
      animations.push(animate(newScene, [{clipPath: direction > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}], {duration, easing:'cubic-bezier(.76,0,.24,1)', fill:'both'}));
      const visual = newScene.querySelector('.visual-plane');
      animations.push(animate(visual,[{transform:`translateX(${direction * 5}%) scale(1.055)`},{transform:'translateX(0) scale(1)'}],{duration:duration+150,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));
      animations.push(animate(oldScene.querySelector('.visual-plane'),[{transform:'translateX(0) scale(1)'},{transform:`translateX(${direction * -3}%) scale(1.02)`}],{duration,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));
      const elements = newScene.querySelectorAll('.animate-in');
      elements.forEach((element, order) => {
        animations.push(animate(element,[{opacity:0,transform:'translateY(23px)'},{opacity:1,transform:'translateY(0)'}],{duration:Math.round(duration*.64),delay:Math.round(duration*.32)+order*34,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));
      });
      await Promise.allSettled(animations.map(animation => animation.finished));
    }
    animations.forEach(animation => { animation.cancel(); state.animations.delete(animation); });
    oldScene.remove();
    if (state.destroyed) return;
    ambient.src = newScene.querySelector('.scene-image').src;
    state.busy = false;
    if (state.queued) {
      const queued = state.queued;
      state.queued = null;
      goTo(queued.index, queued.manual, queued.direction);
    } else refreshClock();
  }

  function setAutoplay(enabled) {
    state.userPaused = !enabled;
    if (enabled) state.elapsed = 0;
    updateControls();
    refreshClock();
  }
  function setMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu de ambientes' : 'Abrir menu de ambientes');
    menu.classList.toggle('is-open', open);
    pauseFor('menu', open);
  }

  function depthTick() {
    state.depthFrame = 0;
    if (state.destroyed) return;
    state.x += (state.targetX - state.x) * .095;
    state.y += (state.targetY - state.y) * .095;
    root.style.setProperty('--depth-x', `${state.x.toFixed(2)}px`);
    root.style.setProperty('--depth-y', `${state.y.toFixed(2)}px`);
    if (Math.abs(state.targetX-state.x)+Math.abs(state.targetY-state.y) > .05) state.depthFrame = requestAnimationFrame(depthTick);
  }
  function startDepth() {
    if (!state.depthFrame) state.depthFrame = requestAnimationFrame(depthTick);
  }
  function resetDepth() { state.targetX = 0; state.targetY = 0; startDepth(); }

  state.active = renderScene(0);
  state.active.classList.add('is-current');
  host.replaceChildren(state.active);
  slides.forEach((slide, index) => {
    const button = document.createElement('button');
    button.className = 'slide-selector';
    button.type = 'button';
    button.setAttribute('aria-label', `Mostrar imagem ${index + 1}: ${slide.label || slide.id}`);
    listen(button, 'click', () => { setMenu(false); goTo(index, true, index >= state.index ? 1 : -1); });
    selectors.appendChild(button);
  });
  document.querySelectorAll('.booking-link').forEach(link => {
    link.href = link.classList.contains('header-booking') ? airbnbUrl : ctaUrl;
  });
  document.getElementById('carousel-controls').hidden = slides.length < 2;
  listen(document.getElementById('next-slide'), 'click', () => goTo(state.index + 1, true, 1));
  listen(document.getElementById('previous-slide'), 'click', () => goTo(state.index - 1, true, -1));
  listen(pauseButton, 'click', () => setAutoplay(state.userPaused));
  listen(menuToggle, 'click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  root.querySelectorAll('[data-go]').forEach(button => {
    const index = slides.findIndex(slide => slide.id === button.dataset.go);
    if (index < 0) { button.hidden = true; return; }
    listen(button, 'click', event => {
      event.preventDefault();
      setMenu(false);
      goTo(index, true, index >= state.index ? 1 : -1);
    });
  });
  listen(root, 'keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(state.index+1,true,1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(state.index-1,true,-1); }
    else if (event.key === 'Home') { event.preventDefault(); goTo(0,true,-1); }
    else if (event.key === 'End') { event.preventDefault(); goTo(slides.length-1,true,1); }
    else if (event.key === 'Escape') { setMenu(false); menuToggle.focus(); }
    else if (event.key === ' ' && event.target === root) { event.preventDefault(); setAutoplay(state.userPaused); }
  });
  listen(root, 'focusin', () => pauseFor('focus', true));
  listen(root, 'focusout', event => {
    if (!event.relatedTarget || !root.contains(event.relatedTarget)) pauseFor('focus', false);
  });
  listen(root, 'pointerenter', event => { if (event.pointerType === 'mouse') pauseFor('hover', true); });
  listen(root, 'pointerleave', event => { if (event.pointerType === 'mouse') pauseFor('hover', false); resetDepth(); });
  listen(root, 'pointermove', event => {
    if (!settings.parallax || motionQuery.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
    const rect = root.getBoundingClientRect();
    state.targetX = ((event.clientX-rect.left)/rect.width-.5)*10;
    state.targetY = ((event.clientY-rect.top)/rect.height-.5)*6;
    startDepth();
  }, {passive:true});
  listen(host, 'pointerdown', event => {
    if (event.pointerType === 'mouse' || event.target.closest('a,button')) return;
    state.pointerStart = {x:event.clientX,y:event.clientY};
    pauseFor('touch',true);
  }, {passive:true});
  listen(window, 'pointerup', event => {
    if (!state.pointerStart) return;
    const dx = event.clientX-state.pointerStart.x;
    const dy = event.clientY-state.pointerStart.y;
    state.pointerStart = null;
    pauseFor('touch',false);
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)*1.25) goTo(state.index+(dx<0?1:-1),true,dx<0?1:-1);
  }, {passive:true});
  listen(window, 'pointercancel', () => { state.pointerStart=null; pauseFor('touch',false); }, {passive:true});
  listen(document, 'visibilitychange', () => {
    pauseFor('hidden',document.hidden);
    if (document.hidden) { state.pointerStart=null; state.reasons.delete('touch'); resetDepth(); }
  });
  listen(window, 'blur', () => { state.pointerStart=null; pauseFor('touch',false); pauseFor('window',true); resetDepth(); });
  listen(window, 'focus', () => pauseFor('window',false));
  listen(document, 'pointerdown', event => {
    if (menuToggle.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) setMenu(false);
  }, {passive:true});
  listen(motionQuery, 'change', () => { if (motionQuery.matches) { setAutoplay(false); resetDepth(); } });
  listen(ambient, 'error', () => { if (!ambient.dataset.fallback) { ambient.dataset.fallback='true'; ambient.src=fallbackImage; } });
  const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(() => {
    host.querySelectorAll('.scene').forEach(scene => {
      const slide = slides.find(item => item.id === scene.dataset.id);
      if (slide) syncForeground(scene,slide);
    });
    if (window.innerWidth > 700) setMenu(false);
  }) : null;
  if (resizeObserver) resizeObserver.observe(root);
  else listen(window,'resize',() => syncForeground(state.active,slides[state.index]));
  if (document.hidden) state.reasons.add('hidden');
  updateControls();
  refreshClock();

  // Pré-carrega as próximas fotos; todos os arquivos já estão no ZIP.
  slides.slice(1).forEach(slide => { if (slide.image) { const preload = new Image(); preload.decoding='async'; preload.src=slide.image; } });

  window.CasaPeruibe = Object.freeze({
    next: () => goTo(state.index+1,true,1),
    previous: () => goTo(state.index-1,true,-1),
    goTo: target => {
      const index = typeof target === 'number' ? target : slides.findIndex(slide => slide.id===target);
      if (Number.isInteger(index) && index >= 0 && index < slides.length) return goTo(index,true,index>=state.index?1:-1);
    },
    setAutoplay,
    get currentSlide() { return slides[state.index].id; },
    get slideCount() { return slides.length; },
    destroy: () => {
      state.destroyed=true;
      if (resizeObserver) resizeObserver.disconnect();
      lifecycle.abort();
      stopClock();
      cancelAnimationFrame(state.depthFrame);
      state.animations.forEach(animation=>animation.cancel());
      state.animations.clear();
    }
  });
})();
