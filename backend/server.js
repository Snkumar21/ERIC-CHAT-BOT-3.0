require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const datasetRoutes = require("./routes/datasetRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

// =====================
// ⭐ OPENAI SETUP
// =====================
const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

// =====================
const app = express();
const PORT = process.env.PORT || 5000;

// DEBUG
console.log("Loaded MONGO_URI:", !!process.env.MONGO_URI ? "[set]" : "[not set]");
console.log("Loaded OPENAI_KEY:", !!process.env.OPENAI_KEY ? "[set]" : "[not set]");
console.log("NODE_ENV:", process.env.NODE_ENV || "development");

// =====================
// CORS
// =====================
app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://localhost:5000",
        "http://localhost:5173",
        "https://eric-chat-bot.vercel.app"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
}));

app.use(bodyParser.json());

// Connect DB
connectDB();

// Static Folder
app.use(express.static(path.join(__dirname, "../public")));

// =========================================================
// ⭐ AI ROUTE — MAIN CHATBOT BRAIN (GPT + Memory)
// =========================================================

app.post("/api/ai/ask", async (req, res) => {
    try {
        const { prompt, memory } = req.body;

        if (!prompt) {
            return res.status(400).json({ reply: "Prompt is required." });
        }

        const messages = [
            {
                role: "system",
                content: "You are ERIC, a friendly smart AI chatbot created by Nitish."
            }
        ];

        // Add memory from frontend (optional)
        if (Array.isArray(memory)) {
            memory.forEach(m => {
                messages.push({
                    role: m.sender === "user" ? "user" : "assistant",
                    content: m.text
                });
            });
        }

        // Add user prompt
        messages.push({ role: "user", content: prompt });

        // =====================
        // 🔥 Call GPT Model
        // =====================
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
        });

        const reply = aiResponse.choices[0].message.content;

        res.json({ reply });

    } catch (error) {
        console.error("❌ AI Route Error:", error);
        res.status(500).json({
            reply: "⚠️ AI server error. Please try again later."
        });
    }
});

// =========================================================
// ROUTES
// =========================================================
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dataset", datasetRoutes);
app.use("/api/weather", weatherRoutes);

// Catch-all → frontend
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Error handling
app.use(errorHandler);

// =========================================================
// START SERVER
// =========================================================
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});