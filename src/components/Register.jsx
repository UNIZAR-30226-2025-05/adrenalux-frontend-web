import { useState } from "react";
import googleLogo from "../assets/googleLogo.png";
import background from "../assets/background.jpeg";
import { FaEnvelope, FaUser, FaLock } from "react-icons/fa";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering user:", form);
  };

  return (
    <div >
      <div className="bg-gray-900 bg-opacity-90 p-12 rounded-2xl shadow-lg w-[750px] text-white"> 
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-left">Registrarse</h2>
          <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-5 rounded flex items-center">
            <img src={googleLogo} alt="Google" className="w-6 h-6 mr-3" />
            Continue with Google
          </button>
        </div>
        <p className="mb-6 text-left">Crea una nueva cuenta</p>
        
    
        <form onSubmit={handleSubmit}>
          <div className="relative mb-5">
            <FaEnvelope className="absolute left-3 top-4 text-gray-400 text-lg" />
            <input type="email" name="email" placeholder="Mail" value={form.email} onChange={handleChange} className="w-full pl-12 py-3 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="relative mb-5">
            <FaUser className="absolute left-3 top-4 text-gray-400 text-lg" />
            <input type="text" name="username" placeholder="Usuario" value={form.username} onChange={handleChange} className="w-full pl-12 py-3 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="relative mb-8">
            <FaLock className="absolute left-3 top-4 text-gray-400 text-lg" />
            <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full pl-12 py-3 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <button type="submit" className="w-150 bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded font-bold text-lg">
            REGISTRARSE
          </button>
        </form>
      </div>
    </div>
  );
}
