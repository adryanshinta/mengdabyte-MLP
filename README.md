# Mengdabyte — Hotspot Login Theme

Tema halaman login hotspot MikroTik dengan gaya **Clean Minimal** — putih
dominan, netral, dan lapang. Ringan, tanpa framework, tanpa CDN, **semua aset
lokal**, jadi halaman tetap tampil sempurna sebelum tamu punya akses internet.

---

## ✨ Fitur

| Fitur | Keterangan |
|---|---|
| Login Voucher / Akun | Dua mode: **Kode Voucher** (cukup 1 kolom) atau **Akun** (username + password) |
| Login CHAP & HTTP | Otomatis mendukung `http-chap` (password di-hash MD5) |
| Daftar harga | Ditulis di `js/app.js` (mudah diedit), bukan gambar |
| Cek masa aktif | Opsional, via endpoint milik Anda — gagal dengan aman |
| Trial | Tombol coba gratis otomatis (`T-$(mac)`) |
| Responsif | Desktop 2 kolom, mobile 1 kolom |
| Aksesibel | Bisa zoom, ada label, kontras tinggi |

---

## 📁 Struktur

```
mengdabyte/
├── login.html          # halaman login utama (2 kolom: form + harga)
├── status.html         # status koneksi setelah login
├── logout.html         # setelah logout
├── redirect.html       # "Kode Voucher Benar" lalu arahkan ke halaman tujuan
├── error.html          # halaman error
├── alogin.html         # redirect login (template MikroTik)
├── rlogin.html         # WISPr redirect (perangkat mobile)
├── radvert.html        # halaman iklan (advert)
├── errors.txt          # pesan error (Bahasa Indonesia)
├── errors-en.txt       # pesan error (English)
├── md5.js              # untuk login CHAP
├── css/style.css       # seluruh gaya (token warna di :root)
├── js/app.js           # KONFIGURASI + harga + cek masa aktif
├── img/logo.svg        # logo
├── img/favicon.svg     # favicon
└── fonts/Poppins-Regular.ttf
```

---

## 🚀 Cara Pasang di MikroTik

### Cara 1 — Upload lewat WinBox / WebFig (paling mudah)
1. Buka **WinBox** → menu **Files**.
2. Masuk ke folder `hotspot/` (buat bila belum ada).
3. Seret **semua file & folder** dari `mengdabyte/` ke sana, dengan struktur
   tetap (folder `css`, `js`, `img`, `fonts` ikut).
4. Buka **IP → Hotspot → Server Profiles** → pilih profile hotspot Anda.
5. Set **HTML Directory** ke nama folder tempat Anda menaruh file
   (misal `hotspot`).
6. Klik **OK**, lalu logout/refresh halaman hotspot untuk melihat hasilnya.

### Cara 2 — Lewat FTP
```
ftp <ip-router>
> put -r mengdabyte/* hotspot/
```
Lalu set HTML Directory pada profile hotspot seperti langkah 5 di atas.

### ⚠️ Penting setelah upload
- Pastikan **HTML Directory** di profile hotspot menunjuk ke folder yang benar.
- Nama file harus **persis**: `login.html`, `status.html`, `logout.html`,
  `error.html`, `redirect.html`, `alogin.html`, `rlogin.html`, `radvert.html`.
- File `errors.txt` dipakai router untuk pesan error berbahasa Indonesia.
- Jika Anda mengubah `errors.txt`, **restart** hotspot / reboot router agar terbaca.

---

## ⚙️ Kustomisasi

### 1. Teks footer
Footer saat ini menampilkan `© 2026 Mengdabyte` (tahun otomatis mengikuti
tahun berjalan). Ingin menambah teks? Cari baris footer di `login.html`,
`status.html`, `logout.html`, `redirect.html`, dan `error.html`, lalu tambahkan
setelah `Mengdabyte`:

```html
&copy; <span id="year">2026</span> Mengdabyte &middot; WiFi Cepat &amp; Stabil
```

### 2. Mode login (voucher vs akun)
Halaman login punya dua tab:

- **Kode Voucher** (default) — pengguna cukup mengisi kode voucher.
  Kode dikirim sebagai `username` **dan** `password` sekaligus, karena di
  Mikhmon user = password. Ubah perilaku ini di `login.html` pada fungsi
  `submitVoucher()`.
- **Akun** — pengguna mengisi Username dan Password (fungsi `submitAkun()`).

Kedua mode otomatis mendukung `http-chap` (password di-hash MD5) bila aktif.
Ingin menyembunyikan salah satu tab? Hapus tombol `<button class="tab" ...>`
dan panel `<div class="panel" ...>` yang tidak diinginkan di `login.html`.

### 3. Nama & daftar harga
Edit `js/app.js`, bagian paling atas:

```js
var config = {
  name: 'Mengdabyte',
  packages: [
    { name: 'Voucher 1 Jam',  price: 'Rp 2.000',  note: 'Cocok untuk cek email' },
    { name: 'Voucher 1 Hari', price: 'Rp 5.000',  note: 'Unlimited' },
    // tambah / kurangi sesuai kebutuhan
  ],
  ...
};
```
Kosongkan `packages: []` bila tidak ingin menampilkan tabel harga
(kolom kanan otomatis hilang).

### 4. Warna / tema
Semua warna ada di `css/style.css` pada blok `:root`:

```css
:root {
  --bg:      #ffffff;   /* latar kartu        */
  --bg-soft: #f7f8f9;   /* latar lembut       */
  --ink:     #111318;   /* teks utama         */
  --muted:   #757a85;   /* teks sekunder      */
  --primary: #111318;   /* tombol utama       */
  --radius:  18px;      /* sudut membulat     */
}
```
Ganti `--primary` bila ingin warna tombol berbeda, misalnya
`--primary: #2563eb` untuk biru. Seluruh tema akan mengikuti.

### 5. Cek masa aktif
Isi `endpoint` dengan layanan milik Anda (yang mengembalikan status
masa aktif berdasarkan `?name=<username>`):

```js
validity: {
  enabled: true,
  endpoint: 'https://server-anda.com/status.php',
  session: 'DesaDigital',
  timeoutMs: 6000,
  unavailableText: 'Tidak tersedia'
}
```
- `enabled: false` atau `endpoint: ''` → fitur dimatikan (tidak tampil).
- Jika layanan tidak merespons, otomatis menampilkan `unavailableText`
  (tidak ada kotak putih / ikon rusak).

> **Catatan:** endpoint bawaan (`desadigital.mikhmon.online`) sudah tidak aktif.
> Ganti dengan server Anda sendiri, atau matikan fitur ini.

### 6. Logo
Ganti `img/logo.svg` (dan `img/favicon.svg`) dengan logo Anda.
Ukuran tampilan diatur di `css/style.css` (`.brand-logo`).

---

## 🧪 Sudah Diuji

Halaman dirender di Chrome (desktop 1180px & mobile 390px) dengan simulasi
variabel MikroTik:
- ✅ Tidak ada error JavaScript / resource
- ✅ Tidak ada overflow horizontal di layar ponsel
- ✅ Form login, logout, status berfungsi
- ✅ Tampilan responsif desktop & mobile

---

## 📄 Lisensi & Kredit

- **MD5** (`md5.js`): © Paul Johnston — lisensi BSD.
- **Font Poppins**: lisensi SIL Open Font License 1.1.
- Tema **Mengdabyte**: bebas Anda gunakan dan ubah untuk keperluan desa Anda.
