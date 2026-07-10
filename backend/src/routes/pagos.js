const express = require('express');
const autenticacion = require('../middleware/autenticacion');
const { iniciarPago, confirmacionPago } = require('../controllers/pagoController');

const router = express.Router();

router.post('/iniciar', autenticacion, iniciarPago);
router.get('/confirmacion', confirmacionPago);

module.exports = router;