import { useEffect } from 'react';

const Terminos = () => {
  useEffect(() => {
    document.documentElement.classList.add('bg-black');
    document.body.className = 'bg-gradient-to-b from-gray-900 to-black text-white';
    return () => {
      document.documentElement.classList.remove('bg-black');
      document.body.className = '';
    };
  }, []);

  const sectionBoxStyle = "bg-gray-800/50 border border-gray-700 rounded-2xl p-6 shadow-lg backdrop-blur";

  return (
    <div className="w-full h-screen flex justify-center bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
      <main className="w-full lg:w-1/2 px-6 py-8 md:py-12 space-y-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent text-center">
          Términos de Uso
        </h1>

        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Estos Términos de Uso regulan el acceso y uso de la plataforma AdrenaLux, incluyendo todos los productos, servicios y funcionalidades relacionados. Al acceder a AdrenaLux, aceptas regirte por estos términos. Si no estás de acuerdo con alguno de ellos, por favor abstente de utilizar nuestros servicios.
        </p>

        <section className="space-y-8">

          {/* Sección 1 */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Uso Aceptado</h2>
            <p className="text-gray-300">
              Al utilizar AdrenaLux, te comprometes a emplear la plataforma únicamente con fines lícitos y de acuerdo con las reglas del juego. Queda estrictamente prohibido el uso de trampas, exploits, bots o cualquier otra técnica que comprometa la experiencia de juego de otros usuarios.
            </p>
            <p className="text-gray-400 mt-2">
              Asimismo, no debes interferir con el correcto funcionamiento del sistema, realizar ingeniería inversa ni intentar acceder a servidores, código fuente o bases de datos sin autorización expresa.
            </p>
          </div>

          {/* Sección 2 */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Cuentas de Usuario</h2>
            <p className="text-gray-300">
              Para acceder a funciones competitivas, deberás crear una cuenta en AdrenaLux. Eres responsable de mantener la confidencialidad de tus credenciales y de todas las actividades que ocurran bajo tu cuenta.
            </p>
            <p className="text-gray-400 mt-2">
              Nos reservamos el derecho a suspender o eliminar cuentas que violen nuestros términos, participen en conductas abusivas o dañen la integridad del juego o la comunidad.
            </p>
          </div>

          {/* Sección 3 */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Propiedad Intelectual</h2>
            <p className="text-gray-300">
              Todo el contenido de AdrenaLux —incluyendo el diseño del juego, logotipos, cartas, mecánicas, software, gráficos y audio— está protegido por derechos de autor y propiedad intelectual. 
            </p>
            <p className="text-gray-400 mt-2">
              No se permite reproducir, modificar, distribuir ni utilizar con fines comerciales ningún material de AdrenaLux sin autorización previa por escrito.
            </p>
          </div>

          {/* Sección 4 */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Cambios y Actualizaciones</h2>
            <p className="text-gray-300">
              Podemos modificar estos Términos de Uso en cualquier momento. Si realizamos cambios sustanciales, intentaremos notificarte mediante el sitio web o por correo electrónico (si has registrado uno).
            </p>
            <p className="text-gray-400 mt-2">
              El uso continuado de AdrenaLux tras la publicación de los cambios implicará tu aceptación. Te recomendamos revisar esta página periódicamente.
            </p>
          </div>

          {/* Sección 5 */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Limitación de Responsabilidad</h2>
            <p className="text-gray-300">
              AdrenaLux se proporciona "tal cual", sin garantías explícitas o implícitas sobre su funcionamiento, disponibilidad o resultados esperados. No garantizamos que la plataforma esté libre de errores, interrupciones o pérdidas de datos.
            </p>
            <p className="text-gray-400 mt-2">
              En ningún caso seremos responsables por daños indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso del servicio.
            </p>
          </div>

          {/* Sección 6 */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Contacto</h2>
            <p className="text-gray-300">
              Si tienes dudas sobre estos términos, puedes contactarnos mediante el formulario de soporte disponible en el sitio web. Nos tomamos muy en serio las preocupaciones de la comunidad y agradecemos tu compromiso con un entorno justo y competitivo.
            </p>
          </div>

        </section>

        <p className="text-sm text-gray-500 text-center py-10">
          © {new Date().getFullYear()} AdrenaLux. Todos los derechos reservados. — Última actualización: mayo de 2025
        </p>
      </main>
    </div>
  );
};

export default Terminos;