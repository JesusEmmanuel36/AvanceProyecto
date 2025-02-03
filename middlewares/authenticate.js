const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
function authenticate(req, res, next) {
  const token = req.header('Authorization');
  
  if (!token) return res.status(403).send('Acceso denegado');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Almacena el usuario decodificado en `req.user`
    next(); // Llama al siguiente middleware o ruta
  } catch (error) {
    res.status(400).send('Token no válido');
  }
}

module.exports = authenticate;
