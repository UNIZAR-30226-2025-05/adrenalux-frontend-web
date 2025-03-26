import React from "react";
import { useNavigate } from "react-router-dom";
import NavBarGame from "./layout/game/NavbarGame";
import BackButton from "./layout/game/BackButton";
import background from "../assets/background.png";

const playersRanking = [
  { position: 1, name: "Lionel Messi", first: 113, second: 27, won: 666, tied: 32, lost: 128 },
  { position: 2, name: "Lamine Yamal", first: 105, second: 30, won: 621, tied: 14, lost: 134 },
  { position: 3, name: "Cristiano Ronaldo", first: 101, second: 30, won: 605, tied: 27, lost: 134 },
  { position: 4, name: "Marcos Gomá", first: 100, second: 33, won: 589, tied: 40, lost: 140 },
  { position: 5, name: "Ivan Azón", first: 97, second: 40, won: 540, tied: 60, lost: 160 },
  { position: 6, name: "Francho Serrano", first: 96, second: 42, won: 534, tied: 57, lost: 159 },
  { position: 7, name: "Jesus Vallejo", first: 93, second: 42, won: 534, tied: 55, lost: 164 },
  { position: 8, name: "Pablo Villa", first: 91, second: 46, won: 530, tied: 51, lost: 169 },
  { position: 9, name: "Ibai Llanos", first: 85, second: 49, won: 512, tied: 40, lost: 230 },
  { position: 10, name: "Fernando Naranjo", first: 84, second: 49, won: 501, tied: 12, lost: 250 },
];

const userRanking = { position: 768, name: "Darío Hueso", first: 24, second: 89, won: 126, tied: 10, lost: 202 };

const ClasificacionJugadores = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      <NavBarGame />
      <div className="relative w-full h-screen mt-32">
        <div className="absolute left-4 top-4 z-10">
          <BackButton onClick={handleBackClick} />
        </div>
        <div className="mx-auto bg-gray-900 bg-opacity-90 p-8 rounded-lg w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] max-w-4xl mt-16">
          <h1 className="text-white text-4xl font-bold mb-8 text-center">Ranking de Jugadores</h1>
          <table className="w-full text-white text-center border-collapse">
            <thead>
              <tr className="bg-blue-600">
                <th className="p-2">Posición</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">1º</th>
                <th className="p-2">2º</th>
                <th className="p-2">Ganados</th>
                <th className="p-2">Empatados</th>
                <th className="p-2">Perdidos</th>
              </tr>
            </thead>
            <tbody>
              {playersRanking.map((player) => (
                <tr key={player.position} className="border-b border-gray-700">
                  <td className="p-2">{player.position}</td>
                  <td className="p-2">{player.name}</td>
                  <td className="p-2">{player.first}</td>
                  <td className="p-2">{player.second}</td>
                  <td className="p-2">{player.won}</td>
                  <td className="p-2">{player.tied}</td>
                  <td className="p-2">{player.lost}</td>
                </tr>
              ))}
              <tr className="border-b border-gray-700 bg-red-700">
                <td className="p-2 font-bold">{userRanking.position}</td>
                <td className="p-2 font-bold">{userRanking.name}</td>
                <td className="p-2 font-bold">{userRanking.first}</td>
                <td className="p-2 font-bold">{userRanking.second}</td>
                <td className="p-2 font-bold">{userRanking.won}</td>
                <td className="p-2 font-bold">{userRanking.tied}</td>
                <td className="p-2 font-bold">{userRanking.lost}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClasificacionJugadores;
