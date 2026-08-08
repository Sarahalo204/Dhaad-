# ضاد للذكاء الاصطناعي (Dhaad AI) 🌟

**منصة متكاملة لتحويل قواعد النحو العربي المعقدة إلى تجربة تفاعلية وبصرية ذكية باستخدام الذكاء الاصطناعي.**  
تم تطوير هذا المشروع كجزء من معسكر **SDA Bootcamp / LEAP**.

🔗 **رابط الموقع (Live Demo):** [https://dhaad-two.vercel.app/](https://dhaad-two.vercel.app/)

![Dhaad AI Logo](https://img.shields.io/badge/%D8%B6%D8%A7%D8%AF-Dhaad%20AI-C9A96A?style=for-the-badge&logo=dependabot)

## 🚀 المميزات الرئيسية (Features)
1. **تحليل الجملة بالذكاء الاصطناعي**: قم بإدخال أي جملة عربية، وسيقوم النظام بإعرابها وتحليل جميع كلماتها وعرضها في **شجرة تفاعلية بصرية**.
2. **التشكيل التلقائي الذكي (Auto-Tashkeel)**: اكتب أي جملة غير مشكّلة، وبضغطة زر (العصا السحرية) سيقوم النظام بفهم السياق وتشكيلها تشكيلاً دقيقاً.
3. **تحليل الأبيات الشعرية**: أداة متخصصة تأخذ بيت الشعر وتقوم باستخراج (البحر الشعري، القافية، والتقطيع العروضي) باحترافية.
4. **المعلم الذكي (AI Teacher)**: اشرح لي الإعراب! يمكنك اختيار مستوى الشرح (طفل، متوسط، متقدم، متخصص) لتبسيط النحو.
5. **شبكة علاقات الكلمات**: ابحث عن أي كلمة لاكتشاف مرادفاتها، أضدادها، جذورها، والكلمات ذات الصلة مع أمثلة.
6. **العب وتعلم وصائد الأخطاء (Gamification)**: نظام تحديات يدمج بين (املأ الفراغ) و (صائد الأخطاء النحوية) مع **عداد زمني (Timer)** لزيادة الحماس وجمع الـ XP.
7. **لوحة التقدم (Dashboard)**: لوحة شخصية تعرض مستواك، سلسلة التعلم (Streak)، وتحلل أخطاءك النحوية الشائعة.

## 🛠 التقنيات المستخدمة (Tech Stack)
### الواجهة الأمامية (Frontend)
- **Next.js 14** (App Router)
- **React Flow** (لرسم الأشجار النحوية التفاعلية)
- **Tailwind CSS & Framer Motion** (لتصميم عربي أصيل وأنيميشن سلس)
- **Zustand** (لإدارة الحالة المحلية والنقاط)

### الواجهة الخلفية (Backend)
- **FastAPI** (Python)
- **Groq LLM API** (استخدام LLaMA-3 70B لمعالجة اللغة الطبيعية بسرعة فائقة)
- **PyArabic** (للتحليل الصرفي المتقدم)

## 📂 هيكلة المشروع (Project Structure)
ينقسم المشروع إلى جزئين رئيسيين:
- `/frontend`: يحتوي على تطبيق Next.js.
- `/backend`: يحتوي على خادم FastAPI.

## 💻 تشغيل المشروع محلياً (Local Development)

### 1. تشغيل الواجهة الخلفية (Backend)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # (Windows)
# source venv/bin/activate (Mac/Linux)
pip install -r requirements.txt
```
يجب إنشاء ملف `.env` في مجلد `backend` ووضع مفتاح Groq:
```env
GROQ_API_KEY=gsk_your_api_key_here
```
ثم تشغيل الخادم:
```bash
uvicorn main:app --reload --port 8000
```

### 2. تشغيل الواجهة الأمامية (Frontend)
```bash
cd frontend
npm install
npm run dev
```
افتح `http://localhost:3000` في متصفحك وستعمل المنصة!

## 🌐 النشر (Deployment)
- **Frontend**: جاهز للنشر مباشرة على [Vercel](https://vercel.com).
- **Backend**: جاهز للعمل كـ Web Service على منصة [Render](https://render.com). لا تنس إضافة `NEXT_PUBLIC_API_URL` في Vercel لربطه برابط الـ Backend.

---
**سارة العوجان**
