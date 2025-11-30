// Global page transition handler
(function(){
  const frame = document.querySelector('.mobile-frame');
  if (!frame) return;
  // Giriş animasyonunu yalnızca içerik alanına uygula
  const appMain = document.querySelector('.app-main, .content');
  if (appMain) appMain.classList.add('fade-in');

  function navigateWithTransition(url, dir){
    if (!url) return;
    // Prevent double-trigger
    if (frame.dataset.exit === '1') return;
    // Çıkışta çerçevede yön animasyonu uygula
    // Varsayılan yön: left (ileri)
    const cls = dir === 'right' ? 'fade-out' : 'fade-out';
    // Çıkışta slide belirginliği için içeriğe hafif kaydırma uygulayalım
    frame.classList.add(dir === 'right' ? 'slide-right' : 'slide-left');
    frame.dataset.exit = '1';
    setTimeout(() => { window.location.href = url; }, 280);
  }

  // Intercept clicks on links/buttons with location changes
  document.addEventListener('click', (e) => {
    const t = e.target;
    // Anchor element or inside anchor
    const a = t.closest('a');
    if (a && a.getAttribute('href') && !a.getAttribute('target')){
      const href = a.getAttribute('href');
      const dir = a.dataset.dir || (a.classList.contains('nav-back') ? 'right' : 'left');
      if (href && !href.startsWith('#') && !href.startsWith('javascript')){
        e.preventDefault();
        // Başka click handler'ların çalışmasını engelle
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        navigateWithTransition(href, dir);
      }
    }
    // Buttons with onclick location.href
    if (t.tagName === 'BUTTON'){
      const onClick = t.getAttribute('onclick') || '';
      const match = onClick.match(/location\.href='([^']+)'/);
      if (match){
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        navigateWithTransition(match[1], 'left');
      }
    }
  });
})();
