"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/LanguageContext"
import { ArrowLeft, Clock, BookOpen, Users, Target, Brain, Sparkles, Loader2, BarChart3, PieChart as PieChartIcon, Filter, Share2, Heart } from "lucide-react"
import type { SessionData } from "@/app/page"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

interface TeacherDashboardProps {
  readonly user: { readonly name: string; readonly email: string }
  readonly sessions: readonly SessionData[]
  readonly onBack: () => void
  readonly onOpenSession: (session: SessionData) => void
}

const COLORS = ['#2563eb', '#4f46e5', '#10b981', '#8b5cf6', '#ec4899', '#f97316'];

export function TeacherDashboard({ user, sessions, onBack, onOpenSession }: Readonly<TeacherDashboardProps>) {
  const { t } = useLanguage()
  const [savedSessions, setSavedSessions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions'>('overview')
  const [groupBy, setGroupBy] = useState<'recientes' | 'bimestre' | 'curso'>('recientes')

  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || ""

  // Cargar sesiones guardadas del backend
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const accessToken = localStorage.getItem("access_token")
        if (!accessToken) return

        const res = await fetch(`${AUTH_URL}/sessions?user_id=${user.email}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          // Extract session data from SessionOut structure { id, user_id, session_data }
          const formattedSessions = data.map((s: any) => ({
            id: s.id,
            session_data: {
              ...s.session_data,
              id: s.id,
              session_id: s.session_data?.session_id || s.id,
              created_at: s.created_at
            },
            created_at: s.created_at
          }))
          setSavedSessions(formattedSessions)
        }
      } catch (err) {
        console.error("Error cargando sesiones:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSessions()
  }, [user.email, AUTH_URL])

  // KPIs
  const totalSessions = savedSessions.length
  const timesSaved = totalSessions * 45 // 45 minutos por sesión
  const competenciasUsadas = new Set(savedSessions.flatMap((s) => s.session_data?.competenciasSeleccionadas || [])).size
  const contextsUsed = new Set(savedSessions.map((s) => s.session_data?.contexto).filter(Boolean)).size

  const sesionesPublicadas = savedSessions.filter(s => s.session_data?.is_public).length
  const totalLikes = savedSessions.reduce((acc, s) => acc + (s.session_data?.likes || 0), 0)

  // Stats para Gráficos
  const sessionsByMonth = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    // Inicializar los últimos 6 meses para que el gráfico no esté vacío
    const currentMonth = new Date().getMonth();
    const data: { name: string; sesiones: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const mIndex = (currentMonth - i + 12) % 12;
      data.push({ name: months[mIndex], sesiones: 0 });
    }

    savedSessions.forEach(item => {
      try {
        const date = new Date(item.created_at);
        const monthName = months[date.getMonth()];
        const entry = data.find(d => d.name === monthName);
        if (entry) {
          entry.sesiones += 1;
        }
      } catch (e) {
        console.warn("Error parsing session created_at date:", e);
      }
    });
    return data;
  }, [savedSessions]);

  const activityByCycle = useMemo(() => {
    const counts: Record<string, number> = {};
    savedSessions.forEach(item => {
      const ciclo = item.session_data?.ciclo || 'Desconocido';
      counts[ciclo] = (counts[ciclo] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [savedSessions]);

  const topCompetencies = useMemo(() => {
    const counts: Record<string, number> = {};
    const compsList = savedSessions.flatMap(item => item.session_data?.competenciasSeleccionadas || []);
    
    compsList.forEach((c: string) => {
      // Acortar nombre para el gráfico
      let shortName: string;
      if (c.includes("Resuelve problemas de cantidad")) shortName = "Cantidad";
      else if (c.includes("regularidad, equivalencia y cambio")) shortName = "Regularidad y Cambio";
      else if (c.includes("forma, movimiento y localización")) shortName = "Forma y Movimiento";
      else if (c.includes("gestión de datos e incertidumbre")) shortName = "Datos e Incertidumbre";
      else shortName = c.substring(0, 20) + "...";

      counts[shortName] = (counts[shortName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [savedSessions]);

  // Agrupamiento de Sesiones
  const groupedSessions = useMemo(() => {
    if (groupBy === 'recientes') {
      return { 'Todas las Sesiones': savedSessions };
    }

    if (groupBy === 'bimestre') {
      const groups: Record<string, any[]> = {
        'I Bimestre (Ene-Mar)': [],
        'II Bimestre (Abr-May)': [],
        'III Bimestre (Jun-Ago)': [],
        'IV Bimestre (Sep-Dic)': [],
      };

      savedSessions.forEach(item => {
        const month = new Date(item.created_at).getMonth() + 1;
        if (month <= 3) groups['I Bimestre (Ene-Mar)'].push(item);
        else if (month <= 5) groups['II Bimestre (Abr-May)'].push(item);
        else if (month <= 8) groups['III Bimestre (Jun-Ago)'].push(item);
        else groups['IV Bimestre (Sep-Dic)'].push(item);
      });

      return Object.fromEntries(Object.entries(groups).filter(([k, v]) => v.length > 0));
    }

    if (groupBy === 'curso') {
      // Simulado: Agrupar por áreas de matemática u otro curso en el futuro
      const groups: Record<string, any[]> = {};
      savedSessions.forEach(item => {
        const area = item.session_data?.area || 'Matemática';
        if (!groups[area]) groups[area] = [];
        groups[area].push(item);
      });
      return groups;
    }

    return { 'Sesiones': savedSessions };
  }, [savedSessions, groupBy]);

  const renderSessionCard = (item: any, index: number) => {
    const session = item.session_data
    return (
      <button
        key={item.id}
        onClick={() => onOpenSession(session)}
        className="w-full text-left p-5 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 border-l-4 group"
        style={{ borderLeftColor: COLORS[index % COLORS.length] }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
          <div>
            <h4 className="font-bold text-lg text-slate-800 group-hover:text-blue-700 transition-colors">
              {session.tema}
            </h4>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Ciclo {session.ciclo} • {formatDate(item.created_at)}
            </p>
          </div>
          <Badge className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 shadow-sm shrink-0">
            <Brain className="h-3 w-3 mr-1" />
            IA + Currículo
          </Badge>
        </div>

        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed bg-slate-50 rounded p-2 mb-3">
          {session.competenciaDescripcion || "Sesión generada con inteligencia artificial."}
        </p>

        <div className="flex flex-wrap gap-2 items-center text-xs text-slate-500">
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {session.horasClase} h
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center line-clamp-1 max-w-[200px]">
            <Users className="h-3 w-3 mr-1 shrink-0" /> {session.contexto}
          </span>
        </div>
      </button>
    )
  }

  const renderSessionList = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-slate-500 font-medium">{t("loading")}</p>
        </div>
      )
    }
    if (Object.keys(groupedSessions).length === 0 || savedSessions.length === 0) {
      return (
        <div className="text-center py-16 px-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <img src="/pinguinos/pinguino_chill.png" alt="Pingüino" className="w-32 h-32 object-contain opacity-80" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {t("noSessions")}
          </h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            {t("dashboardSubtitle")}
          </p>
          <Button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md rounded-xl h-12 px-6"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {t("newSession")}
          </Button>
        </div>
      )
    }
    return (
      <div className="space-y-8">
        {Object.entries(groupedSessions).map(([groupName, groupSessions]) => (
          <div key={groupName} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              {groupName}
              <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full ml-2">
                {groupSessions.length}
              </span>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {groupSessions.map((item, index) => renderSessionCard(item, index))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es-PE", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch {
      return "N/A"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative font-sans">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-400 rounded-full blur-[120px] opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 relative z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="hover:bg-slate-100 text-slate-600 font-medium h-10 px-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back")}
            </Button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <img src="/educa-logo.png" alt="Educa +" className="h-10 md:h-12 w-auto object-contain drop-shadow-sm" />
              <div>
                <h1 className="font-bold text-xl text-slate-800">
                  Dashboard de {user.name.split(' ')[0]}
                </h1>
                <p className="text-xs text-slate-500 font-medium">{t("dashboardSubtitle")}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">

          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* TAB NAVIGATION */}
          <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 w-full max-w-sm mx-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BarChart3 className="w-4 h-4" />
              {t("overview")}
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'sessions' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BookOpen className="w-4 h-4" />
              {t("mySessions")}
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 border-b border-slate-100">
                    <CardTitle className="text-sm font-semibold text-slate-600">{t("createdSessions")}</CardTitle>
                    <div className="bg-blue-100 rounded-full p-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-3xl font-bold text-slate-800">
                      {totalSessions}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Total generadas con IA</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 border-b border-slate-100">
                    <CardTitle className="text-sm font-semibold text-slate-600">{t("timeSaved")}</CardTitle>
                    <div className="bg-indigo-100 rounded-full p-2">
                      <Clock className="h-4 w-4 text-indigo-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-3xl font-bold text-slate-800">
                      {Math.floor(timesSaved / 60)}h {timesSaved % 60}m
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">En planificación docente</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 border-b border-slate-100">
                    <CardTitle className="text-sm font-semibold text-slate-600">{t("competencies")}</CardTitle>
                    <div className="bg-emerald-100 rounded-full p-2">
                      <Target className="h-4 w-4 text-emerald-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-3xl font-bold text-slate-800">
                      {competenciasUsadas}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Trabajadas del CNEB</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 border-b border-slate-100">
                    <CardTitle className="text-sm font-semibold text-slate-600">{t("contexts")}</CardTitle>
                    <div className="bg-violet-100 rounded-full p-2">
                      <Users className="h-4 w-4 text-violet-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-3xl font-bold text-slate-800">
                      {contextsUsed}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Situaciones significativas</p>
                  </CardContent>
                </Card>
              </div>

              {/* IMPACTO EN LA COMUNIDAD */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-blue-600" />
                  {t("communityImpact")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-bold text-blue-800">{t("contributions")}</CardTitle>
                      <div className="bg-white rounded-full p-2 shadow-sm">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="text-3xl font-black text-blue-900">
                        {sesionesPublicadas}
                      </div>
                      <p className="text-xs text-blue-600/80 font-medium mt-1">Sesiones compartidas globalmente</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-bold text-emerald-800">{t("teachersHelped")}</CardTitle>
                      <div className="bg-white rounded-full p-2 shadow-sm">
                        <Heart className="h-4 w-4 text-emerald-600 fill-emerald-100" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="text-3xl font-black text-emerald-900">
                        {totalLikes}
                      </div>
                      <p className="text-xs text-emerald-600/80 font-medium mt-1">Valoraciones ("Me gusta") recibidas</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Sesiones por Mes */}
                <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      {t("generationActivity")}
                    </CardTitle>
                    <CardDescription>Sesiones generadas en los últimos meses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full">
                      {totalSessions > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={sessionsByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="sesiones" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                          <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
                          <p className="text-sm">No hay datos suficientes</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Grados con más actividad */}
                <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5 text-indigo-600" />
                      {t("cyclesActivity")}
                    </CardTitle>
                    <CardDescription>Distribución de sesiones por Ciclo/Grado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full">
                      {activityByCycle.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={activityByCycle}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {activityByCycle.map((entry, index) => (
                                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                          <PieChartIcon className="w-8 h-8 mb-2 opacity-50" />
                          <p className="text-sm">No hay datos suficientes</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Competencias más trabajadas */}
                <Card className="bg-white border-slate-200 shadow-sm rounded-xl lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-600" />
                      {t("topCompetencies")}
                    </CardTitle>
                    <CardDescription>Top 5 competencias del CNEB integradas en tus sesiones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full">
                      {topCompetencies.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={topCompetencies} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={150} tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }} />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24}>
                              {topCompetencies.map((entry, index) => (
                                <Cell key={`cell-${entry.name}`} fill={COLORS[(index + 2) % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                          <Target className="w-8 h-8 mb-2 opacity-50" />
                          <p className="text-sm">Aún no hay competencias registradas</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Controles de Filtro */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Filter className="w-5 h-5" />
                  <h2>{t("organizeHistory")}</h2>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={groupBy === 'recientes' ? 'default' : 'outline'}
                    size="sm"
                    className={groupBy === 'recientes' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:text-blue-600 border-slate-200'}
                    onClick={() => setGroupBy('recientes')}
                  >
                    {t("recent")}
                  </Button>
                  <Button
                    variant={groupBy === 'bimestre' ? 'default' : 'outline'}
                    size="sm"
                    className={groupBy === 'bimestre' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:text-indigo-600 border-slate-200'}
                    onClick={() => setGroupBy('bimestre')}
                  >
                    {t("byBimester")}
                  </Button>

                </div>
              </div>

              {/* Lista de Sesiones */}
              {renderSessionList()}
            </div>
          )}

          <div className="text-center pt-8 pb-4">
            <Button
              onClick={onBack}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 hover:-translate-y-1 transition-all duration-300 h-14 px-8 rounded-2xl font-bold text-lg group"
            >
              <Sparkles className="h-5 w-5 mr-3 group-hover:animate-pulse" />
              {t("createNewSession")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
