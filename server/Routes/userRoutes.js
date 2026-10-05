const express = require("express");
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/users", protect, userController.getAllUsers)
router.get("/users/my-blogs", protect, userController.getMyBlogs)
router.get("/users/:id/profile", userController.getProfile)
router.put("/users/profile", protect, userController.updateProfile)

module.exports = router;