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
  sounds['bg'] = new Howl({
    src: [src],
    loop: true,
    volume: 0.5,  // Volumen inicial
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
};


