// =========================
// LANGUAGE SUPPORT (Added for i18n)
// =========================

function t(key) {
    return I18n.get(key);
}

// Override alert messages with translations
const originalAlert = window.alert;
window.alert = function(message) {
    // Try to translate if it's a known key
    if (translations[I18n.currentLang] && translations[I18n.currentLang][message]) {
        message = translations[I18n.currentLang][message];
    }
    originalAlert(message);
};

// =========================
// GLOBAL VARIABLES
// =========================

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// Security: Redirect if not authenticated
if (!token) {
    window.location.href = "login.html";
}

// =========================
// SECURITY FUNCTIONS
// =========================

function checkRoleAccess(requiredRole) {
    const userRole = localStorage.getItem("role");
    return userRole === requiredRole || userRole === "Admin";
}

// Security: Logout on 403/401 response
async function secureFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status === 403) {
        alert(t("accessDenied"));
        return null;
    }

    if (response.status === 401) {
        alert(t("sessionExpired"));
        logout();
        return null;
    }

    return response;
}

function logout() {
    clearSessionActivities();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}

// =========================
// RECENT ACTIVITIES
// =========================

function addActivity(type, message) {
    const activitiesList = document.getElementById("recentActivitiesList");
    if (!activitiesList) return;

    const now = new Date().toLocaleTimeString();

    let iconClass = "";
    let iconBg = "";

    switch(type) {
        case "add":
            iconClass = "fa-plus";
            iconBg = "add";
            break;
        case "edit":
            iconClass = "fa-pen";
            iconBg = "edit";
            break;
        case "delete":
            iconClass = "fa-trash";
            iconBg = "delete";
            break;
        case "appointment":
            iconClass = "fa-calendar";
            iconBg = "appointment";
            break;
        default:
            iconClass = "fa-info";
            iconBg = "add";
    }

    const activityHTML = `
        <div class="activity-item">
            <div class="activity-icon ${iconBg}"><i class="fa-solid ${iconClass}"></i></div>
            <div class="activity-content">
                <p>${message}</p>
                <span class="activity-time">${now}</span>
            </div>
        </div>
    `;

    activitiesList.insertAdjacentHTML("afterbegin", activityHTML);

    // Keep only last 10 activities in DOM
    const items = activitiesList.querySelectorAll(".activity-item");
    if (items.length > 10) {
        items[items.length - 1].remove();
    }

    // Save to sessionStorage for persistence across page refreshes
    saveActivityToSession(type, message, now);
}

// =========================
// SESSION STORAGE FOR ACTIVITIES
// =========================

function saveActivityToSession(type, message, time) {
    let activities = JSON.parse(sessionStorage.getItem("recentActivities") || "[]");
    activities.unshift({ type, message, time });
    // Keep last 20 activities
    if (activities.length > 20) {
        activities = activities.slice(0, 20);
    }
    sessionStorage.setItem("recentActivities", JSON.stringify(activities));
}

function loadActivitiesFromSession() {
    const activitiesList = document.getElementById("recentActivitiesList");
    if (!activitiesList) return;

    const activities = JSON.parse(sessionStorage.getItem("recentActivities") || "[]");

    if (activities.length === 0) return;

    // Clear default "System initialized" message
    activitiesList.innerHTML = "";

    activities.forEach(activity => {
        let iconClass = "";
        let iconBg = "";

        switch(activity.type) {
            case "add": iconClass = "fa-plus"; iconBg = "add"; break;
            case "edit": iconClass = "fa-pen"; iconBg = "edit"; break;
            case "delete": iconClass = "fa-trash"; iconBg = "delete"; break;
            case "appointment": iconClass = "fa-calendar"; iconBg = "appointment"; break;
            default: iconClass = "fa-info"; iconBg = "add";
        }

        const activityHTML = `
            <div class="activity-item">
                <div class="activity-icon ${iconBg}"><i class="fa-solid ${iconClass}"></i></div>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `;
        activitiesList.insertAdjacentHTML("beforeend", activityHTML);
    });
}

function clearSessionActivities() {
    sessionStorage.removeItem("recentActivities");
}

// =========================
// DASHBOARD
// =========================

async function loadDashboard() {
    const patientsResponse = await secureFetch("http://localhost:4000/patients");
    if (!patientsResponse) return;
    const patients = await patientsResponse.json();
    document.getElementById("patientsCount").innerText = patients.length;

    const doctorsResponse = await secureFetch("http://localhost:4000/doctors");
    if (!doctorsResponse) return;
    const doctors = await doctorsResponse.json();
    document.getElementById("doctorsCount").innerText = doctors.length;

    const appointmentsResponse = await secureFetch("http://localhost:4000/appointments");
    if (!appointmentsResponse) return;
    const appointments = await appointmentsResponse.json();
    document.getElementById("appointmentsCount").innerText = appointments.length;

    const recordsResponse = await secureFetch("http://localhost:4000/medical-records");
    if (!recordsResponse) return;
    const records = await recordsResponse.json();
    document.getElementById("recordsCount").innerText = records.length;

    // Recent Appointments Table - Sort: Scheduled first, then Cancelled, then Completed
    const recentTable = document.getElementById("recentAppointmentsTable");
    recentTable.innerHTML = "";

    // Define priority: Scheduled (0) > Cancelled (1) > Completed (2)
    const statusPriority = {
        "Scheduled": 0,
        "Cancelled": 1,
        "Completed": 2
    };

    // Sort appointments by status priority, then by date (newest first)
    const sortedAppointments = [...appointments].sort((a, b) => {
        const priorityA = statusPriority[a.Status] !== undefined ? statusPriority[a.Status] : 0;
        const priorityB = statusPriority[b.Status] !== undefined ? statusPriority[b.Status] : 0;

        if (priorityA !== priorityB) {
            return priorityA - priorityB; // Sort by status priority
        }
        // If same priority, sort by date (newest first)
        return new Date(b.AppointmentDate) - new Date(a.AppointmentDate);
    });

    sortedAppointments.slice(0, 5).forEach(appointment => {
        const statusClass = appointment.Status.toLowerCase();
        const statusText = t(statusClass) || appointment.Status;
        recentTable.innerHTML += `
            <tr>
                <td>${appointment.PatientName}</td>
                <td>${appointment.DoctorName}</td>
                <td>${new Date(appointment.AppointmentDate).toLocaleString()}</td>
                <td><span class="status-badge status-${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });

    // Load persisted activities
    loadActivitiesFromSession();
}

// =========================
// AUTO REFRESH STATS
// =========================

function refreshStats() {
    loadDashboard();
}

// =========================
// SECTION NAVIGATION
// =========================

function showSection(sectionId) {
    document.getElementById("dashboardSection").style.display = "none";
    document.getElementById("patientsSection").style.display = "none";
    document.getElementById("doctorsSection").style.display = "none";
    document.getElementById("appointmentsSection").style.display = "none";
    document.getElementById("medicalRecordsSection").style.display = "none";
    document.getElementById("reportsSection").style.display = "none";
    document.getElementById("prescriptionsSection").style.display = "none";
    document.getElementById("aiConsultationsSection").style.display = "none";
    document.getElementById("usersSection").style.display = "none";

    document.getElementById(sectionId).style.display = "block";
}

// =========================
// SEARCH FUNCTIONS
// =========================

let allPatients = [];
let allDoctors = [];
let allAppointments = [];
let allMedicalRecords = [];
let allPrescriptions = [];
let allAIConsultations = [];
let allUsers = [];

function searchPatients(query) {
    const filtered = allPatients.filter(patient =>
        patient.FullName.toLowerCase().includes(query.toLowerCase()) ||
        patient.Phone.includes(query) ||
        patient.Email.toLowerCase().includes(query.toLowerCase())
    );
    renderPatientsTable(filtered);
}

function searchDoctors(query) {
    const filtered = allDoctors.filter(doctor =>
        doctor.FullName.toLowerCase().includes(query.toLowerCase()) ||
        doctor.Phone.includes(query) ||
        doctor.Email.toLowerCase().includes(query.toLowerCase())
    );
    renderDoctorsTable(filtered);
}

function searchAppointments(query) {
    const filtered = allAppointments.filter(appointment =>
        (appointment.PatientName && appointment.PatientName.toLowerCase().includes(query.toLowerCase())) ||
        (appointment.DoctorName && appointment.DoctorName.toLowerCase().includes(query.toLowerCase())) ||
        appointment.Status.toLowerCase().includes(query.toLowerCase())
    );
    renderAppointmentsTable(filtered);
}

function searchMedicalRecords(query) {
    const filtered = allMedicalRecords.filter(record =>
        record.PatientName.toLowerCase().includes(query.toLowerCase()) ||
        record.DoctorName.toLowerCase().includes(query.toLowerCase()) ||
        record.Symptoms.toLowerCase().includes(query.toLowerCase()) ||
        record.Diagnosis.toLowerCase().includes(query.toLowerCase())
    );
    renderMedicalRecordsTable(filtered);
}

function searchUsers(query) {
    const filtered = allUsers.filter(user =>
        user.Username.toLowerCase().includes(query.toLowerCase()) ||
        user.Role.toLowerCase().includes(query.toLowerCase())
    );
    renderUsersTable(filtered);
}

function searchPrescriptions(query) {
    const filtered = allPrescriptions.filter(prescription =>
        (prescription.PatientName && prescription.PatientName.toLowerCase().includes(query.toLowerCase())) ||
        (prescription.DoctorName && prescription.DoctorName.toLowerCase().includes(query.toLowerCase())) ||
        (prescription.MedicineName && prescription.MedicineName.toLowerCase().includes(query.toLowerCase()))
    );
    renderPrescriptionsTable(filtered);
}

function searchAIConsultations(query) {
    const filtered = allAIConsultations.filter(consultation =>
        (consultation.PatientName && consultation.PatientName.toLowerCase().includes(query.toLowerCase())) ||
        (consultation.SymptomsText && consultation.SymptomsText.toLowerCase().includes(query.toLowerCase())) ||
        (consultation.AIResponse && consultation.AIResponse.toLowerCase().includes(query.toLowerCase()))
    );
    renderAIConsultationsList(filtered);
}

// =========================
// RENDER FUNCTIONS
// =========================

function renderPatientsTable(patients) {
    const tableBody = document.getElementById("patientsTableBody");
    tableBody.innerHTML = "";

    if (patients.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">${t("noDataFound")}</td></tr>`;
        return;
    }

    patients.forEach(patient => {
        tableBody.innerHTML += `
            <tr>
                <td>${patient.PatientId}</td>
                <td>${patient.FullName}</td>
                <td>${patient.Gender}</td>
                <td>${patient.Phone}</td>
                <td>${patient.Email}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editPatient(${patient.PatientId})">
                        <i class="fa-solid fa-pen"></i> ${t("edit")}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deletePatient(${patient.PatientId})">
                        <i class="fa-solid fa-trash"></i> ${t("delete")}
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderDoctorsTable(doctors) {
    const tableBody = document.getElementById("doctorsTableBody");
    tableBody.innerHTML = "";

    if (doctors.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">${t("noDataFound")}</td></tr>`;
        return;
    }

    doctors.forEach(doctor => {
        let specialtyDisplay = "N/A";
        if (doctor.SpecialtyName && doctor.SpecialtyNameAr) {
            specialtyDisplay = `${doctor.SpecialtyName} / ${doctor.SpecialtyNameAr}`;
        } else if (doctor.SpecialtyName) {
            specialtyDisplay = doctor.SpecialtyName;
        } else if (doctor.SpecialtyNameAr) {
            specialtyDisplay = doctor.SpecialtyNameAr;
        }

        tableBody.innerHTML += `
            <tr>
                <td>${doctor.DoctorId}</td>
                <td>${doctor.FullName}</td>
                <td>${specialtyDisplay}</td>
                <td>${doctor.Phone}</td>
                <td>${doctor.Email}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editDoctor(${doctor.DoctorId})">
                        <i class="fa-solid fa-pen"></i> ${t("edit")}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDoctor(${doctor.DoctorId})">
                        <i class="fa-solid fa-trash"></i> ${t("delete")}
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderAppointmentsTable(appointments) {
    const tableBody = document.getElementById("appointmentsTableBody");
    tableBody.innerHTML = "";

    if (appointments.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">${t("noDataFound")}</td></tr>`;
        return;
    }

    appointments.forEach(appointment => {
        const statusClass = appointment.Status.toLowerCase();
        const statusText = t(statusClass) || appointment.Status;
        tableBody.innerHTML += `
            <tr>
                <td>${appointment.AppointmentId}</td>
                <td>${appointment.PatientName || appointment.PatientId}</td>
                <td>${appointment.DoctorName || appointment.DoctorId}</td>
                <td>${appointment.AppointmentDate.split("T")[0]}</td>
                <td>${new Date('1970-01-01T' + appointment.AppointmentTime).toLocaleTimeString([], {
                    hour: '2-digit', minute: '2-digit', hour12: true
                })}</td>
                <td><span class="status-badge status-${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editAppointment(${appointment.AppointmentId})">
                        <i class="fa-solid fa-pen"></i> ${t("edit")}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteAppointment(${appointment.AppointmentId})">
                        <i class="fa-solid fa-trash"></i> ${t("delete")}
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderMedicalRecordsTable(records) {
    const tableBody = document.getElementById("medicalRecordsTableBody");
    tableBody.innerHTML = "";

    if (records.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">${t("noDataFound")}</td></tr>`;
        return;
    }

    records.forEach(record => {
        tableBody.innerHTML += `
            <tr>
                <td>${record.RecordId}</td>
                <td>${record.PatientName}</td>
                <td>${record.DoctorName}</td>
                <td>${record.Symptoms}</td>
                <td>${record.Diagnosis}</td>
                <td>${record.Treatment || ""}</td>
                <td>${record.VisitDate.split("T")[0]}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2" onclick="editMedicalRecord(${record.RecordId})">
                        <i class="fa-solid fa-pen"></i> ${t("edit")}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMedicalRecord(${record.RecordId})">
                        <i class="fa-solid fa-trash"></i> ${t("delete")}
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderUsersTable(users) {
    const tableBody = document.getElementById("usersTableBody");
    tableBody.innerHTML = "";

    if (users.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">${t("noDataFound")}</td></tr>`;
        return;
    }

    users.forEach(user => {
        tableBody.innerHTML += `
            <tr>
                <td>${user.UserId}</td>
                <td>${user.Username}</td>
                <td><span class="status-badge status-${user.Role.toLowerCase()}">${user.Role}</span></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editUser(${user.UserId}, '${user.Username}', '${user.Role}')">
                        <i class="fa-solid fa-pen"></i> ${t("edit")}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.UserId})">
                        <i class="fa-solid fa-trash"></i> ${t("delete")}
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderPrescriptionsTable(prescriptions) {
    const tableBody = document.getElementById("prescriptionsTableBody");
    tableBody.innerHTML = "";

    if (prescriptions.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">${t("noDataFound")}</td></tr>`;
        return;
    }

    prescriptions.forEach(prescription => {
        tableBody.innerHTML += `
            <tr>
                <td>${prescription.PrescriptionId}</td>
                <td>${prescription.PatientName || "N/A"}</td>
                <td>${prescription.DoctorName || "N/A"}</td>
                <td>${prescription.MedicineName}</td>
                <td>${prescription.Dosage || "-"}</td>
                <td>${prescription.Instructions || "-"}</td>
                <td>${prescription.VisitDate ? prescription.VisitDate.split("T")[0] : "-"}</td>
                <td>
                    <button class="btn btn-info btn-sm me-1" onclick="printPrescriptionPDF(${prescription.PrescriptionId})" title="${t("printPDF")}">
                        <i class="fa-solid fa-file-pdf"></i>
                    </button>
                    <button class="btn btn-warning btn-sm me-1" onclick="editPrescription(${prescription.PrescriptionId})">
                        <i class="fa-solid fa-pen"></i> ${t("edit")}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deletePrescription(${prescription.PrescriptionId})">
                        <i class="fa-solid fa-trash"></i> ${t("delete")}
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderAIConsultationsList(consultations) {
    const container = document.getElementById("aiConsultationsList");
    container.innerHTML = "";

    if (consultations.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-4 text-muted">${t("noDataFound")}</div>`;
        return;
    }

    consultations.forEach(consultation => {
        const date = consultation.ConsultationDate ? new Date(consultation.ConsultationDate).toLocaleString() : "-";
        container.innerHTML += `
            <div class="col-md-6 mb-3">
                <div class="recent-section">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5><i class="fa-solid fa-user"></i> ${consultation.PatientName || "Unknown Patient"}</h5>
                        <span class="text-muted small">${date}</span>
                    </div>
                    <div class="mb-2">
                        <strong><i class="fa-solid fa-stethoscope text-primary"></i> Symptoms:</strong>
                        <p class="mb-1">${consultation.SymptomsText}</p>
                    </div>
                    <div class="mb-2">
                        <strong><i class="fa-solid fa-robot text-success"></i> AI Response:</strong>
                        <p class="mb-0 text-muted">${consultation.AIResponse}</p>
                    </div>
                    <div class="mt-3 text-end">
                        <button class="btn btn-danger btn-sm" onclick="deleteAIConsultation(${consultation.ConsultationId})">
                            <i class="fa-solid fa-trash"></i> ${t("delete")}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// =========================
// PATIENTS
// =========================

async function loadPatients() {
    const response = await secureFetch("http://localhost:4000/patients");
    if (!response) return;

    allPatients = await response.json();
    renderPatientsTable(allPatients);
}

function openPatientModal() {
    window.currentPatientId = null;
    document.getElementById("fullName").value = "";
    document.getElementById("gender").value = "Male";
    document.getElementById("birthDate").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("address").value = "";

    const modal = new bootstrap.Modal(document.getElementById("patientModal"));
    modal.show();
}

async function addPatient() {
    const patient = {
        fullName: document.getElementById("fullName").value,
        gender: document.getElementById("gender").value,
        birthDate: document.getElementById("birthDate").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value
    };

    const validation = Validation.validatePatientForm(patient);
    if (!Validation.showErrors(validation.errors)) {
        return;
    }

    const url = window.currentPatientId
        ? `http://localhost:4000/patients/${window.currentPatientId}`
        : "http://localhost:4000/patients";

    const method = window.currentPatientId ? "PUT" : "POST";

    const response = await secureFetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient)
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        const action = window.currentPatientId ? "updated" : "added";
        alert(`Patient ${action} successfully`);
        addActivity(window.currentPatientId ? "edit" : "add", `Patient ${patient.fullName} ${action}`);
        loadPatients();
        refreshStats();
        window.currentPatientId = null;
        bootstrap.Modal.getInstance(document.getElementById("patientModal")).hide();
    } else {
        alert(data.message);
    }
}

async function deletePatient(id) {
    if (!confirm(t("confirmDelete"))) return;

    const response = await secureFetch(`http://localhost:4000/patients/${id}`, {
        method: "DELETE"
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        alert("Patient deleted successfully");
        addActivity("delete", `Patient #${id} deleted`);
        loadPatients();
        refreshStats();
    } else {
        alert(data.message);
    }
}

async function editPatient(id) {
    const response = await secureFetch(`http://localhost:4000/patients/${id}`);
    if (!response) return;

    const patient = await response.json();

    document.getElementById("fullName").value = patient.FullName;
    document.getElementById("gender").value = patient.Gender;
    document.getElementById("birthDate").value = patient.BirthDate.split("T")[0];
    document.getElementById("phone").value = patient.Phone;
    document.getElementById("email").value = patient.Email;
    document.getElementById("address").value = patient.Address;

    window.currentPatientId = id;

    const modal = new bootstrap.Modal(document.getElementById("patientModal"));
    modal.show();
}

// =========================
// DOCTORS
// =========================

async function loadDoctors() {
    const response = await secureFetch("http://localhost:4000/doctors");
    if (!response) return;

    allDoctors = await response.json();
    renderDoctorsTable(allDoctors);
}

async function deleteDoctor(id) {
    if (!confirm(t("confirmDelete"))) return;

    const response = await secureFetch(`http://localhost:4000/doctors/${id}`, {
        method: "DELETE"
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        alert("Doctor deleted successfully");
        addActivity("delete", `Doctor #${id} deleted`);
        loadDoctors();
        refreshStats();
    } else {
        alert(data.message);
    }
}

async function openDoctorModal() {
    window.currentDoctorId = null;
    document.getElementById("doctorFullName").value = "";
    document.getElementById("doctorPhone").value = "";
    document.getElementById("doctorEmail").value = "";
    document.getElementById("doctorSpecialtyId").value = "";

    const specialtySelect = document.getElementById("doctorSpecialtyId");
    specialtySelect.innerHTML = `<option value="">${t("selectSpecialty")}</option>`;

    const response = await secureFetch("http://localhost:4000/specialties");
    if (!response) return;

    const specialties = await response.json();

    specialties.forEach(specialty => {
        const displayName = specialty.SpecialtyNameAr 
            ? `${specialty.SpecialtyName} / ${specialty.SpecialtyNameAr}`
            : specialty.SpecialtyName;

        specialtySelect.innerHTML += `
            <option value="${specialty.SpecialtyId}">${displayName}</option>
        `;
    });

    const modal = new bootstrap.Modal(document.getElementById("doctorModal"));
    modal.show();
}

async function addDoctor() {
    const doctor = {
        fullName: document.getElementById("doctorFullName").value,
        phone: document.getElementById("doctorPhone").value,
        email: document.getElementById("doctorEmail").value,
        specialtyId: document.getElementById("doctorSpecialtyId").value
    };

    const validation = Validation.validateDoctorForm(doctor);
    if (!Validation.showErrors(validation.errors)) {
        return;
    }

    const url = window.currentDoctorId
        ? `http://localhost:4000/doctors/${window.currentDoctorId}`
        : "http://localhost:4000/doctors";

    const method = window.currentDoctorId ? "PUT" : "POST";

    const response = await secureFetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctor)
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        const action = window.currentDoctorId ? "updated" : "added";
        alert(`Doctor ${action} successfully`);
        addActivity(window.currentDoctorId ? "edit" : "add", `Doctor ${doctor.fullName} ${action}`);
        loadDoctors();
        refreshStats();
        window.currentDoctorId = null;
        bootstrap.Modal.getInstance(document.getElementById("doctorModal")).hide();
    } else {
        alert(data.message);
    }
}

async function editDoctor(id) {
    const response = await secureFetch("http://localhost:4000/doctors");
    if (!response) return;

    const doctors = await response.json();
    const doctor = doctors.find(d => d.DoctorId === id);

    if (!doctor) {
        alert("Doctor not found");
        return;
    }

    window.currentDoctorId = id;
    document.getElementById("doctorFullName").value = doctor.FullName;
    document.getElementById("doctorPhone").value = doctor.Phone;
    document.getElementById("doctorEmail").value = doctor.Email;

    const specialtySelect = document.getElementById("doctorSpecialtyId");
    specialtySelect.innerHTML = `<option value="">${t("selectSpecialty")}</option>`;

    const specialtiesResponse = await secureFetch("http://localhost:4000/specialties");
    if (!specialtiesResponse) return;

    const specialties = await specialtiesResponse.json();

    specialties.forEach(specialty => {
        const displayName = specialty.SpecialtyNameAr 
            ? `${specialty.SpecialtyName} / ${specialty.SpecialtyNameAr}`
            : specialty.SpecialtyName;

        specialtySelect.innerHTML += `
            <option value="${specialty.SpecialtyId}">${displayName}</option>
        `;
    });

    document.getElementById("doctorSpecialtyId").value = doctor.SpecialtyId;

    const modal = new bootstrap.Modal(document.getElementById("doctorModal"));
    modal.show();
}

// =========================
// APPOINTMENTS
// =========================

async function loadAppointments() {
    const response = await secureFetch("http://localhost:4000/appointments");
    if (!response) return;

    allAppointments = await response.json();
    renderAppointmentsTable(allAppointments);
}

async function openAppointmentModal() {
    const patientSelect = document.getElementById("appointmentPatientId");
    const doctorSelect = document.getElementById("appointmentDoctorId");

    patientSelect.innerHTML = "";
    doctorSelect.innerHTML = "";

    const patientsResponse = await secureFetch("http://localhost:4000/patients");
    if (!patientsResponse) return;
    const patients = await patientsResponse.json();

    patients.forEach(patient => {
        patientSelect.innerHTML += `
            <option value="${patient.PatientId}">${patient.FullName}</option>
        `;
    });

    const doctorsResponse = await secureFetch("http://localhost:4000/doctors");
    if (!doctorsResponse) return;
    const doctors = await doctorsResponse.json();

    doctors.forEach(doctor => {
        doctorSelect.innerHTML += `
            <option value="${doctor.DoctorId}">${doctor.FullName}</option>
        `;
    });

    if (!window.currentAppointmentId) {
        document.getElementById("appointmentPatientId").value = "";
        document.getElementById("appointmentDoctorId").value = "";
        document.getElementById("appointmentDate").value = "";
        document.getElementById("appointmentTime").value = "";
        document.getElementById("appointmentStatus").value = "Scheduled";
    }

    const modal = new bootstrap.Modal(document.getElementById("appointmentModal"));
    modal.show();
}

async function addAppointment() {
    const appointment = {
        patientId: document.getElementById("appointmentPatientId").value,
        doctorId: document.getElementById("appointmentDoctorId").value,
        appointmentDate: document.getElementById("appointmentDate").value,
        appointmentTime: document.getElementById("appointmentTime").value,
        status: document.getElementById("appointmentStatus").value
    };

    const validation = Validation.validateAppointmentForm(appointment);
    if (!Validation.showErrors(validation.errors)) {
        return;
    }

    const url = window.currentAppointmentId
        ? `http://localhost:4000/appointments/${window.currentAppointmentId}`
        : "http://localhost:4000/appointments";

    const method = window.currentAppointmentId ? "PUT" : "POST";

    const response = await secureFetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment)
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        const action = window.currentAppointmentId ? "updated" : "added";
        alert(`Appointment ${action} successfully`);
        addActivity("appointment", `Appointment ${action}`);
        loadAppointments();
        refreshStats();
        window.currentAppointmentId = null;
        bootstrap.Modal.getInstance(document.getElementById("appointmentModal")).hide();
    } else {
        alert(data.message);
    }
}

async function deleteAppointment(id) {
    if (!confirm(t("confirmDelete"))) return;

    const response = await secureFetch(`http://localhost:4000/appointments/${id}`, {
        method: "DELETE"
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        alert("Appointment deleted successfully");
        addActivity("delete", `Appointment #${id} deleted`);
        loadAppointments();
        refreshStats();
    } else {
        alert(data.message);
    }
}

async function editAppointment(id) {
    const response = await secureFetch("http://localhost:4000/appointments");
    if (!response) return;

    const appointments = await response.json();
    const appointment = appointments.find(a => a.AppointmentId === id);

    if (!appointment) {
        alert("Appointment not found");
        return;
    }

    window.currentAppointmentId = id;
    await openAppointmentModal();

    document.getElementById("appointmentPatientId").value = appointment.PatientId;
    document.getElementById("appointmentDoctorId").value = appointment.DoctorId;

    const dateValue = appointment.AppointmentDate || appointment.appointmentDate;
    const timeValue = appointment.AppointmentTime || appointment.appointmentTime;

    document.getElementById("appointmentDate").value = dateValue ? dateValue.split("T")[0] : "";
    document.getElementById("appointmentTime").value = timeValue ? timeValue.slice(0, 5) : "";
    document.getElementById("appointmentStatus").value = appointment.Status;
}

// =========================
// MEDICAL RECORDS
// =========================

async function loadMedicalRecords() {
    const response = await secureFetch("http://localhost:4000/medical-records");
    if (!response) return;

    allMedicalRecords = await response.json();
    renderMedicalRecordsTable(allMedicalRecords);
}

async function openMedicalRecordModal() {
    const patientsResponse = await secureFetch("http://localhost:4000/patients");
    const doctorsResponse = await secureFetch("http://localhost:4000/doctors");

    if (!patientsResponse || !doctorsResponse) return;

    const patients = await patientsResponse.json();
    const doctors = await doctorsResponse.json();

    const patientSelect = document.getElementById("recordPatientId");
    const doctorSelect = document.getElementById("recordDoctorId");

    patientSelect.innerHTML = `<option value="">${t("patient")}</option>`;
    doctorSelect.innerHTML = `<option value="">${t("doctor")}</option>`;

    patients.forEach(patient => {
        patientSelect.innerHTML += `
            <option value="${patient.PatientId}">${patient.FullName}</option>
        `;
    });

    doctors.forEach(doctor => {
        doctorSelect.innerHTML += `
            <option value="${doctor.DoctorId}">${doctor.FullName}</option>
        `;
    });

    document.getElementById("recordSymptoms").value = "";
    document.getElementById("recordDiagnosis").value = "";
    document.getElementById("recordTreatment").value = "";
    document.getElementById("recordVisitDate").value = "";

    window.currentMedicalRecordId = null;

    const modal = new bootstrap.Modal(document.getElementById("medicalRecordModal"));
    modal.show();
}

async function addMedicalRecord() {
    const record = {
        patientId: document.getElementById("recordPatientId").value,
        doctorId: document.getElementById("recordDoctorId").value,
        symptoms: document.getElementById("recordSymptoms").value,
        diagnosis: document.getElementById("recordDiagnosis").value,
        treatment: document.getElementById("recordTreatment").value,
        visitDate: document.getElementById("recordVisitDate").value
    };

    const validation = Validation.validateMedicalRecordForm(record);
    if (!Validation.showErrors(validation.errors)) {
        return;
    }

    const url = window.currentMedicalRecordId
        ? `http://localhost:4000/medical-records/${window.currentMedicalRecordId}`
        : "http://localhost:4000/medical-records";

    const method = window.currentMedicalRecordId ? "PUT" : "POST";

    const response = await secureFetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record)
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        const action = window.currentMedicalRecordId ? "updated" : "added";
        alert(`Medical record ${action} successfully`);
        addActivity("add", `Medical record ${action}`);
        loadMedicalRecords();
        refreshStats();
        window.currentMedicalRecordId = null;
        bootstrap.Modal.getInstance(document.getElementById("medicalRecordModal")).hide();
    } else {
        alert(data.message);
    }
}

async function deleteMedicalRecord(id) {
    if (!confirm(t("confirmDelete"))) return;

    const response = await secureFetch(`http://localhost:4000/medical-records/${id}`, {
        method: "DELETE"
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        alert("Medical record deleted");
        addActivity("delete", `Medical record #${id} deleted`);
        loadMedicalRecords();
        refreshStats();
    } else {
        alert(data.message);
    }
}

async function editMedicalRecord(id) {
    const response = await secureFetch("http://localhost:4000/medical-records");
    if (!response) return;

    const records = await response.json();
    const record = records.find(r => r.RecordId === id);

    if (!record) {
        alert("Record not found");
        return;
    }

    await openMedicalRecordModal();

    window.currentMedicalRecordId = id;
    document.getElementById("recordPatientId").value = record.PatientId;
    document.getElementById("recordDoctorId").value = record.DoctorId;
    document.getElementById("recordSymptoms").value = record.Symptoms;
    document.getElementById("recordDiagnosis").value = record.Diagnosis;
    document.getElementById("recordTreatment").value = record.Treatment;
    document.getElementById("recordVisitDate").value = record.VisitDate.split("T")[0];
}

// =========================
// PRESCRIPTIONS
// =========================

async function loadPrescriptions() {
    const response = await secureFetch("http://localhost:4000/prescriptions");
    if (!response) return;

    allPrescriptions = await response.json();
    renderPrescriptionsTable(allPrescriptions);
}

async function openPrescriptionModal() {
    window.currentPrescriptionId = null;

    // Load medical records for dropdown
    const recordsResponse = await secureFetch("http://localhost:4000/medical-records");
    if (!recordsResponse) return;

    const records = await recordsResponse.json();
    const recordSelect = document.getElementById("prescriptionRecordId");
    recordSelect.innerHTML = `<option value="">${t("selectRecord")}</option>`;

    records.forEach(record => {
        recordSelect.innerHTML += `
            <option value="${record.RecordId}">${record.PatientName} - ${record.VisitDate.split("T")[0]}</option>
        `;
    });

    document.getElementById("prescriptionMedicineName").value = "";
    document.getElementById("prescriptionDosage").value = "";
    document.getElementById("prescriptionInstructions").value = "";

    const modal = new bootstrap.Modal(document.getElementById("prescriptionModal"));
    modal.show();
}

async function savePrescription() {
    const prescription = {
        recordId: document.getElementById("prescriptionRecordId").value,
        medicineName: document.getElementById("prescriptionMedicineName").value,
        dosage: document.getElementById("prescriptionDosage").value,
        instructions: document.getElementById("prescriptionInstructions").value
    };

    if (!prescription.recordId || !prescription.medicineName) {
        alert("Record and Medicine Name are required");
        return;
    }

    const url = window.currentPrescriptionId
        ? `http://localhost:4000/prescriptions/${window.currentPrescriptionId}`
        : "http://localhost:4000/prescriptions";

    const method = window.currentPrescriptionId ? "PUT" : "POST";

    const response = await secureFetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescription)
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        const action = window.currentPrescriptionId ? "updated" : "added";
        alert(`Prescription ${action} successfully`);
        addActivity("add", `Prescription ${action}`);
        loadPrescriptions();
        window.currentPrescriptionId = null;
        bootstrap.Modal.getInstance(document.getElementById("prescriptionModal")).hide();
    } else {
        alert(data.message);
    }
}

async function deletePrescription(id) {
    if (!confirm(t("confirmDelete"))) return;

    const response = await secureFetch(`http://localhost:4000/prescriptions/${id}`, {
        method: "DELETE"
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        alert("Prescription deleted successfully");
        addActivity("delete", `Prescription #${id} deleted`);
        loadPrescriptions();
    } else {
        alert(data.message);
    }
}

async function editPrescription(id) {
    const response = await secureFetch("http://localhost:4000/prescriptions");
    if (!response) return;

    const prescriptions = await response.json();
    const prescription = prescriptions.find(p => p.PrescriptionId === id);

    if (!prescription) {
        alert("Prescription not found");
        return;
    }

    await openPrescriptionModal();

    window.currentPrescriptionId = id;
    document.getElementById("prescriptionRecordId").value = prescription.RecordId;
    document.getElementById("prescriptionMedicineName").value = prescription.MedicineName;
    document.getElementById("prescriptionDosage").value = prescription.Dosage || "";
    document.getElementById("prescriptionInstructions").value = prescription.Instructions || "";
}

// =========================
// AI CONSULTATIONS
// =========================

async function loadAIConsultations() {
    const response = await secureFetch("http://localhost:4000/ai-consultations");
    if (!response) return;

    allAIConsultations = await response.json();
    renderAIConsultationsList(allAIConsultations);
}

async function deleteAIConsultation(id) {
    if (!confirm(t("confirmDelete"))) return;

    const response = await secureFetch(`http://localhost:4000/ai-consultations/${id}`, {
        method: "DELETE"
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        alert("AI Consultation deleted successfully");
        addActivity("delete", `AI Consultation #${id} deleted`);
        loadAIConsultations();
    } else {
        alert(data.message);
    }
}

async function aiSuggestMedicalRecord() {
    const symptoms = document.getElementById("recordSymptoms").value;
    const patientId = document.getElementById("recordPatientId").value;
    const aiButton = document.getElementById("aiSuggestButton");

    if (!symptoms || symptoms.trim() === "") {
        alert(t("enterSymptoms"));
        return;
    }

    try {
        aiButton.disabled = true;
        aiButton.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${t("generating")}`;

        const response = await secureFetch("http://localhost:4000/api/ai/suggest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                symptoms: symptoms,
                patientId: patientId || null
            })
        });

        if (!response) return;

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "AI suggestion failed");
            return;
        }

        const cleanText = data.suggestion.replace(/\*\*/g, "");

        const arabicRegex = /[؀-ۿ]/;
        const isArabic = arabicRegex.test(cleanText);

        let diagnosisText = "";
        let treatmentText = "";

        if (isArabic) {
            const treatmentMatch = cleanText.match(/2\.\s*العلاج\s*المقتر[وح]:\s*([\s\S]*)/i);

            diagnosisText = cleanText
                .replace(/1\.\s*التشخيص\s*المحتمل:\s*/i, "")
                .replace(/2\.\s*العلاج\s*المقتر[وح]:[\s\S]*/i, "")
                .trim();

            treatmentText = treatmentMatch ? treatmentMatch[1].trim() : "";
        } else {
            const treatmentMatch = cleanText.match(/2\.\s*Suggested Treatment:\s*([\s\S]*)/i);

            diagnosisText = cleanText
                .replace(/1\.\s*Possible Diagnosis:\s*/i, "")
                .replace(/2\.\s*Suggested Treatment:[\s\S]*/i, "")
                .trim();

            treatmentText = treatmentMatch ? treatmentMatch[1].trim() : "";
        }

        document.getElementById("recordDiagnosis").value = diagnosisText;
        document.getElementById("recordTreatment").value = treatmentText;

        addActivity("add", "AI suggestion generated");

    } catch (error) {
        console.log(error);
        alert("AI suggestion failed");
    } finally {
        aiButton.disabled = false;
        aiButton.innerHTML = `<i class="fa-solid fa-robot"></i> ${t("aiSuggest")}`;
    }
}

// =========================
// REPORTS MODULE
// =========================

async function loadReports() {
    if (!checkRoleAccess("Admin")) {
        alert(t("accessDenied"));
        showSection("dashboardSection");
        return;
    }

    const statsResponse = await secureFetch("http://localhost:4000/reports/statistics");
    if (!statsResponse) return;
    const stats = await statsResponse.json();

    document.getElementById("reportTotalPatients").innerText = stats.TotalPatients;
    document.getElementById("reportTotalDoctors").innerText = stats.TotalDoctors;
    document.getElementById("reportTotalAppointments").innerText = stats.TotalAppointments;
    document.getElementById("reportTotalRecords").innerText = stats.TotalRecords;
    document.getElementById("reportScheduled").innerText = stats.ScheduledAppointments;
    document.getElementById("reportCompleted").innerText = stats.CompletedAppointments;
    document.getElementById("reportCancelled").innerText = stats.CancelledAppointments;

    await loadAppointmentsReport();
    await loadDoctorsReport();
    await loadPatientsReport();
}

async function loadAppointmentsReport() {
    const response = await secureFetch("http://localhost:4000/reports/appointments");
    if (!response) return;

    const appointments = await response.json();
    const tableBody = document.getElementById("reportsAppointmentsTable");
    tableBody.innerHTML = "";

    appointments.forEach(appointment => {
        const statusClass = appointment.Status.toLowerCase();
        const statusText = t(statusClass) || appointment.Status;
        tableBody.innerHTML += `
            <tr>
                <td>${appointment.AppointmentId}</td>
                <td>${appointment.PatientName}</td>
                <td>${appointment.DoctorName}</td>
                <td>${appointment.AppointmentDate.split("T")[0]}</td>
                <td>${appointment.AppointmentTime}</td>
                <td><span class="status-badge status-${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });
}

async function filterAppointments() {
    const startDate = document.getElementById("reportStartDate").value;
    const endDate = document.getElementById("reportEndDate").value;
    const status = document.getElementById("reportStatus").value;

    let url = "http://localhost:4000/reports/appointments?";
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}&`;
    if (status) url += `status=${status}&`;

    const response = await secureFetch(url);
    if (!response) return;

    const appointments = await response.json();
    const tableBody = document.getElementById("reportsAppointmentsTable");
    tableBody.innerHTML = "";

    appointments.forEach(appointment => {
        const statusClass = appointment.Status.toLowerCase();
        const statusText = t(statusClass) || appointment.Status;
        tableBody.innerHTML += `
            <tr>
                <td>${appointment.AppointmentId}</td>
                <td>${appointment.PatientName}</td>
                <td>${appointment.DoctorName}</td>
                <td>${appointment.AppointmentDate.split("T")[0]}</td>
                <td>${appointment.AppointmentTime}</td>
                <td><span class="status-badge status-${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });

    addActivity("add", `Appointments filtered: ${appointments.length} results`);
}

async function loadDoctorsReport() {
    const response = await secureFetch("http://localhost:4000/reports/doctors");
    if (!response) return;

    const doctors = await response.json();
    const tableBody = document.getElementById("reportsDoctorsTable");
    tableBody.innerHTML = "";

    doctors.forEach(doctor => {
        tableBody.innerHTML += `
            <tr>
                <td>${doctor.DoctorId}</td>
                <td>${doctor.FullName}</td>
                <td>${doctor.SpecialtyName || "N/A"}</td>
                <td>${doctor.TotalAppointments}</td>
                <td>${doctor.TotalRecords}</td>
            </tr>
        `;
    });
}

async function loadPatientsReport() {
    const response = await secureFetch("http://localhost:4000/reports/patients");
    if (!response) return;

    const patients = await response.json();
    const tableBody = document.getElementById("reportsPatientsTable");
    tableBody.innerHTML = "";

    patients.forEach(patient => {
        tableBody.innerHTML += `
            <tr>
                <td>${patient.PatientId}</td>
                <td>${patient.FullName}</td>
                <td>${patient.Gender}</td>
                <td>${patient.TotalAppointments}</td>
                <td>${patient.TotalRecords}</td>
            </tr>
        `;
    });
}

function exportReport() {
    const table = document.getElementById("reportsAppointmentsTable");
    if (!table || table.rows.length === 0) {
        alert("No data to export");
        return;
    }

    const data = [];
    data.push(["ID", "Patient", "Doctor", "Date", "Time", "Status"]);

    for (let row of table.rows) {
        const cells = row.cells;
        data.push([
            cells[0].innerText,
            cells[1].innerText,
            cells[2].innerText,
            cells[3].innerText,
            cells[4].innerText,
            cells[5].innerText
        ]);
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    ws['!cols'] = [
        {wch: 8}, {wch: 25}, {wch: 25}, {wch: 12}, {wch: 10}, {wch: 12}
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Appointments Report");

    const date = new Date().toISOString().split("T")[0];
    const filename = `appointments_report_${date}.xlsx`;

    XLSX.writeFile(wb, filename);

    addActivity("add", "Report exported to Excel");
    alert("Report exported successfully!");
}

// =========================
// USERS (Admin Only)
// =========================

async function loadUsers() {
    if (!checkRoleAccess("Admin")) {
        alert(t("accessDenied"));
        showSection("dashboardSection");
        return;
    }

    const response = await secureFetch("http://localhost:4000/users");
    if (!response) return;

    allUsers = await response.json();
    renderUsersTable(allUsers);
}

function openUserModal() {
    if (!checkRoleAccess("Admin")) {
        alert(t("accessDenied"));
        return;
    }

    window.currentUserId = null;
    document.getElementById("userUsername").value = "";
    document.getElementById("userPassword").value = "";
    document.getElementById("userRole").value = "Receptionist";

    const modal = new bootstrap.Modal(document.getElementById("userModal"));
    modal.show();
}

async function saveUser() {
    if (!checkRoleAccess("Admin")) {
        alert(t("accessDenied"));
        return;
    }

    const user = {
        username: document.getElementById("userUsername").value,
        password: document.getElementById("userPassword").value,
        role: document.getElementById("userRole").value
    };

    const validation = Validation.validateUserForm(user, !!window.currentUserId);
    if (!Validation.showErrors(validation.errors)) {
        return;
    }

    let url = "http://localhost:4000/users/register";
    let method = "POST";
    let bodyData = { username: user.username, password: user.password, role: user.role };

    if (window.currentUserId) {
        url = `http://localhost:4000/users/${window.currentUserId}`;
        method = "PUT";
        bodyData = { username: user.username, role: user.role };
    }

    const response = await secureFetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        alert("User saved successfully");
        addActivity(window.currentUserId ? "edit" : "add", `User ${user.username} ${window.currentUserId ? 'updated' : 'added'}`);
        loadUsers();
        refreshStats();
        bootstrap.Modal.getInstance(document.getElementById("userModal")).hide();
    } else {
        alert(data.message);
    }
}

async function deleteUser(id) {
    if (!checkRoleAccess("Admin")) {
        alert(t("accessDenied"));
        return;
    }

    if (!confirm(t("confirmDelete"))) return;

    const response = await secureFetch(`http://localhost:4000/users/${id}`, {
        method: "DELETE"
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        alert("User deleted successfully");
        addActivity("delete", `User #${id} deleted`);
        loadUsers();
        refreshStats();
    } else {
        alert(data.message);
    }
}

function editUser(id, username, role) {
    if (!checkRoleAccess("Admin")) {
        alert(t("accessDenied"));
        return;
    }

    window.currentUserId = id;
    document.getElementById("userUsername").value = username;
    document.getElementById("userPassword").value = "";
    document.getElementById("userRole").value = role;

    const modal = new bootstrap.Modal(document.getElementById("userModal"));
    modal.show();
}

// =========================
// ROLE PERMISSIONS
// =========================

function applyRolePermissions() {
    const role = localStorage.getItem("role");
    const welcomeEl = document.getElementById("welcomeMessage");
    if (welcomeEl) {
        welcomeEl.innerText = `${t("welcome")} ${role}`;
    }

    if (role === "Admin") {
        return;
    }

    if (role === "Doctor") {
        const usersMenu = document.querySelector(`li[onclick*="usersSection"]`);
        const reportsMenu = document.querySelector(`li[onclick*="reportsSection"]`);
        if (usersMenu) usersMenu.style.display = "none";
        if (reportsMenu) reportsMenu.style.display = "none";
        return;
    }

    if (role === "Receptionist") {
        const doctorsMenu = document.querySelector(`li[onclick*="doctorsSection"]`);
        const medicalRecordsMenu = document.querySelector(`li[onclick*="medicalRecordsSection"]`);
        const usersMenu = document.querySelector(`li[onclick*="usersSection"]`);
        const reportsMenu = document.querySelector(`li[onclick*="reportsSection"]`);
        const prescriptionsMenu = document.querySelector(`li[onclick*="prescriptionsSection"]`);
        const aiConsultationsMenu = document.querySelector(`li[onclick*="aiConsultationsSection"]`);

        if (doctorsMenu) doctorsMenu.style.display = "none";
        if (medicalRecordsMenu) medicalRecordsMenu.style.display = "none";
        if (usersMenu) usersMenu.style.display = "none";
        if (reportsMenu) reportsMenu.style.display = "none";
        if (prescriptionsMenu) prescriptionsMenu.style.display = "none";
        if (aiConsultationsMenu) aiConsultationsMenu.style.display = "none";

        const quickActions = document.querySelectorAll('.quick-action-btn');
        quickActions.forEach(btn => {
            const onclickAttr = btn.getAttribute('onclick') || '';
            if (onclickAttr.includes('doctorsSection') || onclickAttr.includes('medicalRecordsSection')) {
                btn.style.display = "none";
            }
        });
        return;
    }
}

// =========================
// CHATBOT
// =========================

function toggleChatbot() {
    const chatbot = document.getElementById("chatbotContainer");
    if (chatbot.style.display === "flex") {
        chatbot.style.display = "none";
    } else {
        chatbot.style.display = "flex";
    }
}

function handleChatbotEnter(event) {
    if (event.key === "Enter") {
        sendChatbotMessage();
    }
}

async function sendChatbotMessage() {
    const input = document.getElementById("chatbotInput");
    const messagesBox = document.getElementById("chatbotMessages");

    const message = input.value.trim();
    if (!message) return;

    messagesBox.innerHTML += `<div class="user-message">${message}</div>`;
    input.value = "";

    messagesBox.innerHTML += `
        <div class="bot-message" id="chatbotLoading">
            <i class="fa-solid fa-spinner fa-spin"></i> Typing...
        </div>
    `;

    messagesBox.scrollTop = messagesBox.scrollHeight;

    try {
        const response = await secureFetch("http://localhost:4000/api/ai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        if (!response) return;

        const data = await response.json();

        document.getElementById("chatbotLoading").remove();

        if (response.ok) {
            messagesBox.innerHTML += `<div class="bot-message">${data.reply}</div>`;
        } else {
            messagesBox.innerHTML += `<div class="bot-message">${data.message || "Chatbot failed to respond."}</div>`;
        }

    } catch (error) {
        console.log(error);
        document.getElementById("chatbotLoading").remove();
        messagesBox.innerHTML += `<div class="bot-message">Chatbot failed to respond.</div>`;
    }

    messagesBox.scrollTop = messagesBox.scrollHeight;
}


// =========================
// PRINT PRESCRIPTION PDF (window.print + html2canvas - Full Arabic Support)
// =========================

async function printPrescriptionPDF(prescriptionId) {
    const prescription = allPrescriptions.find(p => p.PrescriptionId === prescriptionId);
    if (!prescription) {
        alert(t("noDataFound"));
        return;
    }

    const btn = document.querySelector(`button[onclick="printPrescriptionPDF(${prescriptionId})"]`);
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        const isRTL = I18n.currentLang === 'ar';
        const dateStr = prescription.VisitDate ? prescription.VisitDate.split("T")[0] : new Date().toISOString().split("T")[0];
        const timeStr = new Date().toLocaleTimeString();

        // Build HTML content for the prescription
        const htmlContent = `
<!DOCTYPE html>
<html lang="${isRTL ? 'ar' : 'en'}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <title>${isRTL ? 'وصفة طبية' : 'Medical Prescription'} - ${prescription.PatientName || 'Patient'}</title>
    <style>
        @page { size: A4; margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', 'Arial', sans-serif;
            background: #fff;
            color: #1e293b;
            padding: 20mm;
            width: 210mm;
            min-height: 297mm;
        }
        .header {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 { font-size: 28px; margin: 0; }
        .header p { font-size: 14px; margin: 5px 0 0 0; opacity: 0.9; }
        .info-row {
            display: flex;
            justify-content: space-between;
            background: #f1f5f9;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .info-row > div:first-child p:first-child,
        .info-row > div:last-child p:first-child { font-size: 12px; color: #64748b; margin: 0; }
        .info-row > div:first-child p:last-child,
        .info-row > div:last-child p:last-child { font-size: 13px; color: #1e293b; margin: 5px 0 0 0; }
        .info-row > div:last-child { text-align: right; }
        .card-row {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            flex: 1;
            border: 2px solid #1e40af;
            border-radius: 10px;
            padding: 15px;
        }
        .card h3 { color: #1e40af; font-size: 14px; margin: 0 0 10px 0; font-weight: 600; }
        .card p { margin: 0; font-size: 13px; color: #1e293b; }
        .card p.small { margin: 5px 0 0 0; font-size: 12px; color: #475569; }
        .section-title {
            color: #1e40af;
            font-size: 18px;
            margin: 0 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
        }
        .medicine-box {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 15px;
        }
        .medicine-box p.label { font-size: 13px; color: #64748b; font-weight: 600; margin: 0 0 8px 0; }
        .medicine-box p.value { font-size: 16px; color: #1e293b; font-weight: 700; margin: 0; }
        .medicine-box p.dosage { font-size: 14px; color: #1e293b; margin: 15px 0 0 0; }
        .instructions-box {
            background: #fffbeb;
            border: 2px solid #f59e0b;
            padding: 20px;
            border-radius: 10px;
        }
        .instructions-box p.label { font-size: 13px; color: #b45309; font-weight: 600; margin: 0 0 8px 0; }
        .instructions-box p.value { font-size: 14px; color: #1e293b; line-height: 1.6; margin: 0; }
        .footer {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .footer .note { font-size: 11px; color: #94a3b8; font-style: italic; }
        .footer .signature { text-align: center; }
        .footer .signature .line { border-top: 2px solid #1e293b; width: 150px; margin-bottom: 8px; }
        .footer .signature p { margin: 0; font-size: 13px; color: #1e293b; font-weight: 600; }
        @media print {
            body { padding: 0; }
            .no-print { display: none; }
        }
        .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e40af;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
        }
        .print-btn:hover { background: #1e3a8a; }
        .download-btn {
            position: fixed;
            top: 20px;
            right: 140px;
            background: #10b981;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
        }
    </style>
</head>
<body>
    <button class="print-btn no-print" onclick="window.print()">🖨️ ${isRTL ? 'طباعة' : 'Print'}</button>
    <button class="download-btn no-print" onclick="downloadPDF()">💾 ${isRTL ? 'تحميل PDF' : 'Download PDF'}</button>

    <div class="header">
        <h1>${isRTL ? '🏥 العيادة الذكية' : '🏥 Smart Clinic'}</h1>
        <p>${isRTL ? 'وصفة طبية' : 'Medical Prescription'}</p>
    </div>

    <div class="info-row">
        <div>
            <p>${isRTL ? 'معلومات العيادة' : 'Clinic Info'}</p>
            <p>${isRTL ? 'نظام العيادة الذكية' : 'Smart Clinic System'}</p>
            <p style="margin-top:2px; font-size:12px; color:#475569;">${isRTL ? 'هاتف: +963-xxx-xxx-xxx' : 'Phone: +963-xxx-xxx-xxx'}</p>
        </div>
        <div>
            <p>${isRTL ? 'وصفة رقم' : 'Prescription #'}${prescription.PrescriptionId}</p>
            <p>${isRTL ? 'التاريخ:' : 'Date:'} ${dateStr}</p>
            <p style="margin-top:2px; font-size:12px; color:#475569;">${isRTL ? 'الوقت:' : 'Time:'} ${timeStr}</p>
        </div>
    </div>

    <div class="card-row">
        <div class="card">
            <h3>${isRTL ? '👤 معلومات المريض' : '👤 PATIENT INFORMATION'}</h3>
            <p><strong>${isRTL ? 'الاسم:' : 'Name:'}</strong> ${prescription.PatientName || 'N/A'}</p>
            <p class="small">${isRTL ? 'رقم المريض:' : 'Patient ID:'} ${prescription.PatientId || 'N/A'}</p>
        </div>
        <div class="card">
            <h3>${isRTL ? '👨‍⚕️ معلومات الطبيب' : '👨‍⚕️ DOCTOR INFORMATION'}</h3>
            <p><strong>${isRTL ? 'الاسم:' : 'Name:'}</strong> ${prescription.DoctorName || 'N/A'}</p>
            <p class="small">${isRTL ? 'رقم الطبيب:' : 'Doctor ID:'} ${prescription.DoctorId || 'N/A'}</p>
        </div>
    </div>

    <h2 class="section-title">${isRTL ? '💊 الوصفة الطبية' : '💊 PRESCRIPTION'}</h2>

    <div class="medicine-box">
        <p class="label">${isRTL ? 'الدواء:' : 'Medicine:'}</p>
        <p class="value">${prescription.MedicineName || 'N/A'}</p>
        <p class="dosage"><strong>${isRTL ? 'الجرعة:' : 'Dosage:'}</strong> ${prescription.Dosage || (isRTL ? 'حسب توجيهات الطبيب' : 'As directed by physician')}</p>
    </div>

    <div class="instructions-box">
        <p class="label">⚠️ ${isRTL ? 'التعليمات:' : 'Instructions:'}</p>
        <p class="value">${prescription.Instructions || (isRTL ? 'اتبع تعليمات الطبيب.' : 'Take as prescribed by your doctor.')}</p>
    </div>

    <div class="footer">
        <div class="note">
            <p>${isRTL ? 'تم إنشاء هذه الوصفة بواسطة نظام العيادة الذكية.' : 'Generated by Smart Clinic System.'}</p>
            <p>${isRTL ? 'يرجى استشارة الطبيب لأي استفسارات.' : 'Please consult your doctor for any questions.'}</p>
        </div>
        <div class="signature">
            <div class="line"></div>
            <p>${isRTL ? 'توقيع الطبيب' : "Doctor's Signature"}</p>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script>
        async function downloadPDF() {
            const btn = document.querySelector('.download-btn');
            btn.textContent = '${isRTL ? 'جاري التحميل...' : 'Downloading...'}';
            btn.disabled = true;
            try {
                const canvas = await html2canvas(document.body, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    onclone: function(clonedDoc) {
                        const btns = clonedDoc.querySelectorAll('.no-print');
                        btns.forEach(b => b.style.display = 'none');
                    }
                });
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                const imgData = canvas.toDataURL('image/png');
                const pdfWidth = 210;
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('Prescription_${(prescription.PatientName || "Patient").replace(/\s+/g, "_")}_${dateStr}.pdf');
            } catch(e) {
                console.error(e);
                alert('${isRTL ? 'فشل التحميل' : 'Download failed'}');
            } finally {
                btn.textContent = '💾 ${isRTL ? 'تحميل PDF' : 'Download PDF'}';
                btn.disabled = false;
            }
        }
    </script>
</body>
</html>`;

        // Open new window with the prescription
        const printWindow = window.open('', '_blank', 'width=900,height=1200,scrollbars=yes');
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        addActivity("add", `Prescription #${prescriptionId} opened for print/PDF`);

    } catch (error) {
        console.error("PDF generation error:", error);
        alert(isRTL ? "فشل فتح الوصفة. حاول مرة أخرى." : "Failed to open prescription. Please try again.");
    } finally {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
    }
}

// =========================
// INITIALIZATION
// =========================

loadDashboard();
applyRolePermissions();