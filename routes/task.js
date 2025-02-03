const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware para verificar el token
function verificarToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token no válido' });
    }
    req.userId = decoded.id;
    next();
  });
}

// Obtener tareas del usuario autenticado
router.get('/', verificarToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
});

// Agregar tarea
router.post('/', verificarToken, async (req, res) => {
  try {
    const { name } = req.body;
    const newTask = new Task({ name, userId: req.userId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar tarea' });
  }
});

// Editar tarea
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { name } = req.body;
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { name }, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al editar tarea' });
  }
});

// Eliminar tarea
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
});

// Marcar tarea como completada
router.patch('/:id/complete', verificarToken, async (req, res) => {
  try {
    const { completed } = req.body;
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { completed }, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
});

module.exports = router;
