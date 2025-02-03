const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Ruta para obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
});

// Ruta para agregar una tarea
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newTask = new Task({ name });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar tarea' });
  }
});

module.exports = router;
