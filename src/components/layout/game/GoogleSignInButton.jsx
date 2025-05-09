import { useEffect } from "react";
import googleLogo from "../../../assets/googleLogo.png";
import { useTranslation } from "react-i18next";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleSignInButton = ({ onSuccess }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          console.log("Google token recibido:", response.credential);
          onSuccess(response.credential);
        },
      });
    }
  }, [onSuccess]);

  const handleClick = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center bg-gray-800 hover:bg-gray-700 border border-white rounded px-3 py-2"
    >
      <img src={googleLogo} alt="Google" className="w-5 mr-2" />
      {t("auth.googleLogin")}
    </button>
  );
};

export default GoogleSignInButton;
