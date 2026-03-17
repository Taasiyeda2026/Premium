if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const currentScript = document.currentScript;
    const scriptUrl = new URL(currentScript ? currentScript.src : 'pwa-register.js', window.location.href);
    const serviceWorkerUrl = new URL('service-worker.js', scriptUrl);

    navigator.serviceWorker.register(serviceWorkerUrl);
  });
}
