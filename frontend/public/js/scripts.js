// Mostrar el modal de edición
function showEditModal(id) {
  fetch(`/documentos/${id}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('editTitle').value = data.titulo;
      document.getElementById('editDescription').value = data.descripcion;
      document.getElementById('editId').value = data._id;
      $('#editModal').modal('show');
    })
    .catch(err => console.log(err));
}

// Mostrar el modal de eliminación
function showDeleteModal(id) {
  document.getElementById('deleteId').value = id;
  $('#deleteModal').modal('show');
}

// Eliminar documento
function deleteDocument() {
  const id = document.getElementById('deleteId').value;
  fetch(`/documentos/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      location.reload();
    })
    .catch(err => console.log(err));
}

// Actualizar documento
document.getElementById('editForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('editId').value;
  const titulo = document.getElementById('editTitle').value;
  const descripcion = document.getElementById('editDescription').value;

  fetch(`/documentos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ titulo, descripcion })
  })
    .then(response => response.json())
    .then(data => {
      alert('Documento actualizado correctamente.');
      location.reload();
    })
    .catch(err => console.log(err));
});
