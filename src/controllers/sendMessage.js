const axios = require('axios');
const { accessToken, phoneNumberId } = require('../config/envConfig');

const sendMessage = async (recipient, messageType, messageData) => {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

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
        if (messageData.mediaType) {
            // ✅ Sending a media template message (Image, Video, Document)
            payload = {
                messaging_product: "whatsapp",
                to: recipient,
                type: "template",
                template: {
                    name: messageData.templateName,
                    language: { code: messageData.languageCode },
                    components: [
                        {
                            type: "header",
                            parameters: [
                                {
                                    type: messageData.mediaType, // "image", "video", "document"
                                    link: messageData.mediaUrl  // Direct URL of media file
                                }
                            ]
                        },
                        {
                            type: "body",
                            parameters: [
                                { type: "text", text: messageData.bodyText } // Dynamic body text
                            ]
                        }
                    ]
                }
            };
        } else {
            // ✅ Sending a standard template message (no media)
            payload = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: recipient,
                type: "template",
                template: {
                    name: messageData.templateName,
                    language: { code: messageData.languageCode },
                }
            };

            // ✅ Only add components if parameters exist
            if (messageData.parameters && messageData.parameters.length > 0) {
                payload.template.components = [
                    {
                        type: "body",
                        parameters: messageData.parameters.map(param => ({
                            type: "text",
                            text: param
                        }))
                    }
                ];
            }
        }
    } else {
        console.log("❌ Invalid message type!");
        return;
    }

    try {
        console.log("📩 Sending payload:", JSON.stringify(payload, null, 2)); // Debugging log
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