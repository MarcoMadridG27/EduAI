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
import { Progress } from "@/components/ui/progress"
import { Brain, User, BarChart3, Loader2, Sparkles, Zap, Target, Clock, Package, Calendar, Award, CheckCircle2, X } from "lucide-react"
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

// Mapeo de capacidades según competencias
const capacidadesPorCompetencia: Record<string, string[]> = {
  "Resuelve problemas de cantidad": [
    "Traduce cantidades a expresiones matemáticas",
    "Comunica su comprensión sobre los números y operaciones",
    "Usa estrategias y procedimientos para resolver problemas de cantidad",
    "Argumenta afirmaciones sobre relaciones numéricas y operaciones"
  ],
  "Resuelve problemas de regularidad, equivalencia y cambios": [
    "Traduce relaciones y cambios a expresiones algebraicas",
    "Comunica su comprensión del álgebra y funciones",
    "Usa estrategias y procedimientos para representar o resolver relaciones y cambios",
    "Argumenta afirmaciones sobre relaciones algebraicas y funciones"
  ],
  "Resuelve problemas de forma, movimiento y localización": [
    "Traduce información y propiedades geométricas",
    "Comunica su comprensión de las formas y relaciones geométricas",
    "Usa estrategias y procedimientos para resolver problemas geométricos",
    "Argumenta afirmaciones sobre relaciones geométricas"
  ],
  "Resuelve problemas de gestión de datos e incertidumbre": [
    "Traduce información estadística y probabilística",
    "Comunica su comprensión de datos, variabilidad e incertidumbre",
    "Usa estrategias y procedimientos para analizar datos o situaciones aleatorias",
    "Argumenta afirmaciones basadas en datos y probabilidades"
  ]
}

const competenciasTransversales = [
  "Se desenvuelve en entornos virtuales generados por las TICs",
  "Gestiona su aprendizaje de manera autónoma"
]

const enfoquesTransversales = [
  "Enfoque de Derechos",
  "Enfoque Inclusivo o de Atención a la Diversidad",
  "Enfoque Intercultural",
  "Enfoque Igualdad de Género",
  "Enfoque Ambiental",
  "Enfoque Orientación al Bien Común",
  "Enfoque Búsqueda de la Excelencia"
]

const ciclosDescripciones = {
  VI: "1º y 2º de secundaria (11-13 años)",
  VII: "3º, 4º y 5º de secundaria (14-17 años)",
}

const contextosLocales = ["Urbano", "Rural", "Agrícola", "Pesquero", "Comercial", "Minero", "Turístico"]

// Materiales predefinidos según contexto
const materialesPorContexto: Record<string, string[]> = {
  "Urbano": ["Pizarra acrílica", "Plumones", "Proyector", "Laptop", "Calculadoras", "Reglas", "Compás", "Transportador"],
  "Rural": ["Pizarra", "Tizas", "Borrador", "Papel bond", "Lápices", "Reglas", "Material del entorno (piedras, semillas)"],
  "Agrícola": ["Pizarra", "Tizas", "Papel bond", "Productos agrícolas (frutas, semillas)", "Cuerdas", "Estacas"],
  "Pesquero": ["Pizarra", "Tizas", "Redes", "Cuerdas", "Boyas", "Material marino"],
  "Comercial": ["Pizarra acrílica", "Plumones", "Calculadoras", "Billetes didácticos", "Monedas", "Etiquetas de precios"],
  "Minero": ["Pizarra", "Tizas", "Minerales", "Balanza", "Material del entorno"],
  "Turístico": ["Pizarra acrílica", "Plumones", "Mapas", "Brochures", "Fotos", "Material audiovisual"]
}

export function SessionGenerator({ user, onSessionGenerated, onViewDashboard, onLogout, editingSession }: SessionGeneratorProps) {
  // Nuevos campos
  const [nombreDocente, setNombreDocente] = useState("")
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [grado, setGrado] = useState("")
  const [seccion, setSeccion] = useState("")
  const [tituloSesion, setTituloSesion] = useState("")
  
  // Campos existentes actualizados
  const [competenciasSeleccionadas, setCompetenciasSeleccionadas] = useState<string[]>([])
  const [capacidadesSeleccionadas, setCapacidadesSeleccionadas] = useState<string[]>([])
  const [enfoqueTransversal, setEnfoqueTransversal] = useState("")
  const [competenciaTransversal, setCompetenciaTransversal] = useState("")
  
  const [ciclo, setCiclo] = useState("")
  const [contexto, setContexto] = useState("")
  const [horasClase, setHorasClase] = useState<number>(1)
  
  // Materiales
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<string[]>([])
  const [materialesNoEstructurados, setMaterialesNoEstructurados] = useState("")
  
  // Estado de generación
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  useEffect(() => {
    if (editingSession) {
      setTituloSesion(editingSession.tema || "")
      setCompetenciasSeleccionadas(Array.isArray(editingSession.competenciasSeleccionadas) ? editingSession.competenciasSeleccionadas : [])
      setCiclo(editingSession.ciclo)
      setContexto(editingSession.contexto)
      setHorasClase(editingSession.horasClase)
    }
  }, [editingSession])

  // Actualizar materiales cuando cambia el contexto
  useEffect(() => {
    if (contexto && materialesPorContexto[contexto]) {
      setMaterialesSeleccionados(materialesPorContexto[contexto])
    }
  }, [contexto])

  // Obtener capacidades disponibles según competencias seleccionadas
  const capacidadesDisponibles = competenciasSeleccionadas.flatMap(
    comp => capacidadesPorCompetencia[comp] || []
  )

  const handleCapacidadChange = (capacidad: string, checked: boolean) => {
    if (checked) {
      setCapacidadesSeleccionadas((prev) => [...prev, capacidad])
    } else {
      setCapacidadesSeleccionadas((prev) => prev.filter((c) => c !== capacidad))
    }
  }

  const toggleMaterial = (material: string) => {
    setMaterialesSeleccionados((prev) => 
      prev.includes(material) 
        ? prev.filter(m => m !== material)
        : [...prev, material]
    )
  }

  const simulateProgress = () => {
    const steps = [
      { progress: 15, message: "Analizando competencias y capacidades..." },
      { progress: 30, message: "Generando criterios de evaluación..." },
      { progress: 45, message: "Definiendo evidencias de aprendizaje..." },
      { progress: 60, message: "Estructurando propósito de la sesión..." },
      { progress: 75, message: "Integrando enfoque transversal..." },
      { progress: 90, message: "Finalizando secuencia metodológica..." },
      { progress: 100, message: "¡Sesión generada con éxito!" }
    ]

    let currentStepIndex = 0
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setProgress(steps[currentStepIndex].progress)
        setCurrentStep(steps[currentStepIndex].message)
        currentStepIndex++
      } else {
        clearInterval(interval)
      }
    }, 2000)

    return interval
  }

  const handleCompetenciaChange = (competencia: string, checked: boolean) => {
    if (checked) {
      setCompetenciasSeleccionadas((prev) => [...prev, competencia])
    } else {
      setCompetenciasSeleccionadas((prev) => prev.filter((c) => c !== competencia))
    }
  }

  const generateSession = async () => {
    if (!nombreDocente || !tituloSesion || competenciasSeleccionadas.length === 0 || !ciclo || !contexto || !horasClase) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setCurrentStep("Iniciando generación con IA...")
    
    const progressInterval = simulateProgress()

    try {
      const materialesCombinados = [
        ...materialesSeleccionados,
        ...(materialesNoEstructurados ? [materialesNoEstructurados] : [])
      ].join(", ")

      const message = `Título: ${tituloSesion}
Docente: ${nombreDocente}
Fecha: ${fecha}
Grado: ${grado}
Sección: ${seccion}
Competencias: ${competenciasSeleccionadas.join(", ")}
Capacidades: ${capacidadesSeleccionadas.join(", ")}
Enfoque Transversal: ${enfoqueTransversal}
Competencia Transversal: ${competenciaTransversal}
Ciclo: ${ciclo}
Contexto: ${contexto}
Duración: ${horasClase} horas
Materiales: ${materialesCombinados}

Nota: La IA debe generar automáticamente:
- Criterios de Evaluación
- Evidencias de Aprendizaje
- Propósito de la Sesión`

      const formData = new FormData()
      formData.append("Body", message)
      formData.append("From", user.email || user.name || "frontend")

      console.log("=== Enviando request al backend ===")
      console.log("URL:", process.env.NEXT_PUBLIC_WEBHOOK_URL || "https://eduai-pjfa.onrender.com/webhook")
      console.log("Body (message):", message)
      console.log("From:", user.email || user.name || "frontend")
      console.log("FormData entries:")
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value)
      }
      console.log("===================================")

      const response = await fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL || "https://eduai-pjfa.onrender.com/webhook", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Error al generar la sesión")
      
      const responseText = await response.text()
      let sessionData
      
      try {
        // Intenta parsear directamente
        sessionData = JSON.parse(responseText)
      } catch (e) {
        console.warn("JSON parse failed, trying to extract from markdown:", e)
        
        // Intenta extraer JSON de markdown code blocks
        const match = responseText.match(/```json\s*([\s\S]*?)\s*```/)
        if (match && match[1]) {
          try {
            sessionData = JSON.parse(match[1])
          } catch (e2) {
            console.error("Failed to parse JSON from markdown block:", e2)
            throw new Error("El formato de respuesta de la IA no es válido")
          }
        } else {
          // Intenta encontrar cualquier estructura JSON en el texto
          const jsonMatch = responseText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            try {
              sessionData = JSON.parse(jsonMatch[0])
            } catch (e3) {
              console.error("Failed to parse extracted JSON:", e3)
              console.error("Raw response:", responseText.substring(0, 500))
              throw new Error("No se pudo extraer JSON válido de la respuesta")
            }
          } else {
            console.error("No JSON found in response:", responseText.substring(0, 500))
            throw new Error("La respuesta no contiene JSON válido")
          }
        }
      }
      
      // Validar que sessionData tiene la estructura mínima esperada
      if (!sessionData || typeof sessionData !== 'object') {
        throw new Error("La sesión generada no tiene el formato correcto")
      }

      clearInterval(progressInterval)
      setProgress(100)
      setCurrentStep("¡Sesión generada exitosamente!")
      
      setTimeout(() => {
        onSessionGenerated(sessionData)
      }, 1000)
    } catch (err) {
      clearInterval(progressInterval)
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al generar la sesión"
      alert(`Error: ${errorMessage}\n\nPor favor, intenta de nuevo.`)
      console.error("Error generando sesión:", err)
      setIsGenerating(false)
      setProgress(0)
      setCurrentStep("")
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

          {/* Progress Modal */}
          {isGenerating && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="glass-effect border-0 glow-primary/20 max-w-md w-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="gradient-primary rounded-full p-4 glow-primary animate-pulse">
                      <Brain className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Generando Sesión con IA
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {currentStep}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={progress} className="h-3" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {progress}% completado
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Tiempo estimado: {Math.ceil((100 - progress) / 15)} segundos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="glass-effect border-0 glow-primary/10">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Formulario de Sesión
              </CardTitle>
              <CardDescription className="text-base">Completa todos los campos para generar tu sesión</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Datos Generales */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                  <Award className="h-5 w-5" />
                  Datos Generales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="nombreDocente" className="text-base font-semibold">
                      Nombre del Docente <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nombreDocente"
                      placeholder="Ej: María García"
                      value={nombreDocente}
                      onChange={(e) => setNombreDocente(e.target.value)}
                      className="h-12 glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="fecha" className="text-base font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      Fecha
                    </Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="h-12 glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="grado" className="text-base font-semibold">
                      Grado
                    </Label>
                    <Select value={grado} onValueChange={setGrado}>
                      <SelectTrigger className="h-12 glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300">
                        <SelectValue placeholder="Selecciona el grado" />
                      </SelectTrigger>
                      <SelectContent className="glass-effect border-border/50">
                        <SelectItem value="1">1º Secundaria</SelectItem>
                        <SelectItem value="2">2º Secundaria</SelectItem>
                        <SelectItem value="3">3º Secundaria</SelectItem>
                        <SelectItem value="4">4º Secundaria</SelectItem>
                        <SelectItem value="5">5º Secundaria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="seccion" className="text-base font-semibold">
                      Sección
                    </Label>
                    <Input
                      id="seccion"
                      placeholder="Ej: A, B, C"
                      value={seccion}
                      onChange={(e) => setSeccion(e.target.value)}
                      className="h-12 glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tituloSesion" className="text-base font-semibold">
                    Título de la Sesión <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tituloSesion"
                    placeholder="Ej: Resolviendo problemas de fracciones en situaciones cotidianas"
                    value={tituloSesion}
                    onChange={(e) => setTituloSesion(e.target.value)}
                    className="h-12 glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300"
                  />
                </div>
              </div>

              {/* Competencias y Capacidades */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  Competencias y Capacidades
                </h3>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Competencias <span className="text-red-500">*</span>
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

                {/* Capacidades - Se muestran solo si hay competencias seleccionadas */}
                {capacidadesDisponibles.length > 0 && (
                  <div className="space-y-4">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                      Capacidades (selecciona las que aplicarán)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Capacidades disponibles según las competencias seleccionadas
                    </p>
                    <div className="space-y-3">
                      {capacidadesDisponibles.map((capacidad, index) => (
                        <div key={`capacidad-${index}`} className="glass-effect rounded-xl p-3">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id={`capacidad-${index}`}
                              checked={capacidadesSeleccionadas.includes(capacidad)}
                              onCheckedChange={(checked) => handleCapacidadChange(capacidad, checked as boolean)}
                              className="border-border/50 mt-1"
                            />
                            <Label
                              htmlFor={`capacidad-${index}`}
                              className="font-medium cursor-pointer text-sm leading-relaxed"
                            >
                              {capacidad}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nota informativa sobre campos generados por IA */}
                <div className="glass-effect rounded-lg p-4 border-l-4 border-accent bg-gradient-to-r from-accent/5 to-transparent">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-accent mb-1">Generación Automática con IA</p>
                      <p className="text-xs text-muted-foreground">
                        Los <strong>Criterios de Evaluación</strong>, <strong>Evidencias de Aprendizaje</strong> y <strong>Propósito de la Sesión</strong> serán generados automáticamente por la IA según la información que proporciones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enfoques Transversales */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-secondary">
                  <Sparkles className="h-5 w-5" />
                  Enfoques Transversales
                </h3>

                <div className="space-y-3">
                  <Label htmlFor="enfoqueTransversal" className="text-base font-semibold">
                    Enfoque Transversal
                  </Label>
                  <Select value={enfoqueTransversal} onValueChange={setEnfoqueTransversal}>
                    <SelectTrigger className="h-12 glass-effect border-border/50 focus:border-secondary focus:glow-secondary transition-all duration-300">
                      <SelectValue placeholder="Selecciona el enfoque transversal" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect border-border/50">
                      {enfoquesTransversales.map((enfoque) => (
                        <SelectItem key={enfoque} value={enfoque}>
                          {enfoque}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="competenciaTransversal" className="text-base font-semibold">
                    Competencia Transversal
                  </Label>
                  <Select value={competenciaTransversal} onValueChange={setCompetenciaTransversal}>
                    <SelectTrigger className="h-12 glass-effect border-border/50 focus:border-secondary focus:glow-secondary transition-all duration-300">
                      <SelectValue placeholder="Selecciona la competencia transversal" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect border-border/50">
                      {competenciasTransversales.map((comp) => (
                        <SelectItem key={comp} value={comp}>
                          {comp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contexto y Duración */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-accent">
                  <Clock className="h-5 w-5" />
                  Contexto y Duración
                </h3>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Ciclo <span className="text-red-500">*</span>
                  </Label>
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
                    Contexto Social <span className="text-red-500">*</span>
                  </Label>
                  <Select value={contexto} onValueChange={setContexto}>
                    <SelectTrigger className="h-12 glass-effect border-border/50 focus:border-accent focus:glow-accent transition-all duration-300">
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
                  <p className="text-xs text-muted-foreground">
                    Los materiales se ajustarán automáticamente según el contexto
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="horas" className="text-base font-semibold">
                    Horas de Clase <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="horas"
                      type="number"
                      min="1"
                      max="6"
                      value={horasClase}
                      onChange={(e) => setHorasClase(Number.parseInt(e.target.value) || 1)}
                      className="w-24 h-12 glass-effect border-border/50 focus:border-accent focus:glow-accent transition-all duration-300 text-center"
                    />
                    <span className="text-sm text-muted-foreground">
                      {horasClase === 1 ? "1 hora (45 min)" : `${horasClase} horas (${horasClase * 45} min total)`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Materiales */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                  <Package className="h-5 w-5" />
                  Materiales Didácticos
                </h3>

                {contexto && materialesPorContexto[contexto] && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Materiales Disponibles (según contexto {contexto})
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {materialesPorContexto[contexto].map((material) => (
                        <Button
                          key={material}
                          type="button"
                          variant={materialesSeleccionados.includes(material) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleMaterial(material)}
                          className={`glass-effect transition-all duration-300 ${
                            materialesSeleccionados.includes(material)
                              ? "gradient-primary glow-primary text-white"
                              : "hover:border-primary/50"
                          }`}
                        >
                          {materialesSeleccionados.includes(material) ? (
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                          ) : (
                            <X className="h-4 w-4 mr-2" />
                          )}
                          {material}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label htmlFor="materialesNoEstructurados" className="text-base font-semibold">
                    Material No Estructurado (opcional)
                  </Label>
                  <Textarea
                    id="materialesNoEstructurados"
                    placeholder="Ej: chapas, piedritas, palitos, semillas, tapas de botella..."
                    value={materialesNoEstructurados}
                    onChange={(e) => setMaterialesNoEstructurados(e.target.value)}
                    className="min-h-[80px] glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Agrega materiales no estructurados del entorno que puedas utilizar
                  </p>
                </div>
              </div>

              <Button
                onClick={generateSession}
                disabled={!nombreDocente || !tituloSesion || competenciasSeleccionadas.length === 0 || !ciclo || !contexto || !horasClase || isGenerating}
                className="w-full h-14 gradient-primary glow-primary hover:scale-105 transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:hover:scale-100"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    Generando sesión con IA...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-3" />
                    {editingSession ? "Actualizar Sesión de Aprendizaje" : "Generar Sesión de Aprendizaje"}
                    <Sparkles className="h-5 w-5 ml-3 animate-pulse" />
                  </>
                )}
              </Button>

              {(!nombreDocente || !tituloSesion || competenciasSeleccionadas.length === 0 || !ciclo || !contexto) && (
                <p className="text-sm text-muted-foreground text-center">
                  <span className="text-red-500">*</span> Completa todos los campos obligatorios para generar la sesión
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
