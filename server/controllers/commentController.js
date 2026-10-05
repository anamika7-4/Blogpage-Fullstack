const Comment = require("../models/Comment");


module.exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { id: blogId } = req.params;

        const comment = await Comment.create({
            blog: blogId,
            author: req.user._id,
            content,
        });

        await comment.populate("author", "username avatar");

        res.status(201).json({ success: true, comment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


module.exports.getComments = async (req, res) => {
    try {
        const { id: blogId } = req.params;
        const comments = await Comment.find({ blog: blogId })
            .sort({ createdAt: -1 })
            .populate("author", "username avatar");

        res.status(200).json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


module.exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);

        if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ success: true, message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
