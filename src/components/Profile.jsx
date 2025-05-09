import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/layout/game/BackButton";
import background from "../assets/background.png";
import { FaTimes, FaCheck, FaPen } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { getProfile, updateProfile } from "../services/api/profileApi";
import { getToken } from "../services/api/authApi";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const token = getToken();
  const [infoUser, setInfoUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        console.log("Perfil obtenido:", data);
        setInfoUser(data);
        setNewUsername(data.data.username);
        setSelectedAvatar(data.data.avatar);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const avatar = infoUser?.data?.avatar || "";
  const username = infoUser?.data?.username || "Cargando...";
  const level = infoUser?.data?.level || 1;
  const experiencia = infoUser?.data?.experience || 0;
  const xpMax = infoUser?.data?.xpMax ? Math.floor(infoUser.data.xpMax) : 1;
  const friendCode = infoUser?.data?.friend_code || "";
  const progress = experiencia / xpMax;
  const degrees = progress * 360;
  const partidas = infoUser?.data?.partidas || [];

  const winCount = partidas.filter((p) => p.isWin).length;
  const lossCount = partidas.filter((p) => !p.isWin).length;

  const avatars = Array.from(
    { length: 8 },
    (_, i) => `/assets/profile_${i + 1}.png`
  );

  const handleEditClick = () => {
    setNewUsername(username);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile({ username: newUsername });
      const data = await getProfile();
      setInfoUser(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewUsername(username);
  };

  const handleAvatarClick = () => {
    setIsEditingAvatar(true);
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleSaveAvatar = async () => {
    try {
      await updateProfile({ avatar: selectedAvatar });
      const data = await getProfile();
      setInfoUser(data);
      setIsEditingAvatar(false);
    } catch (error) {
      console.error("Error al actualizar el avatar:", error);
    }
  };

  const handleCancelAvatar = () => {
    setIsEditingAvatar(false);
    setSelectedAvatar(avatar);
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  const handleLogrosClick = () => {
    navigate("/logros");
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center text-white overflow-auto"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex flex-col items-center pt-5 px-4">
        <div className="self-start mb-4">
          <BackButton onClick={handleBackClick} />
        </div>

        {loading ? (
          <p className="text-lg">{t("profile.loading")}</p>
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
              <div
                className="absolute inset-[4px] rounded-full overflow-hidden bg-black flex items-center justify-center cursor-pointer"
                onClick={handleAvatarClick}
              >
                <img
                  src={avatar}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xl font-semibold">
                {t("profile.level")} {level}
              </p>
              <p className="text-sm text-gray-200">
                {experiencia} / {xpMax} XP
              </p>
            </div>
          </>
        )}

        <div className="mt-4 flex flex-col items-center bg-black/60 rounded-full px-10 py-2 shadow-md">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">{username}</span>
            <FaPen
              className="cursor-pointer hover:text-gray-300 transition"
              onClick={handleEditClick}
            />
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm">{t("profile.id")}</span>
            <span className="text-xs font-light">{friendCode}</span>
            <button
              className="text-lg text-black hover:text-blue-700 transition"
              onClick={() => {
                navigator.clipboard.writeText(friendCode);
              }}
            >
              <FiCopy />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center space-x-1">
            <FaCheck className="text-green-400" />
            <span className="text-sm">
              {t("profile.wins", { count: winCount })}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <FaTimes className="text-red-400" />
            <span className="text-sm">
              {" "}
              {t("profile.losses", { count: lossCount })}
            </span>
          </div>
        </div>

        <div className="mt-8 w-full max-w-xl bg-black/70 rounded-lg p-4 shadow-lg">
          <h2 className="text-center text-xl font-semibold mb-4 text-blue-100">
            {t("profile.lastMatches")}
          </h2>
          {partidas.length > 0 ? (
            <div className="max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-none">
              {partidas.map((partida, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center rounded-md px-4 py-3 ${
                    partida.isWin ? "bg-green-900/30" : "bg-red-900/30"
                  } border-l-4 ${
                    partida.isWin ? "border-green-400" : "border-red-400"
                  } hover:bg-opacity-50 transition-all duration-200`}
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
                        (partida.isWin
                          ? t("profile.victory")
                          : t("profile.defeat"))}
                    </span>
                    <span className="text-sm">
                      {partida.username || t("profile.player")} vs{" "}
                      {partida.rival || t("profile.rival")}
                    </span>
                  </div>
                  <span className="font-semibold">{partida.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">{t("profile.noMatches")}</p>
          )}
        </div>

        <div className="mt-16 w-full max-w-xl">
          <button
            onClick={handleLogrosClick}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all shadow-lg font-medium transform hover:-translate-y-0.5"
          >
            {t("profile.achievements")}{" "}
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-80 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {t("profile.editing.title")}{" "}
            </h2>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition"
                onClick={handleSave}
              >
                {t("profile.save")}
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition"
                onClick={handleCancel}
              >
                {t("profile.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingAvatar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {t("profile.avatar.select")}
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className={`cursor-pointer p-2 rounded-lg ${
                    selectedAvatar === avatar
                      ? "border-2 border-blue-500"
                      : "border-2 border-transparent"
                  } hover:bg-gray-700 transition-all`}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-around mt-6">
              <button
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition"
                onClick={handleSaveAvatar}
              >
                {t("profile.avatar.save")}
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition"
                onClick={handleCancelAvatar}
              >
                {t("profile.avatar.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
