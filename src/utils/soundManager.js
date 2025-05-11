// soundManager.js
import { Howl } from "howler";

const sounds = {};

export const loadSound = (key, src) => {
  sounds[key] = new Howl({ src: [src] });
};

export const playMusic = (src) => {
  try {
    // Reanudar AudioContext si está suspendido
    if (Howler.ctx && Howler.ctx.state === "suspended") {
      Howler.ctx.resume();
    }

    // Detener música previa si existía
    if (sounds.bg) {
      sounds.bg.stop();
    }

    // Volumen seguro desde localStorage
    let savedVol = parseFloat(localStorage.getItem("musicVolume"));
    if (!Number.isFinite(savedVol)) savedVol = 0.5;

    // Crear Howl y reproducir
    sounds.bg = new Howl({
      src: [src],
      loop: true,
      volume: savedVol,
      html5: true,
    });
    sounds.bg.play();
  } catch (err) {
    console.error("Error al reproducir música:", err);
  }
};

/**
 * Detiene la música de fondo si está sonando.
 */
export const stopMusic = () => {
  try {
    if (sounds.bg) sounds.bg.stop();
  } catch (err) {
    console.error("Error al detener música:", err);
  }
};

/**
 * Cambia el volumen de la música de fondo y lo guarda en localStorage.
 */
export const changeMusicVolume = (volume) => {
  try {
    const vol = Number(volume);
    const safeVol = Number.isFinite(vol) ? Math.max(0, Math.min(1, vol)) : 0.5;
    if (sounds.bg) sounds.bg.volume(safeVol);
    localStorage.setItem("musicVolume", safeVol);
  } catch (err) {
    console.error("Error al cambiar volumen:", err);
  }
};

// ----------------------------------------------------------------
