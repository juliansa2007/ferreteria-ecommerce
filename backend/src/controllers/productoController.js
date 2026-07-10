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

module.exports = {
  obtenerProductos,
  obtenerProductoId,
  obtenerPorCategoria,
};