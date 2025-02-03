const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

let tasks = [];  // Lista de tareas (en memoria)
let users = [];  // Lista de usuarios (en memoria)

const SECRET_KEY = 'mi_clave_secreta';

// Middleware para verificar el token
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send('Token no proporcionado');
  
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).send('Token no válido');
    req.user = decoded;  // Guardamos la información del usuario en el request
    next();
  });
}

// Ruta para registrar usuarios
app.post('/api/users/signup', (req, res) => {
  const { username, password } = req.body;
  if (users.some(user => user.username === username)) {
    return res.status(400).send('El usuario ya existe');
  }
  users.push({ username, password });
  res.status(200).send('Usuario creado correctamente');
});

// Ruta para hacer login y generar el token
app.post('/api/users/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(400).send('Credenciales incorrectas');
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Ruta para obtener las tareas de un usuario
app.get('/api/tasks', verifyToken, (req, res) => {
  // Filtrar las tareas por el nombre de usuario
  const userTasks = tasks.filter(task => task.user === req.user.username);
  res.json(userTasks);
});

// Ruta para agregar tareas a un usuario
app.post('/api/tasks', verifyToken, (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send('El nombre de la tarea es obligatorio');
  }

  const newTask = { name, user: req.user.username };
  tasks.push(newTask);
  res.status(200).send('Tarea agregada');
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
