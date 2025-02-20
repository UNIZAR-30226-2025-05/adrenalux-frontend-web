import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import googleLogo from "../assets/googleLogo.png";
import background from "../assets/background.png";
import { register, login } from '../services/api/authApi'; 

const Register = () => {
  const navigate = useNavigate();

  // Estado para los valores del formulario
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    lastname: '',
    username: '',
    password: ''
  });

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Maneja el registro
  const handleSignUpClick = async (e) => {
    e.preventDefault();
    try {
      const { status, data } = await register(
        formData.email,
        formData.username,
        formData.lastname,
        formData.name,
        formData.password
      );

      if (status === 201) {
        const { status, data } = await login(formData.email, formData.password);
        if (status == 200) {
          console.log('Inicio de sesión exitoso');
          navigate('/Home');
        } else {
          console.error('Error al iniciar sesión:', data);
        }
      } else {
        console.error('Error al registrar:', data);
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
            placeholder="Correo electrónico" 
            className="w-full bg-gray-800 border border-gray-700 focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none"
            value={formData.email}
            onChange={handleChange}
          />
          <input 
            type="text" 
            name="name" 
            placeholder="Nombre" 
            className="w-full bg-gray-800 border border-gray-700 focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none"
            value={formData.name}
            onChange={handleChange}
          />
          <input 
            type="text" 
            name="lastname" 
            placeholder="Apellido" 
            className="w-full bg-gray-800 border border-gray-700 focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none"
            value={formData.lastname}
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
