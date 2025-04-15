import { Howl, Howler } from 'howler';

const sounds = {};

export const loadSound = (key, src) => {
  sounds[key] = new Howl({ src: [src] });
};

export const playSound = (key) => {
  if (sounds[key]) {
    sounds[key].play();
  } else {
    console.warn(`Sonido con clave "${key}" no cargado.`);
  }
};

export const playMusic = (src) => {
  if (sounds['bg']) {
    sounds['bg'].stop();
  }
  sounds['bg'] = new Howl({
    src: [src],
    loop: true,
    volume: 0.5,
  });
  sounds['bg'].play();
};

export const changeMusicVolume = (volume) => {
  if (sounds['bg']) {
    sounds['bg'].volume(volume);
  }
};

export const changeSfxVolume = (volume) => {
  Howler.volume(volume); // Cambia el volumen global para los efectos
};
