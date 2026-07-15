const { query } = require('../config/database');

const crearOrden = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { nombre_envio, telefono, direccion, ciudad, metodo_pago } = req.body;

    if (!nombre_envio || !telefono || !direccion || !ciudad || !metodo_pago) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Obtener carrito activo
    const carrito = await query(
      'SELECT id FROM carritos WHERE usuario_id = $1 AND activo = true',
      [usuarioId]
    );

    if (carrito.rows.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }

    const carritoId = carrito.rows[0].id;

    // Obtener items del carrito
    const items = await query(
      'SELECT * FROM items_carrito WHERE carrito_id = $1',
      [carritoId]
    );

    if (items.rows.length === 0) {
      return res.status(400).json({ error: 'Carrito sin productos' });
    }

    // Calcular totales
    const subtotal = items.rows.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    const impuesto = subtotal * 0.19;
    const total = subtotal + impuesto;

    // Crear número de orden
    const numeroOrden = `ORD-${Date.now()}`;

    // Insertar orden
    const orden = await query(
      `INSERT INTO ordenes 
       (numero_orden, usuario_id, carrito_id, subtotal, impuesto, total_cop, 
        metodo_pago, estado, direccion_entrega, ciudad_entrega)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, numero_orden, total_cop`,
      [numeroOrden, usuarioId, carritoId, subtotal, impuesto, total, 
       metodo_pago, 'pendiente_pago', direccion, ciudad]
    );

    const ordenId = orden.rows[0].id;

    // Insertar detalles de orden
    for (const item of items.rows) {
      const producto = await query(
        'SELECT nombre FROM productos WHERE id = $1',
        [item.producto_id]
      );

      await query(
        `INSERT INTO detalles_orden 
         (orden_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [ordenId, item.producto_id, producto.rows[0].nombre, 
         item.cantidad, item.precio_unitario, item.subtotal]
      );
    }

    // Marcar carrito como inactivo
    await query('UPDATE carritos SET activo = false WHERE id = $1', [carritoId]);

    res.json({
      mensaje: 'Orden creada exitosamente',
      ordenId,
      numeroOrden: orden.rows[0].numero_orden,
      total: orden.rows[0].total_cop,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error al crear orden' });
  }
};

const obtenerOrdenes = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const ordenes = await query(
      'SELECT id, numero_orden, total_cop, estado, fecha_creacion FROM ordenes WHERE usuario_id = $1 ORDER BY fecha_creacion DESC',
      [usuarioId]
    );

    res.json(ordenes.rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
};
// Obtener TODAS las órdenes (solo admin)
const obtenerTodasLasOrdenes = async (req, res) => {
  try {
    // Verificar que sea admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    const ordenes = await query(
      `SELECT o.id, o.numero_orden, o.total_cop, o.estado, o.fecha_creacion, 
              u.correo as correo_usuario
       FROM ordenes o
       JOIN usuarios u ON o.usuario_id = u.id
       ORDER BY o.fecha_creacion DESC`,
      []
    );

    res.json(ordenes.rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
};

// Cambiar estado de orden (solo admin)
const cambiarEstadoOrden = async (req, res) => {
  try {
    // Verificar que sea admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['pendiente_pago', 'pagada', 'enviada', 'entregada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    await query(
      'UPDATE ordenes SET estado = $1 WHERE id = $2',
      [estado, id]
    );

    res.json({ mensaje: 'Estado actualizado' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
};

module.exports = {
  crearOrden,
  obtenerOrdenes,
  obtenerTodasLasOrdenes,
  cambiarEstadoOrden,
};