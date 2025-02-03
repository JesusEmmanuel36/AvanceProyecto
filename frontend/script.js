document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('home.html')) {
    verificarAutenticacion();
    cargarTareas();
  }

  //login
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

  //registro
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

  //logout
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
 
//Eliminar tarea
function eliminarTarea(taskId) {
  const token = localStorage.getItem('token');
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

//obtener las tareas del usuario autenticado
function cargarTareas() {
  console.log("CARGAR TAREAS")
  const token = localStorage.getItem('token');
  fetch('/api/tasks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token 
    }
  })
    .then(response => response.json())
    .then(tasks => {
      const taskList = document.getElementById('tasks');
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;

        // Crear botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => eliminarTarea(task._id));

        li.appendChild(deleteButton);
        taskList.appendChild(li);
      });
    })
    .catch(error => console.error('Error al obtener tareas:', error));
}

//agregar tareas
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
        cargarTareas(); //Volver a cargar las tareas 
      })
      .catch(error => console.error('Error al agregar tarea:', error));
  }
});
