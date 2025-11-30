document.addEventListener('DOMContentLoaded', () => {
  const recordsContainer = document.getElementById('recordsContainer');
  let records = JSON.parse(localStorage.getItem('toplamaKayitlari') || '[]');
  const deletePopup = document.getElementById('deletePopup');
  const deleteMessage = document.getElementById('deleteMessage');
  const deleteConfirm = document.getElementById('deleteConfirm');
  const deleteCancel = document.getElementById('deleteCancel');
  const toast = document.getElementById('toast');
  let recordToDelete = null;

  function render() {
    recordsContainer.innerHTML = '';
    
    if (records.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'card';
      empty.textContent = 'Henüz toplama kaydı bulunmuyor.';
      recordsContainer.appendChild(empty);
      return;
    }

    // En yeni kayıtlar önce gelsin
    const sorted = records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sorted.forEach((record) => {
      const card = document.createElement('div');
      card.className = 'record-card';

      const header = document.createElement('div');
      header.className = 'record-header';

      const title = document.createElement('h3');
      title.className = 'record-title';
      const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      const monthName = monthNames[parseInt(record.month, 10) - 1];
      title.textContent = `${monthName} ${record.year}`;

      const rightSection = document.createElement('div');
      rightSection.style.display = 'flex';
      rightSection.style.alignItems = 'center';

      const count = document.createElement('span');
      count.className = 'record-count';
      count.textContent = `${record.items.length} İşletme`;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Sil';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        recordToDelete = record;
        deleteMessage.textContent = `${monthName} ${record.year} kaydını silmek istediğinize emin misiniz?`;
        deletePopup.classList.remove('hidden');
      });

      rightSection.appendChild(count);
      rightSection.appendChild(deleteBtn);

      header.appendChild(title);
      header.appendChild(rightSection);

      const meta = document.createElement('div');
      meta.className = 'record-meta';

      const userRow = document.createElement('div');
      userRow.className = 'record-meta-row';
      userRow.innerHTML = `<span class="record-meta-label">Toplayan:</span> ${record.username}`;

      const dateRow = document.createElement('div');
      dateRow.className = 'record-meta-row';
      const createdDate = new Date(record.createdAt).toLocaleString('tr-TR');
      dateRow.innerHTML = `<span class="record-meta-label">Kayıt Tarihi:</span> ${createdDate}`;

      meta.appendChild(userRow);
      meta.appendChild(dateRow);

      const items = document.createElement('div');
      items.className = 'record-items';

      record.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'record-item';
        itemDiv.innerHTML = `
          <div class="record-item-name">${item.isletmeAdi}</div>
          <div class="record-item-detail">Sahip: ${item.isletmeSahibi || '—'} | Tel: ${item.telefon || '—'}</div>
          <div class="record-item-detail">Adres: ${item.adres || '—'}</div>
        `;
        items.appendChild(itemDiv);
      });

      card.appendChild(header);
      card.appendChild(meta);
      card.appendChild(items);

      card.addEventListener('click', () => {
        const alreadyExpanded = card.classList.contains('expanded');
        recordsContainer.querySelectorAll('.record-card.expanded').forEach(el => {
          if (el !== card) el.classList.remove('expanded');
        });
        if (alreadyExpanded) {
          card.classList.remove('expanded');
        } else {
          card.classList.add('expanded');
        }
      });

      recordsContainer.appendChild(card);
    });

    recordsContainer.classList.add('fade-in');
  }

  // Delete confirmation handlers
  deleteCancel.addEventListener('click', () => {
    deletePopup.classList.add('hidden');
    recordToDelete = null;
  });

  deleteConfirm.addEventListener('click', () => {
    if (recordToDelete) {
      records = records.filter(r => r.id !== recordToDelete.id);
      localStorage.setItem('toplamaKayitlari', JSON.stringify(records));
      deletePopup.classList.add('hidden');
      
      toast.textContent = 'Kayıt silindi.';
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 2000);
      
      recordToDelete = null;
      render();
    }
  });

  render();
});
