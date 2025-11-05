// src/pages/Home.jsx
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 text-center px-6">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">
        🤖 Bienvenido al Panel de Métricas del Chatbot
      </h1>
      <p className="text-lg text-gray-700 mb-8 max-w-md">
        Explora las métricas y el rendimiento de tu chatbot en tiempo real.
      </p>
      <Link
        to="/dashboard"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      >
        Ver Dashboard
      </Link>
    </div>
  );
};

export default Home;


