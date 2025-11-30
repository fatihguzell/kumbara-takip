// ====================================
// ADMIN PAGE JAVASCRIPT
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    // Kullanıcı giriş kontrolü
    checkAuthentication();
    
    // Profil bilgilerini göster
    displayProfileInfo();
    
    // Ayarlar butonu
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            console.log('Ayarlar açıldı');
            // window.location.href = 'settings.html';
        });
    }
    
    // Çıkış butonu
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // İstatistikleri güncelle
    updateAdminStatistics();
});

// Kullanıcı giriş kontrolü
function checkAuthentication() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

// Profil bilgilerini göster
function displayProfileInfo() {
    const username = sessionStorage.getItem('username');
    
    const profileNameElement = document.getElementById('profileName');
    const profileEmailElement = document.getElementById('profileEmail');
    
    if (profileNameElement && username) {
        // Kullanıcı adını başlık harfleriyle göster
        profileNameElement.textContent = username.charAt(0).toUpperCase() + username.slice(1);
    }
    
    if (profileEmailElement && username) {
        // Email oluştur (demo için)
        profileEmailElement.textContent = `${username}@kumbaratakip.com`;
    }
}

// Admin istatistiklerini güncelle
function updateAdminStatistics() {
    // Gerçek projede bu veriler backend'den gelecek
    const stats = {
        totalKumbara: 127,
        activeKumbara: 42,
        totalRevenue: '54,320 ₺',
        totalTransactions: 238
    };
    
    // İstatistikleri DOM'a yazdır
    // Şimdilik HTML'de statik olarak tanımlandı
    console.log('Admin istatistikleri yüklendi:', stats);
}

// Çıkış işlemi
function handleLogout() {
    // Onay dialogu göster
    const confirmLogout = confirm('Çıkış yapmak istediğinizden emin misiniz?');
    
    if (confirmLogout) {
        // Session storage'ı temizle
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('username');
        
        // Bilgi mesajı (opsiyonel)
        console.log('Kullanıcı çıkış yaptı');
        
        // Login sayfasına yönlendir
        window.location.href = 'login.html';
    }
}

// Yönetim menüsü navigasyonu
function navigateToManagement(page) {
    console.log(`Navigating to: ${page}`);
    // Gerçek sayfalar oluşturulduktan sonra:
    // window.location.href = page;
}

// Veri yedekleme
function backupData() {
    console.log('Veri yedekleme başlatıldı...');
    // Backend API'ye istek gönder
    alert('Veri yedekleme işlemi başlatıldı. Bu işlem birkaç dakika sürebilir.');
}

// Veri geri yükleme
function restoreData() {
    const confirmRestore = confirm('Verileri geri yüklemek istediğinizden emin misiniz? Bu işlem mevcut verilerin üzerine yazacaktır.');
    
    if (confirmRestore) {
        console.log('Veri geri yükleme başlatıldı...');
        // Backend API'ye istek gönder
        alert('Veri geri yükleme işlemi başlatıldı.');
    }
}
