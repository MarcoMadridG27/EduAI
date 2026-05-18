"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginScreen } from "@/components/login-screen"
import { SessionGenerator } from "@/components/session-generator"
import { SessionResults } from "@/components/session-results"
import { TeacherDashboard } from "@/components/teacher-dashboard"

export type SessionData = {
  // Datos Generales
  datosGenerales?: {
    titulo: string
    docente: string
    fecha: string
    grado: string
    seccion: string
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
    inicio: string
    desarrollo: string
    cierre: string
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
  }

  // Metadata
  createdAt?: Date

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

  // Restaurar sesión al cargar y verificar autenticación
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const accessToken = localStorage.getItem("access_token")
    
    if (storedUser && accessToken) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (e) {
        console.error("Error restaurando sesión:", e)
        router.push("/auth")
      }
    } else {
      router.push("/auth")
    }
  }, [router])

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
    router.push("/auth")
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

  if (!user) {
    return null // Loading, será redirigido por useEffect
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
