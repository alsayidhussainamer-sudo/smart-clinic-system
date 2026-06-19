const express = require("express");
const router = express.Router();

const {
    generateMedicalSuggestion,
    chatWithAI
} = require("../controllers/aiController");

router.post("/suggest", generateMedicalSuggestion);

router.post("/chat", chatWithAI);

module.exports = router;