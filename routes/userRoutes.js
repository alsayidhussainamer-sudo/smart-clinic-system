const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public routes (no auth needed)
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes - Admin only
router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin"),
    userController.getAllUsers
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    userController.updateUser
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    userController.deleteUser
);

module.exports = router;