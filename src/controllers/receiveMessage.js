const fs = require('fs');
const path = require('path');
//const { verifyToken } = require('../config/envConfig');
const verifyToken = "verify_token";

// Webhook verification (for initial setup)
exports.verifyWebhook = (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === verifyToken) {
        res.status(200).send(challenge);
        console.log("✅ Webhook Verified Successfully!");
    } else {
        res.sendStatus(403);
    }
};

// Function to save messages to a text file
const saveMessageToFile = (message) => {
    const filePath = path.join(__dirname, '../messages.txt');

    fs.appendFile(filePath, JSON.stringify(message, null, 2) + '\n\n', (err) => {
        if (err) {
            console.error("❌ Error saving message:", err);
        } else {
            console.log("✅ Message saved successfully!");
        }
    });
};

// Handling incoming messages
exports.receiveMessage = (req, res) => {
    const incomingData = req.body;

    console.log("📩 Complete Webhook Data:", JSON.stringify(incomingData, null, 2)); // Log everything

    // Save full response to a file for debugging
    fs.writeFileSync('webhook_log.json', JSON.stringify(incomingData, null, 2), 'utf8');

    res.sendStatus(200); // Send response immediately
};