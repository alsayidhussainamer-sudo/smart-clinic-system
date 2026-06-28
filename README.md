<div align="center">
<h1>🏥 Smart Clinic System</h1>
<p><strong>نظام إدارة عيادة ذكي | Smart Clinic Management System</strong></p>
<p><em>مشروع تخرج | Graduation Project</em></p>
</div>
<hr>
<h2>📋 نظرة عامة</h2>
<p>نظام <strong>Smart Clinic System</strong> هو تطبيق ويب متكامل لإدارة العيادات الطبية، يوفر واجهة مستخدم حديثة مع دعم كامل للغتين العربية والإنجليزية، وأربعة أدوار (Admin, Doctor, Receptionist, Patient)، بالإضافة إلى بوابة المريض الإلكترونية ومساعد ذكي (AI Chatbot) وطباعة الوصفات الطبية بصيغة PDF.</p>
<hr>
<h2>✨ المميزات</h2>
<ul>
<li>✅ نظام مصادقة JWT مع 3 أدوار للموظفين (Admin, Doctor, Receptionist)</li>
<li>✅ بوابة المريض الإلكترونية مع تسجيل ودخول مستقل</li>
<li>✅ إدارة المرضى والأطباء مع التخصصات الطبية</li>
<li>✅ إدارة المواعيد (مجدول، مكتمل، ملغى) مع إعادة الجدولة والإلغاء</li>
<li>✅ السجلات الطبية مع اقتراحات AI للتشخيص والعلاج</li>
<li>✅ الوصفات الطبية + طباعة PDF احترافية (مع دعم العربية)</li>
<li>✅ AI Chatbot للاستفسارات الطبية (يدعم العربية والإنجليزية)</li>
<li>✅ التقارير والإحصائيات مع تصدير Excel</li>
<li>✅ دعم اللغتين العربية والإنجليزية (i18n)</li>
<li>✅ ثلاثة ثيمات: Default، Dark Mode، High Contrast</li>
<li>✅ Responsive Design يعمل على جميع الأجهزة</li>
</ul>
<hr>
<h2>🛠️ التقنيات المستخدمة</h2>
<p><strong>Frontend:</strong></p>
<ul>
<li>HTML5 + CSS3 + JavaScript</li>
<li>Bootstrap 5.3</li>
<li>Font Awesome 6.5</li>
<li>jsPDF + html2canvas (طباعة PDF)</li>
<li>SheetJS (تصدير Excel)</li>
</ul>
<p><strong>Backend:</strong></p>
<ul>
<li>Node.js 18+</li>
<li>Express.js 4.x</li>
<li>MySQL 8.0 (mysql2)</li>
<li>JWT (jsonwebtoken)</li>
<li>bcryptjs (تشفير كلمات المرور)</li>
</ul>
<p><strong>AI Integration:</strong></p>
<ul>
<li>OpenRouter API (AI Chatbot + Medical Suggestions)</li>
<li>دعم اللغة العربية والإنجليزية</li>
</ul>
<hr>
<h2>📁 هيكل المشروع</h2>
<pre><code>smart-clinic-system/
├── controllers/          # منطق التطبيق
│   ├── aiConsultationController.js
│   ├── aiController.js
│   ├── appointmentController.js
│   ├── doctorController.js
│   ├── medicalRecordController.js
│   ├── patientAuthController.js
│   ├── patientController.js
│   ├── patientPortalController.js
│   ├── prescriptionController.js
│   ├── reportsController.js
│   ├── specialtyController.js
│   └── userController.js
├── routes/               # مسارات API
│   ├── aiConsultationRoutes.js
│   ├── aiRoutes.js
│   ├── appointmentRoutes.js
│   ├── doctorRoutes.js
│   ├── medicalRecordRoutes.js
│   ├── patientAuthRoutes.js
│   ├── patientRoutes.js
│   ├── prescriptionRoutes.js
│   ├── reportsRoutes.js
│   ├── specialtyRoutes.js
│   └── userRoutes.js
├── middleware/           # وسطاء المصادقة
│   ├── authMiddleware.js
│   ├── patientAuthMiddleware.js
│   └── roleMiddleware.js
├── database/             # إعدادات قاعدة البيانات
│   └── db.js
├── frontend/             # واجهة المستخدم
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── i18n.js
│   │   └── validation.js
│   ├── dashboard.html
│   ├── login.html
│   ├── patient-dashboard.html
│   └── patient-login.html
├── server.js             # نقطة البداية
└── .env</code></pre>
<hr>
<h2>👥 الأدوار</h2>
<table>
<tr><th>الدور</th><th>الصلاحيات</th></tr>
<tr><td><strong>🛡️ Admin</strong></td><td>كل شيء: المرضى، الأطباء، المواعيد، السجلات، الوصفات، التقارير، المستخدمين، AI</td></tr>
<tr><td><strong>👨‍⚕️ Doctor</strong></td><td>المرضى، الأطباء، المواعيد، السجلات، الوصفات، AI Consultations</td></tr>
<tr><td><strong>👩‍💼 Receptionist</strong></td><td>المرضى، المواعيد، AI Chatbot فقط</td></tr>
<tr><td><strong>👤 Patient</strong></td><td>بوابة المريض: حجز مواعيد، عرض سجلاته، الوصفات، تعديل الملف الشخصي</td></tr>
</table>
<hr>
<h2>📸 لقطات الشاشة</h2>
<div align="center">
<h3>🏠 صفحة تسجيل الدخول</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/1. login.jpg" width="100%" alt="Login Page">
<br><br>
<h3>📊 لوحة التحكم</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/2. dashboard.jpg" width="100%" alt="Dashboard">
<br><br>
<h3>👥 إدارة المرضى</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/3. patients.jpg" width="100%" alt="Patients Management">
<br><br>
<h3>👨‍⚕️ إدارة الأطباء</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/4. Doctors.jpg" width="100%" alt="Doctors Management">
<br><br>
<h3>📅 إدارة المواعيد</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/5. appointments.jpg" width="100%" alt="Appointments">
<br><br>
<h3>📋 السجلات الطبية</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/6. medical-records.jpg" width="100%" alt="Medical Records">
<br><br>
<h3>📊 التقارير</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/7. reports.jpg" width="100%" alt="Reports">
<h3>💊 الوصفات الطبية</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/6. medical-records.jpg" width="100%" alt="Prescriptions">
<br><br>
<h3>🖨️ طباعة الوصفة PDF</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/9. pdf-print.jpg" width="100%" alt="PDF Print">
<br><br>
<h3>🤖 استشارات الذكاء الاصطناعي</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/10. ai-consultations.jpg" width="100%" alt="AI Consultations">
<br><br>
<h3>👥 المستخدمين</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/11. Users.jpg" width="100%" alt="AI Consultations">
<br><br>
<h3>🌙 الوضع الداكن</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/12. dark-mode.jpg" width="100%" alt="Dark Mode">
<br><br>
<h3>👁️ وضع التباين العالي</h3>
<img src="https://raw.githubusercontent.com/alsayidhussainamer-sudo/smart-clinic-system/main/screenshots/13. high-contrast.jpg" width="100%" alt="High Contrast">
<h3>📝 تسجيل مريض جديد</h3>
<img src="screenshots/14. Register as a new patient.jpg" width="100%" alt="Register as a new patient">
<br><br>
<h3>🔐 تسجيل دخول المريض</h3>
<img src="screenshots/15. login patient.jpg" width="100%" alt="Patient Login">
<br><br>
<h3>👤 لوحة تحكم المريض</h3>
<img src="screenshots/16. Patient Dashboard.jpg" width="100%" alt="Patient Dashboard">
<br><br>
<h3>📅 حجز موعد جديد</h3>
<img src="screenshots/17. Book New Appointment.jpg" width="100%" alt="Book New Appointment">
<br><br>
<h3>📋 مواعيدي</h3>
<img src="screenshots/18. My Appointments.jpg" width="100%" alt="My Appointments">
<br><br>
<h3>📄 سجلاتي الطبية</h3>
<img src="screenshots/19. My Medical Records.jpg" width="100%" alt="My Medical Records">
<br><br>
<h3>💊 وصفاتي الطبية</h3>
<img src="screenshots/20. My Prescriptions.jpg" width="100%" alt="My Prescriptions">
<br><br>
<h3>🧑‍⚕️ ملفي الشخصي</h3>
<img src="screenshots/21. My Profile.jpg" width="100%" alt="My Profile">
<hr>
</div>
<h2>🆕 الميزات الجديدة</h2>
<h3>👤 بوابة المريض الإلكترونية</h3>
<ul>
<li>تسجيل حساب جديد للمرضى</li>
<li>تسجيل الدخول المستقل</li>
<li>حجز مواعيد جديدة</li>
<li>عرض المواعيد مع إمكانية إعادة الجدولة والإلغاء</li>
<li>عرض السجلات الطبية الشخصية</li>
<li>عرض الوصفات الطبية</li>
<li>تعديل الملف الشخصي وتغيير كلمة المرور</li>
<li>AI Chatbot مخصص للمريض</li>
</ul>
<h3>🎨 الثيمات</h3>
<ul>
<li>☀️ Default Theme - التصميم الافتراضي الأنيق</li>
<li>🌙 Dark Mode - الوضع الداكن للراحة في الإضاءة المنخفضة</li>
<li>👁️ High Contrast - وضع التباين العالي لذوي الاحتياجات الخاصة</li>
</ul>
<hr>
<h2>🛡️ الأمان</h2>
<ul>
<li>✅ تشفير كلمات المرور بـ bcrypt (10 rounds)</li>
<li>✅ JWT tokens مع expiry (1 day for staff, 7 days for patients)</li>
<li>✅ CORS مفعّل</li>
<li>✅ Role-based access control (RBAC)</li>
<li>✅ Patient data isolation (patients can only see their own data)</li>
<li>✅ Input validation على Frontend و Backend</li>
<li>✅ SQL Injection protection (parameterized queries)</li>
</ul>
<hr>
<h2>🗺️ خارطة الطريق</h2>
<ul>
<li>✅ نظام مصادقة JWT (موظفين + مرضى)</li>
<li>✅ إدارة المرضى والأطباء</li>
<li>✅ إدارة المواعيد مع إعادة الجدولة والإلغاء</li>
<li>✅ السجلات الطبية + AI اقتراحات</li>
<li>✅ الوصفات الطبية + طباعة PDF</li>
<li>✅ AI Chatbot (يدعم العربية)</li>
<li>✅ التقارير والإحصائيات + Excel Export</li>
<li>✅ دعم اللغتين (AR/EN) مع i18n</li>
<li>✅ ثلاثة ثيمات (Default/Dark/High Contrast)</li>
<li>✅ بوابة المريض الإلكترونية</li>
<li>✅ التخصصات الطبية (Internal Medicine, ENT, General)</li>
<li>⬜ إشعارات البريد الإلكتروني للمواعيد</li>
<li>⬜ تطبيق موبايل (React Native / Flutter)</li>
<li>⬜ إحصائيات متقدمة بـ Charts</li>
<li>⬜ دعم الصور والملفات المرفقة</li>
</ul>
<hr>
<div align="center">
<p><strong>تم التطوير بواسطة:</strong> Amer Alsayid Hussain</p>
<p>⭐ إذا أعجبك المشروع، لا تنسَ إعطائه نجمة!</p>
</div>