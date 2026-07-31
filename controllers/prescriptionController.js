const db = require("../database/db");

// =========================
// GET ALL PRESCRIPTIONS
// =========================

exports.getPrescriptions = (req, res) => {
    const sql = `
        SELECT
            prescriptions.PrescriptionId,
            prescriptions.RecordId,
            prescriptions.MedicineName,
            prescriptions.Dosage,
            prescriptions.Instructions,
            medicalrecords.PatientId,
            medicalrecords.DoctorId,
            patients.FullName AS PatientName,
            doctors.FullName AS DoctorName,
            medicalrecords.VisitDate
        FROM prescriptions
        JOIN medicalrecords ON prescriptions.RecordId = medicalrecords.RecordId
        JOIN patients ON medicalrecords.PatientId = patients.PatientId
        JOIN doctors ON medicalrecords.DoctorId = doctors.DoctorId
        ORDER BY prescriptions.PrescriptionId DESC
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
        FROM prescriptions
        WHERE prescriptions.RecordId = ?
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
        INSERT INTO prescriptions
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
        UPDATE prescriptions
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

    const sql = "DELETE FROM prescriptions WHERE PrescriptionId = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error deleting prescription" });
        }

        res.json({ message: "Prescription deleted successfully ✅" });
    });
};