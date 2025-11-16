const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            console.warn("⚠️  MONGO_URI not set. Starting server without DB connection (dev mode).");
            // Do not exit. Allow server to run for frontend/testing.
            return;
        }

        const conn = await mongoose.connect(mongoURI, {
            // keep options minimal; driver v4+ ignores some legacy flags
            // use unified topology / new url parser is default in recent drivers
        });

        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        // On real deployments we should exit, but only if MONGO_URI was provided:
        // If URI provided but connection fails (bad auth, network), exit so platform restarts/deploy fails.
        if (process.env.MONGO_URI) process.exit(1);
    }
};
module.exports = connectDB;