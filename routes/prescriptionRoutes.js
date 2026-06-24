const express = require("express");
const router = express.Router();

const prescriptionController = require("../controllers/prescriptionController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
router.get("/", authMiddleware, prescriptionController.getPrescriptions);
router.get("/record/:recordId", authMiddleware, prescriptionController.getPrescriptionsByRecord);
router.post("/", authMiddleware, prescriptionController.addPrescription);
router.put("/:id", authMiddleware, prescriptionController.updatePrescription);
router.delete("/:id", authMiddleware, prescriptionController.deletePrescription);

module.exports = router;