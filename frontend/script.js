document.addEventListener('DOMContentLoaded', () => {
  // Verificar si estamos en la página de inicio
  if (window.location.pathname.includes('home.html')) {
    verificarAutenticacion();
    cargarTareas();
    configurarEventos();
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

  // Manejo del logout
  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }
});

class TaskManager {
  constructor() {
    this.taskList = document.getElementById('tasks');
    this.taskInput = document.getElementById('task-input');
    this.addButton = document.getElementById('add-task');
  }

  // Cargar tareas al inicio
  cargarTareas() {
    fetch('/api/tasks')
      .then(response => response.json())
      .then(tasks => {
        this.taskList.innerHTML = ''; // Limpiar lista antes de agregar
        tasks.forEach(task => {
          this.agregarTareaHTML(task); // Mostrar cada tarea
        });
      })
      .catch(error => console.error('Error al obtener tareas:', error));
  }

  // Agregar tarea al listado
  agregarTarea(nombre) {
    const nuevaTarea = { name: nombre };
    
    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaTarea),
    })
    .then(response => response.json())
    .then(task => {
      this.agregarTareaHTML(task);
      this.taskInput.value = ''; // Limpiar el campo de entrada
    })
    .catch(error => console.error('Error al agregar tarea:', error));
  }

  // Mostrar tarea en la lista
  agregarTareaHTML(task) {
    const li = document.createElement('li');
    li.textContent = task.name;
    li.dataset.id = task._id;

    // Botón para eliminar tarea
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => this.eliminarTarea(task._id));

    // Botón para editar tarea
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => this.editarTarea(task._id));

    li.appendChild(deleteButton);
    li.appendChild(editButton);
    this.taskList.appendChild(li);
  }

  // Eliminar tarea
  eliminarTarea(id) {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        const taskElement = document.querySelector(`[data-id='${id}']`);
        taskElement.remove();
      })
      .catch(error => console.error('Error al eliminar tarea:', error));
  }

  // Editar tarea
  editarTarea(id) {
    const nuevoNombre = prompt('Edita la tarea:');
    if (nuevoNombre) {
      fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nuevoNombre }),
      })
      .then(response => response.json())
      .then(updatedTask => {
        const taskElement = document.querySelector(`[data-id='${id}']`);
        taskElement.firstChild.textContent = updatedTask.name;
      })
      .catch(error => console.error('Error al editar tarea:', error));
    }
  }

  configurarEventos() {
    // Agregar tarea al presionar el botón
    this.addButton.addEventListener('click', () => {
      const tareaNombre = this.taskInput.value.trim();
      if (tareaNombre) {
        this.agregarTarea(tareaNombre);
      }
    });

    // Agregar tarea al presionar Enter
    this.taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const tareaNombre = this.taskInput.value.trim();
        if (tareaNombre) {
          this.agregarTarea(tareaNombre);
        }
      }
    });
  }
}

function verificarAutenticacion() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
  }
}

// Instanciar y usar TaskManager
const taskManager = new TaskManager();
taskManager.cargarTareas();
