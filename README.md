# Yapay Zekâ Farkındalığı Kitapçık Sitesi

Bu klasör tek başına GitHub'a eklenebilir Vite + React kitapçık uygulamasıdır.

## Yerel geliştirme

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

Bu klasörü ayrı bir GitHub repository kökü olarak kullanın. `main` branch'e push edildiğinde `.github/workflows/deploy-pages.yml` workflow'u `dist/` çıktısını GitHub Pages'e yayınlar.

Repository ayarlarında Pages kaynağı olarak **GitHub Actions** seçili olmalıdır.

## İçerik kaynağı

Uygulama içerik olarak `src/content/book.html` dosyasını kullanır. React kabuğu bu HTML'i modüllere böler, üst menü/sol navigasyon ekler, uzun promptları ve egzersizleri kapalı açılır panellere dönüştürür.
