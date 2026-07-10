const express = require('express');
const { obtenerProductos, obtenerProductoId, obtenerPorCategoria } = require('../controllers/productoController');
const { obtenerCategorias } = require('../controllers/categoriaController');

const router = express.Router();

// Rutas de categorías
router.get('/categorias', obtenerCategorias);

// Rutas de productos
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoId);
router.get('/categoria/:categoriaId', obtenerPorCategoria);

module.exports = router;