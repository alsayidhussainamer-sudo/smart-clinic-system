const axios = require("axios");
const db = require("../database/db");

// =========================
// AI MEDICAL SUGGESTION (Requires auth)
// =========================

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

        // Save to AIConsultations if patientId provided
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

// =========================
// AI CHATBOT (SECURED - Role-based access)
// =========================

exports.chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        const userRole = req.user?.role || req.user?.type; // "Admin", "Doctor", "Receptionist", or "patient"
        const userId = req.user?.id;

        const isArabic = containsArabic(message);
        const lowerMessage = message.toLowerCase();

        // ============================================================
        // PATIENT ACCESS (LIMITED - Own data only)
        // ============================================================
        if (userRole === "patient") {

            // Patient can view their own appointments
            if (lowerMessage.includes("my appointment") || lowerMessage.includes("مواعيدي") || lowerMessage.includes("appointment")) {
                const appointments = await new Promise((resolve, reject) => {
                    db.query(
                        `SELECT a.AppointmentDate, a.AppointmentTime, a.Status, d.FullName as DoctorName 
                         FROM appointments a 
                         JOIN doctors d ON a.DoctorId = d.DoctorId 
                         WHERE a.PatientId = ? 
                         ORDER BY a.AppointmentDate DESC`,
                        [userId],
                        (err, results) => {
                            if (err) reject(err);
                            else resolve(results);
                        }
                    );
                });

                if (appointments.length === 0) {
                    return res.json({ 
                        reply: isArabic ? `ليس لديك مواعيد مسجلة حالياً.` : `You have no appointments.`
                    });
                }

                let reply = isArabic ? `مواعيدك:\n\n` : `Your Appointments:\n\n`;
                appointments.forEach((a, index) => {
                    const date = a.AppointmentDate ? new Date(a.AppointmentDate).toLocaleDateString() : "No date";
                    const time = a.AppointmentTime || "No time";
                    const status = a.Status || "No status";
                    reply += (index + 1) + ". " + a.DoctorName + " - " + date + " " + time + " (" + status + ")\n";
                });
                return res.json({ reply });
            }

            // Patient can view their own medical records
            if (lowerMessage.includes("my record") || lowerMessage.includes("سجلاتي") || lowerMessage.includes("medical record")) {
                const records = await new Promise((resolve, reject) => {
                    db.query(
                        `SELECT mr.VisitDate, mr.Symptoms, mr.Diagnosis, d.FullName as DoctorName 
                         FROM medicalrecords mr 
                         JOIN doctors d ON mr.DoctorId = d.DoctorId 
                         WHERE mr.PatientId = ? 
                         ORDER BY mr.VisitDate DESC`,
                        [userId],
                        (err, results) => {
                            if (err) reject(err);
                            else resolve(results);
                        }
                    );
                });

                if (records.length === 0) {
                    return res.json({ 
                        reply: isArabic ? `ليس لديك سجلات طبية مسجلة.` : `You have no medical records.`
                    });
                }

                let reply = isArabic ? `سجلاتك الطبية:\n\n` : `Your Medical Records:\n\n`;
                records.forEach((r, index) => {
                    reply += (index + 1) + ". " + r.VisitDate.split("T")[0] + " - Dr. " + r.DoctorName + "\n";
                    reply += "   Symptoms: " + r.Symptoms + "\n";
                    reply += "   Diagnosis: " + r.Diagnosis + "\n\n";
                });
                return res.json({ reply });
            }

            // Patient can view their own prescriptions
            if (lowerMessage.includes("my prescription") || lowerMessage.includes("وصفاتي") || lowerMessage.includes("prescription")) {
                const prescriptions = await new Promise((resolve, reject) => {
                    db.query(
                        `SELECT p.MedicineName, p.Dosage, p.Instructions, mr.VisitDate, d.FullName as DoctorName 
                         FROM prescriptions p 
                         JOIN medicalrecords mr ON p.RecordId = mr.RecordId 
                         JOIN doctors d ON mr.DoctorId = d.DoctorId 
                         WHERE mr.PatientId = ? 
                         ORDER BY mr.VisitDate DESC`,
                        [userId],
                        (err, results) => {
                            if (err) reject(err);
                            else resolve(results);
                        }
                    );
                });

                if (prescriptions.length === 0) {
                    return res.json({ 
                        reply: isArabic ? `ليس لديك وصفات طبية مسجلة.` : `You have no prescriptions.`
                    });
                }

                let reply = isArabic ? `وصفاتك الطبية:\n\n` : `Your Prescriptions:\n\n`;
                prescriptions.forEach((p, index) => {
                    reply += (index + 1) + ". " + p.MedicineName + "\n";
                    reply += "   Dosage: " + (p.Dosage || "As directed") + "\n";
                    reply += "   Instructions: " + (p.Instructions || "Follow doctor's advice") + "\n";
                    reply += "   Prescribed by: Dr. " + p.DoctorName + " on " + p.VisitDate.split("T")[0] + "\n\n";
                });
                return res.json({ reply });
            }

            // Patient asking about doctors list (limited info)
            if (lowerMessage.includes("doctor") || lowerMessage.includes("doctors") || lowerMessage.includes("طبيب") || lowerMessage.includes("أطباء")) {
                const doctors = await new Promise((resolve, reject) => {
                    db.query(
                        `SELECT d.FullName, s.SpecialtyName, s.SpecialtyNameAr 
                         FROM doctors d 
                         LEFT JOIN specialties s ON d.SpecialtyId = s.SpecialtyId 
                         ORDER BY d.FullName`,
                        (err, results) => {
                            if (err) reject(err);
                            else resolve(results);
                        }
                    );
                });

                if (doctors.length === 0) {
                    return res.json({ reply: isArabic ? `لا يوجد أطباء في النظام.` : `There are no doctors in the system.` });
                }

                let reply = isArabic ? `قائمة الأطباء:\n\n` : `Doctors List:\n\n`;
                doctors.forEach((doctor, index) => {
                    const specialty = doctor.SpecialtyNameAr || doctor.SpecialtyName || "General";
                    reply += (index + 1) + ". " + doctor.FullName + " (" + specialty + ")\n";
                });
                return res.json({ reply });
            }

            // Block access to other patients' data
            if (lowerMessage.includes("patient") || lowerMessage.includes("patients") || lowerMessage.includes("مريض") || lowerMessage.includes("مرضى")) {
                return res.json({
                    reply: isArabic 
                        ? `يمكنك الاستفسار فقط عن بياناتك الشخصية. جرب: "مواعيدي" أو "سجلاتي" أو "وصفاتي".`
                        : `You can only inquire about your own data. Try: "my appointments" or "my records" or "my prescriptions".`
                });
            }

            // General medical questions allowed
            const systemPrompt = isArabic 
                ? `أنت مساعد طبي متخصص في العيادات. يجب أن تجيب دائماً باللغة العربية.`
                : `You are a helpful medical clinic assistant.`;

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
            return res.json({ reply });
        }

        // ============================================================
        // STAFF ACCESS (Admin/Doctor/Receptionist - Full access)
        // ============================================================

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
            return res.json({ reply });
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
            return res.json({ reply });
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
            return res.json({ reply });
        }

        // General medical questions for staff
        const systemPrompt = isArabic 
            ? `أنت مساعد طبي متخصص في العيادات. يجب أن تجيب دائماً باللغة العربية.`
            : `You are a helpful medical clinic assistant.`;

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
        res.json({ reply });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "AI chatbot failed" });
    }
};