const express = require("express");

const router = express.Router();

const specialtyController = require("../controllers/specialtyController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, specialtyController.getSpecialties);
router.post("/", authMiddleware, specialtyController.addSpecialty);

module.exports = router;