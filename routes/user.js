const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Ruta para registrar usuario
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });

    if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario con la contraseña hasheada
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Responder que el usuario fue creado
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // Generar un JWT
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar respuesta con el token
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

module.exports = router;
