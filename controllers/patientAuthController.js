const db = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// PATIENT REGISTER
// =========================

exports.patientRegister = async (req, res) => {
    const {
        fullName,
        phone,
        email,
        password,
        gender,
        birthDate,
        address
    } = req.body;

    // Validation
    if (!fullName || !email || !password || !phone) {
        return res.status(400).json({
            message: "Full name, email, password and phone are required"
        });
    }

    try {
        // Check if email already exists
        const checkSql = "SELECT * FROM Patients WHERE Email = ?";
        db.query(checkSql, [email], async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert patient with password
            const insertSql = `
                INSERT INTO Patients 
                (FullName, Phone, Email, PasswordHash, Gender, BirthDate, Address, IsActive)
                VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)
            `;

            db.query(
                insertSql,
                [fullName, phone, email, hashedPassword, gender || null, birthDate || null, address || null],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Error creating patient account" });
                    }

                    res.json({
                        message: "Patient registered successfully ✅",
                        patientId: result.insertId
                    });
                }
            );
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// =========================
// PATIENT LOGIN
// =========================

exports.patientLogin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = `
        SELECT PatientId, FullName, Email, PasswordHash, IsActive
        FROM Patients
        WHERE Email = ? AND PasswordHash IS NOT NULL
    `;

    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const patient = result[0];

        // Check if account is active
        if (!patient.IsActive) {
            return res.status(403).json({
                message: "Account is deactivated. Contact clinic administration."
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, patient.PasswordHash);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: patient.PatientId,
                type: "patient",
                email: patient.Email
            },
            process.env.JWT_SECRET || "smartclinicsecret",
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful ✅",
            token,
            patientId: patient.PatientId,
            fullName: patient.FullName,
            email: patient.Email
        });
    });
};

// =========================
// GET PATIENT PROFILE
// =========================

exports.getPatientProfile = (req, res) => {
    const patientId = req.patientId;

    const sql = `
        SELECT PatientId, FullName, Gender, BirthDate, Phone, Email, Address
        FROM Patients
        WHERE PatientId = ?
    `;

    db.query(sql, [patientId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json(result[0]);
    });
};

// =========================
// UPDATE PATIENT PROFILE
// =========================

exports.updatePatientProfile = async (req, res) => {
    const patientId = req.patientId;
    const { fullName, phone, address, birthDate, gender } = req.body;

    const sql = `
        UPDATE Patients
        SET FullName = ?, Phone = ?, Address = ?, BirthDate = ?, Gender = ?
        WHERE PatientId = ?
    `;

    db.query(sql, [fullName, phone, address, birthDate, gender, patientId], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error updating profile" });
        }

        res.json({ message: "Profile updated successfully ✅" });
    });
};

// =========================
// CHANGE PASSWORD
// =========================

exports.changePassword = async (req, res) => {
    const patientId = req.patientId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
        return res.status(400).json({
            message: "Current password and new password (min 6 chars) are required"
        });
    }

    const sql = "SELECT PasswordHash FROM Patients WHERE PatientId = ?";

    db.query(sql, [patientId], async (err, result) => {
        if (err || result.length === 0) {
            return res.status(500).json({ message: "Database error" });
        }

        const isMatch = await bcrypt.compare(currentPassword, result[0].PasswordHash);

        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        db.query(
            "UPDATE Patients SET PasswordHash = ? WHERE PatientId = ?",
            [hashedNewPassword, patientId],
            (err) => {
                if (err) return res.status(500).json({ message: "Error changing password" });
                res.json({ message: "Password changed successfully ✅" });
            }
        );
    });
};