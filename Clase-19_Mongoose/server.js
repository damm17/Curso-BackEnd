/**/ 
import app from './src/app.js';
import { config } from "./src/environment/config.js";
import { createServer } from "http";

import mongoose from 'mongoose';
import { Mensaje } from './src/models/Mensajes.js';
import { Server } from "socket.io";

const httpServer = createServer(app);
const PORT = config.port;

const io = new Server(httpServer);

httpServer.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto', PORT);
});

(async ()=>{
    try {
        await mongoose.connect(config.uri, config.mongoConfig);
    } catch (error) {
        console.log(error)
    }
})();

// WEBSOCKETS
io.on('connection', (socket) => {
    (async ()=>{
        try {
            // Creación de un mensaje para prueba;
            // const mensajeTest = {"email": "test@test.com", "date": "01/12/2021 - 18:26:17", "text": "mensaje de prueba"}
            // await Mensaje.create(mensajeTest);

            let mensajes = await Mensaje.find({})
            socket.emit('chat', mensajes)
        } catch (error) {
            console.log(error)
        }
    })();
    
    socket.on('chatMsg', (data) => {
        (async ()=>{
            try {
                await Mensaje.create(data);
                let mensajes = await Mensaje.find({})
                io.sockets.emit('chat', mensajes)
            } catch (error) {
                console.log(error)
            }
        })();
    });
});