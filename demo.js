// Unique ID per visitor
let userId = `user_${Date.now()}_${Math.floor(Math.random()*1000)}`; 
let currentCity = 'delhi';
let currentLine = '';
let isPaidUser = false;
let freeTimer = 10 * 60; // free read-only timer in seconds

// AdSense key from Vercel env
const adsenseKey = process.env.ADSENSE;

// City → Line mapping (actual lines)
const cityLines = {
  "delhi": ["Red Line", "Yellow Line", "Blue Line Main", "Blue Line Branch", "Green Line", "Violet Line", "Pink Line", "Magenta Line", "Grey Line", "Airport Express"],
  "mumbai": ["Metro Line 1 (Versova–Ghatkopar)", "Metro Line 2 (DN Nagar–Mandala)", "Metro Line 2A (Dahisar–Andheri)", "Metro Line 3 (Colaba–Bandra SEEPZ)", "Line 7 (Andheri–Bhandup)"],
  "bangalore": ["Purple Line", "Green Line", "Blue Line (Airport Section)", "Yellow Line"],
  "hyderabad": ["Red Line", "Blue Line", "Green Line"],
  "chennai": ["Blue Line (Washermanpet–Airport)", "Green Line (Guindy–St Thomas Mount)"],
  "kolkata": ["Line 1 (North–South)", "Line 2 (East–West)", "Line 3 (Joka–Esplanade)", "Line 4 (Noapara–Baranagar)"],
  "ahmedabad": ["Blue Line", "Red Line", "Yellow Line", "Violet Line"],
  "lucknow": ["Red Line"],
  "jaipur": ["Pink Line"],
  "noida": ["Aqua Line"],
  "nagpur": ["Orange Line", "Aqua Line"],
  "pune": ["Purple Line", "Aqua Line"],
  "kochi": ["Kochi Metro"]
};

// DOM elements
const citySelect = document.getElementById('citySelect');
const lineSelect = document.getElementById('lineSelect');
const proceedBtn = document.getElementById('proceedBtn');
const accessDiv = document.getElementById('access');
const payBtn = document.getElementById('payBtn');
const adBtn = document.getElementById('adBtn');
const chatScreen = document.getElementById('chatScreen');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

sendBtn.disabled = true; // send disabled by default

// Populate lines dropdown
function populateLines(city) {
  const lines = cityLines[city];
  lineSelect.innerHTML = '';
  lines.forEach(line => {
    const option = document.createElement('option');
    option.value = line;
    option.textContent = line;
    lineSelect.appendChild(option);
  });
}
populateLines(currentCity);

citySelect.addEventListener('change', () => {
  currentCity = citySelect.value;
  populateLines(currentCity);
});

// Helpers
function updateChatUI(messages) {
  chatMessages.innerHTML = messages.map(m => `<div>${m.message}</div>`).join('');
}

async function fetchMessages() {
  if (!currentLine) return;
  const res = await fetch(`/api/fetch?city=${currentCity}&line=${currentLine}`);
  const data = await res.json();
  updateChatUI(data.messages);
}

function updateFreeCountdown() {
  if (!isPaidUser && freeTimer > 0) {
    const min = Math.floor(freeTimer/60);
    const sec = freeTimer%60;
    sendBtn.innerText = `Read-only (${min}:${sec.toString().padStart(2,'0')})`;
  }
}

// Polling
setInterval(fetchMessages, 2000);
setInterval(() => {
  if (!isPaidUser && freeTimer > 0) freeTimer--;
  if (!isPaidUser && freeTimer <= 0) {
    alert('Free read-only session ended. Pay or watch ad to continue.');
    chatScreen.style.display = 'none';
    accessDiv.style.display = 'block';
  }
  updateFreeCountdown();
}, 1000);

// Step 1: User selects line
proceedBtn.addEventListener('click', async () => {
  currentLine = lineSelect.value;
  const statusRes = await fetch(`/api/crowd?city=${currentCity}&line=${currentLine}`);
  const statusData = await statusRes.json();
  alert(`Current crowd status for ${currentCity.toUpperCase()} ${currentLine}: ${statusData.status}`);
  accessDiv.style.display = 'block';
});

// Step 2: Free read-only
adBtn.addEventListener('click', async () => {
  const res = await fetch(`/api/access?userId=${userId}&city=${currentCity}&line=${currentLine}&type=free`);
  const data = await res.json();
  isPaidUser = false;
  freeTimer = data.expiresIn;
  accessDiv.style.display = 'none';
  chatScreen.style.display = 'block';
  sendBtn.disabled = true;
});

// Step 2: Paid
payBtn.addEventListener('click', async () => {
  const res = await fetch(`/api/access?userId=${userId}&city=${currentCity}&line=${currentLine}&type=paid`);
  const data = await res.json();
  isPaidUser = true;
  accessDiv.style.display = 'none';
  chatScreen.style.display = 'block';
  sendBtn.disabled = false;
});

// Send messages
sendBtn.addEventListener('click', async () => {
  const msg = messageInput.value.trim();
  if (!msg) return;
  const res = await fetch('/api/send', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({city: currentCity, line: currentLine, message: msg, userId})
  });
  const data = await res.json();
  if (data.error) return alert(data.error);
  messageInput.value = '';
});

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !sendBtn.disabled) sendBtn.click();
});