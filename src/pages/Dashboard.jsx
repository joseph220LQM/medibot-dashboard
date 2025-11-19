import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, Legend
} from "recharts";

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
  const [activeTab, setActiveTab] = useState("metricas");

  // -------------------------- MÉTRICAS ---------------------------
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

  useEffect(() => {
    fetchData("https://medi-bot-back.vercel.app/api/sala/metrica");
  }, []);

  const handleBuscar = () => {
    let url = "https://medi-bot-back.vercel.app/api/sala/metrica";
    if (fecha) url += `?fecha=${fecha}`;
    else if (desde && hasta) url += `?desde=${desde}&hasta=${hasta}`;
    fetchData(url);
  };

  // -------------------------- SESIONES ---------------------------
  const [sesiones, setSesiones] = useState([]);

  const cargarSesiones = async () => {
    try {
      const res = await axios.get(
        "https://medi-bot-back.vercel.app/api/sala/sesiones"
      );
      setSesiones(res.data.sesiones || []);
    } catch {
      alert("Error cargando sesiones");
    }
  };

  // -------------------------- CONVERSACIÓN ---------------------------
  const [sessionId, setSessionId] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const cargarConversacion = async () => {
    if (!sessionId) return alert("Ingresa un sessionId");
    try {
      const res = await axios.get(
        `https://medi-bot-back.vercel.app/api/sala/conversacion?sessionId=${sessionId}`
      );
      setMensajes(res.data.mensajes || []);
    } catch {
      alert("Error obteniendo conversación");
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* TABS */}
      <div className="flex gap-4 border-b pb-2">
        <button
          className={`px-4 py-2 ${activeTab === "metricas" ? "border-b-2 border-blue-600 font-bold" : ""}`}
          onClick={() => setActiveTab("metricas")}
        >
          📊 Métricas
        </button>

        <button
          className={`px-4 py-2 ${activeTab === "sesiones" ? "border-b-2 border-blue-600 font-bold" : ""}`}
          onClick={() => setActiveTab("sesiones")}
        >
          📁 Sesiones
        </button>

        <button
          className={`px-4 py-2 ${activeTab === "conversacion" ? "border-b-2 border-blue-600 font-bold" : ""}`}
          onClick={() => setActiveTab("conversacion")}
        >
          💬 Conversación
        </button>

        <button
          className={`px-4 py-2 ${activeTab === "exportar" ? "border-b-2 border-blue-600 font-bold" : ""}`}
          onClick={() => setActiveTab("exportar")}
        >
          📄 Exportar PDF
        </button>
      </div>

      {/* ---------------------- TAB: MÉTRICAS ---------------------- */}
      {activeTab === "metricas" && (
        <>
          <h1 className="text-3xl font-bold mb-4">📈 Dashboard de Métricas</h1>

          <div className="flex flex-wrap gap-3">
            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            <Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
            <Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            <Button onClick={handleBuscar}>
              {loading ? "Cargando..." : "Buscar"}
            </Button>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card><CardContent><h2>Total Consultas</h2><p>{resumen.total_consultas || 0}</p></CardContent></Card>
            <Card><CardContent><h2>Promedio Respuesta</h2><p>{Math.round(resumen.promedio_respuesta_ms || 0)}</p></CardContent></Card>
            <Card><CardContent><h2>Satisfacción ⭐</h2><p>{resumen.porcentaje_satisfaccion?.toFixed(2) || 0}</p></CardContent></Card>
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
                  <Bar dataKey="total_consultas" fill="#8884d8" />
                </BarChart>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h2 className="text-xl font-semibold mb-3">Promedio Respuesta</h2>
                <LineChart width={400} height={250} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="promedio_respuesta_ms" stroke="#82ca9d" />
                </LineChart>
              </CardContent>
            </Card>
          </div>

          {/* Feedback */}
          <h2 className="text-xl font-semibold mt-6">💬 Feedback de Usuarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.flatMap((d) =>
              d.feedback_usuarios?.filter((f) => f).map((f, idx) => (
                <Card key={idx}>
                  <CardContent>{f}</CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {/* ---------------------- TAB: SESIONES ---------------------- */}
      {activeTab === "sesiones" && (
        <div>
          <h1 className="text-2xl font-bold mb-3">📁 Sesiones</h1>
          <Button onClick={cargarSesiones}>Cargar Sesiones</Button>

          <div className="mt-4 space-y-3">
            {sesiones.map((s) => (
              <Card key={s._id}>
                <CardContent>
                  <p><b>ID:</b> {s._id}</p>
                  <p><b>User:</b> {s.userId}</p>
                  <p><b>Dolor:</b> {s.dolor}</p>
                  <p><b>Inicio:</b> {s.startedAt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------- TAB: CONVERSACIÓN ---------------------- */}
      {activeTab === "conversacion" && (
        <div>
          <h1 className="text-2xl font-bold mb-3">💬 Conversación</h1>

          <Input
            placeholder="sessionId..."
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          />
          <Button className="ml-3" onClick={cargarConversacion}>Buscar</Button>

          <div className="mt-4 space-y-3">
            {mensajes.map((m) => (
              <Card key={m._id}>
                <CardContent>
                  <p><b>{m.role === "bot" ? "🤖 Bot:" : "🧑 Usuario:"}</b></p>
                  <p>{m.text}</p>
                  <small>{m.timestamp}</small>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------- TAB: EXPORTAR ---------------------- */}
      {activeTab === "exportar" && (
        <div>
          <h1 className="text-2xl font-bold mb-3">📄 Exportar PDF</h1>

          <div className="flex flex-col gap-4 max-w-md">
            <a
              href="https://medi-bot-back.vercel.app/api/sala/exportarMetricasPDF"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-center"
            >
              📊 Exportar Métricas (PDF)
            </a>

            <Input
              placeholder="sessionId para exportar PDF..."
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
            />

            <a
              href={`https://medi-bot-back.vercel.app/api/sala/exportarConversacionPDF?sessionId=${sessionId}`}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-center"
            >
              💬 Exportar Conversación (PDF)
            </a>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;


