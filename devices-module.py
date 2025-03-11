import os
import sys
import platform
import subprocess
import json
import re
import time
from PyQt5.QtCore import QThread, pyqtSignal, QObject, QTimer

class MouseInfo:
    """فئة لتخزين معلومات جهاز الماوس"""
    def __init__(self):
        self.device_id = ""
        self.name = "غير معروف"
        self.vendor = "غير معروف"
        self.dpi_range = []
        self.polling_rates = []
        self.buttons = 0
        self.is_wireless = False
        self.battery_level = -1  # -1 يعني غير متاح
        self.firmware_version = ""
        self.connection_type = "غير معروف"
        self.supported_features = []
        self.current_dpi = 0
        self.current_polling_rate = 0

    def to_dict(self):
        """تحويل معلومات الماوس إلى قاموس"""
        return {
            "device_id": self.device_id,
            "name": self.name,
            "vendor": self.vendor,
            "dpi_range": self.dpi_range,
            "polling_rates": self.polling_rates,
            "buttons": self.buttons,
            "is_wireless": self.is_wireless,
            "battery_level": self.battery_level,
            "firmware_version": self.firmware_version,
            "connection_type": self.connection_type,
            "supported_features": self.supported_features,
            "current_dpi": self.current_dpi,
            "current_polling_rate": self.current_polling_rate
        }

    @classmethod
    def from_dict(cls, data):
        """إنشاء كائن معلومات الماوس من قاموس"""
        mouse_info = cls()
        mouse_info.device_id = data.get("device_id", "")
        mouse_info.name = data.get("name", "غير معروف")
        mouse_info.vendor = data.get("vendor", "غير معروف")
        mouse_info.dpi_range = data.get("dpi_range", [])
        mouse_info.polling_rates = data.get("polling_rates", [])
        mouse_info.buttons = data.get("buttons", 0)
        mouse_info.is_wireless = data.get("is_wireless", False)
        mouse_info.battery_level = data.get("battery_level", -1)
        mouse_info.firmware_version = data.get("firmware_version", "")
        mouse_info.connection_type = data.get("connection_type", "غير معروف")
        mouse_info.supported_features = data.get("supported_features", [])
        mouse_info.current_dpi = data.get("current_dpi", 0)
        mouse_info.current_polling_rate = data.get("current_polling_rate", 0)
        return mouse_info


class DeviceDetector(QObject):
    """فئة للكشف عن أجهزة الماوس المتصلة"""
    # إشارات
    device_found = pyqtSignal(MouseInfo)
    device_removed = pyqtSignal(str)  # معرف الجهاز
    device_changed = pyqtSignal(MouseInfo)
    
    def __init__(self):
        super().__init__()
        self.os_type = platform.system()
        self.devices = {}  # قاموس لتخزين الأجهزة المكتشفة
        self.mouse_database = self._load_mouse_database()
        
        # إعداد مؤقت للتحديث الدوري
        self.update_timer = QTimer(self)
        self.update_timer.timeout.connect(self.refresh_devices)
    
    def _load_mouse_database(self):
        """تحميل قاعدة بيانات أجهزة الماوس المعروفة"""
        # في الإصدار الحقيقي، يمكن تحميل هذه البيانات من ملف خارجي
        # هنا نستخدم بيانات مباشرة للتبسيط
        return {
            "Logitech G Pro": {
                "vendor": "Logitech",
                "dpi_range": [100, 25600],
                "polling_rates": [125, 250, 500, 1000],
                "buttons": 8,
                "supported_features": ["DPI adjustment", "RGB lighting", "Onboard memory"]
            },
            "Razer DeathAdder V2": {
                "vendor": "Razer",
                "dpi_range": [100, 20000],
                "polling_rates": [125, 500, 1000],
                "buttons": 8,
                "supported_features": ["DPI adjustment", "RGB lighting", "Onboard memory"]
            },
            "SteelSeries Rival 3": {
                "vendor": "SteelSeries",
                "dpi_range": [100, 8500],
                "polling_rates": [125, 250, 500, 1000],
                "buttons": 6,
                "supported_features": ["DPI adjustment", "RGB lighting"]
            },
            "Glorious Model O": {
                "vendor": "Glorious",
                "dpi_range": [400, 12000],
                "polling_rates": [125, 250, 500, 1000],
                "buttons": 6,
                "supported_features": ["DPI adjustment", "RGB lighting", "Ultralight"]
            },
            "Zowie EC2": {
                "vendor": "Zowie",
                "dpi_range": [400, 3200],
                "polling_rates": [125, 500, 1000],
                "buttons": 5,
                "supported_features": ["Plug and Play", "No Software Required"]
            },
            "Logitech G502": {
                "vendor": "Logitech",
                "dpi_range": [100, 25600],
                "polling_rates": [125, 250, 500, 1000],
                "buttons": 11,
                "supported_features": ["DPI adjustment", "RGB lighting", "Adjustable weights"]
            },
        }
    
    def start_detection(self):
        """بدء عملية اكتشاف الأجهزة"""
        self.refresh_devices()
        # بدء التحديث الدوري كل 5 ثوانٍ
        self.update_timer.start(5000)
    
    def stop_detection(self):
        """إيقاف عملية اكتشاف الأجهزة"""
        self.update_timer.stop()
    
    def refresh_devices(self):
        """تحديث قائمة الأجهزة المتصلة"""
        current_devices = self._detect_connected_devices()
        current_ids = set(current_devices.keys())
        existing_ids = set(self.devices.keys())
        
        # الأجهزة الجديدة
        for device_id in current_ids - existing_ids:
            self.devices[device_id] = current_devices[device_id]
            self.device_found.emit(current_devices[device_id])
        
        # الأجهزة التي تم إزالتها
        for device_id in existing_ids - current_ids:
            del self.devices[device_id]
            self.device_removed.emit(device_id)
        
        # الأجهزة التي تم تحديثها
        for device_id in current_ids & existing_ids:
            if self._device_changed(self.devices[device_id], current_devices[device_id]):
                self.devices[device_id] = current_devices[device_id]
                self.device_changed.emit(current_devices[device_id])
    
    def _device_changed(self, old_device, new_device):
        """التحقق مما إذا كانت معلومات الجهاز قد تغيرت"""
        # هنا يمكن التحقق من التغييرات المهمة فقط، مثل مستوى البطارية أو معدل التحديث الحالي
        return (old_device.current_dpi != new_device.current_dpi or
                old_device.current_polling_rate != new_device.current_polling_rate or
                old_device.battery_level != new_device.battery_level)
    
    def _detect_connected_devices(self):
        """اكتشاف أجهزة الماوس المتصلة بناءً على نظام التشغيل"""
        detected_devices = {}
        
        if self.os_type == "Windows":
            detected_devices = self._detect_windows_devices()
        elif self.os_type == "Linux":
            detected_devices = self._detect_linux_devices()
        elif self.os_type == "Darwin":  # macOS
            detected_devices = self._detect_mac_devices()
        
        return detected_devices
    
    def _detect_windows_devices(self):
        """اكتشاف أجهزة الماوس على نظام Windows"""
        detected_devices = {}
        
        try:
            # استخدام PowerShell للحصول على قائمة الأجهزة
            cmd = "powershell \"Get-PnpDevice -Class Mouse -PresentOnly | Select-Object InstanceId, FriendlyName | ConvertTo-Json\""
            result = subprocess.run(cmd, capture_output=True, text=True, shell=True)
            
            if result.returncode == 0 and result.stdout.strip():
                devices_data = json.loads(result.stdout)
                
                # التأكد من أن البيانات في شكل قائمة
                if not isinstance(devices_data, list):
                    devices_data = [devices_data]
                
                for device in devices_data:
                    mouse_info = MouseInfo()
                    
                    device_id = device.get("InstanceId", "")
                    friendly_name = device.get("FriendlyName", "غير معروف")
                    
                    mouse_info.device_id = device_id
                    mouse_info.name = friendly_name
                    
                    # محاولة مطابقة الاسم مع قاعدة البيانات
                    for known_name, known_info in self.mouse_database.items():
                        if known_name.lower() in friendly_name.lower():
                            mouse_info.vendor = known_info["vendor"]
                            mouse_info.dpi_range = known_info["dpi_range"]
                            mouse_info.polling_rates = known_info["polling_rates"]
                            mouse_info.buttons = known_info["buttons"]
                            mouse_info.supported_features = known_info["supported_features"]
                            break
                    
                    # إعداد بعض القيم الافتراضية إذا لم يتم العثور على معلومات
                    if not mouse_info.dpi_range:
                        mouse_info.dpi_range = [400, 1600]
                    if not mouse_info.polling_rates:
                        mouse_info.polling_rates = [125, 500, 1000]
                    
                    # إعداد القيم الحالية
                    mouse_info.current_dpi = mouse_info.dpi_range[1] // 2  # قيمة افتراضية
                    mouse_info.current_polling_rate = 1000  # قيمة افتراضية
                    
                    # التحقق من نوع الاتصال
                    if "wireless" in friendly_name.lower() or "bluetooth" in friendly_name.lower():
                        mouse_info.is_wireless = True
                        mouse_info.connection_type = "لاسلكي"
                        mouse_info.battery_level = 75  # قيمة افتراضية للعرض
                    else:
                        mouse_info.connection_type = "سلكي"
                    
                    detected_devices[device_id] = mouse_info
        
        except Exception as e:
            print(f"خطأ في اكتشاف أجهزة Windows: {e}")
        
        # اكتشاف افتراضي إذا لم يتم العثور على أي أجهزة
        if not detected_devices:
            mouse_info = MouseInfo()
            mouse_info.device_id = "default_mouse"
            mouse_info.name = "ماوس افتراضي"
            mouse_info.connection_type = "سلكي"
            mouse_info.current_dpi = 800
            mouse_info.current_polling_rate = 1000
            detected_devices["default_mouse"] = mouse_info
        
        return detected_devices
    
    def _detect_linux_devices(self):
        """اكتشاف أجهزة الماوس على نظام Linux"""
        detected_devices = {}
        
        try:
            # استخدام xinput للحصول على قائمة الأجهزة
            result = subprocess.run(["xinput", "list"], capture_output=True, text=True)
            
            if result.returncode == 0:
                lines = result.stdout.splitlines()
                
                for line in lines:
                    if "pointer" in line and "mouse" in line.lower():
                        match = re.search(r'id=(\d+)', line)
                        if match:
                            device_id = match.group(1)
                            name_match = re.search(r'↳ (.*?)\s+id=', line)
                            name = name_match.group(1) if name_match else "ماوس Linux"
                            
                            mouse_info = MouseInfo()
                            mouse_info.device_id = device_id
                            mouse_info.name = name
                            
                            # محاولة مطابقة الاسم مع قاعدة البيانات
                            for known_name, known_info in self.mouse_database.items():
                                if known_name.lower() in name.lower():
                                    mouse_info.vendor = known_info["vendor"]
                                    mouse_info.dpi_range = known_info["dpi_range"]
                                    mouse_info.polling_rates = known_info["polling_rates"]
                                    mouse_info.buttons = known_info["buttons"]
                                    mouse_info.supported_features = known_info["supported_features"]
                                    break
                            
                            # إعداد بعض القيم الافتراضية
                            if not mouse_info.dpi_range:
                                mouse_info.dpi_range = [400, 1600]
                            if not mouse_info.polling_rates:
                                mouse_info.polling_rates = [125, 500, 1000]
                            
                            mouse_info.current_dpi = mouse_info.dpi_range[1] // 2
                            mouse_info.current_polling_rate = 1000
                            
                            # التحقق من نوع الاتصال
                            if "wireless" in name.lower() or "bluetooth" in name.lower():
                                mouse_info.is_wireless = True
                                mouse_info.connection_type = "لاسلكي"
                                mouse_info.battery_level = 80  # قيمة افتراضية
                            else:
                                mouse_info.connection_type = "سلكي"
                            
                            detected_devices[device_id] = mouse_info
        
        except Exception as e:
            print(f"خطأ في اكتشاف أجهزة Linux: {e}")
        
        # اكتشاف افتراضي إذا لم يتم العثور على أي أجهزة
        if not detected_devices:
            mouse_info = MouseInfo()
            mouse_info.device_id = "default_mouse"
            mouse_info.name = "ماوس افتراضي"
            mouse_info.connection_type = "سلكي"
            mouse_info.current_dpi = 800
            mouse_info.current_polling_rate = 1000
            detected_devices["default_mouse"] = mouse_info
        
        return detected_devices
    
    def _detect_mac_devices(self):
        """اكتشاف أجهزة الماوس على نظام macOS"""
        detected_devices = {}
        
        try:
            # استخدام ioreg للحصول على قائمة الأجهزة
            cmd = "ioreg -p IOUSB -l | grep -i mouse -A10"
            result = subprocess.run(cmd, capture_output=True, text=True, shell=True)
            
            if result.returncode == 0:
                output = result.stdout
                
                # استخراج معلومات الماوس باستخدام تعبير منتظم
                mouse_sections = re.finditer(r'({.*?"USB Product Name" = "(.*?)".*?})', output, re.DOTALL)
                
                for i, section in enumerate(mouse_sections):
                    mouse_info = MouseInfo()
                    name = section.group(2)
                    device_id = f"mac_mouse_{i}"
                    
                    mouse_info.device_id = device_id
                    mouse_info.name = name
                    
                    # محاولة مطابقة الاسم مع قاعدة البيانات
                    for known_name, known_info in self.mouse_database.items():
                        if known_name.lower() in name.lower():
                            mouse_info.vendor = known_info["vendor"]
                            mouse_info.dpi_range = known_info["dpi_range"]
                            mouse_info.polling_rates = known_info["polling_rates"]
                            mouse_info.buttons = known_info["buttons"]
                            mouse_info.supported_features = known_info["supported_features"]
                            break
                    
                    # إعداد بعض القيم الافتراضية
                    if not mouse_info.dpi_range:
                        mouse_info.dpi_range = [400, 1600]
                    if not mouse_info.polling_rates:
                        mouse_info.polling_rates = [125, 500, 1000]
                    
                    mouse_info.current_dpi = mouse_info.dpi_range[1] // 2
                    mouse_info.current_polling_rate = 1000
                    
                    # التحقق من نوع الاتصال
                    if "wireless" in name.lower() or "bluetooth" in name.lower():
                        mouse_info.is_wireless = True
                        mouse_info.connection_type = "لاسلكي"
                        mouse_info.battery_level = 70  # قيمة افتراضية
                    else:
                        mouse_info.connection_type = "سلكي"
                    
                    detected_devices[device_id] = mouse_info
        
        except Exception as e:
            print(f"خطأ في اكتشاف أجهزة macOS: {e}")
        
        # اكتشاف افتراضي إذا لم يتم العثور على أي أجهزة
        if not detected_devices:
            mouse_info = MouseInfo()
            mouse_info.device_id = "default_mouse"
            mouse_info.name = "ماوس افتراضي"
            mouse_info.connection_type = "سلكي"
            mouse_info.current_dpi = 800
            mouse_info.current_polling_rate = 1000
            detected_devices["default_mouse"] = mouse_info
        
        return detected_devices
    
    def get_current_devices(self):
        """الحصول على قائمة الأجهزة الحالية"""
        return self.devices
    
    def get_device_by_id(self, device_id):
        """الحصول على معلومات جهاز معين بواسطة المعرف"""
        return self.devices.get(device_id, None)
    
    def apply_settings(self, device_id, settings):
        """تطبيق الإعدادات على جهاز ماوس محدد"""
        if device_id not in self.devices:
            return False
        
        # في النسخة الحقيقية، هنا يتم تنفيذ الأوامر الفعلية لتغيير إعدادات الماوس
        # لكن هنا نقوم فقط بتحديث القيم المخزنة محليًا لأغراض العرض
        
        mouse_info = self.devices[device_id]
        
        if "dpi" in settings:
            dpi = settings["dpi"]
            # التحقق من أن القيمة ضمن النطاق المدعوم
            if mouse_info.dpi_range and dpi >= mouse_info.dpi_range[0] and dpi <= mouse_info.dpi_range[1]:
                mouse_info.current_dpi = dpi
        
        if "polling_rate" in settings:
            polling_rate = settings["polling_rate"]
            # التحقق من أن القيمة مدعومة
            if polling_rate in mouse_info.polling_rates:
                mouse_info.current_polling_rate = polling_rate
        
        # إرسال إشارة بتغيير الجهاز
        self.device_changed.emit(mouse_info)
        
        return True


class DeviceMonitorWidget(QWidget):
    """واجهة لعرض ومراقبة أجهزة الماوس"""
    def __init__(self, device_detector, parent=None):
        super().__init__(parent)
        self.device_detector = device_detector
        self.init_ui()
        
        # ربط إشارات الكاشف
        self.device_detector.device_found.connect(self.on_device_found)
        self.device_detector.device_removed.connect(self.on_device_removed)
        self.device_detector.device_changed.connect(self.on_device_changed)
    
    def init_ui(self):
        """إعداد واجهة المستخدم"""
        # يتم تنفيذها في الفئة المشتقة
        pass
    
    def on_device_found(self, mouse_info):
        """معالجة العثور على جهاز جديد"""
        # يتم تنفيذها في الفئة المشتقة
        pass
    
    def on_device_removed(self, device_id):
        """معالجة إزالة جهاز"""
        # يتم تنفيذها في الفئة المشتقة
        pass
    
    def on_device_changed(self, mouse_info):
        """معالجة تغيير معلومات الجهاز"""
        # يتم تنفيذها في الفئة المشتقة
        pass
