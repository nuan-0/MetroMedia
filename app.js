// app.js

// Free user timer = 10 minutes
let freeTime = 10*60; // 10 min in seconds

// Example cities and lines
const cities = {
  Delhi: ["Blue", "Yellow", "Red", "Violet", "Pink"],
  Bangalore: ["Purple", "Green", "Yellow"],
  Mumbai: ["Red", "Blue", "Green"]
};

// DOM Elements
const citySelect = document.getElementById("city");
const lineSelect = document.getElementById("line");
const startBtn = document.getElementById("startBtn");
const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const watchAdBtn = document.getElementById("watchAdBtn");
const payBtn = document.getElementById("payBtn");
const chatContainer = document.getElementById("chatContainer");
const overlay = document.getElementById("overlay");
const shareBtn = document.getElementById("shareBtn");

// Populate cities
Object.keys(cities).forEach(city => {
  let option = document.createElement("option");
  option.value = city;
  option.textContent = city;
  citySelect.appendChild(option);
});

// Populate lines based on selected city
function populateLines() {
  lineSelect.innerHTML = "";
  cities[citySelect.value].forEach(line => {
    let option = document.createElement("option");
    option.value = line;
    option.textContent = line;
    lineSelect.appendChild(option);
  });
}

citySelect.addEventListener("change", populateLines);
populateLines();

// Start button
startBtn.addEventListener("click", () => {
  page1.style.display = "none";
  page2.style.display = "block";

  // Overlay logic: free users see ad overlay, paid users skip
  if (!localStorage.getItem(`${citySelect.value}-${lineSelect.value}-paid`)) {
    showOverlay();
  } else {
    startChat(true);
  }
});

// Overlay functions
function showOverlay() {
  overlay.style.display = "block";
  chatContainer.innerHTML = ""; // chat blurred behind
}

watchAdBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  startChat(false); // free read-only
  logSession("free");
  startFreeTimer();
});

payBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  startChat(true); // full access
  localStorage.setItem(`${citySelect.value}-${lineSelect.value}-paid`, true);
  logSession("paid");
});

function startChat(isPaid) {
  chatContainer.innerHTML = `<p>Metromedia Live Chat (${isPaid ? "Full Access" : "Read Only"})</p>`;
}

// Free timer
function startFreeTimer() {
  let timer = freeTime;
  const interval = setInterval(() => {
    timer--;
    if (timer <= 0) {
      clearInterval(interval);
      showOverlay();
    }
  }, 1000);
}

// Share button
shareBtn.addEventListener("click", () => {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: "Metromedia", url });
  } else {
    navigator.clipboard.writeText(url);
    alert("Metromedia link copied!");
  }
});

// Logging function
function logSession(type) {
  fetch("/api/logSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      city: citySelect.value,
      line: lineSelect.value,
      type: type,
      timestamp: new Date().toISOString()
    })
  });
}
