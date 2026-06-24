const db = require("../database/db");

// =========================
// GET ALL PRESCRIPTIONS
// =========================

exports.getPrescriptions = (req, res) => {
    const sql = `
        SELECT 
            Prescriptions.PrescriptionId,
            Prescriptions.RecordId,
            Prescriptions.MedicineName,
            Prescriptions.Dosage,
            Prescriptions.Instructions,
            MedicalRecords.PatientId,
            MedicalRecords.DoctorId,
            Patients.FullName AS PatientName,
            Doctors.FullName AS DoctorName,
            MedicalRecords.VisitDate
        FROM Prescriptions
        JOIN MedicalRecords ON Prescriptions.RecordId = MedicalRecords.RecordId
        JOIN Patients ON MedicalRecords.PatientId = Patients.PatientId
        JOIN Doctors ON MedicalRecords.DoctorId = Doctors.DoctorId
        ORDER BY Prescriptions.PrescriptionId DESC
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
// GET PRESCRIPTIONS BY RECORD ID
// =========================

exports.getPrescriptionsByRecord = (req, res) => {
    const { recordId } = req.params;

    const sql = `
        SELECT 
            Prescriptions.PrescriptionId,
            Prescriptions.RecordId,
            Prescriptions.MedicineName,
            Prescriptions.Dosage,
            Prescriptions.Instructions
        FROM Prescriptions
        WHERE Prescriptions.RecordId = ?
    `;

    db.query(sql, [recordId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }
        res.json(result);
    });
};

// =========================
// ADD PRESCRIPTION
// =========================

exports.addPrescription = (req, res) => {
    const {
        recordId,
        medicineName,
        dosage,
        instructions
    } = req.body;

    // Validate required fields
    if (!recordId || !medicineName) {
        return res.status(400).json({
            message: "Record ID and Medicine Name are required"
        });
    }

    const sql = `
        INSERT INTO Prescriptions
        (RecordId, MedicineName, Dosage, Instructions)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [recordId, medicineName, dosage || null, instructions || null], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error adding prescription" });
        }

        res.json({
            message: "Prescription added successfully ✅",
            prescriptionId: result.insertId
        });
    });
};

// =========================
// UPDATE PRESCRIPTION
// =========================

exports.updatePrescription = (req, res) => {
    const { id } = req.params;
    const {
        recordId,
        medicineName,
        dosage,
        instructions
    } = req.body;

    const sql = `
        UPDATE Prescriptions
        SET RecordId = ?, MedicineName = ?, Dosage = ?, Instructions = ?
        WHERE PrescriptionId = ?
    `;

    db.query(sql, [recordId, medicineName, dosage, instructions, id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error updating prescription" });
        }

        res.json({ message: "Prescription updated successfully ✅" });
    });
};

// =========================
// DELETE PRESCRIPTION
// =========================

exports.deletePrescription = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM Prescriptions WHERE PrescriptionId = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error deleting prescription" });
        }

        res.json({ message: "Prescription deleted successfully ✅" });
    });
};