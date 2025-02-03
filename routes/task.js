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

// Ruta para eliminar una tarea
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
});

// Ruta para editar una tarea
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { name }, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al editar tarea' });
  }
});

module.exports = router;
