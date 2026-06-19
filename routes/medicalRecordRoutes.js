const express = require("express");

const router = express.Router();

const medicalRecordController =
    require("../controllers/medicalRecordController");

const authMiddleware =
    require("../middleware/authMiddleware");


router.get(
    "/",
    authMiddleware,
    medicalRecordController.getMedicalRecords
);

router.post(
    "/",
    authMiddleware,
    medicalRecordController.addMedicalRecord
);

router.put(
    "/:id",
    authMiddleware,
    medicalRecordController.updateMedicalRecord
);

router.delete(
    "/:id",
    authMiddleware,
    medicalRecordController.deleteMedicalRecord
);

module.exports = router;