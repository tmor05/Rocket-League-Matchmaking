const WebSocket = require('ws'); // Import WebSocket module

const SERVER_URL = "ws://localhost:8080";
const NUM_PLAYERS = 10; // Number of simulated players

let players = [];

function connectPlayer(playerID) {
    let ws = new WebSocket(SERVER_URL);

    ws.on('open', () => {
        console.log(`✅ Player ${playerID} connected.`);
        ws.send("MATCHME"); // Request matchmaking
    });

    ws.on('message', (message) => {
        console.log(`📩 Player ${playerID} received: ${message}`);
    });

    ws.on('close', () => {
        console.log(`❌ Player ${playerID} disconnected.`);
    });

    players.push(ws);
}

// Simulate multiple players joining the server
for (let i = 1; i <= NUM_PLAYERS; i++) {
    setTimeout(() => connectPlayer(i), i * 500); // Stagger connections slightly
}
