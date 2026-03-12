
const demoMessages=[

"Anyone getting down at Karol Bagh?",
"Blue line delayed today",
"Too crowded near the door",
"Rajiv Chowk insane rush",
"Next train maybe empty",
"Someone dropped a bottle here",
"Train empty after Mandi House"

];

function randomMessage(){

const chat=document.getElementById("chatBox");

if(!chat) return;

const msg=document.createElement("p");

msg.textContent=
"Seat "+Math.floor(Math.random()*60)+": "+
demoMessages[Math.floor(Math.random()*demoMessages.length)];

chat.appendChild(msg);

chat.scrollTop=chat.scrollHeight;

}

setInterval(randomMessage,7000);