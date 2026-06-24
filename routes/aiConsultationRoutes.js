const express = require("express");
const router = express.Router();

const aiConsultationController = require("../controllers/aiConsultationController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
router.get("/", authMiddleware, aiConsultationController.getAIConsultations);
router.get("/patient/:patientId", authMiddleware, aiConsultationController.getConsultationsByPatient);
router.post("/", authMiddleware, aiConsultationController.addAIConsultation);
router.delete("/:id", authMiddleware, aiConsultationController.deleteAIConsultation);

module.exports = router;