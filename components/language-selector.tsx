"use client"

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Language } from "@/lib/translations";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LanguageSelector() {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentLang = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Color badges for languages to make it look premium
  const getBadgeStyle = (code: Language) => {
    switch (code) {
      case "es":
        return "bg-rose-50 text-rose-600 border-rose-200";
      case "en":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "qu":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "ay":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm rounded-full py-1.5 px-3.5 text-slate-700 dark:text-slate-200 hover:border-slate-300 transition-all font-medium text-xs md:text-sm select-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="h-3.5 w-3.5 text-slate-400 animate-spin-slow" style={{ animationDuration: '10s' }} />
        <span className="hidden sm:inline">{currentLang.nativeName}</span>
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getBadgeStyle(currentLang.code)}`}>
          {currentLang.code}
        </span>
        <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18, type: "spring", bounce: 0.2 }}
            className="absolute right-0 mt-2.5 w-60 origin-top-right rounded-2xl bg-white/95 dark:bg-slate-950/95 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-lg shadow-2xl z-50 overflow-hidden"
          >
            <div className="py-2.5 px-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none border-b border-slate-100 dark:border-slate-900 mb-1">
                Idioma de la Plataforma
              </div>
              {supportedLanguages.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-900 select-none ${
                      isSelected ? "bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm">{lang.nativeName}</span>
                      <span className="text-[9px] text-slate-400 font-normal">{lang.region}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getBadgeStyle(lang.code)}`}>
                        {lang.code}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
