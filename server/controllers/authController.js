const User = require("../models/User");
const { generateTokenAndSetCookie, getCookieOptions } = require("../utils/token");


module.exports.register = async (req, res) => {
    const { username, email, password, bio, avatar } = req.body;

    try {
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(400).json({ success: false, message: "Username or email already in use." });
        }

        const newUser = await User.create({ username, email, password, bio, avatar });
        const token = generateTokenAndSetCookie(res, newUser._id);

        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json({ success: true, user: userObj });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password!" });
        }

        generateTokenAndSetCookie(res, user._id);

        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ success: true, message: "Login successful!", user: userObj });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


module.exports.logout = (req, res) => {
    res.clearCookie("token", getCookieOptions());
    res.status(200).json({ success: true, message: "Logged out successfully." });
}


module.exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}