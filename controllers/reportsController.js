const db = require("../database/db");

// =========================
// APPOINTMENTS REPORT
// =========================

exports.getAppointmentsReport = (req, res) => {
    const { startDate, endDate, status, doctorId } = req.query;
    
    let sql = `
        SELECT 
            Appointments.AppointmentId,
            Patients.FullName AS PatientName,
            Doctors.FullName AS DoctorName,
            Appointments.AppointmentDate,
            Appointments.AppointmentTime,
            Appointments.Status
        FROM Appointments
        JOIN Patients ON Appointments.PatientId = Patients.PatientId
        JOIN Doctors ON Appointments.DoctorId = Doctors.DoctorId
        WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
        sql += " AND Appointments.AppointmentDate >= ?";
        params.push(startDate);
    }
    
    if (endDate) {
        sql += " AND Appointments.AppointmentDate <= ?";
        params.push(endDate);
    }
    
    if (status) {
        sql += " AND Appointments.Status = ?";
        params.push(status);
    }
    
    if (doctorId) {
        sql += " AND Appointments.DoctorId = ?";
        params.push(doctorId);
    }
    
    sql += " ORDER BY Appointments.AppointmentDate DESC";
    
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }
        
        res.json(result);
    });
};

// =========================
// DOCTORS REPORT
// =========================

exports.getDoctorsReport = (req, res) => {
    const sql = `
        SELECT 
            Doctors.DoctorId,
            Doctors.FullName,
            Doctors.Phone,
            Doctors.Email,
            Specialties.SpecialtyName,
            COUNT(DISTINCT Appointments.AppointmentId) AS TotalAppointments,
            COUNT(DISTINCT MedicalRecords.RecordId) AS TotalRecords
        FROM Doctors
        LEFT JOIN Specialties ON Doctors.SpecialtyId = Specialties.SpecialtyId
        LEFT JOIN Appointments ON Doctors.DoctorId = Appointments.DoctorId
        LEFT JOIN MedicalRecords ON Doctors.DoctorId = MedicalRecords.DoctorId
        GROUP BY Doctors.DoctorId
        ORDER BY TotalAppointments DESC
    `;
    
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }
        
        res.json(result);
    });
};

// =========================
// PATIENTS REPORT
// =========================

exports.getPatientsReport = (req, res) => {
    const sql = `
        SELECT 
            Patients.PatientId,
            Patients.FullName,
            Patients.Gender,
            Patients.Phone,
            Patients.Email,
            COUNT(DISTINCT Appointments.AppointmentId) AS TotalAppointments,
            COUNT(DISTINCT MedicalRecords.RecordId) AS TotalRecords
        FROM Patients
        LEFT JOIN Appointments ON Patients.PatientId = Appointments.PatientId
        LEFT JOIN MedicalRecords ON Patients.PatientId = MedicalRecords.PatientId
        GROUP BY Patients.PatientId
        ORDER BY TotalAppointments DESC
    `;
    
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }
        
        res.json(result);
    });
};

// =========================
// STATISTICS SUMMARY
// =========================

exports.getStatisticsSummary = (req, res) => {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM Patients) AS TotalPatients,
            (SELECT COUNT(*) FROM Doctors) AS TotalDoctors,
            (SELECT COUNT(*) FROM Appointments) AS TotalAppointments,
            (SELECT COUNT(*) FROM MedicalRecords) AS TotalRecords,
            (SELECT COUNT(*) FROM Appointments WHERE Status = 'Scheduled') AS ScheduledAppointments,
            (SELECT COUNT(*) FROM Appointments WHERE Status = 'Completed') AS CompletedAppointments,
            (SELECT COUNT(*) FROM Appointments WHERE Status = 'Cancelled') AS CancelledAppointments
    `;
    
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }
        
        res.json(result[0]);
    });
};