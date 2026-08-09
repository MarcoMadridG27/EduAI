"use client";

import React, { useState, useEffect } from "react";
import { 
  School, MapPin, GraduationCap, Award, Brain, BookOpen, 
  Edit3, X, CheckCircle2, ShieldCheck, Sparkles, Building2, User
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeacherProfileData {
  user_email?: string;
  cod_mod?: string;
  nombre_ie?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  ubigeo?: string;
  gestion?: string;
  niveles?: string[];
  grados?: string[];
  areas?: string[];
  anos_experiencia?: string;
  objetivos?: string[];
  frecuencia_ia?: string;
}

interface ProfileModalProps {
  user: { name: string; email: string } | null;
  onClose: () => void;
  onEditProfile: () => void;
}

export function ProfileModal({ user, onClose, onEditProfile }: ProfileModalProps) {
  const [profile, setProfile] = useState<TeacherProfileData | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("eduai_teacher_profile");
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-[2rem] shadow-2xl text-slate-900 overflow-hidden my-auto transition-all duration-300 relative">
        
        {/* Header con Gradient Suave */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white p-6 border-b border-slate-200 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/educa-logo.png" alt="Educa+" className="h-10 w-auto object-contain drop-shadow-sm" />
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Mi Perfil Docente</h2>
              <p className="text-xs font-semibold text-slate-500">{user?.name || "Docente"} ({user?.email})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del Perfil */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto bg-white">
          
          {/* Tarjeta de Colegio */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <School className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-slate-900">Institución Educativa</h3>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                {profile?.gestion || "Pública"}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-lg font-bold text-slate-900">{profile?.nombre_ie || "Colegio No Especificado"}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-600 pt-1">
                {profile?.cod_mod && (
                  <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-semibold text-blue-900">
                    Cód. Modular: {profile.cod_mod}
                  </span>
                )}
                {profile?.distrito && (
                  <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                    📍 {profile.distrito}, {profile.provincia}, {profile.departamento}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Carga Lectiva y Especialidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Niveles y Grados */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <GraduationCap className="w-4 h-4" />
                <span>Niveles & Grados</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {profile?.niveles && profile.niveles.length > 0 ? (
                    profile.niveles.map((n) => (
                      <span key={n} className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                        {n}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No especificado</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {profile?.grados && profile.grados.length > 0 ? (
                    profile.grados.map((g) => (
                      <span key={g} className="bg-slate-200 text-slate-800 text-xs font-semibold px-2 py-0.5 rounded-md">
                        {g} Grado
                      </span>
                    ))
                  ) : null}
                </div>
              </div>
            </div>

            {/* Áreas Curriculares */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Áreas Curriculares (CNEB)</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile?.areas && profile.areas.length > 0 ? (
                  profile.areas.map((a) => (
                    <span key={a} className="bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No especificado</span>
                )}
              </div>
            </div>

          </div>

          {/* Experiencia & IA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Experiencia Docente</p>
                <p className="text-sm font-bold text-slate-900">{profile?.anos_experiencia || "3-5"} años</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Uso de IA</p>
                <p className="text-sm font-bold text-slate-900">{profile?.frecuencia_ia || "Frecuentemente"}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer con Botones */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
          >
            Cerrar
          </Button>

          <Button
            onClick={() => {
              onClose();
              onEditProfile();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-md shadow-blue-500/20"
          >
            <Edit3 className="w-4 h-4 mr-2" /> Editar Perfil
          </Button>
        </div>

      </div>
    </div>
  );
}
