const express = require("express");
const authControllers = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/api/auth/register", authControllers.register)
router.post("/api/auth/login", authControllers.login)
router.post("/api/auth/logout", authControllers.logout)
router.get("/api/auth/me", protect, authControllers.getMe)


module.exports = router