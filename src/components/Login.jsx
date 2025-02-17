import React from "react";
import googleLogo from "../assets/googleLogo.png"; 
import background from "../assets/background.jpeg"; 

const Login = () => {
  return (
    
    <div 

    >
      <div className="bg-gray-900 bg-opacity-90 p-8 rounded-2xl shadow-lg w-96 text-white">
        <h2 className="text-2xl font-bold mb-4">Inicio Sesión</h2>
        <p className="mb-4">Inicia sesión con tu cuenta</p>
        
        <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center mb-4">
          <img src={googleLogo} alt="Google" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>
        
        <div className="mb-4">
          <label className="block mb-1">Usuario</label>
          <input type="text" className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Usuario" />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Contraseña</label>
          <input type="password" className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contraseña" />
        </div>
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-bold">INICIAR</button>
        
        <p className="mt-4 text-sm text-right text-gray-400 hover:text-gray-200 cursor-pointer">Olvidé mi contraseña</p>
      </div>
    </div>
  );
};

export default Login;
