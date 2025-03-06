const express = require('express');
const { sendWhatsAppTemplate } = require('../controllers/sendMessage');
const { verifyWebhook, receiveMessage } = require('../controllers/receiveMessage');

const router = express.Router();

router.post('/send', sendWhatsAppTemplate);
router.get('/webhook', verifyWebhook);
router.post('/webhook', receiveMessage);

module.exports = router;