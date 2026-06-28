const express = require("express");
const router = express.Router();

const patientAuthController = require("../controllers/patientAuthController");
const patientPortalController = require("../controllers/patientPortalController");
const patientAuthMiddleware = require("../middleware/patientAuthMiddleware");

// =========================
// PUBLIC ROUTES (No auth needed)
// =========================

// Patient Registration
router.post("/register", patientAuthController.patientRegister);

// Patient Login
router.post("/login", patientAuthController.patientLogin);

// =========================
// PROTECTED ROUTES (Patient auth required)
// =========================

// Profile
router.get("/profile", patientAuthMiddleware, patientAuthController.getPatientProfile);
router.put("/profile", patientAuthMiddleware, patientAuthController.updatePatientProfile);
router.put("/change-password", patientAuthMiddleware, patientAuthController.changePassword);

// Doctors (for booking dropdown)
router.get("/doctors", patientAuthMiddleware, patientPortalController.getAllDoctorsForPatient);

// Appointments
router.get("/appointments", patientAuthMiddleware, patientPortalController.getMyAppointments);
router.post("/appointments", patientAuthMiddleware, patientPortalController.bookAppointment);
router.put("/appointments/:id", patientAuthMiddleware, patientPortalController.updateMyAppointment);
router.put("/appointments/:id/cancel", patientAuthMiddleware, patientPortalController.cancelMyAppointment);

// Medical Records (Patient can ONLY see their own)
router.get("/medical-records", patientAuthMiddleware, patientPortalController.getMyMedicalRecords);
router.get("/medical-records/:id", patientAuthMiddleware, patientPortalController.getMyMedicalRecordById);

// Prescriptions (Patient can ONLY see their own)
router.get("/prescriptions", patientAuthMiddleware, patientPortalController.getMyPrescriptions);
router.get("/prescriptions/record/:recordId", patientAuthMiddleware, patientPortalController.getMyPrescriptionsByRecord);

module.exports = router;