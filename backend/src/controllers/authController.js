const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const register = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (contrasena.length < 7) {
      return res.status(400).json({ error: 'contrasena debe tener mínimo 7 caracteres' });
    }

    const usuarioExistente = await query(
      'SELECT id FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

    const resultado = await query(
      'INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id, correo, rol',
      [nombre, apellido, correo, contrasenaHasheada, 'cliente']
    );

    const usuario = resultado.rows[0];

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE_IN }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      token,
    });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contrasena requeridos' });
    }

    const resultado = await query(
      'SELECT id, correo, contrasena, rol FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contrasena incorrectos' });
    }

    const usuario = resultado.rows[0];

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Correo o contrasena incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE_IN }
    );

    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      token,
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error al hacer login' });
  }
};

module.exports = {
  register,
  login,
};