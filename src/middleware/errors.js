function noEncontrado(req, res) {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

function manejarError(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    mensaje: err.status ? err.message : 'Error interno del servidor.'
  });
}

module.exports = { noEncontrado, manejarError };
