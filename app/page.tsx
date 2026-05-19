"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginScreen } from "@/components/login-screen"
import { SessionGenerator } from "@/components/session-generator"
import { SessionResults } from "@/components/session-results"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { LandingPage } from "@/components/landing-page"

export type SessionData = {
  // Datos Generales
  datosGenerales?: {
    titulo?: string
    docente?: string
    fecha?: string
    grado?: string
    seccion?: string
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
}

export default function Home() {
  const router = useRouter()
  const [currentView, setCurrentView] = useState<"generator" | "results" | "dashboard">("generator")
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null)
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [editingSession, setEditingSession] = useState<SessionData | null>(null)
  const [viewingSavedSession, setViewingSavedSession] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Restaurar sesión al cargar y verificar autenticación
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const accessToken = localStorage.getItem("access_token")

    if (storedUser && accessToken) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)

        const sessionToEdit = localStorage.getItem("session_to_edit")
        if (sessionToEdit) {
          const editData = JSON.parse(sessionToEdit)
          setEditingSession(editData)
          setCurrentView("generator")
          localStorage.removeItem("session_to_edit")
        }
      } catch (e) {
        console.error("Error restaurando sesión:", e)
      }
    }
    setIsCheckingAuth(false)
  }, [])

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData)
    setCurrentView("generator")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("access_token")
    setCurrentSession(null)
    setSessions([])
    setEditingSession(null)
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
    setCurrentView("dashboard")
  }

  const handleBackFromDashboard = () => {
    setCurrentView("generator")
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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  if (currentView === "generator") {
    return (
      <SessionGenerator
        user={user!}
        onSessionGenerated={handleSessionGenerated}
        onViewDashboard={handleViewDashboard}
        onLogout={handleLogout}
        editingSession={editingSession}
      />
    )
  }

  if (currentView === "results" && currentSession) {
    return (
      <SessionResults
        session={currentSession}
        isSavedSession={viewingSavedSession}
        onBack={handleBackToGenerator}
        onViewDashboard={handleViewDashboard}
        onEdit={() => handleEditSession(currentSession)}
      />
    )
  }

  if (currentView === "dashboard") {
    return <TeacherDashboard user={user!} sessions={sessions} onBack={handleBackFromDashboard} onOpenSession={handleOpenSavedSession} />
  }

  return null
}
