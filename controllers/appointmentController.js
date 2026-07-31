const db = require("../database/db");

exports.getAppointments = (req, res) => {
    const sql = `
    SELECT 
        appointments.appointmentid,
        appointments.patientid,
        appointments.doctorid,
        patients.fullname AS PatientName,
        doctors.fullname AS DoctorName,
        appointments.appointmentdate,
        appointments.appointmenttime,
        appointments.status
    FROM appointments
    JOIN patients ON appointments.patientid = patients.patientid
    JOIN doctors ON appointments.doctorid = doctors.doctorid
`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }

        res.json(result);
    });
};

exports.addAppointment = (req, res) => {
    const {
        patientId,
        doctorId,
        appointmentDate,
        appointmentTime,
        status
    } = req.body;

    const sql = `
        INSERT INTO appointments
        (patientid, doctorid, appointmentdate, appointmenttime, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [patientId, doctorId, appointmentDate, appointmentTime, status],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Error adding appointment" });
            }

            res.json({ message: "Appointment added successfully ✅" });
        }
    );
};

exports.deleteAppointment = async (req, res) => {

    try {

        const { id } = req.params;

        db.query(
            "DELETE FROM appointments WHERE appointmentid = ?",
            [id],
            (err, result) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        message: "Server error"
                    });
                }

                res.json({
                    message: "Appointment deleted successfully"
                });
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.updateAppointment = (req, res) => {

    const appointmentId = req.params.id;

    const {
        patientId,
        doctorId,
        appointmentDate,
        appointmentTime,
        status
    } = req.body;

    const sql = `
        UPDATE appointments
        SET patientid = ?, doctorid = ?, appointmentdate = ?, appointmenttime = ?, status = ?
        WHERE appointmentid = ?
    `;

    db.query(sql, [
        patientId,
        doctorId,
        appointmentDate,
        appointmentTime,
        status,
        appointmentId
    ], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error updating appointment"
            });
        }

        res.json({
            message: "Appointment updated successfully"
        });
    });
};