"use client";

import { useState } from "react";

type Task = {
  id: string;
  content: string;
};

type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

const initialTasks: { [key: string]: Task } = {}; // Inicialmente vacío

const initialColumns: { [key: string]: Column } = {
  "column-1": { id: "column-1", title: "Revision", taskIds: [] },
  "column-2": { id: "column-2", title: "En contacto", taskIds: [] },
  "column-3": { id: "column-3", title: "Toques finales", taskIds: [] },
  "column-4": { id: "column-4", title: "Esperando Confirmación", taskIds: [] },
};

export default function negocios() {
  const [tasks, setTasks] = useState<{ [key: string]: Task }>(initialTasks);
  const [columns, setColumns] = useState<{ [key: string]: Column }>(initialColumns);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("column-1");

  // Agregar una tarea nueva a la columna seleccionada
  const addTask = () => {
    if (!newTaskContent.trim()) return;
    const id = "task-" + Date.now();
    const newTask: Task = { id, content: newTaskContent };
    setTasks((prev) => ({ ...prev, [id]: newTask }));
    setColumns((prev) => {
      const column = prev[selectedColumn];
      return {
        ...prev,
        [selectedColumn]: { ...column, taskIds: [...column.taskIds, id] },
      };
    });
    setNewTaskContent("");
  };

  // Mover una tarea en dirección "forward" o "backward"
  const moveTask = (
    taskId: string,
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
    if (newIndex === currentIndex) return; // No se puede mover fuera de límites

    const toColumnId = columnOrder[newIndex];
    setColumns((prev) => {
      const newFromTaskIds = prev[fromColumnId].taskIds.filter((id) => id !== taskId);
      const newToTaskIds = [...prev[toColumnId].taskIds, taskId];
      return {
        ...prev,
        [fromColumnId]: { ...prev[fromColumnId], taskIds: newFromTaskIds },
        [toColumnId]: { ...prev[toColumnId], taskIds: newToTaskIds },
      };
    });
  };

  // Función para eliminar una tarea
  const deleteTask = (taskId: string, fromColumnId: string) => {
    setColumns((prev) => {
      const newTaskIds = prev[fromColumnId].taskIds.filter((id) => id !== taskId);
      return {
        ...prev,
        [fromColumnId]: { ...prev[fromColumnId], taskIds: newTaskIds },
      };
    });
    setTasks((prev) => {
      const newTasks = { ...prev };
      delete newTasks[taskId];
      return newTasks;
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
              {column.taskIds.map((taskId) => {
                const task = tasks[taskId];
                return (
                  <div
                    key={task.id}
                    className="p-2 bg-blue-50 rounded border border-blue-200"
                  >
                    <p>{task.content}</p>
                    <div className="flex justify-between mt-2 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveTask(task.id, column.id, "backward")}
                          className="text-blue-600 hover:underline disabled:text-gray-400"
                          disabled={column.id === "column-1"}
                        >
                          Atrás
                        </button>
                        <button
                          onClick={() => moveTask(task.id, column.id, "forward")}
                          className="text-blue-600 hover:underline disabled:text-gray-400"
                          disabled={column.id === "column-4"}
                        >
                          Adelante
                        </button>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id, column.id)}
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