const express = require('express');
const autenticacion = require('../middleware/autenticacion');
const { obtenerCarrito, agregarProducto, eliminarProducto } = require('../controllers/carritoController');

const router = express.Router();

// Todas las rutas necesitan token
router.use(autenticacion);

router.get('/', obtenerCarrito);
router.post('/agregar', agregarProducto);
router.delete('/item/:itemId', eliminarProducto);

module.exports = router;