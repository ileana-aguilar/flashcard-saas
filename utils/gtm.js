export const GTM_ID = 'G-2HK40C4CYN';

export const pageview = (url) => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  });
};

export const initGTM = () => {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', GTM_ID);
};
