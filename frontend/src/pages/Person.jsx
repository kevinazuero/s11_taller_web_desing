import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonForm from "../components/person/Form";
import PersonTable from "../components/person/Table";
import api, { setAuthToken } from "../services/api";

export default function PersonsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [reload, setReload] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); 
      return;
    }

    setAuthToken(token);
    api.get("/auth/me")
      .then(() => {})
      .catch(() => navigate("/")); 
  }, [navigate]);

  function handleAddNew() {
    setEditingPerson({
      dni: "",
      name: "",
      lastname: "",
      birthday: "",
      ciudad: "",
      genero: "",
    });
    setShowForm(true);
  }

  function handleEdit(person) {
    setEditingPerson(person);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingPerson(null);
    setReload((prev) => prev + 1);
  }

  function handleDelete() {
    setReload((prev) => prev + 1);
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">👤 Gestión de Personas</h2>

      {!showForm && (
        <button className="btn btn-primary mb-3" onClick={handleAddNew}>
          ➕ Nueva Persona
        </button>
      )}

      {showForm ? (
        <PersonForm person={editingPerson} onClose={handleCloseForm} />
      ) : (
        <PersonTable key={reload} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
