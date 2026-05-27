"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, TranslationDictionary } from "./translations";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationDictionary) => string;
  supportedLanguages: Array<{ code: Language; name: string; nativeName: string; region: string }>;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("es");

  const supportedLanguages: Array<{ code: Language; name: string; nativeName: string; region: string }> = [
    { code: "es", name: "Español", nativeName: "Español", region: "Perú / España" },
    { code: "en", name: "Inglés", nativeName: "English", region: "International" },
    { code: "qu", name: "Quechua", nativeName: "Runasimi (Qichwa)", region: "Andes Peruano" },
    { code: "ay", name: "Aymara", nativeName: "Aymar aru", region: "Altiplano Peruano" },
  ];

  // Restore language from localStorage
  useEffect(() => {
    const storedLang = localStorage.getItem("language") as Language;
    if (storedLang && ["es", "en", "qu", "ay"].includes(storedLang)) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: keyof TranslationDictionary): string => {
    const translationSet = translations[language] || translations["es"];
    const translation = translationSet[key];
    if (translation === undefined) {
      // Fallback to Spanish if translation is missing
      return translations["es"][key] || String(key);
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
