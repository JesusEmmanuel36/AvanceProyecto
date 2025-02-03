const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Importar middleware
const errorHandler = require('./middlewares/errorHandler');

// Importar rutas
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

// Conectar a la base de datos
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (html, css, js)
app.use(express.static(path.join(__dirname, 'frontend')));

// Ruta para la página principal (home)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html')); // Redirigir siempre a la página de login
});

// Ruta para la página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

// Ruta para la página de signup
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'signup.html'));
});

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Usar middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Puerto del servidor
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
