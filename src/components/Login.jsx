import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api/authApi';
import googleLogo from '../assets/googleLogo.png';
import background from '../assets/background.png';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const isDebugMode = import.meta.env.VITE_NODE_ENV === 'development';


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores anteriores
    try {
      const { status } = await login(formData.email, formData.password);
      if (status === 200) {
        console.log('Inicio de sesión exitoso');
        navigate('/Home');
      } else {
        setError('Error en las credenciales');
      }
    } catch (error) {
      if(isDebugMode) {
        setError('Error en la conexión con el servidor' + error);
      }else {
        setError('Error en la conexión con el servidor');
      }
      
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      <div className="bg-gray-900 p-8 w-full max-w-lg text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Inicio de sesión</h2>
          <button className="flex items-center bg-gray-800 hover:bg-gray-700 border border-white rounded px-3 py-2">
            <img src={googleLogo} alt="Google" className="w-5 mr-2" />
            Continuar con Google
          </button>
        </div>
        <p className="text-sm mb-4">Inicia sesión con tu cuenta</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLoginClick} className="space-y-4">
          <input 
            type="email" 
            name="email" 
            placeholder="Correo electrónico" 
            className={`w-full bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-700'} rounded px-4 py-2 text-white focus:outline-none`}
            value={formData.email}
            onChange={handleChange}
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Contraseña" 
            className={`w-full bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-700'} rounded px-4 py-2 text-white focus:outline-none`}
            value={formData.password}
            onChange={handleChange}
          />
          <div className="flex justify-between">
            <button className="bg-blue-600 hover:bg-blue-500 text-white rounded py-2 px-4 transition duration-300" type="submit">
              Iniciar sesión
            </button>
            <button className="text-blue-600 bg-gray-900 hover:text-blue-200 transition duration-300" type="button">
              Olvidé mi contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
