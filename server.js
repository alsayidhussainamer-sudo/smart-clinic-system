const express = require("express");
require("dotenv").config();
const cors = require("cors");

const db = require("./database/db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const specialtyRoutes = require("./routes/specialtyRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const aiRoutes = require("./routes/aiRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const aiConsultationRoutes = require("./routes/aiConsultationRoutes");

app.get("/", (req, res) => {
    res.send("Smart Clinic System Backend is Running 🚀");
});

app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/specialties", specialtyRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/users", userRoutes);
app.use("/medical-records", medicalRecordRoutes);
app.use("/api/ai", aiRoutes);
app.use("/reports", reportsRoutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/ai-consultations", aiConsultationRoutes);

app.use(express.static("frontend"));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});