document.addEventListener('DOMContentLoaded', () => {
  // Verificar si estamos en la página de inicio
  if (window.location.pathname.includes('home.html')) {
    verificarAutenticacion();
    cargarTareas();
  }

  // Manejo del login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          window.location.href = 'home.html';
        } else {
          document.getElementById('error-message').textContent = data.message;
        }
      } catch (error) {
        console.error('Error en el login:', error);
      }
    });
  }

  // Manejo del registro
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/api/users/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
          window.location.href = 'login.html';
        } else {
          document.getElementById('error-message').textContent = data.message;
        }
      } catch (error) {
        console.error('Error en el registro:', error);
      }
    });
  }

  // Manejo del logout
  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }
});

// Verificar autenticación antes de entrar a home.html
function verificarAutenticacion() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
  }
}
 
// Agregar tarea
 

// Eliminar tarea
function eliminarTarea(taskId) {
  const token = localStorage.getItem('token');
  console.log('Token:', token); // Para verificar si el token está presente

  fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      cargarTareas();  // Recargar las tareas
    })
    .catch(error => console.error('Error al eliminar tarea:', error));
}

// Función para obtener las tareas del usuario autenticado
function cargarTareas() {
  const token = localStorage.getItem('token');
  fetch('/api/tasks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token // Enviar el token en la cabecera
    }
  })
    .then(response => response.json())
    .then(tasks => {
      const taskList = document.getElementById('tasks');
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => eliminarTarea(task._id));
        li.appendChild(deleteButton);
        taskList.appendChild(li);
      });
    })
    .catch(error => console.error('Error al obtener tareas:', error));
}

// Función para agregar tareas
document.getElementById('add-task').addEventListener('click', () => {
  const taskName = prompt('Ingrese el nombre de la tarea:');
  if (taskName) {
    const token = localStorage.getItem('token');
    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ name: taskName })
    })
      .then(response => response.json())
      .then(task => {
        cargarTareas(); // Volver a cargar las tareas después de agregar una nueva
      })
      .catch(error => console.error('Error al agregar tarea:', error));
  }
});
