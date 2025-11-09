"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginScreen } from "@/components/login-screen"
import { SessionGenerator } from "@/components/session-generator"
import { SessionResults } from "@/components/session-results"
import { TeacherDashboard } from "@/components/teacher-dashboard"

export type SessionData = {
  // Inputs del formulario
  tema: string
  competenciasSeleccionadas: string[]
  ciclo: string
  contexto: string
  horasClase: number
  materialesDisponibles: string

  // Outputs generados
  competenciaDescripcion: string // Competencia + descripción del nivel esperado según ciclo
  secuenciaMetodologica: {
    inicio: string
    desarrollo: string
    cierre: string
  }
  procesosDidacticos: string[] // Los 5 procesos didácticos específicos de matemática
  actividadesContextualizadas: string[] // Actividades del entorno social elegido
  distribucionHoras: string // Cómo se reparte la secuencia en el tiempo
  materialesDidacticosSugeridos: string[]

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
