document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const listContainer = document.getElementById('listContainer');
  const searchInput = document.getElementById('searchInput');
  const summaryCount = document.getElementById('summaryCount');

  let currentType = 'ISLETME';
  const all = JSON.parse(localStorage.getItem('isletmeler') || '[]');

  function render() {
    const q = (searchInput?.value || '').trim().toUpperCase();
    const filteredByType = all.filter(x => x.kumbaraTipi === currentType);
    const filtered = q
      ? filteredByType.filter(x =>
          (x.isletmeAdi || '').toUpperCase().includes(q) ||
          (x.isletmeSahibi || '').toUpperCase().includes(q) ||
          (x.telefon || '').toUpperCase().includes(q)
        )
      : filteredByType;

    if (summaryCount) {
      const total = filtered.length;
      summaryCount.textContent = `Toplam: ${total}`;
    }
    listContainer.classList.remove('fade-in');
    listContainer.innerHTML = '';
    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'card';
      empty.textContent = 'Kayıt bulunamadı.';
      listContainer.appendChild(empty);
      return;
    }
    filtered.forEach((item, idxInFiltered) => {
      const row = document.createElement('div');
      row.className = 'list-item';

      const icon = document.createElement('div');
      icon.className = 'list-icon ' + (currentType === 'ISLETME' ? 'isletme' : 'ev');
      // İkonlar: İşletme (mağaza) ve Ev (house)
      const svgIsletme = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9L4 4H20L21 9H3Z" fill="white"/><path d="M4 10H20V20H4V10Z" fill="white"/><path d="M9 14H12V20H9V14Z" fill="#FBB03B"/></svg>';
      const svgEv = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L2 12H5V20H10V15H14V20H19V12H22L12 3Z" fill="white"/></svg>';
      icon.innerHTML = currentType === 'ISLETME' ? svgIsletme : svgEv;

      const text = document.createElement('div');
      text.className = 'list-text';
      const title = document.createElement('h4');
      title.textContent = item.isletmeAdi || '—';
      text.appendChild(title);

      const meta = document.createElement('div');
      meta.className = 'list-meta';
      meta.textContent = new Date(item.createdAt).toLocaleDateString('tr-TR');

      const details = document.createElement('div');
      details.className = 'list-details';
      details.innerHTML = `
        <div class="detail-row"><span class="detail-key">İşletme Sahibi</span><span class="detail-val">${item.isletmeSahibi || '—'}</span></div>
        <div class="detail-row"><span class="detail-key">Telefon</span><span class="detail-val">${item.telefon || '—'}</span></div>
        <div class="detail-row"><span class="detail-key">Adres</span><span class="detail-val">${item.adres || '—'}</span></div>
        <div class="detail-row"><span class="detail-key">Referans</span><span class="detail-val">${item.referans || '—'}</span></div>
        <div class="detail-row"><span class="detail-key">Tip</span><span class="detail-val">${item.kumbaraTipi === 'ISLETME' ? 'İŞLETME TİPİ' : 'EV TİPİ'}</span></div>
        <div class="list-actions">
          <button class="btn-small btn-edit" data-idx="${idxInFiltered}">Düzenle</button>
          <button class="btn-small btn-delete" data-idx="${idxInFiltered}">Sil</button>
        </div>
      `;

      row.appendChild(icon);
      row.appendChild(text);
      row.appendChild(meta);
      row.appendChild(details);

      row.addEventListener('click', (ev) => {
        const t = ev.target;
        if (t.classList.contains('btn-edit') || t.classList.contains('btn-delete')) return;
        const alreadyExpanded = row.classList.contains('expanded');
        // Önce diğer genişlemiş satırları kapat
        listContainer.querySelectorAll('.list-item.expanded').forEach(el => {
          if (el !== row) el.classList.remove('expanded');
        });
        // Sonra mevcut satırı toggle et
        if (alreadyExpanded) {
          row.classList.remove('expanded');
        } else {
          row.classList.add('expanded');
        }
      });

      details.querySelector('.btn-edit').addEventListener('click', (ev) => {
        ev.stopPropagation();
        const idx = parseInt(ev.target.dataset.idx, 10);
        editItem(idx);
      });
      details.querySelector('.btn-delete').addEventListener('click', (ev) => {
        ev.stopPropagation();
        const idx = parseInt(ev.target.dataset.idx, 10);
        deleteItem(idx);
      });

      listContainer.appendChild(row);
    });
    // Liste render edildikten sonra yumuşak görünüm
    listContainer.classList.add('fade-in');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentType = tab.dataset.type;
      // Sekme geçişinde animasyon: önce içerik gizlenir, sonra yeniden render + animasyon
      listContainer.classList.remove('fade-in');
      listContainer.classList.add('fade-out');
      setTimeout(() => {
        render();
        listContainer.classList.remove('fade-out');
        listContainer.classList.add('slide-down');
        // kısa süre sonra slide sınıfını kaldır
        setTimeout(() => { listContainer.classList.remove('slide-down'); }, 350);
      }, 150);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      render();
    });
  }

  render();

  function saveAll() {
    localStorage.setItem('isletmeler', JSON.stringify(all));
  }

  function editItem(idx) {
    const filtered = all.filter(x => x.kumbaraTipi === currentType);
    const item = filtered[idx];
    if (!item) return;

    const popup = document.getElementById('editPopup');
    const form = document.getElementById('editForm');
    const adEl = document.getElementById('editAd');
    const tipEl = document.getElementById('editTip');
    const telEl = document.getElementById('editTelefon');
    const adresEl = document.getElementById('editAdres');
    const cancelBtn = document.getElementById('editCancel');
    const sahibiEl = document.getElementById('editSahibi');
    const referansEl = document.getElementById('editReferans');

    // Prefill
    adEl.value = item.isletmeAdi || '';
    tipEl.value = item.kumbaraTipi || currentType;
    telEl.value = item.telefon || '';
    adresEl.value = item.adres || '';
    sahibiEl.value = item.isletmeSahibi || '';
    referansEl.value = item.referans || '';

    // Normalize prefilled phone to mask format
    if (telEl.value) {
      let v0 = telEl.value.replace(/[^0-9]/g, '').slice(0, 11);
      const parts0 = [];
      if (v0.length >= 4) { parts0.push(v0.slice(0,4)); v0 = v0.slice(4); }
      if (v0.length >= 3) { parts0.push(v0.slice(0,3)); v0 = v0.slice(3); }
      if (v0.length >= 2) { parts0.push(v0.slice(0,2)); v0 = v0.slice(2); }
      if (v0.length > 0) parts0.push(v0);
      telEl.value = parts0.join('-');
    }

    // Show
    popup.classList.remove('hidden');

    // Uppercase enforcement on inputs except phone (assign handlers to avoid duplicate listeners)
    const toUpper = (el) => { el.value = (el.value || '').toUpperCase(); };
    adEl.oninput = () => toUpper(adEl);
    adresEl.oninput = () => toUpper(adresEl);
    sahibiEl.oninput = () => toUpper(sahibiEl);
    referansEl.oninput = () => toUpper(referansEl);

    // Phone mask: 0000-000-00-00
    telEl.oninput = () => {
      let v = telEl.value.replace(/[^0-9]/g, '').slice(0, 11);
      const parts = [];
      if (v.length >= 4) {
        parts.push(v.slice(0,4));
        v = v.slice(4);
      }
      if (v.length >= 3) {
        parts.push(v.slice(0,3));
        v = v.slice(3);
      }
      if (v.length >= 2) {
        parts.push(v.slice(0,2));
        v = v.slice(2);
      }
      if (v.length > 0) parts.push(v);
      telEl.value = parts.join('-');
    };

    // Rely on input mask to cap at 11 digits; do not block keydown
    telEl.onkeydown = (e) => {
      // Allow controls; block non-digits, but don't cap by length here
      if (["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) return;
      if (!/^[0-9]$/.test(e.key)) e.preventDefault();
    };

    const clearErrors = () => {
      form.querySelectorAll('.error-text').forEach(e => e.remove());
      form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    };

    const showError = (el, msg) => {
      el.classList.add('invalid');
      const p = document.createElement('div');
      p.className = 'error-text';
      p.textContent = msg;
      el.closest('.form-row').appendChild(p);
    };

    const onSubmit = (ev) => {
      ev.preventDefault();
      clearErrors();
      const yeniAd = adEl.value.trim();
      const yeniTip = tipEl.value;
      const yeniTel = telEl.value.trim();
      const yeniAdres = adresEl.value.trim();
      const yeniSahibi = sahibiEl.value.trim();
      const yeniReferans = referansEl.value.trim();

      let hasError = false;
      if (!yeniAd) { showError(adEl, 'İşletme adı zorunludur.'); hasError = true; }
      if (!['ISLETME','EV'].includes(yeniTip)) { showError(tipEl, 'Geçerli bir tip seçin.'); hasError = true; }
      if (yeniTel && !/^\d{4}-\d{3}-\d{2}-\d{2}$/.test(yeniTel)) { showError(telEl, 'Telefon biçimi 0000-000-00-00 olmalıdır.'); hasError = true; }
      if (!yeniAdres) { showError(adresEl, 'Adres zorunludur.'); hasError = true; }
      if (!yeniSahibi) { showError(sahibiEl, 'İşletme sahibi zorunludur.'); hasError = true; }
      // Referans isteğe bağlı, zorunlu değil
      if (hasError) return;

      item.isletmeAdi = yeniAd.toUpperCase();
      item.kumbaraTipi = yeniTip;
      item.telefon = yeniTel;
      item.adres = yeniAdres.toUpperCase();
      item.isletmeSahibi = yeniSahibi.toUpperCase();
      item.referans = (yeniReferans ? yeniReferans.toUpperCase() : '');

      const idxAll = all.findIndex(x => x.createdAt === item.createdAt);
      if (idxAll >= 0) all[idxAll] = item;
      saveAll();

      // Close and cleanup
      popup.classList.add('hidden');
      form.removeEventListener('submit', onSubmit);
      cancelBtn.removeEventListener('click', onCancel);
      render();

      // Show success toast
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = 'Kayıt güncellendi.';
        toast.classList.remove('hidden');
        setTimeout(() => { toast.classList.add('hidden'); }, 2000);
      }
    };

    const onCancel = () => {
      popup.classList.add('hidden');
      form.removeEventListener('submit', onSubmit);
      cancelBtn.removeEventListener('click', onCancel);
    };

    form.addEventListener('submit', onSubmit);
    cancelBtn.addEventListener('click', onCancel);
  }

  function deleteItem(idx) {
    const filtered = all.filter(x => x.kumbaraTipi === currentType);
    const item = filtered[idx];
    if (!item) return;

    // Custom confirm popup
    const cPopup = document.getElementById('confirmPopup');
    const cOk = document.getElementById('confirmOk');
    const cCancel = document.getElementById('confirmCancel');
    if (!cPopup || !cOk || !cCancel) return;
    cPopup.classList.remove('hidden');

    const doCancel = () => {
      cPopup.classList.add('hidden');
      cOk.removeEventListener('click', doOk);
      cCancel.removeEventListener('click', doCancel);
    };
    const doOk = () => {
      const indexInAll = all.findIndex(x => x.createdAt === item.createdAt);
      if (indexInAll >= 0) {
        all.splice(indexInAll, 1);
        saveAll();
        render();
      }
      doCancel();
    };

    cOk.addEventListener('click', doOk);
    cCancel.addEventListener('click', doCancel);
  }
});
