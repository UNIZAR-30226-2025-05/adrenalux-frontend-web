import { Howl } from 'howler';

let sfxVolume = (parseInt(localStorage.getItem("sfxVolume")) || 80) / 100;
let musicVolume = (parseInt(localStorage.getItem("musicVolume")) || 50) / 100;

const sounds = new Map();
let music = null;

// Carga un sonido y lo guarda en el mapa
export function loadSound(name, src) {
  const sound = new Howl({
    src: [src],
    volume: sfxVolume,
  });
  sounds.set(name, sound);
}

// Reproduce un sonido por nombre
export function playSound(name) {
  const sound = sounds.get(name);
  if (sound) {
    sound.volume(sfxVolume);
    sound.play();
  }
}

// Reproduce música de fondo (loop por defecto)
export function playMusic(src, loop = true) {
  if (music) {
    music.stop();
  }

  music = new Howl({
    src: [src],
    loop,
    volume: musicVolume,
  });

  music.play();
}

// Detiene la música de fondo
export function stopMusic() {
  if (music) {
    music.stop();
    music = null;
  }
}

// Cambia el volumen de los efectos de sonido
export function changeSfxVolume(volume) {
  sfxVolume = volume;
  sounds.forEach(sound => sound.volume(volume));
}

// Cambia el volumen de la música de fondo
export function changeMusicVolume(volume) {
  console.log(`volume changed to: ${volume}`)
  musicVolume = volume;
  if (music) {
    music.volume(volume);
  }
}