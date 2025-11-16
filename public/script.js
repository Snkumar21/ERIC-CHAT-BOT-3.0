// =====================================================
// SCRIPT.JS — UI + CHAT CONTROLLER + STT + TTS
// =====================================================

// =====================
// NAVBAR TOGGLE
// =====================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// =====================
// ELEMENT SELECTORS
// =====================
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const micBtn = document.getElementById("mic-btn");
const speakerBtn = document.getElementById("speaker-btn");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userNameDisplay = document.getElementById("user-name");

// =====================
// HANDLE USER SESSION
// =====================
const loggedUser = JSON.parse(localStorage.getItem("ericUser"));

if (loggedUser) {
  loginBtn.style.display = "none";
  logoutBtn.style.display = "inline-block";
  userNameDisplay.textContent = loggedUser.name;
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("ericUser");
  window.location.href = "index.html";
});

// =====================
// CHAT EVENTS
// =====================
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

// Memory
let chatMemory = [];

// =====================
// SEND USER MESSAGE
// =====================
function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  chatMemory.push({ sender: "user", text: message });

  userInput.value = "";

  showTypingAnimation();

  setTimeout(() => {
    removeTypingAnimation();
    generateBotReply(message);
  }, 1200);
}

// =====================
// APPEND MESSAGE TO CHAT
// =====================
function appendMessage(text, type) {
  const div = document.createElement("div");
  div.classList.add(`${type}-message`);
  div.textContent = text;

  if (type === "bot") {
    const speakBtn = document.createElement("button");
    speakBtn.classList.add("speak-btn");
    speakBtn.innerHTML = `<i class="fas fa-volume-up"></i>`;
    speakBtn.onclick = () => speakText(text);
    div.appendChild(speakBtn);
  }

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// =====================
// TYPING ANIMATION
// =====================
function showTypingAnimation() {
  const div = document.createElement("div");
  div.id = "typing";
  div.classList.add("bot-message");
  div.innerHTML = "Typing<span>.</span><span>.</span><span>.</span>";
  chatBox.appendChild(div);
}

function removeTypingAnimation() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

// =====================
// SAVE CHAT TO MONGO
// =====================
function saveChatToDB(question, answer) {
  const loggedUser = JSON.parse(localStorage.getItem("ericUser"));
  const userId = loggedUser ? loggedUser._id : null;

  fetch("https://eric-chat-bot.onrender.com/api/chat/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, question, answer }),
  }).catch(err => console.error("DB Save Error:", err));
}

// =====================
// TTS (Text-to-Speech)
// =====================

// Global toggle
let ttsEnabled = false;

// Load voices properly
let availableVoices = [];

window.speechSynthesis.onvoiceschanged = () => {
  availableVoices = window.speechSynthesis.getVoices();
};

// Speaker toggle button
if (speakerBtn) {
  speakerBtn.addEventListener("click", () => {
    ttsEnabled = !ttsEnabled;
    speakerBtn.classList.toggle("active");
  });
}

function speakText(text) {
  if (!ttsEnabled) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;

  // Select en-US voice OR first available
  utter.voice =
    availableVoices.find(v => v.lang === "en-US") ||
    availableVoices[0] ||
    null;

  window.speechSynthesis.speak(utter);
}

// =====================
// STT (Speech-to-Text)
// =====================
let isListening = false;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  micBtn.addEventListener("click", () => {
    if (!isListening) {
      recognition.start();
      micBtn.classList.add("listening");
      isListening = true;
    } else {
      recognition.stop();
      micBtn.classList.remove("listening");
      isListening = false;
    }
  });

  recognition.onresult = e => {
    userInput.value = e.results[0][0].transcript;
    sendMessage();
  };

  recognition.onend = () => {
    micBtn.classList.remove("listening");
    isListening = false;
  };
}