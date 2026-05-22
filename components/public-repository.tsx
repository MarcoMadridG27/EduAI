"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ThumbsUp, Search, User, FileText, ArrowRight, Link as LinkIcon, Check, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface PublicRepositoryProps {
  readonly user?: { readonly name: string; readonly email: string } | null
  readonly guestMode?: boolean
  readonly onLoginRequired?: () => void
  readonly onNavigateToGenerator?: () => void
  readonly onViewDashboard?: () => void
  readonly onLogout?: () => void
}

export function PublicRepository({
  user: propUser,
  guestMode: propGuestMode,
  onLoginRequired,
  onNavigateToGenerator,
  onViewDashboard,
  onLogout
}: PublicRepositoryProps = {}) {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [guestMode, setGuestMode] = useState<boolean>(true)

  useEffect(() => {
    if (propUser === undefined) {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (e) {
          console.error("Error parsing stored user", e)
        }
      }
    } else {
      setUser(propUser)
    }
  }, [propUser])

  useEffect(() => {
    if (propGuestMode === undefined) {
      const accessToken = localStorage.getItem("access_token")
      const storedUser = localStorage.getItem("user")
      setGuestMode(!(accessToken && storedUser))
    } else {
      setGuestMode(propGuestMode)
    }
  }, [propGuestMode])

  useEffect(() => {
    async function fetchPublicSessions() {
      try {
        const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || ""
        const res = await fetch(`${AUTH_URL}/sessions`)
        if (!res.ok) throw new Error("Error fetching sessions")
        const data = await res.json()

        let publicSessions = data.filter((s: any) => s.session_data?.is_public)

        // If no public sessions are found, just use the empty array.
        setSessions(publicSessions)
      } catch (err) {
        console.error("Failed to load public sessions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicSessions()
  }, [])

  const filteredSessions = sessions.filter(s =>
    s.session_data?.tema?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.session_data?.author_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCopyLink = (id: string) => {
    const link = `${globalThis.location?.origin || ""}/repositorio/${id}`
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    toast.success("¡Enlace copiado al portapapeles!", {
      description: "Ahora puedes compartir esta sesión con otros docentes."
    })
    setTimeout(() => setCopiedId(null), 3000)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 pt-[80px]">
      {/* Header flotante */}
      <header className="fixed top-0 left-0 right-0 w-full bg-white/90 backdrop-blur-lg py-3 px-6 lg:px-12 flex items-center justify-between z-50 border-b border-slate-200/60 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <img src="/sesion_+.png" alt="Sesión+" className="h-16 w-auto object-contain drop-shadow-sm" />
          <span className="font-extrabold text-slate-700 text-lg tracking-tight hidden sm:inline">Comunidad</span>
        </Link>
        <div className="flex-1 max-w-xl px-6 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar documentos, sesiones, temas..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full text-slate-800 text-sm border-transparent focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Dashboard Button */}
          <Button
            variant="ghost"
            onClick={() => {
              if (guestMode && onLoginRequired) {
                onLoginRequired()
              } else if (guestMode) {
                globalThis.location.href = "/auth"
              } else if (onViewDashboard) {
                onViewDashboard()
              } else {
                globalThis.location.href = "/" // Fallback to root dashboard
              }
            }}
            className="text-slate-600 hover:text-slate-900 font-bold text-sm h-9 px-3"
          >
            Mi Dashboard
          </Button>

          {/* Crear Sesion Button */}
          <Button
            onClick={() => {
              if (onNavigateToGenerator) {
                onNavigateToGenerator()
              } else {
                globalThis.location.href = "/" // Fallback to root generator
              }
            }}
            className="rounded-full bg-blue-600 text-white hover:bg-blue-700 font-bold px-4 text-xs sm:text-sm h-9 shadow-sm transition-all"
          >
            Crear Sesión
          </Button>

          {/* User / Authentication Badge & Button */}
          {guestMode ? (
            <Button
              onClick={() => {
                if (onLoginRequired) {
                  onLoginRequired()
                } else {
                  globalThis.location.href = "/auth"
                }
              }}
              className="rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold px-4 text-xs sm:text-sm h-9 shadow-sm transition-all"
            >
              Iniciar Sesión
            </Button>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                <div className="bg-blue-100 p-1 rounded-full">
                  <User className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[100px]">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  if (onLogout) {
                    onLogout()
                  } else {
                    localStorage.removeItem("user")
                    localStorage.removeItem("access_token")
                    globalThis.location.href = "/"
                  }
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-2 font-bold text-sm"
              >
                Salir
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Minimalista */}
      <div className="max-w-7xl mx-auto px-4 mt-8 mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100/50 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <BookOpen className="w-96 h-96 text-blue-600 -translate-y-20 translate-x-20" />
          </div>
          <div className="z-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">
              Aprende de los mejores <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">materiales educativos</span>
            </h1>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Descubre miles de sesiones de aprendizaje generadas por docentes para docentes. Listas para aplicar en tu aula.
            </p>
            <div className="flex gap-4 md:hidden">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar sesiones..."
                  className="w-full pl-10 pr-4 py-3 bg-white shadow-sm rounded-xl text-slate-800 text-sm border-slate-200 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="z-10 hidden lg:block">
            <img src="/pinguinos/pinguino_mostrando.png" className="h-48 w-48 object-contain drop-shadow-xl animate-pulse" alt="Mascota" />
          </div>
        </div>
      </div>

      {/* Banner de Publicidad del Bot de WhatsApp */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-6 md:p-8 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
            <svg className="w-64 h-64 text-emerald-600 -translate-y-10 translate-x-10 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.116-2.887-6.98-1.864-1.864-4.343-2.887-6.984-2.888-5.439 0-9.863 4.42-9.867 9.865-.001 1.757.458 3.473 1.332 4.972l-.988 3.605 3.698-.971zm11.367-5.123c-.302-.15-1.785-.882-2.062-.982-.277-.1-.478-.15-.679.15-.201.3-.778.982-.954 1.183-.176.201-.353.226-.655.076-.302-.15-1.274-.469-2.427-1.498-.897-.8-1.502-1.787-1.678-2.088-.176-.302-.019-.465.132-.614.136-.135.302-.35.453-.526.15-.175.201-.3.302-.5.101-.201.05-.377-.025-.526-.075-.15-.679-1.636-.93-2.24-.244-.59-.493-.51-.679-.52-.176-.01-.377-.012-.578-.012-.201 0-.528.075-.805.377-.277.302-1.056 1.03-1.056 2.512 0 1.48 1.081 2.912 1.232 3.112.15.201 2.128 3.249 5.156 4.557.72.31 1.282.496 1.72.636.724.23 1.382.197 1.902.12.58-.087 1.785-.73 2.037-1.43.252-.7.252-1.3.176-1.43-.076-.13-.277-.205-.578-.356z"/>
            </svg>
          </div>
          <div className="flex-1 flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm shrink-0">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.116-2.887-6.98-1.864-1.864-4.343-2.887-6.984-2.888-5.439 0-9.863 4.42-9.867 9.865-.001 1.757.458 3.473 1.332 4.972l-.988 3.605 3.698-.971zm11.367-5.123c-.302-.15-1.785-.882-2.062-.982-.277-.1-.478-.15-.679.15-.201.3-.778.982-.954 1.183-.176.201-.353.226-.655.076-.302-.15-1.274-.469-2.427-1.498-.897-.8-1.502-1.787-1.678-2.088-.176-.302-.019-.465.132-.614.136-.135.302-.35.453-.526.15-.175.201-.3.302-.5.101-.201.05-.377-.025-.526-.075-.15-.679-1.636-.93-2.24-.244-.59-.493-.51-.679-.52-.176-.01-.377-.012-.578-.012-.201 0-.528.075-.805.377-.277.302-1.056 1.03-1.056 2.512 0 1.48 1.081 2.912 1.232 3.112.15.201 2.128 3.249 5.156 4.557.72.31 1.282.496 1.72.636.724.23 1.382.197 1.902.12.58-.087 1.785-.73 2.037-1.43.252-.7.252-1.3.176-1.43-.076-.13-.277-.205-.578-.356z"/>
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-extrabold text-slate-800 text-lg leading-tight">¿No encuentras lo que buscas en el repositorio?</h3>
              <p className="text-slate-600 text-sm mt-1 font-medium">
                Genera tu sesión de aprendizaje personalizada al instante chateando con nuestro bot de IA en WhatsApp al <span className="font-bold text-emerald-600 select-all">+51 984 277 478</span>.
              </p>
            </div>
          </div>
          <Link
            href="https://wa.me/51984277478?text=Hola!%20Quiero%20probar%20el%20bot%20de%20IA"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full font-bold px-6 py-3 text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shrink-0 shadow-sm hover:scale-105 active:scale-95"
          >
            Chatear con el Bot
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Documentos Populares</h2>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <img src="/pinguinos/pinguino_pensando.png" alt="Cargando" className="w-24 h-24 object-contain animate-bounce mb-4" />
            <p className="text-slate-500 font-medium">Cargando biblioteca...</p>
          </div>
        )}

        {!loading && filteredSessions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSessions.map((s) => (
              <Card key={s.id} className="bg-white border-0 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-2xl overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1">
                {/* Portada del Documento (Simulada) */}
                <div className="aspect-[3/4] bg-slate-50 border-b border-slate-100 relative p-6 flex flex-col">
                  <div className="absolute top-4 right-4 bg-white shadow-sm border border-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-600">{s.session_data?.likes || 0}</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 transform -rotate-1 group-hover:rotate-0 transition-transform duration-300">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm line-clamp-3 leading-snug">
                        {s.session_data?.tema}
                      </h3>
                      <div className="w-12 h-1 bg-blue-500 rounded-full mt-3"></div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1 font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      Ciclo {s.session_data?.ciclo}
                    </div>
                    <div>{s.session_data?.horasClase || 2} h</div>
                  </div>
                </div>

                {/* Metadatos y Acciones */}
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                      <User className="h-3 w-3 text-slate-500" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700 truncate">{s.session_data?.author_name || "Docente Anónimo"}</p>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">
                    {s.session_data?.propositoSesion || "Sesión de aprendizaje lista para aplicar."}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <Link href={`/repositorio/${s.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 transition-colors">
                      Leer documento <ArrowRight className="h-3 w-3" />
                    </Link>
                    <button
                      onClick={(e) => { e.preventDefault(); handleCopyLink(s.id); }}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                      title="Copiar enlace"
                    >
                      {copiedId === s.id ? <Check className="h-4 w-4 text-emerald-500" /> : <LinkIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredSessions.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <img src="/pinguinos/pinguino_chill.png" alt="No hay resultados" className="w-32 h-32 object-contain mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-slate-700">No encontramos documentos</h3>
            <p className="text-slate-500 mt-2">Prueba buscar con otras palabras clave.</p>
          </div>
        )}
      </div>

      {/* Floating WhatsApp Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Tooltip Notification */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="mb-2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-slate-800 flex items-center gap-1.5 max-w-[200px]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>¡Chatea con nuestro Bot!</span>
        </motion.div>

        <motion.a
          href="https://wa.me/51984277478?text=Hola!%20Quiero%20probar%20el%20bot%20de%20IA"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.6, duration: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl hover:bg-emerald-600 transition-colors border-2 border-white cursor-pointer relative"
          title="Chatear con el bot de WhatsApp"
        >
          <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.116-2.887-6.98-1.864-1.864-4.343-2.887-6.984-2.888-5.439 0-9.863 4.42-9.867 9.865-.001 1.757.458 3.473 1.332 4.972l-.988 3.605 3.698-.971zm11.367-5.123c-.302-.15-1.785-.882-2.062-.982-.277-.1-.478-.15-.679.15-.201.3-.778.982-.954 1.183-.176.201-.353.226-.655.076-.302-.15-1.274-.469-2.427-1.498-.897-.8-1.502-1.787-1.678-2.088-.176-.302-.019-.465.132-.614.136-.135.302-.35.453-.526.15-.175.201-.3.302-.5.101-.201.05-.377-.025-.526-.075-.15-.679-1.636-.93-2.24-.244-.59-.493-.51-.679-.52-.176-.01-.377-.012-.578-.012-.201 0-.528.075-.805.377-.277.302-1.056 1.03-1.056 2.512 0 1.48 1.081 2.912 1.232 3.112.15.201 2.128 3.249 5.156 4.557.72.31 1.282.496 1.72.636.724.23 1.382.197 1.902.12.58-.087 1.785-.73 2.037-1.43.252-.7.252-1.3.176-1.43-.076-.13-.277-.205-.578-.356z"/>
          </svg>
        </motion.a>
      </div>
    </div>
  )
}
