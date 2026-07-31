const db = require("../database/db");

exports.getDoctors = (req, res) => {

    const sql = `
        SELECT 
            doctors.DoctorId,
            doctors.FullName,
            doctors.Phone,
            doctors.Email,
            doctors.SpecialtyId,
            specialties.SpecialtyName,
            specialties.SpecialtyNameAr
        FROM doctors
        LEFT JOIN specialties ON doctors.SpecialtyId = specialties.SpecialtyId
    `;

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

exports.addDoctor = (req, res) => {

    const {
        specialtyId,
        fullName,
        phone,
        email
    } = req.body;

    const sql = `
        INSERT INTO doctors
        (SpecialtyId, FullName, Phone, Email)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [specialtyId, fullName, phone, email],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Error adding doctor"
                });
            }

            res.json({
                message: "Doctor added successfully ✅"
            });
        }
    );
};

exports.updateDoctor = (req, res) => {

    const doctorId = req.params.id;

    const { fullName, phone, email, specialtyId } = req.body;

    const sql = `
        UPDATE doctors
        SET FullName = ?, Phone = ?, Email = ?, SpecialtyId = ?
        WHERE DoctorId = ?
    `;

    db.query(sql, [fullName, phone, email, specialtyId, doctorId], (err) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Error updating doctor"
            });
        }

        res.json({
            message: "Doctor updated successfully ✅"
        });
    });
};

exports.deleteDoctor = (req, res) => {

    const doctorId = req.params.id;

    const sql = "DELETE FROM doctors WHERE DoctorId = ?";

    db.query(sql, [doctorId], (err) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Error deleting doctor"
            });
        }

        res.json({
            message: "Doctor deleted successfully ✅"
        });
    });
};