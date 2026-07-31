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
            appointments.AppointmentDate
            appointments.Status
            appointments.DoctorId
        FROM appointments
        JOIN patients ON appointments.PatientId = patients.PatientId
        JOIN doctors ON appointments.DoctorId = doctors.DoctorId
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
    
    sql += " ORDER BY appointments.AppointmentDate DESC";
    
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
            doctors.DoctorId,
            doctors.FullName,
            doctors.Phone,
            doctors.Email,
            specialties.SpecialtyName,
            COUNT(DISTINCT appointments.AppointmentId) AS TotalAppointments,
            COUNT(DISTINCT medicalrecords.RecordId) AS TotalRecords
        FROM doctors
        LEFT JOIN specialties ON doctors.SpecialtyId = specialties.SpecialtyId
        LEFT JOIN appointments ON doctors.DoctorId = appointments.DoctorId
        LEFT JOIN medicalrecords ON doctors.DoctorId = medicalrecords.DoctorId
        GROUP BY doctors.DoctorId
        ORDER BY totalAppointments DESC
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
            patients.PatientId,
            patients.FullName,
            patients.Gender,
            patients.Phone,
            patients.Email,
            COUNT(DISTINCT appointments.AppointmentId) AS TotalAppointments,
            COUNT(DISTINCT medicalrecords.RecordId) AS TotalRecords
        FROM patients
        LEFT JOIN appointments ON patients.PatientId = appointments.PatientId
        LEFT JOIN medicalrecords ON patients.PatientId = medicalrecords.PatientId
        GROUP BY patients.PatientId
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
            (SELECT COUNT(*) FROM patients) AS TotalPatients,
            (SELECT COUNT(*) FROM doctors) AS TotalDoctors,
            (SELECT COUNT(*) FROM appointments) AS TotalAppointments,
            (SELECT COUNT(*) FROM medicalrecords) AS TotalRecords,
            (SELECT COUNT(*) FROM appointments WHERE Status = 'Scheduled') AS ScheduledAppointments,
            (SELECT COUNT(*) FROM appointments WHERE Status = 'Completed') AS CompletedAppointments,
            (SELECT COUNT(*) FROM appointments WHERE Status = 'Cancelled') AS CancelledAppointments
    `;
    
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }
        
        res.json(result[0]);
    });
};