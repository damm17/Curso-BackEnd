import mongoose from 'mongoose';

const productosCollection = 'productos';

const ProductoSchema  = new mongoose.Schema({
    title: {type: String, required: true, max: 100},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true, max: 250}
})

export const Producto = mongoose.model(productosCollection, ProductoSchema);