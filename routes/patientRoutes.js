const express = require("express");

const router = express.Router();

const patientController = require("../controllers/patientController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, patientController.getPatients);
router.post("/", authMiddleware, patientController.addPatient);
router.get("/:id", authMiddleware, patientController.getPatientById);
router.put("/:id", authMiddleware, patientController.updatePatient);
router.delete("/:id", authMiddleware, patientController.deletePatient);


module.exports = router;