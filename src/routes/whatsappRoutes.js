const express = require("express");
const router = express.Router();
const sendMessage = require("../controllers/sendMessage");
const { receiveMessage, verifyWebhook } = require("../controllers/receiveMessage");

// ✅ Webhook verification route (for Meta WhatsApp API)
router.get("/webhook", verifyWebhook);

// ✅ Route to receive incoming messages
router.post("/webhook", receiveMessage);

// ✅ Route to send messages
router.post("/send", async (req, res) => {
    const { recipient, messageType, messageData } = req.body;

    if (!recipient || !messageType || !messageData) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        await sendMessage(recipient, messageType, messageData);
        res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to send message" });
    }
});

module.exports = router;