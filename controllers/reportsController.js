const db = require("../database/db");

// =========================
// APPOINTMENTS REPORT
// =========================

exports.getAppointmentsReport = (req, res) => {
    const { startDate, endDate, status, doctorId } = req.query;
    
    let sql = `
        SELECT 
            appointments.appointmentid,
            patients.fullname AS patientname,
            doctors.fullname AS doctorname,
            appointments.appointmentdate,
            appointments.status,
            appointments.doctorid
        FROM appointments
        JOIN patients ON appointments.PatientId = patients.patientid
        JOIN doctors ON appointments.DoctorId = doctors.doctorid
        WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
        sql += " AND appointments.appointmentdate >= ?";
        params.push(startDate);
    }
    
    if (endDate) {
        sql += " AND appointments.appointmentdate <= ?";
        params.push(endDate);
    }
    
    if (status) {
        sql += " AND appointments.status = ?";
        params.push(status);
    }
    
    if (doctorId) {
        sql += " AND appointments.doctorid = ?";
        params.push(doctorId);
    }
    
    sql += " ORDER BY appointments.appointmentdate DESC";
    
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
            doctors.doctorid,
            doctors.fullname,
            doctors.phone,
            doctors.email,
            specialties.specialtyname,
            COUNT(DISTINCT appointments.appointmentid) AS TotalAppointments,
            COUNT(DISTINCT medicalrecords.recordid) AS TotalRecords
        FROM doctors
        LEFT JOIN specialties ON doctors.SpecialtyId = specialties.SpecialtyId
        LEFT JOIN appointments ON doctors.doctorid = appointments.DoctorId
        LEFT JOIN medicalrecords ON doctors.doctorid = medicalrecords.DoctorId
        GROUP BY doctors.doctorid
        ORDER BY totalappointments DESC
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
            patients.patientid,
            patients.fullname,
            patients.gender,
            patients.phone,
            patients.email,
            COUNT(DISTINCT appointments.appointmentid) AS TotalAppointments,
            COUNT(DISTINCT medicalrecords.recordid) AS TotalRecords
        FROM patients
        LEFT JOIN appointments ON patients.patientid = appointments.PatientId
        LEFT JOIN medicalrecords ON patients.patientid = medicalrecords.PatientId
        GROUP BY patients.patientid
        ORDER BY totalappointments DESC
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
            (SELECT COUNT(*) FROM appointments WHERE status = 'Scheduled') AS ScheduledAppointments,
            (SELECT COUNT(*) FROM appointments WHERE status = 'Completed') AS CompletedAppointments,
            (SELECT COUNT(*) FROM appointments WHERE status = 'Cancelled') AS CancelledAppointments
    `;
    
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }
        
        res.json(result[0]);
    });
};