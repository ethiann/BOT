const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('El bot está vivo'));
app.listen(process.env.PORT || 3000, () => console.log('Servidor en línea'));

const genAI = new GoogleGenerativeAI('AIzaSyAqrkjECIe0L1CdxOFUbxCYE2XGRiV6NhE');
const modeloIA = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const client = new Client({
    authStrategy: new LocalAuth(),
    authTimeoutMs: 120000, // Espera 2 minutos para conectar (clave para Render)
    puppeteer: { 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: '/usr/bin/google-chrome'
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('ESCANEA ESTE QR:');
});

client.on('ready', () => {
    console.log('¡ÉXITO! Bot conectado a WhatsApp.');
});

client.on('message', async (msg) => {
    if (msg.from.includes('@g.us')) return;
    try {
        const result = await modeloIA.generateContent(msg.body);
        const response = await result.response;
        msg.reply(response.text());
    } catch (error) {
        console.log('Error Gemini:', error);
    }
});

client.initialize();
