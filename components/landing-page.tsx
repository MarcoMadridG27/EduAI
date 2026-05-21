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
          <Button onClick={onLogin} className="rounded-full text-primary-foreground hover:bg-primary/90 font-bold pt-8 px-8 py-5  shadow-lg transition-all hover:scale-105 active:scale-95" style={{ color: '#003049' }}>
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
          className="relative w-full h-[70vh] min-h-[550px] rounded-[3rem] overflow-hidden flex flex-col items-center justify-center text-center shadow-xl border border-border bg-card"
          style={{
            backgroundImage: "url('/blu.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Background Gradient/Pattern instead of travel photo */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 opacity-50"></div>
          
          <div className="relative z-10 px-4 max-w-4xl mx-auto flex flex-col items-center mt-10">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
              className="text-4xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 leading-tight font-serif"
              style={{ color: '#003049' }}
            >
              Sesion+ <br className="hidden md:block" />
            </motion.h1>
            
            <text className="text-lg md:text-xl mb-8 max-w-2xl">
              Genera sesiones de aprendizaje estructuradas en segundos. Alineadas al currículo nacional, con procesos didácticos exactos y adaptadas a tu entorno.
            </text>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={onEnterGeneratorPreview}
                className="rounded-full font-bold px-8 py-6 text-lg shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#2A5D78', color: 'var(--papaya-whip)' }}
              >
                Comenzar ahora
              </Button>
              <Button onClick={onEnterRepositoryPreview} variant="outline" className="rounded-full border-2 font-bold px-8 py-6 text-lg transition-all hover:scale-105 active:scale-90" style={{ backgroundColor: 'var(--papaya-whip)', color: 'var(--deep-space-blue)', borderColor: 'var(--border)' }}>
                Explorar Repositorio
              </Button>
            </motion.div>
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
            <Button variant="default" onClick={onEnterRepositoryPreview} className="rounded-full font-bold px-8 py-2 text-sm shadow-md">
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
              <Button onClick={onEnterGeneratorPreview} className="rounded-full font-bold px-6 py-2 text-sm shadow-md">
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
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
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
                <div className="flex items-center justify-center mb-4 mt-1">
                  <img
                    src="/sesion_ap_doc.png"
                    alt="Sesión en documento"
                    className="w-24 h-24 object-contain drop-shadow-md"
                  />
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-secondary" />
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
    </div>
  )
}


