const express = require('express');
const upload = require('../config/multer');
const autenticacion = require('../middleware/autenticacion');
const { 
  listarProductos, 
  listarCategorias, 
  obtenerPorCategoria,
  crearProducto,
  editarProducto,
  eliminarProducto
} = require('../controllers/productoController');

const router = express.Router();

// Rutas públicas
router.get('/', listarProductos);
router.get('/categorias', listarCategorias);
router.get('/categoria/:id', obtenerPorCategoria);

// Rutas de admin
router.post('/', autenticacion, upload.single('imagen'), crearProducto);
router.put('/:id', autenticacion, upload.single('imagen'), editarProducto);
router.delete('/:id', autenticacion, eliminarProducto);

module.exports = router;