// Middleware para manejar errores
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).send('Algo salió mal en el servidor');
}

module.exports = errorHandler;
