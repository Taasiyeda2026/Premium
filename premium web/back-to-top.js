(() => {
  const STYLE_ID = 'premium-back-to-top-style';
  const BUTTON_ID = 'premiumBackToTop';
  const FALLBACK_ID = 'premiumBackToTopFallback';

  function initBackToTop() {
    if (document.getElementById(BUTTON_ID)) return;

    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        .premium-back-to-top{
          width:28px;
          height:28px;
          display:grid;
          place-items:center;
          padding:0;
          border:1px solid rgba(63,176,198,.38);
          border-radius:50%;
          background:rgba(10,31,55,.72);
          color:rgba(240,253,255,.92);
          box-shadow:0 2px 8px rgba(0,0,0,.10);
          cursor:pointer;
          opacity:.72;
          transition:opacity .16s ease,border-color .16s ease,transform .16s ease;
          -webkit-tap-highlight-color:transparent;
        }
        .premium-back-to-top:hover,
        .premium-back-to-top:focus-visible{
          opacity:1;
          border-color:rgba(91,210,231,.72);
          transform:translateY(-1px);
          outline:none;
        }
        .premium-back-to-top svg{
          width:14px;
          height:14px;
          fill:none;
          stroke:currentColor;
          stroke-width:1.35;
          stroke-linecap:round;
          stroke-linejoin:round;
        }

        footer.premium-back-to-top-footer{
          position:relative;
          padding-left:48px !important;
        }
        footer.premium-back-to-top-footer > .premium-back-to-top{
          position:absolute;
          left:12px;
          top:50%;
          transform:translateY(-50%);
        }
        footer.premium-back-to-top-footer > .premium-back-to-top:hover,
        footer.premium-back-to-top-footer > .premium-back-to-top:focus-visible{
          transform:translateY(calc(-50% - 1px));
        }

        .premium-back-to-top-fallback{
          width:min(100% - 32px,1100px);
          margin:14px auto 18px;
          display:flex;
          justify-content:flex-start;
          direction:ltr;
        }

        @media(max-width:560px){
          .premium-back-to-top{width:27px;height:27px}
          footer.premium-back-to-top-footer{padding-left:44px !important}
          footer.premium-back-to-top-footer > .premium-back-to-top{left:9px}
        }

        @media print{
          .premium-back-to-top,
          .premium-back-to-top-fallback{display:none!important}
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
    btn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

    const footers = [...document.querySelectorAll('footer')].filter(el => {
      const cs = getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden';
    });

    const footer = footers.length ? footers[footers.length - 1] : null;

    if (footer) {
      footer.classList.add('premium-back-to-top-footer');
      footer.appendChild(btn);
      return;
    }

    const fallback = document.createElement('div');
    fallback.id = FALLBACK_ID;
    fallback.className = 'premium-back-to-top-fallback';
    fallback.appendChild(btn);
    document.body.appendChild(fallback);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackToTop, {once:true});
  } else {
    initBackToTop();
  }
})();