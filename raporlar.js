document.addEventListener('DOMContentLoaded', () => {
  const reportMonth = document.getElementById('reportMonth');
  const reportYear = document.getElementById('reportYear');
  const reportStats = document.getElementById('reportStats');
  const yearStats = document.getElementById('yearStats');
  const autoComments = document.getElementById('autoComments');

  // Yıl seçeneklerini doldur
  const now = new Date();
  const currentYear = now.getFullYear();
  for (let y = currentYear - 5; y <= currentYear + 2; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    if (y === currentYear) opt.selected = true;
    reportYear.appendChild(opt);
  }

  // Varsayılan ay/yıl
  reportMonth.value = String(now.getMonth() + 1).padStart(2, '0');
  reportYear.value = String(currentYear);

  function render() {
    const month = reportMonth.value;
    const year = reportYear.value;
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const monthName = monthNames[parseInt(month, 10) - 1];

    // Verileri al
    const all = JSON.parse(localStorage.getItem('isletmeler') || '[]');
    const toplamaKayitlari = JSON.parse(localStorage.getItem('toplamaKayitlari') || '[]');
    const sayimlar = JSON.parse(localStorage.getItem('sayimlar') || '[]');

    // Seçilen ayda kaç işletme var
    const monthStr = String(month).padStart(2, '0');
    const yearStr = String(year);
    const ayIsletmeleri = all.filter(item => {
      const created = new Date(item.createdAt);
      return created.getFullYear() <= parseInt(yearStr, 10) && (created.getMonth() + 1) <= parseInt(monthStr, 10);
    });
    const toplamIsletme = ayIsletmeleri.length;

    // Seçilen ayda kaç işletme toplanmış
    const ayKaydi = toplamaKayitlari.find(r => {
      const rMonth = String(r.month).padStart(2, '0');
      const rYear = String(r.year);
      return (rMonth === monthStr || rMonth === String(parseInt(monthStr,10))) && (rYear === yearStr || rYear === String(parseInt(yearStr,10)));
    });
    const toplananIsletme = ayKaydi ? (Array.isArray(ayKaydi.items) ? ayKaydi.items.length : 0) : 0;

    // Seçilen ayda toplam sayım
    const aySayim = sayimlar.find(s => {
      const sMonth = String(s.month).padStart(2, '0');
      const sYear = String(s.year);
      return (sMonth === monthStr || sMonth === String(parseInt(monthStr,10))) && (sYear === yearStr || sYear === String(parseInt(yearStr,10)));
    });
    const toplamSayim = aySayim ? aySayim.value : 0;

    // Yıllık aylık ortalama sayım (sadece veri girilmiş aylar)
    let toplamYilSayim = 0;
    let veriGirilenAy = 0;
    let sonAyOrtalama = null;
    let prevOrtalama = null;
    for (let m = 1; m <= 12; m++) {
      const mStr = String(m).padStart(2, '0');
      const yearStr = String(year);
      const mSayim = sayimlar.find(s => {
        const sMonth = String(s.month).padStart(2, '0');
        const sYear = String(s.year);
        return (sMonth === mStr || sMonth === String(parseInt(mStr,10))) && (sYear === yearStr || sYear === String(parseInt(yearStr,10)));
      });
      let mPara = mSayim ? mSayim.value : null;
      let mParaNum = (mPara === null || mPara === '' || mPara === '0' || mPara === 0) ? 0 : parseFloat(mPara);
      if (mParaNum > 0) {
        toplamYilSayim += mParaNum;
        veriGirilenAy++;
        sonAyOrtalama = mParaNum;
      }
    }
    let aylikOrtalamaYil = (veriGirilenAy > 0) ? (toplamYilSayim / veriGirilenAy) : null;
    // Önceki ay ortalamasını bul
    let prevMonth = String(now.getMonth()).padStart(2, '0');
    let prevYear = String(now.getFullYear());
    if (prevMonth === '00') {
      prevMonth = '12';
      prevYear = String(now.getFullYear() - 1);
    }
    const prevSayim = sayimlar.find(s => s.month === prevMonth && s.year === prevYear);
    if (prevSayim && prevSayim.value && prevSayim.value !== '0') {
      prevOrtalama = parseFloat(prevSayim.value);
    }
    // Yüzde değişim hesapla
    let ortalamaPercent = '';
    if (prevOrtalama !== null && aylikOrtalamaYil !== null) {
      if (prevOrtalama === 0 && aylikOrtalamaYil > 0) {
        ortalamaPercent = `<span class='percent percent-green'>+100%</span> `;
      } else if (prevOrtalama > 0 && aylikOrtalamaYil === 0) {
        ortalamaPercent = `<span class='percent percent-red'>-100%</span> `;
      } else if (prevOrtalama === 0 && aylikOrtalamaYil === 0) {
        ortalamaPercent = `<span class='percent'>0%</span> `;
      } else {
        const diff = aylikOrtalamaYil - prevOrtalama;
        const pct = Math.round((diff / prevOrtalama) * 100);
        if (pct > 0) ortalamaPercent = `<span class='percent percent-green'>+${pct}%</span> `;
        else if (pct < 0) ortalamaPercent = `<span class='percent percent-red'>${pct}%</span> `;
        else ortalamaPercent = `<span class='percent'>0%</span> `;
      }
    }
    // Ayrı kutucuk olarak ekle
    const aylikOrtalamaYilBox = document.getElementById('aylikOrtalamaYilBox');
    if (aylikOrtalamaYilBox) {
      aylikOrtalamaYilBox.innerHTML = `<div class="report-stat-row" style="margin:16px 0 0 0;background:#f7f7f7;border-radius:8px;padding:12px 0;text-align:center;"><span class="report-stat-label" style="font-size:15px;font-weight:700;">Yıla Göre Aylık Ortalama</span><span class="report-stat-value" style="font-size:15px;margin-left:12px;">${ortalamaPercent}${aylikOrtalamaYil !== null ? aylikOrtalamaYil.toFixed(2) + ' ₺' : ''}</span></div>`;
    }

    // Yıllık istatistikler
    // Her ay için işletme ve sayım
    let yearKumbaraRows = '';
    let yearParaRows = '';
    let prevKumbara = null;
    let prevPara = null;
    for (let m = 1; m <= 12; m++) {
      const mStr = String(m).padStart(2, '0');
      const mName = monthNames[m-1];
      const mIsletmeleri = all.filter(item => {
        const created = new Date(item.createdAt);
        return created.getFullYear() <= parseInt(year, 10) && (created.getMonth() + 1) <= m;
      });
      let mKumbara = mIsletmeleri.length;
      const isFuture = (parseInt(year, 10) > now.getFullYear()) || (parseInt(year, 10) === now.getFullYear() && m > (now.getMonth() + 1));
      // Yüzde değişim hesapla
      let kumbaraPercent = '';
      if (prevKumbara !== null && !isFuture) {
        if (prevKumbara == 0 && mKumbara > 0) {
          kumbaraPercent = `<span class='percent percent-green'>+100%</span> `;
        } else if (prevKumbara > 0 && mKumbara == 0) {
          kumbaraPercent = `<span class='percent percent-red'>-100%</span> `;
        } else if (prevKumbara == 0 && mKumbara == 0) {
          kumbaraPercent = `<span class='percent'>0%</span> `;
        } else {
          const diff = mKumbara - prevKumbara;
          const pct = Math.round((diff / prevKumbara) * 100);
          if (pct > 0) kumbaraPercent = `<span class='percent percent-green'>+${pct}%</span> `;
          else if (pct < 0) kumbaraPercent = `<span class='percent percent-red'>${pct}%</span> `;
          else kumbaraPercent = `<span class='percent'>0%</span> `;
        }
      }
      yearKumbaraRows += `<div class="year-stat-row"><span class="year-stat-label">${mName}</span><span class="year-stat-value">${isFuture ? 'Veri yok' : (kumbaraPercent + (mKumbara === 0 ? '' : mKumbara))}</span></div>`;
      prevKumbara = isFuture ? prevKumbara : mKumbara;
      const mSayim = sayimlar.find(s => s.month === mStr && s.year === year);
      let mPara = mSayim ? mSayim.value : null;
      // Yüzde değişim hesapla
      let paraPercent = '';
      let mParaNum = (mPara === null || mPara === '' || mPara === '0' || mPara === 0) ? 0 : parseFloat(mPara);
      let prevParaNum = (prevPara === null || prevPara === '' || prevPara === '0' || prevPara === 0) ? 0 : parseFloat(prevPara);
      if (prevPara !== null && !isFuture) {
        if (prevParaNum == 0 && mParaNum > 0) {
          paraPercent = `<span class='percent percent-green'>+100%</span> `;
        } else if (prevParaNum > 0 && mParaNum == 0) {
          paraPercent = `<span class='percent percent-red'>-100%</span> `;
        } else if (prevParaNum == 0 && mParaNum == 0) {
          paraPercent = `<span class='percent'>0%</span> `;
        } else {
          const diff = mParaNum - prevParaNum;
          const pct = Math.round((diff / prevParaNum) * 100);
          if (pct > 0) paraPercent = `<span class='percent percent-green'>+${pct}%</span> `;
          else if (pct < 0) paraPercent = `<span class='percent percent-red'>${pct}%</span> `;
          else paraPercent = `<span class='percent'>0%</span> `;
        }
      }
      yearParaRows += `<div class="year-stat-row"><span class="year-stat-label">${mName}</span><span class="year-stat-value">${isFuture ? 'Veri yok' : (paraPercent + (mParaNum === 0 ? '' : mParaNum + ' ₺'))}</span></div>`;
      prevPara = isFuture ? prevPara : mParaNum;
    }
    let yearOrtalamaRows = '';
    let prevOrtalamaAy = null;
    for (let m = 1; m <= 12; m++) {
      const mStr = String(m).padStart(2, '0');
      const yearStr = String(year);
      const mName = monthNames[m-1];
      // Toplanan kumbaralar
      const mKaydi = toplamaKayitlari.find(r => {
        const rMonth = String(r.month).padStart(2, '0');
        const rYear = String(r.year);
        return (rMonth === mStr || rMonth === String(parseInt(mStr,10))) && (rYear === yearStr || rYear === String(parseInt(yearStr,10)));
      });
      const mToplanan = mKaydi ? (Array.isArray(mKaydi.items) ? mKaydi.items.length : 0) : 0;
      // Toplam sayım
      const mSayim = sayimlar.find(s => {
        const sMonth = String(s.month).padStart(2, '0');
        const sYear = String(s.year);
        return (sMonth === mStr || sMonth === String(parseInt(mStr,10))) && (sYear === yearStr || sYear === String(parseInt(yearStr,10)));
      });
      let mPara = mSayim ? mSayim.value : null;
      const isFuture = (parseInt(year, 10) > now.getFullYear()) || (parseInt(year, 10) === now.getFullYear() && m > (now.getMonth() + 1));
      let ortalama = '';
      let mParaNum = (mPara === null || mPara === '' || mPara === '0' || mPara === 0) ? 0 : parseFloat(mPara);
      let ortalamaNum = 0;
      if (!isFuture && mToplanan > 0 && mParaNum > 0) {
        ortalamaNum = mParaNum / mToplanan;
        ortalama = ortalamaNum.toFixed(2) + ' ₺';
      }
      // Yüzde değişim hesapla
      let ortalamaPercent = '';
      if (prevOrtalamaAy !== null && !isFuture) {
        if (prevOrtalamaAy == 0 && ortalamaNum > 0) {
          ortalamaPercent = `<span class='percent percent-green'>+100%</span> `;
        } else if (prevOrtalamaAy > 0 && ortalamaNum == 0) {
          ortalamaPercent = `<span class='percent percent-red'>-100%</span> `;
        } else if (prevOrtalamaAy == 0 && ortalamaNum == 0) {
          ortalamaPercent = `<span class='percent'>0%</span> `;
        } else {
          const diff = ortalamaNum - prevOrtalamaAy;
          const pct = Math.round((diff / prevOrtalamaAy) * 100);
          if (pct > 0) ortalamaPercent = `<span class='percent percent-green'>+${pct}%</span> `;
          else if (pct < 0) ortalamaPercent = `<span class='percent percent-red'>${pct}%</span> `;
          else ortalamaPercent = `<span class='percent'>0%</span> `;
        }
      }
      yearOrtalamaRows += `<div class="year-stat-row"><span class="year-stat-label">${mName}</span><span class="year-stat-value">${isFuture ? 'Veri yok' : (ortalamaPercent + ortalama)}</span></div>`;
      prevOrtalamaAy = isFuture ? prevOrtalamaAy : ortalamaNum;
    }
    yearStats.innerHTML = `
      <div class="year-stat-title">Bu Yılın Kumbara Sayısı</div>
      <div class="year-stat-list">${yearKumbaraRows}</div>
      <div class="year-stat-title" style="margin-top:16px;">Bu Yıl Çıkan Para</div>
      <div class="year-stat-list">${yearParaRows}</div>
      <div class="year-stat-title" style="margin-top:16px;">Kumbara Başına Ortalama</div>
      <div class="year-stat-list">${yearOrtalamaRows}</div>
    `;

  }

  reportMonth.addEventListener('change', render);
  reportYear.addEventListener('change', render);

  render();
});

// Admin verilerini sıfırlama fonksiyonu
function resetAdminData() {
  localStorage.removeItem('isletmeler');
  localStorage.removeItem('toplamaKayitlari');
  localStorage.removeItem('sayimlar');
  location.reload();
}
