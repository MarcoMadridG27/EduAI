"use client";

import React, { useState, useEffect, useTransition } from "react";
import { 
  Building2, MapPin, School, GraduationCap, BookOpen, UserCheck, 
  Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Search, Loader2,
  Brain, ShieldCheck, Check, Star, Layers, Briefcase, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface SchoolItem {
  cod_mod: string;
  cod_local?: string;
  nombre_ie: string;
  nivel_modalidad: string;
  gestion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  ubigeo: string;
  direccion?: string;
  director?: string;
}

interface OnboardingWizardProps {
  userEmail?: string;
  userName?: string;
  onComplete: (profile: any) => void;
  onSkip?: () => void;
}

const NIVELES = [
  { id: "Inicial", title: "Inicial", desc: "Jardín y cuna (3 a 5 años)", icon: "🎨" },
  { id: "Primaria", title: "Primaria", desc: "1° a 6° Grado", icon: "📚" },
  { id: "Secundaria", title: "Secundaria", desc: "1° a 5° Año", icon: "🧪" },
  { id: "EBA", title: "EBA", desc: "Educación Básica Alternativa", icon: "🌙" },
  { id: "EBE", title: "EBE", desc: "Educación Básica Especial", icon: "🧩" },
];

const GRADOS = ["1°", "2°", "3°", "4°", "5°", "6°"];

const AREAS = [
  { id: "Matemática", name: "Matemática", icon: "📐" },
  { id: "Comunicación", name: "Comunicación", icon: "📖" },
  { id: "Ciencia y Tecnología", name: "Ciencia y Tecnología", icon: "🔬" },
  { id: "DPCC", name: "DPCC (Desarrollo Personal)", icon: "⚖️" },
  { id: "Ciencias Sociales", name: "Ciencias Sociales", icon: "🌍" },
  { id: "EPT", name: "Educación para el Trabajo", icon: "🛠️" },
  { id: "Arte y Cultura", name: "Arte y Cultura", icon: "🎭" },
  { id: "Educación Física", name: "Educación Física", icon: "⚽" },
  { id: "Inglés", name: "Inglés", icon: "🗣️" },
  { id: "Educación Religiosa", name: "Educación Religiosa", icon: "🕊️" },
];

const EXPERIENCIA_OPTIONS = [
  { id: "0-2", title: "0 a 2 años", desc: "Docente en inicio o recién egresado", badge: "Explorador" },
  { id: "3-5", title: "3 a 5 años", desc: "Docente en consolidación", badge: "Profesional" },
  { id: "6-10", title: "6 a 10 años", desc: "Docente con amplia trayectoria", badge: "Experto" },
  { id: "10+", title: "Más de 10 años", desc: "Docente máster o directivo", badge: "Líder Pedagógico" },
];

const OBJETIVOS = [
  { id: "Generar sesiones", title: "Generar sesiones de aprendizaje CNEB", icon: "📝" },
  { id: "Crear experiencias", title: "Crear experiencias de aprendizaje (EdA)", icon: "🚀" },
  { id: "Evaluaciones y rúbricas", title: "Diseñar rúbricas y criterios de evaluación", icon: "📊" },
  { id: "Material pedagógico", title: "Fichas de trabajo e instrumentos de evaluación", icon: "📑" },
  { id: "Planificación anual", title: "Planificación curricular anual y unidades", icon: "🗓️" },
  { id: "Banco de preguntas", title: "Banco de preguntas y cuestionarios", icon: "❓" },
];

const FRECUENCIA_IA = [
  { id: "Nunca", title: "Primera vez", desc: "Es mi primer contacto con Inteligencia Artificial" },
  { id: "Pocas veces", title: "Ocasional", desc: "He usado ChatGPT u otras IA pocas veces" },
  { id: "Frecuentemente", title: "Frecuente", desc: "Uso herramientas de IA varias veces por semana" },
  { id: "Todos los días", title: "Diario", desc: "Uso IA a diario para mi trabajo docente" },
];

export function OnboardingWizard({ userEmail = "", userName = "Docente", onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Paso 1: Ubicación & Colegio
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [distritos, setDistritos] = useState<string[]>([]);
  
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedProv, setSelectedProv] = useState("");
  const [selectedDist, setSelectedDist] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolResults, setSchoolResults] = useState<SchoolItem[]>([]);
  const [isSearchingSchools, setIsSearchingSchools] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolItem | null>(null);

  // Paso 2: Niveles, Grados & Áreas
  const [selectedNiveles, setSelectedNiveles] = useState<string[]>(["Secundaria"]);
  const [selectedGrados, setSelectedGrados] = useState<string[]>(["1°", "2°"]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(["Matemática"]);

  // Paso 3: Experiencia
  const [anosExperiencia, setAnosExperiencia] = useState("3-5");

  // Paso 4: Objetivos
  const [selectedObjetivos, setSelectedObjetivos] = useState<string[]>(["Generar sesiones", "Crear experiencias"]);

  // Paso 5: Frecuencia IA
  const [frecuenciaIa, setFrecuenciaIa] = useState("Frecuentemente");

  // Cargar departamentos al iniciar
  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchDepartamentos = async () => {
    try {
      const res = await fetch("/core/api/ubigeo/departamentos");
      if (!res.ok) return;
      const data = await res.json();
      if (data.departamentos) setDepartamentos(data.departamentos);
    } catch (e) {
      console.error("Error cargando departamentos", e);
    }
  };

  const handleDeptChange = async (dept: string) => {
    setSelectedDept(dept);
    setSelectedProv("");
    setSelectedDist("");
    setProvincias([]);
    setDistritos([]);
    try {
      const res = await fetch(`/core/api/ubigeo/provincias?departamento=${encodeURIComponent(dept)}`);
      const data = await res.json();
      if (data.provincias) setProvincias(data.provincias);
    } catch (e) {
      console.error(e);
    }
  };

  const handleProvChange = async (prov: string) => {
    setSelectedProv(prov);
    setSelectedDist("");
    setDistritos([]);
    try {
      const res = await fetch(`/core/api/ubigeo/distritos?departamento=${encodeURIComponent(selectedDept)}&provincia=${encodeURIComponent(prov)}`);
      const data = await res.json();
      if (data.distritos) setDistritos(data.distritos);
    } catch (e) {
      console.error(e);
    }
  };

  // Buscar colegios incrementalmente
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2 || selectedDist) {
        searchSchools();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedDept, selectedProv, selectedDist]);

  const searchSchools = async () => {
    setIsSearchingSchools(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("q", searchQuery.trim());
      if (selectedDept) params.append("departamento", selectedDept);
      if (selectedProv) params.append("provincia", selectedProv);
      if (selectedDist) params.append("distrito", selectedDist);
      params.append("limit", "15");

      const res = await fetch(`/core/api/colegios/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSchoolResults(data.colegios || []);
      }
    } catch (e) {
      console.error("Error buscando colegios", e);
    } finally {
      setIsSearchingSchools(false);
    }
  };

  const handleSelectSchool = (school: SchoolItem) => {
    setSelectedSchool(school);
    setSelectedDept(school.departamento);
    setSelectedProv(school.provincia);
    setSelectedDist(school.distrito);
    if (school.nivel_modalidad && !selectedNiveles.includes(school.nivel_modalidad)) {
      setSelectedNiveles([school.nivel_modalidad]);
    }
    toast.success(`Colegio "${school.nombre_ie}" seleccionado`);
  };

  const toggleArrayItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setList(list.filter((i) => i !== item));
      }
    } else {
      setList([...list, item]);
    }
  };

  const handleFinish = async () => {
    const profilePayload = {
      user_email: userEmail,
      cod_mod: selectedSchool?.cod_mod || "",
      nombre_ie: selectedSchool?.nombre_ie || "Colegio No Especificado",
      departamento: selectedDept,
      provincia: selectedProv,
      distrito: selectedDist,
      ubigeo: selectedSchool?.ubigeo || "",
      gestion: selectedSchool?.gestion || "Pública",
      niveles: selectedNiveles,
      grados: selectedGrados,
      areas: selectedAreas,
      anos_experiencia: anosExperiencia,
      objetivos: selectedObjetivos,
      frecuencia_ia: frecuenciaIa,
      onboarding_completed: true,
    };

    // Guardar en localStorage para disponibilidad local instantánea
    try {
      localStorage.setItem("eduai_teacher_profile", JSON.stringify(profilePayload));
    } catch (e) {
      console.error(e);
    }

    // Guardar en backend
    try {
      await fetch("/core/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayload),
      });
    } catch (e) {
      console.error("Error guardando en backend", e);
    }

    toast.success("¡Bienvenido a EduAI! Tu perfil ha sido configurado.");
    onComplete(profilePayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900/95 border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-950/50 text-slate-100 overflow-hidden my-auto transition-all duration-300">
        
        {/* Banner Superior con Progreso */}
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900 p-6 border-b border-indigo-500/20 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Bienvenido a EduAI, {userName.split(" ")[0]} 👋</h2>
                <p className="text-xs text-indigo-200/70">Personaliza tu asistente docente inteligente</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 px-3 py-1 rounded-full">
                Paso {step} de 5
              </span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Cuerpo Dinámico por Pasos */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* PASO 1: Ubicación & Colegio */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  ¿En qué colegio y región enseñas?
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Busca tu institución educativa en el padrón oficial del MINEDU (106,705 colegios del Perú).
                </p>
              </div>

              {/* Cascadas Ubigeo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-slate-300 mb-1.5 block">Departamento</Label>
                  <Select value={selectedDept} onValueChange={handleDeptChange}>
                    <SelectTrigger className="bg-slate-800/80 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 max-h-60">
                      {departamentos.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-slate-300 mb-1.5 block">Provincia</Label>
                  <Select value={selectedProv} onValueChange={handleProvChange} disabled={!selectedDept}>
                    <SelectTrigger className="bg-slate-800/80 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 max-h-60">
                      {provincias.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-slate-300 mb-1.5 block">Distrito</Label>
                  <Select value={selectedDist} onValueChange={(d) => setSelectedDist(d)} disabled={!selectedProv}>
                    <SelectTrigger className="bg-slate-800/80 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 max-h-60">
                      {distritos.map((dist) => (
                        <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Búsqueda de Colegio Autocomplete */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Buscar Colegio por nombre o Código Modular</span>
                  {isSearchingSchools && (
                    <span className="text-indigo-400 flex items-center gap-1 text-[11px]">
                      <Loader2 className="w-3 h-3 animate-spin" /> Buscando en padrón...
                    </span>
                  )}
                </Label>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <Input
                    placeholder="Ej. Alfonso Ugarte o 0603654..."
                    className="pl-9 bg-slate-800/90 border-indigo-500/30 text-white placeholder:text-slate-500 focus:border-indigo-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Colegio Seleccionado */}
                {selectedSchool && (
                  <div className="p-4 bg-indigo-950/40 border border-indigo-500/40 rounded-2xl flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 mt-0.5">
                        <School className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{selectedSchool.nombre_ie}</h4>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-300 mt-1">
                          <span className="bg-indigo-900/60 px-2 py-0.5 rounded text-indigo-200 border border-indigo-500/30">
                            Cód: {selectedSchool.cod_mod}
                          </span>
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                            {selectedSchool.nivel_modalidad}
                          </span>
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                            {selectedSchool.gestion}
                          </span>
                          <span>📍 {selectedSchool.distrito}, {selectedSchool.departamento}</span>
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  </div>
                )}

                {/* Resultados de búsqueda */}
                {!selectedSchool && schoolResults.length > 0 && (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {schoolResults.map((s) => (
                      <div
                        key={s.cod_mod}
                        onClick={() => handleSelectSchool(s)}
                        className="p-3 bg-slate-800/60 hover:bg-indigo-900/40 border border-slate-700/60 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-200 group-hover:text-white">{s.nombre_ie}</p>
                          <p className="text-xs text-slate-400">
                            Cod: <span className="text-indigo-300">{s.cod_mod}</span> | {s.nivel_modalidad} | {s.gestion} | {s.distrito}, {s.departamento}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-white">
                          Seleccionar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 2: Niveles, Grados & Áreas */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  ¿A quiénes enseñas?
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Selecciona tu nivel educativo, los grados y las áreas curriculares que tienes a tu cargo.
                </p>
              </div>

              {/* Nivel Educativo */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-300">Nivel Educativo (Selección Múltiple)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {NIVELES.map((n) => {
                    const isSelected = selectedNiveles.includes(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => toggleArrayItem(selectedNiveles, setSelectedNiveles, n.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 flex items-center gap-2.5 ${
                          isSelected
                            ? "bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-950/50"
                            : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-500"
                        }`}
                      >
                        <span className="text-xl">{n.icon}</span>
                        <div>
                          <p className="text-sm font-bold">{n.title}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{n.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grados */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-300">Grados que enseñas</Label>
                <div className="flex flex-wrap gap-2">
                  {GRADOS.map((g) => {
                    const isSelected = selectedGrados.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleArrayItem(selectedGrados, setSelectedGrados, g)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-400 shadow-md"
                            : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        {g} Grado
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Áreas Curriculares */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-300">Áreas Curriculares CNEB</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AREAS.map((a) => {
                    const isSelected = selectedAreas.includes(a.id);
                    return (
                      <div
                        key={a.id}
                        onClick={() => toggleArrayItem(selectedAreas, setSelectedAreas, a.id)}
                        className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${
                          isSelected
                            ? "bg-indigo-600/30 border-indigo-400 text-white"
                            : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span>{a.icon}</span>
                        <span className="truncate">{a.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Experiencia Docente */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  ¿Cuántos años llevas enseñando?
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Esto nos permite calibrar la profundidad pedagógica y las sugerencias didácticas de EduAI.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXPERIENCIA_OPTIONS.map((exp) => {
                  const isSelected = anosExperiencia === exp.id;
                  return (
                    <div
                      key={exp.id}
                      onClick={() => setAnosExperiencia(exp.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative ${
                        isSelected
                          ? "bg-indigo-600/30 border-indigo-400 text-white ring-2 ring-indigo-500/50"
                          : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-bold text-white">{exp.title}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-900/60 border border-indigo-500/30 text-indigo-300">
                          {exp.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{exp.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 4: Objetivos */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  ¿Qué esperas lograr principalmente con EduAI?
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Priorizaremos las herramientas y módulos más relevantes en tu panel principal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OBJETIVOS.map((obj) => {
                  const isSelected = selectedObjetivos.includes(obj.id);
                  return (
                    <div
                      key={obj.id}
                      onClick={() => toggleArrayItem(selectedObjetivos, setSelectedObjetivos, obj.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? "bg-purple-600/30 border-purple-400 text-white"
                          : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="text-2xl">{obj.icon}</span>
                      <span className="text-xs font-semibold">{obj.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 5: Frecuencia de uso de IA */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  ¿Con qué frecuencia utilizas Inteligencia Artificial?
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Adaptaremos las explicaciones e interfaces para que tu experiencia sea totalmente fluida.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FRECUENCIA_IA.map((f) => {
                  const isSelected = frecuenciaIa === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setFrecuenciaIa(f.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-600/30 border-indigo-400 text-white ring-2 ring-indigo-500/50"
                          : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <h4 className="text-sm font-bold text-white">{f.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Botones de Navegación del Onboarding */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              Omitir por ahora
            </Button>
          )}

          {step < 5 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 font-semibold shadow-lg shadow-indigo-900/40"
            >
              Siguiente <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-8 shadow-xl shadow-emerald-950/50"
            >
              <Check className="w-4 h-4 mr-2" /> Finalizar y Comenzar
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
