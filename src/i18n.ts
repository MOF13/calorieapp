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
        "profile": "Profile"
      },
      "actions": {
        "add_entry": "Add Entry",
        "log_photo": "Log via Photo",
        "scan": "Scan Barcode",
        "save": "Save",
        "cancel": "Cancel",
        "edit": "Edit",
        "delete": "Delete"
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
        "profile": "الملف الشخصي"
      },
      "actions": {
        "add_entry": "إضافة وجبة",
        "log_photo": "تسجيل بالصورة",
        "scan": "مسح الباركود",
        "save": "حفظ",
        "cancel": "إلغاء",
        "edit": "تعديل",
        "delete": "حذف"
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
