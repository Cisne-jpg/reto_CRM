
export default function dashboard() {
  return (
    <div className="space-y-4">
      {/* Primera fila */}
      <div className="flex gap-4">
      <div className="bg-gray-200 p-4 flex-1 rounded shadow text-black" >
  <h2 className="font-semibold">Contactos sugeridos</h2>
  <div className="absolute top-0 left-0 relative overflow-hidden"style={{ width: '600px', height: '450px' }}>
    <iframe 
      width="300" 
      height="200" 
      style={{ transform: 'scale(1.5)', transformOrigin: 'top left' }}
      src="https://lookerstudio.google.com/embed/reporting/2a682bba-9877-4939-9dab-3b4053ea9316/page/OOeFF&reportMode=VIEW&zoom=200" 
      sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
    </iframe>
  </div>
</div>

        <div className="bg-gray-200 p-4 flex-1 rounded shadow text-black">
          <h2 className="font-semibold">Tareas pendientes</h2>
          <p>[Contenido placeholder]</p>
        </div>
      </div>

      {/* Segunda fila (grid optimizada) */}
      <div className="grid grid-cols-3 gap-4">
        {/* Primera columna */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="bg-gray-200 p-4 rounded shadow text-black">
            <h2 className="font-semibold">Vistas a tu negocio</h2>
            <p>[Contenido placeholder]</p>
          </div>
          <div className="bg-gray-200 p-4 rounded shadow text-black">
            <h2 className="font-semibold">Nuevos productos</h2>
            <p>[Contenido placeholder]</p>
          </div>
        </div>

        {/* Segunda columna (Reporte del mes) */}
        <div className="bg-gray-300 p-4 rounded-xl flex-1">
          <div className="bg-gray-200 p-4 rounded shadow text-black">
            <h2 className="font-semibold">Reporte del mes</h2>
            <p>[Contenido placeholder]</p>
          </div>
        </div>

        {/* Tercera columna */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="bg-gray-200 p-4 rounded shadow text-black">
            <h2 className="font-semibold">Día actual</h2>
            <p>[Contenido placeholder]</p>
          </div>
          <div className="bg-gray-200 p-4 rounded shadow text-black">
            <h2 className="font-semibold">Crecimiento</h2>
            <p>[Contenido placeholder]</p>
          </div>
        </div>
      </div>
    </div>
  );
}
