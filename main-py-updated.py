import sys
import os
import time
import platform
from PyQt5.QtWidgets import QApplication, QSplashScreen
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtGui import QPixmap, QIcon

# استيراد الوحدات الخاصة بالتطبيق
from ui.main_window import MainWindow

def create_app_folders():
    """إنشاء المجلدات اللازمة للتطبيق"""
    # مسار إعدادات المستخدم
    user_settings_dir = os.path.expanduser("~/.mousetuner")
    
    # إنشاء المجلدات إذا لم تكن موجودة
    folders = [
        user_settings_dir,
        os.path.join(user_settings_dir, "profiles"),
        os.path.join(user_settings_dir, "logs"),
        os.path.join(user_settings_dir, "analytics"),
        os.path.join(user_settings_dir, "notifications")
    ]
    
    for folder in folders:
        if not os.path.exists(folder):
            os.makedirs(folder)

def show_splash_screen():
    """عرض شاشة البداية"""
    # إنشاء شاشة البداية من صورة
    # في الإصدار النهائي يمكنك استبدال هذا بصورة حقيقية
    pixmap = QPixmap(500, 300)
    pixmap.fill(Qt.white)
    
    splash = QSplashScreen(pixmap)
    splash.showMessage("جاري تحميل برنامج ضبط الماوس...", Qt.AlignCenter, Qt.black)
    splash.show()
    
    return splash

def main():
    """الدالة الرئيسية للتطبيق"""
    # إنشاء تطبيق PyQt
    app = QApplication(sys.argv)
    app.setApplicationName("ProMouseTuner")
    app.setOrganizationName("MouseTuner")
    
    # إنشاء المجلدات اللازمة
    create_app_folders()
    
    # عرض شاشة البداية
    splash = show_splash_screen()
    
    # مراحل تحميل التطبيق
    splash_messages = [
        "جاري تهيئة واجهة المستخدم...",
        "جاري تحميل الإعدادات...",
        "جاري اكتشاف الأجهزة المتصلة...",
        "جاري تحميل البيانات التحليلية...",
        "جاري إعداد نظام الإشعارات...",
        "اكتمل التحميل!"
    ]
    
    # تأخير صغير لعرض شاشة البداية وتحميل المراحل
    for i, message in enumerate(splash_messages):
        progress = (i + 1) * 100 // len(splash_messages)
        splash.showMessage(f"{message} ({progress}%)", Qt.AlignCenter, Qt.black)
        app.processEvents()
        time.sleep(0.4)
    
    # إنشاء النافذة الرئيسية
    window = MainWindow()
    
    # إخفاء شاشة البداية وعرض النافذة الرئيسية
    splash.finish(window)
    window.show()
    
    # تشغيل حلقة التطبيق
    sys.exit(app.exec_())

def check_system_compatibility():
    """التحقق من توافق النظام"""
    system = platform.system()
    if system == "Windows":
        version = float(platform.version().split('.')[0])
        if version < 10:
            print("تحذير: هذا البرنامج مصمم للعمل بشكل أفضل على Windows 10 أو أحدث.")
    
    memory = int(os.popen('wmic computersystem get totalphysicalmemory').read().split()[1]) // (1024**2)
    if memory < 4096:
        print("تحذير: يوصى بوجود 4 جيجابايت من الذاكرة على الأقل.")

if __name__ == '__main__':
    # التحقق من توافق النظام
    check_system_compatibility()
    
    # بدء التطبيق
    main()
