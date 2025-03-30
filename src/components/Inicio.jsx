import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import logo from '../assets/adrenalux_logo_white.png';
import pantallaPrincipal from '../assets/Sobres.png';

const Inicio = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = 'linear-gradient(to bottom, #1a1a1a, #111111)';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  const handleLoginClick = () => navigate('/login');
  const handleSignUpClick = () => navigate('/register');
  const handleDiscoverClick = () => navigate('/register');

  return (
    <div className='min-h-screen flex flex-col text-white relative overflow-hidden'>
      {/* NAVBAR */}
      <header className='fixed top-0 left-0 w-full px-4 py-4 md:px-8 md:py-6 flex justify-between items-center z-20 backdrop-blur-md bg-black/30 border-b border-gray-800'>
        <img 
          src={logo} 
          alt='Logo' 
          className='w-16 md:w-24 cursor-pointer hover:scale-105 transition-transform 
                     filter contrast-[1.2] brightness-[0.8]' 
          onClick={() => navigate('/')} 
        />
        <nav className='flex gap-4 md:gap-6'>
          <button 
            onClick={handleLoginClick} 
            className='bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full 
                       transition-all border border-white/20'
          >
            Inicio sesión
          </button>
          <button 
            onClick={handleSignUpClick} 
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full 
                       transition-all'
          >
            Registrarse
          </button>        
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className='fixed flex flex-1 flex-col lg:flex-row justify-between items-center w-full 
                       px-4 pt-32 md:px-10 md:pt-40 pb-24'>
        {/* TEXTO Y BOTONES */}
        <section className='max-w-2xl mb-12 lg:mb-0 z-10 transform translate-x-16'>
          <h2 className='text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 
                         to-purple-400 bg-clip-text text-transparent'>
            ¡Bienvenido a AdrenaLux!
          </h2>
          <p className='text-xl md:text-2xl mb-8 text-gray-300'>
            Sumérgete en este TCG de La Liga y colecciona a tus jugadores favoritos.
          </p>
          <button 
            onClick={handleDiscoverClick} 
            className='bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-xl 
                       transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30'
          >
            Descúbrelo ahora →
          </button>

          {/* REDES SOCIALES */}
          <div className='flex flex-col gap-4 mt-12'>
            <span className='text-gray-400 text-lg'>Síguenos:</span>
            <div className='flex gap-6'>
              <FaInstagram className='text-3xl text-white cursor-pointer hover:text-purple-400 
                                      transition-colors' />
              <FaLinkedin className='text-3xl text-white cursor-pointer hover:text-blue-400 
                                   transition-colors' />
              <FaYoutube className='text-3xl text-white cursor-pointer hover:text-red-500 
                                   transition-colors' />
            </div>
          </div>
        </section>

        <section className='relative w-full lg:w-1/2 h-[600px] flex items-center justify-end transform -translate-x-16'>
          <img
            src={pantallaPrincipal}
            alt='Sobres de cartas TCG'
            className='w-full max-w-[700px] h-auto object-contain'
          />
        </section>
      </main>

      {/* FOOTER */}
      <footer className='bg-black text-white text-center py-8 md:py-12 fixed bottom-0 w-full border-t border-gray-700'>
        <div className='flex justify-center gap-8 md:gap-20 flex-wrap'>
          <a href='#' className='hover:text-blue-400 text-sm md:text-base transition-colors'>
            Política de Privacidad
          </a>
          <a href='#' className='hover:text-blue-400 text-sm md:text-base transition-colors'>
            Términos de Uso
          </a>
          <a href='#' className='hover:text-blue-400 text-sm md:text-base transition-colors'>
            FAQ
          </a>
          <a href='#' className='hover:text-blue-400 text-sm md:text-base transition-colors'>
            Estado
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Inicio;
