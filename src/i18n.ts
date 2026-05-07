import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "dashboard": {
        "greeting": "Good Morning",
        "greeting_afternoon": "Good Afternoon",
        "greeting_evening": "Good Evening",
        "remaining": "Remaining Balance",
        "left": "LEFT",
        "over": "OVER LIMIT",
        "intelligence": "Nutritional Intelligence",
        "journey": "Weight Journey",
        "stats": "Stats",
        "coach": "AI Coach",
        "today": "Today",
        "weekly": "Weekly",
        "profile": "Profile",
        "achievements": "Achievements",
        "timeline": "Daily Timeline",
        "stats_description": "Ready to hit your nutritional goals today?"
      },
      "actions": {
        "add_entry": "Add Entry",
        "log_photo": "Log via Photo",
        "scan": "Scan Barcode",
        "save": "Save",
        "cancel": "Cancel",
        "edit": "Edit",
        "delete": "Delete",
        "share": "Share Progress",
        "sign_out": "Sign Out"
      },
      "food": {
        "breakfast": "Breakfast",
        "lunch": "Lunch",
        "dinner": "Dinner",
        "snacks": "Snacks",
        "calories": "Calories",
        "protein": "Protein",
        "carbs": "Carbs",
        "fat": "Fat"
      },
      "ramadan": {
        "mode": "Ramadan Mode",
        "description": "Auto-sync fasting with prayer times",
        "blessed": "Blessed Month",
        "time_remaining": "Time remaining",
        "wisdom": "Sunnah Wisdom"
      },
      "fasting": {
        "tracker": "Fasting Tracker",
        "active": "Active Fast",
        "target": "Target",
        "elapsed": "Elapsed",
        "start": "Start Fasting",
        "end": "End Fast",
        "protocol": "Protocol"
      },
      "advisor": {
        "title": "AI Meal Advisor",
        "subtitle": "Smart Recommendations",
        "get_advice": "Get Advice",
        "clear": "Clear Suggestions",
        "empty": "Tap 'Get Advice' to see what you should eat to hit your daily macro targets."
      },
      "coach": {
        "title": "NutriChat AI",
        "active": "Active Coach",
        "placeholder": "Ask anything about your diet...",
        "welcome": "Marhaba! I'm your AI Nutrition Coach. How can I help you today?"
      },
      "hydration": {
        "title": "Hydration",
        "subtitle": "Daily Intake"
      }
    }
  },
  ar: {
    translation: {
      "dashboard": {
        "greeting": "صباح الخير",
        "greeting_afternoon": "طاب مساؤك",
        "greeting_evening": "مساء الخير",
        "remaining": "الرصيد المتبقي",
        "left": "متبقي",
        "over": "تجاوز الحد",
        "intelligence": "الذكاء الغذائي",
        "journey": "رحلة الوزن",
        "stats": "الإحصائيات",
        "coach": "مدرب الذكاء الاصطناعي",
        "today": "اليوم",
        "weekly": "الأسبوعي",
        "profile": "الملف الشخصي",
        "achievements": "الإنجازات",
        "timeline": "الجدول اليومي",
        "stats_description": "هل أنت مستعد لتحقيق أهدافك الغذائية اليوم؟"
      },
      "actions": {
        "add_entry": "إضافة وجبة",
        "log_photo": "تسجيل بالصورة",
        "scan": "مسح الباركود",
        "save": "حفظ",
        "cancel": "إلغاء",
        "edit": "تعديل",
        "delete": "حذف",
        "share": "مشاركة التقدم",
        "sign_out": "تسجيل الخروج"
      },
      "food": {
        "breakfast": "الفطور",
        "lunch": "الغداء",
        "dinner": "العشاء",
        "snacks": "سناك",
        "calories": "سعرة حرارية",
        "protein": "بروتين",
        "carbs": "كربوهيدرات",
        "fat": "دهون"
      },
      "ramadan": {
        "mode": "وضع رمضان",
        "description": "مزامنة الصيام مع مواقيت الصلاة",
        "blessed": "الشهر المبارك",
        "time_remaining": "الوقت المتبقي",
        "wisdom": "من الهدي النبوي"
      },
      "fasting": {
        "tracker": "متابع الصيام",
        "active": "صيام نشط",
        "target": "الهدف",
        "elapsed": "الوقت المنقضي",
        "start": "ابدأ الصيام",
        "end": "إنهاء الصيام",
        "protocol": "النظام"
      },
      "advisor": {
        "title": "مستشار الوجبات الذكي",
        "subtitle": "توصيات ذكية",
        "get_advice": "احصل على نصيحة",
        "clear": "مسح التوصيات",
        "empty": "اضغط على 'احصل على نصيحة' لمعرفة ما يجب تناوله لتحقيق أهدافك الغذائية."
      },
      "coach": {
        "title": "نوتري تشات AI",
        "active": "المدرب النشط",
        "placeholder": "اسأل أي شيء عن نظامك الغذائي...",
        "welcome": "مرحباً! أنا مدرب التغذية الخاص بك. كيف يمكنني مساعدتك اليوم؟"
      },
      "hydration": {
        "title": "شرب الماء",
        "subtitle": "الاستهلاك اليومي"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
