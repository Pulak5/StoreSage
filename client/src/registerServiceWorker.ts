// Simple service worker registration for PWA
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => {
        // registration successful
      })
      .catch(err => {
        // registration failed
        console.warn('ServiceWorker registration failed: ', err);
      });
  });
}
