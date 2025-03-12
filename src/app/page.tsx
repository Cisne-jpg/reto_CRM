export default function HomePage() {
  return (
    <div className="space-y-4">
      {/* Primera fila */}
      <div className="flex gap-4">
        <div className="bg-gray-200 p-4 flex-1 rounded shadow text-black">
          <h2 className="font-semibold">Contactos sugeridos</h2>
          <p>[Contenido placeholder]</p>
        </div>
        <div className="bg-gray-200 p-4 flex-1 rounded shadow text-black">
          <h2 className="font-semibold">Tareas pendientes</h2>
          <p>[Contenido placeholder]</p>
        </div>
      </div>

      {/* Segunda fila (grid) */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-200 p-4 rounded shadow text-black">
          <h2 className="font-semibold">Vistas a tu negocio</h2>
          <p>[Contenido placeholder]</p>
        </div>
        <div className="bg-gray-200 p-4 rounded shadow text-black">
          <h2 className="font-semibold">Reporte del mes</h2>
          <p>[Contenido placeholder]</p>
        </div>
        <div className="bg-gray-200 p-4 rounded shadow text-black">
          <h2 className="font-semibold">Día actual</h2>
          <p>[Contenido placeholder]</p>
        </div>
        <div className="bg-gray-200 p-4 rounded shadow text-black">
          <h2 className="font-semibold">Nuevos productos</h2>
          <p>[Contenido placeholder]</p>
        </div>
        <div className="bg-gray-200 p-4 rounded shadow text-black">
          <h2 className="font-semibold">Crecimiento</h2>
          <p>[Contenido placeholder]</p>
        </div>
        <div className="bg-gray-200 p-4 rounded shadow text-black">
          <h2 className="font-semibold">Otro bloque</h2>
          <p>[Contenido placeholder]</p>
        </div>
      </div>
    </div>
  );
}
