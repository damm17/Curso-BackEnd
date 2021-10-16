import { Router } from "express";
import {
    getProductos,
    getProducto,
    buscarProducto,
    agregarProducto,
    actualizarProducto,
    borrarProducto
} from "../controllers/productos.controller.js";

const productosRouter = Router();

productosRouter
    .get("/productos/vista", getProductos)
    .get("/productos/listar/:id", getProducto)
    .post("/productos/listar/id", buscarProducto)
    .post("/productos/guardar", agregarProducto)
    .put("/productos/actualizar/:id", actualizarProducto)
    .delete("/productos/borrar/:id", borrarProducto);

export default productosRouter;