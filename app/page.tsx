"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/LanguageContext"
import { SessionGenerator } from "@/components/session-generator"
import { SessionResults } from "@/components/session-results"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { LandingPage } from "@/components/landing-page"
import { PublicRepository } from "@/components/public-repository"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export type SessionData = {
  // Datos Generales
  datosGenerales?: {
    titulo?: string
    docente?: string
    fecha?: string
    grado?: string
    seccion?: string
    area?: string
    unidad?: string
    sesion_num?: string
    ie?: string
    ugel?: string
    lugar?: string
    duracion?: string
    ciclo?: string
  }

  // Inputs del formulario
  tema: string
  titulo?: string // Título de la sesión - kept for compatibility
  tituloSesion?: string // Legacy field
  competenciasSeleccionadas: string[]
  capacidades?: string[] // Capacidades seleccionadas
  ciclo: string
  contexto: string
  horasClase: number
  materialesDisponibles?: string
  enfoqueTransversal?: string
  competenciaTransversal?: string

  // Outputs generados por IA
  competenciaDescripcion?: string
  desempenos?: string[]
  criteriosEvaluacion?: string
  evidenciasAprendizaje?: string
  propositoSesion?: string
  secuenciaMetodologica?: {
    inicio?: string
    desarrollo?: string
    cierre?: string
  }
  procesosDidacticos?: string[]
  actividadesContextualizadas?: string[]
  distribucionHoras?: string
  materialesDidacticosSugeridos?: string[]

  // Preview & Contextual editable fields
  actividades_previas?: string | string[]
  actitudes_observables?: string
  duracion_inicio?: string
  duracion_desarrollo?: string
  duracion_cierre?: string
  extension?: string
  instrumentoEvaluacion?: string

  // Recursos Adicionales
  recursosAdicionales?: {
    comunicadoParaPadres?: string
    actividadDeActivacion?: string[]
    evaluacionFormativa?: {
      preguntas: string[]
      respuestas: string[]
      criterios: string[]
    }
    actividadesDiferenciadas?: {
      refuerzo: string[]
      consolidacion: string[]
      profundizacion: string[]
    }
    fichasDeTrabajo?: Array<{
      titulo: string
      instrucciones: string
      ejercicios: any[]
    }>
    problemasYEjercicios?: Array<{
      nivel: string
      enunciado: string
      respuesta_esperada: string
    }>
    juegoDidactico?: {
      nombre: string
      materiales: string[]
      instrucciones: string[]
    }
    instrumentoEvaluacionGenerado?: {
      tipo_instrumento?: string
      escalas_o_niveles?: string[]
      criterios_o_items?: string[]
    }
  }

  // Metadata
  session_id?: string
  createdAt?: Date

  // Repositorio Público (nuevo)
  is_public?: boolean
  author_name?: string
  likes?: number
  comments?: any[]

  // Legacy fields for backward compatibility (deprecated)
  grado?: string
  recursos?: string[]
  objetivo?: string
  actividadInicial?: string
  dinamicaPrincipal?: string
  estrategiaSocioemocional?: string
  evaluacion?: string
  idioma?: string
}

export default function Home() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentView, setCurrentView] = useState<"landing" | "repository" | "generator" | "results" | "dashboard">("landing")
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [guestMode, setGuestMode] = useState<boolean>(false)
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null)
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [editingSession, setEditingSession] = useState<SessionData | null>(null)
  const [viewingSavedSession, setViewingSavedSession] = useState(false)

  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Restaurar sesión al cargar y verificar autenticación
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const accessToken = localStorage.getItem("access_token")

    // Read view query parameter
    const params = new URLSearchParams(window.location.search)
    const viewParam = params.get("view")

    if (storedUser && accessToken) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setGuestMode(false)

        const sessionToEdit = localStorage.getItem("session_to_edit")
        if (sessionToEdit) {
          const editData = JSON.parse(sessionToEdit)
          setEditingSession(editData)
          setCurrentView("generator")
          localStorage.removeItem("session_to_edit")
        } else if (viewParam && ["generator", "dashboard", "results"].includes(viewParam)) {
          setCurrentView(viewParam as any)
        } else {
          // If no specific view is requested, route directly to repository path
          router.push("/repositorio")
        }
      } catch (e) {
        console.error("Error restaurando sesión:", e)
      }
    } else {
      if (viewParam && ["generator", "dashboard", "results"].includes(viewParam)) {
        setGuestMode(true)
        setCurrentView(viewParam as any)
      } else {
        setCurrentView("landing")
      }
    }
    setIsCheckingAuth(false)
  }, [router])

  // Synchronize currentView state with browser URL
  useEffect(() => {
    if (isCheckingAuth) return
    const params = new URLSearchParams(window.location.search)
    const currentParam = params.get("view")

    if (currentView === "landing") {
      if (window.location.pathname !== "/" || currentParam) {
        router.push("/")
      }
    } else if (currentView === "repository") {
      if (window.location.pathname !== "/repositorio") {
        router.push("/repositorio")
      }
    } else {
      if (currentParam !== currentView) {
        router.push(`/?view=${currentView}`)
      }
    }
  }, [currentView, isCheckingAuth, router])


  const handleLogout = () => {
    setUser(null)
    setGuestMode(false)
    localStorage.removeItem("user")
    localStorage.removeItem("access_token")
    setCurrentSession(null)
    setSessions([])
    setEditingSession(null)
    setCurrentView("landing")
    router.push("/")
  }

  const handleSessionGenerated = (sessionData: SessionData) => {
    setCurrentSession(sessionData)
    setSessions((prev) => [sessionData, ...prev])
    setCurrentView("results")
    setEditingSession(null)
    setViewingSavedSession(false)
  }

  const handleBackToGenerator = () => {
    setCurrentView("generator")
    setEditingSession(null)
  }

  const handleViewDashboard = () => {
    if (guestMode) {
      triggerLoginModal()
    } else {
      setCurrentView("dashboard")
    }
  }

  const handleBackFromDashboard = () => {
    setCurrentView("repository")
  }

  const handleEditSession = (session: SessionData) => {
    setEditingSession(session)
    setCurrentView("generator")
  }

  const handleOpenSavedSession = (sessionData: SessionData) => {
    setCurrentSession(sessionData)
    setViewingSavedSession(true)
    setCurrentView("results")
  }

  const triggerLoginModal = () => {
    setShowLoginModal(true)
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user && !guestMode) {
    return (
      <LandingPage
        onEnterGeneratorPreview={() => {
          setGuestMode(true)
          setCurrentView("generator")
        }}
        onEnterRepositoryPreview={() => {
          setGuestMode(true)
          setCurrentView("repository")
        }}
        onLogin={() => router.push("/auth")}
      />
    )
  }

  return (
    <>
      {currentView === "repository" && (
        <PublicRepository
          user={user}
          guestMode={guestMode}
          onLoginRequired={triggerLoginModal}
          onNavigateToGenerator={() => setCurrentView("generator")}
          onViewDashboard={handleViewDashboard}
          onLogout={handleLogout}
        />
      )}

      {currentView === "generator" && (
        <SessionGenerator
          user={user}
          guestMode={guestMode}
          onLoginRequired={triggerLoginModal}
          onSessionGenerated={handleSessionGenerated}
          onViewDashboard={handleViewDashboard}
          onLogout={handleLogout}
          editingSession={editingSession}
        />
      )}

      {currentView === "results" && currentSession && (
        <SessionResults
          session={currentSession}
          isSavedSession={viewingSavedSession}
          onBack={handleBackToGenerator}
          onViewDashboard={handleViewDashboard}
          onEdit={() => handleEditSession(currentSession)}
        />
      )}

      {currentView === "dashboard" && (
        <TeacherDashboard
          user={user!}
          sessions={sessions}
          onBack={handleBackFromDashboard}
          onOpenSession={handleOpenSavedSession}
        />
      )}

      {/* Sleek Visual Login Gate Modal for Guests */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white border border-slate-200 shadow-2xl max-w-sm w-full rounded-[2rem] p-8 flex flex-col items-center text-center relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-4">
              <img
                src="/pinguinos/pinguino_chill.png"
                alt="Pingüino Chill"
                className="w-28 h-28 object-contain animate-bounce"
              />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2 leading-tight">
              ¡Planifica sin límites!
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Inicia sesión de forma gratuita para generar sesiones de aprendizaje estructuradas con IA y guardar tus materiales preferidos en el repositorio.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={() => {
                  setShowLoginModal(false)
                  router.push("/auth")
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl text-sm shadow-md transition-all hover:scale-102 active:scale-98"
              >
                Iniciar Sesión gratis
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowLoginModal(false)}
                className="w-full text-slate-500 hover:text-slate-800 font-semibold h-10 text-sm"
              >
                Continuar explorando
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
