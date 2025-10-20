import { useEffect, useState } from "react";
import TaskForm from "../components/task/Form";
import TaskTable from "../components/task/Table";
import api, { setAuthToken } from "../services/api";

export default function TasksPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [reload, setReload] = useState(0); // Cambiado a número para forzar recarga

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
  }, []);

  // Abrir formulario para nueva tarea
  function handleAddNew() {
    // CORREGIDO: No incluir 'id' para crear nueva tarea
    setEditingTask({ title: "", description: "", status: "pendiente" });
    setShowForm(true);
  }

  // Abrir formulario para editar tarea
  function handleEdit(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  // Cerrar formulario y recargar tabla
  function handleCloseForm() {
    setShowForm(false);
    setEditingTask(null);
    setReload(prev => prev + 1); // CORREGIDO: Incrementar para forzar recarga
  }

  // NUEVO: Función para manejar eliminaciones desde la tabla
  function handleDelete() {
    setReload(prev => prev + 1); // Recargar tabla después de eliminar
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Gestión de Tareas</h2>

      {!showForm && (
        <button className="btn btn-primary mb-3" onClick={handleAddNew}>
          ➕ Nueva Tarea
        </button>
      )}

      {showForm ? (
        <TaskForm task={editingTask} onClose={handleCloseForm} />
      ) : (
        <TaskTable key={reload} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}