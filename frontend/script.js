 
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://avanceproyecto.onrender.com/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'home.html';  // Redirigir a la página principal
    } else {
      document.getElementById('error-message').textContent = data.message || 'Error al iniciar sesión';
    }
  } catch (error) {
    document.getElementById('error-message').textContent = 'Hubo un error al conectar con el servidor';
  }
});
 
document.getElementById('signup-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://avanceproyecto.onrender.com/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'home.html';  // Redirigir a la página principal
    } else {
      document.getElementById('error-message').textContent = data.message || 'Error al crear cuenta';
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

  try {
    const response = await fetch('https://avanceproyecto.onrender.com/api/tasks', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
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

  document.getElementById('add-task').addEventListener('click', async () => {
    const taskName = prompt('Ingrese el nombre de la tarea:');
    if (taskName) {
      try {
        const response = await fetch('https://avanceproyecto.onrender.com/api/tasks', {
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

  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';  // Redirigir a login
  });
};
