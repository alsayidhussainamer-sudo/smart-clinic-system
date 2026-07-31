const db = require("../database/db");

exports.getDoctors = (req, res) => {

    const sql = `
        SELECT 
            doctors.doctorid,
            doctors.fullname,
            doctors.phone,
            doctors.email,
            doctors.specialtyid,
            specialties.specialtyname,
            specialties.specialtynameAr
        FROM doctors
        LEFT JOIN specialties ON doctors.specialtyid = specialties.SpecialtyId
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
        (specialtyid, fullname, phone, email)
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
        SET fullname = ?, phone = ?, email = ?, specialtyid = ?
        WHERE doctorid = ?
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

    const sql = "DELETE FROM doctors WHERE doctorid = ?";

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