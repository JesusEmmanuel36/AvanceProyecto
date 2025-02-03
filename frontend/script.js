// Verificar si el usuario está autenticado
window.onload = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';  // Si no hay token, redirigir al login
  }

  // El resto del código de las tareas...
  const taskList = document.getElementById('tasks');
  
  // Obtener tareas desde el backend
  fetch('https://avanceproyecto.onrender.com/api/tasks', {
    headers: {
      'Authorization': `Bearer ${token}`  // Enviar el token con la solicitud
    }
  })
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

  // Agregar una nueva tarea
  document.getElementById('add-task').addEventListener('click', () => {
    const taskName = prompt('Ingrese el nombre de la tarea:');
    if (taskName) {
      fetch('https://avanceproyecto.onrender.com/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Enviar el token con la solicitud
        },
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

  // Cerrar sesión
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');  // Eliminar el token al cerrar sesión
    window.location.href = 'login.html';  // Redirigir a login
  });
};
