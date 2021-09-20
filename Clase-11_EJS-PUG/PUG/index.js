/* IMPLEMENTANDO PUG */

const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 8080;
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'mySecret', 
    resave: false, 
    saveUninitialized: false
}))

app.use('/api', router);

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

const server = app.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto', server.address().port);
});
server.on('error', error=>console.log('Error en servidor', error));

let products = [];

app.get("/", (req, res) => {
    try {
        let savedProduct = req.session.savedProduct;
        console.log(req.session.savedProduct)
        res.render("index.pug", { savedProduct })
        req.session.savedProduct = false;
        console.log(req.session.savedProduct)
    } catch (error) {
        console.log(error)
    }
})

router.get('/productos/vista', (req,res)=>{
    try {
        if (products.length > 0) {
            req.session.productsAvailable = true;
        }
        res.render("products.pug", { products, productsAvailable: req.session.productsAvailable })
    } catch (error) {
        console.log(error)
    }
});

router.post('/productos/listar/id', (req,res) => {
    try {
        let body = req.body;
        let product = products.find( p => p.id == body.id );
        req.session.product = product;
        res.redirect(`/api/productos/listar/${body.id}`);
    } catch (error) {
        console.log(error)
    }
})

router.get('/productos/listar/:id', (req,res)=>{
    try {
        if (products.length > 0) {
            req.session.productsAvailable = true;
        }
        const product = req.session.product;
        res.render("products.pug", { product, productsAvailable: req.session.productsAvailable })
    } catch (error) {
        console.log(error)
    }
});

router.post('/productos/guardar', (req,res) => {
    try {
        let body = req.body;
        let error = {
            msg: ''
        }
        if ( body.title == '' || body.price == '' || body.price <= 0 || body.thumbnail == '' ) {
            error.msg = 'No se puede guardar el producto. Revise los datos proporcionados.';
            res.status(400)
            res.json({error})
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

router.put('/productos/actualizar/:id', (req, res) => {
    let { title, price, thumbnail } = req.body;
    let params = req.params;
    let product = products.find( p => p.id == params.id );

    if (product && (title !== '' || price !== '' || price > 0 || thumbnail !== '')) {
        product.title = title;
        product.price = price;
        product.thumbnail = thumbnail;
        res.json(product);
    } else {
        res.status(404)
        res.json({error: 'Producto no encontrado'});
    }
})

router.delete('/productos/borrar/:id', (req, res) => {
    let params = req.params;
    let product = products.find( p => p.id == params.id );
    if ( product ) {
        products = products.filter(x => {
            return x.id != params.id;
        })
        res.json(product);
    } else {
        res.status(404)
        res.json({error: 'Producto no encontrado'});
    }
    
})