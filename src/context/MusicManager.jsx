import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { playMusic, stopMusic } from "../utils/soundManager";
import bgMusic from "../assets/sounds/background_music.mp3";

let isMusicPlaying = false;

const MusicManager = () => {
  const location = useLocation();

  useEffect(() => {
    const isSilentRoute = ["/", "/login", "/register"].includes(
      location.pathname
    );

    if (isSilentRoute) {
      stopMusic();
      isMusicPlaying = false;
    } else {
      if (!isMusicPlaying) {
        playMusic(bgMusic);
        isMusicPlaying = true;
      }
    }
  }, [location]);

  return null; // Este componente no renderiza nada
};

export default MusicManager;
