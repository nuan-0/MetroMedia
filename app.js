// ============================
// Metromedia App Logic
// ============================

// Free user timer = 3 minutes
let freeTime = 180;

let lastMessageCount = 0;
let messageInterval = null;

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

function populateLines(){

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
// Start Chat
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
// Overlay
// ============================

function showOverlay(){

  overlay.style.display = "flex";
  chatContainer.classList.add("blurred");

}

// ============================
// Watch Ad
// ============================

watchAdBtn.addEventListener("click", () => {

  adOverlay.style.display = "flex";

  setTimeout(() => {

    adOverlay.style.display = "none";
    overlay.style.display = "none";
    chatContainer.classList.remove("blurred");

    startChat(false);

    logSession("free");

    startFreeTimer();

  }, 5000);

});

// ============================
// Paid Unlock
// ============================

payBtn.addEventListener("click", () => {

  overlay.style.display = "none";
  chatContainer.classList.remove("blurred");

  startChat(true);

  const key = `${citySelect.value}-${lineSelect.value}-paid`;

  localStorage.setItem(key, true);

  logSession("paid");

});

// ============================
// Start Chat UI
// ============================

function startChat(isPaid){

  chatContainer.innerHTML = `

  <div id="chatHeader">
  🚇 ${citySelect.value} ${lineSelect.value} Line
  </div>

  <div id="messages"></div>

  <div id="newMsgIndicator">New messages ↓</div>

  ${isPaid ? `
  <div id="chatInputArea">
    <input id="chatInput" placeholder="Type message..." />
    <button id="sendBtn">Send</button>
  </div>
  ` : `
  <div id="chatInputArea">
    <p>Read only mode</p>
  </div>
  `}

  `;

  if (isPaid){

    const sendBtn = document.getElementById("sendBtn");
    const chatInput = document.getElementById("chatInput");

    sendBtn.addEventListener("click", sendMessage);

    chatInput.addEventListener("keypress", e => {

      if(e.key === "Enter") sendMessage();

    });

  }

  // start live message refresh
  if(messageInterval) clearInterval(messageInterval);

  loadMessages();
  messageInterval = setInterval(loadMessages, 2000);

}

// ============================
// Send Message
// ============================

function sendMessage(){

  const input = document.getElementById("chatInput");
  const messages = document.getElementById("messages");
  const indicator = document.getElementById("newMsgIndicator");

  if(!input.value.trim()) return;

  const text = input.value;

  const isNearBottom =
    messages.scrollHeight - messages.scrollTop - messages.clientHeight < 80;

  input.value = "";

  fetch("/api/messages",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      city:citySelect.value,
      line:lineSelect.value,
      text:text
    })
  });

  if(!isNearBottom){

    indicator.style.display = "block";

  }

}

// ============================
// Load Messages
// ============================

function loadMessages(){

  fetch(`/api/messages?city=${citySelect.value}&line=${lineSelect.value}`)
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("messages");

    if(!container) return;

    const indicator = document.getElementById("newMsgIndicator");

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 80;

    if(data.length === lastMessageCount) return;

    lastMessageCount = data.length;

    container.innerHTML = "";

    data.forEach(m => {

      const msg = document.createElement("div");

      msg.className = "messageBubble otherMessage";

      msg.innerText = m.text;

      container.appendChild(msg);

    });

    if(isNearBottom){

      container.scrollTop = container.scrollHeight;

    } else {

      indicator.style.display = "block";

    }

  });

}

// ============================
// New Message Indicator Click
// ============================

document.addEventListener("click", function(e){

  if(e.target.id === "newMsgIndicator"){

    const messages = document.getElementById("messages");

    messages.scrollTop = messages.scrollHeight;

    e.target.style.display = "none";

  }

});

// ============================
// Free Timer
// ============================

function startFreeTimer(){

  let timer = freeTime;

  const interval = setInterval(()=>{

    timer--;

    if(timer <= 0){

      clearInterval(interval);

      showOverlay();

    }

  },1000);

}

// ============================
// Share Button
// ============================

shareBtn.addEventListener("click",()=>{

  const url = window.location.href;

  if(navigator.share){

    navigator.share({
      title:"Metromedia",
      url:url
    });

  }else{

    navigator.clipboard.writeText(url);

    alert("Metromedia link copied!");

  }

});

// ============================
// Session Logging
// ============================

function logSession(type){

  fetch("/api/logSession",{

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({

      city:citySelect.value,
      line:lineSelect.value,
      type:type,
      timestamp:new Date().toISOString()

    })

  });

}