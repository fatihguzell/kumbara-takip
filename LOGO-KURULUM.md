# Logo Kurulum Talimatları

## 📁 Gönderdiğiniz Logo Dosyaları

Chatbot'a gönderdiğiniz 2 logo dosyasını şu şekilde kullanacağız:

### 1. **logo-icon.png** (Sadece Kumbara İkonu - Küçük Versiyonu)
Gönderdiğiniz ikinci dosya (sadece kumbara ikonu)
- **Önerilen Boyut:** 512x512px
- **Format:** PNG (şeffaf arka plan)
- **Kullanım Yerleri:**
  - ✅ Intro sayfası (büyük logo)
  - ✅ Login sayfası (küçük ikon)
  - ✅ Ana sayfa header (mini ikon)

### 2. **logo-full.png** (Tam Logo - KUMBARATAKIP yazılı)
Gönderdiğiniz birinci dosya (tam logo)
- **Boyut:** Mevcut boyutu koruyun
- **Format:** PNG (şeffaf arka plan)
- **Kullanım Yerleri:**
  - ✅ Login sayfası (başlık logosu)

## 📝 Nasıl Eklerim?

### Adım 1: Logo Dosyalarını İndirin
Chatbot'a yüklediğiniz dosyaları bilgisayarınıza indirin.

### Adım 2: Dosyaları Yeniden Adlandırın
- Küçük kumbara ikonunu → `logo-icon.png` olarak kaydedin
- Tam logoyu → `logo-full.png` olarak kaydedin

### Adım 3: Assets Klasörüne Kopyalayın
```
kumbara-takip/
└── assets/
    ├── logo-icon.png     ← Buraya kopyalayın
    └── logo-full.png     ← Buraya kopyalayın
```

### Adım 4: Tarayıcıda Test Edin
1. `intro.html` dosyasını açın
2. Logolar otomatik olarak görünecek
3. Göründüyse tamamdır! 🎉

## 🔄 Şu Anda Geçici Placeholder Kullanılıyor

Logolarınızı ekleyene kadar, sayfalarda **turuncu kumbara SVG ikonu** görünecek.
Gerçek logolarınızı eklediğinizde otomatik olarak değişecek.

## ✅ Kontrol Listesi

- [ ] Logo dosyalarını bilgisayara indirdim
- [ ] `logo-icon.png` olarak yeniden adlandırdım
- [ ] `logo-full.png` olarak yeniden adlandırdım  
- [ ] Her iki dosyayı da `assets/` klasörüne kopyaladım
- [ ] Tarayıcıda test ettim (intro.html)

## 🎨 Renk Uyumu

Logolarınız otomatik olarak şu renk paletiyle uyumlu çalışacak:
- Ana Turuncu: #FBB03B
- İkincil Turuncu: #F7931E
- Açık Gri: #E6E6E6
- Koyu Gri: #333333

## ❓ Sık Sorulan Sorular

**S: Logolar görünmüyor?**
C: Dosya isimlerinin tam olarak `logo-icon.png` ve `logo-full.png` olduğundan emin olun (küçük harfle).

**S: Logo çok büyük/küçük görünüyor?**
C: Endişelenmeyin, CSS otomatik olarak boyutlandırıyor. Responsive tasarım sayesinde her cihazda uyumlu görünecek.

**S: Arka plan şeffaf değil?**
C: PNG dosyası şeffaf arka planlı olmalı. Photoshop, GIMP veya online araçlarla düzenleyebilirsiniz.

## 🔧 Terminal ile Hızlı Kurulum (MacOS/Linux)

Eğer logo dosyalarınız Desktop'ta ise:

```bash
cd ~/Desktop/Kumbara/kumbara-takip/assets
cp ~/Desktop/logo-kucuk.png logo-icon.png
cp ~/Desktop/logo-tam.png logo-full.png
```

Dosya isimlerini kendi dosyalarınıza göre değiştirin!
