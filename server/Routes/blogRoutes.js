const express = require("express");
const blogController = require("../controllers/blogController");
const commentController = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();


router.post("/blogs", protect, blogController.createBlog)
router.get("/blogs", blogController.getAllBlogs)
router.get("/blogs/featured", blogController.getFeaturedBlogs)
router.get("/blogs/categories", blogController.getCategories)
router.get("/blogs/:id", blogController.getSingleBlog)
router.put("/blogs/:id", protect, blogController.updateBlog)
router.delete("/blogs/:id", protect, blogController.deleteBlog)


router.post("/blogs/:id/like", protect, blogController.likeBlog)

router.post("/blogs/:id/comments", protect, commentController.addComment)
router.get("/blogs/:id/comments", commentController.getComments)
router.delete("/blogs/:id/comments/:commentId", protect, commentController.deleteComment)


module.exports = router