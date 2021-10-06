import fs from 'fs';
import { Producto } from "../models/Producto.js";
import { config, __dirname } from "../environment/config.js";

const { productos } = JSON.parse(fs.readFileSync(`${__dirname}/../logs/productos.json`, 'utf8'));

export const getProductos = (req, res) => {
    try {
        const { id } = req.query;
        return id ? (
            res.status(200).json(productos.find((p) => p.id == id))
        ) : (
            res.status(200).json(productos)
        )
    } catch (error) {
        console.log(error)
    }
};

export const agregarProducto = (req, res, next) => {
	try {
        if (!config.isAdmin) {
            next({ route: `${config.hostname}productos`, method: "POST" });
        } else {
            const { name, description, code, image, price, stock } = req.body;
    
            const newProduct = new Producto(
                name,
                description,
                code,
                image,
                price,
                stock
            );
    
            productos.push(newProduct);
            const data = { productos };
            fs.writeFileSync(`${__dirname}/../logs/productos.json`, JSON.stringify(data, null, "\t"), 'utf-8');
            return res.status(201).json(newProduct);
        }
	} catch (err) {
		console.log(err);
	}
};

export const actualizarProducto = (req, res, next) => {
    try {
        if (!config.isAdmin) {
            next({ route: `${config.hostname}productos`, method: "PUT" });
        } else {
            const { id } = req.params;
            const { name, description, code, image, price, stock } = req.body;

            const producto = productos.find((p) => p.id == id);
            if (!producto) {
                return res.status(404).json({ msg: "Producto no encontrado" });
            } else {
                (producto.name = name || producto.name),
                (producto.description = description || producto.description),
                (producto.code = code || producto.code),
                (producto.image = image || producto.image),
                (producto.price = price || producto.price),
                (producto.stock = stock || producto.stock);

                const data = { productos };
                fs.writeFileSync(`${__dirname}/../logs/productos.json`, JSON.stringify(data, null, "\t"), 'utf-8');

                res.status(200).json(producto);
            }
        }
    } catch (error) {
        console.log(error)
    }
	
};

export const borrarProducto = (req, res, next) => {
    try {
        if (!config.isAdmin) {
            next({ route: `${config.hostname}productos`, method: "DELETE" });
        } else {
            const { id } = req.params;
            const producto = productos.find((p) => p.id == id);

            if (!producto) {
                return res.status(404).json({ msg: "Producto no encontrado" });
            } else {
                const index = productos.findIndex((p) => p.id == id);
                productos.splice(index, 1);

                const data = { productos };
                fs.writeFileSync(`${__dirname}/../logs/productos.json`, JSON.stringify(data, null, "\t"), 'utf-8');
        
                res.status(200).json({msg: `El producto ${producto.id} fue eliminado.`});
            }
        }
    } catch (error) {
        console.log(error)
    }
};
