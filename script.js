function report(level){

console.log("Crowd level:",level);

// show unlock box after crowd report
document.getElementById("unlockBox").classList.remove("hidden");

}



function watchAd(){

// placeholder for ad logic
alert("Ad plays here to unlock chat preview");

// reveal chat area
document.getElementById("chatArea").classList.remove("hidden");

// start session timer
startTimer();

}



function startTimer(){

let time = 600; // 10 minutes

let timer = setInterval(()=>{

time--;

let m = Math.floor(time/60);
let s = time % 60;

if(s < 10){
s = "0" + s;
}

document.getElementById("timer").innerText =
"Chat unlocked for " + m + ":" + s;

if(time <= 0){

clearInterval(timer);

alert("Session ended. Watch another ad or pay ₹10.");

}

},1000);

}



function payChat(){

/*

RAZORPAY PAYMENT (ENABLE AFTER API KEYS)

var options = {
key: "YOUR_KEY",
amount: "1000",
currency: "INR",
name: "MetroPulse",
description: "Unlock Chat",
handler: function (response) {

alert("Chat unlocked successfully!");

}
};

var rzp = new Razorpay(options);
rzp.open();

*/

// temporary placeholder