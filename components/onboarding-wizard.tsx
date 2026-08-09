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
      const res = await fetch("/api/ubigeo/departamentos");
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
    if (!dept) return;
    try {
      const res = await fetch(`/api/ubigeo/provincias?departamento=${encodeURIComponent(dept)}`);
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
    if (!prov) return;
    try {
      const res = await fetch(`/api/ubigeo/distritos?departamento=${encodeURIComponent(selectedDept)}&provincia=${encodeURIComponent(prov)}`);
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

      const res = await fetch(`/api/colegios/search?${params.toString()}`);
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
      await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayload),
      });
    } catch (e) {
      console.error("Error guardando en backend", e);
    }

    toast.success("¡Bienvenido a Educa+! Tu perfil ha sido configurado.");
    onComplete(profilePayload);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-[2rem] shadow-2xl text-slate-900 overflow-hidden my-auto transition-all duration-300">
        
        {/* Banner Superior Limpio (Blanco con Gradient Suave) */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white p-6 border-b border-slate-200 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 border border-blue-400/40 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Bienvenido a Educa+, {userName.split(" ")[0]} 👋</h2>
                <p className="text-xs font-medium text-slate-600">Personaliza tu asistente docente inteligente</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-blue-700 bg-blue-100/80 border border-blue-200 px-3.5 py-1.5 rounded-full">
                Paso {step} de 5
              </span>
            </div>
          </div>

          {/* Barra de progreso limpia */}
          <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden border border-slate-300/50">
            <div 
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Cuerpo Dinámico por Pasos */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">
          
          {/* PASO 1: Ubicación & Colegio */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  ¿En qué colegio y región enseñas?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Busca tu colegio en el padrón oficial del MINEDU (106,705 colegios del Perú).
                </p>
              </div>

              {/* Desplegables de Ubigeo Limpios y Desplegables */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs font-bold text-slate-700 mb-1.5 block">Departamento</Label>
                  <select
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={selectedDept}
                    onChange={(e) => handleDeptChange(e.target.value)}
                  >
                    <option value="">:: Seleccionar ::</option>
                    {departamentos.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700 mb-1.5 block">Provincia</Label>
                  <select
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                    value={selectedProv}
                    onChange={(e) => handleProvChange(e.target.value)}
                    disabled={!selectedDept}
                  >
                    <option value="">:: Seleccionar ::</option>
                    {provincias.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700 mb-1.5 block">Distrito</Label>
                  <select
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                    value={selectedDist}
                    onChange={(e) => setSelectedDist(e.target.value)}
                    disabled={!selectedProv}
                  >
                    <option value="">:: Seleccionar ::</option>
                    {distritos.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Búsqueda de Colegio Autocomplete */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Buscar Colegio por nombre o Código Modular</span>
                  {isSearchingSchools && (
                    <span className="text-blue-600 flex items-center gap-1 text-[11px] font-semibold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Buscando colegios...
                    </span>
                  )}
                </Label>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <Input
                    placeholder="Ej. Alfonso Ugarte o 0603654..."
                    className="pl-10 h-11 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 rounded-xl text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Colegio Seleccionado */}
                {selectedSchool && (
                  <div className="p-4 bg-blue-50/80 border border-blue-300 rounded-2xl flex items-start justify-between gap-3 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                        <School className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{selectedSchool.nombre_ie}</h4>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-600 mt-1.5">
                          <span className="bg-blue-200/80 px-2 py-0.5 rounded text-blue-900 font-semibold">
                            Cód: {selectedSchool.cod_mod}
                          </span>
                          <span className="bg-slate-200/80 px-2 py-0.5 rounded text-slate-800">
                            {selectedSchool.nivel_modalidad}
                          </span>
                          <span className="bg-slate-200/80 px-2 py-0.5 rounded text-slate-800">
                            {selectedSchool.gestion}
                          </span>
                          <span className="font-medium">📍 {selectedSchool.distrito}, {selectedSchool.departamento}</span>
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  </div>
                )}

                {/* Resultados de búsqueda */}
                {!selectedSchool && schoolResults.length > 0 && (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {schoolResults.map((s) => (
                      <div
                        key={s.cod_mod}
                        onClick={() => handleSelectSchool(s)}
                        className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800 group-hover:text-blue-900">{s.nombre_ie}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Cod: <span className="font-semibold text-blue-700">{s.cod_mod}</span> | {s.nivel_modalidad} | {s.gestion} | {s.distrito}, {s.departamento}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold">
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
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  ¿A quiénes enseñas?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Selecciona tu nivel educativo, grados y áreas curriculares.
                </p>
              </div>

              {/* Nivel Educativo */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Nivel Educativo (Selección Múltiple)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {NIVELES.map((n) => {
                    const isSelected = selectedNiveles.includes(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => toggleArrayItem(selectedNiveles, setSelectedNiveles, n.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                          isSelected
                            ? "bg-blue-50 border-blue-600 text-blue-950 ring-2 ring-blue-500/20 shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-2xl">{n.icon}</span>
                        <div>
                          <p className="text-sm font-bold">{n.title}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{n.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grados */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Grados que enseñas</Label>
                <div className="flex flex-wrap gap-2">
                  {GRADOS.map((g) => {
                    const isSelected = selectedGrados.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleArrayItem(selectedGrados, setSelectedGrados, g)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
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
                <Label className="text-xs font-bold text-slate-700">Áreas Curriculares CNEB</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AREAS.map((a) => {
                    const isSelected = selectedAreas.includes(a.id);
                    return (
                      <div
                        key={a.id}
                        onClick={() => toggleArrayItem(selectedAreas, setSelectedAreas, a.id)}
                        className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                          isSelected
                            ? "bg-blue-50 border-blue-600 text-blue-900 shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
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
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  ¿Cuántos años llevas enseñando?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Esto nos permite calibrar las sugerencias pedagógicas de Educa+.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXPERIENCIA_OPTIONS.map((exp) => {
                  const isSelected = anosExperiencia === exp.id;
                  return (
                    <div
                      key={exp.id}
                      onClick={() => setAnosExperiencia(exp.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-blue-50 border-blue-600 text-blue-950 ring-2 ring-blue-500/20 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-bold text-slate-900">{exp.title}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          {exp.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{exp.desc}</p>
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
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  ¿Qué esperas lograr principalmente con Educa+?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Priorizaremos las herramientas clave en tu panel principal.
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
                          ? "bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-2xl">{obj.icon}</span>
                      <span className="text-xs font-semibold text-slate-800">{obj.title}</span>
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
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  ¿Con qué frecuencia utilizas Inteligencia Artificial?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Adaptaremos la interfaz para que tu trabajo sea 100% sencillo.
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
                          ? "bg-blue-50 border-blue-600 text-blue-950 ring-2 ring-blue-500/20 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <h4 className="text-sm font-bold text-slate-900">{f.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Botones de Navegación Limpios */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-slate-400 hover:text-slate-600 text-xs font-medium"
            >
              Omitir por ahora
            </Button>
          )}

          {step < 5 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-7 font-bold h-11 rounded-xl shadow-md shadow-blue-500/20"
            >
              Siguiente <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 h-11 rounded-xl shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4 mr-2" /> Finalizar y Comenzar
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
