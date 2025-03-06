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

    if (incomingData.entry) {
        incomingData.entry.forEach(entry => {
            entry.changes.forEach(change => {
                if (change.value.messages) {
                    change.value.messages.forEach(message => {
                        console.log("📩 Received Message:", JSON.stringify(message, null, 2));
                        saveMessageToFile(message); // Save to text file
                    });
                }
            });
        });
    }

    res.sendStatus(200);
};