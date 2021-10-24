import { Producto } from '../models/Productos.js';

export const getProductos = (req, res) => {
    (async ()=>{
        try {
            let products = await Producto.find({}).lean()
            if (products.length > 0) {
                req.session.productsAvailable = true;
            }
            res.render("products", {
                products,
                productsAvailable: req.session.productsAvailable
            })
        } catch (error) {
            console.log(error)
        }
    })();
}

export const getProducto = (req, res) => {
    (async ()=>{
        try {
            let products = await Producto.find({}).lean()
            if (products.length > 0) {
                req.session.productsAvailable = true;
            }
            const product = req.session.product;
            res.render("products", {
                product,
                productsAvailable: req.session.productsAvailable
            })
        } catch (error) {
            console.log(error)
        }
    })();
}

export const buscarProducto = (req, res) => {
    (async ()=>{
        try {
            let body = req.body;
            let product = await Producto.find({_id: body.id}).lean();
            req.session.product = product;
            res.redirect(`/api/productos/listar/${body.id}`);
        } catch (error) {
            console.log(error)
        }
    })();
}

export const agregarProducto = (req, res) => {
    (async ()=>{
        try {
            let body = req.body;
            let error = {
                msg: ''
            }
            if (body.title == '' || body.price == '' || body.price <= 0 || body.thumbnail == '') {
                error.msg = 'No se puede guardar el producto. Revise los datos proporcionados.';
                res.status(400)
                res.json({
                    error
                })
            } else {
                await Producto.create(body);
                req.session.savedProduct = true;
                res.redirect('/');
            }
        } catch (error) {
            console.log(error)
        }
    })();
}

export const actualizarProducto = (req, res) => {
    (async ()=>{
        try {
            let {
                title,
                price,
                thumbnail
            } = req.body;
            let params = req.params;
            let product = await Producto.find({_id: params.id}).lean();
        
            if (product && (title !== '' || price !== '' || price > 0 || thumbnail !== '')) {
                await Producto.updateOne({_id: params.id}, {$set: {title, price, thumbnail}});
                product = await Producto.find({_id: params.id}).lean();
                res.json(product);
            } else {
                res.status(404)
                res.json({
                    error: 'Producto no encontrado'
                });
            }
        } catch (error) {
            console.log(error)
        }
    })();
}

export const borrarProducto = (req, res) => {
    (async ()=>{
        try {
            let params = req.params;
            let product = await Producto.find({_id: params.id}).lean();
        
            if (product.length > 0) {
                await Producto.deleteOne({_id: params.id});
                res.json(product);
            } else {
                res.status(404)
                res.json({
                    error: 'Producto no encontrado'
                });
            }
        } catch (error) {
            console.log(error)
        }
    })();
}