const { query } = require('../config/database');

// GET todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const resultado = await query(
      'SELECT * FROM productos WHERE activo = true ORDER BY nombre'
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// GET un producto por ID
const obtenerProductoId = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// GET productos por categoría
const obtenerPorCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;
    const resultado = await query(
      'SELECT * FROM productos WHERE categoria_id = $1 AND activo = true ORDER BY nombre',
      [categoriaId]
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};
// Crear producto (solo admin)
const crearProducto = async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    const { nombre, descripcion, categoria_id, precio_cop, stock, marca } = req.body;

    if (!nombre || !categoria_id || !precio_cop || stock === undefined) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const sku = `SKU-${Date.now()}`;

    const resultado = await query(
  `INSERT INTO productos (nombre, descripcion, categoria_id, precio_cop, stock, sku, marca, aplicacion_uso, activo)
   VALUES ($1, $2, $3, $4, $5, $6, $7, 'Uso general', true)
   RETURNING *`,
  [nombre, descripcion, categoria_id, precio_cop, stock, sku, marca]
);

    res.json({ mensaje: 'Producto creado', producto: resultado.rows[0] });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Editar producto (solo admin)
const editarProducto = async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    const { id } = req.params;
    const { nombre, descripcion, categoria_id, precio_cop, stock, marca } = req.body;

    await query(
      `UPDATE productos 
       SET nombre = $1, descripcion = $2, categoria_id = $3, precio_cop = $4, stock = $5, marca = $6
       WHERE id = $7`,
      [nombre, descripcion, categoria_id, precio_cop, stock, marca, id]
    );

    res.json({ mensaje: 'Producto actualizado' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error al editar producto' });
  }
};

// Eliminar producto (solo admin)
const eliminarProducto = async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    const { id } = req.params;

    await query('DELETE FROM productos WHERE id = $1', [id]);

    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
// GET todas las categorías
const listarCategorias = async (req, res) => {
  try {
    const resultado = await query(
      'SELECT * FROM categorias WHERE activa = true ORDER BY nombre'
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

module.exports = {
  listarProductos: obtenerProductos,
  obtenerProductoId,
  listarCategorias,
  obtenerPorCategoria,
  crearProducto,
  editarProducto,
  eliminarProducto,
};