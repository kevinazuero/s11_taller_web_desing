import { useState, useEffect } from "react";
import api from "../../services/api";

export default function PersonForm({ person, onClose }) {
  const [form, setForm] = useState({
    dni: "",
    name: "",
    lastname: "",
    birthday: "",
    ciudad: "",
    genero: "",
  });

  const [errors, setErrors] = useState({});

  // Cargar datos si es edición
  useEffect(() => {
    if (person) {
      setForm({
        id: person.id || undefined,
        dni: person.dni || "",
        name: person.name || "",
        lastname: person.lastname || "",
        birthday: person.birthday ? person.birthday.split("T")[0] : "",
        ciudad: person.ciudad || "",
        genero: person.genero || "",
      });
    }
  }, [person]);

  // Validar DNI (solo números, 10 dígitos)
  function validateDNI(value) {
    if (!value) return "El DNI es requerido";
    if (!/^\d+$/.test(value)) return "El DNI solo debe contener números";
    if (value.length !== 10) return "El DNI debe tener exactamente 10 dígitos";
    return "";
  }

  // Validar nombre/apellido (solo letras, mínimo 2 caracteres)
  function validateName(value, fieldName) {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!value) return `${fieldName} es requerido`;
    if (!nameRegex.test(value)) return `${fieldName} solo debe contener letras`;
    if (value.trim().length < 2) return `${fieldName} debe tener al menos 2 caracteres`;
    return "";
  }

  // Validar ciudad (solo letras)
  function validateCiudad(value) {
    const ciudadRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!value) return "La ciudad es requerida";
    if (!ciudadRegex.test(value)) return "La ciudad solo debe contener letras";
    return "";
  }

  // Manejar cambio de DNI (solo permite números)
  function handleDNIChange(e) {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setForm({ ...form, dni: value });
      setErrors({ ...errors, dni: validateDNI(value) });
    }
  }

  // Manejar cambio de nombre (solo permite letras)
  function handleNameChange(e) {
    const value = e.target.value;
    if (value === "" || /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
      setForm({ ...form, name: value });
      setErrors({ ...errors, name: validateName(value, "El nombre") });
    }
  }

  // Manejar cambio de apellido (solo permite letras)
  function handleLastnameChange(e) {
    const value = e.target.value;
    if (value === "" || /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
      setForm({ ...form, lastname: value });
      setErrors({ ...errors, lastname: validateName(value, "El apellido") });
    }
  }

  // Manejar cambio de ciudad (solo permite letras)
  function handleCiudadChange(e) {
    const value = e.target.value;
    if (value === "" || /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
      setForm({ ...form, ciudad: value });
      setErrors({ ...errors, ciudad: validateCiudad(value) });
    }
  }

  // Validar formulario completo antes de enviar
  function validateForm() {
    const newErrors = {
      dni: validateDNI(form.dni),
      name: validateName(form.name, "El nombre"),
      lastname: validateName(form.lastname, "El apellido"),
      ciudad: validateCiudad(form.ciudad),
      birthday: !form.birthday ? "La fecha de nacimiento es requerida" : "",
      genero: !form.genero ? "El género es requerido" : "",
    };

    setErrors(newErrors);

    // Retornar true si no hay errores
    return !Object.values(newErrors).some(error => error !== "");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validar antes de enviar
    if (!validateForm()) {
      alert("⚠️ Por favor corrige los errores en el formulario");
      return;
    }

    try {
      if (form.id) {
        await api.put(`/persons/${form.id}`, {
          dni: form.dni,
          name: form.name,
          lastname: form.lastname,
          birthday: form.birthday,
          ciudad: form.ciudad,
          genero: form.genero,
        });
        alert("✅ Persona actualizada exitosamente");
      } else {
        await api.post("/persons", {
          dni: form.dni,
          name: form.name,
          lastname: form.lastname,
          birthday: form.birthday,
          ciudad: form.ciudad,
          genero: form.genero,
        });
        alert("✅ Persona registrada exitosamente");
      }

      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert(`❌ Error al guardar la persona: ${err.response?.data?.message || err.message}`);
    }
  }

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5>{form.id ? "✏️ Editar Persona" : "➕ Nueva Persona"}</h5>
        <form onSubmit={handleSubmit} noValidate>
          {/* DNI */}
          <div className="mb-3">
            <label className="form-label">DNI</label>
            <input
              type="text"
              className={`form-control ${errors.dni ? "is-invalid" : form.dni && !errors.dni ? "is-valid" : ""}`}
              value={form.dni}
              onChange={handleDNIChange}
              maxLength="10"
              placeholder="min 10 dígitos"
            />
            {errors.dni && <div className="invalid-feedback">{errors.dni}</div>}
            {!errors.dni && form.dni && <div className="valid-feedback">✓ DNI válido</div>}
          </div>

          {/* Nombre */}
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : form.name && !errors.name ? "is-valid" : ""}`}
              value={form.name}
              onChange={handleNameChange}
              placeholder="Ej: Juan Carlos "
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            {!errors.name && form.name && <div className="valid-feedback">✓ Nombre válido</div>}
          </div>

          {/* Apellido */}
          <div className="mb-3">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              className={`form-control ${errors.lastname ? "is-invalid" : form.lastname && !errors.lastname ? "is-valid" : ""}`}
              value={form.lastname}
              onChange={handleLastnameChange}
              placeholder="Ej: Pérez García "
            />
            {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
            {!errors.lastname && form.lastname && <div className="valid-feedback">✓ Apellido válido</div>}
          </div>

          {/* Fecha de Nacimiento */}
          <div className="mb-3">
            <label className="form-label">Fecha de Nacimiento</label>
            <input
              type="date"
              className={`form-control ${errors.birthday ? "is-invalid" : form.birthday ? "is-valid" : ""}`}
              value={form.birthday}
              onChange={e => {
                setForm({ ...form, birthday: e.target.value });
                setErrors({ ...errors, birthday: "" });
              }}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.birthday && <div className="invalid-feedback">{errors.birthday}</div>}
          </div>

          {/* Ciudad */}
          <div className="mb-3">
            <label className="form-label">Ciudad</label>
            <input
              type="text"
              className={`form-control ${errors.ciudad ? "is-invalid" : form.ciudad && !errors.ciudad ? "is-valid" : ""}`}
              value={form.ciudad}
              onChange={handleCiudadChange}
              placeholder="Ej: Quito"
            />
            {errors.ciudad && <div className="invalid-feedback">{errors.ciudad}</div>}
            {!errors.ciudad && form.ciudad && <div className="valid-feedback">✓ Ciudad válida</div>}
          </div>

          {/* Género */}
          <div className="mb-3">
            <label className="form-label">Género *</label>
            <select
              className={`form-select ${errors.genero ? "is-invalid" : form.genero ? "is-valid" : ""}`}
              value={form.genero}
              onChange={e => {
                setForm({ ...form, genero: e.target.value });
                setErrors({ ...errors, genero: "" });
              }}
            >
              <option value="">Selecciona una opción</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
            {errors.genero && <div className="invalid-feedback">{errors.genero}</div>}
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