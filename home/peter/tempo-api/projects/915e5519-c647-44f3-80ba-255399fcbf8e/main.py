import sys
import os
import time
from PyQt5.QtWidgets import QApplication, QSplashScreen
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QPixmap

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

def main():
    """الدالة الرئيسية للتطبيق"""
    # إنشاء تطبيق PyQt
    app = QApplication(sys.argv)
    app.setApplicationName("ProMouseTuner")
    
    # إنشاء المجلدات اللازمة
    create_app_folders()
    
    # إنشاء النافذة الرئيسية
    window = MainWindow()
    window.show()
    
    # تشغيل حلقة التطبيق
    sys.exit(app.exec_())

if __name__ == '__main__':
    main()