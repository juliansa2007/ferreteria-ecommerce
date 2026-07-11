// ============================================================================
// authController.js - Lógica de autenticación (login/registro)
// ============================================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// ============================================================================
// FUNCIÓN: REGISTRO (usuario nuevo)
// ============================================================================

const register = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena} = req.body;

    // Validar que todos los campos existan
    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Validar que contraseña tenga mínimo 7 caracteres
    if (contraseña.length < 7) {
      return res.status(400).json({ error: 'contrasena debe tener mínimo 7 caracteres' });
    }

    // Verificar que el correo NO exista ya
    const usuarioExistente = await query(
      'SELECT id FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    // Hashear la contraseña (encriptarla)
    const contraseñaHasheada = await bcrypt.hash(contraseña, 10);

    // Insertar usuario en BD
    const resultado = await query(
      'INSERT INTO usuarios (nombre, apellido, correo, contraseña, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id, correo, rol',
      [nombre, apellido, correo, contraseñaHasheada, 'cliente']
    );

    const usuario = resultado.rows[0];

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE_IN }
    );

    // Responder con éxito
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

// ============================================================================
// FUNCIÓN: LOGIN (usuario existente)
// ============================================================================

const login = async (req, res) => {
  try {
    const { correo, contrasena} = req.body;

    // Validar que ambos campos existan
    if (!correo || !contraseña) {
      return res.status(400).json({ error: 'Correo y contrasena requeridos' });
    }

    // Buscar usuario en BD
    const resultado = await query(
      'SELECT id, correo, contrasena, rol FROM usuarios WHERE correo = $1',
      [correo]
    );

    // Si no existe
    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contrasena incorrectos' });
    }

    const usuario = resultado.rows[0];

    // Verificar que la contraseña sea correcta (comparar hasheada)
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Correo o contrasena incorrectos' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE_IN }
    );

    // Responder con éxito
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

// ============================================================================
// EXPORTAR FUNCIONES
// ============================================================================

module.exports = {
  register,
  login,
};