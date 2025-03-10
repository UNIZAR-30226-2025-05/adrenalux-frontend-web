import Register from "./components/Register";
import Login from "./components/Login";
import Inicio from "./components/Inicio";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Shop from "./components/Shop";
import ShopCollection from "./components/ShopCollection";
import Collection from "./components/Collection";
import Amigo from "./components/Amigo";
import Opening from "./components/Opening";
import GridOpenedCards from "./components/gridOpendCards";
import Alineaciones from "./components/Alineaciones";
import AlineacionEditar from "./components/AlineacionesEditar";
import BuscandoJugador from "./components/BuscandoJugador";
import Logros from "./components/Logros";
import Intercambios from "./components/Intercambio";

import Profile from "./components/Profile";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shopC" element={<ShopCollection />} />
        <Route path="/opening" element={<Opening />} />
        <Route path="/grid" element={<GridOpenedCards />} />
        <Route path="/alineaciones" element={<Alineaciones />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/amigo" element={<Amigo />} />
        <Route path="/alineacionesEditar" element={<AlineacionEditar />} />
        <Route path="/buscandoPartida" element={<BuscandoJugador />} />
        <Route path="/logros" element={<Logros />} />
        <Route path="/intercambio" element={<Intercambios />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
