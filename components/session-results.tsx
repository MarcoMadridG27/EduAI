"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  ArrowLeft,
  Download,
  Edit3,
  Target,
  CheckCircle,
  BarChart3,
  BookOpen,
  Clock,
  Zap,
  GraduationCap,
  MapPin,
  Package,
  Lightbulb,
  Loader2,
} from "lucide-react"
import type { SessionData } from "@/app/page"

interface SessionResultsProps {
  session: SessionData
  onBack: () => void
  onViewDashboard: () => void
  onEdit: () => void
}

// Small helpers to keep rendering logic readable and reduce complexity
function safeKeyFromString(s?: string) {
  if (!s) return undefined
  return s.replaceAll(/\s+/g, "_").replaceAll(/[^a-zA-Z0-9_-]/g, "").slice(0, 40)
}

function getJuegoInstrucciones(juego: any): string[] {
  if (!juego) return []
  if (Array.isArray(juego.instrucciones)) return juego.instrucciones
  if (typeof juego.instrucciones === "string") return juego.instrucciones.split(/\r?\n/).filter(Boolean)
  if (Array.isArray(juego.nivelesDificultad)) return juego.nivelesDificultad
  return []
}

export function SessionResults(props: Readonly<SessionResultsProps>) {
  const { session, onBack, onViewDashboard } = props
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "https://eduai-auth-1.onrender.com"

  // Estados editables
  const [editedSession, setEditedSession] = useState<SessionData>(session)

  // Parsear distribución horaria del backend
  const parseDistribucionHoras = () => {
    if (!editedSession.distribucionHoras) return { inicio: 0, desarrollo: 0, cierre: 0 }
    
    const text = editedSession.distribucionHoras.toLowerCase()
    const inicioRegex = /inicio:?\s*(\d+)\s*minutos?/i
    const desarrolloRegex = /desarrollo:?\s*(\d+)\s*minutos?/i
    const cierreRegex = /cierre:?\s*(\d+)\s*minutos?/i
    
    const inicioMatch = inicioRegex.exec(text)
    const desarrolloMatch = desarrolloRegex.exec(text)
    const cierreMatch = cierreRegex.exec(text)
    
    return {
      inicio: inicioMatch ? Number.parseInt(inicioMatch[1]) : 0,
      desarrollo: desarrolloMatch ? Number.parseInt(desarrolloMatch[1]) : 0,
      cierre: cierreMatch ? Number.parseInt(cierreMatch[1]) : 0,
    }
  }

  const tiempos = parseDistribucionHoras()

  // Recursos adicionales seguro (evita errores si es undefined)
  const ra: any = editedSession.recursosAdicionales || {}
  // Precompute juego instrucciones list to simplify JSX
  const juegoInstrucciones = getJuegoInstrucciones(ra.juegoDidactico)

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const pdfEndpoint = process.env.NEXT_PUBLIC_PDF_URL || "https://pdf-render-hfzf.onrender.com/generate-pdf"
      
      // Preparar los datos en el formato esperado (usando la sesión editada)
      const payload = {
        data: {
          datosGenerales: editedSession.datosGenerales,
          tema: editedSession.tema,
          ciclo: editedSession.ciclo,
          contexto: editedSession.contexto,
          horasClase: editedSession.horasClase,
          competenciasSeleccionadas: editedSession.competenciasSeleccionadas,
          capacidades: editedSession.capacidades,
          materialesDisponibles: editedSession.materialesDisponibles,
          enfoqueTransversal: editedSession.enfoqueTransversal,
          competenciaTransversal: editedSession.competenciaTransversal,
          competenciaDescripcion: editedSession.competenciaDescripcion,
          propositoSesion: editedSession.propositoSesion,
          criteriosEvaluacion: editedSession.criteriosEvaluacion,
          evidenciasAprendizaje: editedSession.evidenciasAprendizaje,
          secuenciaMetodologica: editedSession.secuenciaMetodologica,
          procesosDidacticos: editedSession.procesosDidacticos,
          actividadesContextualizadas: editedSession.actividadesContextualizadas,
          distribucionHoras: editedSession.distribucionHoras,
          materialesDidacticosSugeridos: editedSession.materialesDidacticosSugeridos,
          recursosAdicionales: editedSession.recursosAdicionales,
        }
      }

      console.log('Enviando datos al generador de PDF:', payload)

      const response = await fetch(pdfEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`)
      }

      // Obtener el blob del PDF
      const blob = await response.blob()
      
      // Crear un objeto URL para descargar
      const url = globalThis.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `sesion-${editedSession.tema?.substring(0, 20)}-${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      globalThis.URL.revokeObjectURL(url)

      alert('¡PDF descargado exitosamente!')
    } catch (err) {
      console.error('Error exportando PDF:', err)
      alert('Error al generar PDF. Intenta de nuevo.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleSaveSession = async () => {
    setIsSaving(true)
    try {
      const accessToken = localStorage.getItem("access_token")
      const user = localStorage.getItem("user")

      if (!accessToken || !user) {
        alert("Debes estar autenticado para guardar sesiones")
        return
      }

      const userData = JSON.parse(user)

      const payload = {
        user_id: userData.email,
        session_data: editedSession,
      }

      const res = await fetch(`${AUTH_URL}/save-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Error al guardar la sesión")
      }

      alert("¡Sesión guardada exitosamente!")
    } catch (err) {
      console.error("Error guardando sesión:", err)
      alert(`Error: ${err instanceof Error ? err.message : "Error desconocido"}`)
    } finally {
      setIsSaving(false)
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
              <div className="gradient-primary rounded-2xl p-2 glow-primary">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Sesión Generada
                </h1>
                <p className="text-sm text-muted-foreground">Con IA y Currículo Nacional</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onViewDashboard}
              className="glass-effect border-secondary/30 hover:glow-secondary bg-transparent"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className={`glass-effect border-accent/30 hover:glow-accent bg-transparent ${isEditing ? 'glow-accent' : ''}`}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? "Vista Previa" : "Editar Contenido"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6" ref={contentRef}>
          
          {/* Datos Generales */}
          {editedSession.datosGenerales && (
            <Card className="glass-effect border-0 glow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Datos Generales de la Sesión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="glass-effect rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Título</p>
                    <p className="font-semibold text-sm">{editedSession.datosGenerales.titulo}</p>
                  </div>
                  <div className="glass-effect rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Docente</p>
                    <p className="font-semibold text-sm">{editedSession.datosGenerales.docente}</p>
                  </div>
                  <div className="glass-effect rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Fecha</p>
                    <p className="font-semibold text-sm">{editedSession.datosGenerales.fecha}</p>
                  </div>
                  <div className="glass-effect rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Grado</p>
                    <p className="font-semibold text-sm">{editedSession.datosGenerales.grado}</p>
                  </div>
                  <div className="glass-effect rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Sección</p>
                    <p className="font-semibold text-sm">{editedSession.datosGenerales.seccion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resumen Rápido - 4 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-effect border-0 glow-primary/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <BookOpen className="h-8 w-8 text-primary mx-auto" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Tema</p>
                  <p className="font-bold text-sm line-clamp-3 leading-tight">{editedSession.tema}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 glow-secondary/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <GraduationCap className="h-8 w-8 text-secondary mx-auto" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Ciclo</p>
                  <p className="font-bold text-lg">{editedSession.ciclo}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 glow-accent/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Clock className="h-8 w-8 text-accent mx-auto" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Duración</p>
                  <p className="font-bold text-lg">{editedSession.horasClase} hora{editedSession.horasClase === 1 ? '' : 's'}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 glow-primary/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <MapPin className="h-8 w-8 text-primary mx-auto" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Contexto</p>
                  <p className="font-bold text-sm line-clamp-3 leading-tight">{editedSession.contexto}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Competencias - Grid */}
          {editedSession.competenciasSeleccionadas && editedSession.competenciasSeleccionadas.length > 0 && (
            <Card className="glass-effect border-0 glow-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  Competencias Seleccionadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {editedSession.competenciasSeleccionadas.map((comp) => (
                    <div key={comp} className="glass-effect rounded-lg p-3 border-l-4 border-secondary flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{comp}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Capacidades */}
          {editedSession.capacidades && editedSession.capacidades.length > 0 && (
            <Card className="glass-effect border-0 glow-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  Capacidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {editedSession.capacidades.map((cap) => (
                    <div key={cap} className="glass-effect rounded-lg p-3 border-l-4 border-accent flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{cap}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enfoques Transversales */}
          {(editedSession.enfoqueTransversal || editedSession.competenciaTransversal) && (
            <Card className="glass-effect border-0 glow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Enfoques Transversales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editedSession.enfoqueTransversal && (
                    <div className="glass-effect rounded-lg p-4 border-l-4 border-primary">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Enfoque Transversal</p>
                      <p className="text-sm font-semibold">{editedSession.enfoqueTransversal}</p>
                    </div>
                  )}
                  {editedSession.competenciaTransversal && (
                    <div className="glass-effect rounded-lg p-4 border-l-4 border-primary">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Competencia Transversal</p>
                      <p className="text-sm font-semibold">{editedSession.competenciaTransversal}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Propósito de la Sesión */}
          {editedSession.propositoSesion && (
            <Card className="glass-effect border-0 glow-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  Propósito de la Sesión
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedSession.propositoSesion}
                    onChange={(e) => setEditedSession({...editedSession, propositoSesion: e.target.value})}
                    className="min-h-[80px] glass-effect border-border/50 focus:border-secondary focus:glow-secondary transition-all duration-300"
                  />
                ) : (
                  <div className="glass-effect rounded-lg p-4 border-l-4 border-secondary bg-gradient-to-r from-secondary/5 to-transparent">
                    <p className="text-foreground leading-relaxed text-sm">{editedSession.propositoSesion}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Descripción de Competencia */}
          {editedSession.competenciaDescripcion && (
            <Card className="glass-effect border-0 glow-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-secondary" />
                  Descripción de la Competencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedSession.competenciaDescripcion}
                    onChange={(e) => setEditedSession({...editedSession, competenciaDescripcion: e.target.value})}
                    className="min-h-[100px] glass-effect border-border/50 focus:border-secondary focus:glow-secondary transition-all duration-300"
                  />
                ) : (
                  <div className="glass-effect rounded-lg p-4 border-l-4 border-secondary bg-gradient-to-r from-secondary/5 to-transparent">
                    <p className="text-foreground leading-relaxed text-sm">{editedSession.competenciaDescripcion}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Criterios de Evaluación */}
          {editedSession.criteriosEvaluacion && (
            <Card className="glass-effect border-0 glow-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  Criterios de Evaluación
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedSession.criteriosEvaluacion}
                    onChange={(e) => setEditedSession({...editedSession, criteriosEvaluacion: e.target.value})}
                    className="min-h-[120px] glass-effect border-border/50 focus:border-accent focus:glow-accent transition-all duration-300"
                  />
                ) : (
                  <div className="glass-effect rounded-lg p-4 border-l-4 border-accent bg-gradient-to-r from-accent/5 to-transparent">
                    <pre className="text-foreground leading-relaxed text-sm whitespace-pre-wrap font-sans">{editedSession.criteriosEvaluacion}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Evidencias de Aprendizaje */}
          {editedSession.evidenciasAprendizaje && (
            <Card className="glass-effect border-0 glow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Evidencias de Aprendizaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedSession.evidenciasAprendizaje}
                    onChange={(e) => setEditedSession({...editedSession, evidenciasAprendizaje: e.target.value})}
                    className="min-h-[100px] glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300"
                  />
                ) : (
                  <div className="glass-effect rounded-lg p-4 border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent">
                    <pre className="text-foreground leading-relaxed text-sm whitespace-pre-wrap font-sans">{editedSession.evidenciasAprendizaje}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Secuencia Metodológica - 3 columnas */}
          {editedSession.secuenciaMetodologica && (
            <Card className="glass-effect border-0 glow-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-accent" />
                  Secuencia Metodológica
                </CardTitle>
                <CardDescription>Estructura pedagógica Inicio - Desarrollo - Cierre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* INICIO */}
                  <div className="glass-effect rounded-lg p-4 border-t-4 border-primary">
                    <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                      <span className="gradient-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                        1
                      </span>{" "}
                      INICIO
                    </h4>
                    {isEditing ? (
                      <Textarea
                        value={editedSession.secuenciaMetodologica.inicio}
                        onChange={(e) => setEditedSession({
                          ...editedSession,
                          secuenciaMetodologica: {
                            ...editedSession.secuenciaMetodologica,
                            inicio: e.target.value
                          }
                        })}
                        className="min-h-[200px] glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300"
                      />
                    ) : (
                      <div
                        className="text-sm text-foreground leading-relaxed space-y-2"
                        dangerouslySetInnerHTML={{
                          __html: editedSession.secuenciaMetodologica.inicio
                            .replaceAll(/\*\*(.*?)\*\*/g, "<strong class='text-primary'>$1</strong>")
                            .replaceAll("\n", "<br>"),
                        }}
                      />
                    )}
                  </div>

                  {/* DESARROLLO */}
                  <div className="glass-effect rounded-lg p-4 border-t-4 border-secondary">
                    <h4 className="font-bold text-secondary mb-3 flex items-center gap-2">
                      <span className="gradient-secondary rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                        2
                      </span>{" "}
                      DESARROLLO
                    </h4>
                    {isEditing ? (
                      <Textarea
                        value={editedSession.secuenciaMetodologica.desarrollo}
                        onChange={(e) => setEditedSession({
                          ...editedSession,
                          secuenciaMetodologica: {
                            ...editedSession.secuenciaMetodologica,
                            desarrollo: e.target.value
                          }
                        })}
                        className="min-h-[200px] glass-effect border-border/50 focus:border-secondary focus:glow-secondary transition-all duration-300"
                      />
                    ) : (
                      <div
                        className="text-sm text-foreground leading-relaxed space-y-2"
                        dangerouslySetInnerHTML={{
                          __html: editedSession.secuenciaMetodologica.desarrollo
                            .replaceAll(/\*\*(.*?)\*\*/g, "<strong class='text-secondary'>$1</strong>")
                            .replaceAll("\n", "<br>"),
                        }}
                      />
                    )}
                  </div>

                  {/* CIERRE */}
                  <div className="glass-effect rounded-lg p-4 border-t-4 border-accent">
                    <h4 className="font-bold text-accent mb-3 flex items-center gap-2">
                      <span className="gradient-accent rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                        3
                      </span>{" "}
                      CIERRE
                    </h4>
                    {isEditing ? (
                      <Textarea
                        value={editedSession.secuenciaMetodologica.cierre}
                        onChange={(e) => setEditedSession({
                          ...editedSession,
                          secuenciaMetodologica: {
                            ...editedSession.secuenciaMetodologica,
                            cierre: e.target.value
                          }
                        })}
                        className="min-h-[200px] glass-effect border-border/50 focus:border-accent focus:glow-accent transition-all duration-300"
                      />
                    ) : (
                      <div
                        className="text-sm text-foreground leading-relaxed space-y-2"
                        dangerouslySetInnerHTML={{
                          __html: editedSession.secuenciaMetodologica.cierre
                            .replaceAll(/\*\*(.*?)\*\*/g, "<strong class='text-accent'>$1</strong>")
                            .replaceAll("\n", "<br>"),
                        }}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Distribución Horaria con visualización */}
          {editedSession.distribucionHoras && (
            <Card className="glass-effect border-0 glow-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-secondary" />
                  Distribución Horaria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Vertical bar chart with dynamic data */}
                  <div className="flex items-end justify-center gap-4 h-64">
                    {(() => {
                      // Calcular el máximo para proporcionalidad
                      const maxTiempo = Math.max(tiempos.inicio, tiempos.desarrollo, tiempos.cierre, 1)
                      const containerHeight = 256 // h-64 = 256px
                      
                      return (
                        <>
                          {/* Inicio */}
                          <div className="flex-1 flex flex-col items-center gap-3">
                            <div 
                              className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg flex items-end justify-center pb-2 glow-primary/20" 
                              style={{ height: `${Math.max((tiempos.inicio / maxTiempo) * containerHeight, 30)}px` }}
                            >
                              <span className="text-xs font-bold text-white">{tiempos.inicio}'</span>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-semibold text-primary">INICIO</p>
                              <p className="text-xs text-muted-foreground">Motivación</p>
                            </div>
                          </div>

                          {/* Desarrollo */}
                          <div className="flex-1 flex flex-col items-center gap-3">
                            <div 
                              className="w-full bg-gradient-to-t from-secondary to-secondary/50 rounded-t-lg flex items-end justify-center pb-2 glow-secondary/20" 
                              style={{ height: `${Math.max((tiempos.desarrollo / maxTiempo) * containerHeight, 30)}px` }}
                            >
                              <span className="text-xs font-bold text-white">{tiempos.desarrollo}'</span>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-semibold text-secondary">DESARROLLO</p>
                              <p className="text-xs text-muted-foreground">Contenido</p>
                            </div>
                          </div>

                          {/* Cierre */}
                          <div className="flex-1 flex flex-col items-center gap-3">
                            <div 
                              className="w-full bg-gradient-to-t from-accent to-accent/50 rounded-t-lg flex items-end justify-center pb-2 glow-accent/20" 
                              style={{ height: `${Math.max((tiempos.cierre / maxTiempo) * containerHeight, 30)}px` }}
                            >
                              <span className="text-xs font-bold text-white">{tiempos.cierre}'</span>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-semibold text-accent">CIERRE</p>
                              <p className="text-xs text-muted-foreground">Reflexión</p>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>

                  {/* Timeline visual */}
                  <div className="relative pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-semibold text-primary">0 min</div>
                      <div className="text-xs font-semibold text-secondary">{tiempos.inicio}-{tiempos.inicio + tiempos.desarrollo} min</div>
                      <div className="text-xs font-semibold text-accent">{tiempos.inicio + tiempos.desarrollo + tiempos.cierre} min</div>
                    </div>
                    <div className="w-full h-3 bg-gradient-to-r from-primary via-secondary to-accent rounded-full glow-primary/10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Procesos Didácticos - Grid 5 columnas */}
          {editedSession.procesosDidacticos && editedSession.procesosDidacticos.length > 0 && (
            <Card className="glass-effect border-0 glow-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-accent" />
                  Procesos Didácticos
                </CardTitle>
                <CardDescription>5 procesos clave según MINEDU</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {editedSession.procesosDidacticos.map((proceso, index) => (
                    <div key={safeKeyFromString(proceso) || `proceso-${index}`} className="glass-effect rounded-lg p-3 text-center hover:glow-accent/30 transition-all duration-300">
                      <div className="gradient-accent rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-sm mx-auto mb-2 glow-accent">
                        {index + 1}
                      </div>
                      <p className="text-sm font-medium line-clamp-3">{proceso}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Materiales Disponibles */}
          {editedSession.materialesDisponibles && (
            <Card className="glass-effect border-0 glow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Materiales Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="glass-effect rounded-lg p-4 border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent">
                  <p className="text-foreground leading-relaxed text-sm">{editedSession.materialesDisponibles}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Materiales Didácticos Sugeridos - Grid 2 columnas */}
          {editedSession.materialesDidacticosSugeridos && editedSession.materialesDidacticosSugeridos.length > 0 && (
            <Card className="glass-effect border-0 glow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Materiales Didácticos Sugeridos
                </CardTitle>
                <CardDescription>Recursos recomendados para potenciar la sesión</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {editedSession.materialesDidacticosSugeridos.map((material) => (
                    <div key={safeKeyFromString(material) || material} className="glass-effect rounded-lg p-3 border-l-4 border-primary flex items-start gap-3">
                      <Package className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{material}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actividades Contextualizadas - Grid 2 columnas */}
          {editedSession.actividadesContextualizadas && editedSession.actividadesContextualizadas.length > 0 && (
            <Card className="glass-effect border-0 glow-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-secondary" />
                  Actividades Contextualizadas
                </CardTitle>
                <CardDescription>Estrategias adaptadas al contexto local</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {editedSession.actividadesContextualizadas.map((actividad, index) => (
                    <div key={safeKeyFromString(typeof actividad === 'string' ? actividad : (actividad as any)?.titulo) || `act-${index}`} className="glass-effect rounded-lg p-3 border-l-4 border-secondary flex items-start gap-3">
                      <Zap className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{actividad}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recursos Adicionales - Sección expandida */}
          {ra && (
            <Card className="glass-effect border-0 glow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Recursos Adicionales
                </CardTitle>
                <CardDescription>Materiales complementarios para enriquecer la sesión</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Fichas de Trabajo */}
                {ra.fichasDeTrabajo && ra.fichasDeTrabajo.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-secondary flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Fichas de Trabajo
                    </h4>
                    {ra.fichasDeTrabajo.map((ficha: any, idx: number) => (
                      <details key={ficha.titulo || ficha.nombre || `ficha-${idx}`} className="glass-effect rounded-lg p-4 border-l-4 border-secondary">
                        <summary className="font-semibold text-sm cursor-pointer hover:text-secondary transition-colors">
                          {ficha.titulo}
                        </summary>
                        <div className="mt-3 space-y-2 text-sm">
                          <p className="text-muted-foreground"><strong>Instrucciones:</strong> {ficha.instrucciones}</p>
                          <div>
                            <strong className="text-foreground">Ejercicios:</strong>
                            <ul className="list-disc list-inside space-y-1 mt-1 text-foreground/80">
                              {ficha.ejercicios.map((ejercicio: any, i: number) => (
                                <li key={safeKeyFromString(String(ejercicio)) || `ej-${i}`}>{ejercicio}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                )}

                {/* Problemas y Ejercicios */}
                {ra.problemasYEjercicios && ra.problemasYEjercicios.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-accent flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Problemas y Ejercicios
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ra.problemasYEjercicios.map((problema: any, idx: number) => (
                        <details key={problema.nivel || problema.enunciado?.slice(0,40) || problema.problema?.slice(0,40) || `problema-${idx}`} className="glass-effect rounded-lg p-3 border-l-4 border-accent">
                          <summary className="font-semibold text-xs uppercase cursor-pointer">
                            {problema.nivel || problema.enunciado?.slice(0, 40) || `Problema ${idx + 1}`}
                          </summary>
                          <div className="mt-2 space-y-1 text-xs">
                            <p><strong>Problema:</strong> {problema.problema || problema.enunciado}</p>
                            <p className="text-muted-foreground"><strong>Respuesta:</strong> {problema.respuesta}</p>
                            <p className="text-muted-foreground"><strong>Criterios:</strong> {problema.criterios || problema.criterio}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* Juego Didáctico (compatible con distintas formas que envía el backend) */}
                {ra.juegoDidactico && (
                  <div className="glass-effect rounded-lg p-4 border-t-4 border-primary space-y-3">
                    <h4 className="font-bold text-primary flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      {ra.juegoDidactico.titulo || ra.juegoDidactico.nombre}
                      </h4>
                      { (ra.juegoDidactico.descripcion || ra.juegoDidactico.resumen) && (
                        <p className="text-sm text-muted-foreground">{ra.juegoDidactico.descripcion || ra.juegoDidactico.resumen}</p>
                      ) }
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {ra.juegoDidactico.duracion && <div><strong>Duración:</strong> {ra.juegoDidactico.duracion}</div>}
                      {ra.juegoDidactico.participantes && <div><strong>Participantes:</strong> {ra.juegoDidactico.participantes}</div>}
                      {ra.juegoDidactico.materiales && <div><strong>Materiales:</strong> {ra.juegoDidactico.materiales}</div>}
                    </div>
                    <div>
                      <strong className="text-sm">Instrucciones:</strong>
                      <ol className="list-decimal list-inside space-y-1 mt-1 text-sm text-foreground/80">
                        {juegoInstrucciones.length > 0 ? (
                          juegoInstrucciones.map((instr: any, i: number) => (
                            <li key={safeKeyFromString(String(instr)) || `instr-${i}`}>{instr}</li>
                          ))
                        ) : (
                          <li>Instrucciones no disponibles</li>
                        )}
                      </ol>
                    </div>
                    {/* Mostrar niveles ya sea en objeto 'niveles' o en array 'nivelesDificultad' */}
                    {ra.juegoDidactico.nivelesDificultad && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                        {ra.juegoDidactico.nivelesDificultad.map((lvl: any, i: number) => (
                          <div key={safeKeyFromString(String(lvl)) || `lvl-${i}`} className="glass-effect rounded p-2">
                            <p className="text-xs font-semibold text-primary">Nivel {i + 1}</p>
                            <p className="text-xs text-muted-foreground">{lvl}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {ra.juegoDidactico.niveles && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                        <div className="glass-effect rounded p-2">
                          <p className="text-xs font-semibold text-primary">Básico</p>
                          <p className="text-xs text-muted-foreground">{ra.juegoDidactico.niveles.basico}</p>
                        </div>
                        <div className="glass-effect rounded p-2">
                          <p className="text-xs font-semibold text-secondary">Intermedio</p>
                          <p className="text-xs text-muted-foreground">{ra.juegoDidactico.niveles.intermedio}</p>
                        </div>
                        <div className="glass-effect rounded p-2">
                          <p className="text-xs font-semibold text-accent">Avanzado</p>
                          <p className="text-xs text-muted-foreground">{ra.juegoDidactico.niveles.avanzado}</p>
                        </div>
                      </div>
                    )}
                    <p className="text-sm italic text-muted-foreground pt-2">{ra.juegoDidactico.reflexion}</p>
                  </div>
                )}

                {/* Actividades de Activación */}
                {ra.actividadDeActivacion && ra.actividadDeActivacion.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-secondary flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Actividades de Activación
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {ra.actividadDeActivacion.map((act: any, idx: number) => (
                        <div key={act.titulo || act.nombre || `act-${idx}`} className="glass-effect rounded-lg p-3 border-l-4 border-secondary">
                          <p className="font-semibold text-sm">{act.titulo || act.nombre}</p>
                          <p className="text-xs text-muted-foreground">Duración: {act.duracion ?? act.tiempo ?? '—'}</p>
                          <p className="text-xs mt-1">{act.descripcion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evaluación Formativa */}
                {ra.evaluacionFormativa && (
                  <div className="glass-effect rounded-lg p-4 border-t-4 border-accent space-y-3">
                    <h4 className="font-bold text-accent">{ra.evaluacionFormativa.titulo}</h4>
                    <p className="text-xs"><strong>Duración:</strong> {ra.evaluacionFormativa.duracion}</p>
                    <p className="text-sm text-muted-foreground">{ra.evaluacionFormativa.instrucciones}</p>
                    <div className="space-y-2">
                      {ra.evaluacionFormativa.preguntas.slice(0, 3).map((preg: any, idx: number) => (
                        <details key={preg.pregunta || preg.enunciado || `preg-${idx}`} className="glass-effect rounded p-2 text-sm">
                          <summary className="cursor-pointer font-medium">Pregunta {idx + 1}</summary>
                          <div className="mt-2 space-y-1 text-xs">
                            <p>{preg.pregunta || preg.enunciado}</p>
                            {preg.opciones && (
                              <ul className="list-disc list-inside pl-2">
                                {preg.opciones.map((op: any, i: number) => (
                                  <li key={safeKeyFromString(String(op)) || `op-${i}`}>{op}</li>
                                ))}
                              </ul>
                            )}
                            <p className="text-primary"><strong>Respuesta:</strong> {preg.respuesta || preg.respuesta_correcta}</p>
                            <p className="text-muted-foreground"><strong>Criterios:</strong> {preg.criterios || preg.criterio}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                    <p className="text-xs italic text-muted-foreground pt-2">{ra.evaluacionFormativa.rubrica}</p>
                  </div>
                )}

                {/* Comunicado para Padres */}
                {ra.comunicadoParaPadres && (
                  <div className="glass-effect rounded-lg p-4 border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent">
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Comunicado para Padres
                    </h4>
                    <pre className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans">
                      {ra.comunicadoParaPadres}
                    </pre>
                  </div>
                )}

                {/* Actividades Diferenciadas */}
                {ra.actividadesDiferenciadas && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-secondary flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Actividades Diferenciadas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Refuerzo */}
                      {ra.actividadesDiferenciadas.refuerzo && (
                        <div className="glass-effect rounded-lg p-3 border-t-4 border-primary space-y-2">
                          <p className="font-semibold text-sm text-primary">Refuerzo</p>
                          {ra.actividadesDiferenciadas.refuerzo.map((act: any, idx: number) => (
                            <div key={act.titulo || safeKeyFromString(act.descripcion) || `ref-${idx}`} className="text-xs space-y-1">
                              <p className="font-medium">{act.titulo}</p>
                              <p className="text-muted-foreground">{act.descripcion}</p>
                              <p><strong>Tiempo:</strong> {act.tiempo}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Consolidación */}
                      {ra.actividadesDiferenciadas.consolidacion && (
                        <div className="glass-effect rounded-lg p-3 border-t-4 border-secondary space-y-2">
                          <p className="font-semibold text-sm text-secondary">Consolidación</p>
                          {ra.actividadesDiferenciadas.consolidacion.map((act: any, idx: number) => (
                            <div key={act.titulo || safeKeyFromString(act.descripcion) || `cons-${idx}`} className="text-xs space-y-1">
                              <p className="font-medium">{act.titulo}</p>
                              <p className="text-muted-foreground">{act.descripcion}</p>
                              <p><strong>Tiempo:</strong> {act.tiempo}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Profundización */}
                      {ra.actividadesDiferenciadas.profundizacion && (
                        <div className="glass-effect rounded-lg p-3 border-t-4 border-accent space-y-2">
                          <p className="font-semibold text-sm text-accent">Profundización</p>
                          {ra.actividadesDiferenciadas.profundizacion.map((act: any, idx: number) => (
                            <div key={act.titulo || safeKeyFromString(act.descripcion) || `prof-${idx}`} className="text-xs space-y-1">
                              <p className="font-medium">{act.titulo}</p>
                              <p className="text-muted-foreground">{act.descripcion}</p>
                              <p><strong>Tiempo:</strong> {act.tiempo}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Botones de Acción */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            <Button
              onClick={onBack}
              variant="outline"
              className="glass-effect border-primary/30 hover:glow-primary h-12 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nueva Sesión
            </Button>
            <Button
              onClick={handleSaveSession}
              disabled={isSaving}
              className="gradient-secondary glow-secondary hover:scale-105 transition-all duration-300 h-12"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Guardar Sesión
                </>
              )}
            </Button>
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="gradient-primary glow-primary hover:scale-105 transition-all duration-300 h-12"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generando PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
