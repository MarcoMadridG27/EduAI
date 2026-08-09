"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sparkles, BookOpen, Crown, User, LogOut, UserCheck, 
  Menu, X, ChevronDown, Layers, ShieldCheck, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  user?: { name: string; email: string } | null;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  currentView?: string;
  onNavigateView?: (view: string) => void;
}

export function Navbar({ user, onOpenProfile, onLogout, currentView, onNavigateView }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isRepoActive = pathname === "/repositorio" || currentView === "repository";
  const isGeneratorActive = currentView === "generator" && pathname !== "/repositorio";
  const isSubscriptionsActive = currentView === "subscriptions" || pathname === "/suscripciones";

  const handleGoToView = (viewName: string) => {
    setMobileMenuOpen(false);
    if (onNavigateView) {
      onNavigateView(viewName);
    } else {
      if (viewName === "repository") {
        router.push("/repositorio");
      } else if (viewName === "generator") {
        router.push("/?view=generator");
      } else if (viewName === "subscriptions") {
        router.push("/suscripciones");
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO PNG EDUCA+ */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/educa-logo.png"
              alt="Educa +"
              className="h-10 w-auto object-contain drop-shadow-sm group-hover:opacity-85 transition-opacity"
            />
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 ml-4">
            <button
              onClick={() => handleGoToView("repository")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isRepoActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Repositorio Público</span>
            </button>

            <button
              onClick={() => handleGoToView("generator")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isGeneratorActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Generar Sesión</span>
            </button>

            <button
              onClick={() => handleGoToView("subscriptions")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isSubscriptionsActive
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Planes & Suscripciones</span>
            </button>
          </nav>
        </div>

        {/* Acciones de Usuario (Derecha) */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "D"}
                </div>
                <div className="max-w-[120px] truncate">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate">{user.name.split(" ")[0]}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown del Menú de Usuario */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onOpenProfile) onOpenProfile();
                    }}
                    className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 text-left"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Mi Perfil Docente</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleGoToView("subscriptions");
                    }}
                    className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2 text-left"
                  >
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>Mi Suscripción</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => router.push("/auth")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-sm"
            >
              Iniciar Sesión
            </Button>
          )}
        </div>

        {/* Botón menú Mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Menú Desplegable Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => handleGoToView("repository")}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-blue-600" /> Repositorio Público
          </button>

          <button
            onClick={() => handleGoToView("generator")}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" /> Generar Sesión
          </button>

          <button
            onClick={() => handleGoToView("subscriptions")}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <Crown className="w-4 h-4 text-amber-500" /> Planes & Suscripciones
          </button>

          {user ? (
            <>
              <div className="border-t border-slate-100 pt-2" />
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenProfile) onOpenProfile();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 flex items-center gap-2"
              >
                <User className="w-4 h-4" /> Mi Perfil Docente ({user.name.split(" ")[0]})
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </button>
            </>
          ) : (
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push("/auth");
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 rounded-xl"
            >
              Iniciar Sesión
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
