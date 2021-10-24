import mongoose from 'mongoose';

const mensajesCollection = 'mensajes';

const MensajeSchema  = new mongoose.Schema({
    email: {type: String, required: true, max: 100},
    date: {type: String, required: true, max: 100},
    text: {type: String, required: true, max: 250}
})

export const Mensaje = mongoose.model(mensajesCollection, MensajeSchema);