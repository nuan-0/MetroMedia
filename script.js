// =====================
// MetroPulse Step Logic
// =====================

let selectedLine = "";  // store selected metro line
let sessionTimer;       // chat session timer

// Step 1: Select Metro Line and go to Step 2
function selectLine() {
    const lineDropdown = document.getElementById("line");
    selectedLine = lineDropdown.value;
    console.log("Selected Line:", selectedLine);

    // Hide Step 1
    document.getElementById("lineCard").classList.add("hidden");
    // Show Step 2
    document.getElementById("crowdCard").classList.remove("hidden");
}

// Step 2: Report Crowd / Query → go to Step 3
function report(level) {
    console.log(selectedLine + " - Crowd Status:", level);

    // Hide Step 2
    document.getElementById("crowdCard").classList.add("hidden");
    // Show Step 3
    document.getElementById("unlockBox").classList.remove("hidden");
}

// Step 3: Watch Ad to unlock chat preview
function watchAd() {
    alert("Ad plays here to unlock chat preview");

    // Show chat area
    document.getElementById("chatArea").classList.remove("hidden");

    // Start 10-minute session timer
    startTimer();
}

// Chat session timer (10 minutes)
function startTimer() {
    let time = 600; // 10 minutes
    const timerEl = document.getElementById("timer");

    clearInterval(sessionTimer); // clear previous if any

    sessionTimer = setInterval(() => {
        time--;
        let m = Math.floor(time / 60);
        let s = time % 60;
        if (s < 10) s = "0" + s;

        timerEl.innerText = "Chat unlocked for " + m + ":" + s;

        if (time <= 0) {
            clearInterval(sessionTimer);
            alert("Session ended. Watch another ad or pay ₹10.");
        }
    }, 1000);
}

// Step 3: Payment placeholder
function payChat() {
    /*
    RAZORPAY PAYMENT (Enable after API keys)
    var options = {
        key: "YOUR_KEY",
        amount: "1000",
        currency: "INR",
        name: "MetroPulse",
        description: "Unlock Chat",
        handler: function(response){
            alert("Chat unlocked successfully!");
        }
    };
    var rzp = new Razorpay(options);
    rzp.open();
    */
    alert("Payment system coming soon");
}