const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dns = require("dns");
const connectDB = require("./config/db");

const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const blogRoutes = require("./Routes/blogRoutes");

const app = express();

require("dotenv").config();

dns.setServers(["8.8.8.8"]);

connectDB();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(authRoutes);
app.use("/api", userRoutes);
app.use("/api", blogRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true, message: "Server is running" });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});