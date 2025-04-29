require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

// CORS Headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).json({});
    }

    next();
});

// Static folder for uploaded files
app.use("/shared", express.static(path.join(__dirname, "shared")));

// 🔹 Import Routes
const landRoutes = require("./routes/land");
const uploadRoute = require("./routes/upload");

app.use("/api/land", landRoutes);
app.use("/upload", uploadRoute);

// Root Route
app.get("/", (req, res) => {
    res.status(200).send("✅ Digital Locker Backend is Running...");
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
