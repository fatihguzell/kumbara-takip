document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('isletmeForm');
  const inputsUpper = ['isletmeAdi', 'isletmeSahibi', 'adres', 'referans'];
  const telefonInput = document.getElementById('telefon');
  const kumbaraTipi = document.getElementById('kumbaraTipi');
  const popupEl = document.getElementById('popup');
  const popupTitle = document.getElementById('popupTitle');
  const popupMessage = document.getElementById('popupMessage');
  const popupClose = document.getElementById('popupClose');

  // Tüm metin alanlarını büyük harfe çevir
  inputsUpper.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      el.value = el.value.toUpperCase();
      // İmleci koru
      try { el.setSelectionRange(start, end); } catch (_) {}
    });
  });

  // Telefon maskesi: 0000-000-00-00
  telefonInput.addEventListener('input', () => {
    const digits = telefonInput.value.replace(/\D/g, '').slice(0, 12);
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      formatted += digits[i];
      if (i === 3 || i === 6 || i === 8) formatted += '-';
    }
    telefonInput.value = formatted;
  });

  function validateTelefon() {
    const val = telefonInput.value;
    const pattern = /^\d{4}-\d{3}-\d{2}-\d{2}$/;
    const err = document.getElementById('err-telefon');
    if (!pattern.test(val)) {
      const digitCount = val.replace(/\D/g, '').length;
      err.textContent = `Telefon formatı 0000-000-00-00 olmalı (şu an ${digitCount} hane).`;
      return false;
    }
    err.textContent = '';
    return true;
  }

  // Kumbara Tipi kontrolü
  function validateKumbaraTipi() {
    const err = document.getElementById('err-kumbaraTipi');
    if (!kumbaraTipi.value) {
      err.textContent = 'Lütfen kumbara tipini seçin.';
      return false;
    }
    err.textContent = '';
    return true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const okTelefon = validateTelefon();
    const okTip = validateKumbaraTipi();
    if (!okTelefon || !okTip) return;

    // Basit alan doğrulamaları
    const requiredIds = ['isletmeAdi', 'isletmeSahibi', 'telefon', 'adres', 'kumbaraTipi'];
    let valid = true;
    requiredIds.forEach(id => {
      const el = document.getElementById(id);
      const err = document.getElementById(`err-${id}`);
      if (!el.value.trim()) {
        err.textContent = 'Bu alan zorunludur.';
        valid = false;
      } else {
        err.textContent = '';
      }
    });

    if (!valid) return;

    // Demo: verileri localStorage'a kaydet
    const payload = {
      isletmeAdi: document.getElementById('isletmeAdi').value.trim(),
      isletmeSahibi: document.getElementById('isletmeSahibi').value.trim(),
      telefon: telefonInput.value.trim(),
      adres: document.getElementById('adres').value.trim(),
      referans: document.getElementById('referans').value.trim(),
      kumbaraTipi: kumbaraTipi.value,
      createdAt: new Date().toISOString()
    };

    const list = JSON.parse(localStorage.getItem('isletmeler') || '[]');
    list.push(payload);
    localStorage.setItem('isletmeler', JSON.stringify(list));

    showPopup('success', 'İşletme Kaydedildi', 'İşletme bilgileri başarıyla kaydedildi.');
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  });

  popupClose.addEventListener('click', () => {
    hidePopup();
  });

  function showPopup(type = 'info', title = 'Bilgi', message = '') {
    popupEl.classList.remove('success', 'error', 'info');
    popupEl.classList.add(type, 'show');
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popupEl.hidden = false;
    // Animasyon sınıfları ile giriş
    popupEl.classList.add('fade-in');
    const content = popupEl.querySelector('.popup-content');
    if (content) content.classList.add('scale-in');
  }

  function hidePopup() {
    // Çıkış animasyonu
    const content = popupEl.querySelector('.popup-content');
    if (content) content.classList.remove('scale-in');
    popupEl.classList.remove('fade-in');
    popupEl.hidden = true;
  }
});
