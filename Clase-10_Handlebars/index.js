/*
Sobre el proyecto entregable de la clase anterior, incorporar y configurar el motor de plantillas handlebars para que permita ver mediante la ruta get '/productos/vista' los productos cargados.

- Realizar las plantillas correspondientes que permitan recorrer el array de productos y representarlo en forma de tabla dinámica, siendo sus cabeceras el nombre de producto, el precio y su foto (la foto se mostrará como un imágen en la tabla)
- En el caso de no encontrarse datos, devolver el mensaje: 'No hay productos'
- Utilizar bootstrap para maquetar la vista creada por dicho motor de plantillas.
- Maquetar con bootstrap el formulario de ingreso de productos. Al guardar el producto, se debe redirigir la vista al formulario vacío.

*/ 
const express = require('express');
const handlebars = require('express-handlebars');
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

// Config de handlebars
app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views/layouts/",
        partialsDir: __dirname + "/views/partials/"
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static('public'));

const server = app.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto', server.address().port);
});
server.on('error', error=>console.log('Error en servidor', error));

let products = [];

app.get("/", (req, res) => {
    try {
        const savedProduct = req.session.savedProduct;
        res.render("main", { savedProduct })
        req.session.savedProduct = false;
    } catch (error) {
        console.log(error)
    }
})

router.get('/productos/vista', (req,res)=>{
    try {
        if (products.length > 0) {
            req.session.productsAvailable = true;
        }
        res.render("products", { products, productsAvailable: req.session.productsAvailable })
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
        res.render("products", { product, productsAvailable: req.session.productsAvailable })
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