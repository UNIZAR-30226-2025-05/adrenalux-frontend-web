import { useState, useEffect } from 'react';

export function useWindowSize() {
  // Estado inicial con valores predeterminados
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Verificar si estamos en el navegador
    if (typeof window === 'undefined') {
      return;
    }

    // Función para actualizar el estado con las nuevas dimensiones
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Establecer el tamaño inicial
    handleResize();
    
    // Agregar event listener
    window.addEventListener('resize', handleResize);
    
    // Limpiar event listener al desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Array vacío para ejecutar solo en montaje y desmontaje

  return windowSize;
}