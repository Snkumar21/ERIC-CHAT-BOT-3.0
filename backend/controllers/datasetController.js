const Dataset = require("../models/Dataset");

// 👉 Search dataset intelligently
const searchDataset = async (req, res) => {
    try {
        const { category, question } = req.body;
        if (!question) return res.status(400).json({ found: false });

        const query = category
            ? { category, question: { $regex: new RegExp(question, "i") } }
            : { question: { $regex: new RegExp(question, "i") } };

        const doc = await Dataset.findOne(query);

        if (!doc) return res.json({ found: false });

        res.json({ found: true, answer: doc.answer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ found: false });
    }
};

// 👉 Add new dataset entry
const addDataset = async (req, res) => {
    try {
        const { category, question, answer } = req.body;

        if (!category || !question || !answer) {
            return res.status(400).json({ success: false, message: "Missing fields" });
        }

        const exists = await Dataset.findOne({
            category,
            question: { $regex: new RegExp(`^${question}$`, "i") }
        });

        if (exists) {
            return res.json({ success: false, message: "Already exists" });
        }

        await Dataset.create({ category, question, answer });

        res.json({ success: true, message: "Saved successfully!" });
    } catch (err) {
        console.error("Dataset Add Error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { searchDataset, addDataset };