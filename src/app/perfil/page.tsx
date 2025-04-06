import { Card, CardContent } from "@/components/ui/card";

const tags = [
  "Mecanica", "Automotriz", "Herramientas", "Reparaciones",
  "Motores", "Diagnostico", "Mantenimiento", "Afinacion"
];

export default function ProfileDashboard() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full border bg-gray-300 flex items-center justify-center text-gray-600">
          Placeholder
        </div>
        <div>
          <h2 className="text-lg font-semibold">Pedro Martinez</h2>
          <p className="text-gray-500">MecaMartinez</p>
          <p className="text-gray-600">Descripción</p>
        </div>
      </div>
      
      <Card className="bg-blue-100 mt-4 p-4 h-52 flex items-center justify-center text-gray-600">
        Placeholder Gráfica
      </Card>
      
      <Card className="bg-blue-100 mt-4 p-4">
        <h3 className="text-lg font-semibold">Etiquetas identificadoras</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <span key={tag} className="bg-white px-3 py-1 rounded-lg shadow-sm text-sm">{tag}</span>
          ))}
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h3 className="text-lg font-semibold">Publicaciones</h3>
        <p className="text-gray-600">Descripción</p>
      </Card>
    </div>
  );
}
