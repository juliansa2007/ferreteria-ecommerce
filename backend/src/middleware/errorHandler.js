// Middleware que captura errores de cualquier ruta
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Respuesta estándar
  const response = {
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString(),
  };

  // Si en desarrollo, mostrar detalles técnicos
  if (process.env.NODE_ENV === 'development') {
    response.details = err.stack;
  }

  res.status(err.statusCode || 500).json(response);
};

module.exports = errorHandler;