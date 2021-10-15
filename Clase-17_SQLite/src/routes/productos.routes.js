import {
    Router
} from "express";

const productosRouter = Router();

// productosRouter
//     .get("/", getProductos)
//     .post("/", agregarProducto)
//     .put("/:id", actualizarProducto)
//     .delete("/:id", borrarProducto);

productosRouter.get('/productos/vista', (req, res) => {
    try {
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
});

productosRouter.post('/productos/listar/id', (req, res) => {
    try {
        let body = req.body;
        let product = products.find(p => p.id == body.id);
        req.session.product = product;
        res.redirect(`/api/productos/listar/${body.id}`);
    } catch (error) {
        console.log(error)
    }
})

productosRouter.get('/productos/listar/:id', (req, res) => {
    try {
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
});

productosRouter.post('/productos/guardar', (req, res) => {
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
            body.id = products.length + 1;
            products.push(body);
            req.session.savedProduct = true;
            res.redirect('/');
        }
    } catch (error) {
        console.log(error)
    }
});

productosRouter.put('/productos/actualizar/:id', (req, res) => {
    let {
        title,
        price,
        thumbnail
    } = req.body;
    let params = req.params;
    let product = products.find(p => p.id == params.id);

    if (product && (title !== '' || price !== '' || price > 0 || thumbnail !== '')) {
        product.title = title;
        product.price = price;
        product.thumbnail = thumbnail;
        res.json(product);
    } else {
        res.status(404)
        res.json({
            error: 'Producto no encontrado'
        });
    }
})

productosRouter.delete('/productos/borrar/:id', (req, res) => {
    let params = req.params;
    let product = products.find(p => p.id == params.id);
    if (product) {
        products = products.filter(x => {
            return x.id != params.id;
        })
        res.json(product);
    } else {
        res.status(404)
        res.json({
            error: 'Producto no encontrado'
        });
    }
})

export default productosRouter;