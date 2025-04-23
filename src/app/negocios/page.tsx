"use client";

import { useState, useEffect } from "react";

type Task = {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  fecha_limite: string;
  prioridad: string;
  owner_id: number;
};

type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

// Mapeo para convertir la columna del front en el "estado" que se envía al backend
const estadoForColumn: { [key: string]: string } = {
  "column-1": "Revision",
  "column-2": "En contacto",
  "column-3": "Toques finales",
  "column-4": "Esperando Confirmación",
};

export default function Negocios() {
  const [tasks, setTasks] = useState<{ [key: string]: Task }>({});
  const [columns, setColumns] = useState<{ [key: string]: Column }>({
    "column-1": { id: "column-1", title: "Revision", taskIds: [] },
    "column-2": { id: "column-2", title: "En contacto", taskIds: [] },
    "column-3": { id: "column-3", title: "Toques finales", taskIds: [] },
    "column-4": { id: "column-4", title: "Esperando Confirmación", taskIds: [] },
  });
  const [newTaskContent, setNewTaskContent] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("column-1");
  const [ownerId, setOwnerId] = useState<number | null>(null);

  // Recupera el owner_id del usuario autenticado (asumimos que se guardó en localStorage)
  useEffect(() => {
    const storedOwnerId = localStorage.getItem("ownerId");
    if (storedOwnerId) {
      setOwnerId(parseInt(storedOwnerId, 10));
      console.log("ownerId cargado:", parseInt(storedOwnerId, 10));
    } else {
      console.warn("No se encontró ownerId en localStorage");
    }
  }, []);
  
  

  // Función para obtener las tareas del backend para el owner actual
  const fetchKanbanItems = async () => {
    if (!ownerId) return;
    try {
      const res = await fetch(`http://localhost:3000/kanban/${ownerId}`);
      if (!res.ok) {
        throw new Error("Error al obtener las tareas");
      }
      const data: Task[] = await res.json();
      // Transformar el arreglo de tareas en un mapa y reconstruir las columnas basado en el estado
      const tasksMap: { [key: string]: Task } = {};
      const newColumns: { [key: string]: Column } = {
        "column-1": { id: "column-1", title: "Revision", taskIds: [] },
        "column-2": { id: "column-2", title: "En contacto", taskIds: [] },
        "column-3": { id: "column-3", title: "Toques finales", taskIds: [] },
        "column-4": { id: "column-4", title: "Esperando Confirmación", taskIds: [] },
      };

      data.forEach((task) => {
        const taskKey = "task-" + task.id;
        tasksMap[taskKey] = task;
        // Determina a qué columna pertenece la tarea según su estado
        const columnId = Object.entries(estadoForColumn).find(
          ([colId, estado]) => estado === task.estado
        )?.[0];

        if (columnId) {
          newColumns[columnId].taskIds.push(taskKey);
        }
      });

      setTasks(tasksMap);
      setColumns(newColumns);
    } catch (error) {
      console.error("fetchKanbanItems:", error);
    }
  };

  useEffect(() => {
    if (ownerId) {
      fetchKanbanItems();
    }
  }, [ownerId]);

  // Función para agregar una nueva tarea, haciendo POST al backend
  const addTask = async () => {
    if (!newTaskContent.trim() || !ownerId) return;
    try {
      const response = await fetch("http://localhost:3000/kanban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: newTaskContent,
          descripcion: "", // Puedes ampliar esto
          estado: estadoForColumn[selectedColumn],
          fecha_limite: "2025-04-15", // Fija una fecha o toma de un input
          prioridad: "media", // Valor por defecto
          owner_id: ownerId,
        }),
      });
      if (!response.ok) {
        throw new Error("Error al agregar la tarea");
      }
      // Refrescar las tareas del backend
      await fetchKanbanItems();
      setNewTaskContent("");
    } catch (error) {
      console.error("addTask:", error);
    }
  };

  // Función para eliminar una tarea usando el endpoint DELETE
  const deleteTask = async (taskKey: string) => {
    const task = tasks[taskKey];
    try {
      const response = await fetch(`http://localhost:3000/kanban/${task.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la tarea");
      }
      // Refrescar las tareas
      await fetchKanbanItems();
    } catch (error) {
      console.error("deleteTask:", error);
    }
  };

  // Función para mover una tarea localmente (sin persistencia en backend)
  const moveTask = (
    taskKey: string,
    fromColumnId: string,
    direction: "forward" | "backward"
  ) => {
    const columnOrder = ["column-1", "column-2", "column-3", "column-4"];
    const currentIndex = columnOrder.indexOf(fromColumnId);
    let newIndex = currentIndex;
    if (direction === "forward" && currentIndex < columnOrder.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === "backward" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }
    if (newIndex === currentIndex) return;

    const toColumnId = columnOrder[newIndex];

    // Actualiza las columnas localmente
    setColumns((prev) => {
      const newFromTaskIds = prev[fromColumnId].taskIds.filter((id) => id !== taskKey);
      const newToTaskIds = [...prev[toColumnId].taskIds, taskKey];
      return {
        ...prev,
        [fromColumnId]: { ...prev[fromColumnId], taskIds: newFromTaskIds },
        [toColumnId]: { ...prev[toColumnId], taskIds: newToTaskIds },
      };
    });
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">Negociaciones actuales</h1>

      {/* Sección para agregar una tarea nueva */}
      <div className="mb-6 flex items-center gap-4 justify-center">
        <input
          type="text"
          placeholder="Nueva tarea"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="column-1">Revision</option>
          <option value="column-2">En contacto</option>
          <option value="column-3">Toques finales</option>
          <option value="column-4">Esperando Confirmación</option>
        </select>
        <button
          onClick={addTask}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Agregar tarea
        </button>
      </div>

      {/* Renderizado de columnas Kanban */}
      <div className="flex gap-4">
        {Object.values(columns).map((column) => (
          <div key={column.id} className="flex-1 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
            <div className="space-y-2">
              {column.taskIds.map((taskKey) => {
                const task = tasks[taskKey];
                return (
                  <div key={taskKey} className="p-2 bg-blue-50 rounded border border-blue-200">
                    <p>{task.titulo}</p>
                    <div className="flex justify-between mt-2 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveTask(taskKey, column.id, "backward")}
                          className="text-blue-600 hover:underline disabled:text-gray-400"
                          disabled={column.id === "column-1"}
                        >
                          Atrás
                        </button>
                        <button
                          onClick={() => moveTask(taskKey, column.id, "forward")}
                          className="text-blue-600 hover:underline disabled:text-gray-400"
                          disabled={column.id === "column-4"}
                        >
                          Adelante
                        </button>
                      </div>
                      <button
                        onClick={() => deleteTask(taskKey)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
