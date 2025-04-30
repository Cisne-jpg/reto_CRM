'use client';

import { useState, useEffect } from "react";
import { PieChartTareas, PieDataItem, buildPieData } from "../Components/piechartUtils";

const BASE_URL = 'https://api-crm-livid.vercel.app';

type Task = {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  fecha_limite: string;
  prioridad: string;
  owner_id: number;
};

type ColumnKey = "column-1" | "column-2" | "column-3" | "column-4";

type Column = {
  id: ColumnKey;
  title: string;
  taskIds: string[];
};

const estadoForColumn: Record<ColumnKey, string> = {
  "column-1": "Revision",
  "column-2": "En contacto",
  "column-3": "Toques finales",
  "column-4": "Esperando Confirmación",
};

type Toast = {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
};

export default function Negocios() {
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [columns, setColumns] = useState<Record<ColumnKey, Column>>({
    "column-1": { id: "column-1", title: "Revisión", taskIds: [] },
    "column-2": { id: "column-2", title: "En contacto", taskIds: [] },
    "column-3": { id: "column-3", title: "Toques finales", taskIds: [] },
    "column-4": { id: "column-4", title: "Confirmación", taskIds: [] },
  });
  const [pieData, setPieData] = useState<PieDataItem[]>([]);
  const [newTaskContent, setNewTaskContent] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<ColumnKey>("column-1");
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<Toast>({ message: '', type: 'success', visible: false });
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error'): void => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  useEffect(() => {
    const storedId = localStorage.getItem("ownerId");
    if (storedId) setOwnerId(Number(storedId));
  }, []);

  const mapEstadoToColumn = (estado: string): ColumnKey => {
    const clean = estado.trim().toLowerCase();
    const found = (Object.entries(estadoForColumn) as [ColumnKey, string][]) 
      .find(([, est]) => est.toLowerCase() === clean)?.[0];
    return found ?? "column-1";
  };

  const fetchKanbanItems = async (): Promise<void> => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/kanban/${ownerId}`);
      const data: Task[] = await res.json();
      const tasksMap: Record<string, Task> = {};
      const newCols: Record<ColumnKey, Column> = {
        "column-1": { id: "column-1", title: "Revisión", taskIds: [] },
        "column-2": { id: "column-2", title: "En contacto", taskIds: [] },
        "column-3": { id: "column-3", title: "Toques finales", taskIds: [] },
        "column-4": { id: "column-4", title: "Confirmación", taskIds: [] },
      };
      data.forEach((task: Task) => {
        const key = `task-${task.id}`;
        tasksMap[key] = task;
        const col = mapEstadoToColumn(task.estado);
        newCols[col].taskIds.push(key);
      });
      setTasks(tasksMap);
      setColumns(newCols);
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPie = async (): Promise<void> => {
    if (!ownerId) return;
    try {
      const data = await buildPieData(
        ["Revision", "En contacto", "Toques finales", "Esperando Confirmación"],
        `${BASE_URL}/kanban/${ownerId}`
      );
      setPieData(data);
    } catch (error: unknown) {
      console.error("Error fetching pie data:", error);
      showToast('Error al cargar gráfico', 'error');
    }
  };

  useEffect(() => {
    if (ownerId !== null) {
      fetchKanbanItems();
      fetchPie();
    }
  }, [ownerId]);

  const handleAddTask = async (): Promise<void> => {
    if (!newTaskContent.trim() || ownerId === null) return;
    try {
      const taskPayload = {
        titulo: newTaskContent,
        descripcion: "",
        estado: estadoForColumn[selectedColumn],
        fecha_limite: new Date().toISOString().split('T')[0],
        prioridad: "media",
        owner_id: ownerId,
      };
      const res = await fetch(`${BASE_URL}/kanban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload),
      });
      if (!res.ok) {
        const errData: { message?: string } = await res.json();
        throw new Error(errData.message ?? 'Error al crear tarea');
      }
      await fetchKanbanItems();
      await fetchPie();
      setNewTaskContent("");
      showToast('Tarea creada exitosamente 🎉', 'success');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.error("Error creating task:", error);
      showToast(message, 'error');
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!taskToDelete) return;
    try {
      const id = tasks[taskToDelete].id;
      const res = await fetch(`${BASE_URL}/kanban/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar tarea');
      await fetchKanbanItems();
      await fetchPie();
      showToast('Tarea eliminada correctamente 🗑️', 'success');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al eliminar la tarea';
      console.error("Error deleting task:", error);
      showToast(message, 'error');
    } finally {
      setTaskToDelete(null);
    }
  };

  const handleMove = async (key: string, current: ColumnKey, dir: 'forward' | 'backward'): Promise<void> => {
    const order: ColumnKey[] = ['column-1', 'column-2', 'column-3', 'column-4'];
    const idx = order.indexOf(current);
    const ni = dir === 'forward' ? idx + 1 : idx - 1;
    if (ni < 0 || ni >= order.length) return;
    const newCol = order[ni];
    const task = tasks[key];
    const newEst = estadoForColumn[newCol];
    setColumns(prev => ({
      ...prev,
      [current]: { ...prev[current], taskIds: prev[current].taskIds.filter(i => i !== key) },
      [newCol]: { ...prev[newCol], taskIds: [...prev[newCol].taskIds, key] },
    }));
    try {
      const res = await fetch(`${BASE_URL}/kanban/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newEst }),
      });
      if (!res.ok) throw new Error('Error actualizando estado');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al mover tarea. Recuperando datos...';
      console.error("Error moving task:", error);
      showToast(message, 'error');
      await fetchKanbanItems();
      await fetchPie();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 relative">
      {/* Modal de confirmación */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">¿Eliminar tarea?</h3>
            <p className="text-gray-600 mb-6">La tarea se eliminará permanentemente</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificaciones tipo Toast */}
      <div className={`fixed top-4 right-4 z-50 transition-opacity duration-300 ${toast.visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`${toast.type === 'success' ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'} 
          p-4 rounded-lg border-l-4 shadow-lg flex items-center gap-3 min-w-[300px]`}>
          {toast.type === 'success' ? (
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <span className={`${toast.type === 'success' ? 'text-green-700' : 'text-red-700'} font-medium`}>
            {toast.message}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🚀 Tablero de Negociaciones
        </h1>

        {/* Formulario de nueva tarea */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Ingrese nueva tarea"
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
            </div>
            <div className="w-full md:w-auto">
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value as ColumnKey)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="column-1">Revisión</option>
                <option value="column-2">En contacto</option>
                <option value="column-3">Toques finales</option>
                <option value="column-4">Confirmación</option>
              </select>
            </div>
            <button
              onClick={handleAddTask}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Tarea
            </button>
          </div>
        </div>

        {/* Tablero Kanban */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando tareas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.values(columns).map((column) => (
              <div 
                key={column.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
                  <h2 className="text-lg font-semibold text-white">
                    {column.title} <span className="text-blue-100">({column.taskIds.length})</span>
                  </h2>
                </div>
                <div className="p-4 space-y-3 min-h-[400px]">
                  {column.taskIds.map((taskKey) => {
                    const task = tasks[taskKey];
                    if (!task) return null;

                    return (
                      <div 
                        key={taskKey}
                        className="group relative bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">{task.titulo}</h3>
                            {task.descripcion && (
                              <p className="text-sm text-gray-600 mt-2">{task.descripcion}</p>
                            )}
                          </div>
                          <button
                            onClick={() => setTaskToDelete(taskKey)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Eliminar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleMove(taskKey, column.id as ColumnKey, "backward")}
                              disabled={column.id === "column-1"}
                              className={`px-3 py-1 rounded-md text-sm ${
                                column.id === "column-1" 
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                              }`}
                              title="Mover atrás"
                            >
                              ←
                            </button>
                            <button
                              onClick={() => handleMove(taskKey, column.id as ColumnKey, "forward")}
                              disabled={column.id === "column-4"}
                              className={`px-3 py-1 rounded-md text-sm ${
                                column.id === "column-4" 
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                              }`}
                              title="Mover adelante"
                            >
                              →
                            </button>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(task.fecha_limite).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              timeZone: 'UTC'
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* División para el gráfico de pastel */}
      <div className="mt-25  justify-center bg-white p-6 rounded  h-[500px]">
  <PieChartTareas pieData={pieData} />
</div>

    </div>
  );
}