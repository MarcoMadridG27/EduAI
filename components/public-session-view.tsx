"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, ThumbsUp, User, BookOpen, Check, Link as LinkIcon, FileText, MessageSquare, Send } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { PdfPreview } from "@/components/pdf-preview"
import { useLanguage } from "@/lib/LanguageContext"

export function PublicSessionView({ id }: Readonly<{ readonly id: string }>) {
  const { language } = useLanguage()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showPdf, setShowPdf] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<any[]>([])
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  const localTranslations: Record<string, Record<string, string>> = {
    es: {
      back: "Volver",
      share: "Compartir",
      viewDownloadPdf: "Ver y Descargar PDF",
      downloadPdf: "Descargar PDF",
      getDocument: "Obtener documento",
      downloadDesc: "Descarga esta sesión en formato oficial del MINEDU (PDF) para editar o imprimir.",
      aboutAuthor: "Acerca del autor",
      communityMember: "Miembro de la comunidad",
      cycle: "Ciclo",
      hours: "horas",
      anonymous: "Docente Anónimo",
      readyToApply: "Sesión de aprendizaje lista para aplicar.",
      commentsTitle: "Comentarios",
      commentPlaceholder: "Escribe un comentario o pregunta al autor...",
      toastCommentSuccess: "Comentario publicado",
      toastCommentError: "Error al publicar comentario",
      toastLikeSuccess: "¡Gracias por tu valoración!",
      toastLikeError: "Error al valorar",
      toastLoginComment: "Debes iniciar sesión para comentar.",
      toastLoginLike: "Debes iniciar sesión para valorar.",
      toastLoginDownload: "Debes iniciar sesión para descargar o ver el PDF.",
      toastLinkCopied: "Enlace copiado",
      toastLinkCopiedDesc: "Listo para compartir con tus colegas.",
      login: "Iniciar Sesión",
      likesText: "valoraciones",
      likeText: "valoración",
      docWatermark: "Documento publicado en la Comunidad Educa +",
      propTitle: "Propósito de la Sesión",
      compTitle: "Competencia y Desempeños",
      seqTitle: "Secuencia Metodológica",
      inicio: "Inicio",
      desarrollo: "Desarrollo",
      cierre: "Cierre",
      editOwner: "Editar Sesión (Creador)",
      notFoundTitle: "Documento no encontrado",
      notFoundSubtitle: "Esta sesión no existe o fue eliminada.",
      backToRepo: "Volver al Repositorio",
      loadingDoc: "Cargando documento..."
    },
    en: {
      back: "Back",
      share: "Share",
      viewDownloadPdf: "View & Download PDF",
      downloadPdf: "Download PDF",
      getDocument: "Get document",
      downloadDesc: "Download this session in official MINEDU format (PDF) to edit or print.",
      aboutAuthor: "About the author",
      communityMember: "Community member",
      cycle: "Cycle",
      hours: "hours",
      anonymous: "Anonymous Teacher",
      readyToApply: "Learning session ready to apply.",
      commentsTitle: "Comments",
      commentPlaceholder: "Write a comment or question to the author...",
      toastCommentSuccess: "Comment published",
      toastCommentError: "Error publishing comment",
      toastLikeSuccess: "Thanks for your rating!",
      toastLikeError: "Error rating",
      toastLoginComment: "You must log in to comment.",
      toastLoginLike: "You must log in to rate.",
      toastLoginDownload: "You must log in to download or view the PDF.",
      toastLinkCopied: "Link copied",
      toastLinkCopiedDesc: "Ready to share with your colleagues.",
      login: "Log In",
      likesText: "ratings",
      likeText: "rating",
      docWatermark: "Document published in the Educa + Community",
      propTitle: "Purpose of the Session",
      compTitle: "Competency and Performance",
      seqTitle: "Methodological Sequence",
      inicio: "Introduction",
      desarrollo: "Development",
      cierre: "Closure",
      editOwner: "Edit Session (Creator)",
      notFoundTitle: "Document not found",
      notFoundSubtitle: "This session does not exist or was deleted.",
      backToRepo: "Back to Repository",
      loadingDoc: "Loading document..."
    },
    qu: {
      back: "Kutiy",
      share: "Rakiy",
      viewDownloadPdf: "PDFta qaway uranchaypas",
      downloadPdf: "PDFta uranchay",
      getDocument: "Qillqata chaskiy",
      downloadDesc: "Kay yachachiyta MINEDU (PDF) oficial willakuypi uranchay allichanapaq utaq ch'ipachinapaq.",
      aboutAuthor: "Ruraqmanta yachay",
      communityMember: "Ayllu yanapakuq",
      cycle: "Muyu",
      hours: "pacha",
      anonymous: "Mana sutiyuq Amauta",
      readyToApply: "Yachachiy plan yachay wasipaq listo.",
      commentsTitle: "Rimasqakuna",
      commentPlaceholder: "Ruraypaq willakuyta utaq tapukuyta qillqay...",
      toastCommentSuccess: "Willakuy churasqa listo",
      toastCommentError: "Mana atikunchu willakuy churay",
      toastLikeSuccess: "¡Añaychanchik valorasqaykimanta!",
      toastLikeError: "Mana atikunchu valoray",
      toastLoginComment: "Qillqakunayki tiyan rimanaykipaq.",
      toastLoginLike: "Qillqakunayki tiyan valoranaykipaq.",
      toastLoginDownload: "Qillqakunayki tiyan PDFta uranchanaykipaq.",
      toastLinkCopied: "T'inki chaskisqa",
      toastLinkCopiedDesc: "Yachachiq masiykikunawan rakinakunapaq listo.",
      login: "Qillqakuy",
      likesText: "chaninchaykuna",
      likeText: "chaninchay",
      docWatermark: "Educa + Ayllupi churasqa qillqa",
      propTitle: "Yachachiypa propósiton",
      compTitle: "Atipakuy desempeñokunapas",
      seqTitle: "Pedagógico sequence",
      inicio: "Qallariy",
      desarrollo: "Desarrollo",
      cierre: "Cierre",
      editOwner: "Yachachiyta allichay (Ruraq)",
      notFoundTitle: "Mana qillqa tarisqachu",
      notFoundSubtitle: "Kay yachachiy mana kanchu utaq qullusqa karqan.",
      backToRepo: "Repositorioman kutiy",
      loadingDoc: "Qillqata cargachkan..."
    },
    ay: {
      back: "Kutiriña",
      share: "Rakinasiña",
      viewDownloadPdf: "PDF uñjaña uranchaña",
      downloadPdf: "PDF uranchaña",
      getDocument: "Qillqa chaskiña",
      downloadDesc: "Urunaqataki yatichaw PDF thakhinchata uranchañani lurañataki.",
      aboutAuthor: "Luririta yatiña",
      communityMember: "Tama chachiri",
      cycle: "Muyu",
      hours: "uruta",
      anonymous: "Jan Uñt'at Yatichiri",
      readyToApply: "Yatichawi luraña yatiqañ utataki wakicht'ata.",
      commentsTitle: "Aruskipawinaka",
      commentPlaceholder: "Luririmanta willt'awi jan tapuy qillqt'ama...",
      toastCommentSuccess: "Aruskipawi luratañani",
      toastCommentError: "Jan atikiti aruskipawi luraña",
      toastLikeSuccess: "¡Yuspajara uñt'awimata!",
      toastLikeError: "Jan atikiti uñakipaña",
      toastLoginComment: "Mantiripitaña aruskipañataki.",
      toastLoginLike: "Mantiripitaña uñakipañataki.",
      toastLoginDownload: "Mantiripitaña PDF uranchañataki uñjañataki.",
      toastLinkCopied: "T'inki copiataña",
      toastLinkCopiedDesc: "Yatichirinakampi rakiñataki wakicht'ata.",
      login: "Mantaña",
      likesText: "uñakipawinaka",
      likeText: "uñakipawi",
      docWatermark: "Qillqata Educa + Tamana uñachayata",
      propTitle: "Yatichawin propósito",
      compTitle: "Lurañanak uñt'ata",
      seqTitle: "Yatichawi sequence",
      inicio: "Qalltaña",
      desarrollo: "Desarrollo",
      cierre: "Cierre",
      editOwner: "Yatichaw luraña allichaña (Luriri)",
      notFoundTitle: "Janiw qillqa jikxataskiti",
      notFoundSubtitle: "Yatichawi thakhinakap janiw utjkiti jan luratäkiti.",
      backToRepo: "Repositorioman kutiriña",
      loadingDoc: "Yatichaw thakhinakap wakichaskani..."
    }
  }

  const lt = localTranslations[language] || localTranslations.es

  const user = globalThis.window !== undefined && localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null

  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || ""

  const handleAddComment = async () => {
    if (!user) {
      toast.error(lt.toastLoginComment, {
        action: {
          label: lt.login,
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
        body: JSON.stringify({ author: user?.name || lt.anonymous, text: newComment })
      })
      if (!res.ok) throw new Error("Error")
      const r = await res.json()
      setComments([r.comment, ...comments])
      setNewComment("")
      toast.success(lt.toastCommentSuccess)
    } catch {
      toast.error(lt.toastCommentError)
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast.error(lt.toastLoginLike, {
        action: {
          label: lt.login,
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
      toast.success(lt.toastLikeSuccess)
    } catch {
      toast.error(lt.toastLikeError)
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
    toast.success(lt.toastLinkCopied, { description: lt.toastLinkCopiedDesc })
    setTimeout(() => setCopied(false), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <img src="/pinguinos/pinguino_pensando.png" className="h-32 w-32 animate-bounce" alt="Cargando" />
          <p className="text-slate-500 font-medium mt-4">{lt.loadingDoc}</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <img src="/pinguinos/pinguino_chill.png" className="h-48 w-48 opacity-50 mb-6" alt="No encontrado" />
        <h1 className="text-2xl font-bold text-slate-800">{lt.notFoundTitle}</h1>
        <p className="text-slate-500 mb-8">{lt.notFoundSubtitle}</p>
        <Link href="/repositorio">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full">
            {lt.backToRepo}
          </Button>
        </Link>
      </div>
    )
  }

  const s = session.session_data

  return (
    <>
      {showPdf && <PdfPreview session={s} onClose={() => setShowPdf(false)} />}

      <div className="min-h-screen bg-[var(--bg)] pb-20">
        {/* Toolbar */}
        <div className="w-full border-b py-3 px-6 lg:px-12 flex items-center justify-between" style={{ borderColor: "var(--border-subtle)", background: "var(--white)" }}>
          <div className="flex items-center gap-4">
            <Link href="/repositorio">
              <Button variant="ghost" size="sm" style={{ color: "var(--ink-700)" }}>
                <ArrowLeft className="h-4 w-4 mr-2" /> {lt.back}
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleCopyLink} style={{ borderColor: "var(--border-default)", color: "var(--ink-800)" }}>
              {copied ? <Check className="h-4 w-4 text-emerald-500 mr-2" /> : <LinkIcon className="h-4 w-4 mr-2" />}
              {lt.share}
            </Button>
            <Button onClick={() => {
              if (!user) {
                toast.error(lt.toastLoginDownload, {
                  action: {
                    label: lt.login,
                    onClick: () => globalThis.location.href = "/auth"
                  }
                })
                return
              }
              setShowPdf(true)
            }} className="shadow-sm" style={{ backgroundColor: "var(--blue-500)", color: "var(--white)" }}>
              <Download className="h-4 w-4 mr-2" />
              {lt.viewDownloadPdf}
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">

          {/* Main Document Content */}
          <div className="flex-1">
            <div className="bg-white shadow-sm border rounded-xl p-8 md:p-12" style={{ borderColor: "var(--border-subtle)" }}>

              {/* Cabecera del Documento */}
              <div className="border-b pb-8 mb-8 text-center" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 border" style={{ background: "var(--blue-50)", color: "var(--blue-700)", borderColor: "var(--blue-100)" }}>
                  {lt.cycle} {s.ciclo || "—"} • {s.horasClase || 2} {lt.hours}
                </div>
                <h1 className="tracking-tight leading-tight mb-6" style={{ font: "var(--text-display-3)", color: "var(--ink-900)" }}>
                  {s.tema}
                </h1>

                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-100 p-2 rounded-full"><User className="h-4 w-4 text-slate-500" /></div>
                    <span className="font-semibold text-slate-700">{s.author_name || lt.anonymous}</span>
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
                    <span>{likes} {likes === 1 ? lt.likeText : lt.likesText}</span>
                  </button>
                </div>

                {user?.email === session.user_id && (
                  <div className="mt-6">
                    <Button onClick={handleEditOwner} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                      {lt.editOwner}
                    </Button>
                  </div>
                )}
              </div>

              {/* Contenido (Simulando una vista de lectura inmersiva) */}
              <div className="space-y-10">
                {s.propositoSesion && (
                  <section>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                      <BookOpen className="h-5 w-5 text-blue-600" /> {lt.propTitle}
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-lg bg-blue-50/50 p-6 rounded-lg border border-blue-100">
                      {s.propositoSesion}
                    </p>
                  </section>
                )}

                {s.competenciaDescripcion && (
                  <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">{lt.compTitle}</h2>
                    <p className="text-slate-600 leading-relaxed border-l-4 border-indigo-500 pl-4 py-1">
                      {s.competenciaDescripcion}
                    </p>
                  </section>
                )}

                {s.secuenciaMetodologica && (
                  <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">{lt.seqTitle}</h2>

                    <div className="space-y-6">
                      {s.secuenciaMetodologica.inicio && (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                          <h3 className="font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                            <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>{" "}
                            {lt.inicio}
                          </h3>
                          <div className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: s.secuenciaMetodologica.inicio.replaceAll(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}></div>
                        </div>
                      )}

                      {s.secuenciaMetodologica.desarrollo && (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                          <h3 className="font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                            <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>{" "}
                            {lt.desarrollo}
                          </h3>
                          <div className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: s.secuenciaMetodologica.desarrollo.replaceAll(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}></div>
                        </div>
                      )}

                      {s.secuenciaMetodologica.cierre && (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                          <h3 className="font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                            <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>{" "}
                            {lt.cierre}
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
                <img src="/educa-logo.png" className="h-6 w-auto grayscale mb-2" alt="Educa +" />
                <p className="text-xs font-semibold">{lt.docWatermark}</p>
              </div>

            </div>

            {/* Sección de Comentarios */}
            <div className="mt-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 rounded-xl p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                {lt.commentsTitle} ({comments.length})
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
                    placeholder={lt.commentPlaceholder}
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
                <h3 className="font-bold text-slate-800 text-lg mb-2">{lt.getDocument}</h3>
                <p className="text-sm text-slate-500 mb-6">{lt.downloadDesc}</p>
                <Button onClick={() => {
                  if (!user) {
                    toast.error(lt.toastLoginDownload, {
                      action: {
                        label: lt.login,
                        onClick: () => globalThis.location.href = "/auth"
                      }
                    })
                    return
                  }
                  setShowPdf(true)
                }} className="w-full bg-blue-600 hover:bg-blue-700 shadow-md">
                  <Download className="h-4 w-4 mr-2" />
                  {lt.downloadPdf}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">{lt.aboutAuthor}</h3>
              </div>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                  {s.author_name ? s.author_name[0] : "D"}
                </div>
                <div>
                  <p className="font-bold text-slate-700">{s.author_name || lt.anonymous}</p>
                  <p className="text-xs text-slate-500">{lt.communityMember}</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </>
  )
}
