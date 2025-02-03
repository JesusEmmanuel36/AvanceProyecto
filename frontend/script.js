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

  // Mostrar formulario para agregar tarea
  const addTaskButton = document.getElementById('add-task');
  const addTaskForm = document.getElementById('add-task-form');
  const taskNameInput = document.getElementById('task-name');
  const saveTaskButton = document.getElementById('save-task');
  const cancelTaskButton = document.getElementById('cancel-task');

  addTaskButton.addEventListener('click', () => {
    addTaskForm.style.display = 'block';
  });

  cancelTaskButton.addEventListener('click', () => {
    addTaskForm.style.display = 'none';
    taskNameInput.value = '';
  });

  // Guardar tarea
  saveTaskButton.addEventListener('click', async () => {
    const taskName = taskNameInput.value.trim();
    if (taskName === '') {
      alert('El nombre de la tarea no puede estar vacío.');
      return;
    }

    const task = { name: taskName };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(task)
      });

      if (response.ok) {
        cargarTareas();  // Recargar la lista de tareas
        addTaskForm.style.display = 'none';  // Ocultar el formulario
        taskNameInput.value = '';  // Limpiar el campo
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  });
});

// Verificar autenticación antes de entrar a home.html
function verificarAutenticacion() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
  }
}

// Cargar tareas en home.html
function cargarTareas() {
  fetch('/api/tasks', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  })
    .then(response => response.json())
    .then(tasks => {
      const taskList = document.getElementById('tasks');
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        taskList.appendChild(li);
      });
    })
    .catch(error => console.error('Error al obtener tareas:', error));
}
