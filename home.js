// ====================================
// HOME PAGE JAVASCRIPT
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    // Kullanıcı giriş kontrolü
    checkAuthentication();
    
    // Kullanıcı adını göster
    displayUserName();
    
    // Bildirim butonu
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // Bildirimler sayfasına yönlendir veya modal aç
            console.log('Bildirimler açıldı');
            // window.location.href = 'notifications.html';
        });
    }
    
    // İstatistikleri güncelle (opsiyonel - dinamik veri için)
    updateStatistics();
    
    // Son aktiviteleri yükle (opsiyonel - dinamik veri için)
    loadRecentActivities();

    // Hatırlatma popup'ını kontrol et ve göster
    checkAndShowReminder();
});

// Kullanıcı giriş kontrolü
function checkAuthentication() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        window.location.href = 'login.html';
    }
}

// Kullanıcı adını göster
function displayUserName() {
    const username = sessionStorage.getItem('username');
    const userNameElement = document.getElementById('userName');
    if (userNameElement && username) {
        userNameElement.textContent = username;
    }
}

// İstatistikleri güncelle
function updateStatistics() {
    // Aktif işletme sayısını localStorage'dan oku
    const all = JSON.parse(localStorage.getItem('isletmeler') || '[]');
    const activeCount = Array.isArray(all) ? all.length : 0;
    const stats = { activeCount, totalRevenue: '12,450 ₺' };
    
    const activeCountElement = document.getElementById('activeCount');
    const totalRevenueElement = document.getElementById('totalRevenue');
    
    if (activeCountElement) {
        activeCountElement.textContent = stats.activeCount;
    }
    
    if (totalRevenueElement) {
        totalRevenueElement.textContent = stats.totalRevenue;
    }
}

// Son aktiviteleri yükle
function loadRecentActivities() {
    // Gerçek projede bu veriler backend'den gelecek
    // Şimdilik statik HTML kullanılıyor
    console.log('Aktiviteler yüklendi');
}

// Sayfa navigasyonu için yardımcı fonksiyon
function navigateTo(page) {
    window.location.href = page;
}

// Format para birimi
function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format tarih
function formatDate(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return days === 1 ? '1 gün önce' : `${days} gün önce`;
    } else if (hours > 0) {
        return hours === 1 ? '1 saat önce' : `${hours} saat önce`;
    } else if (minutes > 0) {
        return minutes === 1 ? '1 dakika önce' : `${minutes} dakika önce`;
    } else {
        return 'Az önce';
    }
}

// Hatırlatma popup'ını kontrol et ve göster
function checkAndShowReminder() {
    const reminderPopup = document.getElementById('reminderPopup');
    const reminderTitle = document.getElementById('reminderTitle');
    const reminderMessage = document.getElementById('reminderMessage');
    const reminderOk = document.getElementById('reminderOk');

    if (!reminderPopup || !reminderMessage || !reminderOk) return;

    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentYear = String(now.getFullYear());

    // Bugün zaten gösterildi mi kontrol et
    const lastShownDate = localStorage.getItem('lastReminderDate');
    const todayStr = now.toISOString().split('T')[0];
    
    if (lastShownDate === todayStr) {
        return; // Bugün zaten gösterildi
    }

    // Tüm işletmeleri al
    const all = JSON.parse(localStorage.getItem('isletmeler') || '[]');
    if (all.length === 0) {
        return; // Hiç işletme yoksa hatırlatma gösterme
    }

    // Bu ay için toplanmış işletmeleri al
    const records = JSON.parse(localStorage.getItem('toplamaKayitlari') || '[]');
    const thisMonthRecord = records.find(r => r.month === currentMonth && r.year === currentYear);
    const collectedNames = thisMonthRecord ? thisMonthRecord.items.map(item => item.isletmeAdi) : [];
    const remaining = all.filter(item => !collectedNames.includes(item.isletmeAdi)).length;

    let message = '';

    // Ayın ilk haftası (1-7 arası)
    if (currentDay <= 7) {
        message = 'Yeni ay geldi. Kumbara listeni toplamayı unutma!';
    } else {
        // İlk haftadan sonra
        if (remaining > 0) {
            message = `Bu ay için ${remaining} adet kalan kumbaran var. En kısa sürede toplamayı unutma!`;
        } else {
            // Tümü toplanmış, hatırlatma gösterme
            return;
        }
    }

    reminderMessage.textContent = message;
    reminderPopup.classList.remove('hidden');

    // Tamam butonuna tıklandığında
    reminderOk.onclick = () => {
        reminderPopup.classList.add('hidden');
        localStorage.setItem('lastReminderDate', todayStr);
    };
}
