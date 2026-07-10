const { query } = require('../config/database');
const crypto = require('crypto');

const iniciarPago = async (req, res) => {
  try {
    const { ordenId } = req.body;
    const usuario = req.usuario;

    // Obtener orden
    const orden = await query(
      'SELECT id, numero_orden, total_cop FROM ordenes WHERE id = $1',
      [ordenId]
    );

    if (orden.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const ordenData = orden.rows[0];
    const monto = Math.round(ordenData.total_cop);

    // Crear signature para PayU
    const referenceCode = ordenData.numero_orden;
    const accountId = process.env.PAYU_ACCOUNT_ID;
    const merchantId = process.env.PAYU_MERCHANT_ID;
    const currency = 'COP';
    const apiKey = process.env.PAYU_API_KEY;

    const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${monto}~${currency}`;
    const signature = crypto
      .createHash('md5')
      .update(signatureString)
      .digest('hex');

    // Datos para el formulario de PayU
    const pagoData = {
      merchantId: merchantId,
      accountId: accountId,
      referenceCode: referenceCode,
      amount: monto,
      currency: currency,
      buyerEmail: usuario.correo,
      buyerFullName: usuario.nombre,
      description: `Orden ${referenceCode}`,
      signature: signature,
      test: '1', // Modo sandbox
      responseUrl: `${process.env.FRONTEND_URL}/confirmacion/${referenceCode}`,
      confirmationUrl: `${process.env.BACKEND_URL}/api/pagos/confirmacion`,
    };

    res.json({
      mensaje: 'Datos PayU generados',
      url: 'https://sandbox.checkout.payulatam.com/ppp-web-gateway/',
      datos: pagoData,
    });
  } catch (err) {
    console.error('Error iniciar pago:', err);
    res.status(500).json({ error: 'Error al iniciar pago' });
  }
};

const confirmacionPago = async (req, res) => {
  try {
    const { referenceCode, transactionState } = req.query;

    // Estado 4 = Aprobado
    if (transactionState === '4') {
      await query(
        'UPDATE ordenes SET estado = $1, fecha_pago = NOW() WHERE numero_orden = $2',
        ['pagada', referenceCode]
      );
    }

    res.json({ mensaje: 'Confirmación procesada' });
  } catch (err) {
    console.error('Error confirmación:', err);
    res.status(500).json({ error: 'Error en confirmación' });
  }
};

module.exports = {
  iniciarPago,
  confirmacionPago,
};