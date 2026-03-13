// ====== Elements ======
const landing = document.getElementById('landing');
const lineSelect = document.getElementById('lineSelect');
const proceedBtn = document.getElementById('proceedBtn');
const crowdStatus = document.getElementById('crowdStatus');

const access = document.getElementById('access');
const payBtn = document.getElementById('payBtn');
const adBtn = document.getElementById('adBtn');
const timerDisplay = document.getElementById('timer');

const chatScreen = document.getElementById('chatScreen');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const lineName = document.getElementById('lineName');
const crowdDisplay = document.getElementById('crowdDisplay');

// ====== State ======
let selectedLine = '';
let freeTimer = null;
let isPaid = false;

// ====== Landing Page Flow ======
proceedBtn.addEventListener('click', () => {
  selectedLine = lineSelect.value;
  lineName.innerText = selectedLine.charAt(0).toUpperCase() + selectedLine.slice(1) + ' Line';
  updateCrowdStatus();
  landing.classList.add('hidden');
  access.classList.remove('hidden');
});

// ====== Access Flow ======
payBtn.addEventListener('click', () => {
  startPaidChat();
});

adBtn.addEventListener('click', async () => {
  // TODO: Integrate AdMob / rewarded ad here
  alert('Ad placeholder — after watching ad you can read chat for 10 min.');
  startFreeChat();
});

// ====== Free User Flow ======
function startFreeChat() {
  sendBtn.disabled = true;
  access.classList.add('hidden');
  chatScreen.classList.remove('hidden');

  let timeLeft = 10 * 60; // 10 minutes
  timerDisplay.innerText = `Time left: 10:00`;

  freeTimer = setInterval(() => {
    timeLeft--;
    const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const sec = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.innerText = `Time left: ${min}:${sec}`;

    if (timeLeft <= 0) {
      clearInterval(freeTimer);
      alert('10 minutes over! Choose access again.');
      chatScreen.classList.add('hidden');
      access.classList.remove('hidden');
    }
  }, 1000);

  loadChat();
}

// ====== Paid User Flow ======
function startPaidChat() {
  isPaid = true;
  sendBtn.disabled = false;
  access.classList.add('hidden');
  chatScreen.classList.remove('hidden');
  timerDisplay.innerText = 'Full-day access';
  loadChat();
}

// ====== Chat ======
sendBtn.addEventListener('click', async () => {
  const msg = messageInput.value.trim();
  if (!msg) return;

  // Call backend placeholder
  await fetch(`/api/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ line: selectedLine, message: msg })
  });

  messageInput.value = '';
  await loadChat();
});

async function loadChat() {
  // Fetch messages from backend placeholder
  const res = await fetch(`/api/getMessages?line=${selectedLine}`);
  const data = await res.json();
  chatMessages.innerHTML = '';

  data.messages.forEach(m => {
    const p = document.createElement('p');
    p.innerText = m;
    chatMessages.appendChild(p);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ====== Crowd Status ======
async function updateCrowdStatus() {
  // Placeholder: Fetch from backend
  const res = await fetch(`/api/updateCrowd?line=${selectedLine}`);
  const data = await res.json();
  crowdStatus.innerText = `Crowd status: ${data.status}`;
  crowdDisplay.innerText = `Crowd: ${data.status}`;
}

// ====== Auto-refresh chat every 5 sec ======
setInterval(() => {
  if (chatScreen.classList.contains('hidden')) return;
  loadChat();
}, 5000);