"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  ArrowLeft,
  Download,
  Edit3,
  Target,
  Users,
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

export function SessionResults({ session, onBack, onViewDashboard, onEdit }: SessionResultsProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "https://eduai-auth-1.onrender.com"

  // Parsear distribución horaria del backend
  const parseDistribucionHoras = () => {
    if (!session.distribucionHoras) return { inicio: 0, desarrollo: 0, cierre: 0 }
    
    const text = session.distribucionHoras.toLowerCase()
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

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const pdfEndpoint = "https://pdf-render-hfzf.onrender.com/generate-pdf"
      
      // Preparar los datos en el formato esperado
      const payload = {
        data: {
          tema: session.tema,
          ciclo: session.ciclo,
          contexto: session.contexto,
          horasClase: session.horasClase,
          competenciasSeleccionadas: session.competenciasSeleccionadas,
          materialesDisponibles: session.materialesDisponibles,
          competenciaDescripcion: session.competenciaDescripcion,
          secuenciaMetodologica: session.secuenciaMetodologica,
          procesosDidacticos: session.procesosDidacticos,
          actividadesContextualizadas: session.actividadesContextualizadas,
          distribucionHoras: session.distribucionHoras,
          materialesDidacticosSugeridos: session.materialesDidacticosSugeridos,
          criteriosEvaluacion: session.criteriosEvaluacion,
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
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `sesion-${session.tema?.substring(0, 20)}-${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

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
        session_data: session,
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
              onClick={onEdit}
              className="glass-effect border-accent/30 hover:glow-accent bg-transparent"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6" ref={contentRef}>
          
          {/* Resumen Rápido - 4 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-effect border-0 glow-primary/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <BookOpen className="h-8 w-8 text-primary mx-auto" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Tema</p>
                  <p className="font-bold text-sm line-clamp-3 leading-tight">{session.tema}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 glow-secondary/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <GraduationCap className="h-8 w-8 text-secondary mx-auto" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Ciclo</p>
                  <p className="font-bold text-lg">{session.ciclo}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 glow-accent/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Clock className="h-8 w-8 text-accent mx-auto" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Duración</p>
                  <p className="font-bold text-lg">{session.horasClase} hora{session.horasClase === 1 ? '' : 's'}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 glow-primary/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <MapPin className="h-8 w-8 text-primary mx-auto" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Contexto</p>
                  <p className="font-bold text-sm line-clamp-3 leading-tight">{session.contexto}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Competencias - Grid */}
          {session.competenciasSeleccionadas && session.competenciasSeleccionadas.length > 0 && (
            <Card className="glass-effect border-0 glow-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  Competencias Seleccionadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {session.competenciasSeleccionadas.map((comp, index) => (
                    <div key={index} className="glass-effect rounded-lg p-3 border-l-4 border-secondary flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{comp}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Descripción de Competencia */}
          {session.competenciaDescripcion && (
            <Card className="glass-effect border-0 glow-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-secondary" />
                  Descripción de la Competencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="glass-effect rounded-lg p-4 border-l-4 border-secondary bg-gradient-to-r from-secondary/5 to-transparent">
                  <p className="text-foreground leading-relaxed text-sm">{session.competenciaDescripcion}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Secuencia Metodológica - 3 columnas */}
          {session.secuenciaMetodologica && (
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
                  <div className="glass-effect rounded-lg p-4 border-t-4 border-primary">
                    <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                      <span className="gradient-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                        1
                      </span>
                      INICIO
                    </h4>
                    <div
                      className="text-sm text-foreground leading-relaxed space-y-2"
                      dangerouslySetInnerHTML={{
                        __html: session.secuenciaMetodologica.inicio
                          .replaceAll(/\*\*(.*?)\*\*/g, "<strong class='text-primary'>$1</strong>")
                          .replaceAll("\n", "<br>"),
                      }}
                    />
                  </div>

                  <div className="glass-effect rounded-lg p-4 border-t-4 border-secondary">
                    <h4 className="font-bold text-secondary mb-3 flex items-center gap-2">
                      <span className="gradient-secondary rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                        2
                      </span>
                      DESARROLLO
                    </h4>
                    <div
                      className="text-sm text-foreground leading-relaxed space-y-2"
                      dangerouslySetInnerHTML={{
                        __html: session.secuenciaMetodologica.desarrollo
                          .replaceAll(/\*\*(.*?)\*\*/g, "<strong class='text-secondary'>$1</strong>")
                          .replaceAll("\n", "<br>"),
                      }}
                    />
                  </div>

                  <div className="glass-effect rounded-lg p-4 border-t-4 border-accent">
                    <h4 className="font-bold text-accent mb-3 flex items-center gap-2">
                      <span className="gradient-accent rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                        3
                      </span>
                      CIERRE
                    </h4>
                    <div
                      className="text-sm text-foreground leading-relaxed space-y-2"
                      dangerouslySetInnerHTML={{
                        __html: session.secuenciaMetodologica.cierre
                          .replaceAll(/\*\*(.*?)\*\*/g, "<strong class='text-accent'>$1</strong>")
                          .replaceAll("\n", "<br>"),
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Distribución Horaria con visualización */}
          {session.distribucionHoras && (
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
          {session.procesosDidacticos && session.procesosDidacticos.length > 0 && (
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
                  {session.procesosDidacticos.map((proceso, index) => (
                    <div key={index} className="glass-effect rounded-lg p-3 text-center hover:glow-accent/30 transition-all duration-300">
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
          {session.materialesDisponibles && (
            <Card className="glass-effect border-0 glow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Materiales Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="glass-effect rounded-lg p-4 border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent">
                  <p className="text-foreground leading-relaxed text-sm">{session.materialesDisponibles}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Materiales Didácticos Sugeridos - Grid 2 columnas */}
          {session.materialesDidacticosSugeridos && session.materialesDidacticosSugeridos.length > 0 && (
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
                  {session.materialesDidacticosSugeridos.map((material, index) => (
                    <div key={index} className="glass-effect rounded-lg p-3 border-l-4 border-primary flex items-start gap-3">
                      <Package className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{material}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actividades Contextualizadas - Grid 2 columnas */}
          {session.actividadesContextualizadas && session.actividadesContextualizadas.length > 0 && (
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
                  {session.actividadesContextualizadas.map((actividad, index) => (
                    <div key={index} className="glass-effect rounded-lg p-3 border-l-4 border-secondary flex items-start gap-3">
                      <Zap className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{actividad}</p>
                    </div>
                  ))}
                </div>
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
