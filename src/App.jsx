import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

import Sesiones from "./pages/Sesiones";
import Conversaciones from "./pages/Conversaciones";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* NUEVAS RUTAS */}
        <Route path="/sesiones" element={<Sesiones />} />
        <Route path="/conversaciones" element={<Conversaciones />} />
      </Routes>
    </Router>
  );
}

export default App;



