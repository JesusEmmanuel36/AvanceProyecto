// Función para manejar el inicio de sesión (sin token)
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Aquí simularíamos una validación sin autenticación real
  if (username === 'usuario' && password === 'contraseña') { // Validación ficticia
    window.location.href = 'home.html';  // Redirigir a la página principal
  } else {
    document.getElementById('error-message').textContent = 'Usuario o contraseña incorrectos';
  }
});

// Función para manejar el registro de un nuevo usuario (sin token)
document.getElementById('signup-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Guardar el nuevo usuario en la base de datos sin autenticación real
  fetch('https://avanceproyecto.onrender.com/api/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      window.location.href = 'home.html';  // Redirigir a la página principal
    } else {
      document.getElementById('error-message').textContent = data.message || 'Error al crear cuenta';
    }
  })
  .catch(() => {
    document.getElementById('error-message').textContent = 'Hubo un error al conectar con el servidor';
  });
});

// Función para obtener las tareas (solo en home.html)
window.onload = () => {
  const taskList = document.getElementById('tasks');
  
  fetch('https://avanceproyecto.onrender.com/api/tasks')
    .then(response => response.json())
    .then(tasks => {
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        taskList.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error al obtener tareas:', error);
    });

  document.getElementById('add-task').addEventListener('click', () => {
    const taskName = prompt('Ingrese el nombre de la tarea:');
    if (taskName) {
      fetch('https://avanceproyecto.onrender.com/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: taskName })
      })
      .then(response => response.json())
      .then(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        taskList.appendChild(li);
      })
      .catch(error => {
        console.error('Error al agregar tarea:', error);
      });
    }
  });

  document.getElementById('logout').addEventListener('click', () => {
    window.location.href = 'login.html';  // Redirigir a login
  });
};