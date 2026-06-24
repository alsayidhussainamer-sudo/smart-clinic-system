const axios = require("axios");
const db = require("../database/db");

exports.generateMedicalSuggestion = async (req, res) => {
    try {
        const { symptoms, patientId } = req.body;

        if (!symptoms || symptoms.trim() === "") {
            return res.status(400).json({
                message: "Symptoms are required"
            });
        }

        const isArabicSymptoms = /[\u0600-\u06FF]/.test(symptoms);

        let systemPrompt;
        let userPrompt;

        if (isArabicSymptoms) {
            systemPrompt = "أنت مساعد طبي متخصص. قدم اقتراحات طبية مختصرة ومهنية باللغة العربية.";
            userPrompt = "حلل هذه الأعراض:\n" + symptoms + "\n\nأرجع:\n1. التشخيص المحتمل\n2. العلاج المقترح\n\nأجب بشكل مختصر ومهني.";
        } else {
            systemPrompt = "You are a medical assistant. Give short and professional medical suggestions.";
            userPrompt = "Analyze these symptoms:\n" + symptoms + "\n\nReturn:\n1. Possible diagnosis\n2. Suggested treatment\n\nKeep response short and professional.";
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openrouter/auto",
                messages: [
                    {
                        role: "user",
                        content: systemPrompt + "\n\n" + userPrompt
                    }
                ]
            },
            {
                headers: {
                    Authorization: "Bearer " + process.env.OPENROUTER_API_KEY,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:4000",
                    "X-Title": "Smart Clinic System"
                }
            }
        );

        const text = response.data.choices[0].message.content;

        if (patientId) {
            const saveSql = "INSERT INTO AIConsultations (PatientId, SymptomsText, AIResponse, ConsultationDate) VALUES (?, ?, ?, NOW())";
            db.query(saveSql, [patientId, symptoms, text], (err) => {
                if (err) console.log("Error saving AI consultation:", err);
            });
        }

        res.json({ suggestion: text });

    } catch (error) {
        console.error("AI Error:", error.response?.data || error.message);
        res.status(500).json({
            message: "AI generation failed",
            details: error.response?.data?.error?.message || error.message
        });
    }
};

function containsArabic(text) {
    return /[\u0600-\u06FF]/.test(text);
}

exports.chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        const isArabic = containsArabic(message);
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes("doctor") || lowerMessage.includes("doctors")) {
            const doctors = await new Promise((resolve, reject) => {
                db.query("SELECT FullName FROM doctors", (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            if (doctors.length === 0) {
                return res.json({ reply: "There are no doctors in the system." });
            }

            let reply = "Doctors List:\n\n";
            doctors.forEach((doctor, index) => {
                reply += (index + 1) + ". " + doctor.FullName + "\n";
            });
            return res.json({ reply: reply });
        }

        if (lowerMessage.includes("patient") || lowerMessage.includes("patients")) {
            const patients = await new Promise((resolve, reject) => {
                db.query("SELECT FullName FROM patients", (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            let reply = "Patients List:\n\n";
            patients.forEach((patient, index) => {
                reply += (index + 1) + ". " + patient.FullName + "\n";
            });
            return res.json({ reply: reply });
        }

        if (lowerMessage.includes("appointment") || lowerMessage.includes("appointments")) {
            const appointments = await new Promise((resolve, reject) => {
                db.query("SELECT AppointmentDate, AppointmentTime, Status FROM appointments", (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            if (appointments.length === 0) {
                return res.json({ reply: "There are no appointments in the system." });
            }

            let reply = "Appointments List:\n\n";
            appointments.forEach((appointment, index) => {
                const date = appointment.AppointmentDate ? new Date(appointment.AppointmentDate).toLocaleDateString() : "No date";
                const time = appointment.AppointmentTime || "No time";
                const status = appointment.Status || "No status";
                reply += (index + 1) + ". " + date + " - " + time + " - " + status + "\n";
            });
            return res.json({ reply: reply });
        }

        const systemPrompt = isArabic 
            ? "أنت مساعد طبي متخصص في العيادات. يجب أن تجيب دائماً باللغة العربية."
            : "You are a helpful medical clinic assistant.";

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openrouter/auto",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ]
            },
            {
                headers: {
                    Authorization: "Bearer " + process.env.OPENROUTER_API_KEY,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:4000",
                    "X-Title": "Smart Clinic System"
                }
            }
        );

        const reply = response.data.choices[0].message.content;
        res.json({ reply: reply });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "AI chatbot failed" });
    }
};