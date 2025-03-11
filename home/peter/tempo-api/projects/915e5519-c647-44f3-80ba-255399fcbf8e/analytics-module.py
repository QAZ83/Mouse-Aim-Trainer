import os
import json
import time
import datetime
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
from PyQt5.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                           QComboBox, QPushButton, QTabWidget, QGroupBox)
from PyQt5.QtCore import Qt, QTimer


class PerformanceData:
    """فئة لإدارة وتحليل بيانات الأداء"""
    def __init__(self, settings_manager):
        self.settings_manager = settings_manager
        self.user_data_dir = os.path.expanduser("~/.mousetuner/analytics")
        
        # التأكد من وجود مجلد التحليلات
        if not os.path.exists(self.user_data_dir):
            os.makedirs(self.user_data_dir)
        
        # ملف بيانات الأداء
        self.data_file = os.path.join(self.user_data_dir, "performance_data.json")
        
        # تهيئة بيانات الأداء
        self.performance_history = self.load_performance_data()
    
    def load_performance_data(self):
        """تحميل بيانات الأداء المحفوظة"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"خطأ في تحميل بيانات الأداء: {e}")
        
        # إنشاء هيكل بيانات افتراضي إذا لم يكن الملف موجودًا
        return {
            "calibration_history": [],
            "daily_stats": {},
            "usage_patterns": {},
            "recommendations": []
        }
    
    def save_performance_data(self):
        """حفظ بيانات الأداء"""
        try:
            with open(self.data_file, 'w', encoding='utf-8') as f:
                json.dump(self.performance_history, f, ensure_ascii=False, indent=4)
            return True
        except Exception as e:
            print(f"خطأ في حفظ بيانات الأداء: {e}")
            return False
    
    def add_calibration_result(self, calibration_result):
        """إضافة نتيجة معايرة جديدة"""
        if not calibration_result:
            return
        
        # إضافة طابع زمني
        timestamp = time.time()
        date_str = datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
        
        # إنشاء سجل المعايرة
        calibration_record = {
            "timestamp": timestamp,
            "date": date_str,
            "accuracy_score": calibration_result['accuracy_score'],
            "speed_score": calibration_result['speed_score'],
            "tracking_score": calibration_result['tracking_score'],
            "overall_score": calibration_result['overall_score'],
            "response_time": calibration_result['response_time'],
            "settings": self.settings_manager.get_active_settings(),
            "recommended_settings": calibration_result['recommended_settings']
        }
        
        # إضافة السجل إلى التاريخ
        self.performance_history["calibration_history"].append(calibration_record)
        
        # تحديث إحصائيات اليوم
        day = datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
        if day not in self.performance_history["daily_stats"]:
            self.performance_history["daily_stats"][day] = {
                "calibrations": 0,
                "avg_accuracy": 0,
                "avg_speed": 0,
                "avg_tracking": 0,
                "avg_overall": 0
            }
        
        daily = self.performance_history["daily_stats"][day]
        daily["calibrations"] += 1
        daily["avg_accuracy"] = (daily["avg_accuracy"] * (daily["calibrations"] - 1) + 
                              calibration_result['accuracy_score']) / daily["calibrations"]
        daily["avg_speed"] = (daily["avg_speed"] * (daily["calibrations"] - 1) + 
                           calibration_result['speed_score']) / daily["calibrations"]
        daily["avg_tracking"] = (daily["avg_tracking"] * (daily["calibrations"] - 1) + 
                              calibration_result['tracking_score']) / daily["calibrations"]
        daily["avg_overall"] = (daily["avg_overall"] * (daily["calibrations"] - 1) + 
                             calibration_result['overall_score']) / daily["calibrations"]
        
        # تحليل نمط الاستخدام وتوليد توصيات
        self.analyze_patterns()
        
        # حفظ البيانات
        self.save_performance_data()
    
    def analyze_patterns(self):
        """تحليل أنماط الأداء وتوليد توصيات"""
        # الحصول على آخر 5 نتائج معايرة (أو أقل)
        calibrations = self.performance_history["calibration_history"]
        recent_calibrations = calibrations[-5:] if len(calibrations) >= 5 else calibrations
        
        if not recent_calibrations:
            return
        
        # تحليل اتجاهات الأداء
        accuracy_trend = self.calculate_trend([cal["accuracy_score"] for cal in recent_calibrations])
        speed_trend = self.calculate_trend([cal["speed_score"] for cal in recent_calibrations])
        tracking_trend = self.calculate_trend([cal["tracking_score"] for cal in recent_calibrations])
        
        # تخزين أنماط الاستخدام
        self.performance_history["usage_patterns"] = {
            "accuracy_trend": accuracy_trend,
            "speed_trend": speed_trend,
            "tracking_trend": tracking_trend,
            "last_analyzed": time.time()
        }
        
        # توليد توصيات بناءً على الأنماط
        recommendations = []
        
        # توصيات دقة التصويب
        if accuracy_trend < -0.5:
            recommendations.append({
                "type": "warning",
                "component": "accuracy",
                "message": "لوحظ انخفاض في دقة التصويب. حاول تقليل DPI أو استخدام سطح ماوس أفضل."
            })
        elif accuracy_trend > 0.5:
            recommendations.append({
                "type": "positive",
                "component": "accuracy",
                "message": "تحسن ملحوظ في دقة التصويب. استمر في التدريب!"
            })
        
        # توصيات سرعة الاستجابة
        if speed_trend < -0.5:
            recommendations.append({
                "type": "warning",
                "component": "speed",
                "message": "انخفاض في سرعة الاستجابة. جرب زيادة حساسية الماوس أو زيادة معدل التحديث."
            })
        elif speed_trend > 0.5:
            recommendations.append({
                "type": "positive",
                "component": "speed",
                "message": "تحسن ملحوظ في سرعة الاستجابة. أداء ممتاز!"
            })
        
        # توصيات التتبع
        if tracking_trend < -0.5:
            recommendations.append({
                "type": "warning",
                "component": "tracking",
                "message": "صعوبة في متابعة الأهداف المتحركة. حاول ضبط تسارع الماوس."
            })
        
        # توصيات عامة
        latest_cal = recent_calibrations[-1]
        if latest_cal["overall_score"] < 5:
            recommendations.append({
                "type": "critical",
                "component": "overall",
                "message": "الأداء العام منخفض. يوصى بإجراء المزيد من تدريبات المعايرة وضبط الإعدادات."
            })
        elif latest_cal["overall_score"] > 8:
            recommendations.append({
                "type": "positive",
                "component": "overall",
                "message": "أداء ممتاز! لديك إعدادات مثالية للماوس."
            })
        
        # إضافة التوصيات إلى التاريخ
        if recommendations:
            for rec in recommendations:
                rec["timestamp"] = time.time()
                rec["date"] = datetime.datetime.fromtimestamp(rec["timestamp"]).strftime('%Y-%m-%d %H:%M:%S')
            
            self.performance_history["recommendations"] = recommendations + self.performance_history["recommendations"]
            # الاحتفاظ بآخر 20 توصية فقط
            self.performance_history["recommendations"] = self.performance_history["recommendations"][:20]
    
    def calculate_trend(self, values):
        """حساب اتجاه التغير في مجموعة قيم"""
        if len(values) < 2:
            return 0
        
        # استخدام معامل الانحدار البسيط
        x = np.arange(len(values))
        slope, _ = np.polyfit(x, values, 1)
        
        return slope
    
    def get_recommendations(self, limit=5):
        """الحصول على أحدث التوصيات"""
        return self.performance_history["recommendations"][:limit]
    
    def get_calibration_history(self, limit=10):
        """الحصول على تاريخ المعايرة"""
        return self.performance_history["calibration_history"][-limit:]
    
    def get_recent_trends(self):
        """الحصول على اتجاهات الأداء الأخيرة"""
        return self.performance_history.get("usage_patterns", {})
    
    def get_performance_chart_data(self):
        """الحصول على بيانات الأداء لعرضها في الرسم البياني"""
        history = self.performance_history["calibration_history"]
        if not history:
            return None
        
        # جمع البيانات للرسم البياني
        dates = [cal["date"].split()[0] for cal in history]
        accuracy = [cal["accuracy_score"] for cal in history]
        speed = [cal["speed_score"] for cal in history]
        tracking = [cal["tracking_score"] for cal in history]
        overall = [cal["overall_score"] for cal in history]
        
        return {
            "dates": dates,
            "accuracy": accuracy,
            "speed": speed,
            "tracking": tracking,
            "overall": overall
        }


class PerformanceChart(FigureCanvas):
    """رسم بياني لعرض أداء الماوس"""
    def __init__(self, parent=None, width=5, height=4, dpi=100):
        self.fig = Figure(figsize=(width, height), dpi=dpi)
        self.axes = self.fig.add_subplot(111)
        super().__init__(self.fig)
        self.setParent(parent)
    
    def update_chart(self, data, chart_type="line"):
        """تحديث الرسم البياني بالبيانات الجديدة"""
        if not data:
            return
        
        # مسح الرسم البياني السابق
        self.axes.clear()
        
        dates = data["dates"]
        
        # تبسيط التواريخ إذا كانت كثيرة
        if len(dates) > 10:
            step = len(dates) // 10
            x_ticks = range(0, len(dates), step)
            x_labels = [dates[i] for i in x_ticks]
        else:
            x_ticks = range(len(dates))
            x_labels = dates
        
        if chart_type == "line":
            # رسم خطوط منفصلة لكل مؤشر
            self.axes.plot(data["accuracy"], 'r-', label="الدقة", marker='o')
            self.axes.plot(data["speed"], 'g-', label="السرعة", marker='s')
            self.axes.plot(data["tracking"], 'b-', label="التتبع", marker='^')
            self.axes.plot(data["overall"], 'k-', label="الإجمالي", marker='d', linewidth=2)
            
            self.axes.set_xticks(x_ticks)
            self.axes.set_xticklabels(x_labels, rotation=45)
            self.axes.set_ylim(0, 10.5)
            self.axes.set_ylabel("الدرجة (من 10)")
            self.axes.set_title("تطور الأداء عبر الزمن")
            
        elif chart_type == "bar":
            # رسم مخطط شريطي لآخر نتيجة
            last_idx = len(dates) - 1
            categories = ["الدقة", "السرعة", "التتبع", "الإجمالي"]
            values = [data["accuracy"][last_idx], data["speed"][last_idx], 
                    data["tracking"][last_idx], data["overall"][last_idx]]
            colors = ['#ff9999', '#99ff99', '#9999ff', '#ffcc99']
            
            self.axes.bar(categories, values, color=colors)
            self.axes.set_ylim(0, 10.5)
            self.axes.set_ylabel("الدرجة (من 10)")
            self.axes.set_title(f"نتائج آخر معايرة ({dates[last_idx]})")
        
        self.axes.grid(True, linestyle='--', alpha=0.7)
        self.axes.legend(loc='upper left')
        
        self.fig.tight_layout()
        self.draw()


class AnalyticsWidget(QWidget):
    """واجهة المستخدم لعرض التحليلات المتقدمة"""
    def __init__(self, performance_data, parent=None):
        super().__init__(parent)
        self.performance_data = performance_data
        self.init_ui()
        
        # تحديث البيانات عند التشغيل
        self.update_data()
        
        # إعداد مؤقت للتحديث التلقائي
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_data)
        self.timer.start(60000)  # تحديث كل دقيقة
    
    def init_ui(self):
        """إعداد واجهة المستخدم"""
        layout = QVBoxLayout(self)
        
        # تبويبات التحليلات
        tabs = QTabWidget()
        tabs.addTab(self.create_overview_tab(), "نظرة عامة")
        tabs.addTab(self.create_detailed_tab(), "تحليل مفصل")
        tabs.addTab(self.create_recommendations_tab(), "التوصيات")
        
        layout.addWidget(tabs)
    
    def create_overview_tab(self):
        """إنشاء تبويب النظرة العامة"""
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        # الرسم البياني الرئيسي
        chart_group = QGroupBox("تطور الأداء")
        chart_layout = QVBoxLayout()
        
        # إنشاء الرسم البياني
        self.main_chart = PerformanceChart(self, width=8, height=4)
        chart_layout.addWidget(self.main_chart)
        
        # أزرار التحكم في الرسم البياني
        chart_controls = QHBoxLayout()
        
        self.chart_type_combo = QComboBox()
        self.chart_type_combo.addItems(["مخطط خطي", "مخطط شريطي"])
        self.chart_type_combo.currentIndexChanged.connect(self.update_chart)
        chart_controls.addWidget(QLabel("نوع المخطط:"))
        chart_controls.addWidget(self.chart_type_combo)
        
        refresh_btn = QPushButton("تحديث")
        refresh_btn.clicked.connect(self.update_data)
        chart_controls.addWidget(refresh_btn)
        
        chart_layout.addLayout(chart_controls)
        chart_group.setLayout(chart_layout)
        layout.addWidget(chart_group)
        
        # ملخص الأداء الأخير
        summary_group = QGroupBox("ملخص الأداء الأخير")
        summary_layout = QVBoxLayout()
        
        self.summary_label = QLabel("جاري تحميل البيانات...")
        self.summary_label.setWordWrap(True)
        self.summary_label.setAlignment(Qt.AlignCenter)
        self.summary_label.setStyleSheet("font-size: 14px;")
        summary_layout.addWidget(self.summary_label)
        
        summary_group.setLayout(summary_layout)
        layout.addWidget(summary_group)
        
        return tab
    
    def create_detailed_tab(self):
        """إنشاء تبويب التحليل المفصل"""
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        # إحصائيات مفصلة
        stats_group = QGroupBox("إحصائيات مفصلة")
        stats_layout = QVBoxLayout()
        
        self.detailed_stats_label = QLabel("جاري تحميل الإحصائيات...")
        self.detailed_stats_label.setWordWrap(True)
        self.detailed_stats_label.setStyleSheet("font-size: 14px;")
        stats_layout.addWidget(self.detailed_stats_label)
        
        stats_group.setLayout(stats_layout)
        layout.addWidget(stats_group)
        
        # اتجاهات الأداء
        trends_group = QGroupBox("اتجاهات الأداء")
        trends_layout = QVBoxLayout()
        
        self.trends_label = QLabel("جاري تحليل اتجاهات الأداء...")
        self.trends_label.setWordWrap(True)
        self.trends_label.setStyleSheet("font-size: 14px;")
        trends_layout.addWidget(self.trends_label)
        
        trends_group.setLayout(trends_layout)
        layout.addWidget(trends_group)
        
        return tab
    
    def create_recommendations_tab(self):
        """إنشاء تبويب التوصيات"""
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        # التوصيات الحالية
        recommendations_group = QGroupBox("توصيات لتحسين الأداء")
        recommendations_layout = QVBoxLayout()
        
        self.recommendations_label = QLabel("جاري تحميل التوصيات...")
        self.recommendations_label.setWordWrap(True)
        self.recommendations_label.setStyleSheet("font-size: 14px;")
        recommendations_layout.addWidget(self.recommendations_label)
        
        recommendations_group.setLayout(recommendations_layout)
        layout.addWidget(recommendations_group)
        
        return tab
    
    def update_data(self):
        """تحديث جميع البيانات"""
        # تحديث الرسم البياني
        self.update_chart()
        
        # تحديث ملخص الأداء
        self.update_summary()
        
        # تحديث الإحصائيات المفصلة
        self.update_detailed_stats()
        
        # تحديث التوصيات
        self.update_recommendations()
    
    def update_chart(self):
        """تحديث الرسم البياني"""
        chart_data = self.performance_data.get_performance_chart_data()
        if not chart_data:
            return
        
        chart_type = "line" if self.chart_type_combo.currentIndex() == 0 else "bar"
        self.main_chart.update_chart(chart_data, chart_type)
    
    def update_summary(self):
        """تحديث ملخص الأداء"""
        history = self.performance_data.get_calibration_history(limit=1)
        if not history:
            self.summary_label.setText("لا توجد بيانات أداء حتى الآن. قم بإجراء المعايرة أولاً.")
            return
        
        latest = history[0]
        
        summary_text = (
            f"<b>آخر معايرة:</b> {latest['date']}<br><br>"
            f"<b>مؤشر الدقة:</b> <span style='color: {'green' if latest['accuracy_score'] >= 7 else 'orange' if latest['accuracy_score'] >= 5 else 'red'};'>{latest['accuracy_score']:.1f}/10</span><br>"
            f"<b>مؤشر السرعة:</b> <span style='color: {'green' if latest['speed_score'] >= 7 else 'orange' if latest['speed_score'] >= 5 else 'red'};'>{latest['speed_score']:.1f}/10</span><br>"
            f"<b>مؤشر التتبع:</b> <span style='color: {'green' if latest['tracking_score'] >= 7 else 'orange' if latest['tracking_score'] >= 5 else 'red'};'>{latest['tracking_score']:.1f}/10</span><br>"
            f"<b>المؤشر الإجمالي:</b> <span style='color: {'green' if latest['overall_score'] >= 7 else 'orange' if latest['overall_score'] >= 5 else 'red'};'>{latest['overall_score']:.1f}/10</span><br><br>"
            f"<b>زمن الاستجابة:</b> {latest['response_time']:.1f} مللي ثانية<br>"
        )
        
        self.summary_label.setText(summary_text)
    
    def update_detailed_stats(self):
        """تحديث الإحصائيات المفصلة"""
        history = self.performance_data.get_calibration_history()
        if not history:
            self.detailed_stats_label.setText("لا توجد بيانات كافية للتحليل.")
            return
        
        # حساب المتوسطات والقيم القصوى
        accuracy_values = [cal["accuracy_score"] for cal in history]
        speed_values = [cal["speed_score"] for cal in history]
        tracking_values = [cal["tracking_score"] for cal in history]
        overall_values = [cal["overall_score"] for cal in history]
        
        stats_text = "<b>تحليل أداء المعايرة:</b><br><br>"
        
        # إحصائيات الدقة
        stats_text += (
            f"<b>دقة التصويب:</b><br>"
            f"• المتوسط: {np.mean(accuracy_values):.2f}/10<br>"
            f"• أعلى قيمة: {np.max(accuracy_values):.2f}/10<br>"
            f"• أدنى قيمة: {np.min(accuracy_values):.2f}/10<br>"
            f"• الانحراف المعياري: {np.std(accuracy_values):.2f}<br><br>"
        )
        
        # إحصائيات السرعة
        stats_text += (
            f"<b>سرعة الاستجابة:</b><br>"
            f"• المتوسط: {np.mean(speed_values):.2f}/10<br>"
            f"• أعلى قيمة: {np.max(speed_values):.2f}/10<br>"
            f"• أدنى قيمة: {np.min(speed_values):.2f}/10<br>"
            f"• الانحراف المعياري: {np.std(speed_values):.2f}<br><br>"
        )
        
        # إحصائيات التتبع
        stats_text += (
            f"<b>تتبع الأهداف:</b><br>"
            f"• المتوسط: {np.mean(tracking_values):.2f}/10<br>"
            f"• أعلى قيمة: {np.max(tracking_values):.2f}/10<br>"
            f"• أدنى قيمة: {np.min(tracking_values):.2f}/10<br>"
            f"• الانحراف المعياري: {np.std(tracking_values):.2f}<br><br>"
        )
        
        # إحصائيات المؤشر الإجمالي
        stats_text += (
            f"<b>المؤشر الإجمالي:</b><br>"
            f"• المتوسط: {np.mean(overall_values):.2f}/10<br>"
            f"• أعلى قيمة: {np.max(overall_values):.2f}/10<br>"
            f"• أدنى قيمة: {np.min(overall_values):.2f}/10<br>"
            f"• الانحراف المعياري: {np.std(overall_values):.2f}<br>"
        )
        
        self.detailed_stats_label.setText(stats_text)
        
        # تحديث اتجاهات الأداء
        trends = self.performance_data.get_recent_trends()
        if not trends:
            self.trends_label.setText("لا توجد بيانات كافية لتحليل الاتجاهات.")
            return
        
        trend_icons = {
            "increasing": "↗️",
            "stable": "→",
            "decreasing": "↘️"
        }
        
        acc_trend = trends.get("accuracy_trend", 0)
        speed_trend = trends.get("speed_trend", 0)
        tracking_trend = trends.get("tracking_trend", 0)
        
        def get_trend_desc(trend_value):
            if trend_value > 0.2:
                return ("increasing", "تحسن")
            elif trend_value < -0.2:
                return ("decreasing", "تراجع")
            else:
                return ("stable", "ثبات")
        
        acc_trend_tuple = get_trend_desc(acc_trend)
        speed_trend_tuple = get_trend_desc(speed_trend)
        track_trend_tuple = get_trend_desc(tracking_trend)
        
        trends_text = "<b>تحليل اتجاهات الأداء:</b><br><br>"
        trends_text += (
            f"<b>دقة التصويب:</b> {trend_icons[acc_trend_tuple[0]]} {acc_trend_tuple[1]}<br>"
            f"<b>سرعة الاستجابة:</b> {trend_icons[speed_trend_tuple[0]]} {speed_trend_tuple[1]}<br>"
            f"<b>تتبع الأهداف:</b> {trend_icons[track_trend_tuple[0]]} {track_trend_tuple[1]}<br><br>"
        )
        
        if "last_analyzed" in trends:
            last_analyzed = datetime.datetime.fromtimestamp(trends["last_analyzed"]).strftime('%Y-%m-%d %H:%M:%S')
            trends_text += f"<i>آخر تحليل: {last_analyzed}</i>"
        
        self.trends_label.setText(trends_text)
    
    def update_recommendations(self):
        """تحديث التوصيات"""
        recommendations = self.performance_data.get_recommendations()
        if not recommendations:
            self.recommendations_label.setText("لا توجد توصيات متاحة حاليًا. قم بإجراء المزيد من المعايرات للحصول على تحليل أفضل.")
            return
        
        recommendations_text = "<b>توصيات مخصصة لتحسين أدائك:</b><br><br>"
        
        for i, rec in enumerate(recommendations):
            icon = ""
            if rec["type"] == "critical":
                icon = "⚠️"
                color = "red"
            elif rec["type"] == "warning":
                icon = "⚠️"
                color = "orange"
            elif rec["type"] == "positive":
                icon = "✅"
                color = "green"
            else:
                icon = "ℹ️"
                color = "blue"
            
            recommendations_text += f"{i+1}. {icon} <span style='color: {color};'>{rec['message']}</span><br>"
            if i < len(recommendations) - 1:
                recommendations_text += "<br>"
        
        self.recommendations_label.setText(recommendations_text)
