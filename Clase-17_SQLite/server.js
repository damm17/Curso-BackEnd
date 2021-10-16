/**/ 
import app from './src/app.js';
import fs from 'fs';
import { createServer } from "http";
import { config } from "./src/environment/config.js";

import { Server } from "socket.io";
import options from './DB/options.js';
import knex from 'knex';
const httpServer = createServer(app);
const PORT = config.port;

const myKnex = knex(options);
const io = new Server(httpServer);

httpServer.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto', PORT);
});


// WEBSOCKETS
io.on('connection', (socket) => {
    (async ()=>{
        try {
            if (!await myKnex.schema.hasTable('mensajes')) {
                await myKnex.schema.createTable('mensajes', table => {
                    table.increments('id'),
                    table.string('email'),
                    table.string('date'),
                    table.string('text')
                });
                console.log('Tabla de mensajes creada...');

                const testMessage = [
                    { email: "test@test.com", date: "01/12/2021 - 18:26:17", text: "mensaje de prueba" }
                ]
                await myKnex('mensajes').insert(testMessage);
            } else {
                let mensajes = await myKnex.from('mensajes').select('*');
                socket.emit('chat', mensajes)
            }
        } catch (error) {
            console.log(error)
        }
    })();
    
    socket.on('chatMsg', (data) => {
        (async ()=>{
            try {
                await myKnex('mensajes').insert(data);
                let mensajes = await myKnex.from('mensajes').select('*');
                io.sockets.emit('chat', mensajes)
            } catch (error) {
                console.log(error)
            }
        })();
    });
});