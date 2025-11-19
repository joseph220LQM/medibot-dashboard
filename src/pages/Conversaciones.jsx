// src/pages/Conversaciones.jsx
import { useState } from "react";
import axios from "axios";

const Conversaciones = () => {
  const [sessionId, setSessionId] = useState("");
  const [userId, setUserId] = useState("");
  const [data, setData] = useState(null);

  const fetchConversacion = async () => {
    let url = "";

    if (sessionId)
      url = `https://medi-bot-back.vercel.app/api/sala/conversacion?sessionId=${sessionId}`;
    else if (userId)
      url = `https://medi-bot-back.vercel.app/api/sala/conversacionesUsuario?userId=${userId}`;
    else return alert("Debes ingresar un sessionId o userId");

    try {
      const res = await axios.get(url);
      setData(res.data);
    } catch (e) {
      console.error(e);
      alert("Error obteniendo conversación");
    }
  };

  const descargarPDF = () => {
    if (!sessionId) return alert("Debes ingresar un sessionId");
    window.open(`https://medi-bot-back.vercel.app/api/sala/exportarConversacionPDF?sessionId=${sessionId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">💬 Conversaciones</h1>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="sessionId"
          className="border px-3 py-2 rounded"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        />
        <input
          type="text"
          placeholder="userId"
          className="border px-3 py-2 rounded"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button className="bg-blue-700 text-white px-4 py-2 rounded" onClick={fetchConversacion}>
          Buscar
        </button>

        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={descarregarPDF}>
          Descargar PDF
        </button>
      </div>

      {data && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Conversaciones;
