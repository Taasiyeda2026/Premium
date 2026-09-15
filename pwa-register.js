(() => {
  const path = decodeURIComponent(window.location.pathname);
  const isPremiumArticle = /\/premium web\/news\/news(?:[1-9]|1[0-2])\.html$/i.test(path);

  if (!isPremiumArticle) return;

  const movePremiumArticleLogo = () => {
    const logoLink = document.querySelector('.site-header .logo-link');
    const titleWrap = document.querySelector('.article-shell .masthead .paper-title-wrap');

    if (!logoLink || !titleWrap || titleWrap.querySelector('.masthead-logo')) return;

    logoLink.classList.add('masthead-logo');
    titleWrap.insertBefore(logoLink, titleWrap.firstChild);

    if (!document.getElementById('premium-article-logo-style')) {
      const style = document.createElement('style');
      style.id = 'premium-article-logo-style';
      style.textContent = `
        .article-shell .masthead .paper-title-wrap .masthead-logo {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: max-content !important;
          margin: 0 auto 8px !important;
          padding: 0 !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        .article-shell .masthead .paper-title-wrap .masthead-logo:hover {
          transform: translateY(-1px) !important;
          box-shadow: none !important;
          background: transparent !important;
        }

        .article-shell .masthead .paper-title-wrap .masthead-logo .site-logo {
          display: block !important;
          width: auto !important;
          max-width: 58px !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.18)) !important;
        }

        .site-header {
          margin-bottom: 10px !important;
          min-height: 46px;
        }

        @media (max-width: 700px) {
          .article-shell .masthead .paper-title-wrap .masthead-logo {
            margin-bottom: 6px !important;
          }

          .article-shell .masthead .paper-title-wrap .masthead-logo .site-logo {
            max-width: 46px !important;
          }

          .site-header {
            margin-bottom: 8px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', movePremiumArticleLogo, { once: true });
  } else {
    movePremiumArticleLogo();
  }
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const currentScript = document.currentScript;
    const scriptUrl = new URL(currentScript ? currentScript.src : 'pwa-register.js', window.location.href);
    const serviceWorkerUrl = new URL('service-worker.js', scriptUrl);

    navigator.serviceWorker.register(serviceWorkerUrl);
  });
}
