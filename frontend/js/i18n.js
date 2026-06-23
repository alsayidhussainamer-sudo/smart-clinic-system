// =========================
// TRANSLATIONS
// =========================

const translations = {
    en: {
        // Sidebar
        dashboard: "Dashboard",
        patients: "Patients",
        doctors: "Doctors",
        appointments: "Appointments",
        medicalRecords: "Medical Records",
        reports: "Reports",
        users: "Users",
        logout: "Logout",
        language: "العربية",

        // Dashboard
        totalPatients: "Total Patients",
        totalDoctors: "Total Doctors",
        totalAppointments: "Appointments",
        totalRecords: "Medical Records",
        welcome: "Welcome",
        quickActions: "Quick Actions",
        addPatient: "Add Patient",
        newAppointment: "New Appointment",
        viewDoctors: "View Doctors",
        addRecord: "Add Record",
        recentAppointments: "Recent Appointments",
        recentActivities: "Recent Activities",
        systemInitialized: "System initialized successfully",

        // Status
        scheduled: "Scheduled",
        completed: "Completed",
        cancelled: "Cancelled",

        // Login
        loginTitle: "Smart Clinic System",
        loginSubtitle: "Login to continue",
        username: "Username",
        password: "Password",
        login: "Login",

        // Chatbot
        aiChat: "AI Chat",
        chatbotWelcome: "Hello! I am your Smart Clinic assistant. How can I help you?",
        typeMessage: "Type your message...",

        // Buttons
        add: "Add",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        close: "Close",
        refresh: "Refresh",
        exportExcel: "Export Excel",
        filter: "Filter",

        // Form Labels
        fullName: "Full Name",
        gender: "Gender",
        male: "Male",
        female: "Female",
        birthDate: "Birth Date",
        phone: "Phone",
        email: "Email",
        address: "Address",
        specialty: "Specialty",
        selectSpecialty: "Select Specialty",
        patient: "Patient",
        doctor: "Doctor",
        date: "Date",
        time: "Time",
        status: "Status",
        symptoms: "Symptoms",
        diagnosis: "Diagnosis",
        treatment: "Treatment",
        visitDate: "Visit Date",
        role: "Role",

        // Messages
        confirmDelete: "Are you sure you want to delete this?",
        accessDenied: "Access denied. You don't have permission.",
        sessionExpired: "Session expired. Please login again.",
        noDataFound: "No data found",

        // Reports
        appointmentsFilter: "Appointments Filter",
        startDate: "Start Date",
        endDate: "End Date",
        all: "All",
        appointmentsReport: "Appointments Report",
        doctorsReport: "Doctors Report",
        patientsReport: "Patients Report",

        // AI
        aiSuggest: "AI Suggest",
        generating: "Generating...",
        enterSymptoms: "Please enter symptoms first",

        // Themes
        darkMode: "Dark Mode",
        highContrast: "High Contrast",
        defaultTheme: "Default Theme"
    },

    ar: {
        // Sidebar
        dashboard: "لوحة التحكم",
        patients: "المرضى",
        doctors: "الأطباء",
        appointments: "المواعيد",
        medicalRecords: "السجلات الطبية",
        reports: "التقارير",
        users: "المستخدمين",
        logout: "تسجيل الخروج",
        language: "English",

        // Dashboard
        totalPatients: "إجمالي المرضى",
        totalDoctors: "إجمالي الأطباء",
        totalAppointments: "المواعيد",
        totalRecords: "السجلات الطبية",
        welcome: "مرحباً",
        quickActions: "إجراءات سريعة",
        addPatient: "إضافة مريض",
        newAppointment: "موعد جديد",
        viewDoctors: "عرض الأطباء",
        addRecord: "إضافة سجل",
        recentAppointments: "المواعيد الأخيرة",
        recentActivities: "النشاطات الأخيرة",
        systemInitialized: "تم تهيئة النظام بنجاح",

        // Status
        scheduled: "مجدول",
        completed: "مكتمل",
        cancelled: "ملغى",

        // Login
        loginTitle: "نظام العيادة الذكية",
        loginSubtitle: "سجل الدخول للمتابعة",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        login: "تسجيل الدخول",

        // Chatbot
        aiChat: "المحادثة الذكية",
        chatbotWelcome: "مرحباً! أنا مساعد العيادة الذكية. كيف يمكنني مساعدتك؟",
        typeMessage: "اكتب رسالتك...",

        // Buttons
        add: "إضافة",
        edit: "تعديل",
        delete: "حذف",
        save: "حفظ",
        close: "إغلاق",
        refresh: "تحديث",
        exportExcel: "تصدير Excel",
        filter: "تصفية",

        // Form Labels
        fullName: "الاسم الكامل",
        gender: "الجنس",
        male: "ذكر",
        female: "أنثى",
        birthDate: "تاريخ الميلاد",
        phone: "الهاتف",
        email: "البريد الإلكتروني",
        address: "العنوان",
        specialty: "التخصص",
        selectSpecialty: "اختر التخصص",
        patient: "المريض",
        doctor: "الطبيب",
        date: "التاريخ",
        time: "الوقت",
        status: "الحالة",
        symptoms: "الأعراض",
        diagnosis: "التشخيص",
        treatment: "العلاج",
        visitDate: "تاريخ الزيارة",
        role: "الدور",

        // Messages
        confirmDelete: "هل أنت متأكد من الحذف؟",
        accessDenied: "غير مصرح. ليس لديك الصلاحية.",
        sessionExpired: "انتهت الجلسة. الرجاء تسجيل الدخول مرة أخرى.",
        noDataFound: "لم يتم العثور على بيانات",

        // Reports
        appointmentsFilter: "تصفية المواعيد",
        startDate: "تاريخ البداية",
        endDate: "تاريخ النهاية",
        all: "الكل",
        appointmentsReport: "تقرير المواعيد",
        doctorsReport: "تقرير الأطباء",
        patientsReport: "تقرير المرضى",

        // AI
        aiSuggest: "اقتراح ذكي",
        generating: "جاري التوليد...",
        enterSymptoms: "الرجاء إدخال الأعراض أولاً",

        // Themes
        darkMode: "الوضع الداكن",
        highContrast: "تباين عالي",
        defaultTheme: "الوضع الافتراضي"
    }
};

// =========================
// LANGUAGE MANAGER
// =========================

const I18n = {
    currentLang: localStorage.getItem('lang') || 'en',

    init() {
        this.applyLanguage();
    },

    toggle() {
        this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem('lang', this.currentLang);
        this.applyLanguage();
        location.reload();
    },

    get(key) {
        return translations[this.currentLang][key] || key;
    },

    applyLanguage() {
        const t = translations[this.currentLang];

        // Keep LTR direction always - no RTL changes
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = this.currentLang;

        // Apply to all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });

        // Apply to elements with data-i18n-html (preserves HTML)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (t[key]) {
                const icon = el.querySelector('i');
                if (icon) {
                    el.innerHTML = '';
                    el.appendChild(icon);
                    el.appendChild(document.createTextNode(' ' + t[key]));
                } else {
                    el.textContent = t[key];
                }
            }
        });
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});

// Make globally available
window.I18n = I18n;
window.translations = translations;