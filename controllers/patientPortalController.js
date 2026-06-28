const db = require("../database/db");

// =========================
// BOOK APPOINTMENT
// =========================

exports.bookAppointment = (req, res) => {
    const { doctorId, appointmentDate, appointmentTime } = req.body;
    const patientId = req.patientId;

    // Validation
    if (!doctorId || !appointmentDate || !appointmentTime) {
        return res.status(400).json({
            message: "Doctor, date and time are required"
        });
    }

    // Check if doctor exists
    db.query("SELECT * FROM Doctors WHERE DoctorId = ?", [doctorId], (err, doctors) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (doctors.length === 0) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Check for duplicate appointment (same doctor, date, time)
        const checkSql = `
            SELECT * FROM Appointments 
            WHERE PatientId = ? AND DoctorId = ? AND AppointmentDate = ? AND AppointmentTime = ? AND Status != 'Cancelled'
        `;

        db.query(checkSql, [patientId, doctorId, appointmentDate, appointmentTime], (err, existing) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Database error" });
            }

            if (existing.length > 0) {
                return res.status(409).json({
                    message: "You already have an appointment with this doctor at the same time"
                });
            }

            // Insert appointment
            const insertSql = `
                INSERT INTO Appointments (PatientId, DoctorId, AppointmentDate, AppointmentTime, Status)
                VALUES (?, ?, ?, ?, 'Scheduled')
            `;

            db.query(insertSql, [patientId, doctorId, appointmentDate, appointmentTime], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Error booking appointment" });
                }

                res.json({
                    message: "Appointment booked successfully ✅",
                    appointmentId: result.insertId
                });
            });
        });
    });
};

// =========================
// GET MY APPOINTMENTS
// =========================

exports.getMyAppointments = (req, res) => {
    const patientId = req.patientId;

    const sql = `
        SELECT 
            a.AppointmentId,
            a.AppointmentDate,
            a.AppointmentTime,
            a.Status,
            d.DoctorId,
            d.FullName AS DoctorName,
            s.SpecialtyName,
            s.SpecialtyNameAr
        FROM Appointments a
        JOIN Doctors d ON a.DoctorId = d.DoctorId
        LEFT JOIN Specialties s ON d.SpecialtyId = s.SpecialtyId
        WHERE a.PatientId = ?
        ORDER BY a.AppointmentDate DESC, a.AppointmentTime DESC
    `;

    db.query(sql, [patientId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(result);
    });
};

// =========================
// UPDATE MY APPOINTMENT (Only Scheduled)
// =========================

exports.updateMyAppointment = (req, res) => {
    const { id } = req.params;
    const patientId = req.patientId;
    const { appointmentDate, appointmentTime } = req.body;

    // Check if appointment belongs to patient and is scheduled
    const checkSql = `
        SELECT * FROM Appointments 
        WHERE AppointmentId = ? AND PatientId = ? AND Status = 'Scheduled'
    `;

    db.query(checkSql, [id, patientId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(403).json({
                message: "You can only update your own scheduled appointments"
            });
        }

        const updateSql = `
            UPDATE Appointments 
            SET AppointmentDate = ?, AppointmentTime = ?
            WHERE AppointmentId = ? AND PatientId = ?
        `;

        db.query(updateSql, [appointmentDate, appointmentTime, id, patientId], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Error updating appointment" });
            }

            res.json({ message: "Appointment updated successfully ✅" });
        });
    });
};

// =========================
// CANCEL MY APPOINTMENT (Only Scheduled)
// =========================

exports.cancelMyAppointment = (req, res) => {
    const { id } = req.params;
    const patientId = req.patientId;
    const { reason } = req.body;

    // Check if appointment belongs to patient and is scheduled
    const checkSql = `
        SELECT * FROM Appointments 
        WHERE AppointmentId = ? AND PatientId = ? AND Status = 'Scheduled'
    `;

    db.query(checkSql, [id, patientId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(403).json({
                message: "You can only cancel your own scheduled appointments"
            });
        }

        const updateSql = `
            UPDATE Appointments 
            SET Status = 'Cancelled',
                CancellationReason = ?,
                CancelledAt = NOW()
            WHERE AppointmentId = ? AND PatientId = ?
        `;

        db.query(updateSql, [reason || null, id, patientId], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Error cancelling appointment" });
            }

            res.json({ 
                message: "Appointment cancelled successfully ✅",
                reason: reason || null
            });
        });
    });
};

// =========================
// GET MY MEDICAL RECORDS
// =========================

exports.getMyMedicalRecords = (req, res) => {
    const patientId = req.patientId;

    const sql = `
        SELECT 
            mr.RecordId,
            mr.Symptoms,
            mr.Diagnosis,
            mr.Treatment,
            mr.VisitDate,
            d.DoctorId,
            d.FullName AS DoctorName,
            s.SpecialtyName,
            s.SpecialtyNameAr
        FROM MedicalRecords mr
        JOIN Doctors d ON mr.DoctorId = d.DoctorId
        LEFT JOIN Specialties s ON d.SpecialtyId = s.SpecialtyId
        WHERE mr.PatientId = ?
        ORDER BY mr.VisitDate DESC
    `;

    db.query(sql, [patientId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(result);
    });
};

// =========================
// GET SINGLE MEDICAL RECORD (Verify ownership)
// =========================

exports.getMyMedicalRecordById = (req, res) => {
    const { id } = req.params;
    const patientId = req.patientId;

    const sql = `
        SELECT 
            mr.RecordId,
            mr.Symptoms,
            mr.Diagnosis,
            mr.Treatment,
            mr.VisitDate,
            d.FullName AS DoctorName,
            s.SpecialtyName
        FROM MedicalRecords mr
        JOIN Doctors d ON mr.DoctorId = d.DoctorId
        LEFT JOIN Specialties s ON d.SpecialtyId = s.SpecialtyId
        WHERE mr.RecordId = ? AND mr.PatientId = ?
    `;

    db.query(sql, [id, patientId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Record not found or access denied" });
        }

        res.json(result[0]);
    });
};

// =========================
// GET MY PRESCRIPTIONS
// =========================

exports.getMyPrescriptions = (req, res) => {
    const patientId = req.patientId;

    const sql = `
        SELECT 
            p.PrescriptionId,
            p.MedicineName,
            p.Dosage,
            p.Instructions,
            mr.VisitDate,
            d.FullName AS DoctorName,
            s.SpecialtyName
        FROM Prescriptions p
        JOIN MedicalRecords mr ON p.RecordId = mr.RecordId
        JOIN Doctors d ON mr.DoctorId = d.DoctorId
        LEFT JOIN Specialties s ON d.SpecialtyId = s.SpecialtyId
        WHERE mr.PatientId = ?
        ORDER BY mr.VisitDate DESC
    `;

    db.query(sql, [patientId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(result);
    });
};

// =========================
// GET PRESCRIPTIONS BY RECORD (Verify ownership)
// =========================

exports.getMyPrescriptionsByRecord = (req, res) => {
    const { recordId } = req.params;
    const patientId = req.patientId;

    // First verify the record belongs to this patient
    const verifySql = "SELECT * FROM MedicalRecords WHERE RecordId = ? AND PatientId = ?";

    db.query(verifySql, [recordId, patientId], (err, records) => {
        if (err || records.length === 0) {
            return res.status(403).json({ message: "Access denied to this record" });
        }

        const sql = `
            SELECT 
                p.PrescriptionId,
                p.MedicineName,
                p.Dosage,
                p.Instructions
            FROM Prescriptions p
            WHERE p.RecordId = ?
            ORDER BY p.PrescriptionId DESC
        `;

        db.query(sql, [recordId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Database error" });
            }

            res.json(result);
        });
    });
};

// =========================
// GET ALL DOCTORS (For booking dropdown)
// =========================

exports.getAllDoctorsForPatient = (req, res) => {
    const sql = `
        SELECT 
            d.DoctorId,
            d.FullName,
            d.Phone,
            d.Email,
            s.SpecialtyName,
            s.SpecialtyNameAr
        FROM Doctors d
        LEFT JOIN Specialties s ON d.SpecialtyId = s.SpecialtyId
        ORDER BY d.FullName
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(result);
    });
};