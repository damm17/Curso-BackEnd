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

// Config de handlebars
app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: `${__dirname}/../../views/layouts`,
        partialsDir: `${__dirname}/../../views/partials`
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(Express.static('public'));

app.get("/", (req, res) => {
    try {
        const savedProduct = req.session.savedProduct;
        res.render("main", { savedProduct })
        req.session.savedProduct = false;
    } catch (error) {
        console.log(error)
    }
})

app.use('/api', productosRouter);

export default app;