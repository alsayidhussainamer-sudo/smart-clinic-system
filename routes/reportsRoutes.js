const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reportsController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All reports are Admin only
router.get("/appointments", authMiddleware, roleMiddleware("Admin"), reportsController.getAppointmentsReport);
router.get("/doctors", authMiddleware, roleMiddleware("Admin"), reportsController.getDoctorsReport);
router.get("/patients", authMiddleware, roleMiddleware("Admin"), reportsController.getPatientsReport);
router.get("/statistics", authMiddleware, roleMiddleware("Admin"), reportsController.getStatisticsSummary);

module.exports = router;