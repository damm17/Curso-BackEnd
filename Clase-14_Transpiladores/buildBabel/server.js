'use strict';

/**/
var express = require('express');
var handlebars = require('express-handlebars');
var session = require('express-session');
var fs = require('fs');

var _require = require('http'),
    HttpServer = _require.Server;

var _require2 = require('socket.io'),
    IOServer = _require2.Server;

var app = express();
var PORT = 8080;
var router = express.Router();
var httpServer = new HttpServer(app);
var io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));

app.use('/api', router);

// Config de handlebars
app.engine("hbs", handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/"
}));

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static('public'));

httpServer.listen(PORT, function () {
    console.log('Servidor HTTP escuchando en el puerto', PORT);
});

var products = [];

app.get("/", function (req, res) {
    try {
        var savedProduct = req.session.savedProduct;
        res.render("main", { savedProduct: savedProduct });
        req.session.savedProduct = false;
    } catch (error) {
        console.log(error);
    }
});

router.get('/productos/vista', function (req, res) {
    try {
        if (products.length > 0) {
            req.session.productsAvailable = true;
        }
        res.render("products", { products: products, productsAvailable: req.session.productsAvailable });
    } catch (error) {
        console.log(error);
    }
});

router.post('/productos/listar/id', function (req, res) {
    try {
        var body = req.body;
        var product = products.find(function (p) {
            return p.id == body.id;
        });
        req.session.product = product;
        res.redirect('/api/productos/listar/' + body.id);
    } catch (error) {
        console.log(error);
    }
});

router.get('/productos/listar/:id', function (req, res) {
    try {
        if (products.length > 0) {
            req.session.productsAvailable = true;
        }
        var product = req.session.product;
        res.render("products", { product: product, productsAvailable: req.session.productsAvailable });
    } catch (error) {
        console.log(error);
    }
});

router.post('/productos/guardar', function (req, res) {
    try {
        var body = req.body;
        var error = {
            msg: ''
        };
        if (body.title == '' || body.price == '' || body.price <= 0 || body.thumbnail == '') {
            error.msg = 'No se puede guardar el producto. Revise los datos proporcionados.';
            res.status(400);
            res.json({ error: error });
        } else {
            body.id = products.length + 1;
            products.push(body);
            req.session.savedProduct = true;
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
    }
});

router.put('/productos/actualizar/:id', function (req, res) {
    var _req$body = req.body,
        title = _req$body.title,
        price = _req$body.price,
        thumbnail = _req$body.thumbnail;

    var params = req.params;
    var product = products.find(function (p) {
        return p.id == params.id;
    });

    if (product && (title !== '' || price !== '' || price > 0 || thumbnail !== '')) {
        product.title = title;
        product.price = price;
        product.thumbnail = thumbnail;
        res.json(product);
    } else {
        res.status(404);
        res.json({ error: 'Producto no encontrado' });
    }
});

router.delete('/productos/borrar/:id', function (req, res) {
    var params = req.params;
    var product = products.find(function (p) {
        return p.id == params.id;
    });
    if (product) {
        products = products.filter(function (x) {
            return x.id != params.id;
        });
        res.json(product);
    } else {
        res.status(404);
        res.json({ error: 'Producto no encontrado' });
    }
});

// WEBSOCKETS
io.on('connection', function (socket) {
    console.log('Usuario Conectado');

    socket.emit('catalogo', products);

    socket.on('savedProduct', function (data) {
        data.id = products.length + 1;
        products.push(data);
        io.sockets.emit('catalogo', products);
    });

    var chats = {
        messages: []
    };
    fs.readFile(__dirname + '/logs/chat.json', 'utf8', function (err, data) {
        if (!err) {
            chats.messages = JSON.parse(data).messages;
            socket.emit('chat', chats.messages);
        }
    });

    socket.on('chatMsg', function (data) {
        chats.messages.push(data);
        fs.writeFile(__dirname + '/logs/chat.json', JSON.stringify(chats, null, "\t"), 'utf8', function (err, data) {
            if (!err) {
                io.sockets.emit('chat', chats.messages);
            }
        });
    });
});
