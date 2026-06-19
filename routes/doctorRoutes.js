const express = require("express");

const router = express.Router();

const doctorController = require("../controllers/doctorController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, doctorController.getDoctors);

router.post("/", authMiddleware, doctorController.addDoctor);

router.put("/:id", authMiddleware, doctorController.updateDoctor);

router.delete("/:id", authMiddleware, doctorController.deleteDoctor);

module.exports = router;