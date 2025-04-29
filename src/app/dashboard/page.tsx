import { Card, CardContent } from "@/components/ui/card";
import PieChartCard from "./PieChartCard"; // Asegúrate de que la ruta sea correcta

const tags = [
  "Mecanica", "Automotriz", "Herramientas", "Reparaciones",
  "Motores", "Diagnostico", "Mantenimiento", "Afinacion"
];

export default function ProfileDashboard() {
  return (
    <div className="space-y-4 p-4">
      {/* Primera fila */}
      <div className="flex gap-4">
        <Card className="flex-1 relative">
          <CardContent>
            <h2 className="font-semibold mb-2">Contactos sugeridos</h2>
            <div className="absolute top-0 left-0 relative overflow-hidden" style={{ width: '400px', height: '250px' }}>
              <iframe
                width="1150"
                height="1150"
                style={{ 
                  position: 'absolute',
                  top: '-20px',
                  left: '-70px',
                }}
                src="https://lookerstudio.google.com/embed/reporting/1098f6f8-1eea-4f4a-8bc0-a3276cee32ec/page/NcDAF"
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
              </iframe>
            </div>
          </CardContent>
        </Card>

        <PieChartCard />
      </div>

      {/* Segunda fila */}
      <div className="flex gap-4">
        <Card className="flex-1">
          <CardContent>
            <h2 className="font-semibold">Vistas a tu negocio</h2>
            <div className="absolute top-0 left-0 relative overflow-hidden" style={{ width: '400px', height: '250px' }}>
              <iframe
                width="1150"
                height="1150"
                style={{ 
                  position: 'absolute',
                  top: '-380px',
                  left: '-70px',
                }}
                src="https://lookerstudio.google.com/embed/reporting/1098f6f8-1eea-4f4a-8bc0-a3276cee32ec/page/NcDAF"
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
              </iframe>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent>
            <h2 className="font-semibold">Crecimiento</h2>
            <div className="absolute top-0 left-0 relative overflow-hidden" style={{ width: '400px', height: '250px' }}>
              <iframe
                width="1150"
                height="1150"
                style={{ 
                  position: 'absolute',
                  top: '-20px',
                  left: '-540px',
                }}
                src="https://lookerstudio.google.com/embed/reporting/1098f6f8-1eea-4f4a-8bc0-a3276cee32ec/page/NcDAF"
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
              </iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}