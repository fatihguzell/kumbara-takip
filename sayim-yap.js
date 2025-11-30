document.addEventListener('DOMContentLoaded', () => {
  const sayimContainer = document.getElementById('sayimContainer');
  const sayimToast = document.getElementById('sayimToast');
  const sayimPopup = document.getElementById('sayimPopup');
  const sayimPopupTitle = document.getElementById('sayimPopupTitle');
  const sayimPopupMessage = document.getElementById('sayimPopupMessage');
  const sayimPopupOk = document.getElementById('sayimPopupOk');

  // Sayım verilerini localStorage'da tut
  let sayimlar = JSON.parse(localStorage.getItem('sayimlar') || '[]');

  // Tamamlanan ayları bul
  const records = JSON.parse(localStorage.getItem('toplamaKayitlari') || '[]');
  const all = JSON.parse(localStorage.getItem('isletmeler') || '[]');

  // Ay için işletme sayısı
  function getAyIsletmeSayisi(record) {
    return all.filter(item => {
      const created = new Date(item.createdAt);
      return created.getFullYear() <= parseInt(record.year, 10) && (created.getMonth() + 1) <= parseInt(record.month, 10);
    }).length;
  }

  // Sadece tamamlanan aylar
  const tamamlananlar = records.filter(record => {
    const ayIsletmeSayisi = getAyIsletmeSayisi(record);
    return record.items.length === ayIsletmeSayisi && ayIsletmeSayisi > 0;
  });

  function showToast(msg) {
    sayimToast.textContent = msg;
    sayimToast.classList.remove('hidden');
    setTimeout(() => {
      sayimToast.classList.add('hidden');
    }, 2000);
  }

  function showPopup(title, msg) {
    sayimPopupTitle.textContent = title;
    sayimPopupMessage.textContent = msg;
    sayimPopup.classList.remove('hidden');
    sayimPopupOk.onclick = () => {
      sayimPopup.classList.add('hidden');
    };
  }

  function render() {
    sayimContainer.innerHTML = '';
    if (tamamlananlar.length === 0) {
      showPopup('Bilgi', 'Henüz tamamlanan bir ay yok.');
      return;
    }
    tamamlananlar.forEach(record => {
      const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      const monthName = monthNames[parseInt(record.month, 10) - 1];
      const sayimKaydi = sayimlar.find(s => s.month === record.month && s.year === record.year);
      const sayimValue = sayimKaydi ? sayimKaydi.value : null;

      const card = document.createElement('div');
      card.className = 'sayim-card';

      const header = document.createElement('div');
      header.className = 'sayim-header';

      const title = document.createElement('h3');
      title.className = 'sayim-title';
      title.textContent = `${monthName} ${record.year}`;
      header.appendChild(title);

      if (sayimValue !== null) {
        const value = document.createElement('span');
        value.className = 'sayim-value';
        value.textContent = `Sayım: ${sayimValue}`;
        header.appendChild(value);
        const editBtn = document.createElement('button');
        editBtn.className = 'sayim-edit-btn';
        editBtn.textContent = 'Düzenle';
        editBtn.onclick = (e) => {
          e.stopPropagation();
          expandCard(true);
        };
        header.appendChild(editBtn);
      }

      card.appendChild(header);

      // Expandable area
      const expand = document.createElement('div');
      expand.className = 'sayim-expand';
      const formRow = document.createElement('div');
      formRow.className = 'sayim-form-row';
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'sayim-input';
      input.placeholder = 'Sayım giriniz';
      if (sayimValue !== null) input.value = sayimValue;
      const saveBtn = document.createElement('button');
      saveBtn.className = 'sayim-btn';
      saveBtn.textContent = 'Kaydet';
      saveBtn.onclick = (e) => {
        e.stopPropagation();
        const val = input.value.trim();
        if (val === '' || isNaN(val) || parseInt(val) < 0) {
          showPopup('Uyarı', 'Geçerli bir sayı giriniz.');
          return;
        }
        // Kaydı güncelle
        const idx = sayimlar.findIndex(s => s.month === record.month && s.year === record.year);
        if (idx > -1) {
          sayimlar[idx].value = val;
        } else {
          sayimlar.push({ month: record.month, year: record.year, value: val });
        }
        localStorage.setItem('sayimlar', JSON.stringify(sayimlar));
        showToast('Sayım kaydedildi.');
        expandCard(false);
        render();
      };
      formRow.appendChild(input);
      formRow.appendChild(saveBtn);
      expand.appendChild(formRow);
      card.appendChild(expand);

      // Expand/collapse logic
      function expandCard(open) {
        if (open) {
          card.classList.add('expanded');
          input.focus();
        } else {
          card.classList.remove('expanded');
        }
      }
      card.onclick = function(e) {
        // Sadece ana karta tıklanınca aç/kapat
        if (e.target === card || e.target === title || e.target === badge) {
          expandCard(!card.classList.contains('expanded'));
        }
      };

      sayimContainer.appendChild(card);
    });
  }

  render();
});
