/* =========================
   MetroPulse Demo JS
   Instructions:
   - Paste in your repo as demo.js
   - Handles crowd status, free/paid flow, timers
   - Ad/Payment logic commented for deployment
========================= */

const landing = document.getElementById("landing");
const accessSelection = document.getElementById("accessSelection");
const chatScreen = document.getElementById("chatScreen");
const chatBox = document.getElementById("chatBox");

// Crowd Status
let currentStatus = "empty";

function updateStatus(status){
    currentStatus = status;
    // Landing page status
    const statusDiv = document.getElementById("crowd-status");
    statusDiv.className = "status " + status;
    statusDiv.textContent = "Current status: " + status.charAt(0).toUpperCase() + status.slice(1);

    // Chat screen status
    const chatStatus = document.getElementById("crowd-status-chat");
    chatStatus.className = "status " + status;
    chatStatus.textContent = "Current status: " + status.charAt(0).toUpperCase() + status.slice(1);
}

// Crowd buttons
document.getElementById("btn-empty").onclick = () => updateStatus("empty");
document.getElementById("btn-normal").onclick = () => updateStatus("normal");
document.getElementById("btn-crowded").onclick = () => updateStatus("crowded");

// Watch ad on landing to move forward (simulate)
document.getElementById("watch-ad").onclick = () => {
    landing.style.display = "none";
    accessSelection.style.display = "block";
};

// ------------------
// Access Selection
// ------------------
const btnPay = document.getElementById("btn-pay");
const btnFree = document.getElementById("btn-free");

let freeTimer;
let isPaidUser = false;

function startChat(paid){
    isPaidUser = paid;
    accessSelection.style.display = "none";
    chatScreen.style.display = "block";

    // Initialize crowd status
    updateStatus(currentStatus);

    if(!paid){
        // Free users: 10 min timer
        let timeLeft = 10*60; // seconds
        freeTimer = setInterval(()=>{
            timeLeft--;
            if(timeLeft <= 0){
                clearInterval(freeTimer);
                alert("Your 10 min free access is over. Pay or watch an ad to continue.");
                chatScreen.style.display = "none";
                accessSelection.style.display = "block";
            }
        }, 1000);
    } else {
        // Paid user: set/reset localStorage for full day
        const now = new Date();
        const expiry = new Date();
        expiry.setHours(24,0,0,0); // midnight
        localStorage.setItem("paidAccessExpiry", expiry.getTime());
    }
}

// ------------------
// Button actions
// ------------------

// Paid button (simulate payment)
btnPay.onclick = () => {
    /* Deployment:
       Uncomment below and integrate Razorpay API
    */
    // openRazorpayPayment().then(()=> startChat(true));
    startChat(true); // Demo only
};

// Free button (simulate ad watch)
btnFree.onclick = () => {
    /* Deployment:
       Replace with AdMob reward ad logic
    */
    // showRewardedAd().then(()=> startChat(false));
    startChat(false); // Demo only
};

// ------------------
// Optional: Restore paid session if user reloads page
// ------------------
window.onload = () => {
    const expiry = localStorage.getItem("paidAccessExpiry");
    if(expiry && new Date().getTime() < expiry){
        startChat(true);
    }
};