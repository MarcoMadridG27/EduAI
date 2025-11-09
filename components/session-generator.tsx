"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Brain, User, BarChart3, Loader2, Sparkles, Zap, Target, Clock, Package } from "lucide-react"
import type { SessionData } from "@/app/page"

interface SessionGeneratorProps {
  user: { name: string; email: string }
  onSessionGenerated: (session: SessionData) => void
  onViewDashboard: () => void
  onLogout: () => void
  editingSession?: SessionData | null
}

const competenciasNacionales = [
  "Resuelve problemas de cantidad",
  "Resuelve problemas de regularidad, equivalencia y cambios",
  "Resuelve problemas de forma, movimiento y localización",
  "Resuelve problemas de gestión de datos e incertidumbre",
]

const ciclosDescripciones = {
  VI: "1º y 2º de secundaria (11-13 años)",
  VII: "3º, 4º y 5º de secundaria (14-17 años)",
}

const contextosLocales = ["Urbano", "Rural", "Agrícola", "Pesquero", "Comercial", "Minero", "Turístico"]

export function SessionGenerator({ user, onSessionGenerated, onViewDashboard, onLogout, editingSession }: SessionGeneratorProps) {
  const [tema, setTema] = useState("")
  const [competenciasSeleccionadas, setCompetenciasSeleccionadas] = useState<string[]>([])
  const [ciclo, setCiclo] = useState("")
  const [contexto, setContexto] = useState("")
  const [horasClase, setHorasClase] = useState<number>(1)
  const [materialesDisponibles, setMaterialesDisponibles] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (editingSession) {
      setTema(editingSession.tema)
      setCompetenciasSeleccionadas(Array.isArray(editingSession.competenciasSeleccionadas) ? editingSession.competenciasSeleccionadas : [])
      setCiclo(editingSession.ciclo)
      setContexto(editingSession.contexto)
      setHorasClase(editingSession.horasClase)
      setMaterialesDisponibles(editingSession.materialesDisponibles || "")
    }
  }, [editingSession])

  const handleCompetenciaChange = (competencia: string, checked: boolean) => {
    if (checked) {
      setCompetenciasSeleccionadas((prev) => [...prev, competencia])
    } else {
      setCompetenciasSeleccionadas((prev) => prev.filter((c) => c !== competencia))
    }
  }

  const generateSession = async () => {
    if (!tema || competenciasSeleccionadas.length === 0 || !ciclo || !contexto || !horasClase || !materialesDisponibles)
      return;
    setIsGenerating(true);
    try {
      // Construir el mensaje en el formato esperado por el backend
      const message = `Tema: ${tema}\nCompetencia: ${competenciasSeleccionadas.join(", ")}\nGrado: ${ciclo}\nContexto: ${contexto}\nDuración: ${horasClase} horas\nMateriales: ${materialesDisponibles}`;
      const formData = new FormData();
      formData.append("Body", message);
      formData.append("From", user.email || user.name || "frontend");
      const response = await fetch("https://eduai-pjfa.onrender.com/webhook", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error al generar la sesión");
      
      let sessionData = await response.json();
      // Si viene error y raw, intentar extraer el JSON real
      if (sessionData && sessionData.error && sessionData.raw) {
        // Extraer el bloque JSON ignorando los backticks y el encabezado "json"
        const match = sessionData.raw.match(/```json\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          try {
            sessionData = JSON.parse(match[1]);
          } catch (e) {
            // Si falla, dejar el error original
          }
        }
      }
      onSessionGenerated(sessionData);
    } catch (err) {
      alert("Error al generar la sesión. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 gradient-primary rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 gradient-secondary rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <header className="glass-effect border-b border-border/20 relative z-10">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="gradient-primary rounded-2xl p-3 glow-primary">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EduAI Matemática
              </h1>
              <p className="text-sm text-muted-foreground font-medium">Generador de Sesiones con IA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onViewDashboard}
              className="glass-effect border-secondary/30 hover:glow-secondary hover:border-secondary/60 transition-all duration-300 bg-transparent"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="destructive"
              onClick={onLogout}
              className="glass-effect hover:opacity-90 transition-all duration-300"
            >
              Cerrar Sesión
            </Button>
            <div className="flex items-center gap-3 glass-effect px-4 py-2 rounded-full">
              <User className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-accent animate-pulse" />
              <h2 className="text-4xl font-bold text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {editingSession ? "Editar Sesión de Aprendizaje" : "Genera tu Sesión de Aprendizaje"}
              </h2>
              <Zap className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground text-balance text-lg font-medium">
              Ingresa el tema y el sistema buscará automáticamente en el currículo nacional
            </p>
          </div>

          <Card className="glass-effect border-0 glow-primary/10">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Formulario de Entrada
              </CardTitle>
              <CardDescription className="text-base">Completa todos los campos para generar tu sesión</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="tema" className="text-base font-semibold">
                  Tema de la Clase
                </Label>
                <Input
                  id="tema"
                  placeholder="Ej: fracciones, funciones lineales, geometría..."
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  className="h-12 glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300"
                />
                <p className="text-xs text-muted-foreground">Texto libre, describe el tema matemático a desarrollar</p>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Competencia (selecciona las que aplicarán)
                </Label>
                <div className="space-y-3">
                  {competenciasNacionales.map((competencia, index) => (
                    <div key={index} className="glass-effect rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={`competencia-${index}`}
                          checked={competenciasSeleccionadas.includes(competencia)}
                          onCheckedChange={(checked) => handleCompetenciaChange(competencia, checked as boolean)}
                          className="border-border/50 mt-1"
                        />
                        <Label
                          htmlFor={`competencia-${index}`}
                          className="font-medium cursor-pointer text-sm leading-relaxed"
                        >
                          {competencia}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Ciclo</Label>
                <RadioGroup value={ciclo} onValueChange={setCiclo} className="space-y-3">
                  {Object.entries(ciclosDescripciones).map(([cicloKey, descripcion]) => (
                    <div key={cicloKey} className="glass-effect rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={cicloKey} id={`ciclo-${cicloKey}`} className="border-border/50" />
                        <Label htmlFor={`ciclo-${cicloKey}`} className="cursor-pointer">
                          <div>
                            <div className="font-medium">Ciclo {cicloKey}</div>
                            <div className="text-sm text-muted-foreground">{descripcion}</div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="contexto" className="text-base font-semibold">
                  Contexto Social
                </Label>
                <Select value={contexto} onValueChange={setContexto}>
                  <SelectTrigger className="h-12 glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300">
                    <SelectValue placeholder="Selecciona el contexto social" />
                  </SelectTrigger>
                  <SelectContent className="glass-effect border-border/50">
                    {contextosLocales.map((ctx) => (
                      <SelectItem key={ctx} value={ctx}>
                        {ctx}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Contexto del entorno donde se desarrollará la clase</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="horas" className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  Horas de Clase
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="horas"
                    type="number"
                    min="1"
                    max="6"
                    value={horasClase}
                    onChange={(e) => setHorasClase(Number.parseInt(e.target.value) || 1)}
                    className="w-24 h-12 glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300 text-center"
                  />
                  <span className="text-sm text-muted-foreground">
                    {horasClase === 1 ? "1 hora (45 min)" : `${horasClase} horas (${horasClase * 45} min total)`}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Número entero de horas pedagógicas (45 min c/u)</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="materiales" className="text-base font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4 text-secondary" />
                  Materiales Disponibles
                </Label>
                <Textarea
                  id="materiales"
                  placeholder="Ej: pizarra, plumones, papel bond, calculadoras, reglas, compás, material concreto, laptop, proyector..."
                  value={materialesDisponibles}
                  onChange={(e) => setMaterialesDisponibles(e.target.value)}
                  className="min-h-[100px] glass-effect border-border/50 focus:border-secondary focus:glow-secondary transition-all duration-300 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Describe los materiales y recursos que tienes disponibles en tu institución educativa
                </p>
              </div>

              <Button
                onClick={generateSession}
                disabled={
                  !tema ||
                  competenciasSeleccionadas.length === 0 ||
                  !ciclo ||
                  !contexto ||
                  !horasClase ||
                  !materialesDisponibles ||
                  isGenerating
                }
                className="w-full h-14 gradient-primary glow-primary hover:scale-105 transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:hover:scale-100"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    {editingSession ? "Actualizando sesión con IA..." : "Generando sesión con IA..."}
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-3" />
                    {editingSession ? "Actualizar Sesión de Aprendizaje" : "Generar Sesión de Aprendizaje"}
                    <Sparkles className="h-5 w-5 ml-3 animate-pulse" />
                  </>
                )}
              </Button>

              {(!tema || competenciasSeleccionadas.length === 0 || !ciclo || !contexto || !materialesDisponibles) && (
                <p className="text-sm text-muted-foreground text-center">
                  Completa todos los campos para generar la sesión
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
