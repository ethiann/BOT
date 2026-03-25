const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('El bot está vivo'));
app.listen(process.env.PORT || 3000, () => console.log('Servidor en línea'));

// AQUÍ ES LA CIRUGÍA:
const genAI = new GoogleGenerativeAI('TU_API_KEY_AQUI_PEGALA'); 
const modeloIA = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('ESCANEA ESTE QR CON EL CELULAR DE LA ASOCIACIÓN');
});

client.on('ready', () => {
    console.log('¡ÉXITO! Bot conectado a WhatsApp.');
});

client.on('message', async message => {
    try {
        const instruccion = "Eres el asistente legal de una asociación de trabajadores en México. Responde de forma amable, corta y precisa a lo siguiente: " + message.body;
        const resultado = await modeloIA.generateContent(instruccion);
        const respuestaBot = resultado.response.text();
        message.reply(respuestaBot);
    } catch (error) {
        console.log('Hubo un error pensando la respuesta:', error);
    }
});

client.initialize();
