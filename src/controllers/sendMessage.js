const axios = require('axios');
const { accessToken, phoneNumberId } = require('../config/envConfig');

const sendMessage = async (recipient, messageType, messageData) => {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

    if (!recipient) {
        console.error("❌ Error: Recipient phone number is required!");
        return;
    }

    if (messageType === "template" && (!messageData.templateName || !messageData.languageCode)) {
        console.error("❌ Error: Template name and language code are required for template messages!");
        return;
    }

    let payload;

    if (messageType === "text") {
        // ✅ Sending a session text message
        payload = {
            messaging_product: "whatsapp",
            to: recipient,
            type: "text",
            text: { body: messageData }
        };
    } else if (messageType === "template") {
        payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipient,
            type: "template",
            template: {
                name: messageData.templateName.toLowerCase(),
                language: { code: messageData.languageCode },
                components: []
            }
        };

        // ✅ Add Header (Image)
        if (messageData.mediaType === "image" && messageData.mediaUrl) {
            payload.template.components.push({
                type: "header",
                parameters: [
                    {
                        type: "image",
                        image: { link: messageData.mediaUrl }
                    }
                ]
            });
        }

        // ✅ Add Body (Text Parameters)
        if (Array.isArray(messageData.parameters) && messageData.parameters.length > 0) {
            payload.template.components.push({
                type: "body",
                parameters: messageData.parameters.map(param => ({
                    type: "text",
                    text: param
                }))
            });
        }
    } else {
        console.error("❌ Error: Invalid message type! Must be 'text' or 'template'.");
        return;
    }

    try {
        console.log("📩 Sending payload:", JSON.stringify(payload, null, 2));
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        console.log("✅ Message sent successfully:", response.data);
    } catch (error) {
        console.error("❌ Error sending message:", error.response ? error.response.data : error.message);
    }
};

module.exports = sendMessage;