"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain, User, BarChart3, Loader2, Sparkles, Target, Clock, Package,
  Award, CheckCircle2, X, Calculator, LineChart, Ruler, BarChart,
  ChevronDown, ChevronUp, Info, FileText, BookOpen, GraduationCap
} from "lucide-react"
import type { SessionData } from "@/app/page"

interface SessionGeneratorProps {
  readonly user?: { readonly name: string; readonly email: string } | null
  readonly onSessionGenerated: (session: SessionData) => void
  readonly onViewDashboard: () => void
  readonly onLogout: () => void
  readonly editingSession?: SessionData | null
  readonly guestMode?: boolean
  readonly onLoginRequired?: () => void
}

const competenciasData = [
  { name: "Resuelve problemas de cantidad", icon: Calculator },
  { name: "Resuelve problemas de regularidad, equivalencia y cambio", icon: LineChart },
  { name: "Resuelve problemas de forma, movimiento y localización", icon: Ruler },
  { name: "Resuelve problemas de gestión de datos e incertidumbre", icon: BarChart }
]

const capacidadesPorCompetencia: Record<string, string[]> = {
  "Resuelve problemas de cantidad": [
    "Traduce cantidades a expresiones numéricas",
    "Comunica su comprensión sobre los números y las operaciones",
    "Usa estrategias y procedimientos de estimación y cálculo",
    "Argumenta afirmaciones sobre las relaciones numéricas y las operaciones"
  ],
  "Resuelve problemas de regularidad, equivalencia y cambio": [
    "Traduce datos y condiciones a expresiones algebraicas y gráficas",
    "Comunica su comprensión sobre las relaciones algebraicas",
    "Usa estrategias y procedimientos para encontrar equivalencias y reglas generales",
    "Argumenta afirmaciones sobre relaciones de cambio y equivalencia"
  ],
  "Resuelve problemas de forma, movimiento y localización": [
    "Modela objetos con formas geométricas y sus transformaciones",
    "Comunica su comprensión sobre las formas y relaciones geométricas",
    "Usa estrategias y procedimientos para orientarse en el espacio",
    "Argumenta afirmaciones sobre relaciones geométricas"
  ],
  "Resuelve problemas de gestión de datos e incertidumbre": [
    "Representa datos con gráficos y medidas estadísticas o probabilísticas",
    "Comunica su comprensión de los conceptos estadísticos y probabilísticos",
    "Usa estrategias y procedimientos para recopilar y procesar datos",
    "Sustenta conclusiones o decisiones con base en la información obtenida"
  ]
}

const competenciasTransversales = [
  "Se desenvuelve en entornos virtuales generados por las TIC",
  "Gestiona su aprendizaje de manera autónoma"
]

const enfoquesTransversales = [
  "Enfoque de Derechos",
  "Enfoque Inclusivo o de Atención a la Diversidad",
  "Enfoque Intercultural",
  "Enfoque de Igualdad de Género",
  "Enfoque Ambiental",
  "Enfoque de Búsqueda de la Excelencia",
  "Enfoque de Orientación al Bien Común"
]

const enfoquesDescripciones: Record<string, string> = {
  "Enfoque de Derechos": "Fomenta el reconocimiento de los derechos y deberes, promoviendo la participación democrática.",
  "Enfoque Inclusivo o de Atención a la Diversidad": "Busca que todos los estudiantes tengan las mismas oportunidades de aprendizaje.",
  "Enfoque Intercultural": "Promueve el intercambio y enriquecimiento mutuo entre distintas culturas.",
  "Enfoque de Igualdad de Género": "Reconoce que hombres y mujeres tienen los mismos derechos y oportunidades.",
  "Enfoque Ambiental": "Orienta hacia la formación de una conciencia crítica sobre el cuidado del medio ambiente.",
  "Enfoque de Búsqueda de la Excelencia": "Incentiva el desarrollo del máximo potencial para el éxito personal y social.",
  "Enfoque de Orientación al Bien Común": "Promueve valores, virtudes cívicas y sentido de justicia para la construcción de una sociedad equitativa."
}

const contextosLocales = [
  "Urbano (ciudad / zona metropolitana)",
  "Urbano-marginal (periferia de ciudad)",
  "Rural (zona campo, sierra, selva)",
  "Costero / litoral",
  "Comunidad indígena o bilingüe"
]

const instrumentosEvaluacion = [
  "Que la IA lo decida automáticamente",
  "Lista de cotejo",
  "Rúbrica",
  "Escala de valoración",
  "Ficha de observación"
]

const materialesPorContexto: Record<string, string[]> = {
  "Urbano": ["Pizarra acrílica", "Plumones", "Proyector", "Laptop", "Calculadoras", "Reglas", "Compás"],
  "Urbano-marginal": ["Pizarra", "Plumones", "Papelotes", "Material reciclado", "Reglas"],
  "Rural": ["Pizarra", "Tizas", "Borrador", "Papel bond", "Lápices", "Material del entorno (piedras, semillas)"],
  "Costero": ["Pizarra", "Plumones", "Conchas marinas", "Redes", "Cuerdas", "Material del entorno"],
  "Comunidad": ["Pizarra", "Tizas", "Materiales de la comunidad", "Elementos naturales", "Telares"]
}

interface WebSocketMessageConfig {
  socket: WebSocket
  intervalId: ReturnType<typeof setInterval>
  sId: string
  tracker: { current: number }
  formData: Partial<SessionData>
  setCurrentStep: (step: string) => void
  setProgress: (progress: number) => void
  setIsGenerating: (isGenerating: boolean) => void
  onSessionGenerated: (session: SessionData) => void
}

function handleWebSocketMessage(event: MessageEvent, config: WebSocketMessageConfig) {
  try {
    const data = JSON.parse(event.data)

    if (data.status === 'progress') {
      if (data.step) config.setCurrentStep(data.step)
      if (data.progress) {
        config.setProgress(data.progress)
        config.tracker.current = data.progress
      } else {
        config.tracker.current = Math.min(config.tracker.current + 15, 90)
        config.setProgress(config.tracker.current)
      }
    } else if (data.status === 'completed') {
      clearInterval(config.intervalId)
      config.setProgress(100)
      config.setCurrentStep("¡Sesión generada exitosamente!")

      if (!data.data || typeof data.data !== 'object') {
        throw new Error("La sesión generada no tiene el formato correcto")
      }

      setTimeout(() => {
        const sessionData = {
          ...config.formData,
          ...data.data,
          session_id: config.sId,
        }
        config.onSessionGenerated(sessionData)
        config.socket.close()
      }, 1000)
    } else if (data.status === 'error') {
      clearInterval(config.intervalId)
      config.setIsGenerating(false)
      alert("Error de IA: " + (data.message || "desconocido"))
      config.socket.close()
    }
  } catch (e) {
    clearInterval(config.intervalId)
    config.setIsGenerating(false)
    console.error("Error parsing websocket message data:", e)
    alert("Error al procesar la respuesta del servidor")
    config.socket.close()
  }
}

function getContextoBase(ctx: string) {
  if (!ctx) return ""
  if (ctx.includes("Urbano (")) return "Urbano"
  if (ctx.includes("Urbano-marginal")) return "Urbano-marginal"
  if (ctx.includes("Rural")) return "Rural"
  if (ctx.includes("Costero")) return "Costero"
  if (ctx.includes("Comunidad")) return "Comunidad"
  return ""
}

function calculateFormProgress(
  nombreDocente: string,
  grado: string,
  hasCompetencias: boolean,
  tema: string,
  tituloSesion: string,
  contexto: string
) {
  let fields = 0
  const totalFields = 6
  if (nombreDocente) fields++
  if (grado) fields++
  if (hasCompetencias) fields++
  if (tema) fields++
  if (tituloSesion) fields++
  if (contexto) fields++
  return (fields / totalFields) * 100
}

interface RunWebSocketGenerationParams {
  tema: string
  tituloSesion: string
  nombreDocente: string
  fecha: string
  grado: string
  seccion: string
  competenciasSeleccionadas: string[]
  capacidadesSeleccionadas: string[]
  enfoqueTransversal: string
  competenciaTransversal: string
  ciclo: string
  contexto: string
  horasClase: number
  materialesSeleccionados: string[]
  materialesNoEstructurados: string
  instrumentoEvaluacion: string
  user: any
  setCurrentStep: (step: string) => void
  setProgress: (progress: number) => void
  setIsGenerating: (isGenerating: boolean) => void
  onSessionGenerated: (session: SessionData) => void
  formData: Partial<SessionData>
}

function runWebSocketSessionGeneration(params: RunWebSocketGenerationParams) {
  const materialesCombinados = [
    ...params.materialesSeleccionados,
    ...(params.materialesNoEstructurados ? [params.materialesNoEstructurados] : [])
  ].join(", ")

  const evalInst = params.instrumentoEvaluacion === instrumentosEvaluacion[0] ? "A decisión de la IA" : params.instrumentoEvaluacion

  const message = `Tema de la Sesión: ${params.tema}
Título: ${params.tituloSesion}
Docente: ${params.nombreDocente}
Fecha: ${params.fecha}
Grado: ${params.grado}º Secundaria
Sección: ${params.seccion}
Competencias: ${params.competenciasSeleccionadas.join(", ")}
Capacidades: ${params.capacidadesSeleccionadas.join(", ")}
Enfoque Transversal: ${params.enfoqueTransversal}
Competencia Transversal: ${params.competenciaTransversal}
Ciclo: ${params.ciclo}
Contexto Social: ${params.contexto}
Duración: ${params.horasClase} horas (${params.horasClase * 45} minutos)
Materiales: ${materialesCombinados}
Instrumento de Evaluación Sugerido: ${evalInst}

Nota: La IA debe generar automáticamente:
- Propósito de la Sesión
- Criterios de Evaluación
- Evidencias de Aprendizaje
- Desarrollo de la sesión (Inicio, Desarrollo, Cierre)
- Recursos y materiales estructurados`

  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || ""
  let wsUrl = webhookUrl
    .replace(/^https:\/\//, "wss://")
    .replace(/^http:\/\//, "ws://")

  if (wsUrl.includes("/webhook")) {
    wsUrl = wsUrl.replace("/webhook", "/ws/generate")
  } else {
    wsUrl = wsUrl.replace(/\/$/, "") + "/ws/generate"
  }

  const ws = new WebSocket(wsUrl)
  let currentProgress = 0

  const loadingMessages = [
    "Analizando el currículo nacional...",
    "Diseñando la secuencia didáctica...",
    "Preparando las evidencias y criterios...",
    "Ajustando al contexto social...",
    "Casi listo..."
  ]

  let messageIndex = 0
  const messageInterval = setInterval(() => {
    if (currentProgress < 90) {
      params.setCurrentStep(loadingMessages[messageIndex % loadingMessages.length])
      messageIndex++
    }
  }, 3000)

  ws.onopen = () => {
    ws.send(JSON.stringify({
      session_id: sessionId,
      message: message
    }))
  }

  ws.onmessage = (event) => {
    const tracker = { current: currentProgress }
    handleWebSocketMessage(event, {
      socket: ws,
      intervalId: messageInterval,
      sId: sessionId,
      tracker,
      formData: params.formData,
      setCurrentStep: params.setCurrentStep,
      setProgress: params.setProgress,
      setIsGenerating: params.setIsGenerating,
      onSessionGenerated: params.onSessionGenerated,
    })
    currentProgress = tracker.current
  }

  ws.onerror = (error) => {
    clearInterval(messageInterval)
    params.setIsGenerating(false)
    params.setProgress(0)
    params.setCurrentStep("")
    alert("Error de conexión al generar la sesión. Asegúrate de que el backend esté en ejecución.")
    ws.close()
  }
}

function useSessionGeneratorState({ user, onSessionGenerated, editingSession, guestMode = false, onLoginRequired }: SessionGeneratorProps) {
  const [nombreDocente, setNombreDocente] = useState("")
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [grado, setGrado] = useState("")
  const [seccion, setSeccion] = useState("")

  const ciclo = useMemo(() => {
    const cicloMap: Record<string, string> = { "1": "VI", "2": "VI", "3": "VII", "4": "VII", "5": "VII" }
    return cicloMap[grado] ?? ""
  }, [grado])

  const [competenciasSeleccionadas, setCompetenciasSeleccionadas] = useState<string[]>([])
  const [capacidadesSeleccionadas, setCapacidadesSeleccionadas] = useState<string[]>([])
  const [competenciaExpandida, setCompetenciaExpandida] = useState<string | null>(null)

  const [tema, setTema] = useState("")
  const [tituloSesion, setTituloSesion] = useState("")

  const [enfoqueTransversal, setEnfoqueTransversal] = useState("")
  const [competenciaTransversal, setCompetenciaTransversal] = useState("")

  const [contexto, setContexto] = useState("")
  const [horasClase, setHorasClase] = useState<number>(1)

  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<string[]>([])
  const [materialesNoEstructurados, setMaterialesNoEstructurados] = useState("")

  const [instrumentoEvaluacion, setInstrumentoEvaluacion] = useState(instrumentosEvaluacion[0])

  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [showErrors, setShowErrors] = useState(false)

  useEffect(() => {
    if (!editingSession) return
    const {
      tema = "",
      tituloSesion,
      titulo,
      competenciasSeleccionadas,
      contexto = "",
      horasClase = 1,
      enfoqueTransversal = "",
      competenciaTransversal = "",
    } = editingSession
    setTema(tema)
    setTituloSesion(tituloSesion ?? titulo ?? tema)
    setCompetenciasSeleccionadas(Array.isArray(competenciasSeleccionadas) ? competenciasSeleccionadas : [])
    setContexto(contexto)
    setHorasClase(horasClase)
    setEnfoqueTransversal(enfoqueTransversal)
    setCompetenciaTransversal(competenciaTransversal)
  }, [editingSession])

  const contextoBase = getContextoBase(contexto)

  useEffect(() => {
    const materiales = materialesPorContexto[contextoBase] || []
    setMaterialesSeleccionados(materiales)
  }, [contextoBase])

  const addCompetencia = (competencia: string) => {
    setCompetenciasSeleccionadas((prev) => [...prev, competencia])
    setCompetenciaExpandida(competencia)
  }

  const removeCompetencia = (competencia: string) => {
    setCompetenciasSeleccionadas((prev) => prev.filter((c) => c !== competencia))
    const capacidadesToRemove = capacidadesPorCompetencia[competencia] || []
    setCapacidadesSeleccionadas((prev) => prev.filter((c) => !capacidadesToRemove.includes(c)))
    if (competenciaExpandida === competencia) {
      setCompetenciaExpandida(null)
    }
  }

  const addCapacidad = (capacidad: string) => {
    setCapacidadesSeleccionadas((prev) => [...prev, capacidad])
  }

  const removeCapacidad = (capacidad: string) => {
    setCapacidadesSeleccionadas((prev) => prev.filter((c) => c !== capacidad))
  }

  const toggleMaterial = (material: string) => {
    setMaterialesSeleccionados((prev) =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    )
  }

  const toggleAccordion = (competencia: string) => {
    setCompetenciaExpandida(competenciaExpandida === competencia ? null : competencia)
  }

  const isValid = [
    nombreDocente,
    tema,
    tituloSesion,
    competenciasSeleccionadas.length > 0,
    grado,
    contexto,
    horasClase
  ].every(Boolean)

  const generateSession = async () => {
    if (guestMode) {
      onLoginRequired?.()
      return
    }

    if (!isValid) {
      setShowErrors(true)
      globalThis.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setCurrentStep("Iniciando conexión con IA...")

    const materialesCombinados = [
      ...materialesSeleccionados,
      ...(materialesNoEstructurados ? [materialesNoEstructurados] : [])
    ].join(", ")

    try {
      runWebSocketSessionGeneration({
        tema,
        tituloSesion,
        nombreDocente,
        fecha,
        grado,
        seccion,
        competenciasSeleccionadas,
        capacidadesSeleccionadas,
        enfoqueTransversal,
        competenciaTransversal,
        ciclo,
        contexto,
        horasClase,
        materialesSeleccionados,
        materialesNoEstructurados,
        instrumentoEvaluacion,
        user,
        setCurrentStep,
        setProgress,
        setIsGenerating,
        onSessionGenerated,
        formData: {
          datosGenerales: {
            docente: nombreDocente,
            fecha,
            grado,
            seccion,
            ciclo,
            titulo: tituloSesion,
          },
          tema,
          titulo: tituloSesion,
          tituloSesion,
          competenciasSeleccionadas,
          capacidades: capacidadesSeleccionadas,
          contexto,
          horasClase,
          enfoqueTransversal,
          competenciaTransversal,
          materialesDisponibles: materialesCombinados,
        },
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      alert(`Error: ${errorMessage}\n\nPor favor, intenta de nuevo.`)
      setIsGenerating(false)
    }
  }

  const formProgress = calculateFormProgress(
    nombreDocente,
    grado,
    competenciasSeleccionadas.length > 0,
    tema,
    tituloSesion,
    contexto
  )

  return {
    nombreDocente, setNombreDocente,
    fecha, setFecha,
    grado, setGrado,
    seccion, setSeccion,
    ciclo,
    competenciasSeleccionadas,
    capacidadesSeleccionadas,
    competenciaExpandida,
    tema, setTema,
    tituloSesion, setTituloSesion,
    enfoqueTransversal, setEnfoqueTransversal,
    competenciaTransversal, setCompetenciaTransversal,
    contexto, setContexto,
    horasClase, setHorasClase,
    materialesSeleccionados,
    materialesNoEstructurados, setMaterialesNoEstructurados,
    instrumentoEvaluacion, setInstrumentoEvaluacion,
    isGenerating,
    progress,
    currentStep,
    showErrors,
    addCompetencia,
    removeCompetencia,
    addCapacidad,
    removeCapacidad,
    toggleMaterial,
    toggleAccordion,
    generateSession,
    formProgress,
    contextoBase,
    isValid
  }
}

interface SessionHeaderProps {
  readonly guestMode: boolean
  readonly onLoginRequired?: () => void
  readonly onViewDashboard: () => void
  readonly onLogout: () => void
  readonly user?: { readonly name: string; readonly email: string } | null
}

function SessionHeader({
  guestMode,
  onLoginRequired,
  onViewDashboard,
  onLogout,
  user
}: Readonly<SessionHeaderProps>) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {guestMode ? (
            <Link href="/" aria-label="Ir a la página principal">
              <img src="/sesion_+.png" alt="Sesión+" className="h-16 w-auto object-contain drop-shadow-sm" />
            </Link>
          ) : (
            <img src="/sesion_+.png" alt="Sesión+" className="h-16 w-auto object-contain drop-shadow-sm" />
          )}
          <div>
            <h1 className="font-bold text-xl md:text-2xl text-slate-800 flex items-center gap-2">
              Genera tu Sesión de Aprendizaje
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-xs md:text-sm text-slate-500 font-medium">Asistente para docentes de matemática</p>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100 font-semibold">Powered by IA</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <Button
            variant="outline"
            onClick={() => {
              if (guestMode) {
                onLoginRequired?.()
              } else {
                onViewDashboard()
              }
            }}
            className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 transition-all h-9 text-sm font-medium shadow-sm"
          >
            <BarChart3 className="h-4 w-4 mr-2 text-slate-500" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          {guestMode ? (
            <Button
              onClick={onLoginRequired}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-4 rounded-full text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              Iniciar Sesión
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                <div className="bg-blue-100 p-1 rounded-full">
                  <User className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-700 truncate max-w-[100px] sm:max-w-[150px]">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                onClick={onLogout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-2 sm:px-3 font-medium"
                title="Cerrar Sesión"
              >
                <X className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

interface ProgressModalProps {
  readonly isGenerating: boolean
  readonly currentStep: string
  readonly progress: number
}

function ProgressModal({ isGenerating, currentStep, progress }: Readonly<ProgressModalProps>) {
  if (!isGenerating) return null
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <Card className="bg-white border border-slate-200 shadow-2xl max-w-md w-full rounded-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <img
              src="/pinguinos/pinguino_pensando.png"
              alt="Pingüino pensando"
              className="w-24 h-24 object-contain animate-bounce"
            />
          </div>
          <CardTitle className="text-2xl text-slate-800 font-bold">
            Diseñando tu Sesión
          </CardTitle>
          <CardDescription className="text-base text-blue-600 font-medium mt-1">
            {currentStep}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium px-1">
              <span>{progress}% completado</span>
              <span>~{Math.max(1, Math.ceil((100 - progress) / 15))}s restantes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface SessionSidebarSummaryProps {
  readonly nombreDocente: string
  readonly grado: string
  readonly ciclo: string
  readonly tema: string
  readonly competenciasSeleccionadas: readonly string[]
  readonly formProgress: number
}

function SessionSidebarSummary({
  nombreDocente,
  grado,
  ciclo,
  tema,
  competenciasSeleccionadas,
  formProgress
}: Readonly<SessionSidebarSummaryProps>) {
  return (
    <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Nueva Sesión</h2>
        <p className="text-slate-500 mt-1">Completa el formulario para generar tu clase con Inteligencia Artificial.</p>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-700">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Resumen de la Sesión
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Docente</p>
            <p className="text-sm font-medium text-slate-800">{nombreDocente || <span className="text-slate-300 italic">No especificado</span>}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Grado y Ciclo</p>
            <p className="text-sm font-medium text-slate-800">
              {grado ? (
                <span>
                  {grado}º Secundaria {ciclo && `(Ciclo ${ciclo})`}
                </span>
              ) : (
                <span className="text-slate-300 italic">No especificado</span>
              )}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tema Central</p>
            <p className="text-sm font-medium text-slate-800 line-clamp-2">{tema || <span className="text-slate-300 italic">No especificado</span>}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Competencias ({competenciasSeleccionadas.length})</p>
            {competenciasSeleccionadas.length > 0 ? (
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                {competenciasSeleccionadas.map(c => <li key={c} className="truncate">{c}</li>)}
              </ul>
            ) : (
              <p className="text-sm font-medium text-slate-300 italic">Ninguna seleccionada</p>
            )}
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-600">Progreso general</span>
              <span className="text-blue-600 font-bold">{Math.round(formProgress)}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${formProgress}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <Sparkles className="h-5 w-5 text-blue-600 shrink-0" />
        <p className="text-xs text-blue-800 font-medium leading-relaxed">
          La IA estructurará tu sesión automáticamente siguiendo el enfoque del Currículo Nacional (CNEB) y adaptando las actividades a tu contexto social seleccionado.
        </p>
      </div>
    </div>
  )
}

interface CompetenciasSectionProps {
  readonly showErrors: boolean
  readonly competenciasSeleccionadas: readonly string[]
  readonly competenciaExpandida: string | null
  readonly capacidadesSeleccionadas: readonly string[]
  readonly toggleAccordion: (competencia: string) => void
  readonly addCompetencia: (competencia: string) => void
  readonly removeCompetencia: (competencia: string) => void
  readonly addCapacidad: (capacidad: string) => void
  readonly removeCapacidad: (capacidad: string) => void
}

function CompetenciasSection({
  showErrors,
  competenciasSeleccionadas,
  competenciaExpandida,
  capacidadesSeleccionadas,
  toggleAccordion,
  addCompetencia,
  removeCompetencia,
  addCapacidad,
  removeCapacidad
}: Readonly<CompetenciasSectionProps>) {
  return (
    <section className="space-y-5 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-1.5 rounded-md">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">2. Competencias y Capacidades</h3>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-semibold text-slate-700">
          Competencias del CNEB <span className="text-red-500">*</span>
        </Label>

        <div className="grid grid-cols-1 gap-3">
          {competenciasData.map((comp) => {
            const Icon = comp.icon
            const isSelected = competenciasSeleccionadas.includes(comp.name)
            const isExpanded = competenciaExpandida === comp.name
            const capacidades = capacidadesPorCompetencia[comp.name] || []
            return (
              <div key={comp.name}>
                {/* Tarjeta de Competencia */}
                <div
                  className={`flex items-center p-4 rounded-xl border transition-all duration-200 shadow-sm ${isSelected
                      ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                      : "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                >
                  {/* Left & Middle Interactive Area */}
                  <button
                    type="button"
                    className="flex-1 flex items-center text-left"
                    onClick={() => {
                      if (isSelected) {
                        toggleAccordion(comp.name)
                      } else {
                        addCompetencia(comp.name)
                      }
                    }}
                  >
                    <div className={`p-2.5 rounded-lg mr-4 ${isSelected ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-500"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className={`font-semibold text-sm ${isSelected ? "text-blue-900" : "text-slate-700"}`}>
                        {comp.name}
                    </div>
                  </button>

                  {/* Right Interactive Area */}
                  <div className="flex items-center gap-3 ml-4">
                    {isSelected && (
                      <button
                        type="button"
                        onClick={() => toggleAccordion(comp.name)}
                        className="text-slate-400 hover:text-blue-600 p-1 bg-white rounded-md border border-slate-200 animate-in fade-in"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          removeCompetencia(comp.name)
                        } else {
                          addCompetencia(comp.name)
                        }
                      }}
                      className={`h-5 w-5 border-2 rounded flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 bg-white hover:border-blue-400"
                      }`}
                      aria-label={`Seleccionar ${comp.name}`}
                    >
                      {isSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </button>
                  </div>
                </div>

                {/* Acordeón de Capacidades */}
                {isSelected && isExpanded && (
                  <div className="mt-2 ml-4 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in slide-in-from-top-2">
                    <p className="text-xs text-slate-600 font-semibold mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                      Selecciona las capacidades:
                    </p>
                    <div className="flex flex-col gap-2">
                      {capacidades.map((capacidad) => {
                        const isCapSelected = capacidadesSeleccionadas.includes(capacidad)
                        return (
                          <button
                            key={capacidad}
                            type="button"
                            className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${isCapSelected
                                ? "bg-white border-blue-200 shadow-sm"
                                : "bg-transparent border-transparent hover:bg-slate-100"
                              }`}
                            onClick={() => {
                              if (isCapSelected) {
                                removeCapacidad(capacidad)
                              } else {
                                addCapacidad(capacidad)
                              }
                            }}
                          >
                            <div
                              className={`mt-0.5 h-5 w-5 min-w-[20px] min-h-[20px] border-2 rounded flex items-center justify-center transition-all ${
                                isCapSelected
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isCapSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                            <span className={`text-sm leading-snug font-medium ${isCapSelected ? "text-slate-900" : "text-slate-600"}`}>
                              {capacidad}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {showErrors && competenciasSeleccionadas.length === 0 && (
          <p className="text-xs text-red-500 font-medium">Selecciona al menos una competencia</p>
        )}
      </div>
    </section>
  )
}

interface MaterialesSectionProps {
  readonly contextoBase: string
  readonly materialesSeleccionados: readonly string[]
  readonly toggleMaterial: (material: string) => void
  readonly materialesNoEstructurados: string
  readonly setMaterialesNoEstructurados: (val: string) => void
}

function MaterialesSection({
  contextoBase,
  materialesSeleccionados,
  toggleMaterial,
  materialesNoEstructurados,
  setMaterialesNoEstructurados
}: Readonly<MaterialesSectionProps>) {
  return (
    <section className="space-y-5 animate-in fade-in">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="bg-violet-100 p-1.5 rounded-md">
          <Package className="h-5 w-5 text-violet-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">6. Materiales Didácticos</h3>
      </div>

      {contextoBase && materialesPorContexto[contextoBase] && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">Sugeridos para {contextoBase}</Label>
          <div className="flex flex-wrap gap-2">
            {materialesPorContexto[contextoBase].map((material) => {
              const isSelected = materialesSeleccionados.includes(material)
              return (
                <Button
                  key={material}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleMaterial(material)}
                  className={`h-9 rounded-full transition-all border shadow-sm ${isSelected
                      ? "bg-violet-50 border-violet-300 text-violet-700 hover:bg-violet-100"
                      : "bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                >
                  {isSelected ? <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-violet-600" /> : null}
                  {material}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="materialesNoEstructurados" className="text-sm font-semibold text-slate-700">Material No Estructurado (opcional)</Label>
        <Textarea
          id="materialesNoEstructurados"
          placeholder="Ej: chapas, piedritas, palitos, recortes de periódicos..."
          value={materialesNoEstructurados}
          onChange={(e) => setMaterialesNoEstructurados(e.target.value)}
          className="min-h-[80px] bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm resize-none"
        />
      </div>
    </section>
  )
}

export function SessionGenerator(props: SessionGeneratorProps) {
  const { user, onViewDashboard, onLogout, guestMode = false, onLoginRequired, editingSession } = props
  const {
    nombreDocente, setNombreDocente,
    fecha, setFecha,
    grado, setGrado,
    seccion, setSeccion,
    ciclo,
    competenciasSeleccionadas,
    capacidadesSeleccionadas,
    competenciaExpandida,
    tema, setTema,
    tituloSesion, setTituloSesion,
    enfoqueTransversal, setEnfoqueTransversal,
    competenciaTransversal, setCompetenciaTransversal,
    contexto, setContexto,
    horasClase, setHorasClase,
    materialesSeleccionados,
    materialesNoEstructurados, setMaterialesNoEstructurados,
    instrumentoEvaluacion, setInstrumentoEvaluacion,
    isGenerating,
    progress,
    currentStep,
    showErrors,
    addCompetencia,
    removeCompetencia,
    addCapacidad,
    removeCapacidad,
    toggleMaterial,
    toggleAccordion,
    generateSession,
    formProgress,
    contextoBase,
    isValid
  } = useSessionGeneratorState(props)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative font-sans">

      {/* HEADER LUMINOSO Y LIMPIO */}
      <SessionHeader
        guestMode={guestMode}
        onLoginRequired={onLoginRequired}
        onViewDashboard={onViewDashboard}
        onLogout={onLogout}
        user={user}
      />

      {/* Progress Modal */}
      <ProgressModal
        isGenerating={isGenerating}
        currentStep={currentStep}
        progress={progress}
      />

      {/* CONTENIDO PRINCIPAL A 2 COLUMNAS */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* SIDEBAR - RESUMEN (Pegajoso en Desktop) */}
          <SessionSidebarSummary
            nombreDocente={nombreDocente}
            grado={grado}
            ciclo={ciclo}
            tema={tema}
            competenciasSeleccionadas={competenciasSeleccionadas}
            formProgress={formProgress}
          />

          {/* FORMULARIO PRINCIPAL */}
          <div className="col-span-1 lg:col-span-8 space-y-6">

            {/* Título en Móvil */}
            <div className="lg:hidden mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Nueva Sesión</h2>
              <p className="text-slate-500 text-sm mt-1">Completa el formulario para generar tu clase con IA.</p>
            </div>

            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 space-y-10">

                {/* 1. DATOS GENERALES */}
                <section className="space-y-5 animate-in fade-in">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="bg-indigo-100 p-1.5 rounded-md">
                      <GraduationCap className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">1. Datos Generales</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="nombreDocente" className="text-sm font-semibold text-slate-700">
                        Nombre del Docente <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombreDocente"
                        placeholder="Ej: María García"
                        value={nombreDocente}
                        onChange={(e) => setNombreDocente(e.target.value)}
                        className={`h-11 bg-white border-${showErrors && !nombreDocente ? 'red-300' : 'slate-300'} focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm transition-all`}
                      />
                      {showErrors && !nombreDocente && <p className="text-xs text-red-500 font-medium">Este campo es requerido</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fecha" className="text-sm font-semibold text-slate-700">Fecha</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grado" className="text-sm font-semibold text-slate-700">
                        Grado <span className="text-red-500">*</span>
                      </Label>
                      <Select value={grado} onValueChange={setGrado}>
                        <SelectTrigger className={`h-11 bg-white border-${showErrors && !grado ? 'red-300' : 'slate-300'} focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm`}>
                          <SelectValue placeholder="Selecciona el grado" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                          <SelectItem value="1">1º Secundaria</SelectItem>
                          <SelectItem value="2">2º Secundaria</SelectItem>
                          <SelectItem value="3">3º Secundaria</SelectItem>
                          <SelectItem value="4">4º Secundaria</SelectItem>
                          <SelectItem value="5">5º Secundaria</SelectItem>
                        </SelectContent>
                      </Select>
                      {showErrors && !grado && <p className="text-xs text-red-500 font-medium">Selecciona un grado</p>}

                      {ciclo && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold animate-in fade-in duration-300">
                          <BookOpen className="h-3 w-3" />
                          Ciclo {ciclo}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seccion" className="text-sm font-semibold text-slate-700">Sección</Label>
                      <Input
                        id="seccion"
                        placeholder="Ej: A, B, Única"
                        value={seccion}
                        onChange={(e) => setSeccion(e.target.value)}
                        className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm"
                      />
                    </div>
                  </div>
                </section>

                {/* 2. COMPETENCIAS Y CAPACIDADES */}
                <CompetenciasSection
                  showErrors={showErrors}
                  competenciasSeleccionadas={competenciasSeleccionadas}
                  competenciaExpandida={competenciaExpandida}
                  capacidadesSeleccionadas={capacidadesSeleccionadas}
                  toggleAccordion={toggleAccordion}
                  addCompetencia={addCompetencia}
                  removeCompetencia={removeCompetencia}
                  addCapacidad={addCapacidad}
                  removeCapacidad={removeCapacidad}
                />

                {/* 3. CONTENIDO DE LA SESIÓN */}
                <section className="space-y-5 animate-in fade-in">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="bg-emerald-100 p-1.5 rounded-md">
                      <FileText className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">3. Contenido de la Sesión</h3>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="tema" className="text-sm font-semibold text-slate-700">
                        Tema central de la sesión <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tema"
                        placeholder="Ej: Fracciones, Porcentajes, Ecuaciones lineales, Área de figuras..."
                        value={tema}
                        onChange={(e) => setTema(e.target.value)}
                        className={`h-11 bg-white border-${showErrors && !tema ? 'red-300' : 'slate-300'} focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm`}
                      />
                      <p className="text-xs text-slate-500">
                        El contenido matemático que trabajarás. La IA lo relacionará con el contexto social.
                      </p>
                      {showErrors && !tema && <p className="text-xs text-red-500 font-medium">El tema es obligatorio</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tituloSesion" className="text-sm font-semibold text-slate-700">
                        Título de la Sesión <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tituloSesion"
                        placeholder="Ej: Calculando el IGV en compras usando porcentajes"
                        value={tituloSesion}
                        onChange={(e) => setTituloSesion(e.target.value)}
                        className={`h-11 bg-white border-${showErrors && !tituloSesion ? 'red-300' : 'slate-300'} focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm`}
                      />
                      <p className="text-xs text-slate-500">
                        El título debe reflejar la situación significativa que motivará el aprendizaje.
                      </p>
                      {showErrors && !tituloSesion && <p className="text-xs text-red-500 font-medium">El título es obligatorio</p>}
                    </div>
                  </div>
                </section>

                {/* 4. ENFOQUES TRANSVERSALES */}
                <section className="space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-100 p-1.5 rounded-md">
                        <Sparkles className="h-5 w-5 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">4. Enfoques Transversales</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="enfoqueTransversal" className="text-sm font-semibold text-slate-700">Enfoque Transversal</Label>
                      <Select value={enfoqueTransversal} onValueChange={setEnfoqueTransversal}>
                        <SelectTrigger className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm">
                          <SelectValue placeholder="Selecciona un enfoque" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                          {enfoquesTransversales.map((enfoque) => (
                            <SelectItem key={enfoque} value={enfoque}>{enfoque}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {enfoqueTransversal && enfoquesDescripciones[enfoqueTransversal] && (
                        <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-2 rounded-md border border-slate-100">
                          {enfoquesDescripciones[enfoqueTransversal]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="competenciaTransversal" className="text-sm font-semibold text-slate-700">Competencia Transversal</Label>
                      <Select value={competenciaTransversal} onValueChange={setCompetenciaTransversal}>
                        <SelectTrigger className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm">
                          <SelectValue placeholder="Selecciona una competencia" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                          {competenciasTransversales.map((comp) => (
                            <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                {/* 5. CONTEXTO Y DURACIÓN */}
                <section className="space-y-5 animate-in fade-in">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="bg-rose-100 p-1.5 rounded-md">
                      <Clock className="h-5 w-5 text-rose-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">5. Contexto y Duración</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contexto" className="text-sm font-semibold text-slate-700">
                        Contexto Social <span className="text-red-500">*</span>
                      </Label>
                      <Select value={contexto} onValueChange={setContexto}>
                        <SelectTrigger className={`h-11 bg-white border-${showErrors && !contexto ? 'red-300' : 'slate-300'} focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm`}>
                          <SelectValue placeholder="Selecciona el contexto" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                          {contextosLocales.map((ctx) => (
                            <SelectItem key={ctx} value={ctx}>{ctx}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {showErrors && !contexto && <p className="text-xs text-red-500 font-medium">Selecciona el contexto social</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="horas" className="text-sm font-semibold text-slate-700">
                        Horas de Clase <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="horas"
                          type="number"
                          min="1"
                          max="8"
                          value={horasClase}
                          onChange={(e) => setHorasClase(Number.parseInt(e.target.value) || 1)}
                          className="w-20 h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 text-center font-bold shadow-sm"
                        />
                        <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg flex-1">
                          <span className="text-sm text-slate-700 font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            {horasClase === 1 ? "1 hora = 45 min" : `${horasClase} horas = ${horasClase * 45} min`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 6. MATERIALES DIDÁCTICOS */}
                <MaterialesSection
                  contextoBase={contextoBase}
                  materialesSeleccionados={materialesSeleccionados}
                  toggleMaterial={toggleMaterial}
                  materialesNoEstructurados={materialesNoEstructurados}
                  setMaterialesNoEstructurados={setMaterialesNoEstructurados}
                />

                {/* 7. EVALUACIÓN */}
                <section className="space-y-5 animate-in fade-in pb-2">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="bg-fuchsia-100 p-1.5 rounded-md">
                      <Award className="h-5 w-5 text-fuchsia-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">7. Evaluación</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instrumentoEvaluacion" className="text-sm font-semibold text-slate-700">Instrumento de evaluación (opcional)</Label>
                    <Select value={instrumentoEvaluacion} onValueChange={setInstrumentoEvaluacion}>
                      <SelectTrigger className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm">
                        <SelectValue placeholder="Selecciona un instrumento" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-slate-900">
                        {instrumentosEvaluacion.map((inst) => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500">
                      La IA generará automáticamente los criterios de evaluación y evidencias basados en este instrumento.
                    </p>
                  </div>
                </section>
              </CardContent>
            </Card>

            {/* BOTÓN GENERAR */}
            <div className="pt-4 animate-in fade-in sticky bottom-4 z-20">
              <Button
                onClick={generateSession}
                disabled={isGenerating}
                className={`w-full h-14 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${isGenerating
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-600/30 hover:-translate-y-0.5"
                  }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin text-slate-400" />
                    Generando sesión...
                  </>
                ) : (
                  <>
                    <Brain className="h-6 w-6 mr-3 text-white" />
                    {editingSession ? "Actualizar Sesión" : "Generar Sesión con IA"}
                  </>
                )}
              </Button>

              {showErrors && !isValid && (
                <div className="mt-4 text-center p-3 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-sm font-semibold text-red-600 flex items-center justify-center gap-2">
                    <Info className="h-4 w-4" />
                    Revisa los campos marcados en rojo antes de continuar
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
