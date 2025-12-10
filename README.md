# NOVATRA V4 - Premium Project Management System

Modern, premium UI/UX ile donatılmış, tam özellikli proje yönetim platformu.

## 🚀 Özellikler

### ✨ Temel Özellikler
- **Premium UI/UX**: Modern SaaS tasarım stili (Linear + Vercel + Height karışımı)
- **Dark/Light Mode**: Tam tema desteği
- **Smooth Animations**: Framer Motion ile 200-300ms easing animasyonlar
- **Glassmorphism**: Cam efekti ve blur efektleri
- **Gradient Effects**: Hover glow ve gradient border efektleri

### 🔐 Kimlik Doğrulama
- Login & Register
- Session yönetimi (localStorage)
- Rol bazlı erişim kontrolü (Admin/User)

### 📊 Dashboard
- Toplam görevler analitik widget'ı
- Tamamlanan görevler
- Devam eden görevler
- Bekleyen görevler
- Proje listesi ve progress bar'lar

### 📁 Proje Yönetimi
- Proje oluşturma/düzenleme
- Proje detayları
- Üye yönetimi
- Activity log

### 👥 Üye Sistemi
- Email ile üye davet etme
- Otomatik kullanıcı oluşturma
- Rol seçimi (Admin/User)
- Birden fazla admin desteği
- Online status göstergeleri

### ✅ Görev Yönetimi & Kanban
- **Rol Bazlı Görev Oluşturma**:
  - Admin: Herkese görev atayabilir, tüm durumlar
  - User: Sadece kendine görev, otomatik "To Do" status
- **Drag & Drop Kanban Board**:
  - Admin: Tüm görevleri görebilir ve taşıyabilir
  - User: Sadece kendi görevlerini görebilir ve taşıyabilir
  - dnd-kit ile smooth animasyonlar
  - To Do, In Progress, Done kolonları

### 🔔 Bildirim Sistemi
- Görev atandığında bildirim
- Üye eklendi bildirimi
- Gerçek zamanlı bildirim dropdown
- Okundu/okunmadı durumu

### 📜 Aktivite Log
- Tüm proje aktivitelerini kaydetme
- Görev oluşturma/taşıma
- Üye ekleme
- Chat mesajları
- Zaman damgalı kayıtlar

### 💬 Chat Sistemi
- Simüle edilmiş gerçek zamanlı chat
- Mesaj animasyonları (slide + fade)
- Avatar ve timestamp
- localStorage persistence

### 🤖 AI Asistan
- **Hızlı İşlemler**:
  - Görev açıklaması üret
  - Sprint planı oluştur
  - Yol haritası çıkar
  - Rapor özeti
- **AI Chat**: Typing effect ile yapay zeka yanıtları

## 🛠️ Teknolojiler

- **React 18**: Modern React özellikleri
- **Vite**: Hızlı geliştirme sunucusu
- **React Router v6**: Routing
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animasyonlar
- **dnd-kit**: Drag and drop
- **Lucide React**: İkon seti
- **UUID**: Unique ID generation
- **localStorage**: Veri persistence

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

## 🎯 Kullanım

### Demo Hesap
- **Email**: admin@novatra.com
- **Şifre**: admin123
- **Rol**: Admin

### Yeni Hesap Oluşturma
1. `/register` sayfasına gidin
2. Bilgilerinizi girin
3. Admin veya User rolü seçin
4. Kayıt olun

### Proje Oluşturma
1. Dashboard'dan "Yeni Proje" butonuna tıklayın
2. Proje adı ve açıklaması girin
3. Oluştur

### Görev Yönetimi
1. Proje detaylarına gidin
2. "Görevler" sekmesine tıklayın
3. "Yeni Görev" ile görev ekleyin
4. Görevleri sürükle-bırak ile taşıyın

### Üye Ekleme (Admin Only)
1. Proje > Üyeler sayfasına gidin
2. "Üye Davet Et" butonuna tıklayın
3. Email ve rol seçin
4. Kullanıcı yoksa otomatik oluşturulur

## 🎨 Tasarım Özellikleri

### Renkler
- Primary: `#6D5EF8`
- Primary Light: `#8EA8FF`
- Background Light: `#F6F7FB`
- Background Dark: `#0E1016`

### Animasyonlar
- Fade in: 300ms
- Slide up: 300ms
- Scale in: 200ms
- Hover glow: 300ms
- Typing effect: 1.4s

### Özel Efektler
- Glassmorphism
- Gradient borders
- Hover glow
- Smooth shadows
- Animated backgrounds

## 📱 Responsive Design

Tüm sayfalar mobil, tablet ve masaüstü cihazlarda mükemmel çalışır.

## 🔒 Güvenlik

- Client-side authentication
- localStorage encryption (planning)
- Role-based access control
- Protected routes

## 📝 Lisans

MIT License

## 👨‍💻 Geliştirici

NOVATRA V4 - Premium Project Management System

---

**Not**: Bu proje demo amaçlıdır ve backend bağlantısı yoktur. Tüm veriler localStorage'da saklanır.
