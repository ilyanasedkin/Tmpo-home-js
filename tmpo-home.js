<!-- ===== CONTENT VISIBILITY: DEFER BELOW-FOLD SECTIONS ===== -->
<script>
document.addEventListener('DOMContentLoaded', () => {
  const deferredSections = [
    '.home-benefits',
    '.home-faq',
    '.home-team',
    '.home-whatwedo',
    'footer'
  ];
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.contentVisibility = 'visible';
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '300px' });
  deferredSections.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
      el.style.contentVisibility = 'auto';
      el.style.containIntrinsicSize = '0 800px';
      io.observe(el);
    }
  });
});
</script>

<!-- ===== STYLES ===== -->
<style>
  html, body { overflow-x: hidden; }
  body {
    background-color: #ffffff;
    transition: background-color 0.6s ease;
  }
  body.theme-dark { background-color: #0D0E10; }
  .heading-style-h2 { transition: color 0.4s ease; }
  body.theme-dark .heading-style-h2 { color: #ffffff; }
  .navbar_component .navbar_link {
    color: rgb(10, 29, 36);
    transition: color .25s ease;
  }
  .navbar_component .navbar_link:hover { color: rgb(10, 29, 36); }
  .navbar_component.navbar--on-dark .navbar_link { color: #fff; }
  .navbar_component.navbar--on-dark .navbar_link:hover { color: #0D0E10; }
  .navbar_component .navbar_link svg {
    fill: currentColor;
    stroke: currentColor;
    transition: fill .25s ease, stroke .25s ease;
  }
  .wf-hidden-soft {
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    position: static !important;
    transform: none !important;
    max-height: 0 !important;
    overflow: clip !important;
  }
  [data-animate="stagger-delayed"] { visibility: hidden; }
  [data-animate="fade-up"] { opacity: 0; transform: translate3d(0,30px,0); }
  .benefit_wrapper {
    perspective: 1100px;
    transform-style: preserve-3d;
    overflow: visible;
  }
  .benefit_track, .benefits_list { transform-style: preserve-3d; }
  .benefits_card {
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform, opacity;
  }
  .home-benefits { position: relative; z-index: 10; }
  .home-faq, .home-after-benefits { position: relative; z-index: 1; }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>

<!-- ===== PRELOADER ===== -->
<script>
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const preloader = document.querySelector('.pre-loader-wrapper');
    if (!preloader) return;
    preloader.style.transition = 'transform 0.8s cubic-bezier(0.45, 0, 0.55, 1), opacity 0.8s ease';
    preloader.style.transform = 'translateY(-100%)';
    preloader.style.opacity = '0';
    setTimeout(() => { preloader.style.display = 'none'; }, 800);
  }, 2500);
});
</script>

<!-- ===== NAVBAR ===== -->
<script>
document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.navbar_component');
  const darkSections = document.querySelectorAll('.dark-section');
  if (!navbar || !darkSections.length) return;
  function updateNavbarTheme() {
    const navHeight = navbar.offsetHeight;
    const probePosition = window.scrollY + navHeight + 2;
    let isDark = false;
    darkSections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (probePosition >= top && probePosition <= bottom) isDark = true;
    });
    navbar.classList.toggle('navbar--on-dark', isDark);
  }
  window.addEventListener('scroll', updateNavbarTheme, { passive: true });
  window.addEventListener('resize', updateNavbarTheme);
  updateNavbarTheme();
});
</script>

<!-- ===== ROLE SWITCHER ===== -->
<script>
(function () {
  let roleInited = false;
  function initRoleSwitcher() {
    if (roleInited) return;
    roleInited = true;
    const applicantsBtn = document.getElementById('btn-applicants');
    const employerBtn   = document.getElementById('btn-employer');
    const applicantSec  = document.querySelector('.home-benefits[data-role="applicant"]');
    const employerSec   = document.querySelector('.home-benefits[data-role="employer"]');
    const cta = document.getElementById('cta');
    const hide = (el) => { if (el) el.style.display = 'none'; };
    const show = (el) => { if (el) el.style.display = ''; };
    const gatedBlocks = [];
    if (cta) {
      let el = cta.nextElementSibling;
      while (el) { gatedBlocks.push(el); el = el.nextElementSibling; }
    }
    const roleBlocks = Array.from(document.querySelectorAll('[data-role]'));

    function scrollToCards() {
      const cards = document.getElementById('cards');
      if (!cards) return;
      const navbar = document.querySelector('.navbar_component');
      const navH = navbar ? navbar.offsetHeight : 0;
      const top = cards.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    function setRole(role) {
      gatedBlocks.forEach(show);
      roleBlocks.forEach((el) => {
        el.getAttribute('data-role') === role ? show(el) : hide(el);
      });
      if (applicantSec && employerSec) {
        if (role === 'applicant') { show(applicantSec); hide(employerSec); }
        else { show(employerSec); hide(applicantSec); }
      }
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (window.ScrollTrigger) {
          const y = window.scrollY;
          ScrollTrigger.refresh(true);
          window.scrollTo(0, y);
        }
        document.querySelectorAll('[data-animate="stagger"]').forEach(el => {
          if (window.animateStagger) window.animateStagger(el);
        });
        document.querySelectorAll('[data-animate="fade-up"]').forEach(el => {
          if (window.animateFadeUp) window.animateFadeUp(el);
        });
        // Applicant: already inited, scroll directly next frame.
        // Employer: init benefits (if available), then scroll after layout settles.
        // Scroll is decoupled from initBenefitsSection callback — employer section
        // may not be inited yet, so we give the DOM 120ms to show/reflow before scrolling.
        if (role === 'applicant') {
          requestAnimationFrame(scrollToCards);
        } else {
          if (window.initBenefitsSection) window.initBenefitsSection(role);
          setTimeout(scrollToCards, 120);
        }
      }));
      if (window.initApplicantsCircle) window.initApplicantsCircle();
    }

    gatedBlocks.forEach(hide);
    roleBlocks.forEach(hide);
    const onApplicants = (e) => { e.preventDefault(); setRole('applicant'); };
    const onEmployer   = (e) => { e.preventDefault(); setRole('employer'); };
    if (applicantsBtn) applicantsBtn.addEventListener('click', onApplicants);
    if (employerBtn)   employerBtn.addEventListener('click', onEmployer);
    if (window.addCleanup) window.addCleanup(() => {
      if (applicantsBtn) applicantsBtn.removeEventListener('click', onApplicants);
      if (employerBtn)   employerBtn.removeEventListener('click', onEmployer);
      roleInited = false;
    });
  }
  document.addEventListener('DOMContentLoaded', initRoleSwitcher);
  window.Webflow = window.Webflow || [];
  window.Webflow.push(initRoleSwitcher);
})();
</script>

<!-- ===== DEFERRED SECTIONS (IntersectionObserver sequential load) ===== -->
<script>
window.addEventListener('DOMContentLoaded', () => {

  // Boot order:
  // - Immediate: dark mode + GSAP (needed above the fold)
  // - Deferred:  everything else loads as user scrolls near it
  // - Role-gated sections (data-role) are controlled by the role switcher above —
  //   we only wire animations here, not show/hide logic.

  const sections = [
    // Immediate — above fold
    { fn: initDarkMode,         immediate: true },
    { fn: initGSAP,             immediate: true },

    // Deferred — below fold
    { selector: '.home-applicants_wrapper', fn: initApplicantsCircle, rootMargin: '300px 0px' },
    { selector: '.tornado_stage',           fn: initTornado,          rootMargin: '300px 0px' },
    { selector: '.home-benefits',           fn: initBenefitsBoot,     rootMargin: '400px 0px' },
    { selector: '.home-faq',                fn: initFAQ,              rootMargin: '300px 0px' },
    { selector: '.home-team',               fn: initTeam,             rootMargin: '300px 0px' },
    { selector: 'footer',                   fn: initFooter,           rootMargin: '200px 0px' },
  ];

  sections.forEach(({ selector, fn, immediate, rootMargin }) => {
    if (immediate) { fn(); return; }
    const el = document.querySelector(selector);
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      fn();
    }, { rootMargin: rootMargin || '300px 0px' });
    obs.observe(el);
  });

});

// ─── DARK MODE ────────────────────────────────────────────────────────
function initDarkMode() {
  const darkSections = document.querySelectorAll('.dark-section');
  const stopMarker   = document.getElementById('section-faq');
  if (!darkSections.length) return;
  function updateTheme() {
    const viewportCenter = window.scrollY + window.innerHeight * 0.5;
    if (stopMarker && viewportCenter >= stopMarker.offsetTop) {
      document.body.classList.remove('theme-dark'); return;
    }
    let isDark = false;
    for (const sec of darkSections) {
      const top = sec.offsetTop, bottom = top + sec.offsetHeight;
      if (viewportCenter >= top && viewportCenter <= bottom) { isDark = true; break; }
    }
    document.body.classList.toggle('theme-dark', isDark);
  }
  window.addEventListener('scroll', updateTheme, { passive: true });
  window.addEventListener('resize', updateTheme);
  updateTheme();
}

// ─── GSAP + ANIMATIONS ────────────────────────────────────────────────
function initGSAP() {
  (function loadGSAP(cb) {
    if (window.gsap && window.ScrollTrigger) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js';
    s.onload = function () {
      const s2 = document.createElement('script');
      s2.src = 'https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/ScrollTrigger.min.js';
      s2.onload = function () { gsap.registerPlugin(ScrollTrigger); cb(); };
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  })(function () {
    window.Webflow = window.Webflow || [];
    window.Webflow.push(function () {
      window.SplitText
        ? gsap.registerPlugin(ScrollTrigger, SplitText)
        : gsap.registerPlugin(ScrollTrigger);

      const isHidden   = el => !!(el.closest('[style*="display: none"]') || el.closest('[style*="display:none"]'));
      const inViewport = el => { let t = 0, n = el; while (n) { t += n.offsetTop || 0; n = n.offsetParent; } return t < (window.scrollY + window.innerHeight); };
      const scheduleRefresh = (() => {
        let s = false;
        return () => { if (s) return; s = true; requestAnimationFrame(() => requestAnimationFrame(() => { ScrollTrigger.refresh(); s = false; })); };
      })();

      function animateStagger(el) {
        if (el.dataset.split === 'true' || isHidden(el) || !window.SplitText) return;
        el.dataset.split = 'true';
        const split   = SplitText.create(el, { type: 'words,chars', tag: 'div', autoSplit: true, ignore: 'span' });
        const targets = split.chars.concat(Array.from(el.querySelectorAll('span')));
        const run     = () => gsap.from(targets, { y: 60, autoAlpha: 0, duration: 1, stagger: 0.02, ease: 'power3.out', overwrite: true });
        gsap.set(el, { visibility: 'visible' });
        inViewport(el)
          ? run()
          : ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: run, invalidateOnRefresh: true });
      }

      function animateFadeUp(el) {
        if (el.dataset.fadeup === 'true' || isHidden(el)) return;
        el.dataset.fadeup = 'true';
        if (inViewport(el)) { el.classList.add('is-inview'); return; }
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-inview'); io.unobserve(e.target); } });
        }, { threshold: 0.1 });
        io.observe(el);
      }

      // Above-fold stagger (fires immediately with delay)
      document.querySelectorAll('[data-animate="stagger-delayed"]').forEach(el => {
        if (!window.SplitText || el.dataset.split === 'true' || isHidden(el)) return;
        el.dataset.split = 'true';
        const split   = SplitText.create(el, { type: 'words,chars', tag: 'div', autoSplit: true, ignore: 'span' });
        const targets = split.chars.concat(Array.from(el.querySelectorAll('span')));
        gsap.set(el, { visibility: 'visible' });
        gsap.from(targets, { delay: 0.8, y: 60, autoAlpha: 0, duration: 0.6, stagger: 0.02, ease: 'power3.out', overwrite: true });
      });

      document.querySelectorAll('[data-animate="stagger"]').forEach(el => animateStagger(el));
      document.querySelectorAll('[data-animate="fade-up"]').forEach(el => animateFadeUp(el));

      // Expose for role switcher re-init
      window.animateStagger = animateStagger;
      window.animateFadeUp  = animateFadeUp;

      scheduleRefresh();
      if (document.fonts?.ready) document.fonts.ready.then(scheduleRefresh);
    });
  });
}

// ─── APPLICANTS CIRCLE ────────────────────────────────────────────────
function initApplicantsCircle() {
  // Expose globally — role switcher calls this on role change
  window.initApplicantsCircle = function () {
    var wrapper = document.querySelector('.home-applicants_wrapper');
    if (!wrapper) return;
    var items = Array.prototype.slice.call(wrapper.querySelectorAll('.home-applicants_item'));
    if (!items.length) return;
    var ROTATE_PER_PX=0.0015,DURATION=700,STAGGER=30,VIEWPORT_TRIGGER=0.25,MOBILE_BP=768;
    var isMobile=window.matchMedia('(max-width:'+MOBILE_BP+'px)').matches;
    var MOBILE_ITEM_SCALE=0.78,MOBILE_HEIGHT_K=1.35,RADIUS_FACTOR_DESK=0.95,RADIUS_FACTOR_MOB=1.08;
    function easeReveal(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
    if(!wrapper.style.position) wrapper.style.position='relative';
    wrapper.style.overflow='hidden';
    for(var i=0;i<items.length;i++){
      var it=items[i];
      it.style.position='absolute';it.style.top='50%';it.style.left='50%';
      it.style.willChange='transform';it.style.transformOrigin='50% 50%';
      it.style.backfaceVisibility='hidden';it.style.webkitBackfaceVisibility='hidden';
      if(!it.style.transform) it.style.transform='translate(-50%,-50%)';
    }
    function getMaxItemDiagonal(){var max=0;for(var i=0;i<items.length;i++){var w=items[i].offsetWidth||0,h=items[i].offsetHeight||0,d=Math.sqrt(w*w+h*h);if(d>max)max=d;}return max;}
    function ensureWrapperSize(maxDiag){var w=wrapper.offsetWidth||0,need=Math.max(w,maxDiag+40);if(isMobile)need=Math.max(need,Math.round(w*MOBILE_HEIGHT_K),Math.round(maxDiag*2.2));if(wrapper.offsetHeight<need)wrapper.style.minHeight=need+'px';}
    function getRadius(){var maxDiag=getMaxItemDiagonal();ensureWrapperSize(maxDiag);var rect=wrapper.getBoundingClientRect(),ww=rect.width||wrapper.offsetWidth||1,hh=rect.height||wrapper.offsetHeight||ww,halfMin=Math.min(ww,hh)/2,safe=halfMin-maxDiag/2-2,factor=isMobile?RADIUS_FACTOR_MOB:RADIUS_FACTOR_DESK,r=safe*factor;if(isMobile)r=Math.max(r,maxDiag*0.65);return Math.max(20,r);}
    function buildTargets(radius){var n=items.length,startAngle=-Math.PI/2,targets=[];for(var i=0;i<n;i++)targets.push({angle:startAngle+(i*2*Math.PI)/n});return{startAngle:startAngle,targets:targets,radius:radius};}
    var baseRotation=0;
    function updateRotationFromScroll(){baseRotation=(window.scrollY||window.pageYOffset||0)*ROTATE_PER_PX;}
    var radius=0,targetsData=null,hasAnimated=false;
    function setPos(item,x,y,rot,progress){var s=(0.97+0.03*progress)*(isMobile?MOBILE_ITEM_SCALE:1);item.style.transform='translate(-50%,-50%) translate3d('+x+'px,'+y+'px,0) rotate('+rot+'rad) scale('+s+')';}
    function layout(progress){if(!targetsData)return;var startAngle=targetsData.startAngle,targets=targetsData.targets,stackAngle=startAngle+baseRotation,sx=Math.cos(stackAngle)*radius,sy=Math.sin(stackAngle)*radius;for(var i=0;i<items.length;i++){var angle=startAngle+(targets[i].angle-startAngle)*progress+baseRotation,x=progress===0?sx:Math.cos(angle)*radius,y=progress===0?sy:Math.sin(angle)*radius;setPos(items[i],x,y,angle+Math.PI/2,progress);}}
    function recalcAndRelayout(forceProgress){isMobile=window.matchMedia('(max-width:'+MOBILE_BP+'px)').matches;radius=getRadius();targetsData=buildTargets(radius);updateRotationFromScroll();layout(typeof forceProgress==='number'?forceProgress:(hasAnimated?1:0));}
    function animateIn(){if(hasAnimated)return;hasAnimated=true;recalcAndRelayout(0);var start=performance.now();function tick(now){var elapsed=now-start,total=DURATION+(items.length-1)*STAGGER,p=Math.min(1,elapsed/total);updateRotationFromScroll();layout(easeReveal(p));if(p<1)requestAnimationFrame(tick);else window.addEventListener('scroll',onScroll,{passive:true});}requestAnimationFrame(tick);}
    var scrollRaf=null;
    function onScroll(){if(scrollRaf)return;scrollRaf=requestAnimationFrame(function(){scrollRaf=null;updateRotationFromScroll();layout(1);});}
    animateIn();
    var imgs=wrapper.querySelectorAll('img');
    function onAnyImageDone(){requestAnimationFrame(function(){recalcAndRelayout();});}
    for(var k=0;k<imgs.length;k++){if(imgs[k].complete)continue;imgs[k].addEventListener('load',onAnyImageDone,{once:true});imgs[k].addEventListener('error',onAnyImageDone,{once:true});}
    window.addEventListener('resize',function(){recalcAndRelayout();},{passive:true});
  };
  window.initApplicantsCircle();
}

// ─── TORNADO ──────────────────────────────────────────────────────────
function initTornado() {
  const stage = document.querySelector('.tornado_stage');
  const list  = document.querySelector('.tornado_list');
  const items = [...document.querySelectorAll('.tornado_item')];
  if (!stage || !list || items.length < 2) return;
  const BASE = {
    perspective:4600, speed:0.08, sidePadding:60, zDepthFactor:0.55,
    minScale:0.78, maxYOffset:120, refWidth:1200, minFactor:0.55,
    maxFactor:1, arcGap:18, maxRxBoost:1.35, minItemScale:0.42,
  };
  stage.style.perspectiveOrigin='50% 50%';
  stage.style.position=stage.style.position||'relative';
  list.style.position='relative';
  list.style.transformStyle='preserve-3d';
  items.forEach(el=>{
    el.dataset.y=((Math.random()-0.5)*BASE.maxYOffset).toFixed(2);
    el.style.position='absolute'; el.style.top='50%'; el.style.left='50%';
    el.style.transformStyle='preserve-3d'; el.style.transformOrigin='50% 50%';
    el.style.willChange='transform, opacity';
  });
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  let rx=320,rz=180,speed=BASE.speed,minScale=BASE.minScale,itemScale=1,baseItemW=320;
  function measureBaseItemWidth(){
    const el=items[0]; if(!el) return;
    const prev=el.style.transform; el.style.transform='none';
    const w=el.offsetWidth||el.getBoundingClientRect().width;
    el.style.transform=prev;
    if(w&&Number.isFinite(w)) baseItemW=w;
  }
  function computeResponsive(){
    const w=stage.clientWidth||800;
    let factor=clamp(w/BASE.refWidth,BASE.minFactor,BASE.maxFactor);
    if(w<=1024) factor=Math.min(factor,0.85);
    if(w<=768)  factor=Math.min(factor,0.72);
    if(w<=480)  factor=Math.min(factor,0.62);
    itemScale=factor;
    stage.style.perspective=`${clamp(BASE.perspective*factor,1200,BASE.perspective)}px`;
    speed=BASE.speed*(0.85+0.15*factor);
    minScale=clamp(BASE.minScale+(1-factor)*0.08,0.78,0.9);
    let maxYOS=BASE.maxYOffset*factor;
    if(w<=768) maxYOS*=0.7; if(w<=480) maxYOS*=0.75;
    items.forEach(el=>{ el.dataset.y_scaled=((Number(el.dataset.y)||0)*(maxYOS/BASE.maxYOffset)).toFixed(2); });
    const stepRad=(2*Math.PI)/items.length;
    const visibleW=()=>(baseItemW||320)*itemScale;
    const minRByChord=()=>(visibleW()+BASE.arcGap)/(2*Math.sin(stepRad/2));
    const desiredRx=Math.max(160,(w/2)-((w<=480?24:BASE.sidePadding)*factor));
    let boostedRx=Math.min(Math.max(desiredRx,minRByChord()),desiredRx*BASE.maxRxBoost);
    let guard=0;
    while(2*boostedRx*Math.sin(stepRad/2)<visibleW()+BASE.arcGap&&itemScale>BASE.minItemScale&&guard<30){
      itemScale*=0.96; guard++;
      boostedRx=Math.min(Math.max(desiredRx,minRByChord()),desiredRx*BASE.maxRxBoost);
    }
    rx=boostedRx; rz=Math.max(110,rx*BASE.zDepthFactor);
  }
  function layout(a=0){
    const step=360/items.length;
    items.forEach((el,i)=>{
      const deg=i*step+a, rad=deg*Math.PI/180;
      const x=Math.sin(rad)*rx, z=Math.cos(rad)*rz*-1;
      const d01=clamp((z+rz)/(2*rz),0,1);
      const fs=(minScale+(1-minScale)*d01)*itemScale;
      el.style.transform=`translate(-50%,-50%) translate3d(${x.toFixed(2)}px,${(Number(el.dataset.y_scaled??el.dataset.y)||0).toFixed(2)}px,${z.toFixed(2)}px) rotateY(${(-(deg-180)).toFixed(2)}deg) scale(${fs.toFixed(3)})`;
      el.style.opacity='1'; el.style.zIndex=String(Math.round(d01*1000));
    });
  }
  let a=0,rafId=null,isVis=false;
  function tick(){ if(!isVis) return; a+=speed; layout(a); rafId=requestAnimationFrame(tick); }
  new IntersectionObserver(entries=>{
    isVis=entries[0].isIntersecting;
    if(isVis&&!rafId) rafId=requestAnimationFrame(tick);
    else if(!isVis&&rafId){ cancelAnimationFrame(rafId); rafId=null; }
  },{threshold:0}).observe(stage);
  measureBaseItemWidth(); computeResponsive(); layout(0);
  new ResizeObserver(()=>{ measureBaseItemWidth(); computeResponsive(); layout(a); }).observe(stage);
}

// ─── BENEFITS BOOT ────────────────────────────────────────────────────
// Boots the applicant view by default.
// Role switcher handles employer via initBenefitsSection(role, onReady).
function initBenefitsBoot() {
  setTimeout(() => {
    if (window.initBenefitsSection) window.initBenefitsSection('applicant');
  }, 100);
}

// ─── FAQ ──────────────────────────────────────────────────────────────
// Add custom FAQ accordion logic here if needed beyond Webflow native IX2
function initFAQ() {}

// ─── TEAM ─────────────────────────────────────────────────────────────
// Add team modal / slider init here
function initTeam() {}

// ─── FOOTER ───────────────────────────────────────────────────────────
// Add footer-specific logic here
function initFooter() {}
</script>

<!-- ===== MODAL (waitlist) ===== -->
<script>
$(document).ready(function() {
  const openBtn      = '.is-waitlist';
  const closeBtn     = '.waitlist-close-button';
  const modalWrapper = '.waitlist-pop-up';
  let scrollPosition = 0;
  $(openBtn).click(function() {
    scrollPosition = window.pageYOffset;
    $('body').css({ 'overflow': 'hidden', 'position': 'fixed', 'top': `-${scrollPosition}px`, 'width': '100%' });
    $(modalWrapper).scrollTop(0);
  });
  function restoreScroll() {
    $('body').css({ 'overflow': '', 'position': '', 'top': '', 'width': '' });
    window.scrollTo(0, scrollPosition);
  }
  $(closeBtn).click(function() { restoreScroll(); });
  $(document).keydown(function(e) { if (e.keyCode === 27) { restoreScroll(); $(closeBtn).click(); } });
});
</script>
