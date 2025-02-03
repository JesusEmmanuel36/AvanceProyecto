const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Se requiere autenticación' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.userId = decoded.id; // Guardar el ID del usuario en la petición
    next();
  });
};

// Ruta para obtener todas las tareas del usuario autenticado
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
});

// Ruta para agregar una tarea para el usuario autenticado
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const newTask = new Task({
      name,
      user: req.userId // Asociamos la tarea con el usuario autenticado
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar tarea' });
  }
});

// Ruta para eliminar una tarea
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada o no pertenece al usuario' });
    }

    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
});

module.exports = router;
