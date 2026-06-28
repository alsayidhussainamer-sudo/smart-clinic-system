const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided. Please login."
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Invalid token format"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "smartclinicsecret"
        );

        // Verify this is a patient token
        if (decoded.type !== "patient") {
            return res.status(403).json({
                message: "Access denied. Patient account required."
            });
        }

        req.patientId = decoded.id;
        req.patientEmail = decoded.email;
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Session expired. Please login again."
            });
        }
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};