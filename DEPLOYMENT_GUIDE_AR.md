# 🚀 دليل التشغيل - Bondos Ultra Social

## المتطلبات

- Docker و Docker Compose
- Node.js 18+
- MongoDB (مدرج في docker-compose)

## التشغيل السريع

### 1. باستخدام Docker (الموصى به)

```bash
# الذهاب للمشروع
cd /workspaces/bondos_ultra_social

# تشغيل جميع الخدمات
docker-compose up -d

# التحقق من الحالة
docker-compose ps
```

### 2. التشغيل المحلي (بدون Docker)

```bash
# تثبيت المتطلبات
npm install

# تثبيت متطلبات الخادم
cd server && npm install && cd ..

# تثبيت متطلبات العميل
cd client && npm install && cd ..

# تشغيل البيئة (بطاقات منفصلة)
npm run dev
```

## الوصول للموقع

- **الموقع الرئيسي**: http://localhost:80 (عبر Docker)
- **الموقع الرئيسي**: http://localhost:5173 (في التطوير)
- **API**: http://localhost:5000/api
- **MongoDB**: mongodb://admin:mongodb_password@localhost:27017

## أوامر مفيدة

```bash
# عرض السجلات
docker-compose logs -f

# إعادة تشغيل خدمة محددة
docker-compose restart bondos_backend

# إيقاف جميع الخدمات
docker-compose down

# حذف جميع البيانات
docker-compose down -v

# إعادة بناء الصور
docker-compose build --no-cache
```

## البيئة والإعدادات

### ملف .env

```
NODE_ENV=development
BACKEND_PORT=5000
MONGODB_URI=mongodb://admin:mongodb_password@mongodb:27017/?authSource=admin
JWT_ACCESS_SECRET=bondos_access_secret_key_dev_12345678901234567890
JWT_REFRESH_SECRET=bondos_refresh_secret_key_dev_12345678901234567890
CLIENT_URL=http://localhost:80
CORS_ORIGIN=http://localhost:80
```

## المسارات المتاحة

### المصادقة
- `POST /api/auth/register` - التسجيل
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/refresh` - تحديث التوكن

### المستخدمون
- `GET /api/users/search` - البحث عن مستخدمين
- `GET /api/users/:id` - الحصول على ملف شخصي
- `PUT /api/users/:id` - تحديث الملف الشخصي
- `POST /api/users/:id/follow` - متابعة مستخدم
- `POST /api/users/:id/unfollow` - إلغاء المتابعة

### المنشورات
- `GET /api/posts` - جميع المنشورات
- `POST /api/posts` - إنشاء منشور
- `GET /api/posts/trending` - المنشورات الرائجة
- `POST /api/posts/:postId/like` - إعجاب
- `POST /api/posts/:postId/comment` - تعليق

### الغرف
- `GET /api/rooms` - جميع الغرف
- `POST /api/rooms` - إنشاء غرفة
- `GET /api/rooms/:roomId` - تفاصيل الغرفة
- `POST /api/rooms/:roomId/join` - الانضمام للغرفة
- `GET /api/rooms/:roomId/messages` - رسائل الغرفة

### المجتمعات
- `GET /api/communities` - جميع المجتمعات
- `POST /api/communities` - إنشاء مجتمع
- `GET /api/communities/:communityId` - تفاصيل المجتمع
- `POST /api/communities/:communityId/join` - الانضمام
- `POST /api/communities/:communityId/leave` - المغادرة

### الألعاب
- `GET /api/games` - جميع جلسات الألعاب
- `POST /api/games/session` - إنشاء جلسة لعبة
- `GET /api/games/session/:sessionId` - تفاصيل الجلسة
- `PUT /api/games/session/:sessionId/state` - تحديث حالة اللعبة

## استكشاف الأخطاء

### المشكلة: MongoDB غير متصل
```bash
# التحقق من حالة MongoDB
docker-compose ps mongodb

# عرض السجلات
docker-compose logs mongodb
```

### المشكلة: المنافذ مشغولة
```bash
# البحث عن العمليات على المنفذ
lsof -i :5000
lsof -i :80

# إيقاف العملية
kill -9 <PID>
```

### المشكلة: خطأ في البناء
```bash
# حذف الصور القديمة
docker-compose down
docker system prune -f

# إعادة البناء
docker-compose build --no-cache
```

## معلومات الدعم

- **GitHub**: https://github.com/Fared49/bondos_ultra_social
- **البريد الإلكتروني**: karimshawky988@gmail.com
- **الإصدار**: 2.0.0
- **آخر تحديث**: 2025-12-11

---

**ملاحظة**: تأكد من أن Docker قيد التشغيل قبل محاولة تشغيل docker-compose.
