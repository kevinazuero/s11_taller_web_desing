import { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import api from "../../services/api";

export default function TaskTable({ onEdit, onDelete }) {
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await api.get("/tasks");
        const data = res.data;

        if (!isMounted) return;

        // Destruir instancia anterior si existe
        if (dataTableRef.current) {
          dataTableRef.current.destroy();
          dataTableRef.current = null;
        }

        // Limpiar la tabla HTML antes de reinicializar
        if (tableRef.current) {
          $(tableRef.current).empty();
        }

        // Crear nueva instancia de DataTable
        dataTableRef.current = $(tableRef.current).DataTable({
          data,
          columns: [
            { data: "title", title: "Título" },
            { data: "description", title: "Descripción" },
            { 
              data: "status", 
              title: "Estado",
              render: (status) => {
                const badges = {
                  'pendiente': '<span class="badge bg-warning">Pendiente</span>',
                  'en progreso': '<span class="badge bg-info">En progreso</span>',
                  'completada': '<span class="badge bg-success">Completada</span>'
                };
                return badges[status] || status;
              }
            },
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
            url: "//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
          },
          pageLength: 10,
          responsive: true
        });

        // Event delegation para los botones
        $(tableRef.current).off("click", ".edit-btn");
        $(tableRef.current).off("click", ".delete-btn");

        // Botón Editar
        $(tableRef.current).on("click", ".edit-btn", function (e) {
          e.preventDefault();
          const id = parseInt($(this).data("id"));
          const task = data.find(t => t.id === id);
          if (task && onEdit) {
            onEdit(task);
          }
        });

        // Botón Eliminar
        $(tableRef.current).on("click", ".delete-btn", async function (e) {
          e.preventDefault();
          const id = parseInt($(this).data("id"));
          
          if (confirm("¿Estás seguro de eliminar esta tarea?")) {
            try {
              await api.delete(`/tasks/${id}`);
              alert("✅ Tarea eliminada exitosamente");
              
              if (onDelete) {
                onDelete();
              }
            } catch (err) {
              console.error("Error al eliminar:", err);
              alert("❌ Error al eliminar la tarea");
            }
          }
        });

      } catch (err) {
        console.error("Error al cargar tareas:", err);
        if (isMounted) {
          alert("❌ Error al cargar las tareas. Verifica tu conexión.");
        }
      }
    }

    loadData();

    // Cleanup al desmontar
    return () => {
      isMounted = false;
      
      // Remover event listeners
      if (tableRef.current) {
        $(tableRef.current).off("click");
      }
      
      // Destruir DataTable
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
        {/* DataTables creará thead y tbody automáticamente */}
      </table>
    </div>
  );
}