"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ThumbsUp, GraduationCap, Clock, Search, Share2, Eye, User, FileText, ArrowRight, Download, Link as LinkIcon, Check } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function PublicRepository() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPublicSessions() {
      try {
        const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "https://eduai-auth-1.onrender.com"
        const res = await fetch(`${AUTH_URL}/sessions`)
        if (!res.ok) throw new Error("Error fetching sessions")
        const data = await res.json()

        let publicSessions = data.filter((s: any) => s.session_data && s.session_data.is_public)
        
        if (publicSessions.length === 0) {
          publicSessions = [
            {
              id: "demo-1",
              user_id: "maria.profesora@edu.pe",
              created_at: new Date().toISOString(),
              session_data: {
                tema: "Fracciones y Decimales en la Vida Cotidiana",
                ciclo: "VI",
                horasClase: 2,
                author_name: "María Gómez",
                likes: 124,
                is_public: true,
                propositoSesion: "Comprender la relación entre fracciones y números decimales aplicados en compras y descuentos del entorno social.",
              }
            },
            {
              id: "demo-2",
              user_id: "carlos.docente@edu.pe",
              created_at: new Date(Date.now() - 86400000).toISOString(),
              session_data: {
                tema: "Ecuaciones Lineales para el Medio Ambiente",
                ciclo: "VII",
                horasClase: 3,
                author_name: "Carlos Rodríguez",
                likes: 89,
                is_public: true,
                propositoSesion: "Resolver ecuaciones de primer grado utilizando métodos algebraicos aplicados al reciclaje.",
              }
            },
             {
              id: "demo-3",
              user_id: "ana.matematicas@edu.pe",
              created_at: new Date(Date.now() - 172800000).toISOString(),
              session_data: {
                tema: "Geometría del Espacio en la Arquitectura",
                ciclo: "VI",
                horasClase: 4,
                author_name: "Ana Soto",
                likes: 210,
                is_public: true,
                propositoSesion: "Calcular el volumen y área superficial de prismas y pirámides observando edificios locales.",
              }
            },
            {
              id: "demo-4",
              user_id: "juan.perez@edu.pe",
              created_at: new Date(Date.now() - 345600000).toISOString(),
              session_data: {
                tema: "Estadística Descriptiva de Deportes",
                ciclo: "VII",
                horasClase: 2,
                author_name: "Juan Pérez",
                likes: 45,
                is_public: true,
                propositoSesion: "Construir e interpretar gráficos estadísticos a partir de resultados deportivos del mundial.",
              }
            }
          ]
        }
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
    const link = `${window.location.origin}/repositorio/${id}`
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
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 font-bold px-6 text-sm shadow-md transition-all">
              Crear Sesion
            </Button>
          </Link>
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
              Aprende de los mejores <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">materiales educativos</span>
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

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Documentos Populares</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <img src="/pinguinos/pinguino_pensando.png" alt="Cargando" className="w-24 h-24 object-contain animate-bounce mb-4" />
             <p className="text-slate-500 font-medium">Cargando biblioteca...</p>
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSessions.map((s, idx) => (
              <Card key={idx} className="bg-white border-0 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-2xl overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1">
                {/* Portada del Documento (Simulada) */}
                <div className="aspect-[3/4] bg-slate-50 border-b border-slate-100 relative p-6 flex flex-col">
                   <div className="absolute top-4 right-4 bg-white shadow-sm border border-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
                     <ThumbsUp className="h-3 w-3 text-emerald-500" />
                     <span className="text-xs font-bold text-slate-600">{s.session_data?.likes || Math.floor(Math.random() * 200)}</span>
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
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <img src="/pinguinos/pinguino_chill.png" alt="No hay resultados" className="w-32 h-32 object-contain mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-slate-700">No encontramos documentos</h3>
            <p className="text-slate-500 mt-2">Prueba buscar con otras palabras clave.</p>
          </div>
        )}
      </div>
    </div>
  )
}
