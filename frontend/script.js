// script.js

window.onload = () => {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname.split('/').pop();

  if (!token && currentPage === 'home.html') {
    window.location.href = 'login.html';  // Redirigir al login si no hay token y se intenta acceder a home
  }
};

// Manejo del formulario de inicio de sesión
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      fetch('https://avanceproyecto.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);  // Guardar token
          window.location.href = 'home.html';  // Redirigir a la página principal
        } else {
          document.getElementById('error-message').textContent = data.message || 'Usuario o contraseña incorrectos';
        }
      })
      .catch(() => {
        document.getElementById('error-message').textContent = 'Hubo un error al conectar con el servidor';
      });
    });
  }

  // Manejo del formulario de registro
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      fetch('https://avanceproyecto.onrender.com/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);  // Guardar token
          window.location.href = 'home.html';  // Redirigir a la página principal
        } else {
          document.getElementById('error-message').textContent = data.message || 'Error al crear cuenta';
        }
      })
      .catch(() => {
        document.getElementById('error-message').textContent = 'Hubo un error al conectar con el servidor';
      });
    });
  }
});
