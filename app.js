// ============================
// Metromedia App Logic
// ============================

// Free user timer = 3 minutes
let freeTime = 180; // seconds

// Example cities and metro lines
const cities = {
  Delhi: ["Blue", "Yellow", "Red", "Violet", "Pink"],
  Bangalore: ["Purple", "Green", "Yellow"],
  Mumbai: ["Red", "Blue", "Green"]
};

// ============================
// DOM Elements
// ============================

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

const adOverlay = document.getElementById("adOverlay");

// ============================
// Populate Cities
// ============================

Object.keys(cities).forEach(city => {

  const option = document.createElement("option");

  option.value = city;
  option.textContent = city;

  citySelect.appendChild(option);

});

// ============================
// Populate Lines
// ============================

function populateLines() {

  lineSelect.innerHTML = "";

  cities[citySelect.value].forEach(line => {

    const option = document.createElement("option");

    option.value = line;
    option.textContent = line;

    lineSelect.appendChild(option);

  });

}

citySelect.addEventListener("change", populateLines);

populateLines();

// ============================
// Start Button
// ============================

startBtn.addEventListener("click", () => {

  page1.style.display = "none";
  page2.style.display = "block";

  const key = `${citySelect.value}-${lineSelect.value}-paid`;

  if (!localStorage.getItem(key)) {

    showOverlay();

  } else {

    startChat(true);

  }

});

// ============================
// Overlay Logic
// ============================

function showOverlay() {

  overlay.style.display = "block";

  chatContainer.innerHTML = "";

}

// ============================
// Watch Ad Logic
// ============================

watchAdBtn.addEventListener("click", () => {

  adOverlay.style.display = "flex";

  // simulate ad watch time
  setTimeout(() => {

    adOverlay.style.display = "none";

    overlay.style.display = "none";

    startChat(false); // read only

    logSession("free");

    startFreeTimer();

  }, 5000);

});

// ============================
// Pay Button Logic
// ============================

payBtn.addEventListener("click", () => {

  overlay.style.display = "none";

  startChat(true);

  const key = `${citySelect.value}-${lineSelect.value}-paid`;

  localStorage.setItem(key, true);

  logSession("paid");

});

// ============================
// Chat Logic
// ============================

function startChat(isPaid) {

  chatContainer.innerHTML = `
  
  <div>
  <p><strong>Metromedia Live Chat</strong></p>
  <p>City: ${citySelect.value}</p>
  <p>Line: ${lineSelect.value}</p>
  <p>Status: ${isPaid ? "Full Access" : "Read Only (3 min)"}</p>
  </div>
  
  `;

}

// ============================
// Free Timer
// ============================

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

// ============================
// Share Button
// ============================

shareBtn.addEventListener("click", () => {

  const url = window.location.href;

  if (navigator.share) {

    navigator.share({

      title: "Metromedia",
      url: url

    });

  } else {

    navigator.clipboard.writeText(url);

    alert("Metromedia link copied!");

  }

});

// ============================
// Logging
// ============================

function logSession(type) {

  fetch("/api/logSession", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({

      city: citySelect.value,

      line: lineSelect.value,

      type: type,

      timestamp: new Date().toISOString()

    })

  });

}