document.addEventListener('DOMContentLoaded', () => {
  const listContainer = document.getElementById('listContainer');
  const statTotal = document.getElementById('statTotal');
  const statCollected = document.getElementById('statCollected');
  const statRemaining = document.getElementById('statRemaining');
  const pageTitle = document.getElementById('pageTitle');
  
  const all = JSON.parse(localStorage.getItem('isletmeler') || '[]');
  const currentDate = new Date();
  const selectedMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const selectedYear = String(currentDate.getFullYear());

  // Başlığı güncelle
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const monthName = monthNames[currentDate.getMonth()];
  if (pageTitle) {
    pageTitle.textContent = `${monthName} - ${selectedYear} Kumbara Toplama Listesi`;
  }

  function getCollectedForPeriod(month, year) {
    const records = JSON.parse(localStorage.getItem('toplamaKayitlari') || '[]');
    const record = records.find(r => r.month === month && r.year === year);
    return record ? record.items.map(item => item.isletmeAdi) : [];
  }

  function updateStats(filteredList) {
    const total = filteredList.length;
    const collected = filteredList.filter(x => x.collected).length;
    const remaining = total - collected;
    if (statTotal) statTotal.textContent = total;
    if (statCollected) statCollected.textContent = collected;
    if (statRemaining) statRemaining.textContent = remaining;
  }

  function render() {
    const collectedNames = getCollectedForPeriod(selectedMonth, selectedYear);
    const available = all.filter(item => !collectedNames.includes(item.isletmeAdi));
    
    listContainer.innerHTML = '';
    if (available.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'card';
      empty.textContent = 'Bu ay için tüm işletmeler toplanmış.';
      listContainer.appendChild(empty);
      updateStats([]);
      return;
    }

    available.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'list-item';
      if (item.collected) row.classList.add('collected');

      const icon = document.createElement('div');
      icon.className = 'list-icon ' + (item.kumbaraTipi === 'ISLETME' ? 'isletme' : 'ev');
      const svgIsletme = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9L4 4H20L21 9H3Z" fill="white"/><path d="M4 10H20V20H4V10Z" fill="white"/><path d="M9 14H12V20H9V14Z" fill="#FBB03B"/></svg>';
      const svgEv = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L2 12H5V20H10V15H14V20H19V12H22L12 3Z" fill="white"/></svg>';
      icon.innerHTML = item.kumbaraTipi === 'ISLETME' ? svgIsletme : svgEv;

      const text = document.createElement('div');
      text.className = 'list-text';
      const title = document.createElement('h4');
      title.textContent = item.isletmeAdi || '—';
      text.appendChild(title);

      const meta = document.createElement('div');
      meta.className = 'list-meta';
      meta.textContent = new Date(item.createdAt).toLocaleDateString('tr-TR');

      const checkboxCell = document.createElement('div');
      checkboxCell.className = 'collect-checkbox';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!item.collected;
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        item.collected = checkbox.checked;
        const allIdx = all.findIndex(x => x.isletmeAdi === item.isletmeAdi);
        if (allIdx !== -1) {
          all[allIdx] = item;
          localStorage.setItem('isletmeler', JSON.stringify(all));
        }
        if (checkbox.checked) {
          row.classList.add('collected');
        } else {
          row.classList.remove('collected');
        }
        updateStats(available);
      });
      checkboxCell.appendChild(checkbox);

      const details = document.createElement('div');
      details.className = 'list-details';
      details.innerHTML = `
        <div class="detail-row"><span class="detail-key">İşletme Sahibi</span><span class="detail-val">${item.isletmeSahibi || '—'}</span></div>
        <div class="detail-row"><span class="detail-key">Telefon</span><span class="detail-val">${item.telefon || '—'}</span></div>
        <div class="detail-row"><span class="detail-key">Adres</span><span class="detail-val">${item.adres || '—'}</span></div>
        <div class="detail-row"><span class="detail-key">Referans</span><span class="detail-val">${item.referans || '—'}</span></div>
        <div class="detail-row"><span class="detail-key">Tip</span><span class="detail-val">${item.kumbaraTipi === 'ISLETME' ? 'İŞLETME TİPİ' : 'EV TİPİ'}</span></div>
      `;

      row.appendChild(icon);
      row.appendChild(text);
      row.appendChild(checkboxCell);
      row.appendChild(meta);
      row.appendChild(details);

      row.addEventListener('click', (ev) => {
        const t = ev.target;
        if (t.type === 'checkbox') return;
        const alreadyExpanded = row.classList.contains('expanded');
        listContainer.querySelectorAll('.list-item.expanded').forEach(el => {
          if (el !== row) el.classList.remove('expanded');
        });
        if (alreadyExpanded) {
          row.classList.remove('expanded');
        } else {
          row.classList.add('expanded');
        }
      });

      listContainer.appendChild(row);
    });

    listContainer.classList.add('fade-in');
    updateStats(available);
  }

  render();

  // Kaydet butonu
  const saveBtn = document.getElementById('saveBtn');

  // Uyarı popup elemanları
  const warningPopup = document.getElementById('warningPopup');
  const warningMessage = document.getElementById('warningMessage');
  const warningOk = document.getElementById('warningOk');

  function showWarning(message) {
    if (warningMessage && warningPopup) {
      warningMessage.textContent = message;
      warningPopup.classList.remove('hidden');
    }
  }

  if (warningOk) {
    warningOk.addEventListener('click', () => {
      warningPopup.classList.add('hidden');
    });
  }

  saveBtn.addEventListener('click', () => {
    const collectedNames = getCollectedForPeriod(selectedMonth, selectedYear);
    const available = all.filter(item => !collectedNames.includes(item.isletmeAdi));
    const collected = available.filter(x => x.collected);
    
    if (collected.length === 0) {
      showWarning('Hiç toplanan işletme seçilmedi!');
      return;
    }

    const month = selectedMonth;
    const year = selectedYear;
    const username = sessionStorage.getItem('username') || 'Kullanıcı';

    const record = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      month,
      year,
      username,
      items: collected.map(item => ({
        isletmeAdi: item.isletmeAdi,
        isletmeSahibi: item.isletmeSahibi,
        telefon: item.telefon,
        adres: item.adres,
        kumbaraTipi: item.kumbaraTipi
      }))
    };

    const records = JSON.parse(localStorage.getItem('toplamaKayitlari') || '[]');
    const existingRecord = records.find(r => r.month === month && r.year === year);

    if (existingRecord) {
      existingRecord.items.push(...record.items);
      existingRecord.createdAt = new Date().toISOString();
      localStorage.setItem('toplamaKayitlari', JSON.stringify(records));
    } else {
      records.push(record);
      localStorage.setItem('toplamaKayitlari', JSON.stringify(records));
    }

    // Toplanan işletmelerin collected flag'ini temizle
    all.forEach(item => { item.collected = false; });
    localStorage.setItem('isletmeler', JSON.stringify(all));

    // Toast mesajı göster
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = 'Kayıt başarıyla oluşturuldu.';
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
        window.location.href = 'toplananlar.html';
      }, 2000);
    } else {
      window.location.href = 'toplananlar.html';
    }
  });
});
