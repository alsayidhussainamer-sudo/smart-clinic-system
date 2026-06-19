const axios = require("axios");

exports.generateMedicalSuggestion = async (req, res) => {

    try {

        const { symptoms } = req.body;

        if (!symptoms || symptoms.trim() === "") {

            return res.status(400).json({
                message: "Symptoms are required"
            });
        }

        const isArabicSymptoms = containsArabic(symptoms);

        const suggestSystemPrompt = isArabicSymptoms
            ? "أنت مساعد طبي متخصص. قدم اقتراحات طبية مختصرة ومهنية باللغة العربية."
            : "You are a medical assistant. Give short and professional medical suggestions.";

        const suggestUserPrompt = isArabicSymptoms
            ? `حلل هذه الأعراض:
${symptoms}

أرجع:
1. التشخيص المحتمل
2. العلاج المقترح

أجب بشكل مختصر ومهني.`
            : `Analyze these symptoms:
${symptoms}

Return:
1. Possible diagnosis
2. Suggested treatment

Keep response short and professional.`;

        const response = await axios.post(

            "https://openrouter.ai/api/v1/chat/completions",

            {
                model: "openrouter/auto",

                messages: [

                    {
                        role: "system",

                        content: suggestSystemPrompt
                    },

                    {
                        role: "user",

                        content: suggestUserPrompt
                    }
                ]
            },

            {
                headers: {

                    Authorization:
                        `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type": "application/json",

                    "HTTP-Referer": "http://localhost:4000",

                    "X-Title": "Smart Clinic System"
                }
            }
        );

        const text =
            response.data.choices[0].message.content;

        res.json({
            suggestion: text
        });

    } catch (error) {

        console.log(
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "AI generation failed"
        });
    }
};

// Detect if text contains Arabic characters
function containsArabic(text) {
    const arabicRegex = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
    return arabicRegex.test(text);
}

exports.chatWithAI = async (req, res) => {

    try {

        const { message } = req.body;
        const isArabic = containsArabic(message);
        const lowerMessage = message.toLowerCase();

        const db = require("../database/db");

        // =========================
        // DOCTORS
        // =========================

        if (
            lowerMessage.includes("doctor") ||
            lowerMessage.includes("doctors")
        ) {

            const doctors = await new Promise((resolve, reject) => {
    db.query("SELECT FullName FROM doctors", (err, results) => {
        if (err) {
            reject(err);
        } else {
            resolve(results);
        }
    });
});

            if (doctors.length === 0) {
                return res.json({
                    reply: "There are no doctors in the system."
                });
            }

            let reply = "Doctors List:\n\n";

            doctors.forEach((doctor, index) => {
                reply += `${index + 1}. ${doctor.FullName}\n`;
            });

            return res.json({ reply });
        }

        // =========================
        // PATIENTS
        // =========================

        if (
            lowerMessage.includes("patient") ||
            lowerMessage.includes("patients")
        ) {

            const patients = await new Promise((resolve, reject) => {
    db.query("SELECT FullName FROM patients", (err, results) => {
        if (err) {
            reject(err);
        } else {
            resolve(results);
        }
    });
});

            let reply = "Patients List:\n\n";

patients.forEach((patient, index) => {
    reply += `${index + 1}. ${patient.FullName}\n`;
});

return res.json({ reply });
        }

        // =========================
        // // APPOINTMENTS
        // // =========================

if (
    lowerMessage.includes("appointment") ||
    lowerMessage.includes("appointments")
) {

    const appointments = await new Promise((resolve, reject) => {

    db.query(
        "SELECT AppointmentDate, AppointmentTime, Status FROM appointments",
        (err, results) => {

            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        }
    );
});

    if (appointments.length === 0) {

        return res.json({
            reply: "There are no appointments in the system."
        });
    }

    let reply = "Appointments List:\n\n";

    appointments.forEach((appointment, index) => {

    const date = appointment.AppointmentDate
        ? new Date(appointment.AppointmentDate).toLocaleDateString()
        : "No date";

    const time = appointment.AppointmentTime || "No time";

    const status = appointment.Status || "No status";

    reply += `${index + 1}. ${date} - ${time} - ${status}\n`;
});

    return res.json({ reply });
}

        // =========================
        // AI FALLBACK
        // =========================

        const systemPrompt = isArabic 
            ? "أنت مساعد طبي متخصص في العيادات. يجب أن تجيب دائماً باللغة العربية عندما يكتب المستخدم بالعربية. أجب بشكل مختصر ومهني."
            : "You are a helpful medical clinic assistant.";

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openrouter/auto",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:4000",
                    "X-Title": "Smart Clinic System"
                }
            }
        );

        const reply = response.data.choices[0].message.content;

        res.json({
            reply
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "AI chatbot failed"
        });
    }
};