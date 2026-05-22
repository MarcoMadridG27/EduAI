"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Layers, Users, Sparkles, BrainCircuit, Lightbulb, ChevronRight, ChevronLeft, Target, PlayCircle, Loader } from "lucide-react"
import { useState, useEffect } from "react"

interface LandingPageProps {
  readonly onEnterGeneratorPreview: () => void
  readonly onEnterRepositoryPreview: () => void
  readonly onLogin: () => void
}

export function LandingPage({ onEnterGeneratorPreview, onEnterRepositoryPreview, onLogin }: Readonly<LandingPageProps>) {
  const [repositorySessions, setRepositorySessions] = useState<any[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [sessionsError, setSessionsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoadingSessions(true)
        const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8000"
        const res = await fetch(`${authUrl}/sessions`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })
        if (!res.ok) throw new Error("Error al cargar sesiones")
        const data = await res.json()
        // Filtrar solo sesiones públicas
        const publicSessions = Array.isArray(data) 
          ? data.filter((s: any) => s.session_data?.is_public !== false)
          : []
        setRepositorySessions(publicSessions.slice(0, 4)) // Mostrar solo 4
        setSessionsError(null)
      } catch (err) {
        console.error("Error fetching sessions:", err)
        setSessionsError("No se pudieron cargar las sesiones del repositorio")
        setRepositorySessions([])
      } finally {
        setIsLoadingSessions(false)
      }
    }
    fetchSessions()
  }, [])

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const springUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, bounce: 0.4, duration: 1 } 
    }
  }

  const springLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { type: "spring" as const, bounce: 0.4, duration: 1 } 
    }
  }

  const springRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { type: "spring" as const, bounce: 0.4, duration: 1 } 
    }
  }
  
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { type: "spring" as const, bounce: 0.5, duration: 1 } 
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground pb-20 pt-12 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full bg-background/80 backdrop-blur-md pb-6 px-6 lg:px-12 h-12 md:h-14 lg:h-16 flex items-center justify-between z-50 border-b border-border">
        <div className="flex items-center">
          <Link href="/" aria-label="Ir a la página principal">
            <img src="/sesion_+.png" alt="Sesión+" className="h-20 md:h-24 lg:h-28 w-auto object-contain drop-shadow-sm translate-y-2 md:translate-y-3 lg:translate-y-4" />
          </Link>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button onClick={onLogin} className="rounded-full font-bold pt-8 px-8 py-5 shadow-lg transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: '#5590af', color: 'var(--papaya-whip)' }}>
            Iniciar Sesión
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 lg:px-8 pb-12 pt-6">
        <motion.div 
          initial={{ opacity: 0, y: 70, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative w-full min-h-[600px] lg:h-[80vh] rounded-[3rem] overflow-hidden flex items-center shadow-2xl border border-border bg-card animate-fade-in"
          style={{
            backgroundImage: "url('/blu.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* High-tech Gradient Glow Blobs */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-tr from-cyan-400 to-emerald-400 opacity-20 rounded-full blur-[80px] pointer-events-none z-0"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-indigo-400 to-purple-400 opacity-25 rounded-full blur-[100px] pointer-events-none z-0"></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 opacity-30"></div>
          
          <div className="relative z-10 w-full max-w-[1300px] mx-auto px-6 py-12 md:px-12 grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column - Main Info */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 bg-[#003049]/5 backdrop-blur-md px-4 py-1.5 rounded-full text-[#003049] text-xs font-black uppercase tracking-wider mb-6 border border-[#003049]/10">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                Planificación Inteligente con IA
              </div>

              {/* Premium Typographic Logo Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                className="text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-tight leading-none mb-6 select-none"
              >
                <span className="text-[#003049] lowercase">sesion</span>
                <span className="relative inline-block ml-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-500 to-indigo-600 drop-shadow-[0_2px_10px_rgba(6,182,212,0.3)] font-bold scale-110 translate-y-[-0.03em] select-none">
                  +
                </span>
              </motion.h1>
              
              <p className="text-base md:text-xl text-[#003049]/80 font-medium mb-10 max-w-xl leading-relaxed">
                Genera sesiones de aprendizaje estructuradas en segundos. Alineadas al <span className="font-extrabold text-[#003049]">CNEB</span>, con procesos didácticos exactos y adaptadas al contexto de tu aula.
              </p>

              {/* Premium CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 relative z-20 w-full sm:w-auto"
              >
                <Button
                  onClick={onEnterGeneratorPreview}
                  className="rounded-full font-bold px-8 py-6 text-lg min-w-[220px] shadow-lg bg-[#5590af] text-white hover:bg-[#3d6e88] hover:shadow-xl transition-all hover:scale-105 active:scale-95 border border-[#5590af]/20 flex items-center justify-center gap-2 animate-pulse-slow"
                >
                  Comenzar ahora
                  <ChevronRight className="w-5 h-5 animate-pulse" />
                </Button>
                <Button 
                  onClick={onEnterRepositoryPreview} 
                  className="rounded-full font-bold px-8 py-6 text-lg min-w-[220px] shadow-lg bg-white/80 hover:bg-white text-[#003049] border border-slate-200 backdrop-blur-sm hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Explorar Repositorio
                </Button>
              </motion.div>
            </div>

            {/* Right Column - Tech Wireframe Interactive Mockup */}
            <div className="lg:col-span-5 relative w-full flex items-center justify-center">
              
              {/* AI Generation Blueprint Mockup Container */}
              <div className="relative w-full max-w-[420px] aspect-[4/5] bg-slate-950/85 backdrop-blur-md rounded-[3rem] p-6 shadow-2xl border border-slate-800/80 overflow-hidden group">
                
                {/* Glowing neon blueprint grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,41,59,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.4)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40 z-0"></div>
                
                {/* Glowing neon blurs inside mockup */}
                <div className="absolute top-1/4 left-1/4 w-36 h-36 bg-cyan-500/10 rounded-full blur-[50px] pointer-events-none z-0 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none z-0"></div>
                
                {/* IDE-like Header */}
                <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 tracking-wider">CREADOR_SESIONES.JSON</div>
                </div>

                {/* Layered Document Cards */}
                <div className="relative z-10 space-y-4">
                  
                  {/* Card 1: Header info */}
                  <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-md transition-all duration-300 group-hover:-translate-y-0.5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-black text-cyan-400 tracking-wider">I. PLANIFICACIÓN MATEMÁTICA</span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-300 font-bold">Tema: <span className="text-slate-400 font-normal">Sistemas de Ecuaciones Lineales</span></div>
                      <div className="text-[11px] text-slate-300 font-bold">Grado: <span className="text-slate-400 font-normal">2do de Secundaria - CNEB</span></div>
                    </div>
                  </div>

                  {/* Card 2: Flow Circular wireframe representing raw structured thoughts! */}
                  <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-md transition-all duration-300 group-hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[9px] font-black text-emerald-400 tracking-wider">II. PROPÓSITOS Y EVIDENCIAS</span>
                      <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase">Analizando CNEB...</span>
                    </div>
                    
                    {/* Render text with Flow Circular font, acting as a wireframe layout */}
                    <div className="space-y-2 font-flow text-[10px] text-slate-600/80 leading-relaxed select-none tracking-widest">
                      Competencia resuelve problemas de regularidad equivalencia.
                      Capacidades traduce datos y condiciones a expresiones algebraicas.
                      Criterios formula sistemas de ecuaciones y modela situaciones.
                    </div>
                  </div>

                  {/* Card 3: Methodology generation active view */}
                  <div className="bg-[#003049]/35 border border-[#5590af]/20 rounded-2xl p-4 shadow-md relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-black text-indigo-400 tracking-wider">III. SECUENCIA DIDÁCTICA</span>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2 items-start">
                        <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide">Inicio</span>
                        <p className="text-[10px] text-slate-300 leading-snug">
                          Planteamiento de situación lúdica mediante balanzas equilibradas.
                        </p>
                      </div>
                      
                      {/* Flow Circular representing raw content being formatted under the hood */}
                      <div className="space-y-1.5 pl-11">
                        <div className="font-flow text-[10px] text-slate-600/80 leading-relaxed select-none tracking-widest">
                          Desarrollo formal del metodo de reduccion y sustitucion.
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Micro Input Prompt Bar at the bottom of panel */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md py-2.5 px-3 rounded-2xl flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <BrainCircuit className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-[10px] font-black text-slate-400 truncate">Prompt: "ecuaciones con balanzas didácticas"</span>
                  </div>
                  <span className="text-[8px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full font-black uppercase shrink-0 animate-pulse">
                    GENERANDO
                  </span>
                </div>

              </div>

            </div>

          </div>
        </motion.div>
      </section>

      {/* Video Demonstration Section */}
      <section className="px-4 lg:px-8 py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleIn}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Mira cómo funciona</h2>
            <p className="text-lg text-muted-foreground">Descubre en este breve video de demostración cómo Sesión + agiliza tu trabajo.</p>
          </div>
          <div className="aspect-video bg-card rounded-[2rem] shadow-xl border border-border overflow-hidden relative group cursor-pointer">
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-colors z-10">
              <div className="bg-background/90 p-5 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                <PlayCircle className="w-12 h-12 text-primary" />
              </div>
            </div>
            {/* Video Thumbnail Placeholder (can be replaced by an actual <video> tag later) */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center">
               <motion.img 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  src="/pinguinos/pinguino_chill.png"
                  className="w-24 h-24 object-contain opacity-50 mb-4"
                  alt="Pinguino"
               />
              <span className="text-muted-foreground font-medium text-lg">Espacio para Video de Animación</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={springLeft}
            className="flex flex-col gap-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-foreground leading-[1.1] tracking-tight mb-6">
                Diseñado por y para docentes peruanos
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                Olvídate de empezar desde cero. Sesión + agiliza tu planificación pedagógica para que te enfoques en lo que realmente importa: enseñar y conectar con tus estudiantes.
              </p>
            </div>

            <div className="flex justify-center pt-8 border-t border-border">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full p-4 shrink-0" style={{ backgroundColor: 'var(--brick-red)', color: 'var(--papaya-whip)' }}>
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xl font-black text-foreground mt-3">✓ CNEB</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider leading-tight mt-1">Currículo<br/>Nacional</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-4"
          >
            {/* Card 1 */}
            <motion.div 
              variants={springRight}
              whileHover={{ scale: 1.03, x: -10 }}
              className="bg-card border border-border rounded-[2rem] p-6 flex items-center gap-6 shadow-md cursor-pointer transition-all"
            >
              <div className="p-4 rounded-2xl shrink-0" style={{ backgroundColor: 'var(--brick-red)', color: 'var(--papaya-whip)' }}>
                <BrainCircuit className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Generador Inteligente</h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium">IA entrenada para estructurar secuencias metodológicas, propósitos y criterios de evaluación exactos.</p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              variants={springRight}
              whileHover={{ scale: 1.03, x: -10 }}
              className="bg-card border border-border rounded-[2rem] p-6 flex items-center gap-6 shadow-md cursor-pointer transition-all"
            >
              <div className="bg-secondary/10 p-4 rounded-2xl shrink-0">
                <Lightbulb className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Actividades Contextualizadas</h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium">Ingresa el contexto de tu aula y obtén problemas y dinámicas relevantes para el entorno de tus estudiantes.</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              variants={springRight}
              whileHover={{ scale: 1.03, x: -10 }}
              className="bg-card border border-border rounded-[2rem] p-6 flex items-center gap-6 shadow-md cursor-pointer transition-all relative overflow-hidden"
            >
              <div className="bg-accent/10 p-4 rounded-2xl shrink-0 z-10 relative">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <div className="z-10 relative">
                <h3 className="text-lg font-bold text-foreground mb-1">Repositorio Colaborativo</h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium">Accede a una gran base de sesiones creadas por otros docentes. Inspírate, copia y edita para tus clases.</p>
              </div>
              <motion.img 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                src="/pinguinos/pinguino_pensando.png" 
                className="absolute right-0 bottom-0 w-24 h-24 opacity-20 translate-x-4 translate-y-4 object-contain"
                alt="Pinguino"
              />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* WhatsApp AI Bot Promotional Section */}
      <section className="py-20 px-4 lg:px-8 max-w-[1400px] mx-auto overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleIn}
          className="relative rounded-[3rem] bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-background border border-emerald-500/20 p-8 lg:p-16 overflow-hidden shadow-2xl"
        >
          {/* Neon Glow Blobs */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left side: Info & Copy/Chat triggers */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ¡Nuevo! Asistente en tu bolsillo
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#003049] tracking-tight leading-none">
                Planifica tus clases por <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">WhatsApp</span>
              </h2>
              <p className="text-[#003049]/80 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                ¿Sin tiempo para sentarse a la computadora? Ahora puedes interactuar con nuestro Asistente de IA directo desde tu WhatsApp. Genera secuencias didácticas, propósitos y actividades completas con un solo mensaje.
              </p>

              {/* Bot Info Cards */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 text-left">
                <div className="bg-card/50 border border-border/60 p-4 rounded-2xl flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#003049]">Alineado al CNEB</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Respuestas basadas en el Currículo Nacional vigente.</p>
                  </div>
                </div>

                <div className="bg-card/50 border border-border/60 p-4 rounded-2xl flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#003049]">Sin Registros</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Sin contraseñas. Escribe, chatea y obtén tu planificación.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 items-center justify-center lg:justify-start">
                <Link
                  href="https://wa.me/51984277478?text=Hola!%20Quiero%20probar%20el%20bot%20de%20IA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full font-bold px-8 py-4 text-base shadow-lg bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.116-2.887-6.98-1.864-1.864-4.343-2.887-6.984-2.888-5.439 0-9.863 4.42-9.867 9.865-.001 1.757.458 3.473 1.332 4.972l-.988 3.605 3.698-.971zm11.367-5.123c-.302-.15-1.785-.882-2.062-.982-.277-.1-.478-.15-.679.15-.201.3-.778.982-.954 1.183-.176.201-.353.226-.655.076-.302-.15-1.274-.469-2.427-1.498-.897-.8-1.502-1.787-1.678-2.088-.176-.302-.019-.465.132-.614.136-.135.302-.35.453-.526.15-.175.201-.3.302-.5.101-.201.05-.377-.025-.526-.075-.15-.679-1.636-.93-2.24-.244-.59-.493-.51-.679-.52-.176-.01-.377-.012-.578-.012-.201 0-.528.075-.805.377-.277.302-1.056 1.03-1.056 2.512 0 1.48 1.081 2.912 1.232 3.112.15.201 2.128 3.249 5.156 4.557.72.31 1.282.496 1.72.636.724.23 1.382.197 1.902.12.58-.087 1.785-.73 2.037-1.43.252-.7.252-1.3.176-1.43-.076-.13-.277-.205-.578-.356z"/>
                  </svg>
                  Chatear con el Bot
                </Link>
                <div className="flex flex-col text-slate-700 dark:text-slate-300 font-mono text-sm gap-1 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-3 select-all">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide leading-none font-bold">Número de WhatsApp:</span>
                  <span className="font-bold text-base text-emerald-600 dark:text-emerald-400">+51 984 277 478</span>
                </div>
              </div>
            </div>

            {/* Right side: Mock WhatsApp Chat Interface */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[340px] bg-slate-950 rounded-[2.5rem] border-8 border-slate-900 shadow-2xl overflow-hidden aspect-[9/16] relative flex flex-col font-sans">
                {/* Status Bar */}
                <div className="bg-[#075e54] text-white/90 text-[10px] px-5 py-2.5 flex justify-between items-center shrink-0">
                  <div className="font-semibold text-white">EduAI Bot</div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white">en línea</span>
                  </div>
                </div>

                {/* Chat Background / Bubble Container */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#e5ddd5] flex flex-col justify-end text-xs leading-normal">
                  {/* Message 1: User */}
                  <div className="self-end bg-[#dcf8c6] text-slate-800 p-2.5 rounded-lg rounded-tr-none shadow-sm max-w-[85%] relative">
                    <p className="font-semibold text-[10px] text-slate-500 mb-0.5">Tú</p>
                    <p className="text-slate-800 font-medium">Hola! Necesito una sesión de matemáticas sobre fracciones para 3ro de primaria</p>
                    <span className="absolute bottom-1 right-2 text-[8px] text-slate-400">10:02 AM ✓✓</span>
                  </div>

                  {/* Message 2: AI Bot */}
                  <div className="self-start bg-white text-slate-800 p-2.5 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative">
                    <p className="font-black text-[10px] text-emerald-600 mb-0.5">EduAI Bot Asistente</p>
                    <p className="font-semibold text-slate-800">¡Hola Maestro! Generando sesión de aprendizaje de 90 minutos alineada a la competencia <span className="text-emerald-600 font-extrabold">"Resuelve problemas de cantidad"</span> del CNEB...</p>
                    <span className="absolute bottom-1 right-2 text-[8px] text-slate-400">10:02 AM</span>
                  </div>

                  {/* Message 3: AI Bot details */}
                  <div className="self-start bg-white text-slate-800 p-2.5 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative">
                    <p className="font-semibold text-slate-800 mb-1">
                      📚 <span className="font-bold">Secuencia Didáctica:</span>
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] font-medium text-slate-700">
                      <li><span className="font-bold text-slate-800">Inicio (15 min):</span> Dinámica "Repartiendo la pizza". Saberes previos y conflicto cognitivo.</li>
                      <li><span className="font-bold text-slate-800">Desarrollo (60 min):</span> Representación gráfica y simbólica. Ficha de trabajo estructurada.</li>
                    </ul>
                    <span className="absolute bottom-1 right-2 text-[8px] text-slate-400">10:03 AM</span>
                  </div>
                </div>

                {/* Message input area */}
                <div className="bg-slate-100 p-2 flex items-center gap-2 border-t border-slate-200 shrink-0">
                  <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[10px] text-slate-400 font-medium">
                    Escribe un mensaje...
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0">
                    ➔
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Repositorio Section */}
      <section className="px-4 lg:px-8 py-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={scaleIn}
          className="bg-muted/50 border border-border rounded-[3rem] p-8 lg:p-12 max-w-[1400px] mx-auto relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 relative z-10">
            <div className="max-w-xl">
              <h2 className="text-2xl font-black text-foreground mb-2">Explora el Repositorio</h2>
              <p className="text-muted-foreground text-sm font-medium">Descubre las sesiones más valoradas y utilizadas por la comunidad de profesores de Sesión +.</p>
            </div>
            
            <div className="flex items-center gap-6 mt-6 md:mt-0">
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
                <button className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>
          </div>

          {isLoadingSessions ? (
            <motion.div 
              variants={scaleIn}
              className="flex flex-col items-center justify-center py-16 px-8 rounded-3xl bg-card border border-border relative z-10"
            >
              <Loader className="w-8 h-8 text-muted-foreground/60 mb-4 animate-spin" />
              <h3 className="text-lg font-bold text-foreground">Cargando sesiones...</h3>
            </motion.div>
          ) : sessionsError ? (
            <motion.div 
              variants={scaleIn}
              className="flex flex-col items-center justify-center py-16 px-8 rounded-3xl bg-card border border-border relative z-10"
            >
              <Layers className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-bold text-foreground">Repositorio en Construcción</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
                Próximamente podrás acceder a sesiones colaborativas creadas por docentes de la comunidad.
              </p>
            </motion.div>
          ) : repositorySessions.length === 0 ? (
            <motion.div 
              variants={scaleIn}
              className="flex flex-col items-center justify-center py-16 px-8 rounded-3xl bg-card border border-border relative z-10"
            >
              <Layers className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-bold text-foreground">Sin sesiones publicadas</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
                Sé el primero en compartir una sesión con la comunidad.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10"
            >
              {repositorySessions.map((session: any, i: number) => (
                <motion.div 
                  key={session.id || i}
                  variants={springUp}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-md bg-card border border-border flex flex-col transition-all"
                >
                  <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${i % 2 === 0 ? 'from-primary to-transparent' : 'from-secondary to-transparent'}`}></div>
                  
                  <div className="p-5 flex-1 relative z-10 flex flex-col justify-between">
                    <div>
                      <div className="inline-block backdrop-blur-md px-3 py-1 rounded-full text-foreground text-[10px] font-bold tracking-wide mb-3 border border-border shadow-sm" style={i === 0 ? { backgroundColor: 'var(--papaya-whip)', color: 'var(--deep-space-blue)' } : undefined}>
                        {session.session_data?.grado || "General"}
                      </div>
                      <h4 className="text-xl font-bold mb-1 text-foreground leading-tight group-hover:text-primary transition-colors">
                        {session.session_data?.titulo || session.session_data?.tema || "Sin título"}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium mb-2">
                        {session.session_data?.tema || "Tema no especificado"}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--brick-red)' }}>
                      ✓ Publicado
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-8 flex justify-start relative z-10">
            <Button onClick={onEnterRepositoryPreview} className="rounded-full font-bold px-8 py-2 text-sm shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: '#5590af', color: 'var(--papaya-whip)' }}>
              Ir al Repositorio
            </Button>
          </div>

          <motion.img 
            animate={{ x: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            src="/pinguinos/pinguino_chill.png"
            className="absolute -bottom-16 -right-10 w-64 h-64 opacity-20 z-0 pointer-events-none object-contain"
            alt="Pinguino"
          />
        </motion.div>
      </section>

      {/* Tools Grid Section */}
      <section className="px-4 lg:px-8 py-10 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={springLeft}
            whileHover={{ scale: 0.98 }}
            className="bg-primary/5 border border-primary/20 rounded-[2rem] p-10 flex flex-col justify-between h-[450px] relative overflow-hidden group cursor-pointer shadow-md"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-foreground mb-4">Herramientas<br/>Docentes</h2>
              <p className="text-muted-foreground font-medium text-sm max-w-xs leading-relaxed">
                Todo lo que necesitas para tu clase: evaluación formativa, rúbricas y actividades diferenciadas.
              </p>
            </div>
            
            <div className="relative z-10">
              <Button onClick={onEnterGeneratorPreview} className="rounded-full font-bold px-6 py-2 text-sm shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: '#5590af', color: 'var(--papaya-whip)' }}>
                Generar Documentos
              </Button>
            </div>

            <motion.img 
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 5 }}
              src="/pinguinos/pinguino_mostrando.png"
              className="absolute right-0 bottom-0 w-64 h-64 translate-x-12 translate-y-12 group-hover:scale-110 transition-transform duration-500 drop-shadow-xl object-contain"
              alt="Mascota"
            />
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
             <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={springUp}
                whileHover={{ scale: 1.03 }}
                className="bg-card border border-border rounded-[2rem] p-8 flex flex-col justify-between h-[450px] relative group cursor-pointer shadow-md"
             >
                <div className="absolute top-4 left-4 z-10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <div className="flex items-center justify-center flex-1 py-6">
                  <img
                    src="/innovacion.jpg"
                    alt="Innovación pedagógica"
                    className="w-52 h-52 object-contain drop-shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">Innovación<br/>Pedagógica</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">Aplica metodologías activas sugeridas por la IA para mantener la atención de tus estudiantes.</p>
                </div>
             </motion.div>

             <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={springUp}
                whileHover={{ scale: 1.03 }}
                className="bg-card border border-border rounded-[2rem] p-8 flex flex-col justify-between h-[450px] relative group cursor-pointer shadow-md"
             >
                <div className="absolute top-4 left-4 z-10">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-secondary" />
                  </div>
                </div>

                <div className="flex items-center justify-center flex-1 py-6">
                  <img
                    src="/sesion_ap_doc.png"
                    alt="Sesión en documento"
                    className="w-52 h-52 object-contain drop-shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">Descarga en<br/>Formato Oficial</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">Obtén tus sesiones en documentos listos para presentar, siguiendo el formato exigido.</p>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Footer / CTA Mini */}
      <footer className="text-center py-10 px-4 mt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="flex flex-col items-center"
        >
           <motion.img 
             animate={{ y: [0, -15, 0] }}
             transition={{ repeat: Infinity, duration: 2.5 }}
             src="/pinguinos/pinguino_like.png"
             className="w-24 h-24 mb-4 drop-shadow-xl object-contain"
             alt="Like"
           />
           <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Planificar nunca fue tan fácil</h2>
           <p className="text-sm text-muted-foreground mb-6">Elige tu tema - Configura tu aula - Genera tu sesión</p>
        </motion.div>
      </footer>

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


