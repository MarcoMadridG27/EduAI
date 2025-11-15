"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginScreen } from "@/components/login-screen"
import { SessionGenerator } from "@/components/session-generator"
import { SessionResults } from "@/components/session-results"
import { TeacherDashboard } from "@/components/teacher-dashboard"

export type SessionData = {
  // Datos Generales (nuevos campos)
  datosGenerales?: {
    titulo: string
    docente: string
    fecha: string
    grado: string
    seccion: string
  }

  // Inputs del formulario
  tema: string
  competenciasSeleccionadas: string[]
  capacidades?: string[] // Capacidades seleccionadas
  ciclo: string
  contexto: string
  horasClase: number
  materialesDisponibles: string
  enfoqueTransversal?: string
  competenciaTransversal?: string

  // Outputs generados por IA
  competenciaDescripcion: string // Competencia + descripción del nivel esperado según ciclo
  criteriosEvaluacion?: string // Criterios de evaluación (generado por IA)
  evidenciasAprendizaje?: string // Evidencias de aprendizaje (generado por IA)
  propositoSesion?: string // Propósito de la sesión (generado por IA)
  secuenciaMetodologica: {
    inicio: string
    desarrollo: string
    cierre: string
  }
  procesosDidacticos: string[] // Los 5 procesos didácticos específicos de matemática
  actividadesContextualizadas: string[] // Actividades del entorno social elegido
  distribucionHoras: string // Cómo se reparte la secuencia en el tiempo
  materialesDidacticosSugeridos: string[]

  // Recursos Adicionales (nuevo)
  recursosAdicionales?: {
    fichasDeTrabajo?: Array<{
      titulo: string
      instrucciones: string
      ejercicios: string[]
    }>
    problemasYEjercicios?: Array<{
      nivel: string
      problema: string
      respuesta: string
      criterio: string
    }>
    juegoDidactico?: {
      titulo: string
      duracion: string
      participantes: string
      materiales: string
      instrucciones: string[]
      niveles: {
        basico: string
        intermedio: string
        avanzado: string
      }
      reflexion: string
    }
    actividadDeActivacion?: Array<{
      titulo: string
      duracion: string
      descripcion: string
    }>
    evaluacionFormativa?: {
      titulo: string
      duracion: string
      instrucciones: string
      preguntas: Array<{
        tipo: string
        pregunta: string
        opciones?: string[]
        respuesta_correcta: string
        criterio: string
      }>
      rubrica: string
    }
    comunicadoParaPadres?: string
    actividadesDiferenciadas?: {
      refuerzo?: Array<{
        titulo: string
        descripcion: string
        tiempo: string
        objetivo: string
      }>
      consolidacion?: Array<{
        titulo: string
        descripcion: string
        tiempo: string
        objetivo: string
      }>
      profundizacion?: Array<{
        titulo: string
        descripcion: string
        tiempo: string
        objetivo: string
      }>
    }
  }

  // Metadata
  createdAt: Date

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
