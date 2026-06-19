const db = require("../database/db");

exports.getAppointments = (req, res) => {
    const sql = `
    SELECT 
        Appointments.AppointmentId,
        Appointments.PatientId,
        Appointments.DoctorId,
        Patients.FullName AS PatientName,
        Doctors.FullName AS DoctorName,
        Appointments.AppointmentDate,
        Appointments.AppointmentTime,
        Appointments.Status
    FROM Appointments
    JOIN Patients ON Appointments.PatientId = Patients.PatientId
    JOIN Doctors ON Appointments.DoctorId = Doctors.DoctorId
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
        INSERT INTO Appointments
        (PatientId, DoctorId, AppointmentDate, AppointmentTime, Status)
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
            "DELETE FROM appointments WHERE AppointmentId = ?",
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
        SET PatientId = ?, DoctorId = ?, AppointmentDate = ?, AppointmentTime = ?, Status = ?
        WHERE AppointmentId = ?
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