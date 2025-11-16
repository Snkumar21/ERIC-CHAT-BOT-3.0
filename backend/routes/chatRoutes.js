const express = require("express");
const ChatMemory = require("../models/chatMemory");
const router = express.Router();

// POST /api/chat/save
// Save a chat (user question + bot answer)
router.post("/save", async (req, res) => {
    try {
        const { userId, question, answer } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ message: "Question and Answer are required" });
        }

        const newMemory = new ChatMemory({ userId, question, answer });
        await newMemory.save();

        res.status(201).json({ message: "Chat saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving chat:", error);
        res.status(500).json({ message: "Server error while saving chat" });
    }
});

// GET /api/chat/search?query=...&userId=...
// Search chat memories (returns array of matches)
router.get("/search", async (req, res) => {
    try {
        const { query, userId } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        // Build search filter; include userId if provided
        const filter = {
            question: { $regex: query, $options: "i" }
        };
        if (userId) filter.userId = userId;

        // return list of matches (limit to 20)
        const results = await ChatMemory.find(filter).sort({ createdAt: -1 }).limit(20);
        res.json({ results });
    } catch (error) {
        console.error("❌ Error searching chat history:", error);
        res.status(500).json({ message: "Server error while searching chat memory" });
    }
});

module.exports = router;