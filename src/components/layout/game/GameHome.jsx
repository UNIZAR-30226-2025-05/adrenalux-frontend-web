import React from "react";
//import NavbarGame from "./NavbarGame";
import GameActions from "./GameActions";
import PlayButton from "./PlayButton";

export default function GameHome() {
    return (
      <div
        className="min-h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat text-white flex flex-col items-center justify-center relative"
        style={{ stadium: "url('/assets/background.jpeg')" }}
      >
        <NavbarGame />
          <GameActions />
        <PlayButton />
      </div>
    );
  }
  
  
  