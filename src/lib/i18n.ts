// Internationalization utility for Mouse Aim Trainer

export type Language = "en" | "ar";

export interface Translations {
  [key: string]: string;
}

export interface LanguageData {
  name: string;
  direction: "ltr" | "rtl";
  translations: Translations;
}

export const languages: Record<Language, LanguageData> = {
  en: {
    name: "English",
    direction: "ltr",
    translations: {
      // Main Menu
      "app.title": "Mouse Aim Trainer",
      "menu.startTraining": "Start Training",
      "menu.viewStatistics": "View Statistics",
      "menu.adjustSettings": "Adjust Settings",
      "menu.improvePrecision": "Improve your precision and reaction time",

      // Difficulty Selector
      "difficulty.title": "Select Difficulty",
      "difficulty.description":
        "Choose a preset difficulty level or customize your training session.",
      "difficulty.presets": "Presets",
      "difficulty.custom": "Custom",
      "difficulty.easy": "Easy",
      "difficulty.medium": "Medium",
      "difficulty.hard": "Hard",
      "difficulty.beginner": "Beginner",
      "difficulty.intermediate": "Intermediate",
      "difficulty.advanced": "Advanced",
      "difficulty.targetSize": "Target Size",
      "difficulty.targetSpeed": "Target Speed",
      "difficulty.targetCount": "Number of Targets",
      "difficulty.duration": "Session Duration (seconds)",
      "difficulty.cancel": "Cancel",
      "difficulty.startTraining": "Start Training",

      // Training Area
      "training.time": "Time",
      "training.hits": "Hits",
      "training.misses": "Misses",
      "training.accuracy": "Accuracy",
      "training.resume": "Resume",
      "training.pause": "Pause",
      "training.reset": "Reset",
      "training.settings": "Settings",
      "training.title": "Aim Training",
      "training.clickToStart": "Click anywhere to start",
      "training.paused": "Paused",
      "training.sessionDuration": "Session Duration (seconds)",
      "training.targetCount": "Target Count",
      "training.targetSize": "Target Size",
      "training.targetSpeed": "Target Speed",
      "training.applyReset": "Apply & Reset",

      // Results Screen
      "results.title": "Training Session Results",
      "results.description":
        "Great job! Here's how you performed in your training session.",
      "results.accuracy": "Accuracy",
      "results.targetsHitPercentage": "Targets hit percentage",
      "results.reactionTime": "Reaction Time",
      "results.averageResponseTime": "Average response time",
      "results.clicksPerMinute": "Clicks Per Minute",
      "results.yourClickingSpeed": "Your clicking speed",
      "results.targetsHit": "Targets Hit",
      "results.sessionDuration": "Session Duration",
      "results.minutes": "minutes",
      "results.backToMenu": "Back to Menu",
      "results.shareResults": "Share Results",
      "results.tryAgain": "Try Again",

      // Mouse Settings
      "settings.title": "ProMouseTuner Settings",
      "settings.description":
        "Configure your mouse settings for optimal precision and performance.",
      "settings.general": "General",
      "settings.advanced": "Advanced",
      "settings.profiles": "Profiles",
      "settings.device": "Device",
      "settings.tips": "Tips",
      "settings.mouseSensitivity": "Mouse Sensitivity",
      "settings.sensitivityDescription":
        "Adjust how responsive your mouse cursor is to physical movement.",
      "settings.dpi": "DPI (Dots Per Inch)",
      "settings.detectDPI": "Detect DPI",
      "settings.detecting": "Detecting...",
      "settings.dpiDescription":
        "Higher DPI means faster cursor movement for the same physical distance.",
      "settings.mouseAcceleration": "Mouse Acceleration",
      "settings.accelerationDescription":
        "When enabled, faster physical movements result in proportionally greater cursor distance.",
      "settings.pollingRate": "Polling Rate (Hz)",
      "settings.pollingRateDescription":
        "How frequently your mouse reports its position to your computer.",
      "settings.pointerSmoothing": "Pointer Smoothing",
      "settings.smoothingDescription":
        "Higher values make cursor movement smoother but may introduce latency.",
      "settings.currentProfile": "Current Profile",
      "settings.saveProfile": "Save Current Settings as New Profile",
      "settings.importProfile": "Import Profile",
      "settings.detectedMouse": "Detected Mouse",
      "settings.refresh": "Refresh",
      "settings.name": "Name",
      "settings.manufacturer": "Manufacturer",
      "settings.buttons": "Buttons",
      "settings.connection": "Connection",
      "settings.wireless": "Wireless",
      "settings.wired": "Wired",
      "settings.unknown": "Unknown",
      "settings.detectionNote":
        "Note: Some information may be estimated as browsers have limited access to hardware details.",
      "settings.noDeviceDetected": "No mouse device detected",
      "settings.detectNow": "Detect Now",
      "settings.selectMouseModel": "Select Known Mouse Model",
      "settings.chooseModel": "Choose a mouse model",
      "settings.modelSelectionNote":
        "Selecting a model will automatically set DPI and polling rate to manufacturer defaults.",
      "settings.resetToDefaults": "Reset to Defaults",
      "settings.cancel": "Cancel",
      "settings.saveSettings": "Save Settings",

      // Recommendations
      "recommendations.title": "Recommendations",
      "recommendations.description":
        "Personalized tips to improve your performance",
      "recommendations.empty": "No recommendations available yet",
      "recommendations.emptyDescription":
        "Complete a training session to get personalized tips",
    },
  },
  ar: {
    name: "العربية",
    direction: "rtl",
    translations: {
      // Main Menu
      "app.title": "مدرب دقة الماوس",
      "menu.startTraining": "بدء التدريب",
      "menu.viewStatistics": "عرض الإحصائيات",
      "menu.adjustSettings": "ضبط الإعدادات",
      "menu.improvePrecision": "تحسين الدقة وسرعة الاستجابة",

      // Difficulty Selector
      "difficulty.title": "اختر مستوى الصعوبة",
      "difficulty.description":
        "اختر مستوى صعوبة محدد مسبقًا أو خصص جلسة التدريب الخاصة بك.",
      "difficulty.presets": "الإعدادات المسبقة",
      "difficulty.custom": "مخصص",
      "difficulty.easy": "سهل",
      "difficulty.medium": "متوسط",
      "difficulty.hard": "صعب",
      "difficulty.beginner": "مبتدئ",
      "difficulty.intermediate": "متوسط",
      "difficulty.advanced": "متقدم",
      "difficulty.targetSize": "حجم الهدف",
      "difficulty.targetSpeed": "سرعة الهدف",
      "difficulty.targetCount": "عدد الأهداف",
      "difficulty.duration": "مدة الجلسة (بالثواني)",
      "difficulty.cancel": "إلغاء",
      "difficulty.startTraining": "بدء التدريب",

      // Training Area
      "training.time": "الوقت",
      "training.hits": "الإصابات",
      "training.misses": "الإخفاقات",
      "training.accuracy": "الدقة",
      "training.resume": "استئناف",
      "training.pause": "إيقاف مؤقت",
      "training.reset": "إعادة ضبط",
      "training.settings": "الإعدادات",
      "training.title": "تدريب التصويب",
      "training.clickToStart": "انقر في أي مكان للبدء",
      "training.paused": "متوقف مؤقتًا",
      "training.sessionDuration": "مدة الجلسة (بالثواني)",
      "training.targetCount": "عدد الأهداف",
      "training.targetSize": "حجم الهدف",
      "training.targetSpeed": "سرعة الهدف",
      "training.applyReset": "تطبيق وإعادة ضبط",

      // Results Screen
      "results.title": "نتائج جلسة التدريب",
      "results.description": "عمل رائع! إليك كيف كان أداؤك في جلسة التدريب.",
      "results.accuracy": "الدقة",
      "results.targetsHitPercentage": "نسبة إصابة الأهداف",
      "results.reactionTime": "وقت رد الفعل",
      "results.averageResponseTime": "متوسط وقت الاستجابة",
      "results.clicksPerMinute": "النقرات في الدقيقة",
      "results.yourClickingSpeed": "سرعة النقر لديك",
      "results.targetsHit": "الأهداف المصابة",
      "results.sessionDuration": "مدة الجلسة",
      "results.minutes": "دقائق",
      "results.backToMenu": "العودة إلى القائمة",
      "results.shareResults": "مشاركة النتائج",
      "results.tryAgain": "المحاولة مرة أخرى",

      // Mouse Settings
      "settings.title": "إعدادات ضبط الماوس",
      "settings.description":
        "قم بتكوين إعدادات الماوس للحصول على أفضل دقة وأداء.",
      "settings.general": "عام",
      "settings.advanced": "متقدم",
      "settings.profiles": "الملفات الشخصية",
      "settings.device": "الجهاز",
      "settings.tips": "نصائح",
      "settings.mouseSensitivity": "حساسية الماوس",
      "settings.sensitivityDescription":
        "ضبط مدى استجابة مؤشر الماوس للحركة الفعلية.",
      "settings.dpi": "DPI (نقطة في البوصة)",
      "settings.detectDPI": "اكتشاف DPI",
      "settings.detecting": "جاري الاكتشاف...",
      "settings.dpiDescription":
        "DPI الأعلى يعني حركة أسرع للمؤشر لنفس المسافة الفعلية.",
      "settings.mouseAcceleration": "تسارع الماوس",
      "settings.accelerationDescription":
        "عند التمكين، تؤدي الحركات الفعلية الأسرع إلى مسافة أكبر للمؤشر.",
      "settings.pollingRate": "معدل الاستطلاع (هرتز)",
      "settings.pollingRateDescription":
        "مدى تكرار إبلاغ الماوس عن موضعه للكمبيوتر.",
      "settings.pointerSmoothing": "تنعيم المؤشر",
      "settings.smoothingDescription":
        "القيم الأعلى تجعل حركة المؤشر أكثر سلاسة ولكن قد تؤدي إلى تأخير.",
      "settings.currentProfile": "الملف الشخصي الحالي",
      "settings.saveProfile": "حفظ الإعدادات الحالية كملف شخصي جديد",
      "settings.importProfile": "استيراد ملف شخصي",
      "settings.detectedMouse": "الماوس المكتشف",
      "settings.refresh": "تحديث",
      "settings.name": "الاسم",
      "settings.manufacturer": "الشركة المصنعة",
      "settings.buttons": "الأزرار",
      "settings.connection": "الاتصال",
      "settings.wireless": "لاسلكي",
      "settings.wired": "سلكي",
      "settings.unknown": "غير معروف",
      "settings.detectionNote":
        "ملاحظة: قد يتم تقدير بعض المعلومات حيث أن المتصفحات لديها وصول محدود إلى تفاصيل الأجهزة.",
      "settings.noDeviceDetected": "لم يتم اكتشاف أي ماوس",
      "settings.detectNow": "اكتشاف الآن",
      "settings.selectMouseModel": "اختر طراز ماوس معروف",
      "settings.chooseModel": "اختر طراز ماوس",
      "settings.modelSelectionNote":
        "سيؤدي اختيار طراز إلى تعيين DPI ومعدل الاستطلاع تلقائيًا إلى الإعدادات الافتراضية للشركة المصنعة.",
      "settings.resetToDefaults": "إعادة التعيين إلى الافتراضي",
      "settings.cancel": "إلغاء",
      "settings.saveSettings": "حفظ الإعدادات",

      // Recommendations
      "recommendations.title": "التوصيات",
      "recommendations.description": "نصائح مخصصة لتحسين أدائك",
      "recommendations.empty": "لا توجد توصيات متاحة حتى الآن",
      "recommendations.emptyDescription":
        "أكمل جلسة تدريب للحصول على نصائح مخصصة",
    },
  },
};

// Current language state
let currentLanguage: Language = "en";

/**
 * Get the current language code
 */
export const getCurrentLanguage = (): Language => {
  return currentLanguage;
};

/**
 * Set the current language
 */
export const setLanguage = (lang: Language): void => {
  if (languages[lang]) {
    currentLanguage = lang;
    // Update document direction for RTL support
    document.documentElement.dir = languages[lang].direction;
    document.documentElement.lang = lang;

    // Dispatch a custom event that components can listen for
    window.dispatchEvent(
      new CustomEvent("languagechange", { detail: { language: lang } }),
    );
  }
};

/**
 * Translate a key to the current language
 */
export const t = (
  key: string,
  placeholders: Record<string, string> = {},
): string => {
  const translations = languages[currentLanguage].translations;
  let text = translations[key] || languages.en.translations[key] || key;

  // Replace placeholders
  Object.entries(placeholders).forEach(([placeholder, value]) => {
    text = text.replace(new RegExp(`\\{${placeholder}\\}`, "g"), value);
  });

  return text;
};

// Initialize language based on browser settings or localStorage
export const initializeLanguage = (): void => {
  // Try to get language from localStorage
  const savedLanguage = localStorage.getItem("language") as Language;
  if (savedLanguage && languages[savedLanguage]) {
    setLanguage(savedLanguage);
    return;
  }

  // Fall back to browser language
  const browserLang = navigator.language.split("-")[0] as Language;
  if (browserLang === "ar") {
    setLanguage("ar");
  } else {
    setLanguage("en"); // Default to English
  }
};
