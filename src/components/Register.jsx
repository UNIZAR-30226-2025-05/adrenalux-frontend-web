import { useState } from 'react';
import googleLogo from "../assets/googleLogo.png";
import background from "../assets/background.png";
import { useNavigate } from 'react-router-dom';  

const Register = () => {
  const navigate = useNavigate(); 
  
  // Estados para guardar los valores del formulario
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    lastname: '',
    username: '',
    password: ''
  });

  // Función para actualizar el estado al escribir en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función para enviar los datos al backend
  const handleSignUpClick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://tu-backend.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('Registro exitoso');
        navigate("/home");
      } else {
        console.error('Error al registrar');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center" 
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-gray-900 p-8 w-full max-w-md text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Registrarse</h2>
          <button className="flex items-center bg-gray-800 hover:bg-gray-700 border border-white rounded px-3 py-2">
            <img src={googleLogo} alt="Google" className="w-5 mr-2" />
            Continuar con Google
          </button>
        </div>
        <p className="text-sm mb-4">Crear una nueva cuenta</p>

        <form onSubmit={handleSignUpClick} className="space-y-4">
          <input 
            type="text" 
            name="email" 
            placeholder="Mail" 
            className="w-full bg-gray-800 border border-gray-700 focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none"
            value={formData.email}
            onChange={handleChange}
          />
          <input 
            type="text" 
            name="name" 
            placeholder="Nombre" 
            className="w-full bg-gray-800 border border-gray-700 focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none"
            value={formData.nombre}
            onChange={handleChange}
          />
          <input 
            type="text" 
            name="lastname" 
            placeholder="Apellido" 
            className="w-full bg-gray-800 border border-gray-700 focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none"
            value={formData.apellido}
            onChange={handleChange}
          />
          <input 
            type="text" 
            name="username" 
            placeholder="Nombre de usuario" 
            className="w-full bg-gray-800 border border-gray-700 focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none"
            value={formData.username}
            onChange={handleChange}
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Contraseña" 
            className="w-full bg-gray-800 border border-gray-700 focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none"
            value={formData.password}
            onChange={handleChange}
          />
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded py-2 transition duration-300">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
