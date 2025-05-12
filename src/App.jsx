import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Inicio from "./components/Inicio";
import Home from "./components/Home";
import Shop from "./components/Shop";
import ShopCollection from "./components/ShopCollection";
import Collection from "./components/Collection";
import Amigo from "./components/Amigo";
import Opening from "./components/Opening";
import GridOpenedCards from "./components/GridOpendCards";
import Alineaciones from "./components/Alineaciones";
import AlineacionEditar from "./components/AlineacionesEditar";
import BuscandoJugador from "./components/BuscandoJugador";
import Logros from "./components/Logros";
import Intercambios from "./components/Intercambio";
import Ajustes from "./components/Ajustes";
import Profile from "./components/Profile";
import CardsForSale from "./components/CardsForSale";
import EsperandoJugador from "./components/EsperandoJugador";
import Clasificacion from "./components/Clasificacion";
import Partida from "./components/Partida";
import Torneo from "./components/Torneo";
import MusicManager from "./context/MusicManager";
import PartidasPausadas from "./components/PartidasPausadas";
import Info from "./components/InfoFirstUser";
import Terminos from "./components/Terminos";
import Soporte from "./components/Soporte";
import Politica from "./components/Politica";
import CoinShop from "./components/layout/game/CoinShop";

function App() {
  const [theme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    // Aplicar el tema a la raíz del documento HTML
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Agregar el script de Tidio
    const tidioScript = document.createElement("script");
    tidioScript.src = "//code.tidio.co/zb1pfoly1cmbv7sux114egm7klfmzirv.js";
    tidioScript.async = true;
    document.body.appendChild(tidioScript);

    return () => {
      document.body.removeChild(tidioScript); // Limpiar el script al desmontar el componente
    };
  }, [theme]);

  return (
    <Router>
      <MusicManager />
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
        <Route path="/intercambio/:exchangeId" element={<Intercambios />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ajustes" element={<Ajustes />} />
        <Route path="/cards-for-sale" element={<CardsForSale />} />
        <Route path="/esperando" element={<EsperandoJugador />} />
        <Route path="/clasificacion" element={<Clasificacion />} />
        <Route path="/partida/:matchId" element={<Partida />} />
        <Route path="/torneo" element={<Torneo />} />
        <Route path="/partidasPausadas" element={<PartidasPausadas />} />
        <Route path="/info" element={<Info />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="/politica" element={<Politica />} />
        <Route path="/coinshop" element={<CoinShop />} />
      </Routes>
    </Router>
  );
}

export default App;
