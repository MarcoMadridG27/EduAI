"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, ThumbsUp, User, BookOpen, Check, Link as LinkIcon, FileText, MessageSquare, Send } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { PdfPreview } from "@/components/pdf-preview"

export function PublicSessionView({ id }: Readonly<{ readonly id: string }>) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showPdf, setShowPdf] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<any[]>([])
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  const user = globalThis.window !== undefined && localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null

  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || ""

  const handleAddComment = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para comentar.", {
        action: {
          label: "Iniciar Sesión",
          onClick: () => globalThis.location.href = "/auth"
        }
      })
      return
    }
    if (!newComment.trim()) return

    try {
      const res = await fetch(`${AUTH_URL}/sessions/${session.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: user?.name || "Anónimo", text: newComment })
      })
      if (!res.ok) throw new Error("Error")
      const r = await res.json()
      setComments([r.comment, ...comments])
      setNewComment("")
      toast.success("Comentario publicado")
    } catch {
      toast.error("Error al publicar comentario")
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para valorar.", {
        action: {
          label: "Iniciar Sesión",
          onClick: () => globalThis.location.href = "/auth"
        }
      })
      return
    }
    if (liked) return
    try {
      const res = await fetch(`${AUTH_URL}/api/sessions/${session.id}/like`, { method: "POST" })
      if (!res.ok) throw new Error("Error")
      const r = await res.json()
      setLikes(r.likes)
      setLiked(true)
      toast.success("¡Gracias por tu valoración!")
    } catch {
      toast.error("Error al valorar")
    }
  }

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`${AUTH_URL}/sessions`)
        if (!res.ok) throw new Error("Error fetching sessions")
        const data = await res.json()

        const decodedId = decodeURIComponent(id)
        const found = data.find((s: any) => 
          (s.id.toString() === id.toString() || s.id.toString() === decodedId) && 
          s.session_data?.is_public
        )

        if (found) {
          setSession(found)
          setLikes(found.session_data?.likes || 0)
          setComments(found.session_data?.comments || [])
        } else {
          setSession(null)
        }
      } catch (err) {
        console.error("Failed to load session:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [id, AUTH_URL])

  const handleEditOwner = () => {
    if (globalThis.window !== undefined) {
      localStorage.setItem("session_to_edit", JSON.stringify(session.session_data))
      globalThis.location.href = "/" // Go to home to pick up editing
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(globalThis.location.href)
    setCopied(true)
    toast.success("Enlace copiado", { description: "Listo para compartir con tus colegas." })
    setTimeout(() => setCopied(false), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <img src="/pinguinos/pinguino_pensando.png" className="h-32 w-32 animate-bounce" alt="Cargando" />
          <p className="text-slate-500 font-medium mt-4">Cargando documento...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <img src="/pinguinos/pinguino_chill.png" className="h-48 w-48 opacity-50 mb-6" alt="No encontrado" />
        <h1 className="text-2xl font-bold text-slate-800">Documento no encontrado</h1>
        <p className="text-slate-500 mb-8">Esta sesión no existe o fue eliminada.</p>
        <Link href="/repositorio">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full">
            Volver al Repositorio
          </Button>
        </Link>
      </div>
    )
  }

  const s = session.session_data

  return (
    <>
      {showPdf && <PdfPreview session={s} onClose={() => setShowPdf(false)} />}

      <div className="min-h-screen bg-[#F1F5F9] pb-20 pt-[80px]">
        {/* Header flotante */}
        <header className="fixed top-0 left-0 right-0 w-full bg-white border-b border-slate-200 py-3 px-6 lg:px-12 flex items-center justify-between z-40">
          <div className="flex items-center gap-4">
            <Link href="/repositorio">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
                <ArrowLeft className="h-4 w-4 mr-2" /> Volver
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleCopyLink} className="border-slate-200 text-slate-600">
              {copied ? <Check className="h-4 w-4 text-emerald-500 mr-2" /> : <LinkIcon className="h-4 w-4 mr-2" />}
              Compartir
            </Button>
            <Button onClick={() => {
              if (!user) {
                toast.error("Debes iniciar sesión para descargar o ver el PDF.", {
                  action: {
                    label: "Iniciar Sesión",
                    onClick: () => globalThis.location.href = "/auth"
                  }
                })
                return
              }
              setShowPdf(true)
            }} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Download className="h-4 w-4 mr-2" />
              Ver y Descargar PDF
            </Button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">

          {/* Main Document Content */}
          <div className="flex-1">
            <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 rounded-xl p-8 md:p-12">

              {/* Cabecera del Documento */}
              <div className="border-b-2 border-slate-100 pb-8 mb-8 text-center">
                <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                  Ciclo {s.ciclo || "No especificado"} • {s.horasClase || 2} horas
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight mb-6">
                  {s.tema}
                </h1>

                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-100 p-2 rounded-full"><User className="h-4 w-4 text-slate-500" /></div>
                    <span className="font-semibold text-slate-700">{s.author_name || "Docente"}</span>
                  </div>
                  <button 
                    onClick={handleLike} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                      liked 
                        ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm" 
                        : "bg-white border-slate-200 text-slate-500 hover:text-blue-500 hover:border-blue-200 shadow-sm"
                    }`}
                  >
                    <ThumbsUp className={`h-3.5 w-3.5 ${liked ? "fill-current text-blue-600 animate-pulse" : ""}`} /> 
                    <span>{likes} {likes === 1 ? "valoración" : "valoraciones"}</span>
                  </button>
                </div>

                {user?.email === session.user_id && (
                  <div className="mt-6">
                    <Button onClick={handleEditOwner} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                      Editar Sesión (Creador)
                    </Button>
                  </div>
                )}
              </div>

              {/* Contenido (Simulando una vista de lectura inmersiva) */}
              <div className="space-y-10">
                {s.propositoSesion && (
                  <section>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                      <BookOpen className="h-5 w-5 text-blue-600" /> Propósito de la Sesión
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-lg bg-blue-50/50 p-6 rounded-lg border border-blue-100">
                      {s.propositoSesion}
                    </p>
                  </section>
                )}

                {s.competenciaDescripcion && (
                  <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Competencia y Desempeños</h2>
                    <p className="text-slate-600 leading-relaxed border-l-4 border-indigo-500 pl-4 py-1">
                      {s.competenciaDescripcion}
                    </p>
                  </section>
                )}

                {s.secuenciaMetodologica && (
                  <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Secuencia Metodológica</h2>

                    <div className="space-y-6">
                      {s.secuenciaMetodologica.inicio && (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                          <h3 className="font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                            <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>{" "}
                            Inicio
                          </h3>
                          <div className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: s.secuenciaMetodologica.inicio.replaceAll(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}></div>
                        </div>
                      )}

                      {s.secuenciaMetodologica.desarrollo && (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                          <h3 className="font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                            <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>{" "}
                            Desarrollo
                          </h3>
                          <div className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: s.secuenciaMetodologica.desarrollo.replaceAll(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}></div>
                        </div>
                      )}

                      {s.secuenciaMetodologica.cierre && (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                          <h3 className="font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                            <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>{" "}
                            Cierre
                          </h3>
                          <div className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: s.secuenciaMetodologica.cierre.replaceAll(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}></div>
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </div>

              {/* End of Doc watermark */}
              <div className="mt-16 pt-8 border-t border-slate-100 text-center opacity-50 flex flex-col items-center">
                <img src="/sesion_+.png" className="h-6 w-auto grayscale mb-2" alt="Sesión+" />
                <p className="text-xs font-semibold">Documento publicado en la Comunidad Sesión+</p>
              </div>

            </div>

            {/* Sección de Comentarios */}
            <div className="mt-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 rounded-xl p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Comentarios ({comments.length})
              </h3>

              {/* Input para nuevo comentario */}
              <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex-shrink-0 flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex-1 relative">
                  <textarea
                    className="w-full border border-slate-200 rounded-lg p-3 pr-12 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    rows={2}
                    placeholder="Escribe un comentario o pregunta al autor..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  ></textarea>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="absolute right-2 bottom-3 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Lista de Comentarios */}
              <div className="space-y-6">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold">
                      {c.author[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-700 text-sm">{c.author}</span>
                        <span className="text-xs text-slate-400">{c.time}</span>
                      </div>
                      <p className="text-slate-600 text-sm">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Info (Similar to Udocz / Scribd) */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <CardContent className="p-6 text-center">
                <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="font-bold text-slate-800 text-lg mb-2">Obtener documento</h3>
                <p className="text-sm text-slate-500 mb-6">Descarga esta sesión en formato oficial del MINEDU (PDF) para editar o imprimir.</p>
                <Button onClick={() => {
                  if (!user) {
                    toast.error("Debes iniciar sesión para descargar o ver el PDF.", {
                      action: {
                        label: "Iniciar Sesión",
                        onClick: () => globalThis.location.href = "/auth"
                      }
                    })
                    return
                  }
                  setShowPdf(true)
                }} className="w-full bg-blue-600 hover:bg-blue-700 shadow-md">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Acerca del autor</h3>
              </div>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                  {s.author_name ? s.author_name[0] : "D"}
                </div>
                <div>
                  <p className="font-bold text-slate-700">{s.author_name || "Docente Anónimo"}</p>
                  <p className="text-xs text-slate-500">Miembro de la comunidad</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </>
  )
}
