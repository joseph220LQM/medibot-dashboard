// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from "recharts";

// Componentes básicos si no tienes ShadCN/UI
const Card = ({ children, className }) => (
  <div className={`bg-white shadow rounded-xl p-4 ${className || ""}`}>
    {children}
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
  >
    {children}
  </button>
);

const Input = (props) => (
  <input
    {...props}
    className="border border-gray-300 rounded-lg px-3 py-2 w-40"
  />
);


const Dashboard = () => {
  const [data, setData] = useState([]);
  const [resumen, setResumen] = useState({});
  const [fecha, setFecha] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async (url) => {
    try {
      setLoading(true);
      const res = await axios.get(url);
      setData(res.data.datos || []);
      setResumen(res.data.resumen || {});
    } catch (err) {
      console.error(err);
      alert("Error obteniendo métricas");
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    let url = "https://medi-bot-back.vercel.app/api/sala/metrica";
    if (fecha) url += `?fecha=${fecha}`;
    else if (desde && hasta) url += `?desde=${desde}&hasta=${hasta}`;
    fetchData(url);
  };

  useEffect(() => {
    fetchData("https://medi-bot-back.vercel.app/api/sala/metrica");
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">📈 Dashboard de Métricas del Chatbot</h1>

      <div className="flex flex-wrap gap-3">
        <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} placeholder="Fecha específica" />
        <Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} placeholder="Desde" />
        <Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} placeholder="Hasta" />
        <Button onClick={handleBuscar} disabled={loading}>
          {loading ? "Cargando..." : "Buscar"}
        </Button>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent><h2 className="text-lg font-semibold">Total Consultas</h2><p>{resumen.total_consultas || 0}</p></CardContent></Card>
        <Card><CardContent><h2 className="text-lg font-semibold">Promedio Respuesta (ms)</h2><p>{Math.round(resumen.promedio_respuesta_ms || 0)}</p></CardContent></Card>
        <Card><CardContent><h2 className="text-lg font-semibold">Satisfacción Promedio</h2><p>{resumen.porcentaje_satisfaccion?.toFixed(2) || 0} ⭐</p></CardContent></Card>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-3">Consultas por Fecha</h2>
            <BarChart width={400} height={250} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_consultas" fill="#8884d8" name="Consultas" />
            </BarChart>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-3">Promedio de Respuesta</h2>
            <LineChart width={400} height={250} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="promedio_respuesta_ms" stroke="#82ca9d" name="Tiempo de Respuesta (ms)" />
            </LineChart>
          </CardContent>
        </Card>
      </div>

      {/* Feedback de usuarios */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">💬 Comentarios de Usuarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.flatMap((d) =>
            d.feedback_usuarios
              ?.filter((f) => f)
              .map((f, idx) => (
                <Card key={idx} className="p-3">
                  <CardContent>{f}</CardContent>
                </Card>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

