const db = require("../database/db");

exports.getMedicalRecords = (req, res) => {

    const sql = `
        SELECT
            medicalrecords.RecordId,
            medicalrecords.PatientId,
            medicalrecords.DoctorId,
            patients.FullName AS PatientName,
            doctors.FullName AS DoctorName,
            medicalrecords.Symptoms,
            medicalrecords.Diagnosis,
            medicalrecords.Treatment,
            medicalrecords.VisitDate

        FROM medicalrecords

        JOIN patients
            ON medicalrecords.PatientId = patients.PatientId

            JOIN doctors
                ON medicalrecords.DoctorId = doctors.DoctorId
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Error fetching medical records"
            });
        }

        res.json(result);
    });
};


exports.addMedicalRecord = (req, res) => {

    const {
        patientId,
        doctorId,
        symptoms,
        diagnosis,
        treatment,
        visitDate
    } = req.body;

    // Validate required fields
    if (!patientId || !doctorId || !symptoms || !diagnosis || !visitDate) {
        return res.status(400).json({
            message: "Missing required fields: patientId, doctorId, symptoms, diagnosis, and visitDate are required"
        });
    }

    const sql = `
        INSERT INTO medicalrecords
        (
            PatientId,
            DoctorId,
            Symptoms,
            Diagnosis,
            Treatment,
            VisitDate
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        patientId,
        doctorId,
        symptoms,
        diagnosis,
        treatment || null,
        visitDate
    ], (err, result) => {

        if (err) {
            console.error("=== MEDICAL RECORD ADD ERROR ===");
            console.error("Error code:", err.code);
            console.error("Error message:", err.message);
            console.error("SQL State:", err.sqlState);
            console.error("Request body:", req.body);
            console.error("=================================");

            // Return detailed error to frontend for debugging
            return res.status(500).json({
                message: "Error adding medical record",
                error: err.message,
                code: err.code
            });
        }

        res.json({
            message: "Medical record added successfully",
            recordId: result.insertId
        });
    });
};
exports.updateMedicalRecord = (req, res) => {
    const { id } = req.params;

    const {
        patientId,
        doctorId,
        symptoms,
        diagnosis,
        treatment,
        visitDate
    } = req.body;

    const sql = `
        UPDATE medicalrecords
        SET PatientId = ?,
            DoctorId = ?,
            Symptoms = ?,
            Diagnosis = ?,
            Treatment = ?,
            VisitDate = ?
        WHERE RecordId = ?
    `;

    db.query(sql, [
        patientId,
        doctorId,
        symptoms,
        diagnosis,
        treatment,
        visitDate,
        id
    ], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error updating medical record" });
        }

        res.json({ message: "Medical record updated successfully" });
    });
};


exports.deleteMedicalRecord = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM medicalrecords WHERE RecordId = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error deleting medical record" });
        }

        res.json({ message: "Medical record deleted successfully" });
    });
};