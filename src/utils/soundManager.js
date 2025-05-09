import { Howl } from 'howler';

const sounds = {};

// Cargar un sonido
export const loadSound = (key, src) => {
  sounds[key] = new Howl({ src: [src] });
};

// Reproducir música de fondo
export const playMusic = (src) => {
  if (sounds['bg']) {
    sounds['bg'].stop();
  }

  // Obtener el volumen guardado o usar 0.5 como valor por defecto
  const savedVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.5;

  sounds['bg'] = new Howl({
    src: [src],
    loop: true,
    volume: savedVolume,  // Volumen inicial desde localStorage
  });

  sounds['bg'].play();
};

// Detener la música de fondo
export const stopMusic = () => {
  if (sounds['bg']) {
    sounds['bg'].stop();
  }
};

// Cambiar el volumen de la música de fondo
export const changeMusicVolume = (volume) => {
  if (sounds['bg']) {
    sounds['bg'].volume(volume);
  }
  // Guardar el volumen en localStorage
  localStorage.setItem('musicVolume', volume);
};
