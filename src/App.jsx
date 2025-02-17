import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Register from './components/Register'; 
import Login from './components/Login'; 
import Home from './components/Home'; 
import { BrowserRouter } from "react-router-dom";
import Navbar from './components/layout/Navbar'; 
import HeroSection from './components/HeroSection'; 

import GameHome from './components/layout/game/GameHome'; 

import Footer from './components/layout/Footer'; 

function App() {
  return (
<Home/>
  );
}

export default App;
