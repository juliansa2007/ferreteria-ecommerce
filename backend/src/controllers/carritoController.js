const { query } = require('../config/database');

// Obtener carrito del usuario
const obtenerCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // Obtener o crear carrito
    let carrito = await query(
      'SELECT id FROM carritos WHERE usuario_id = $1 AND activo = true',
      [usuarioId]
    );

    if (carrito.rows.length === 0) {
      carrito = await query(
        'INSERT INTO carritos (usuario_id) VALUES ($1) RETURNING id',
        [usuarioId]
      );
    }

    const carritoId = carrito.rows[0].id;

    // Obtener items del carrito con detalles de productos
    const items = await query(
      `SELECT ic.id, ic.producto_id, p.nombre, p.precio_cop, 
              ic.cantidad, ic.subtotal
       FROM items_carrito ic
       JOIN productos p ON ic.producto_id = p.id
       WHERE ic.carrito_id = $1`,
      [carritoId]
    );

    res.json({
      carritoId,
      items: items.rows,
      total: items.rows.reduce((sum, item) => sum + parseFloat(item.subtotal), 0),
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
};

// Agregar producto al carrito
const agregarProducto = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { productoId, cantidad } = req.body;

    if (!productoId || !cantidad) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    // Obtener producto
    const producto = await query(
      'SELECT precio_cop, stock FROM productos WHERE id = $1',
      [productoId]
    );

    if (producto.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar stock
    if (producto.rows[0].stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    // Obtener o crear carrito
    let carrito = await query(
      'SELECT id FROM carritos WHERE usuario_id = $1 AND activo = true',
      [usuarioId]
    );

    if (carrito.rows.length === 0) {
      carrito = await query(
        'INSERT INTO carritos (usuario_id) VALUES ($1) RETURNING id',
        [usuarioId]
      );
    }

    const carritoId = carrito.rows[0].id;

    // Verificar si producto ya está en carrito
    const existente = await query(
      'SELECT id, cantidad FROM items_carrito WHERE carrito_id = $1 AND producto_id = $2',
      [carritoId, productoId]
    );

    const precioUnitario = producto.rows[0].precio_cop;
    const subtotal = precioUnitario * cantidad;

    if (existente.rows.length > 0) {
      // Actualizar cantidad
      const nuevaCantidad = existente.rows[0].cantidad + cantidad;
      const nuevoSubtotal = precioUnitario * nuevaCantidad;

      await query(
        'UPDATE items_carrito SET cantidad = $1, subtotal = $2 WHERE id = $3',
        [nuevaCantidad, nuevoSubtotal, existente.rows[0].id]
      );
    } else {
      // Crear nuevo item
      await query(
        'INSERT INTO items_carrito (carrito_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
        [carritoId, productoId, cantidad, precioUnitario, subtotal]
      );
    }

    res.json({ mensaje: 'Producto agregado al carrito' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
};

// Eliminar producto del carrito
const eliminarProducto = async (req, res) => {
  try {
    const { itemId } = req.params;

    await query('DELETE FROM items_carrito WHERE id = $1', [itemId]);

    res.json({ mensaje: 'Producto eliminado del carrito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};

module.exports = {
  obtenerCarrito,
  agregarProducto,
  eliminarProducto,
};