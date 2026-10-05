const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        excerpt: { type: String, default: "" },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        category: { type: String, required: true },
        image: { type: String, default: "" },
        tags: [String],
        isPublished: { type: Boolean, default: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        views: { type: Number, default: 0 },
        readTime: { type: Number, default: 1 }, // minutes
    },
    { timestamps: true }
)


blogSchema.index({ title: "text", content: "text", tags: "text" })

const Blog = mongoose.model("blogs", blogSchema);
module.exports = Blog