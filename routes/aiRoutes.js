const express = require("express");
const router = express.Router();

const { generateMedicalSuggestion, chatWithAI } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");
const patientAuthMiddleware = require("../middleware/patientAuthMiddleware");

// Unified auth middleware that accepts both staff and patient tokens
const unifiedAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Try staff auth first
    try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "smartclinicsecret");
        req.user = decoded;
        return next();
    } catch (staffErr) {
        // Try patient auth
        try {
            const jwt = require("jsonwebtoken");
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "smartclinicsecret");
            if (decoded.type === "patient") {
                req.user = decoded;
                return next();
            }
        } catch (patientErr) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }

    return res.status(401).json({ message: "Invalid token" });
};

// AI Medical Suggestion - requires any authenticated user
router.post("/suggest", unifiedAuthMiddleware, generateMedicalSuggestion);

// AI Chatbot - requires any authenticated user
router.post("/chat", unifiedAuthMiddleware, chatWithAI);

module.exports = router;