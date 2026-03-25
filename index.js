const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Esto mantiene a Render feliz y el puerto abierto
app.get('/', (req, res) => res.send('Bot Activo 24/7'));
app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));

const genAI = new GoogleGenerativeAI('AIzaSyAqrkjECIe0L1CdxOFUbxCYE2XGRiV6NhE');
const modeloIA = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process'],
        executablePath: '/usr/bin/google-chrome'
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('ESCANEA ESTE QR (APURADO):');
});

client.on('ready', () => console.log('¡ÉXITO! BOT CONECTADO.'));

client.on('message', async (msg) => {
    if (msg.from.includes('@g.us')) return;
    try {
        const result = await modeloIA.generateContent(msg.body);
        msg.reply(result.response.text());
    } catch (e) { console.log('Error:', e); }
});

client.initialize();
