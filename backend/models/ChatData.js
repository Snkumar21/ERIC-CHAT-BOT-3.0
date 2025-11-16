const mongoose = require("mongoose");

const chatDataSchema = new mongoose.Schema({
    category: { type: String, required: true },
    question: { type: String, required: true, unique: true },
    answer: { type: String, required: true },
});

module.exports = mongoose.model("ChatData", chatDataSchema);