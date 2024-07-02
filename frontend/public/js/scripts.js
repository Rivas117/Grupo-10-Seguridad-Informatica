async function fetchDocuments() {
  try {
    const response = await fetch('http://localhost:3000/api/documents');
    const data = await response.json();
    const tableBody = document.getElementById('documentTable');
    tableBody.innerHTML = '';
    data.data.forEach(doc => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${doc._id}</td>
        <td>${doc.title}</td>
        <td>${doc.description}</td>
        <td>${doc.category}</td>
        <td>${new Date(doc.createdAt).toLocaleDateString()}</td>
        <td>
          <a href="${doc.file}" class="btn btn-primary" download>Descargar</a>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error al obtener documentos:', error);
  }
}

async function fetchProjects() {
  try {
    const projectsContainer = document.getElementById('proyectosContainer');
    projectsContainer.innerHTML = '';
    const response = await fetch('http://localhost:3000/api/projects');
    const data = await response.json();
    data.data.forEach(proj => {
      const projectBox = document.createElement('div');
      projectBox.className = 'project-box';
      projectBox.innerHTML = `
        <i class="fas fa-chart-line"></i>
        <div class="project-info">
          <h5>${proj.title}</h5>
          <p>${proj.description}</p>
        </div>
      `;
      projectsContainer.appendChild(projectBox);
    });
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
  }
}

async function login(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      alert('Inicio de sesión fallido: ' + data.message);
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const pathname = window.location.pathname;
  if (pathname.includes('documentos.html')) {
    fetchDocuments();
  } else if (pathname.includes('proyectos.html')) {
    fetchProjects();
  }
});
