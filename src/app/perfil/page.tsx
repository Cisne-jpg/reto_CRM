import { Card, CardContent } from "../components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Enero", ingreso: 30000 },
  { name: "Febrero", ingreso: 50000 },
  { name: "Marzo", ingreso: 90000 },
  { name: "Abril", ingreso: 70000 },
  { name: "Mayo", ingreso: 110000 },
  { name: "Junio", ingreso: 95000 },
  { name: "Julio", ingreso: 140000 },
  { name: "Agosto", ingreso: 135000 },
  { name: "Septiembre", ingreso: 130000 },
  { name: "Octubre", ingreso: 125000 },
  { name: "Noviembre", ingreso: 120000 },
  { name: "Diciembre", ingreso: 100000 },
];

const tags = [
  "Mecanica", "Automotriz", "Herramientas", "Reparaciones",
  "Motores", "Diagnostico", "Mantenimiento", "Afinacion"
];

export default function perfil() {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center space-x-4">
          <img
            src="https://via.placeholder.com/80"
            alt="Profile"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <h2 className="text-lg font-semibold">Pedro Martinez</h2>
            <p className="text-gray-500">MecaMartinez</p>
            <p className="text-gray-600">Descripción</p>
          </div>
        </div>
        
        <Card className="bg-blue-100 mt-4 p-4">
          <CardContent>
            <h3 className="text-center text-lg font-semibold mb-2">Ingreso</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ingreso" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
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