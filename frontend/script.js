document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('home.html')) {
    verificarAutenticacion();
    cargarTareas();

    document.getElementById('add-task').addEventListener('click', agregarTarea);
  }

  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }
});

function verificarAutenticacion() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
  }
}

function cargarTareas() {
  const token = localStorage.getItem('token');
  fetch('/api/tasks', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(response => response.json())
    .then(tasks => {
      const taskList = document.getElementById('tasks');
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.addEventListener('click', () => eliminarTarea(task._id));
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
      });
    })
    .catch(error => console.error('Error al obtener tareas:', error));
}

function agregarTarea() {
  const token = localStorage.getItem('token');
  const taskName = document.getElementById('new-task').value;

  if (!taskName.trim()) return alert('La tarea no puede estar vacía');

  fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name: taskName })
  })
    .then(response => response.json())
    .then(() => {
      document.getElementById('new-task').value = '';
      cargarTareas();
    })
    .catch(error => console.error('Error al agregar tarea:', error));
}

function eliminarTarea(taskId) {
  const token = localStorage.getItem('token');
  fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(response => response.json())
    .then(() => cargarTareas())
    .catch(error => console.error('Error al eliminar tarea:', error));
}
