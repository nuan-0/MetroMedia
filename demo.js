//////////////////////////////
// Metro Chat PWA - app.js //
//////////////////////////////

// ===== Variables =====
const cities = {
  delhi: ["Blue", "Yellow", "Red", "Violet", "Pink"],
  bangalore: ["Purple", "Green", "Yellow"],
  mumbai: ["Red", "Blue", "Green"],
  kolkata: ["Blue", "Green", "Red"],
  pune: ["Purple", "Orange"]
};

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const citySelect = document.getElementById("citySelect");
const lineSelect = document.getElementById("lineSelect");
const statusInput = document.getElementById("statusInput");
const proceedBtn = document.getElementById("proceedBtn");

const chatContainer = document.getElementById("chatContainer");
const messagesDiv = document.getElementById("messages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

const accessOverlay = document.getElementById("accessOverlay");
const payBtn = document.getElementById("payBtn");
const watchAdBtn = document.getElementById("watchAdBtn");

const adOverlay = document.getElementById("adOverlay");
const closeAdBtn = document.getElementById("closeAdBtn");

// ===== Share button variables =====
const appLink = "https://your-pwa-url.vercel.app";

// ===== User state =====
let currentUser = { paid: false, freeTimer: 0 };
let timerInterval;
let selectedCity, selectedLine;

// ===== Functions =====

// Populate line options based on selected city
function updateLines() {
  const lines = cities[citySelect.value] || [];
  lineSelect.innerHTML = "";
  lines.forEach(line => {
    const option = document.createElement("option");
    option.value = line.toLowerCase();
    option.textContent = line;
    lineSelect.appendChild(option);
  });
}

// Show overlay for paid/free access
function showOverlay() {
  chatContainer.classList.add("blurred");
  accessOverlay.style.display = "flex";
  sendBtn.disabled = true;
}

// Start 10-min timer for free users
function startFreeTimer(minutes) {
  currentUser.freeTimer = minutes * 60;
  sendBtn.disabled = true;
  chatContainer.classList.remove("blurred");

  timerInterval = setInterval(() => {
    currentUser.freeTimer--;
    if (currentUser.freeTimer <= 0) {
      clearInterval(timerInterval);
      showOverlay(); // back to overlay after 10 min
    }
  }, 1000);
}

// Append chat message
function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<b>${sender}:</b> ${text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ===== Event Listeners =====

// Page 1 → Page 2
proceedBtn.addEventListener("click", () => {
  selectedCity = citySelect.value;
  selectedLine = lineSelect.value;
  if (!selectedLine) return alert("Select a line!");
  page1.classList.remove("active");
  page2.classList.add("active");
  showOverlay();
});

// Paid user click
payBtn.addEventListener("click", () => {
  currentUser.paid = true;
  clearInterval(timerInterval);
  accessOverlay.style.display = "none";
  chatContainer.classList.remove("blurred");
  sendBtn.disabled = false;
});

// Free user click → show ad overlay
watchAdBtn.addEventListener("click", () => {
  adOverlay.style.display = "flex";
  chatContainer.classList.add("blurred");
});

// Close ad → start free 10-min chat
closeAdBtn.addEventListener("click", () => {
  adOverlay.style.display = "none";
  chatContainer.classList.remove("blurred");
  startFreeTimer(10);
});

// Send chat message
sendBtn.addEventListener("click", () => {
  const msg = chatInput.value.trim();
  if (!msg) return;
  appendMessage("You", msg);
  chatInput.value = "";
  // TODO: send to backend / Telegram for live chat
});

// Share buttons
function shareX() {
  const text = encodeURIComponent("Check out MetroMedia chat PWA! 🚇 " + appLink);
  window.open(`https://x.com/intent/tweet?text=${text}`, "_blank");
}

function shareWA() {
  const text = encodeURIComponent("Check out MetroMedia chat PWA! 🚇 " + appLink);
  window.open(`https://wa.me/?text=${text}`, "_blank");
}

function copyLink() {
  navigator.clipboard.writeText(appLink)
    .then(() => alert("Link copied! Share it with friends 🚀"))
    .catch(() => alert("Copy failed. Try manually!"));
}

// Initialize lines
updateLines();
citySelect.addEventListener("change", updateLines);