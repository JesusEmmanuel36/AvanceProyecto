document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('home.html')) {
    verificarAutenticacion();
    cargarTareas();
  }

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

  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }

  const addTaskButton = document.getElementById('add-task');
  if (addTaskButton) {
    addTaskButton.addEventListener('click', () => {
      document.getElementById('task-input-container').style.display = 'block';
    });
  }

  const cancelTaskButton = document.getElementById('cancel-task');
  if (cancelTaskButton) {
    cancelTaskButton.addEventListener('click', () => {
      document.getElementById('task-input-container').style.display = 'none';
    });
  }

  const saveTaskButton = document.getElementById('save-task');
  if (saveTaskButton) {
    saveTaskButton.addEventListener('click', () => {
      const taskName = document.getElementById('task-name').value;
      if (taskName) {
        agregarTarea(taskName);
      }
    });
  }
});

// Verificar autenticación
function verificarAutenticacion() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
  }
}

// Cargar tareas del usuario
function cargarTareas() {
  fetch('/api/tasks', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
  .then(response => response.json())
  .then(tasks => {
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.name;

      const editButton = document.createElement('button');
      editButton.textContent = 'Editar';
      editButton.addEventListener('click', () => editarTarea(task._id));

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.addEventListener('click', () => eliminarTarea(task._id));

      const completeButton = document.createElement('button');
      completeButton.textContent = task.completed ? 'Marcar incompleta' : 'Marcar completada';
      completeButton.addEventListener('click', () => marcarTareaCompletada(task._id, !task.completed));

      li.appendChild(editButton);
      li.appendChild(deleteButton);
      li.appendChild(completeButton);
      taskList.appendChild(li);
    });
  })
  .catch(error => console.error('Error al obtener tareas:', error));
}

// Crear tarea
function agregarTarea(taskName) {
  fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ name: taskName })
  })
  .then(response => response.json())
  .then(task => {
    cargarTareas();
    document.getElementById('task-input-container').style.display = 'none';
  })
  .catch(error => console.error('Error al agregar tarea:', error));
}

// Editar tarea
function editarTarea(taskId) {
  const newTaskName = prompt('Nuevo nombre para la tarea:');
  if (newTaskName) {
    fetch('/api/tasks/' + taskId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ name: newTaskName })
    })
    .then(response => response.json())
    .then(() => cargarTareas())
    .catch(error => console.error('Error al editar tarea:', error));
  }
}

// Eliminar tarea
function eliminarTarea(taskId) {
  fetch('/api/tasks/' + taskId, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
  .then(response => response.json())
  .then(() => cargarTareas())
  .catch(error => console.error('Error al eliminar tarea:', error));
}

// Marcar tarea como completada o incompleta
function marcarTareaCompletada(taskId, completed) {
  fetch('/api/tasks/' + taskId + '/complete', {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ completed })
  })
  .then(response => response.json())
  .then(() => cargarTareas())
  .catch(error => console.error('Error al marcar tarea:', error));
}
