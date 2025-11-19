// src/pages/Sesiones.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const Sesiones = () => {
  const [sesiones, setSesiones] = useState([]);
  const [userId, setUserId] = useState("");

  const fetchSesiones = async () => {
    let url = "https://medi-bot-back.vercel.app/api/sala/sesiones";
    if (userId) url = `https://medi-bot-back.vercel.app/api/sala/sesionesUsuario?userId=${userId}`;

    try {
      const res = await axios.get(url);
      setSesiones(res.data.sesiones);
    } catch (e) {
      console.error(e);
      alert("Error obteniendo sesiones");
    }
  };

  useEffect(() => {
    fetchSesiones();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">📋 Sesiones</h1>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="userId (opcional)"
          className="border px-3 py-2 rounded"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={fetchSesiones}>
          Buscar
        </button>
      </div>

      <div className="grid gap-3">
        {sesiones.map((s) => (
          <div key={s._id} className="p-4 bg-white shadow rounded-lg">
            <p><b>ID:</b> {s._id}</p>
            <p><b>Usuario:</b> {s.userId}</p>
            <p><b>Dolor:</b> {s.dolor}</p>
            <p><b>Inicio:</b> {s.startedAt}</p>
            <p><b>Fin:</b> {s.endedAt || "En curso"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sesiones;
