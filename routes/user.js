const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');  // Asegúrate de que la ruta sea correcta

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

    // Enviar respuesta
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// Ruta para iniciar sesión (sin autenticación)
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    
    // Verificar si el usuario existe
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    // Si existe el usuario, no se compara la contraseña, solo se devuelve el éxito
    res.json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

module.exports = router;
