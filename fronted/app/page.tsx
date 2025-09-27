"use client"

import { useState } from "react"
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
  const [currentView, setCurrentView] = useState<"login" | "generator" | "results" | "dashboard">("login")
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null)
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [editingSession, setEditingSession] = useState<SessionData | null>(null)

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData)
    setCurrentView("generator")
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

  if (currentView === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (currentView === "generator") {
    return (
      <SessionGenerator
        user={user!}
        onSessionGenerated={handleSessionGenerated}
        onViewDashboard={handleViewDashboard}
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
    return <TeacherDashboard user={user!} sessions={sessions} onBack={handleBackFromDashboard} />
  }

  return null
}
