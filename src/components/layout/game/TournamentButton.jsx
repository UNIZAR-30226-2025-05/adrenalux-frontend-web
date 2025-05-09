import { FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function TournamentButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    navigate("/torneo");
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center justify-center text-white bg-transparent p-2 sm:p-3 md:p-4 
                w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32
                hover:scale-105 transition-transform focus:outline-none"
    >
      <FaTrophy className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-2 md:mb-3" />
      <span className="bg-black/80 px-2 py-1 text-xs sm:text-sm rounded-sm whitespace-nowrap">
        {t("home.tournament")}
      </span>
    </button>
  );
}
