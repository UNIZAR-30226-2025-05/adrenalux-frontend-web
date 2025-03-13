import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBarGame from "./layout/game/NavbarGame";
import BackButton from "../components/layout/game/BackButton";
import background from "../assets/background.png";
import profilePic from "../assets/profile_2.png";
import { FaTimes, FaCheck, FaPen } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { getProfile } from "../services/api/profileApi";

const Profile = () => {
  const [infoUser, setInfoUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const friendCode = infoUser?.data?.friend_code;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        console.log("Perfil obtenido:", data);
        setInfoUser(data);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Extraemos la información del perfil usando la misma estructura que en NavBarGame
  const avatar = infoUser?.data?.avatar || "";
  const username = infoUser?.data?.username || "Cargando...";
  const level = infoUser?.data?.level || 1;
  const experiencia = infoUser?.data?.experience || 0;
  const xpMax = infoUser?.data?.xpMax || 1;
  const adrenacoins = infoUser?.data?.adrenacoins || 0;
  const progress = experiencia / xpMax;
  const degrees = progress * 360;

  // Si la API devuelve las partidas en infoUser.data.partidas, las usamos
  const partidas = infoUser?.data?.partidas || [];

  // Si las partidas cuentan con una propiedad que indica si ganaste, por ejemplo, "isWin"
  const winCount = partidas.filter((p) => p.isWin).length;
  const lossCount = partidas.filter((p) => !p.isWin).length;

  const [isEditing, setIsEditing] = useState(false);
  const [usernameEdited, setUsernameEdited] = useState(username);

  const handleEditClick = () => {
    setUsernameEdited(username);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Aquí podrías agregar la lógica para actualizar el perfil
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  // Función para formatear el progreso del XP (opcional)
  const formatXP = (current, max) => `${current}/${max}`;

  return (
    <div
      className="fixed inset-0 bg-cover bg-center text-white overflow-auto"
      style={{ backgroundImage: `url(${background})` }}
    >
      <NavBarGame />
      <div className="flex flex-col items-center pt-28 px-4">
        <div className="self-start mb-4">
          <BackButton onClick={handleBackClick} />
        </div>

        {loading ? (
          <p className="text-lg">Cargando perfil...</p>
        ) : (
          <>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    #3b82f6 0deg,
                    #3b82f6 ${degrees}deg,
                    #1f2937 ${degrees}deg,
                    #1f2937 360deg
                  )`,
                }}
              />
              <div className="absolute inset-[4px] rounded-full overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={avatar || profilePic}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xl font-semibold">NvL {level}</p>
              <p className="text-sm text-gray-200">
                {experiencia} / {xpMax} XP
              </p>
            </div>
          </>
        )}

        <div className="mt-4 flex flex-col items-center bg-black/60 rounded-full px-4 py-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">{username}</span>
            <FaPen
              className="cursor-pointer hover:text-gray-300 transition"
              onClick={handleEditClick}
            />
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm">ID:</span>
            <span className="text-xs font-light">8jn2719j291002</span>
            <button className="text-lg hover:text-gray-300 transition">
              <FiCopy />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center space-x-1">
            <FaCheck className="text-green-400" />
            <span className="text-sm">Ganados: {winCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaTimes className="text-red-400" />
            <span className="text-sm">Perdidos: {lossCount}</span>
          </div>
        </div>

        {/* Sección de partidas */}
        <div className="mt-8 w-full max-w-md bg-black/60 rounded-lg p-4">
          <h2 className="text-center text-xl font-semibold mb-4">
            Últimas Partidas
          </h2>
          {partidas.length > 0 ? (
            <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
              {partidas.map((partida, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center rounded-md px-4 py-2 ${
                    partida.isWin ? "bg-green-900/20" : "bg-red-900/20"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {partida.isWin ? (
                      <FaCheck className="text-green-400 text-xl" />
                    ) : (
                      <FaTimes className="text-red-400 text-xl" />
                    )}
                    <span
                      className={`font-bold ${
                        partida.isWin ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {partida.result ||
                        (partida.isWin ? "Victoria" : "Derrota")}
                    </span>
                    <span className="text-sm">
                      {partida.username || "Jugador"} vs{" "}
                      {partida.rival || "Rival"}
                    </span>
                  </div>
                  <span className="font-semibold">{partida.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No hay partidas registradas.</p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-80">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Editar Username
            </h2>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none mb-4"
              value={usernameEdited}
              onChange={(e) => setUsernameEdited(e.target.value)}
            />
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition"
                onClick={handleSave}
              >
                Guardar
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
