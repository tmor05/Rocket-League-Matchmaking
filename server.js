const express = require('express');  // Import Express.js framework
const http = require('http');  // Node.js HTTP module
const WebSocket = require('ws');  // Import WebSocket module

const app = express();  // Create an Express app
const server = http.createServer(app);  // Create an HTTP server
const wss = new WebSocket.Server({ server });  // Create WebSocket server

const players = new Set(); // Store active players
const matchmakingQueue = []; // Store players looking for a match

// Debug message before starting the server
console.log("🛠 Debug: Starting Express and WebSocket server...");

// Simple API route to check if the server is running
app.get('/', (req, res) => {
    res.send("Rocket League Integration Server Running...");
});

// WebSocket event: When a player connects
wss.on('connection', (ws) => {
    console.log('✅ Player connected');
    players.add(ws); // Add player to the list

    // Event: When a message is received from a client
    ws.on('message', (message) => {
        const decodedMessage = message.toString();  // Convert Buffer to readable text
        console.log('📩 Received:', decodedMessage);

        if (decodedMessage.startsWith("MATCHME")) {
            handleMatchmaking(ws);
        }
    });

    // Event: When a player disconnects
    ws.on('close', () => {
        console.log('❌ Player disconnected');
        players.delete(ws); // Remove player from the list
        removeFromMatchmakingQueue(ws);
    });
});

// Function to handle matchmaking
function handleMatchmaking(player) {
    console.log("🔎 Matchmaking request received!");

    matchmakingQueue.push(player);

    // Check if there are at least two players in the queue
    if (matchmakingQueue.length >= 2) {
        const player1 = matchmakingQueue.shift();
        const player2 = matchmakingQueue.shift();

        console.log(`🎮 Match Found: Player 1 vs Player 2`);

        // Send match notification to both players
        player1.send("✅ Match Found! Get Ready!");
        player2.send("✅ Match Found! Get Ready!");
    }
}

// Remove disconnected players from matchmaking queue
function removeFromMatchmakingQueue(player) {
    const index = matchmakingQueue.indexOf(player);
    if (index !== -1) {
        matchmakingQueue.splice(index, 1);
    }
}

// Start the server on port 8080 (or 3000 if 8080 is blocked)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 Server successfully started on http://localhost:${PORT}`);
});
