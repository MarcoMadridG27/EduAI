"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  ArrowLeft,
  Eye,
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
  Share2,
  X,
} from "lucide-react"
import type { SessionData } from "@/app/page"
import { toast } from "sonner"
import { PdfPreview } from "@/components/pdf-preview"
import { useLanguage } from "@/lib/LanguageContext"

interface SessionResultsProps {
  readonly session: SessionData
  readonly isSavedSession?: boolean
  readonly onBack: () => void
  readonly onViewDashboard: () => void
  readonly onEdit: () => void
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
  const { session, isSavedSession, onBack, onViewDashboard } = props
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaved, setIsSaved] = useState(isSavedSession || false)
  const [isPublished, setIsPublished] = useState(session.is_public || false)
  const [showPreview, setShowPreview] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [publishConfirmed, setPublishConfirmed] = useState(false)
  const [activeTab, setActiveTab] = useState<'secuencia' | 'evaluacion' | 'recursos'>('secuencia')
  const contentRef = useRef<HTMLDivElement>(null)
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || ""

  // Estados editables
  const [editedSession, setEditedSession] = useState<SessionData>(session)

  // Parsear distribución horaria del backend
  const parseDistribucionHoras = () => {
    if (!editedSession.distribucionHoras) return { inicio: 0, desarrollo: 0, cierre: 0 }

    const text = editedSession.distribucionHoras.toLowerCase()
    const inicioRegex = /inicio\D*(\d+)/i
    const desarrolloRegex = /desarrollo\D*(\d+)/i
    const cierreRegex = /cierre\D*(\d+)/i

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


  // Save button content extraction to resolve SonarQube S1125/S3358 nested ternaries
  const renderSaveButtonContent = () => {
    if (isSaving) {
      return (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {t("loading")}
        </>
      )
    }
    if (isSaved) {
      return (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          {t("copied")}
        </>
      )
    }
    return (
      <>
        <CheckCircle className="h-4 w-4 mr-2" />
        {t("save")}
      </>
    )
  }

  const renderPublishButtonContent = () => {
    if (isPublished) {
      return (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          {t("copied")}
        </>
      )
    }
    return (
      <>
        <Share2 className="h-4 w-4 mr-2" />
        {t("exploreRepo")}
      </>
    )
  }

  const handleSaveSession = async (isPublic = false, sessionToSave?: SessionData) => {
    if (isPublic && isPublished) return
    if (!isPublic && isSaved && !sessionToSave) return
    setIsSaving(true)
    try {
      const accessToken = localStorage.getItem("access_token")
      const user = localStorage.getItem("user")

      if (!accessToken || !user) {
        alert("Debes estar autenticado para guardar sesiones")
        return
      }

      const userData = JSON.parse(user)

      const activeSession = sessionToSave || editedSession
      const payloadData = { ...activeSession }
      // Ensure session_id is included so the backend updates the existing record
      if (!payloadData.session_id) {
        payloadData.session_id = `session_${Date.now()}`
      }
      if (isPublic) {
        payloadData.is_public = true
        payloadData.author_name = userData.name || "Docente Anónimo"
        payloadData.likes = 0
      }

      const payload = {
        user_id: userData.email,
        session_data: payloadData,
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
        throw new Error(`Error en el servidor al guardar la sesión: ${res.status}`)
      }

      if (sessionToSave) {
        setEditedSession(sessionToSave)
      }

      if (isPublic) {
        toast.success("¡Sesión publicada exitosamente!", {
          description: "Ahora es visible en el Repositorio Global para otros docentes."
        })
        setIsPublished(true)
      } else {
        toast.success("¡Sesión guardada exitosamente!", {
          description: "Puedes encontrarla en tu Dashboard Docente."
        })
        setIsSaved(true)
      }
    } catch (err) {
      console.error("Error guardando sesión:", err)
      toast.error(`Error al guardar: ${err instanceof Error ? err.message : "Error desconocido"}`)
      throw err
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {showPreview && (
        <PdfPreview
          session={editedSession}
          onClose={() => setShowPreview(false)}
          onUpdateSession={(updatedSession) => {
            setEditedSession(updatedSession);
            setIsSaved(false);
          }}
          onSaveSession={async (updatedSession) => {
            await handleSaveSession(false, updatedSession);
          }}
        />
      )}

      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowPublishModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Share2 className="h-8 w-8" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Publicar en el Repositorio</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Para mantener la calidad de nuestra comunidad, requerimos que los docentes validen el contenido generado por la IA antes de compartirlo.
            </p>

            {!hasInteracted && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg mb-4 flex gap-2">
                <Lightbulb className="h-5 w-5 flex-shrink-0" />
                <p><strong>Sugerencia:</strong> Notamos que aún no has editado la sesión ni generado una vista previa en PDF. Te recomendamos revisarla antes de hacerla pública.</p>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 hover:bg-slate-100 transition-colors">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishConfirmed}
                  onChange={(e) => setPublishConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-slate-700 font-medium">
                  Certifico que he revisado pedagógicamente el contenido de esta sesión, realizando los ajustes necesarios para asegurar su calidad.
                </span>
              </label>
            </div>

            <Button
              onClick={() => {
                setShowPublishModal(false);
                handleSaveSession(true);
              }}
              disabled={!publishConfirmed || isSaving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12"
            >
              Confirmar y Publicar
            </Button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
        </div>

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm z-40">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="bg-white border border-slate-200 shadow-sm hover:shadow-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("back")}
              </Button>
              <div className="flex items-center gap-3">
                <img src="/educa-logo.png" alt="Educa +" className="h-10 md:h-12 w-auto object-contain drop-shadow-sm" />
                <div>
                  <h1 className="font-bold text-lg text-blue-800 font-bold">
                    {t("resultsTitle")}
                  </h1>
                  <p className="text-sm text-slate-500">Powered by IA & CNEB</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onViewDashboard}
                className="bg-white border border-slate-200 shadow-sm border-indigo-500/30 hover:shadow-sm bg-transparent"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {t("dashboard")}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setIsEditing(!isEditing); setHasInteracted(true); }}
                className={`bg-white border border-slate-200 shadow-sm border-emerald-500/30 hover:shadow-sm bg-transparent ${isEditing ? 'shadow-sm' : ''}`}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? "Vista Previa" : t("editSession")}
              </Button>
            </div>
          </div>
        </header>


        <div className="container mx-auto px-4 py-8 relative z-10 pt-28">
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto" ref={contentRef}>

            {/* SIDEBAR */}
            <div className="w-full lg:w-1/3 space-y-6 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 border-l-4 border-blue-500">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    {t("context")}
                  </h3>
                  <p className="text-xs text-slate-500">{t("newSession")}</p>
                </div>

                {/* Resumen Rápido */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                    <CardContent className="p-4 text-center space-y-1">
                      <BookOpen className="h-6 w-6 text-blue-600 mx-auto" />
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{t("theme")}</p>
                      <p className="font-bold text-sm line-clamp-2">{editedSession.tema}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                    <CardContent className="p-4 text-center space-y-1">
                      <GraduationCap className="h-6 w-6 text-indigo-600 mx-auto" />
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{t("grade")}</p>
                      <p className="font-bold text-sm">{editedSession.ciclo}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                    <CardContent className="p-4 text-center space-y-1">
                      <Clock className="h-6 w-6 text-emerald-600 mx-auto" />
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{t("duration")}</p>
                      <p className="font-bold text-sm">{editedSession.horasClase} h</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                    <CardContent className="p-4 text-center space-y-1">
                      <MapPin className="h-6 w-6 text-blue-600 mx-auto" />
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{t("context")}</p>
                      <p className="font-bold text-xs line-clamp-2">{editedSession.contexto}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Datos Generales */}
                {editedSession.datosGenerales && (
                  <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        {t("tabGeneral")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <p><span className="text-slate-500">{t("sessionTitle")}:</span> {editedSession.datosGenerales.titulo}</p>
                      <p><span className="text-slate-500">{t("teacher")}:</span> {editedSession.datosGenerales.docente}</p>
                      <p><span className="text-slate-500">{t("date")}:</span> {editedSession.datosGenerales.fecha}</p>
                      <p><span className="text-slate-500">{t("grade")} & {t("section")}:</span> {editedSession.datosGenerales.grado} - {editedSession.datosGenerales.seccion}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Competencias */}
                {editedSession.competenciasSeleccionadas?.length > 0 && (
                  <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Target className="h-4 w-4 text-indigo-600" />
                        {t("competencies")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {editedSession.competenciasSeleccionadas.map((comp) => (
                        <div key={comp} className="bg-white border border-slate-200 shadow-sm rounded p-2 text-xs border-l-2 border-indigo-500 flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <p>{comp}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Capacidades */}
                {(editedSession.capacidades?.length ?? 0) > 0 && (
                  <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4 text-emerald-600" />
                        {t("capacities")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {editedSession.capacidades?.map((cap) => (
                        <div key={cap} className="bg-white border border-slate-200 shadow-sm rounded p-2 text-xs border-l-2 border-emerald-500 flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <p>{cap}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Materiales Disponibles */}
                {editedSession.materialesDisponibles && (
                  <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        {t("materials")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-slate-800/80">{editedSession.materialesDisponibles}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="w-full lg:w-2/3 space-y-6">
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-2 mb-2 flex flex-wrap sm:flex-nowrap overflow-x-auto gap-2 border-b border-slate-200 border-b sticky top-[80px] z-20 backdrop-blur-xl">
                <Button variant="ghost" className={`flex-1 min-w-[140px] text-sm ${activeTab === 'secuencia' ? 'bg-blue-100 text-blue-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTab('secuencia')}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t("tabSequence")}
                </Button>
                <Button variant="ghost" className={`flex-1 min-w-[140px] text-sm ${activeTab === 'evaluacion' ? 'bg-emerald-100 text-emerald-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTab('evaluacion')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t("evaluation")}
                </Button>
                <Button variant="ghost" className={`flex-1 min-w-[140px] text-sm ${activeTab === 'recursos' ? 'bg-indigo-100 text-indigo-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTab('recursos')}>
                  <Package className="h-4 w-4 mr-2" />
                  {t("tabResources")}
                </Button>
              </div>

              <div className="min-h-[600px] pb-10">
                {/* TAB 1: SECUENCIA */}
                {activeTab === 'secuencia' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Propósito de la Sesión */}
                    {editedSession.propositoSesion && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-indigo-600" />
                            {t("purpose")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isEditing ? (
                            <Textarea value={editedSession.propositoSesion} onChange={(e) => setEditedSession({ ...editedSession, propositoSesion: e.target.value })} className="min-h-[80px] bg-white border border-slate-200 shadow-sm" />
                          ) : (
                            <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-transparent">
                              <p className="text-slate-800 leading-relaxed text-sm">{editedSession.propositoSesion}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Descripción de Competencia */}
                    {editedSession.competenciaDescripcion && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-indigo-600" />
                            {t("competencies")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isEditing ? (
                            <Textarea value={editedSession.competenciaDescripcion} onChange={(e) => setEditedSession({ ...editedSession, competenciaDescripcion: e.target.value })} className="min-h-[100px] bg-white border border-slate-200 shadow-sm" />
                          ) : (
                            <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-transparent">
                              <p className="text-slate-800 leading-relaxed text-sm">{editedSession.competenciaDescripcion}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Secuencia Metodológica */}
                    {editedSession.secuenciaMetodologica && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-emerald-600" />
                            {t("secuenciaMetodologica")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {/* INICIO */}
                            <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 border-l-4 border-blue-500">
                              <h4 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
                                <span className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">1</span> {t("inicio").toUpperCase()}
                              </h4>
                              {isEditing ? (
                                <Textarea value={editedSession.secuenciaMetodologica?.inicio ?? ""} onChange={(e) => setEditedSession({ ...editedSession, secuenciaMetodologica: { ...editedSession.secuenciaMetodologica, inicio: e.target.value } })} className="min-h-[100px] bg-white border border-slate-200 shadow-sm" />
                              ) : (
                                <div className="text-sm text-slate-800 space-y-2" dangerouslySetInnerHTML={{ __html: (editedSession.secuenciaMetodologica?.inicio ?? "").replaceAll(/\*\*(.*?)\*\*/g, "<strong class='text-blue-600'>$1</strong>").replaceAll("\n", "<br>") }} />
                              )}
                            </div>
                            {/* DESARROLLO */}
                            <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 border-l-4 border-indigo-500">
                              <h4 className="font-bold text-indigo-600 mb-2 flex items-center gap-2">
                                <span className="bg-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">2</span> {t("desarrollo").toUpperCase()}
                              </h4>
                              {isEditing ? (
                                <Textarea value={editedSession.secuenciaMetodologica?.desarrollo ?? ""} onChange={(e) => setEditedSession({ ...editedSession, secuenciaMetodologica: { ...editedSession.secuenciaMetodologica, desarrollo: e.target.value } })} className="min-h-[100px] bg-white border border-slate-200 shadow-sm" />
                              ) : (
                                <div className="text-sm text-slate-800 space-y-2" dangerouslySetInnerHTML={{ __html: (editedSession.secuenciaMetodologica?.desarrollo ?? "").replaceAll(/\*\*(.*?)\*\*/g, "<strong class='text-indigo-600'>$1</strong>").replaceAll("\n", "<br>") }} />
                              )}
                            </div>
                            {/* CIERRE */}
                            <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 border-l-4 border-emerald-500">
                              <h4 className="font-bold text-emerald-600 mb-2 flex items-center gap-2">
                                <span className="bg-emerald-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">3</span> {t("cierre").toUpperCase()}
                              </h4>
                              {isEditing ? (
                                <Textarea value={editedSession.secuenciaMetodologica?.cierre ?? ""} onChange={(e) => setEditedSession({ ...editedSession, secuenciaMetodologica: { ...editedSession.secuenciaMetodologica, cierre: e.target.value } })} className="min-h-[100px] bg-white border border-slate-200 shadow-sm" />
                              ) : (
                                <div className="text-sm text-slate-800 space-y-2" dangerouslySetInnerHTML={{ __html: (editedSession.secuenciaMetodologica?.cierre ?? "").replaceAll(/\*\*(.*?)\*\*/g, "<strong class='text-emerald-600'>$1</strong>").replaceAll("\n", "<br>") }} />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Distribución Horaria */}
                    {editedSession.distribucionHoras && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-600" />
                            {t("duration")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="flex items-end justify-center gap-4 h-48">
                              {(() => {
                                const maxTiempo = Math.max(tiempos.inicio, tiempos.desarrollo, tiempos.cierre, 1)
                                const containerHeight = 192
                                return (
                                  <>
                                    <div className="flex-1 flex flex-col items-center gap-3">
                                      <div className="w-full bg-gradient-to-t from-blue-500 to-primary/50 rounded-t-lg flex items-end justify-center pb-2 shadow-sm" style={{ height: `${Math.max((tiempos.inicio / maxTiempo) * containerHeight, 30)}px` }}>
                                        <span className="text-xs font-bold text-white">{tiempos.inicio}'</span>
                                      </div>
                                      <div className="text-center">
                                        <p className="text-sm font-semibold text-blue-600">INICIO</p>
                                      </div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center gap-3">
                                      <div className="w-full bg-gradient-to-t from-indigo-500 to-secondary/50 rounded-t-lg flex items-end justify-center pb-2 shadow-sm" style={{ height: `${Math.max((tiempos.desarrollo / maxTiempo) * containerHeight, 30)}px` }}>
                                        <span className="text-xs font-bold text-white">{tiempos.desarrollo}'</span>
                                      </div>
                                      <div className="text-center">
                                        <p className="text-sm font-semibold text-indigo-600">DESARROLLO</p>
                                      </div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center gap-3">
                                      <div className="w-full bg-gradient-to-t from-emerald-500 to-emerald-500/50 rounded-t-lg flex items-end justify-center pb-2 shadow-sm" style={{ height: `${Math.max((tiempos.cierre / maxTiempo) * containerHeight, 30)}px` }}>
                                        <span className="text-xs font-bold text-white">{tiempos.cierre}'</span>
                                      </div>
                                      <div className="text-center">
                                        <p className="text-sm font-semibold text-emerald-600">CIERRE</p>
                                      </div>
                                    </div>
                                  </>
                                )
                              })()}
                            </div>
                            <div className="relative pt-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="text-xs font-semibold text-blue-600">0 min</div>
                                <div className="text-xs font-semibold text-indigo-600">{tiempos.inicio}-{tiempos.inicio + tiempos.desarrollo} min</div>
                                <div className="text-xs font-semibold text-emerald-600">{tiempos.inicio + tiempos.desarrollo + tiempos.cierre} min</div>
                              </div>
                              <div className="w-full h-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full hover:shadow-md transition-all" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Procesos Didácticos */}
                    {(editedSession.procesosDidacticos?.length ?? 0) > 0 && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-emerald-600" />
                            {t("secuenciaMetodologica")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                            {editedSession.procesosDidacticos?.map((proceso, index) => (
                              <div key={proceso} className="bg-white border border-slate-200 shadow-sm rounded-lg p-3 text-center">
                                <div className="bg-emerald-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-xs mx-auto mb-2">{index + 1}</div>
                                <p className="text-xs font-medium">{proceso}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actividades Contextualizadas */}
                    {(editedSession.actividadesContextualizadas?.length ?? 0) > 0 && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-indigo-600" />
                            {t("actividadesDiferenciadas")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {editedSession.actividadesContextualizadas?.map((actividad, index) => (
                              <div key={actividad} className="bg-white border border-slate-200 shadow-sm rounded-lg p-3 border-l-4 border-indigo-500 flex items-start gap-3">
                                <Zap className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-800">{actividad}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* TAB 2: EVALUACION */}
                {activeTab === 'evaluacion' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Criterios de Evaluación */}
                    {editedSession.criteriosEvaluacion && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                            {t("criterios")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isEditing ? (
                            <Textarea value={editedSession.criteriosEvaluacion} onChange={(e) => setEditedSession({ ...editedSession, criteriosEvaluacion: e.target.value })} className="min-h-[120px] bg-white border border-slate-200 shadow-sm" />
                          ) : (
                            <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-50 to-transparent">
                              <pre className="text-slate-800 leading-relaxed text-sm whitespace-pre-wrap font-sans">{editedSession.criteriosEvaluacion}</pre>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Evidencias de Aprendizaje */}
                    {editedSession.evidenciasAprendizaje && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            {t("evidences")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isEditing ? (
                            <Textarea value={editedSession.evidenciasAprendizaje} onChange={(e) => setEditedSession({ ...editedSession, evidenciasAprendizaje: e.target.value })} className="min-h-[100px] bg-white border border-slate-200 shadow-sm" />
                          ) : (
                            <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent">
                              <pre className="text-slate-800 leading-relaxed text-sm whitespace-pre-wrap font-sans">{editedSession.evidenciasAprendizaje}</pre>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Evaluación Formativa (Corregido mapeo arrays) */}
                    {ra.evaluacionFormativa?.preguntas?.length > 0 && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                            {t("evaluation")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            {ra.evaluacionFormativa.preguntas.map((pregunta: string, idx: number) => (
                              <details key={pregunta} className="bg-white border border-slate-200 shadow-sm rounded p-3 text-sm border-l-2 border-emerald-500">
                                <summary className="cursor-pointer font-medium text-slate-800">Pregunta {idx + 1}</summary>
                                <div className="mt-2 space-y-1 text-xs pl-4 border-l border-slate-300">
                                  <p className="font-medium text-slate-800">{pregunta}</p>
                                  <p className="text-blue-600"><strong>Respuesta:</strong> {ra.evaluacionFormativa?.respuestas?.[idx]}</p>
                                  <p className="text-slate-500"><strong>Criterios:</strong> {ra.evaluacionFormativa?.criterios?.[idx]}</p>
                                </div>
                              </details>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* TAB 3: RECURSOS */}
                {activeTab === 'recursos' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Materiales Didácticos Sugeridos */}
                    {(editedSession.materialesDidacticosSugeridos?.length ?? 0) > 0 && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-blue-600" />
                            {t("materialesSugeridos")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {editedSession.materialesDidacticosSugeridos?.map((material) => (
                              <div key={safeKeyFromString(material) || material} className="bg-white border border-slate-200 shadow-sm rounded-lg p-3 border-l-4 border-blue-500 flex items-start gap-3">
                                <Package className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-800">{material}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actividades de Activación */}
                    {ra.actividadDeActivacion?.length > 0 && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-indigo-600" />
                            {t("inicio")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {ra.actividadDeActivacion.map((act: any, idx: number) => (
                              <div key={act} className="bg-white border border-slate-200 shadow-sm rounded-lg p-3 border-l-4 border-indigo-500">
                                <p className="text-sm mt-1">{act}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Fichas de Trabajo */}
                    {ra.fichasDeTrabajo?.length > 0 && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            {t("fichasTrabajo")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {ra.fichasDeTrabajo.map((ficha: any, idx: number) => (
                            <details key={ficha.titulo || idx} className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 border-l-4 border-indigo-500">
                              <summary className="font-semibold text-sm cursor-pointer hover:text-indigo-600 transition-colors">
                                {ficha.titulo || `Ficha ${idx + 1}`}
                              </summary>
                              <div className="mt-3 space-y-2 text-sm">
                                <p className="text-slate-500"><strong>Instrucciones:</strong> {ficha.instrucciones}</p>
                                <div>
                                  <strong className="text-slate-800">Ejercicios:</strong>
                                  <ul className="list-disc list-inside space-y-1 mt-1 text-slate-800/80">
                                    {ficha.ejercicios?.map((ejercicio: any, i: number) => (
                                      <li key={ejercicio}>{ejercicio}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </details>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Problemas y Ejercicios (Corregido mapeo respuesta) */}
                    {ra.problemasYEjercicios?.length > 0 && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                            {t("problemasEjercicios")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {ra.problemasYEjercicios.map((problema: any, idx: number) => (
                              <details key={problema.problema || problema.enunciado || idx} className="bg-white border border-slate-200 shadow-sm rounded-lg p-3 border-l-4 border-emerald-500">
                                <summary className="font-semibold text-xs uppercase cursor-pointer">
                                  {problema.nivel || `Problema ${idx + 1}`}
                                </summary>
                                <div className="mt-2 space-y-1 text-xs">
                                  <p><strong>Problema:</strong> {problema.problema || problema.enunciado}</p>
                                  <p className="text-slate-500"><strong>Respuesta:</strong> {problema.respuesta_esperada || problema.respuesta}</p>
                                  {(problema.criterios || problema.criterio) && (
                                    <p className="text-slate-500"><strong>Criterios:</strong> {problema.criterios || problema.criterio}</p>
                                  )}
                                </div>
                              </details>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Juego Didáctico */}
                    {ra?.juegoDidactico && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-blue-600" />
                            {ra.juegoDidactico.titulo || ra.juegoDidactico.nombre || "Juego Didáctico"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {ra.juegoDidactico.duracion && <div><strong>Duración:</strong> {ra.juegoDidactico.duracion}</div>}
                            {ra.juegoDidactico.participantes && <div><strong>Participantes:</strong> {ra.juegoDidactico.participantes}</div>}
                          </div>
                          {ra.juegoDidactico.materiales && (
                            <div>
                              <strong className="text-sm">Materiales:</strong>
                              <p className="text-xs text-slate-500">{ra.juegoDidactico.materiales}</p>
                            </div>
                          )}
                          <div>
                            <strong className="text-sm">Instrucciones:</strong>
                            <ol className="list-decimal list-inside space-y-1 mt-1 text-xs text-slate-800/80">
                              {juegoInstrucciones.map((instr: any, i: number) => (
                                <li key={instr}>{instr}</li>
                              ))}
                            </ol>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actividades Diferenciadas (Corregido a arrays de strings) */}
                    {ra?.actividadesDiferenciadas && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-indigo-600" />
                            {t("actividadesDiferenciadas")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Refuerzo */}
                            {ra.actividadesDiferenciadas.refuerzo?.length > 0 && (
                              <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-3 border-t-4 border-blue-500 space-y-2">
                                <p className="font-semibold text-sm text-blue-600">Refuerzo</p>
                                <ul className="list-disc list-inside space-y-1 mt-1 text-xs">
                                  {ra.actividadesDiferenciadas.refuerzo.map((act: string, idx: number) => (
                                    <li key={act}>{act}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* Consolidación */}
                            {ra.actividadesDiferenciadas.consolidacion?.length > 0 && (
                              <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-3 border-t-4 border-indigo-500 space-y-2">
                                <p className="font-semibold text-sm text-indigo-600">Consolidación</p>
                                <ul className="list-disc list-inside space-y-1 mt-1 text-xs">
                                  {ra.actividadesDiferenciadas.consolidacion.map((act: string, idx: number) => (
                                    <li key={act}>{act}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* Profundización */}
                            {ra.actividadesDiferenciadas.profundizacion?.length > 0 && (
                              <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-3 border-t-4 border-emerald-500 space-y-2">
                                <p className="font-semibold text-sm text-emerald-600">Profundización</p>
                                <ul className="list-disc list-inside space-y-1 mt-1 text-xs">
                                  {ra.actividadesDiferenciadas.profundizacion.map((act: string, idx: number) => (
                                    <li key={act}>{act}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Comunicado para Padres */}
                    {ra?.comunicadoParaPadres && (
                      <Card className="bg-white border border-slate-200 shadow-sm border-0 hover:shadow-md transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                            {t("comunicadoPadres")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-xs text-slate-800/80 leading-relaxed whitespace-pre-wrap font-sans">{ra.comunicadoParaPadres}</pre>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col items-center mt-8 pt-6 border-t border-slate-200 w-full max-w-7xl mx-auto">
            <img src="/pinguinos/pinguino_like.png" alt="Pingüino" className="w-24 h-24 object-contain mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              <Button
                onClick={onBack}
                variant="outline"
                className="bg-white border border-slate-200 shadow-sm border-blue-500/30 hover:shadow-sm h-12 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("newSession")}
              </Button>
              <Button
                onClick={() => handleSaveSession(false)}
                disabled={isSaving || isSaved}
                className={`${isSaved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white shadow-sm hover:scale-105 transition-all duration-300 h-12`}
              >
                {renderSaveButtonContent()}
              </Button>
              <Button
                onClick={() => setShowPublishModal(true)}
                disabled={isSaving || isPublished}
                className={`${isPublished ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-sm hover:scale-105 transition-all duration-300 h-12`}
              >
                {renderPublishButtonContent()}
              </Button>
              <Button
                onClick={() => { setShowPreview(true); setHasInteracted(true); }}
                className="bg-blue-600 hover:bg-blue-700 shadow-sm hover:scale-105 transition-all duration-300 h-12 text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
