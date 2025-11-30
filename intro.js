// ====================================
// INTRO PAGE JAVASCRIPT
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yüklendikten 2.5 saniye sonra login sayfasına yönlendir
    setTimeout(function() {
        window.location.href = 'login.html';
    }, 2500);
    
    // Logo animasyonunu başlat
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.classList.add('fade-in');
    }
});
