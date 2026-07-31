const db = require("../database/db");

// =========================
// GET ALL AI CONSULTATIONS
// =========================

exports.getAIConsultations = (req, res) => {
    const sql = `
        SELECT 
            aiconsultations.ConsultationId,
            aiconsultations.PatientId,
            aiconsultations.SymptomsText,
            aiconsultations.AIResponse,
            aiconsultations.ConsultationDate,
            patients.FullName AS PatientName
        FROM aiconsultations
        LEFT JOIN patients ON aiconsultations.PatientId = patients.PatientId
        ORDER BY aiconsultations.ConsultationDate DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }
        res.json(result);
    });
};

// =========================
// GET CONSULTATIONS BY PATIENT
// =========================

exports.getConsultationsByPatient = (req, res) => {
    const { patientId } = req.params;

    const sql = `
        SELECT 
            ConsultationId,
            PatientId,
            SymptomsText,
            AIResponse,
            ConsultationDate
        FROM aiconsultations
        WHERE PatientId = ?
        ORDER BY ConsultationDate DESC
    `;

    db.query(sql, [patientId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }
        res.json(result);
    });
};

// =========================
// ADD AI CONSULTATION
// =========================

exports.addAIConsultation = (req, res) => {
    const {
        patientId,
        symptomsText,
        aiResponse
    } = req.body;

    // Validate required fields
    if (!symptomsText || !aiResponse) {
        return res.status(400).json({
            message: "Symptoms text and AI response are required"
        });
    }

    const sql = `
        INSERT INTO aiconsultations
        (PatientId, SymptomsText, AIResponse, ConsultationDate)
        VALUES (?, ?, ?, NOW())
    `;

    db.query(sql, [patientId || null, symptomsText, aiResponse], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error saving AI consultation" });
        }

        res.json({
            message: "AI consultation saved successfully ✅",
            consultationId: result.insertId
        });
    });
};

// =========================
// DELETE AI CONSULTATION
// =========================

exports.deleteAIConsultation = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM aiconsultations WHERE ConsultationId = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error deleting AI consultation" });
        }

        res.json({ message: "AI consultation deleted successfully ✅" });
    });
};