/*
Consigna:  Sobre el proyecto entregable de la clase anterior, incorporar las siguientes rutas:

Actualizar un producto (put) : '/api/productos/actualizar/:id' -> devuelve producto actualizado
Borrar un producto (delete) : '/api/productos/borrar/:id' -> devuelve producto eliminado

Aspectos a incluir en el entregable:
Implementar las rutas put y delete junto a las funciones necesarias (utilizar la estructura ya creada).
Incorporar el Router de express en la url base '/api' y configurar todas las subrutas en base a este.
Crear un espacio público de servidor que contenga un documento index.html con un formulario de ingreso de productos con los datos apropiados.
Probar la funcionalidad con Postman y el formulario de ingreso de datos.

*/ 
import uniqid from 'uniqid';
import express from 'express';

const app = express();
const PORT = 8080;
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', router);

app.use(express.static('public'));

const server = app.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto', server.address().port);
});
server.on('error', error=>console.log('Error en servidor', error));

let products = [];

router.get('/productos/listar', (req,res)=>{
    if (products.length > 0) {
        res.status(200)
        res.json({products})
    } else {
        res.status(404)
        res.json({error: 'No hay productos cargados'});
    }
});

router.get('/productos/listar/:id', (req,res)=>{
    let params = req.params;
    let product = products.find( p => p.id == params.id );
    if (!product) {
        res.status(404)
        res.json({error: 'Producto no encontrado'});
    } else {
        res.json(product);
    }
});

router.post('/productos/guardar', (req,res) => {
    let body = req.body;
    let error = {
        msg: ''
    }
    if ( body.title == '' || body.price == '' || body.price <= 0 || body.thumbnail == '' ) {
        error.msg = 'No se puede guardar el producto. Revise los datos proporcionados.';
        res.status(400)
        res.json({error})
    } else {
        // body.id = uniqid(); -> para evitar ID's duplicados luego de borrar un producto (pero más paja para buscar, actualizar y borrar)
        body.id = products.length + 1;
        products.push(body);
        res.json(body);
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