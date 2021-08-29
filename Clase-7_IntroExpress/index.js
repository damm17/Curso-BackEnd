/* 
Ruta get '/items' que responda un objeto con todos los productos y su cantidad total en el siguiente formato: { items: [productos], cantidad: (cantidad productos) }

Ruta get '/item-random' que devuelva un producto elegido al azar desde un array de productos que se encuentran en el archivo 'productos.txt'. El formato de respuesta será: { item: {producto} }

La ruta get '/visitas' devuelve un objeto que indica cuantas veces se visitó la ruta del punto 1 y cuantas la ruta del punto 2. Contestar con el formato:  { visitas : { items: cantidad, item: cantidad } }
*/

const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8080;
let visitasItems = 0;
let visitasRandomItem = 0;

const getProducts = async () => JSON.parse(await fs.promises.readFile(`./products.txt`, 'utf-8'))

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const server = app.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto', server.address().port);
});
server.on('error', error=>console.log('Error en servidor', error));

app.get('/', (req,res)=>{
    res.send(`
        <header style="display:flex;flex-direction:column;align-items:center;font-family:Arial, sans-serif;">
            <h1>Servidor con Express</h1>
            <nav>
                <a style="border:1px solid #ccc;text-decoration: none; color: #404040; padding: 5px 15px; display: inline-block;" href="/items">Items</a>
                <a style="border:1px solid #ccc;text-decoration: none; color: #404040; padding: 5px 15px; display: inline-block;margin: 0 10px;" href="/item-random">Random Item</a>
                <a style="border:1px solid #ccc;text-decoration: none; color: #404040; padding: 5px 15px; display: inline-block;" href="/visitas">Visitas</a>
            </nav>
        </header>
    `);
});

app.get('/items', async (req,res)=>{
    visitasItems++;
    const products = await getProducts();
    const items = {
        items: products,
        cantidad: products.length
    }
    res.send(items);
});

app.get('/item-random', async (req,res)=>{
    visitasRandomItem++;
    const products = await getProducts();
    const randomProduct = products[getRandomInt(0, products.length)]
    const item = {
        item: randomProduct
    }
    res.send(item);
});

app.get('/visitas', (req,res)=>{
    const visitas = {
        visitas: {
            items: visitasItems,
            item: visitasRandomItem
        }
    }
    res.send(visitas);
});