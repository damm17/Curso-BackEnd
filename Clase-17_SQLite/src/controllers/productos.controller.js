import knex from 'knex';
import { config } from '../environment/config.js'
const myKnex = knex(config.mysqlOptions);

(async ()=>{
    try {
        if (!await myKnex.schema.hasTable('productos')) {
            await myKnex.schema.createTable('productos', table => {
                table.increments('id'),
                table.string('title'),
                table.float('price'),
                table.string('thumbnail')
            });
            console.log('Tabla de productos creada...');

            const testProduct = [
                { title: "Producto Prueba", price: 17.33, thumbnail: "http://www.imagen.com/imagen.jpg" }
            ]
            await myKnex('productos').insert(testProduct);
        }
    } catch (error) {
        console.log(error)
    }
})();

export const getProductos = (req, res) => {
    (async ()=>{
        try {
            let products = await myKnex.from('productos').select('*');
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
            let products = await myKnex.from('productos').select('*');
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
            let product = await myKnex.from('productos').where('id', body.id);
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
                await myKnex('productos').insert(body);
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
            let product = await myKnex.from('productos').where('id', params.id);
        
            if (product && (title !== '' || price !== '' || price > 0 || thumbnail !== '')) {
                await myKnex.from('productos').where('id', params.id).update({ title, price, thumbnail});
                product = await myKnex.from('productos').where('id', params.id);
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
            let product = await myKnex.from('productos').where('id', params.id);
        
            if (product.length > 0) {
                await myKnex.from('productos').where('id', params.id).del();
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