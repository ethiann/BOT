const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('El bot está vivo'));
app.listen(process.env.PORT || 3000, () => console.log('Servidor en línea'));

// PEGA TU LLAVE AQUÍ ADENTRO DE LAS COMILLAS:
const genAI = new GoogleGenerativeAI('AIzaSyAqrkjECIe0L1CdxOFUbxCYE2XGRiV6NhE');
const modeloIA = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('ESCANEA ESTE QR:');
});

client.on('ready', () => {
    console.log('¡ÉXITO! Bot conectado a WhatsApp.');
});

client.on('message', async (msg) => {
    if (msg.from.includes('@g.us')) return; // Ignora grupos para no gastar la API
    
    try {
        const prompt = `Eres un asistente legal experto en leyes de México para la Asociación de Trabajadores. Responde de forma clara y profesional a esto: ${msg.body}`;
        const result = await modeloIA.generateContent(prompt);
        const response = await result.response;
        msg.reply(response.text());
    } catch (error) {
        console.log('ERROR DE GEMINI:', error);
        msg.reply('Lo siento, estoy teniendo un problema técnico. Inténtalo de nuevo en un momento.');
    }
});

client.initialize();
