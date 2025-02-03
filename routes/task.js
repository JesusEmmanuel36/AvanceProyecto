const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para autenticar usuarios
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Acceso denegado' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido' });
  }
}

// Obtener todas las tareas del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
});

// Agregar una nueva tarea
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const newTask = new Task({ name, userId: req.user.id });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar tarea' });
  }
});

// Eliminar una tarea
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
});

module.exports = router;
