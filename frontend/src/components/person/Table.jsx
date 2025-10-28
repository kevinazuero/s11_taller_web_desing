import { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import api from "../../services/api";

export default function PersonTable({ onEdit, onDelete }) {
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    let isMounted = true; // Para evitar actualizaciones si el componente se desmonta

    async function loadData() { 
      try {
        const res = await api.get("/persons");
        const data = res.data;

        if (!isMounted) return;

        // Destruir instancia anterior si existe
        if (dataTableRef.current) {
          dataTableRef.current.destroy();
          dataTableRef.current = null;
        }

        // Limpiar tabla HTML antes de reinicializar
        if (tableRef.current) {
          $(tableRef.current).empty();
        }

        // Crear nueva instancia de DataTable
        dataTableRef.current = $(tableRef.current).DataTable({
          data,
          columns: [
            { data: "dni", title: "DNI" },
            { data: "name", title: "Nombre" },
            { data: "lastname", title: "Apellido" },
            { 
              data: "birthday", 
              title: "Fecha de Nacimiento",
              render: (date) => {
                if (!date) return "";
                const d = new Date(date);
                return d.toLocaleDateString("es-ES");
              }
            },
            { data: "ciudad", title: "Ciudad" },
            { data: "genero", title: "Género" },
            {
              data: null,
              title: "Acciones",
              orderable: false,
              className: "text-center",
              render: (row) => `
                <button class='btn btn-warning btn-sm edit-btn me-1' data-id='${row.id}'>
                  ✏️ Editar
                </button>
                <button class='btn btn-danger btn-sm delete-btn' data-id='${row.id}'>
                  🗑 Eliminar
                </button>
              `,
            },
          ],
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
          },
          pageLength: 10,
          responsive: true
        });

        // --- Event delegation para botones ---
        $(tableRef.current).off("click", ".edit-btn");
        $(tableRef.current).off("click", ".delete-btn");

        // Botón Editar
        $(tableRef.current).on("click", ".edit-btn", function (e) {
          e.preventDefault(); // Evitar el comportamiento por defecto del botón 
          const id = parseInt($(this).data("id"));
          const person = data.find(p => p.id === id);
          if (person && onEdit) {
            onEdit(person);
          }
        });

        // Botón Eliminar
        $(tableRef.current).on("click", ".delete-btn", async function (e) {
          e.preventDefault();
          const id = parseInt($(this).data("id"));

          if (confirm("¿Estás seguro de eliminar esta persona?")) {
            try {
              await api.delete(`/persons/${id}`);
              alert("✅ Persona eliminada exitosamente");

              if (onDelete) {
                onDelete();
              }
            } catch (err) {
              console.error("Error al eliminar:", err);
              alert("❌ Error al eliminar la persona");
            }
          }
        });

      } catch (err) {
        console.error("Error al cargar personas:", err);
        if (isMounted) {
          alert("❌ Error al cargar los datos. Verifica tu conexión.");
        }
      }
    }

    loadData();

    // Cleanup al desmontar
    return () => {
      isMounted = false;

      if (tableRef.current) {
        $(tableRef.current).off("click");
      }

      if (dataTableRef.current) {
        try {
          dataTableRef.current.destroy();
          dataTableRef.current = null;
        } catch (err) {
          console.error("Error al destruir DataTable:", err);
        }
      }
    };
  }, [onEdit, onDelete]);

  return (
    <div className="table-responsive">
      <table
        ref={tableRef}
        className="table table-striped table-bordered table-hover"
        style={{ width: "100%" }}
      >
        {/* DataTables generará thead y tbody automáticamente */}
      </table>
    </div>
  );
}
