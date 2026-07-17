require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { connectDB } = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));

// Rutas de prueba
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.get('/api', (req, res) => {
  res.json({
    nombre: 'Ferretería E-Commerce API',
    version: '1.0.0',
    ambiente: process.env.NODE_ENV,
    endpoints: {
      auth: '/api/auth (próximamente)',
      productos: '/api/productos (próximamente)',
    },
  });
});
// ============================================================================
// RUTAS IMPLEMENTADAS
// ============================================================================

// Rutas de Autenticación
app.use('/api/auth', require('./src/routes/auth'));

// Rutas de Productos
app.use('/api/productos', require('./src/routes/productos'));

// Rutas de Carrito  ← ¿ESTÁ ESTA LÍNEA?
app.use('/api/carrito', require('./src/routes/carrito'));

// Rutas de Órdenes
app.use('/api/ordenes', require('./src/routes/ordenes'));

// Rutas de Pagos
app.use('/api/pagos', require('./src/routes/pagos'));
// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
  });
});

// Error handler
app.use(errorHandler);

// Levantar servidor
const startServer = async () => {
  try {
    console.log('🔌 Conectando a PostgreSQL...');
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Servidor en http://localhost:${PORT}`);
      console.log(`📚 API en http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar:', err);
    process.exit(1);
  }
};

startServer();