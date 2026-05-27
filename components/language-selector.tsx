"use client"

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Language } from "@/lib/translations";
import { Globe, ChevronDown, Check, Sparkles } from "lucide-react";
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

  // Cultural representative gradients for flags
  const getLanguageGradient = (code: Language) => {
    switch (code) {
      case "es":
        return "bg-gradient-to-r from-red-500 via-yellow-400 to-red-500";
      case "en":
        return "bg-gradient-to-r from-blue-600 via-white to-red-500";
      case "qu":
        return "bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-purple-600"; // Rainbow (Tawantinsuyu)
      case "ay":
        return "bg-gradient-to-r from-orange-500 via-amber-300 via-emerald-400 to-indigo-600"; // Wiphala representative
      default:
        return "bg-gradient-to-r from-slate-400 to-slate-600";
    }
  };

  const getLanguageGlow = (code: Language) => {
    switch (code) {
      case "es":
        return "shadow-red-500/20 dark:shadow-red-500/10 border-red-500/30";
      case "en":
        return "shadow-blue-500/20 dark:shadow-blue-500/10 border-blue-500/30";
      case "qu":
        return "shadow-amber-500/20 dark:shadow-amber-500/10 border-amber-500/30";
      case "ay":
        return "shadow-emerald-500/20 dark:shadow-emerald-500/10 border-emerald-500/30";
      default:
        return "shadow-slate-500/20 border-slate-200";
    }
  };

  const getLanguageColorText = (code: Language) => {
    switch (code) {
      case "es":
        return "text-red-500 dark:text-red-400";
      case "en":
        return "text-blue-500 dark:text-blue-400";
      case "qu":
        return "text-amber-500 dark:text-amber-400";
      case "ay":
        return "text-emerald-500 dark:text-emerald-400";
      default:
        return "text-slate-500";
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.03, y: -0.5 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border ${getLanguageGlow(currentLang.code)} shadow-lg rounded-full py-1.5 px-4 text-slate-700 dark:text-slate-200 transition-all font-semibold text-xs md:text-sm select-none`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="relative flex items-center justify-center shrink-0">
          <Globe className="h-4 w-4 text-slate-400/80 animate-spin-slow" style={{ animationDuration: '20s' }} />
          <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${getLanguageGradient(currentLang.code)}`} />
        </div>
        
        <span className="hidden sm:inline font-bold tracking-tight text-slate-800 dark:text-slate-100">
          {currentLang.nativeName}
        </span>
        
        <span className="sm:hidden font-extrabold uppercase text-[10px] tracking-wider">
          {currentLang.code}
        </span>

        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, type: "spring", bounce: 0.25 }}
            className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-white/95 dark:bg-slate-950/95 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="py-3 px-2 space-y-1">
              <div className="px-3.5 py-1.5 text-[9px] font-black text-slate-400/90 dark:text-slate-500 uppercase tracking-widest select-none border-b border-slate-100 dark:border-slate-900/60 mb-1.5 flex items-center justify-between">
                <span>Idioma de la Plataforma</span>
                <Sparkles className="h-3 w-3 text-indigo-500 animate-pulse" />
              </div>
              
              {supportedLanguages.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <motion.button
                    whileHover={{ x: 3, scale: 1.01 }}
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all select-none ${
                      isSelected 
                        ? "bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-extrabold shadow-sm border border-indigo-100/40 dark:border-indigo-900/30" 
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50/80 dark:hover:bg-slate-900/60 font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Round Gradient Cultural Flag Representation */}
                      <div className={`w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-slate-200/50 dark:ring-slate-800/50 ${getLanguageGradient(lang.code)}`} />
                      
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm">{lang.nativeName}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium tracking-tight mt-0.5">{lang.region}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                        isSelected 
                          ? "bg-indigo-500/10 text-indigo-600 border-indigo-200/50" 
                          : "bg-slate-100/80 dark:bg-slate-900/80 text-slate-500 border-slate-200/60 dark:border-slate-800/60"
                      }`}>
                        {lang.code}
                      </span>
                      {isSelected && <Check className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
