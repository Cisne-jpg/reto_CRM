'use client';

import { useState, useEffect } from "react";
import { PieChartTareas, PieDataItem, buildPieData } from "../Components/piechartUtils"; // 👈 importamos tu componente de gráfico

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

// Mapeo de columnas a estados EXACTOS soportados por la BD (sin tildes)
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
  const [pieData, setPieData] = useState<PieDataItem[]>([]); // 👈 estado para el gráfico
  const [newTaskContent, setNewTaskContent] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("column-1");
  const [ownerId, setOwnerId] = useState<number | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://api-crm-livid.vercel.app');

  useEffect(() => {
    const stored = localStorage.getItem("ownerId");
    if (stored) setOwnerId(Number(stored));
  }, []);

  const fetchKanbanItems = async () => {
    if (!ownerId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/kanban/${ownerId}`);
      if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
      const data: Task[] = await res.json();

      const tasksMap: { [key: string]: Task } = {};
      const cols: { [key: string]: Column } = {
        "column-1": { id: "column-1", title: "Revision", taskIds: [] },
        "column-2": { id: "column-2", title: "En contacto", taskIds: [] },
        "column-3": { id: "column-3", title: "Toques finales", taskIds: [] },
        "column-4": { id: "column-4", title: "Esperando Confirmación", taskIds: [] },
      };

      data.forEach((task) => {
        const key = `task-${task.id}`;
        tasksMap[key] = task;
        const col = Object.entries(estadoForColumn).find(([, est]) => est === task.estado)?.[0];
        if (col) cols[col].taskIds.push(key);
      });

      setTasks(tasksMap);
      setColumns(cols);

    } catch (err) {
      console.error("fetchKanbanItems error:", err);
    }
  };

const fetchPieData = async () => {
    if (!ownerId) return;
    try {
      const data = await buildPieData(
        ["Revision", "En contacto", "Toques finales", "Esperando Confirmación"],
        `${API_BASE_URL}/kanban/${ownerId}`
      );
      setPieData(data);
      
    } catch (err) {
      console.error("Error fetching pie data:", err);
    }
  };

  useEffect(() => {
    if (ownerId) {
      fetchKanbanItems(); 
      fetchPieData();
    }
  }, [ownerId]);

  


  const addTask = async () => {
    if (!newTaskContent.trim() || ownerId === null) return;
    try {
      const body = JSON.stringify({
        titulo: newTaskContent,
        descripcion: "",
        estado: estadoForColumn[selectedColumn],
        fecha_limite: "2025-04-15",
        prioridad: "media",
        owner_id: ownerId,
      });
      const res = await fetch(`${API_BASE_URL}/kanban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!res.ok) {
        const text = await res.text();
        console.error(`addTask failed ${res.status}:`, text);
        throw new Error(`Error al agregar la tarea: ${text}`);
      }
      setNewTaskContent("");
      await fetchKanbanItems();
      await fetchPieData();
    } catch (err) {
      console.error("addTask error:", err);
    }
  };

  const deleteTask = async (taskKey: string) => {
    const task = tasks[taskKey];
    try {
      const res = await fetch(`${API_BASE_URL}/kanban/${task.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`delete failed ${res.status}`);
      await fetchKanbanItems();
      await fetchPieData();
    } catch (err) {
      console.error("deleteTask error:", err);
    }
  };

  const updateTaskState = async (taskId: number, newEstado: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/kanban/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newEstado }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error(`updateTaskState failed ${res.status}:`, text);
        throw new Error(`Error actualizando estado: ${text}`);
      }
    } catch (err) {
      console.error("updateTaskState error:", err);
      throw err;
    }
  };

  const moveTask = async (
    taskKey: string,
    fromColumn: string,
    direction: "forward" | "backward"
  ) => {
    const order = ["column-1", "column-2", "column-3", "column-4"];
    const idx = order.indexOf(fromColumn);
    const nxt = direction === "forward" ? idx + 1 : idx - 1;
    if (nxt < 0 || nxt >= order.length) return;

    const toCol = order[nxt];
    const task = tasks[taskKey];
    const newEstado = estadoForColumn[toCol];

    setColumns((prev) => {
      const fromIds = prev[fromColumn].taskIds.filter((id) => id !== taskKey);
      const toIds = [...prev[toCol].taskIds, taskKey];
      return {
        ...prev,
        [fromColumn]: { ...prev[fromColumn], taskIds: fromIds },
        [toCol]: { ...prev[toCol], taskIds: toIds },
      };
    });

    try {
      await updateTaskState(task.id, newEstado);
      await fetchKanbanItems();
      await fetchPieData();
    } catch {
      await fetchKanbanItems();
      await fetchPieData();
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">Negociaciones actuales</h1>

      {/* Sección para agregar tareas */}
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

      {/* División de columnas */}
      <div className="flex gap-4">
        {Object.values(columns).map((col) => (
          <div key={col.id} className="flex-1 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">{col.title}</h2>
            <div className="space-y-2">
              {col.taskIds.map((tk) => {
                const task = tasks[tk];
                return (
                  <div key={tk} className="p-2 bg-blue-50 rounded border border-blue-200">
                    <p>{task.titulo}</p>
                    <div className="flex justify-between mt-2 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => void moveTask(tk, col.id, "backward")}
                          disabled={col.id === "column-1"}
                          className="text-blue-600 hover:underline disabled:text-gray-400"
                        >
                          Atrás
                        </button>
                        <button
                          onClick={() => void moveTask(tk, col.id, "forward")}
                          disabled={col.id === "column-4"}
                          className="text-blue-600 hover:underline disabled:text-gray-400"
                        >
                          Adelante
                        </button>
                      </div>
                      <button
                        onClick={() => deleteTask(tk)}
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

      {/* División para el gráfico de pastel */}
      <div className="mt-25  justify-center bg-white p-6 rounded  h-[500px]">
  <PieChartTareas pieData={pieData} />
</div>

    </div>
  );
}
