const db = require("../database/db");

exports.getPatients = (req, res) => {

    const sql = "SELECT * FROM Patients";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.json(result);
    });
};

exports.addPatient = (req, res) => {

    const {
        fullName,
        gender,
        birthDate,
        phone,
        email,
        address
    } = req.body;

    const sql = `
        INSERT INTO Patients
        (FullName, Gender, BirthDate, Phone, Email, Address)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [fullName, gender, birthDate, phone, email, address],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Error adding patient"
                });
            }

            res.json({
                message: "Patient added successfully ✅"
            });
        }
    );
};
exports.getPatientById = (req, res) => {
    const patientId = req.params.id;

    const sql = "SELECT * FROM Patients WHERE PatientId = ?";

    db.query(sql, [patientId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json(result[0]);
    });
};

exports.updatePatient = (req, res) => {
    const patientId = req.params.id;

    const { fullName, gender, birthDate, phone, email, address } = req.body;

    const sql = `
        UPDATE Patients
        SET FullName = ?, Gender = ?, BirthDate = ?, Phone = ?, Email = ?, Address = ?
        WHERE PatientId = ?
    `;

    db.query(sql, [fullName, gender, birthDate, phone, email, address, patientId], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error updating patient" });
        }

        res.json({ message: "Patient updated successfully ✅" });
    });
};

exports.deletePatient = (req, res) => {
    const patientId = req.params.id;

    const sql = "DELETE FROM Patients WHERE PatientId = ?";

    db.query(sql, [patientId], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error deleting patient" });
        }

        res.json({ message: "Patient deleted successfully ✅" });
    });
};