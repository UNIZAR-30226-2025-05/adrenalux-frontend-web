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
import React, { useState, useEffect } from "react";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Leer el tema desde localStorage al montar el componente y aplicar la clase correspondiente
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]); // Cada vez que el tema cambie, se aplica el estilo

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
        <Route path="/intercambio/:exchangeId" element={<Intercambios />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ajustes" element={<Ajustes />} />
        <Route path="/cards-for-sale" element={<CardsForSale />} />
        <Route path="/esperando" element={<EsperandoJugador />} />
        <Route path="/clasificacion" element={<Clasificacion />} />
      </Routes>
    </Router>
  );
}

export default App;
