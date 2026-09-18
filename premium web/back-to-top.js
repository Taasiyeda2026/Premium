(() => {
  const STYLE_ID = 'premium-back-to-top-style';
  const BUTTON_ID = 'premiumBackToTop';

  function initBackToTop() {
    if (document.getElementById(BUTTON_ID)) return;

    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        .premium-back-to-top{
          position:fixed;
          left:18px;
          bottom:18px;
          z-index:9998;
          width:32px;
          height:32px;
          display:grid;
          place-items:center;
          padding:0;
          border:1px solid rgba(63,176,198,.42);
          border-radius:50%;
          background:rgba(10,31,55,.74);
          color:rgba(240,253,255,.94);
          box-shadow:0 3px 12px rgba(0,0,0,.12);
          backdrop-filter:blur(6px);
          -webkit-backdrop-filter:blur(6px);
          cursor:pointer;
          opacity:0;
          visibility:hidden;
          transform:translateY(6px);
          transition:opacity .18s ease,transform .18s ease,visibility .18s ease,border-color .18s ease;
        }
        .premium-back-to-top.is-visible{
          opacity:.78;
          visibility:visible;
          transform:translateY(0);
        }
        .premium-back-to-top:hover,
        .premium-back-to-top:focus-visible{
          opacity:1;
          border-color:rgba(91,210,231,.78);
          outline:none;
        }
        .premium-back-to-top svg{
          width:16px;
          height:16px;
          fill:none;
          stroke:currentColor;
          stroke-width:1.45;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        @media(max-width:560px){
          .premium-back-to-top{left:12px;width:30px;height:30px}
        }
        @media print{
          .premium-back-to-top{display:none!important}
        }
      `;
      document.head.appendChild(style);
    }

    const btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.className = 'premium-back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'חזרה לראש העמוד');
    btn.setAttribute('title', 'חזרה לראש העמוד');
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12l5-5 5 5M12 7v10"/></svg>';
    document.body.appendChild(btn);

    const placeAboveBottomBar = () => {
      const candidates = [...document.querySelectorAll('.actions,.bar,.bottom-bar,.fixed-bottom,.sticky-actions')];
      const fixedBottom = candidates.find(el => {
        const cs = getComputedStyle(el);
        if (cs.position !== 'fixed' && cs.position !== 'sticky') return false;
        const rect = el.getBoundingClientRect();
        return rect.bottom >= window.innerHeight - 4 && rect.height > 24;
      });
      btn.style.bottom = fixedBottom ? (fixedBottom.getBoundingClientRect().height + 12) + 'px' : '18px';
    };

    const update = () => {
      btn.classList.toggle('is-visible', window.scrollY > 260);
    };

    btn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', placeAboveBottomBar);

    placeAboveBottomBar();
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackToTop, {once:true});
  } else {
    initBackToTop();
  }
})();