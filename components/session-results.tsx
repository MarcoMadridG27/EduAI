"use client"

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
} from "lucide-react"
import type { SessionData } from "@/app/page"

// Función para parsear el output plano de Gemini
function parseGeminiText(text: string) {
  if (!text) return null;
  const lines = text.split(/\r?\n/).map(l => l.trim());
  let title = "", tema = "", competencia = "", duracion = "", contexto = "";
  let procesos: { titulo: string, items: string[] }[] = [];
  let criterios: string[] = [];
  let currentProceso: { titulo: string, items: string[] } | null = null;
  let inCriterios = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0 && line.startsWith("📘")) {
      title = line.replace("📘", "").trim();
      continue;
    }
    if (line.startsWith("Tema:")) tema = line.replace("Tema:", "").trim();
    else if (line.startsWith("Competencia:")) competencia = line.replace("Competencia:", "").trim();
    else if (line.startsWith("Duración:")) duracion = line.replace("Duración:", "").trim();
    else if (line.startsWith("Contexto:")) contexto = line.replace("Contexto:", "").trim();
    else if (/^\d+\./.test(line)) {
      // Proceso didáctico
      if (currentProceso) procesos.push(currentProceso);
      const titulo = line.replace(/^\d+\.\s*/, "").replace(":", "").trim();
      currentProceso = { titulo, items: [] };
    } else if (line.startsWith("- ") && currentProceso && !inCriterios) {
      currentProceso.items.push(line.replace("- ", "").trim());
    } else if (line.startsWith("✅")) {
      if (currentProceso) procesos.push(currentProceso);
      inCriterios = true;
    } else if (inCriterios && line.startsWith("- ")) {
      criterios.push(line.replace("- ", "").trim());
    }
  }
  if (currentProceso && !procesos.includes(currentProceso)) procesos.push(currentProceso);
  return { title, tema, competencia, duracion, contexto, procesos, criterios };
}

interface SessionResultsProps {
  session: SessionData
  onBack: () => void
  onViewDashboard: () => void
  onEdit: () => void
}

export function SessionResults({ session, onBack, onViewDashboard, onEdit }: SessionResultsProps) {
  const handleExportPDF = () => {
    // Simulamos exportación a PDF
    alert("Exportando sesión a PDF...")
  }

  const handleSaveSession = () => {
    alert("Sesión guardada en tu dashboard...")
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
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="glass-effect border-primary/30 hover:glow-primary bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="glass-effect border-0 glow-primary/10">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {session.tema}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      Ciclo {session.ciclo}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Contexto {session.contexto}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.horasClase} {session.horasClase === 1 ? "hora" : "horas"}
                    </span>
                  </CardDescription>
                </div>
                <Badge className="gradient-primary text-white glow-primary">
                  <Brain className="h-3 w-3 mr-1" />
                  IA + Currículo
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">COMPETENCIAS SELECCIONADAS:</h4>
                  <div className="space-y-2">
                    {session.competenciasSeleccionadas?.map((competencia, index) => (
                      <Badge key={index} variant="secondary" className="glass-effect text-sm px-3 py-1">
                        <Target className="h-3 w-3 mr-1" />
                        {competencia}
                      </Badge>
                    ))}
                  </div>
                </div>
                {session.materialesDisponibles && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">MATERIALES DISPONIBLES:</h4>
                    <div className="glass-effect rounded-xl p-3 border-l-4 border-secondary">
                      <p className="text-foreground text-sm leading-relaxed">{session.materialesDisponibles}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 glow-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-6 w-6 text-accent" />
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  Competencia y Nivel Esperado
                </span>
              </CardTitle>
              <CardDescription>Según currículo nacional para el ciclo seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="glass-effect rounded-xl p-4 border-l-4 border-accent">
                <p className="text-foreground leading-relaxed text-lg">{session.competenciaDescripcion}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 glow-secondary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Clock className="h-6 w-6 text-secondary" />
                <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  Secuencia Metodológica Completa
                </span>
              </CardTitle>
              <CardDescription>Estructura pedagógica Inicio - Desarrollo - Cierre</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {session.secuenciaMetodologica && session.secuenciaMetodologica.inicio && session.secuenciaMetodologica.desarrollo && session.secuenciaMetodologica.cierre ? (
                <>
                  <div className="glass-effect rounded-xl p-4 border-l-4 border-primary">
                    <h4 className="font-bold text-primary mb-2">INICIO</h4>
                    <div
                      className="text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: session.secuenciaMetodologica.inicio.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  </div>
                  <div className="glass-effect rounded-xl p-4 border-l-4 border-secondary">
                    <h4 className="font-bold text-secondary mb-2">DESARROLLO</h4>
                    <div
                      className="text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: session.secuenciaMetodologica.desarrollo
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n/g, "<br>"),
                      }}
                    />
                  </div>
                  <div className="glass-effect rounded-xl p-4 border-l-4 border-accent">
                    <h4 className="font-bold text-accent mb-2">CIERRE</h4>
                    <div
                      className="text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: session.secuenciaMetodologica.cierre.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  </div>
                </>
              ) : (
                (() => {
                  const parsed = parseGeminiText(session.competenciaDescripcion || "");
                  if (!parsed) return <div className="text-muted-foreground">No hay información disponible.</div>;
                  return (
                    <div className="space-y-6">
                      <div className="glass-effect rounded-xl p-4 border-l-4 border-primary">
                        <h4 className="font-bold text-primary mb-2">{parsed.title || "Sesión Generada"}</h4>
                        <div className="text-foreground leading-relaxed">
                          {parsed.tema && <div><strong>Tema:</strong> {parsed.tema}</div>}
                          {parsed.competencia && <div><strong>Competencia:</strong> {parsed.competencia}</div>}
                          {parsed.duracion && <div><strong>Duración:</strong> {parsed.duracion}</div>}
                          {parsed.contexto && <div><strong>Contexto:</strong> {parsed.contexto}</div>}
                        </div>
                      </div>
                      {parsed.procesos.length > 0 && (
                        <div className="space-y-4">
                          {parsed.procesos.map((proc, idx) => (
                            <div key={idx} className="glass-effect rounded-xl p-4 border-l-4 border-secondary">
                              <h5 className="font-bold text-secondary mb-2">{proc.titulo}</h5>
                              <ul className="list-disc pl-6 space-y-1">
                                {proc.items.map((item, i) => (
                                  <li key={i} className="text-foreground leading-relaxed">{item}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                      {parsed.criterios.length > 0 && (
                        <div className="glass-effect rounded-xl p-4 border-l-4 border-accent">
                          <h5 className="font-bold text-accent mb-2">Criterios de Evaluación</h5>
                          <ul className="list-disc pl-6 space-y-1">
                            {parsed.criterios.map((crit, i) => (
                              <li key={i} className="text-foreground leading-relaxed">{crit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 glow-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BookOpen className="h-6 w-6 text-accent" />
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  Procesos Didácticos de Matemática
                </span>
              </CardTitle>
              <CardDescription>Los 5 procesos específicos según MINEDU</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {session.procesosDidacticos?.map((proceso, index) => (
                  <div
                    key={index}
                    className="glass-effect rounded-xl p-4 hover:glow-accent/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="gradient-accent rounded-full p-2 glow-accent">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="font-medium">{proceso}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {session.materialesDidacticosSugeridos && session.materialesDidacticosSugeridos.length > 0 && (
            <Card className="glass-effect border-0 glow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Materiales Didácticos Sugeridos
                  </span>
                </CardTitle>
                <CardDescription>Sugerencias personalizadas según el tema y materiales disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {session.materialesDidacticosSugeridos.map((material, index) => (
                    <div key={index} className="glass-effect rounded-xl p-4 border-l-4 border-primary">
                      <div className="flex items-start gap-3">
                        <div className="gradient-primary rounded-full p-1 glow-primary mt-1">
                          <Package className="h-3 w-3 text-white" />
                        </div>
                        <p className="text-foreground leading-relaxed">{material}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="glass-effect border-0 glow-secondary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="h-6 w-6 text-secondary" />
                <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  Actividades Contextualizadas
                </span>
              </CardTitle>
              <CardDescription>Adaptadas al contexto {(session.contexto ? session.contexto.toLowerCase() : "N/A")} seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {session.actividadesContextualizadas?.map((actividad, index) => (
                  <div key={index} className="glass-effect rounded-xl p-4 border-l-4 border-secondary">
                    <div className="flex items-start gap-3">
                      <div className="gradient-secondary rounded-full p-1 glow-secondary mt-1">
                        <Zap className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-foreground leading-relaxed">{actividad}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 glow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Clock className="h-6 w-6 text-primary" />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Distribución en las Horas de Clase
                </span>
              </CardTitle>
              <CardDescription>Cómo se reparte la secuencia en el tiempo elegido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="glass-effect rounded-xl p-4 border-l-4 border-primary">
                <p className="text-foreground leading-relaxed text-lg">{session.distribucionHoras}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Button
              onClick={handleSaveSession}
              className="gradient-primary glow-primary hover:scale-105 transition-all duration-300 h-12"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Guardar Sesión
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="glass-effect border-accent/30 hover:glow-accent h-12 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Generar PDF
            </Button>
          </div>

          <div className="text-center pt-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="glass-effect border-primary/30 hover:glow-primary px-8 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Generar Nueva Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
