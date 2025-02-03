const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar middlewares
const authenticate = require('./middlewares/authenticate');
const errorHandler = require('./middlewares/errorHandler');

// Importar rutas
const userRoutes = require('./routes/user');

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

// Rutas
app.use('/api/users', userRoutes);

// Usar middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Puerto del servidor
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});