// ====================================
// LOGIN PAGE JAVASCRIPT
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    // Login sayfası her açıldığında/yeniden yüklendiğinde önce intro göster
    const introJustShown = sessionStorage.getItem('introJustShown');
    if (!introJustShown) {
        // Bir kez intro'ya yönlendir, döndüğümüzde tekrar yönlendirme olmasın
        sessionStorage.setItem('introJustShown', 'true');
        window.location.href = 'intro.html';
        return;
    } else {
        // Intro'dan geri geldik, flag'i temizle ki bir sonraki reload'da intro tekrar gösterilsin
        sessionStorage.removeItem('introJustShown');
    }
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    
    // Şifre göster/gizle
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // İkon değiştirme (opsiyonel - gelecekte göz ikonunu değiştirebilirsiniz)
            this.classList.toggle('active');
        });
    }
    
    // Form gönderimi
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Basit doğrulama (geliştirme aşamasında - gerçek projede backend ile yapılmalı)
            if (username === 'admin' && password === 'admin123') {
                // Başarılı giriş
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('username', username);
                }
                
                // Kullanıcı bilgilerini session storage'a kaydet
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('username', username);
                
                // Ana sayfaya yönlendir
                window.location.href = 'index.html';
            } else {
                // Hatalı giriş
                showError('Hatalı kullanıcı adı veya şifre!');
            }
        });
    }
    
    // Hata mesajını göster
    function showError(message) {
        const errorText = document.getElementById('errorText');
        if (errorText) {
            errorText.textContent = message;
        }
        if (errorMessage) {
            errorMessage.style.display = 'flex';
            
            // 3 saniye sonra hata mesajını gizle
            setTimeout(function() {
                errorMessage.style.display = 'none';
            }, 3000);
        }
    }
    
    // Daha önce "Beni Hatırla" seçilmişse kullanıcı adını doldur
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            document.getElementById('username').value = savedUsername;
            document.getElementById('rememberMe').checked = true;
        }
    }
    
    // Enter tuşu ile form gönderimi
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});
