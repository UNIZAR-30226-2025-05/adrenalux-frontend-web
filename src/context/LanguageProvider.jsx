import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import "../i18n/config";

const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();

  // 1. Estado inicial
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem("language") || "es"
  );

  const changeLanguage = useCallback(
    (lang) => {
      setCurrentLanguage(lang);
      localStorage.setItem("language", lang);
      i18n.changeLanguage(lang);
    },
    [i18n] // solo depende de i18n (estable)
  );

  useEffect(() => {
    changeLanguage(currentLanguage);
  }, []);

  const value = useMemo(
    () => ({ currentLanguage, changeLanguage }),
    [currentLanguage, changeLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
