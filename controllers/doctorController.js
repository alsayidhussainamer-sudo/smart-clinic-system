const db = require("../database/db");

exports.getDoctors = (req, res) => {

    const sql = `
        SELECT 
            Doctors.DoctorId,
            Doctors.FullName,
            Doctors.Phone,
            Doctors.Email,
            Doctors.SpecialtyId,
            Specialties.SpecialtyName,
            Specialties.SpecialtyNameAr
        FROM Doctors
        LEFT JOIN Specialties ON Doctors.SpecialtyId = Specialties.SpecialtyId
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
        INSERT INTO Doctors
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

    const { fullName, phone, email } = req.body;

    const sql = `
        UPDATE doctors
        SET FullName = ?, Phone = ?, Email = ?
        WHERE DoctorId = ?
    `;

    db.query(sql, [fullName, phone, email, doctorId], (err) => {

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