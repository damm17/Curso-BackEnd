import fs from 'fs';
import { Carrito } from "../models/Carrito.js";
import { __dirname } from "../environment/config.js";

let carrito = JSON.parse(fs.readFileSync(`${__dirname}/../logs/carrito.json`, 'utf8'));
!carrito.id ? carrito = new Carrito() : null;

export const getCarrito = (_, res) => {
    try {
        return res.status(200).json(carrito);
    } catch (error) {
        console.log(error)
    }
};

export const getProductsFromCarrito = (_, res) => {
    try {
        return res.status(200).json(carrito.productos);
    } catch (error) {
        console.log(error)
    }
};

export const agregarProducto = (req, res) => {
    try {
        const { body } = req;

        const { productos } = JSON.parse(fs.readFileSync(`${__dirname}/../logs/productos.json`, 'utf8'));
        const producto = productos.find((p) => p.id == body.id);

        if (!producto) {
            return res.status(404).json({ msg: "El producto que quiere agregar al carrito no existe." });
        } else {
            carrito.productos.push(body);
            fs.writeFileSync(`${__dirname}/../logs/carrito.json`, JSON.stringify(carrito, null, "\t"), 'utf-8');

            return res.status(201).json(body);
        }
    } catch (error) {
        console.log(error)
    }
};

export const borrarProducto = (req, res) => {
    try {
        const { id } = req.params;

        const index = carrito.productos.findIndex((p) => p.id == id);
        if (index === -1) {
            return res.status(404).json({ msg: "El producto que quiere eliminar del carrito no existe." });
        } else {
            const deleted = carrito.productos.splice(index, 1);
            fs.writeFileSync(`${__dirname}/../logs/carrito.json`, JSON.stringify(carrito, null, "\t"), 'utf-8');
            
            return res.status(200).json(deleted);
        }

    } catch (error) {
        console.log(error)
    }
};
