const ChatData = require("../models/ChatData");

// 🟢 Handle user question
const askQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        const found = await ChatData.findOne({ question: { $regex: new RegExp(question, "i") } });

        if (found) {
            return res.json({ reply: found.answer });
        } else {
            return res.json({
                reply: "Sorry, I don’t have an answer for that. Would you like to teach me?",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🟡 Teach chatbot new data
const teachBot = async (req, res) => {
    try {
        const { question, answer } = req.body;

        const existing = await ChatData.findOne({ question: { $regex: new RegExp(question, "i") } });
        if (existing) {
            return res.json({ message: "I already know this answer!" });
        }

        const newData = new ChatData({ question, answer });
        await newData.save();
        res.json({ message: "Thanks! I’ve learned something new 🤖" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save new knowledge" });
    }
};

module.exports = { askQuestion, teachBot };