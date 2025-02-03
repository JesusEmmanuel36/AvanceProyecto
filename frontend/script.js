// Función para manejar el inicio de sesión
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Almacenar el token en el localStorage
      localStorage.setItem('token', data.token);
      window.location.href = 'home.html';  // Redirigir a la página principal
    } else {
      document.getElementById('error-message').textContent = data.message || 'Error al iniciar sesión';
    }
  } catch (error) {
    document.getElementById('error-message').textContent = 'Hubo un error al conectar con el servidor';
  }
});

// Función para obtener las tareas (solo en home.html)
window.onload = async () => {
if (!localStorage.getItem('token')) {
  window.location.href = 'login.html'; // Redirigir a login si no hay token
}

const token = localStorage.getItem('token');
const taskList = document.getElementById('tasks');

// Obtener tareas desde el backend
try {
  const response = await fetch('http://localhost:3000/api/tasks', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const tasks = await response.json();
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.name;
    taskList.appendChild(li);
  });
} catch (error) {
  console.error('Error al obtener tareas:', error);
}

// Función para agregar tarea
document.getElementById('add-task').addEventListener('click', async () => {
  const taskName = prompt('Ingrese el nombre de la tarea:');
  if (taskName) {
    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: taskName })
      });

      const task = await response.json();
      const li = document.createElement('li');
      li.textContent = task.name;
      taskList.appendChild(li);
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  }
});

// Función para cerrar sesión
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';  // Redirigir a login
});
};
