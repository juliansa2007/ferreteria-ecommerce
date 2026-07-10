const express = require('express');
const autenticacion = require('../middleware/autenticacion');
const { crearOrden, obtenerOrdenes } = require('../controllers/ordenController');

const router = express.Router();

router.use(autenticacion);

router.post('/', crearOrden);
router.get('/', obtenerOrdenes);

module.exports = router;