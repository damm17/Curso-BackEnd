/*
Consigna: Realizar un proyecto de servidor basado en node.js que permita listar e incorporar ítems dentro de un array de productos en memoria.

Cada producto estará representado por un objeto con el siguiente formato
{
    title: (nombre del producto),
    price: (precio),
    thumbnail: (url al logo o foto del producto)
}

Aspectos a incluir en el entregable:

Implementar las rutas get y post en conjunto con las funciones necesarias (utilizar clases y un módulo propio).

Cada ítem almacenado dispondrá de un id proporcionado por el backend, que se irá incrementando a medida de que se incorporen productos. 
Ese id será utilizado para identificar un producto que ve a ser listado en forma individual.

Las rutas propuestas serían las siguientes:
A. Listar en forma total (get) : '/api/productos/listar' -> devuelve array de productos
B. Listar en forma individual (get) (por id): '/api/productos/listar/:id' -> devuelve producto listado
C. Almacenar un producto (post) : '/api/productos/guardar/' -> devuelve producto incorporado

Para el caso de que se liste en forma individual un producto que no exista, se devolverá el objeto: {error : 'producto no encontrado'}
En caso de no haber productos en el listado total, se retornará el objeto: {error : 'no hay productos cargados'}
Las respuestas del servidor serán en formato JSON. La funcionalidad será probada a través de Postman.

Aclaración: 
El servidor debe estar basado en express y debe implementar los mensajes de conexión al puerto 8080 y en caso de error, representar la descripción del mismo.

*/ 

import express from 'express';

const app = express();
const PORT = 8080;

const server = app.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto', server.address().port);
});
server.on('error', error=>console.log('Error en servidor', error));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

let products = [];

app.get('/api/productos/listar', (req,res)=>{
    if (products.length > 0) {
        res.status(200)
        res.json({products})
    } else {
        res.status(404)
        res.json({error: 'No hay productos cargados'});
    }
});

app.get('/api/productos/listar/:id', (req,res)=>{
    let params = req.params;
    let product = products.find( p => p.id == params.id );
    if (!product) {
        res.status(404)
        res.json({error: 'Producto no encontrado'});
    } else {
        res.json(product);
    }
});

app.post('/api/productos/guardar', (req,res)=>{
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
        res.json(body);
    }
});