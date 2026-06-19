const db = require("../database/db");

exports.getMedicalRecords = (req, res) => {

    const sql = `
        SELECT
            MedicalRecords.RecordId,
            MedicalRecords.PatientId,
            MedicalRecords.DoctorId,
            Patients.FullName AS PatientName,
            Doctors.FullName AS DoctorName,
            MedicalRecords.Symptoms,
            MedicalRecords.Diagnosis,
            MedicalRecords.Treatment,
            MedicalRecords.VisitDate

        FROM MedicalRecords

        JOIN Patients
            ON MedicalRecords.PatientId = Patients.PatientId

        JOIN Doctors
            ON MedicalRecords.DoctorId = Doctors.DoctorId
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

    const sql = `
        INSERT INTO MedicalRecords
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
        treatment,
        visitDate
    ], (err) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Error adding medical record"
            });
        }

        res.json({
            message: "Medical record added successfully"
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
        UPDATE MedicalRecords
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

    const sql = "DELETE FROM MedicalRecords WHERE RecordId = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error deleting medical record" });
        }

        res.json({ message: "Medical record deleted successfully" });
    });
};