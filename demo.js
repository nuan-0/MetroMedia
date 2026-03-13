// Unique ID per visitor
let userId = `user_${Date.now()}_${Math.floor(Math.random()*1000)}`; 
let currentLine = '';
let isPaidUser = false;
let freeTimer = 10 * 60; // free read-only timer in seconds

// DOM elements
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

// ---------------------------
// Helpers
// ---------------------------
function updateChatUI(messages) {
  chatMessages.innerHTML = messages.map(m => `<div>${m.message}</div>`).join('');
}

async function fetchMessages() {
  if (!currentLine) return;
  const res = await fetch(`/api/fetch?line=${currentLine}`);
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

// ---------------------------
// Polling
// ---------------------------
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

// ---------------------------
// Event Listeners
// ---------------------------

// Step 1: User selects line
proceedBtn.addEventListener('click', async () => {
  currentLine = lineSelect.value;

  // Step 2: Fetch crowd status for selected line
  const statusRes = await fetch(`/api/crowd?line=${currentLine}`);
  const statusData = await statusRes.json();
  alert(`Current crowd status for ${currentLine.toUpperCase()} line: ${statusData.status}`);

  // Step 3: Show Ad/Pay options
  accessDiv.style.display = 'block';
});

// Step 3: Free read-only session
adBtn.addEventListener('click', async () => {
  const res = await fetch(`/api/access?userId=${userId}&line=${currentLine}&type=free`);
  const data = await res.json();
  isPaidUser = false;
  freeTimer = data.expiresIn;

  accessDiv.style.display = 'none';
  chatScreen.style.display = 'block';
  sendBtn.disabled = true; // always read-only
});

// Step 3: Paid session
payBtn.addEventListener('click', async () => {
  const res = await fetch(`/api/access?userId=${userId}&line=${currentLine}&type=paid`);
  const data = await res.json();
  isPaidUser = true;

  accessDiv.style.display = 'none';
  chatScreen.style.display = 'block';
  sendBtn.disabled = false; // can send
});

// Send messages (paid users only)
sendBtn.addEventListener('click', async () => {
  const msg = messageInput.value.trim();
  if (!msg) return;

  const res = await fetch('/api/send', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({line: currentLine, message: msg, userId})
  });
  const data = await res.json();
  if (data.error) return alert(data.error);

  messageInput.value = '';
});

// Press Enter to send
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !sendBtn.disabled) sendBtn.click();
});