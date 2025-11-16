// Backend dataset routes
const DATASET_SEARCH_URL = "/api/dataset/search";
const DATASET_ADD_URL = "/api/dataset/add";

// Categories (final list)
const CATEGORIES = [
    "gk", "python", "javascript", "html_css", "science", "sports",
    "politics", "ai", "environment", "computer_fundamentals",
    "dsa", "cloud", "networking", "databases", "chemistry",
    "mathematics", "os", "indian_history", "geography", "custom"
];

// Teaching mode
let teachingState = null;

// Local dataset
const localDataset = {
    "what is ai": "AI means Artificial Intelligence.",
    "python": "Python is a high-level programming language.",
    "capital france": "The capital of France is Paris."
};

// Chat memory (fallback)
if (typeof chatMemory === "undefined") window.chatMemory = [];

// ---------- BACKEND SEARCH ----------
async function searchDataset(question) {
    try {
        const res = await fetch("/api/dataset/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question })
        });

        return await res.json();
    } catch (err) {
        console.error("Dataset Search Error:", err);
        return { found: false };
    }
}

// ---------- ADD TO DATASET (TEACHING) ----------
async function addToDataset(category, question, answer) {
    try {
        const res = await fetch(DATASET_ADD_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, question, answer })
        });
        return await res.json();
    } catch {
        return { success: false };
    }
}

// ---------- LOCAL FUZZY MATCH ----------
function findLocalMatch(msg) {
    msg = msg.toLowerCase();
    let best = null, maxScore = 0;

    for (const q in localDataset) {
        let score = 0;
        q.split(" ").forEach(w => {
            if (msg.includes(w)) score++;
        });
        if (score > maxScore) {
            maxScore = score;
            best = q;
        }
    }

    return maxScore >= 2 ? best : null;
}

// ---------- WEATHER: EXTRACT CITY ----------
function extractCityName(text) {
    text = text.toLowerCase();

    // Case: "weather in delhi"
    if (text.includes("weather in")) {
        return text.split("weather in")[1].trim();
    }

    // Case: "weather delhi"
    if (text.startsWith("weather")) {
        return text.replace("weather", "").trim();
    }

    // Case: "delhi weather"
    if (text.endsWith("weather")) {
        return text.replace("weather", "").trim();
    }

    return null;
}

// ---------- MAIN BOT LOGIC ----------
async function generateBotReply(userMsg) {
    const msg = userMsg.toLowerCase().trim();

    // 1️⃣ Teaching mode (multi-step)
    if (teachingState) {
        await handleTeaching(userMsg);
        return;
    }

    // 2️⃣ User wants to teach the bot
    if (
        msg.includes("teach you") ||
        msg.includes("train you") ||
        msg.startsWith("teach") ||
        msg.startsWith("train") ||
        msg.startsWith("taught")
    ) {
        teachingState = { stage: "askCategory", temp: {} };
        appendMessage(
            "Great! 😊 Which category does this knowledge belong to?\n" +
            CATEGORIES.join(", "),
            "bot"
        );
        return;
    }

    // 3️⃣ Basic Gestures
    const greetings = ["hi", "hello", "hola", "hey", "good morning", "good evening", "good night"];

    if (greetings.some(g => msg.includes(g))) {
        return botResponse(userMsg, "Hello 👋! How can I assist you today?");
    }

    if (msg.includes("how are you")) {
        return botResponse(userMsg, "I'm doing great 😄, thanks for asking! How about you?");
    }

    if (msg.includes("name")) {
        return botResponse(userMsg, "ERIC Chat Bot powered by Tech Nexus.");
    }

    const greets = ["good", "great", "nice", "noice", "wonderful", "grt", "happy"];

    if (greets.some(g => msg.includes(g))) {
        return botResponse(userMsg, "😊 Feel free to ask. Do you want more information you can ask.");
    }

    if (
        msg.includes("nothing") ||
        msg.includes("random") ||
        msg.includes("thinking") ||
        msg.includes("bored") ||
        msg.includes("timepass") ||
        msg.includes("just chilling") ||
        msg.includes("chill")
    ) {
        const randomReplies = [
            "Haha nice 😄 Random thoughts are fun! What are you thinking about?",
            "Ohh nice! 😁 Sometimes thinking nothing is the best way to relax.",
            "Random mode activated 😆 Tell me something interesting!",
            "Doing nothing is also productive sometimes 😄 What’s up?",
            "Thinking randomly? 🤔 I love random chats! Go ahead!",
            "Just vibing? 😎 Same here! Tell me something random."
        ];
        return botResponse(userMsg, randomReplies[Math.floor(Math.random()*randomReplies.length)]);
    }

    // 4️⃣ Date / Time / Day / Year Responses
    const now = new Date();

    if (msg.includes("time")) {
        return botResponse(userMsg, `⏰ Current Time: ${now.toLocaleTimeString()}`);
    }

    if (msg.includes("date")) {
        return botResponse(userMsg, `📅 Today's Date: ${now.toLocaleDateString()}`);
    }

    if (msg.includes("day")) {
        const day = now.toLocaleDateString("en-US", { weekday: "long" });
        return botResponse(userMsg, `📆 Today is: ${day}`);
    }

    if (msg.includes("month")) {
        const month = now.toLocaleDateString("en-US", { month: "long" });
        return botResponse(userMsg, `📆 Current Month: ${month}`);
    }

    if (msg.includes("year")) {
        return botResponse(userMsg, `📆 Current Year: ${now.getFullYear()}`);
    }

    // 5️⃣ WEATHER Responses
    if (msg.includes("weather")) {
        const city = extractCityName(msg);

        if (!city) {
            return botResponse(
                userMsg,
                "Please tell me the city 😊 Example: weather in Delhi"
            );
        }

        const WEATHER_BASE_URL =
            window.location.hostname === "localhost"
                ? "http://localhost:5000/api/weather"
                : "https://eric-chat-bot-3.onrender.com/api/weather";


        try {
            const res = await fetch(`${WEATHER_BASE_URL}/current?city=${city}`);
            const data = await res.json();

            if (!data.success) {
                return botResponse(userMsg, "❌ Sorry, I couldn't fetch the weather.");
            }

            return botResponse(
                userMsg,
                `🌤 Weather Report for ${data.city}\n - ` +
                `🌡Temperature: ${data.temperature},\n` +
                `🤗Feels Like: ${data.feels_like},\n` +
                `💧Humidity: ${data.humidity},\n` +
                `📌Condition: ${data.condition}`
            );
        } catch (err) {
            console.error("Weather Error:", err);
            return botResponse(userMsg, "⚠ Unable to fetch weather right now.");
        }
    }

    // 6️⃣ Auto-detect category and search DB
    const categoryHints = {
        gk: ["india", "capital", "president", "country", "world"],
        python: ["python", "list", "tuple", "def", "function"],
        javascript: ["javascript", "js", "node", "react"],
        html_css: ["html", "css", "tag", "style"],
        science: ["cell", "physics", "chemistry", "biology"],
        sports: ["world cup", "cricket", "football", "score"],
        ai: ["ai", "artificial", "machine learning"],
        environment: ["climate", "pollution", "global warming"]
    };

    for (const cat in categoryHints) {
        if (categoryHints[cat].some(k => msg.includes(k))) {
            const result = await searchDataset(cat, userMsg);
            if (result.found) return botResponse(userMsg, result.answer);
        }
    }

    // 7️⃣ Local dataset backup
    const foundLocal = findLocalMatch(msg);
    if (foundLocal) {
        return botResponse(userMsg, localDataset[foundLocal]);
    }

    // 8️⃣ Not found
    botResponse(
        userMsg,
        "I don’t know yet. I’m still learning 😊\nYou can teach me by typing: 'teach you'"
    );
}

// ---------- TEACHING FLOW ----------
async function handleTeaching(userMsg) {
    const text = userMsg.trim();

    if (teachingState.stage === "askCategory") {
        const cat = text.toLowerCase();
        if (!CATEGORIES.includes(cat)) {
            return appendMessage("Please pick a valid category:\n" + CATEGORIES.join(", "), "bot");
        }
        teachingState.temp.category = cat;
        teachingState.stage = "askQuestion";
        appendMessage("Great! Now enter the question you want to teach.", "bot");
        return;
    }

    if (teachingState.stage === "askQuestion") {
        teachingState.temp.question = text;
        teachingState.stage = "askAnswer";
        appendMessage("Perfect! Now enter the answer to this question.", "bot");
        return;
    }

    if (teachingState.stage === "askAnswer") {
        const { category, question } = teachingState.temp;
        const answer = text;

        appendMessage("Saving your knowledge…", "bot");

        const saved = await addToDataset(category, question, answer);

        if (saved.success) {
            appendMessage("✅ I learned it! Thank you 😊", "bot");
        } else {
            appendMessage("❌ Something went wrong while saving.", "bot");
        }

        teachingState = null;
    }
}

// ---------- FINAL BOT OUTPUT ----------
function botResponse(question, answer) {
    appendMessage(answer, "bot");

    chatMemory.push({ sender: "bot", text: answer });

    try {
        if (typeof saveChatToDB === "function") saveChatToDB(question, answer);
    } catch {}
}

window.generateBotReply = generateBotReply;