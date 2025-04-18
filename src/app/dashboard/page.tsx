import { Card, CardContent } from "@/components/ui/card";


export default function ProfileDashboard() {
  return (
    <div className="space-y-4 p-4">
      {/* Primera fila */}
      <div className="flex gap-4">
        <Card className="flex-1 relative">
          <CardContent>
            <h2 className="font-semibold mb-2">Contactos sugeridos</h2>
            <div className="absolute top-0 left-0 relative overflow-hidden" style={{ width: '600px', height: '450px' }}>
              <iframe
                width="400"
                height="200"
                style={{ transform: 'scale(1.5)', transformOrigin: 'top left' }}
                src="https://lookerstudio.google.com/embed/reporting/2a682bba-9877-4939-9dab-3b4053ea9316/page/OOeFF&reportMode=VIEW&zoom=200"
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
              </iframe>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent>
            <h2 className="font-semibold">Tareas pendientes</h2>
            <p>[Contenido placeholder]</p>
          </CardContent>
        </Card>
      </div>

      {/* Segunda fila (grid optimizada) */}
      <div className="grid grid-cols-3 gap-4">
        {/* Primera columna */}
        <div className="flex flex-col gap-4 flex-1">
          <Card>
            <CardContent>
              <h2 className="font-semibold">Vistas a tu negocio</h2>
              <p>[Contenido placeholder]</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-semibold">Nuevos productos</h2>
              <p>[Contenido placeholder]</p>
            </CardContent>
          </Card>
        </div>

        {/* Segunda columna (Reporte del mes) */}
        <div className="flex-1">
          <Card>
            <CardContent>
              <h2 className="font-semibold">Reporte del mes</h2>
              <p>[Contenido placeholder]</p>
            </CardContent>
          </Card>
        </div>

        {/* Tercera columna */}
        <div className="flex flex-col gap-4 flex-1">
          <Card>
            <CardContent>
              <h2 className="font-semibold">Día actual</h2>
              <p>[Contenido placeholder]</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-semibold">Crecimiento</h2>
              <p>[Contenido placeholder]</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
