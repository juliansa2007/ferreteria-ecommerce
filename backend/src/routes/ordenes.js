const express = require('express');
const autenticacion = require('../middleware/autenticacion');
const { 
  crearOrden, 
  obtenerOrdenes, 
  obtenerTodasLasOrdenes,
  cambiarEstadoOrden 
} = require('../controllers/ordenController');

const router = express.Router();

router.use(autenticacion);

// Rutas de usuario normal
router.post('/', crearOrden);
router.get('/', obtenerOrdenes);

// Rutas de admin
router.get('/todas', obtenerTodasLasOrdenes);
router.put('/:id/estado', cambiarEstadoOrden);

module.exports = router;