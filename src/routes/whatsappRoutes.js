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

// Route to fetch messages.txt content
router.get('/messages', (req, res) => {
    const filePath = path.join(__dirname, '../../messages.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("❌ Error reading messages file:", err);
            return res.status(500).send("Error reading messages.");
        }
        res.type('text/plain').send(data);
    });
});

router.post("/send-template", async (req, res) => {
    try {
        const { recipient, templateName, languageCode, parameters } = req.body;

        const messageData = {
            templateName: templateName,
            languageCode: languageCode,
            parameters: parameters || [] // Optional dynamic parameters
        };

        await sendMessage(recipient, "template", messageData);
        res.status(200).json({ success: true, message: "Template message sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;