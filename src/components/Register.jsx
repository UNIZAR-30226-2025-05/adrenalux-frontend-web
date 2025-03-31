import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import googleLogo from "../assets/googleLogo.png";
import background from "../assets/background.png";
import { register, login } from '../services/api/authApi'; 

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    lastname: '',
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: "" }); // Limpiar error al escribir
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El correo no es válido.";
    }

    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!formData.lastname.trim()) newErrors.lastname = "El apellido es obligatorio.";
    if (!formData.username.trim()) newErrors.username = "El nombre de usuario es obligatorio.";
    
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleSignUpClick = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Detener si hay errores

    try {
      const { status, data } = await register(
        formData.email,
        formData.username,
        formData.lastname,
        formData.name,
        formData.password
      );
      
      if (status.error_message === "") {
        const { status } = await login(formData.email, formData.password);
        if (status === 200) {
          console.log('Inicio de sesión exitoso');
          navigate('/Home');
        } else {
          console.error('Error al iniciar sesión:', data);
        }
      } else {
        // Manejo de errores específicos
        const newErrors = {};
        if (status.error_message.includes("correo")) {
          newErrors.email = "Este correo ya está en uso.";
        }
        if (status.error_message.includes("usuario")) {
          newErrors.username = "Este nombre de usuario ya está en uso.";
        }
        if (status.error_message.includes("password")) {
          newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
        }
        setErrors(newErrors);
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
      <div className="bg-gray-300 dark:bg-gray-900 p-8 w-full max-w-md text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-black dark:text-white text-2xl font-bold">Registrarse</h2>
          <button className="flex items-center bg-gray-800 hover:bg-gray-700 border border-white rounded px-3 py-2">
            <img src={googleLogo} alt="Google" className="w-5 mr-2" />
            Continuar con Google
          </button>
        </div>
        <p className="text-black dark:text-white text-sm mb-4">Crear una nueva cuenta</p>

        <form onSubmit={handleSignUpClick} className="space-y-4">
          {/** Email */}
          <input 
            type="text" 
            name="email" 
            placeholder="Correo electrónico" 
            className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          {/** Nombre */}
          <input 
            type="text" 
            name="name" 
            placeholder="Nombre" 
            className={`w-full bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          {/** Apellido */}
          <input 
            type="text" 
            name="lastname" 
            placeholder="Apellido" 
            className={`w-full bg-gray-800 border ${errors.lastname ? 'border-red-500' : 'border-gray-700'} focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none`}
            value={formData.lastname}
            onChange={handleChange}
          />
          {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}

          {/** Nombre de usuario */}
          <input 
            type="text" 
            name="username" 
            placeholder="Nombre de usuario" 
            className={`w-full bg-gray-800 border ${errors.username ? 'border-red-500' : 'border-gray-700'} focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none`}
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          {/** Contraseña */}
          <input 
            type="password" 
            name="password" 
            placeholder="Contraseña" 
            className={`w-full bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} focus:border-gray-600 rounded px-4 py-2 text-white focus:outline-none`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          {/** Botón de registro */}
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded py-2 transition duration-300">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
