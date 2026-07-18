# إعداد سريع - Telegram Integration Quick Start

## 1️⃣ إنشاء البوت (3 دقائق)

```
Telegram → البحث عن @BotFather →
/start →
/newbot →
أدخل الاسم والمعرّف →
احصل على TOKEN ✅
```

## 2️⃣ الحصول على Chat ID (2 دقائق)

افتح في المتصفح (استبدل TOKEN):
```
https://api.telegram.org/botTOKEN/getUpdates
```

أرسل رسالة للبوت → أعد تحميل → انسخ Chat ID ✅

## 3️⃣ ربط التطبيق (1 دقيقة)

أنشئ ملف `.env.local` في جذر المشروع:

```env
VITE_TELEGRAM_BOT_TOKEN=token_here
VITE_TELEGRAM_CHAT_ID=chat_id_here
```

## 4️⃣ اختبر! (2 دقائق)

```bash
pnpm dev
```

→ ملأ النموذج
→ أكّد العملية  
→ تحقق من Telegram ✅

---

## المشاكل الشائعة

| المشكلة | الحل |
|--------|------|
| لا توجد رسائل | تحقق من Token و Chat ID |
| "configuration is missing" | أضف `.env.local` |
| لم تتم مشاركة البيانات | تحقق من الاتصال بالإنترنت |

---

## اللمسات الأخيرة

✅ `git add .gitignore` (تأكد أن `.env.local` محظور)
✅ في الإنتاج، استخدم Vercel Environment Variables
✅ لا تشارك Bot Token مع أحد

---

للدليل الكامل: `TELEGRAM_SETUP.md`
