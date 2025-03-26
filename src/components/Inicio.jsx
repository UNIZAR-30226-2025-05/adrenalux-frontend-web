import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import logo from '../assets/logo.png';
import pantallaPrincipal from '../assets/SobreComun.png';

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
    <div className='min-h-screen flex flex-col text-white'>
      {/* NAVBAR */}
      <header className='fixed top-0 left-0 w-full px-4 py-4 md:px-8 md:py-6 flex justify-between items-center z-20 bg-transparent'>
        <img 
          src={logo} 
          alt='Logo' 
          className='w-16 md:w-24 cursor-pointer filter invert' 
          onClick={() => navigate('/')} 
        />
        <nav className='flex gap-4 md:gap-6'>
          <button onClick={handleLoginClick} className='text-black hover:text-gray-400 text-sm md:text-base'>Inicio sesión</button>
          <button onClick={handleSignUpClick} className='text-black hover:text-gray-400 text-sm md:text-base'>Registrarse</button>        
        </nav>
      </header>

      {/* MAIN */}
      <main className='flex flex-1 justify-between items-center w-full px-4 pt-20 md:px-10 md:pt-28'>
        {/* TEXT CONTENT */}
        <section className='max-w-[90%] mb-20 md:mb-40'>
          <h2 className='text-4xl md:text-6xl font-bold whitespace-nowrap mb-4 md:mb-8'>¡Bienvenido a AdrenaLux!</h2>
          <p className='text-lg md:text-xl mb-6 whitespace-nowrap'>Sumérgete en este TCG de La Liga y colecciona a tus jugadores favoritos.</p>
          <button onClick={handleDiscoverClick} className='bg-white text-black font-bold py-3 px-6 rounded-md hover:bg-gray-300 mb-8 md:mb-16'>Descúbrelo</button>

          {/* SOCIAL MEDIA */}
          <div className='flex flex-col gap-2 mt-8 md:mt-16'>
            <span className='text-white text-lg font-semibold'>Síguenos:</span>
            <div className='flex gap-4'>
              <FaInstagram className='text-xl md:text-2xl text-white cursor-pointer' />
              <FaLinkedin className='text-xl md:text-2xl text-white cursor-pointer' />
              <FaYoutube className='text-xl md:text-2xl text-white cursor-pointer' />
            </div>
          </div>
        </section>

        {/* CARDS */}
        <section className='relative flex justify-start w-full h-[400px] md:h-[500px]' style={{ transform: 'translateX(400px)' }}>
          {[0, 1, 2, 3, 4].map((index) => (
            <img
              key={index}
              src={pantallaPrincipal}
              alt='Carta TCG'
              className={`absolute w-[1200px] md:w-[1600px] h-auto object-contain transition-all`}  
              style={{
                transform: `rotate(${index % 2 === 0 ? index * 5 : -index * 5}deg)`,
                top: `${index * 2}px`,
                right: `${index * 2}px`,
                zIndex: index,
              }}
            />
          ))}
        </section>
      </main>

      {/* FOOTER */}
      <footer className='bg-black text-white text-center py-8 md:py-12 fixed bottom-0 w-full border-t border-gray-700'>
        <div className='flex justify-center gap-8 md:gap-20'>
          <a href='#' className='hover:text-gray-400 text-sm md:text-base'>Política de Privacidad</a>
          <a href='#' className='hover:text-gray-400 text-sm md:text-base'>Términos de Uso</a>
          <a href='#' className='hover:text-gray-400 text-sm md:text-base'>FAQ</a>
          <a href='#' className='hover:text-gray-400 text-sm md:text-base'>Estado</a>
        </div>
      </footer>
    </div>
  );
}

export default Inicio;
