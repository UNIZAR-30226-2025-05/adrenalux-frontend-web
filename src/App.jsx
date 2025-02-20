import Register from './components/Register'; 
import Login from './components/Login'; 
import Inicio from './components/Inicio'; 
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import Shop from './components/Shop';
import ShopCollection from './components/ShopCollection';


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
      </Routes>
    </Router>
  );
}

export default App;
