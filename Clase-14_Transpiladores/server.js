"use strict";
/**/
// const express = require('express');
// const handlebars = require('express-handlebars');
// const session = require('express-session');
// const fs = require('fs');
// const { Server: HttpServer } = require('http');
// const { Server: IOServer } = require('socket.io');
exports.__esModule = true;
var express_1 = require("express");
var express_handlebars_1 = require("express-handlebars");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var file_system_1 = require("file-system");
var express_session_1 = require("express-session");
var app = (0, express_1["default"])();
var PORT = 8080;
var router = express_1["default"].Router();
var http = new http_1.createServer(app);
var io = new socket_io_1.Server(http);
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
app.use((0, express_session_1["default"])({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));
app.use('/api', router);
// Config de handlebars
app.engine("hbs", (0, express_handlebars_1["default"])({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/"
}));
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express_1["default"].static('public'));
var server = http.listen(PORT, function () {
    console.log("Servidor HTTP corriendo en", server.address().port);
});
var products = [];
app.get("/", function (req, res) {
    try {
        var savedProduct = req.session.savedProduct;
        res.render("main", { savedProduct: savedProduct });
        req.session.savedProduct = false;
    }
    catch (error) {
        console.log(error);
    }
});
router.get('/productos/vista', function (req, res) {
    try {
        if (products.length > 0) {
            req.session.productsAvailable = true;
        }
        res.render("products", { products: products, productsAvailable: req.session.productsAvailable });
    }
    catch (error) {
        console.log(error);
    }
});
router.post('/productos/listar/id', function (req, res) {
    try {
        var body_1 = req.body;
        var product = products.find(function (p) { return p.id == body_1.id; });
        req.session.product = product;
        res.redirect("/api/productos/listar/" + body_1.id);
    }
    catch (error) {
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
    }
    catch (error) {
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
        }
        else {
            body.id = products.length + 1;
            products.push(body);
            req.session.savedProduct = true;
            res.redirect('/');
        }
    }
    catch (error) {
        console.log(error);
    }
});
router.put('/productos/actualizar/:id', function (req, res) {
    var _a = req.body, title = _a.title, price = _a.price, thumbnail = _a.thumbnail;
    var params = req.params;
    var product = products.find(function (p) { return p.id == params.id; });
    if (product && (title !== '' || price !== '' || price > 0 || thumbnail !== '')) {
        product.title = title;
        product.price = price;
        product.thumbnail = thumbnail;
        res.json(product);
    }
    else {
        res.status(404);
        res.json({ error: 'Producto no encontrado' });
    }
});
router["delete"]('/productos/borrar/:id', function (req, res) {
    var params = req.params;
    var product = products.find(function (p) { return p.id == params.id; });
    if (product) {
        products = products.filter(function (x) {
            return x.id != params.id;
        });
        res.json(product);
    }
    else {
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
    file_system_1["default"].readFile(__dirname + "/logs/chat.json", 'utf8', function (err, data) {
        if (!err) {
            chats.messages = JSON.parse(data).messages;
            socket.emit('chat', chats.messages);
        }
    });
    socket.on('chatMsg', function (data) {
        chats.messages.push(data);
        file_system_1["default"].writeFile(__dirname + "/logs/chat.json", JSON.stringify(chats, null, "\t"), 'utf8', function (err, data) {
            if (!err) {
                io.sockets.emit('chat', chats.messages);
            }
        });
    });
});
