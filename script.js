(function(){
  const HOTMART_TARGET = '#hotmart-sales-funnel';
  const pixelEvent = (name, params = {}) => {
    try { if (window.fbq) fbq('trackCustom', name, params); } catch(e) {}
  };

  const sendCapi = (eventName, customData = {}) => {
    try {
      fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, customData })
      }).catch(() => {});
    } catch(e) {}
  };

  pixelEvent('ViewUpsellOrcamentoQueFecha');
  sendCapi('ViewUpsellOrcamentoQueFecha', { content_name: 'Orçamento que Fecha', value: 147, currency: 'BRL' });

  document.querySelectorAll('[data-scroll-hotmart]').forEach((button) => {
    button.addEventListener('click', () => {
      pixelEvent('ClickUpsellOrcamentoQueFechaCTA', { content_name: 'Orçamento que Fecha' });
      sendCapi('ClickUpsellOrcamentoQueFechaCTA', { content_name: 'Orçamento que Fecha', value: 147, currency: 'BRL' });
      const target = document.querySelector(HOTMART_TARGET);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
})();
