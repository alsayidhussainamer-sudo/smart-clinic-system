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

    // Check for related appointments first
    const checkAppointmentsSql = "SELECT COUNT(*) AS count FROM appointments WHERE doctorid = ?";
    db.query(checkAppointmentsSql, [doctorId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error while checking appointments" });
        }

        if (result[0].count > 0) {
            return res.status(400).json({
                message: "Cannot delete doctor. This doctor has " + result[0].count + " appointment(s). Please delete the appointments first."
            });
        }

        // Check for related medical records
        const checkRecordsSql = "SELECT COUNT(*) AS count FROM medicalrecords WHERE doctorid = ?";
        db.query(checkRecordsSql, [doctorId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Database error while checking medical records" });
            }

            if (result[0].count > 0) {
                return res.status(400).json({
                    message: "Cannot delete doctor. This doctor has " + result[0].count + " medical record(s). Please delete the medical records first."
                });
            }

            // Safe to delete
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
        });
    });
};