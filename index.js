// DARK-TEAM-46 MD BOT main file
const { WAConnection, MessageType } = require('@adiwajshing/baileys');
const fs = require('fs');

const adminNumber = '+93721449629';
const groupLink = 'https://chat.whatsapp.com/GfNJRCO9dJ0IkKjGRjekwz';
let autoreactEnabled = false;
let autoreactEmoji = '❤️';

async function startBot() {
    const conn = new WAConnection();
    conn.on('qr', qr => {
        console.log('Scan this QR to connect your WhatsApp:', qr);
    });
    conn.on('open', () => {
        console.log('Connected to WhatsApp!');
    });
    await conn.connect();

    conn.on('chat-update', async chatUpdate => {
        if (!chatUpdate.hasNewMessage) return;
        const message = chatUpdate.messages.all()[0];
        if (!message.message) return;

        const sender = message.key.remoteJid;
        const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
        const isAdmin = sender === adminNumber + '@s.whatsapp.net';

        // Auto react
        if (autoreactEnabled && sender !== conn.user.jid) {
            await conn.sendMessage(sender, autoreactEmoji, MessageType.sticker);
        }

        // Command processing (very minimal, expand later)
        if (text.startsWith('.autoreact')) {
            if (!isAdmin) return;
            if (text === '.autoreact off') {
                autoreactEnabled = false;
                await conn.sendMessage(sender, 'Auto-react OFF', MessageType.text);
            } else {
                const parts = text.split(' ');
                autoreactEnabled = true;
                autoreactEmoji = parts[1] || '❤️';
                await conn.sendMessage(sender, `Auto-react ON with emoji ${autoreactEmoji}`, MessageType.text);
            }
        }

        // TODO: Add more commands like .block, .unblock, .song, .logo, etc.
    });
}

startBot();