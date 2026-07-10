const { query } = require('../config/database');

// GET todas las categorías
const obtenerCategorias = async (req, res) => {
  try {
    const resultado = await query(
      'SELECT * FROM categorias WHERE activa = true ORDER BY orden'
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

module.exports = {
  obtenerCategorias,
};