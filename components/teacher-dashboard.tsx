"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Calendar, BookOpen, Users, Target, Brain, Sparkles, TrendingUp, Loader2 } from "lucide-react"
import type { SessionData } from "@/app/page"

interface TeacherDashboardProps {
  user: { name: string; email: string }
  sessions: SessionData[]
  onBack: () => void
  onOpenSession: (session: SessionData) => void
}

export function TeacherDashboard({ user, sessions, onBack, onOpenSession }: TeacherDashboardProps) {
  const [savedSessions, setSavedSessions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://127.0.0.1:8000"

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
          setSavedSessions(data)
        }
      } catch (err) {
        console.error("Error cargando sesiones:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSessions()
  }, [user.email, AUTH_URL])

  const totalSessions = savedSessions.length
  const timesSaved = totalSessions * 45 // 45 minutos por sesión
  const competenciasUsadas = [...new Set(savedSessions.flatMap((s) => s.session_data?.competenciasSeleccionadas || []))].length
  const contextsUsed = [...new Set(savedSessions.map((s) => s.session_data?.contexto).filter(Boolean))].length

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 gradient-primary rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 gradient-secondary rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="glass-effect border-b border-border/20 relative z-10">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="glass-effect hover:glow-primary/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <div className="gradient-primary rounded-2xl p-3 glow-primary">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Dashboard Docente
                </h1>
                <p className="text-sm text-muted-foreground font-medium">{user.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="gradient-secondary text-white glow-secondary">
              <TrendingUp className="h-3 w-3 mr-1" />
              IA Activa
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-effect border-0 glow-primary/10 hover:glow-primary/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sesiones Creadas</CardTitle>
                <div className="gradient-primary rounded-full p-2 glow-primary">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {totalSessions}
                </div>
                <p className="text-xs text-muted-foreground font-medium">Total generadas con IA</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 glow-secondary/10 hover:glow-secondary/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Ahorrado</CardTitle>
                <div className="gradient-secondary rounded-full p-2 glow-secondary">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  {Math.floor(timesSaved / 60)}h {timesSaved % 60}m
                </div>
                <p className="text-xs text-muted-foreground font-medium">En preparación de clases</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 glow-accent/10 hover:glow-accent/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Competencias</CardTitle>
                <div className="gradient-accent rounded-full p-2 glow-accent">
                  <Target className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  {competenciasUsadas}
                </div>
                <p className="text-xs text-muted-foreground font-medium">Del currículo nacional</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 glow-primary/10 hover:glow-primary/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contextos</CardTitle>
                <div className="gradient-primary rounded-full p-2 glow-primary">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {contextsUsed}
                </div>
                <p className="text-xs text-muted-foreground font-medium">Locales de Virú aplicados</p>
              </CardContent>
            </Card>
          </div>

          {/* Historial de sesiones */}
          <Card className="glass-effect border-0 glow-secondary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Calendar className="h-6 w-6 text-secondary" />
                <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  Historial de Sesiones Guardadas
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                Sesiones generadas con IA y guardadas en tu perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 text-secondary mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground">Cargando sesiones guardadas...</p>
                </div>
              ) : savedSessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="gradient-primary rounded-full p-6 w-24 h-24 mx-auto mb-6 glow-primary">
                    <BookOpen className="h-12 w-12 text-white mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Aún no tienes sesiones guardadas
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Genera y guarda sesiones de aprendizaje personalizadas con IA
                  </p>
                  <Button
                    onClick={onBack}
                    className="gradient-primary glow-primary hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Crear Primera Sesión
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedSessions.map((item, index) => {
                    const session = item.session_data
                    return (
                      <button
                        key={index}
                        onClick={() => onOpenSession(session)}
                        className="w-full text-left glass-effect rounded-xl p-6 hover:glow-accent/20 transition-all duration-300 border-l-4 border-primary hover:border-accent hover:scale-105"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              {session.tema}
                            </h3>
                            <p className="text-muted-foreground font-medium">
                              Ciclo {session.ciclo} • {formatDate(item.created_at)} • {session.contexto}
                            </p>
                          </div>
                          <Badge className="gradient-secondary text-white glow-secondary">
                            <Brain className="h-3 w-3 mr-1" />
                            IA + Currículo
                          </Badge>
                        </div>

                        {session.competenciasSeleccionadas && session.competenciasSeleccionadas.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2">COMPETENCIAS:</h4>
                            <div className="flex flex-wrap gap-2">
                              {session.competenciasSeleccionadas.slice(0, 2).map((competencia: string, compIndex: number) => (
                                <Badge key={compIndex} variant="secondary" className="glass-effect text-xs">
                                  <Target className="h-3 w-3 mr-1" />
                                  {competencia.length > 40 ? `${competencia.substring(0, 40)}...` : competencia}
                                </Badge>
                              ))}
                              {session.competenciasSeleccionadas.length > 2 && (
                                <Badge variant="secondary" className="glass-effect text-xs">
                                  +{session.competenciasSeleccionadas.length - 2} más
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {session.horasClase && (
                          <div className="text-sm text-muted-foreground mb-3">
                            <Clock className="h-4 w-4 inline mr-2" />
                            {session.horasClase} {session.horasClase === 1 ? "hora" : "horas"} de clase
                          </div>
                        )}

                        <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                          {session.competenciaDescripcion || "Sesión generada con inteligencia artificial"}
                        </p>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={onBack}
              size="lg"
              className="gradient-primary glow-primary hover:scale-105 transition-all duration-300 h-14 px-8 text-lg font-bold"
            >
              <Sparkles className="h-5 w-5 mr-3" />
              Crear Nueva Sesión con IA
              <Brain className="h-5 w-5 ml-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
