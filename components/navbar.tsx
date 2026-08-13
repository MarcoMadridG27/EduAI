"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  Crown,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage } from "@/lib/LanguageContext";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

interface NavbarProps {
  user?: { name: string; email: string } | null;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  currentView?: string;
  onNavigateView?: (view: string) => void;
  /** landing-only: routes to /auth (or whatever the caller wants) for the bare marketing CTA */
  onLogin?: () => void;
  /** "landing" = bare marketing header, "app" = full product chrome. Defaults to "app". */
  variant?: "landing" | "app";
}

export function Navbar({
  user,
  onOpenProfile,
  onLogout,
  currentView,
  onNavigateView,
  onLogin,
  variant = "app",
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isRepoActive = pathname === "/repositorio" || currentView === "repository";
  const isGeneratorActive = currentView === "generator" && pathname !== "/repositorio";
  const isSubscriptionsActive = currentView === "subscriptions" || pathname === "/suscripciones";

  const handleGoToView = (viewName: string) => {
    setMobileMenuOpen(false);
    if (onNavigateView) {
      onNavigateView(viewName);
    } else if (viewName === "repository") {
      router.push("/repositorio");
    } else if (viewName === "generator") {
      router.push("/?view=generator");
    } else if (viewName === "subscriptions") {
      router.push("/suscripciones");
    }
  };

  const navItems = [
    { key: "repository", label: "Repositorio Público", icon: BookOpen, active: isRepoActive, primary: false },
    { key: "generator", label: "Generar Sesión", icon: Sparkles, active: isGeneratorActive, primary: true },
    { key: "subscriptions", label: "Planes & Suscripciones", icon: Crown, active: isSubscriptionsActive, primary: false },
  ] as const;

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--white) 92%, transparent)", borderColor: "var(--border-subtle)" }}
    >
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Educa +">
            <img src="/educa-logo.png" alt="Educa +" className="h-9 w-auto object-contain" />
          </Link>

          {variant === "app" && (
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-[var(--ds-radius-pill)]" style={{ background: "var(--bg-subtle)" }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleGoToView(item.key)}
                    className="relative px-3.5 py-1.5 rounded-[var(--ds-radius-pill)] text-[13px] font-semibold flex items-center gap-1.5 transition-colors"
                    style={{
                      color: item.active
                        ? item.primary
                          ? "var(--white)"
                          : "var(--ink-900)"
                        : "var(--ink-500)",
                    }}
                  >
                    {item.active && (
                      <motion.span
                        layoutId="nav-pill-active"
                        transition={{ duration: 0.22, ease: EASE_OUT }}
                        className="absolute inset-0 rounded-[var(--ds-radius-pill)]"
                        style={{
                          background: item.primary ? "var(--blue-500)" : "var(--white)",
                          boxShadow: item.primary ? "none" : "var(--shadow-xs)",
                        }}
                      />
                    )}
                    <Icon className="relative w-3.5 h-3.5" />
                    <span className="relative">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right side */}
        {variant === "landing" ? (
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/suscripciones"
              className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
              style={{ color: "var(--ink-700)" }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--blue-500)" }} />
              Suscripciones
            </Link>
            <LanguageSelector />
            <Button
              onClick={onLogin ?? (() => router.push("/auth"))}
              className="rounded-[var(--ds-radius-pill)] font-semibold h-9 px-5 text-[13px]"
              style={{ backgroundColor: "var(--blue-500)", color: "var(--white)" }}
            >
              {t("login")}
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-[var(--ds-radius-pill)] border transition-colors"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <div
                    className="w-7 h-7 rounded-full font-bold text-[11px] flex items-center justify-center"
                    style={{ backgroundColor: "var(--ink-900)", color: "var(--white)" }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "D"}
                  </div>
                  <span className="text-[13px] font-semibold" style={{ color: "var(--ink-800)" }}>
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${userDropdownOpen ? "rotate-180" : ""}`}
                    style={{ color: "var(--ink-300)" }}
                  />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: EASE_OUT }}
                      className="absolute right-0 mt-2 w-56 rounded-[var(--ds-radius-md)] py-2 z-50 origin-top-right"
                      style={{
                        background: "var(--white)",
                        border: "1px solid var(--border-subtle)",
                        boxShadow: "var(--shadow-md)",
                      }}
                    >
                      <div className="px-4 py-2 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                        <p className="text-[13px] font-semibold truncate" style={{ color: "var(--ink-900)" }}>
                          {user.name}
                        </p>
                        <p className="text-[11px] truncate" style={{ color: "var(--ink-500)" }}>
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenProfile?.();
                        }}
                        className="w-full px-4 py-2.5 text-[13px] font-medium flex items-center gap-2 text-left transition-colors"
                        style={{ color: "var(--ink-700)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-subtle)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <User className="w-4 h-4" style={{ color: "var(--blue-500)" }} />
                        Mi Perfil Docente
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleGoToView("subscriptions");
                        }}
                        className="w-full px-4 py-2.5 text-[13px] font-medium flex items-center gap-2 text-left transition-colors"
                        style={{ color: "var(--ink-700)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-subtle)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <Crown className="w-4 h-4" style={{ color: "var(--amber-500)" }} />
                        Mi Suscripción
                      </button>

                      <div className="border-t my-1" style={{ borderColor: "var(--border-subtle)" }} />

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout?.();
                        }}
                        className="w-full px-4 py-2.5 text-[13px] font-medium flex items-center gap-2 text-left transition-colors"
                        style={{ color: "var(--rose-500)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-subtle)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // guest-mode: no `user`, but we're past the landing route
              <Button
                onClick={() => router.push("/auth")}
                className="rounded-[var(--ds-radius-pill)] font-semibold h-9 px-5 text-[13px]"
                style={{ backgroundColor: "var(--blue-500)", color: "var(--white)" }}
              >
                Iniciar Sesión
              </Button>
            )}
          </div>
        )}

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2 rounded-[var(--ds-radius-sm)]"
            style={{ color: "var(--ink-700)" }}
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet — same items for both variants (landing just omits the pill group) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="md:hidden overflow-hidden"
            style={{ background: "var(--white)", borderTop: "1px solid var(--border-subtle)" }}
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {variant === "app" &&
                navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleGoToView(item.key)}
                      className="w-full text-left px-3 py-2.5 rounded-[var(--ds-radius-sm)] text-[13px] font-semibold flex items-center gap-2"
                      style={{
                        color: item.active ? "var(--blue-600)" : "var(--ink-700)",
                        background: item.active ? "var(--blue-50)" : "transparent",
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}

              {variant === "landing" && (
                <Link
                  href="/suscripciones"
                  className="w-full px-3 py-2.5 rounded-[var(--ds-radius-sm)] text-[13px] font-semibold flex items-center gap-2"
                  style={{ color: "var(--ink-700)" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Sparkles className="w-4 h-4" style={{ color: "var(--blue-500)" }} />
                  Suscripciones
                </Link>
              )}

              <div className="border-t my-2" style={{ borderColor: "var(--border-subtle)" }} />

              {variant === "landing" && (
                <div className="px-3 py-1">
                  <LanguageSelector />
                </div>
              )}

              {user ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile?.();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-[var(--ds-radius-sm)] text-[13px] font-semibold flex items-center gap-2"
                    style={{ color: "var(--blue-700)", background: "var(--blue-50)" }}
                  >
                    <User className="w-4 h-4" />
                    Mi Perfil Docente ({user.name.split(" ")[0]})
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout?.();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-[var(--ds-radius-sm)] text-[13px] font-semibold flex items-center gap-2"
                    style={{ color: "var(--rose-500)" }}
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (variant === "landing" && onLogin) {
                      onLogin();
                    } else {
                      router.push("/auth");
                    }
                  }}
                  className="w-full rounded-[var(--ds-radius-sm)] font-semibold h-10 text-[13px]"
                  style={{ backgroundColor: "var(--blue-500)", color: "var(--white)" }}
                >
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
