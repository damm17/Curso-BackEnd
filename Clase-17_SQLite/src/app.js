import Express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import productosRouter from "./routes/productos.routes.js";
import { __dirname } from "./environment/config.js";

const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({extended: true}));
app.use(session({
    secret: 'mySecret', 
    resave: false, 
    saveUninitialized: false
}))

app.use('/api', productosRouter);

console.log(__dirname)

// Config de handlebars
app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname,
        partialsDir: "/public/views/partials/"
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(Express.static('public'));

export default app;