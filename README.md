<div align="center">
<h1>🏥 Smart Clinic System</h1>
<p><strong>نظام إدارة عيادة ذكي | Smart Clinic Management System</strong></p>
<p><em>مشروع تخرج | Graduation Project</em></p>
</div>
<hr>
<h2>📋 نظرة عامة</h2>
<p>نظام <strong>Smart Clinic System</strong> هو تطبيق ويب متكامل لإدارة العيادات الطبية، يوفر واجهة مستخدم حديثة مع دعم كامل للغتين العربية والإنجليزية، وثلاثة أدوار (Admin, Doctor, Receptionist)، بالإضافة إلى مساعد ذكي (AI Chatbot) وطباعة الوصفات الطبية بصيغة PDF.</p>
<hr>
<h2>✨ المميزات</h2>
<ul>
<li>✅ نظام مصادقة JWT مع 3 أدوار</li>
<li>✅ إدارة المرضى والأطباء مع التخصصات</li>
<li>✅ إدارة المواعيد (مجدول، مكتمل، ملغى)</li>
<li>✅ السجلات الطبية مع اقتراحات AI</li>
<li>✅ الوصفات الطبية + طباعة PDF</li>
<li>✅ AI Chatbot للاستفسارات الطبية</li>
<li>✅ التقارير والإحصائيات مع تصدير Excel</li>
<li>✅ دعم اللغتين العربية والإنجليزية</li>
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
│   ├── patientController.js
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
│   ├── patientRoutes.js
│   ├── prescriptionRoutes.js
│   ├── reportsRoutes.js
│   ├── specialtyRoutes.js
│   └── userRoutes.js
├── middleware/           # وسطاء المصادقة
│   ├── authMiddleware.js
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
│   └── login.html
├── server.js             # نقطة البداية
└── .env</code></pre>
<hr>
<h2>👥 الأدوار</h2>
<table>
<tr><th>الدور</th><th>الصلاحيات</th></tr>
<tr><td><strong>🛡️ Admin</strong></td><td>كل شيء: المرضى، الأطباء، المواعيد، السجلات، الوصفات، التقارير، المستخدمين، AI</td></tr>
<tr><td><strong>👨‍⚕️ Doctor</strong></td><td>المرضى، الأطباء، المواعيد، السجلات، الوصفات، AI Consultations</td></tr>
<tr><td><strong>👩‍💼 Receptionist</strong></td><td>المرضى، المواعيد، AI Chatbot فقط</td></tr>
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

</div>
<h2>🛡️ الأمان</h2>
<ul>
<li>✅ تشفير كلمات المرور بـ bcrypt (10 rounds)</li>
<li>✅ JWT tokens مع expiry (1 day)</li>
<li>✅ CORS مفعّل</li>
<li>✅ Role-based access control (RBAC)</li>
<li>✅ Input validation على Frontend و Backend</li>
<li>✅ SQL Injection protection (parameterized queries)</li>
</ul>
<hr>
<h2>🗺️ خارطة الطريق</h2>
<ul>
<li>✅ نظام مصادقة JWT</li>
<li>✅ إدارة المرضى والأطباء</li>
<li>✅ إدارة المواعيد</li>
<li>✅ السجلات الطبية</li>
<li>✅ الوصفات الطبية + طباعة PDF</li>
<li>✅ AI Chatbot + اقتراحات طبية</li>
<li>✅ التقارير والإحصائيات</li>
<li>✅ دعم اللغتين (AR/EN)</li>
<li>✅ ثلاثة ثيمات (Default/Dark/High Contrast)</li>
<li>⬜ إشعارات البريد الإلكتروني للمواعيد</li>
<li>⬜ تطبيق موبايل (React Native / Flutter)</li>
<li>⬜ إحصائيات متقدمة بـ Charts</li>
<li>⬜ دعم الصور والملفات المرفقة</li>
</ul>
<hr>
<h2>🤝 المساهمة</h2>
<p>نرحب بمساهماتكم! إذا وجدت خطأ أو تريد إضافة ميزة:</p>
<ol>
<li>Fork المشروع</li>
<li>أنشئ فرع جديد (<code>git checkout -b feature/AmazingFeature</code>)</li>
<li>Commit التغييرات (<code>git commit -m 'Add some AmazingFeature'</code>)</li>
<li>Push للفرع (<code>git push origin feature/AmazingFeature</code>)</li>
<li>افتح Pull Request</li>
</ol>
<hr>
<h2>👨‍💻 المطور</h2>
<div align="center">
<p><strong>Amer Alsayid Hussain</strong></p>
<p>📧 <a href="mailto:your.email@example.com">your.email@example.com</a></p>
<p>
  <a href="https://github.com/alsayidhussainamer-sudo">
    <img src="https://img.shields.io/badge/GitHub-alsayidhussainamer--sudo-181717?logo=github" alt="GitHub">
  </a>
</p>
</div>
<hr>
<div align="center">
<p><strong>تم التطوير بواسطة:</strong> Amer Alsayid Hussain</p>
<p>⭐ إذا أعجبك المشروع، لا تنسَ إعطائه نجمة!</p>
</div>