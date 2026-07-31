const db = require("../database/db");

exports.getPatients = (req, res) => {

    const sql = "SELECT * FROM patients";

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
        INSERT INTO patients
        (fullname, gender, birthdate, phone, email, address)
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

    const sql = "SELECT * FROM patients WHERE patientid = ?";

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
        UPDATE patients
        SET fullname = ?, gender = ?, birthdate = ?, phone = ?, email = ?, address = ?
        WHERE patientid = ?
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

    // Check for related appointments first
    const checkAppointmentsSql = "SELECT COUNT(*) AS count FROM appointments WHERE patientid = ?";
    db.query(checkAppointmentsSql, [patientId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error while checking appointments" });
        }

        if (result[0].count > 0) {
            return res.status(400).json({
                message: "Cannot delete patient. This patient has " + result[0].count + " appointment(s). Please delete the appointments first."
            });
        }

        // Check for related medical records
        const checkRecordsSql = "SELECT COUNT(*) AS count FROM medicalrecords WHERE patientid = ?";
        db.query(checkRecordsSql, [patientId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Database error while checking medical records" });
            }

            if (result[0].count > 0) {
                return res.status(400).json({
                    message: "Cannot delete patient. This patient has " + result[0].count + " medical record(s). Please delete the medical records first."
                });
            }

            // Check for related AI consultations
            const checkAIConsultationsSql = "SELECT COUNT(*) AS count FROM aiconsultations WHERE patientid = ?";
            db.query(checkAIConsultationsSql, [patientId], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Database error while checking AI consultations" });
                }

                if (result[0].count > 0) {
                    return res.status(400).json({
                        message: "Cannot delete patient. This patient has " + result[0].count + " AI consultation(s). Please delete the AI consultations first."
                    });
                }

                // Safe to delete
                const sql = "DELETE FROM patients WHERE patientid = ?";
                db.query(sql, [patientId], (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Error deleting patient" });
                    }

                    res.json({ message: "Patient deleted successfully ✅" });
                });
            });
        });
    });
};