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
        defaultTheme: "Default Theme",

        // Prescriptions
        prescriptions: "Prescriptions",
        medicineName: "Medicine Name",
        dosage: "Dosage",
        instructions: "Instructions",
        selectRecord: "Select Medical Record",
        medicalRecord: "Medical Record",

        // AI Consultations
        aiConsultations: "AI Consultations",
        general: "General",
        print: "Print",
        printPDF: "Print PDF",
        searchDoctors: "Search doctors...",
        searchAppointments: "Search appointments...",
        searchPatients: "Search patients...",
        searchRecords: "Search records...",
        searchPrescriptions: "Search prescriptions...",
        searchUsers: "Search users...",
        searchConsultations: "Search consultations...",
        // Patient Login
        patientPortalTitle: "Patient Portal - Smart Clinic",
        patientPortal: "Patient Portal",
        signInSubtitle: "Sign in to book appointments",
        register: "Register",
        createAccount: "Create Account",
        registerSubtitle: "Register as a new patient",
        createAccountBtn: "Create Account",
        staffLogin: "Staff Login",
        selectGender: "Select Gender",
        addressOptional: "Address (optional)",
        // Patient Portal
        patientDashboard: "Patient Dashboard",
        upcomingAppointments: "Upcoming Appointments",
        bookAppointment: "Book Appointment",
        viewAppointments: "View Appointments",
        myAppointments: "My Appointments",
        myMedicalRecords: "My Medical Records",
        myPrescriptions: "My Prescriptions",
        myProfile: "My Profile",
        bookNewAppointment: "Book New Appointment",
        selectDoctor: "Select Doctor",
        appointmentDate: "Appointment Date",
        appointmentTime: "Appointment Time",
        confirmBooking: "Confirm Booking",
        reschedule: "Reschedule",
        cancel: "Cancel",
        loadingAppointments: "Loading your appointments...",
        noAppointments: "No appointments found",
        noAppointmentsYet: "No appointments yet. Book your first appointment!",
        bookNow: "Book Now",
        loadingRecords: "Loading your records...",
        noRecords: "No medical records found",
        loadingPrescriptions: "Loading your prescriptions...",
        noPrescriptions: "No prescriptions found",
        loadingProfile: "Loading profile...",
        saveChanges: "Save Changes",
        changePassword: "Change Password",
        changePasswordBtn: "Change Password",
        currentPassword: "Current Password",
        newPassword: "New Password (min 6 chars)",
        emailCannotChange: "Email cannot be changed",
        chatbotPlaceholder: "Ask about your appointments, records...",
        loading: "Loading...",
        darkMode: "Dark Mode",
        highContrast: "High Contrast",
        defaultTheme: "Default Theme",
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
        defaultTheme: "الوضع الافتراضي",

        // Prescriptions
        prescriptions: "الوصفات الطبية",
        medicineName: "اسم الدواء",
        dosage: "الجرعة",
        instructions: "التعليمات",
        selectRecord: "اختر السجل الطبي",
        medicalRecord: "السجل الطبي",

        // AI Consultations
        aiConsultations: "استشارات الذكاء الاصطناعي",
        general: "عام",
        print: "طباعة",
        printPDF: "طباعة PDF",
        searchDoctors: "البحث في الأطباء...",
        searchAppointments: "البحث في المواعيد...",
        searchPatients: "البحث في المرضى...",
        searchRecords: "البحث في السجلات...",
        searchPrescriptions: "البحث في الوصفات...",
        searchUsers: "البحث في المستخدمين...",
        searchConsultations: "البحث في الاستشارات...",
        // Patient Login
        patientPortalTitle: "بوابة المريض - العيادة الذكية",
        patientPortal: "بوابة المريض",
        signInSubtitle: "سجل الدخول لحجز مواعيد",
        register: "تسجيل",
        createAccount: "إنشاء حساب",
        registerSubtitle: "سجل كمريض جديد",
        createAccountBtn: "إنشاء حساب",
        staffLogin: "دخول الموظفين",
        selectGender: "اختر الجنس",
        addressOptional: "العنوان (اختياري)",
        // Patient Portal
        patientDashboard: "لوحة تحكم المريض",
        upcomingAppointments: "المواعيد القادمة",
        bookAppointment: "حجز موعد",
        viewAppointments: "عرض المواعيد",
        myAppointments: "مواعيدي",
        myMedicalRecords: "سجلاتي الطبية",
        myPrescriptions: "وصفاتي الطبية",
        myProfile: "ملفي الشخصي",
        bookNewAppointment: "حجز موعد جديد",
        selectDoctor: "اختر الطبيب",
        appointmentDate: "تاريخ الموعد",
        appointmentTime: "وقت الموعد",
        confirmBooking: "تأكيد الحجز",
        reschedule: "إعادة الجدولة",
        cancel: "إلغاء",
        loadingAppointments: "جاري تحميل مواعيدك...",
        noAppointments: "لم يتم العثور على مواعيد",
        noAppointmentsYet: "لا توجد مواعيد بعد. احجز موعدك الأول!",
        bookNow: "احجز الآن",
        loadingRecords: "جاري تحميل سجلاتك...",
        noRecords: "لم يتم العثور على سجلات طبية",
        loadingPrescriptions: "جاري تحميل وصفاتك...",
        noPrescriptions: "لم يتم العثور على وصفات",
        loadingProfile: "جاري تحميل الملف...",
        saveChanges: "حفظ التغييرات",
        changePassword: "تغيير كلمة المرور",
        changePasswordBtn: "تغيير كلمة المرور",
        currentPassword: "كلمة المرور الحالية",
        newPassword: "كلمة المرور الجديدة (6 أحرف على الأقل)",
        emailCannotChange: "لا يمكن تغيير البريد الإلكتروني",
        chatbotPlaceholder: "اسأل عن مواعيدك، سجلاتك...",
        loading: "جاري التحميل...",
        darkMode: "الوضع الداكن",
        highContrast: "تباين عالي",
        defaultTheme: "الوضع الافتراضي",
    }
};

// =========================
// LANGUAGE MANAGER
// =========================

const I18n = {
    // Determine which portal we're in based on URL
    getStorageKey() {
        const path = window.location.pathname.toLowerCase();
        const isPatientPortal = path.includes('patient');
        return isPatientPortal ? 'patientLang' : 'staffLang';
    },

    currentLang: (function() {
        const path = window.location.pathname.toLowerCase();
        const key = path.includes('patient') ? 'patientLang' : 'staffLang';
        return localStorage.getItem(key) || 'en';
    })(),

    init() {
        // Re-read language from the correct storage key
        const key = this.getStorageKey();
        const saved = localStorage.getItem(key);
        if (saved) {
            this.currentLang = saved;
        }
        this.applyLanguage();
    },

    toggle() {
        this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem(this.getStorageKey(), this.currentLang);
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
                    if (el.type === 'password' || el.type === 'email' || el.type === 'text') {
                        el.placeholder = t[key];
                    } else {
                        el.value = t[key];
                    }
                } else {
                    // Preserve child icons while updating text
                    const icon = el.querySelector('i');
                    const span = el.querySelector('span');
                    if (icon && span) {
                        span.textContent = ' ' + t[key];
                    } else if (icon) {
                        const textNode = Array.from(el.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
                        if (textNode) {
                            textNode.textContent = ' ' + t[key];
                        } else {
                            el.appendChild(document.createTextNode(' ' + t[key]));
                        }
                    } else {
                        el.textContent = t[key];
                    }
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

        // Apply to elements with data-i18n-placeholder (for placeholders)
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) {
                el.placeholder = t[key];
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