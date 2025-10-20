import { useState, useEffect } from "react";
import api from "../../services/api";

export default function TaskForm({ task, onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pendiente",
  });

  // CORREGIDO: Actualizar el formulario correctamente
  useEffect(() => {
    if (task) {
      setForm({
        id: task.id || undefined, // Solo incluir id si existe
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pendiente",
      });
    }
  }, [task]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      // CORREGIDO: Verificar correctamente si es edición o creación
      if (form.id) {
        // Actualizar tarea existente
        await api.put(`/tasks/${form.id}`, {
          title: form.title,
          description: form.description,
          status: form.status
        });
        alert("✅ Tarea actualizada exitosamente");
      } else {
        // Crear nueva tarea (sin enviar id)
        await api.post("/tasks", {
          title: form.title,
          description: form.description,
          status: form.status
        });
        alert("✅ Tarea creada exitosamente");
      }
      onClose(); // Cierra el formulario y recarga tabla
    } catch (err) {
      console.error("Error al guardar:", err);
      alert(`❌ Error al guardar la tarea: ${err.response?.data?.message || err.message}`);
    }
  }

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5>{form.id ? "✏️ Editar tarea" : "➕ Nueva tarea"}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input
              type="text"
              className="form-control"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Ingresa el título de la tarea"
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
              rows="3"
              placeholder="Describe la tarea"
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Estado</label>
            <select
              className="form-select"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>
          
          <button className="btn btn-success me-2" type="submit">
            💾 Guardar
          </button>
          <button 
            className="btn btn-secondary" 
            type="button" 
            onClick={onClose}
          >
            ❌ Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}