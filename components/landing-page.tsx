"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Layers, Users, Sparkles, BrainCircuit, Lightbulb, ChevronRight, ChevronLeft, Target, PlayCircle, Loader } from "lucide-react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/LanguageContext"
import { Navbar } from "@/components/navbar"
import { LandingHero } from "@/components/landing-hero"
import { toast } from "sonner"

interface LandingPageProps {
  readonly onEnterGeneratorPreview: () => void
  readonly onEnterRepositoryPreview: () => void
  readonly onLogin: () => void
}

export function LandingPage({ onEnterGeneratorPreview, onEnterRepositoryPreview, onLogin }: Readonly<LandingPageProps>) {
  const { t, language } = useLanguage()

  const localTranslations: Record<string, Record<string, string>> = {
    es: {
      newAsistant: "¡Nuevo! Asistente en tu bolsillo",
      cnebAligned: "Alineado al CNEB",
      cnebAlignedDesc: "Respuestas basadas en el Currículo Nacional vigente.",
      noRegister: "Sin Registros",
      noRegisterDesc: "Sin contraseñas. Escribe, chatea y obtén tu planificación.",
      whatsAppPrompt: "WhatsApp:",
      teacherTools: "Herramientas Docentes",
      teacherToolsDesc: "Todo lo que necesitas para tu clase: evaluación formativa, rúbricas y actividades diferenciadas.",
      pedagogicInnovation: "Innovación Pedagógica",
      pedagogicInnovationDesc: "Aplica metodologías activas sugeridas por la IA para mantener la atención de tus estudiantes.",
      officialDownload: "Descarga en Formato Oficial",
      officialDownloadDesc: "Obtén tus sesiones en documentos listos para presentar, siguiendo el formato exigido.",
      whatsappInput: "Escribe...",
      whatsappAuthor: "EduAI Bot Asistente",
      whatsappInitialText: "¡Hola Maestro! Generando sesión de aprendizaje de 90 minutos alineada a la competencia 'Resuelve problemas de cantidad' del CNEB...",
      whatsappSecuencia: "Secuencia Didáctica:",
      whatsappInicio: "Inicio (15 min): Dinámica 'Repartiendo la pizza'. Saberes previos y conflicto cognitivo.",
      whatsappDesarrollo: "Desarrollo (60 min): Representación gráfica y simbólica. Ficha de trabajo estructurada.",
      whatsappTeacherPrompt: "¡Hola! Necesito una sesión de matemáticas sobre fracciones para 3ro de primaria.",
      bpPlan: "I. PLANIFICACIÓN MATEMÁTICA",
      bpTema: "Tema:",
      bpTemaVal: "Sistemas de Ecuaciones Lineales",
      bpGrado: "Grado:",
      bpGradoVal: "2do de Secundaria - CNEB",
      bpPropositos: "II. PROPÓSITOS Y EVIDENCIAS",
      bpAnalizando: "Analizando CNEB...",
      bpComp: "Competencia resuelve problemas de regularidad equivalencia.",
      bpCap: "Capacidades traduce datos y condiciones a expresiones algebraicas.",
      bpCrit: "Criterios formula sistemas de ecuaciones y modela situaciones.",
      bpSecuencia: "III. SECUENCIA DIDÁCTICA",
      bpInicio: "Inicio",
      bpInicioVal: "Planteamiento de situación lúdica mediante balanzas equilibradas.",
      bpDesarrollo: "Desarrollo formal del método de reducción y sustitución.",
      bpPrompt: 'Prompt: "ecuaciones con balanzas didácticas"',
      bpGenerando: "GENERANDO"
    },
    en: {
      newAsistant: "New! Pocket Assistant",
      cnebAligned: "CNEB Aligned",
      cnebAlignedDesc: "Responses based on the current National Curriculum.",
      noRegister: "No Registration",
      noRegisterDesc: "No passwords. Write, chat, and get your planning.",
      whatsAppPrompt: "WhatsApp:",
      teacherTools: "Teacher Tools",
      teacherToolsDesc: "Everything you need for your class: formative assessment, rubrics, and differentiated activities.",
      pedagogicInnovation: "Pedagogical Innovation",
      pedagogicInnovationDesc: "Apply active methodologies suggested by AI to keep your students' attention.",
      officialDownload: "Official Format Download",
      officialDownloadDesc: "Get your sessions in documents ready to present, following the required format.",
      whatsappInput: "Type a message...",
      whatsappAuthor: "EduAI Assistant Bot",
      whatsappInitialText: "Hello Teacher! Generating a 90-minute learning session aligned with the CNEB 'Solve quantity problems' competency...",
      whatsappSecuencia: "Lesson Sequence:",
      whatsappInicio: "Introduction (15 min): 'Sharing the pizza' dynamic. Prior knowledge and cognitive conflict.",
      whatsappDesarrollo: "Development (60 min): Graphic and symbolic representation. Structured worksheet.",
      whatsappTeacherPrompt: "Hello! I need a math lesson plan about fractions for 3rd grade.",
      bpPlan: "I. MATHEMATICAL PLANNING",
      bpTema: "Topic:",
      bpTemaVal: "Systems of Linear Equations",
      bpGrado: "Grade:",
      bpGradoVal: "8th Grade - CNEB",
      bpPropositos: "II. PURPOSES AND EVIDENCE",
      bpAnalizando: "Analyzing CNEB...",
      bpComp: "Competency solves problems of regularity & equivalence.",
      bpCap: "Capacities translate data and conditions to algebraic terms.",
      bpCrit: "Criteria formulate systems of equations and model scenarios.",
      bpSecuencia: "III. DIDACTIC SEQUENCE",
      bpInicio: "Introduction",
      bpInicioVal: "Ludic situation proposal using balanced scales.",
      bpDesarrollo: "Formal development of reduction and substitution methods.",
      bpPrompt: 'Prompt: "equations with educational scales"',
      bpGenerando: "GENERATING"
    },
    qu: {
      newAsistant: "¡Musuq! Yanapaq bolsilloykipi",
      cnebAligned: "CNEBman tupachisqa",
      cnebAlignedDesc: "Currículo Nacionalman hina kutichiykuna.",
      noRegister: "Mana qillqakuna",
      noRegisterDesc: "Mana contraseñayuq. Qillqay, rimay hinaspa planificacionniykita chaskiy.",
      whatsAppPrompt: "WhatsApp:",
      teacherTools: "Amauta Yanapakuykuna",
      teacherToolsDesc: "Tukuy yachachiykunapaq yanapakuykuna: chaninchay, rúbricas hinaspa t'aqasqa ruraykuna.",
      pedagogicInnovation: "Pedagogic Musuqyachiy",
      pedagogicInnovationDesc: "IApa yanapakuyninwan musuq yachachiy ñankunata wawakunapaq llamkay.",
      officialDownload: "Allin Willakuypi Uranchay",
      officialDownloadDesc: "Yachachiy planikunata allin willakuypaq taqichasqa chaskiy.",
      whatsappInput: "Qillqay...",
      whatsappAuthor: "EduAI Yanapaq Bot",
      whatsappInitialText: "¡Allillachu Amauta! 90 minutuyuq yachachiyta rurachkani CNEB 'Yupay problemakunata allichay' atipakuywan...",
      whatsappSecuencia: "Yachachiy Ñan:",
      whatsappInicio: "Qallariy (15 min): 'Pizzata t'aqanchik' pukllay. Ñawpa yachaykuna allichay.",
      whatsappDesarrollo: "Desarrollo (60 min): Siq'ikunawan unanchakunawan ruray. Llamkana ficha.",
      whatsappTeacherPrompt: "Allillachu! T'aqanakunamanta yachachiyta munani yachay wasi kimsa ñiqipaq.",
      bpPlan: "I. YUPAY YACHACHIY ÑAN",
      bpTema: "Tema:",
      bpTemaVal: "Allin yupay llankaykuna",
      bpGrado: "Grado:",
      bpGradoVal: "Secundariapa iskay ñiqin - CNEB",
      bpPropositos: "II. PROPÓSITOS Y EVIDENCIAS",
      bpAnalizando: "CNEBta allichaspa...",
      bpComp: "Atipakuy problemakunata allichay.",
      bpCap: "Atiykuna yupaykunata t'ikray.",
      bpCrit: "Kaqllachay yupaykunata qillqay.",
      bpSecuencia: "III. SECUENCIA DIDÁCTICA",
      bpInicio: "Qallariy",
      bpInicioVal: "Aysanawan pukllaspa problemakuna riqsichiy.",
      bpDesarrollo: "Yupay allichay t'aqata ruray.",
      bpPrompt: 'Prompt: "aysanakunawan yupana pukllay"',
      bpGenerando: "RURACHKAN"
    },
    ay: {
      newAsistant: "Machaq! Yanapiri bolsilluna",
      cnebAligned: "CNEB uñtasqa",
      cnebAlignedDesc: "National Curriculum uñtasqa thakhinakap.",
      noRegister: "Janiw mantiriñakiti",
      noRegisterDesc: "Janiw contraseñanaka. Qillqaña, rimt'aña yatichawi chaskiñataki.",
      whatsAppPrompt: "WhatsApp:",
      teacherTools: "Yatichirin Yatichañapataki",
      teacherToolsDesc: "Yatichaw taqinakampi: chaninchawi uñakipawi ukhamarak lurañanaka ch'axwata.",
      pedagogicInnovation: "Yatichawi Ch'amanchawi",
      pedagogicInnovationDesc: "IA-mpi machaq yatichawi pukllay lurañanaka wawanakataki.",
      officialDownload: "Thakhinchata Uranchaña",
      officialDownloadDesc: "Yatichawi thakhinakap documents churaña yatiqañ uta thakhimarjama.",
      whatsappInput: "Qillqt'aña...",
      whatsappAuthor: "EduAI Yanapiri Bot",
      whatsappInitialText: "¡Suma Yatichiri! 90 minutu yatichawi thakhinakap luraskani CNEB 'Yupanakampi problemak ch'amañcht'aña' lurañampi...",
      whatsappSecuencia: "Yatichawi sequence:",
      whatsappInicio: "Qalltaña (15 min): 'Pizzat t'aqaskañani' pukllawi. Ñawpa yatiñanaka.",
      whatsappDesarrollo: "Desarrollo (60 min): Uñtasqa luraña siqinakampi. Yatichaw llamkana ficha.",
      whatsappTeacherPrompt: "Kamisaki! Yupay t'aqanakapat yatichaw munta yatiqaña uta kimsa taqitaki.",
      bpPlan: "I. YUPANAKAMP YATICHAW",
      bpTema: "Tema:",
      bpTemaVal: "Yupay lurañanaka",
      bpGrado: "Grado:",
      bpGradoVal: "Secundariana payïri taqi - CNEB",
      bpPropositos: "II. PROPÓSITOS Y EVIDENCIAS",
      bpAnalizando: "CNEB uñakipasa...",
      bpComp: "Lurañampi problemak ch'amañcht'aña.",
      bpCap: "Yatinaka yupay luraña.",
      bpCrit: "Uñakipaña yupaykunata.",
      bpSecuencia: "III. SECUENCIA DIDÁCTICA",
      bpInicio: "Qalltaña",
      bpInicioVal: "Balanzampi pukllat yupana problemak uñachayaña.",
      bpDesarrollo: "Yupawi luraña thakhinakap.",
      bpPrompt: 'Prompt: "balanzanakampi yupa pukllawi"',
      bpGenerando: "LURASKANI"
    }
  }

  const lt = localTranslations[language] || localTranslations.es

  const [repositorySessions, setRepositorySessions] = useState<any[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [sessionsError, setSessionsError] = useState<string | null>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://js.storylane.io/js/v2/storylane.js"
    script.async = true
    script.setAttribute("data-verify-origin", "")
    document.body.appendChild(script)
    return () => {
      try {
        document.body.removeChild(script)
      } catch (e) {
        // Silently catch
      }
    }
  }, [])

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
    <div className="min-h-screen bg-[var(--bg)] text-foreground font-sans selection:bg-primary selection:text-primary-foreground pb-20 overflow-x-hidden">
      <Navbar variant="landing" onLogin={onLogin} />
      <LandingHero
        onEnterGeneratorPreview={onEnterGeneratorPreview}
        onEnterRepositoryPreview={onEnterRepositoryPreview}
      />

      {/* Demo Demonstration Section */}
      <section className="px-4 lg:px-8 py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleIn}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="mb-4" style={{ font: "var(--text-display-2)", color: "var(--ink-900)" }}>{t("interactiveDemo")}</h2>
            <p className="text-lg" style={{ color: "var(--ink-500)" }}>{t("interactiveDemoDesc")}</p>
          </div>
          <div
            className="w-full relative overflow-hidden rounded-[var(--ds-radius-xl)] border sl-embed"
            style={{ paddingBottom: "calc(49.22% + 25px)", height: 0, borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-lg)" }}
          >
            <iframe
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full border-0 rounded-[var(--ds-radius-xl)] sl-demo"
              src="https://app.storylane.io/demo/l7mjkcatobdt?embed=inline" 
              name="sl-embed" 
              allow="fullscreen" 
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "1px solid rgba(63,95,172,0.35)",
                boxShadow: "0px 0px 18px rgba(26, 19, 72, 0.15)",
                boxSizing: "border-box"
              }}
            />
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
              <h2 className="mb-6" style={{ font: "var(--text-display-2)", color: "var(--ink-900)", letterSpacing: "-0.01em" }}>
                {t("whyChooseTitle")}
              </h2>
              <p className="text-lg font-medium leading-relaxed" style={{ color: "var(--ink-500)" }}>
                {t("whyChooseSubtitle")}
              </p>
            </div>

            <div className="flex justify-center pt-8 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full p-4 shrink-0 flex items-center justify-center" style={{ backgroundColor: 'var(--emerald-50)', color: 'var(--emerald-700)', border: '1px solid var(--emerald-300)' }}>
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xl font-black mt-3" style={{ color: "var(--ink-900)" }}>✓ CNEB</span>
                <span className="text-[10px] font-bold uppercase tracking-wider leading-tight mt-1" style={{ color: "var(--ink-500)" }}>Currículo<br/>Nacional</span>
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
              whileHover={{ x: -4 }}
              className="border p-6 flex items-center gap-6 cursor-pointer transition-shadow hover:shadow-[var(--shadow-md)]"
              style={{ background: "var(--white)", borderColor: "var(--border-subtle)", borderRadius: "var(--ds-radius-xl)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="p-4 rounded-[var(--ds-radius-md)] shrink-0" style={{ backgroundColor: 'var(--blue-50)', color: 'var(--blue-600)' }}>
                <BrainCircuit className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: "var(--ink-900)" }}>{t("smartGenTitle")}</h3>
                <p className="text-xs leading-relaxed font-medium" style={{ color: "var(--ink-500)" }}>{t("smartGenDesc")}</p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={springRight}
              whileHover={{ x: -4 }}
              className="border p-6 flex items-center gap-6 cursor-pointer transition-shadow hover:shadow-[var(--shadow-md)]"
              style={{ background: "var(--white)", borderColor: "var(--border-subtle)", borderRadius: "var(--ds-radius-xl)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="p-4 rounded-[var(--ds-radius-md)] shrink-0" style={{ backgroundColor: 'var(--violet-50)', color: 'var(--violet-700)' }}>
                <Lightbulb className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: "var(--ink-900)" }}>{t("contextualTitle")}</h3>
                <p className="text-xs leading-relaxed font-medium" style={{ color: "var(--ink-500)" }}>{t("contextualDesc")}</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={springRight}
              whileHover={{ x: -4 }}
              className="border p-6 flex items-center gap-6 cursor-pointer transition-shadow hover:shadow-[var(--shadow-md)] relative overflow-hidden"
              style={{ background: "var(--white)", borderColor: "var(--border-subtle)", borderRadius: "var(--ds-radius-xl)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="p-4 rounded-[var(--ds-radius-md)] shrink-0 z-10 relative" style={{ backgroundColor: 'color-mix(in srgb, var(--amber-500) 15%, white)', color: '#B8842E' }}>
                <Users className="w-8 h-8" />
              </div>
              <div className="z-10 relative">
                <h3 className="text-lg font-bold mb-1" style={{ color: "var(--ink-900)" }}>{t("repoTitle")}</h3>
                <p className="text-xs leading-relaxed font-medium" style={{ color: "var(--ink-500)" }}>{t("repoDesc")}</p>
              </div>
              <img
                src="/pinguinos/pinguino_pensando.png"
                className="absolute right-0 bottom-0 w-24 h-24 opacity-15 translate-x-4 translate-y-4 object-contain pointer-events-none"
                alt=""
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
          className="relative p-8 lg:p-16 overflow-hidden"
          style={{ background: "var(--white)", border: "1px solid var(--border-subtle)", borderRadius: "var(--ds-radius-xl)", boxShadow: "var(--shadow-lg)" }}
        >
          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left side: Info & Copy/Chat triggers */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[var(--ds-radius-pill)] text-xs font-black uppercase tracking-wider mb-2" style={{ background: "var(--emerald-50)", color: "var(--emerald-700)", border: "1px solid var(--emerald-300)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--emerald-500)" }} />
                {lt.newAsistant}
              </div>
              <h2 style={{ font: "var(--text-display-2)", color: "var(--ink-900)" }}>
                {t("whatsAppTitle")}
              </h2>
              <p className="text-sm md:text-base font-medium leading-relaxed max-w-xl" style={{ color: "var(--ink-500)" }}>
                {t("whatsAppDesc")}
              </p>

              {/* Bot Info Cards */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 text-left">
                <div className="p-4 rounded-[var(--ds-radius-md)] flex items-start gap-3" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)" }}>
                  <div className="p-2 rounded-[var(--ds-radius-sm)] shrink-0" style={{ background: "var(--emerald-50)", color: "var(--emerald-700)" }}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: "var(--ink-900)" }}>{lt.cnebAligned}</h4>
                    <p className="text-xs mt-0.5" style={{ color: "var(--ink-500)" }}>{lt.cnebAlignedDesc}</p>
                  </div>
                </div>

                <div className="p-4 rounded-[var(--ds-radius-md)] flex items-start gap-3" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)" }}>
                  <div className="p-2 rounded-[var(--ds-radius-sm)] shrink-0" style={{ background: "var(--emerald-50)", color: "var(--emerald-700)" }}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: "var(--ink-900)" }}>{lt.noRegister}</h4>
                    <p className="text-xs mt-0.5" style={{ color: "var(--ink-500)" }}>{lt.noRegisterDesc}</p>
                  </div>
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
                    <span className="text-white">{t("generating").toLowerCase()}</span>
                  </div>
                </div>

                {/* Chat Background / Bubble Container */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#e5ddd5] flex flex-col justify-end text-xs leading-normal">
                  {/* Message 1: User */}
                  <div className="self-end bg-[#dcf8c6] text-slate-800 p-2.5 rounded-lg rounded-tr-none shadow-sm max-w-[85%] relative">
                    <p className="font-semibold text-[10px] text-slate-500 mb-0.5">{t("teacher")}</p>
                    <p className="text-slate-800 font-medium">{lt.whatsappTeacherPrompt}</p>
                    <span className="absolute bottom-1 right-2 text-[8px] text-slate-400">10:02 AM ✓✓</span>
                  </div>

                  {/* Message 2: AI Bot */}
                  <div className="self-start bg-white text-slate-800 p-2.5 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative">
                    <p className="font-black text-[10px] text-emerald-600 mb-0.5">{lt.whatsappAuthor}</p>
                    <p className="font-semibold text-slate-800">{lt.whatsappInitialText}</p>
                    <span className="absolute bottom-1 right-2 text-[8px] text-slate-400">10:02 AM</span>
                  </div>

                  {/* Message 3: AI Bot details */}
                  <div className="self-start bg-white text-slate-800 p-2.5 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative">
                    <p className="font-semibold text-slate-800 mb-1">
                      📚 <span className="font-bold">{lt.whatsappSecuencia}</span>
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] font-medium text-slate-700">
                      <li>{lt.whatsappInicio}</li>
                      <li>{lt.whatsappDesarrollo}</li>
                    </ul>
                    <span className="absolute bottom-1 right-2 text-[8px] text-slate-400">10:03 AM</span>
                  </div>
                </div>

                {/* Message input area */}
                <div className="bg-slate-100 p-2 flex items-center gap-2 border-t border-slate-200 shrink-0">
                  <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[10px] text-slate-400 font-medium">
                    {lt.whatsappInput}
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
          className="p-8 lg:p-12 max-w-[1400px] mx-auto relative overflow-hidden"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--ds-radius-xl)" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 relative z-10">
            <div className="max-w-xl">
              <h2 className="mb-2" style={{ font: "var(--text-h1)", color: "var(--ink-900)" }}>{t("exploreRepo")}</h2>
              <p className="text-sm font-medium" style={{ color: "var(--ink-500)" }}>{t("repoDesc")}</p>
            </div>

            <div className="flex items-center gap-6 mt-6 md:mt-0">
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ border: "1px solid var(--border-subtle)", background: "var(--white)" }}>
                  <ChevronLeft className="w-4 h-4" style={{ color: "var(--ink-700)" }} />
                </button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ border: "1px solid var(--border-subtle)", background: "var(--white)" }}>
                  <ChevronRight className="w-4 h-4" style={{ color: "var(--ink-700)" }} />
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
              <h3 className="text-lg font-bold text-foreground">{t("loading")}</h3>
            </motion.div>
          ) : sessionsError ? (
            <motion.div 
              variants={scaleIn}
              className="flex flex-col items-center justify-center py-16 px-8 rounded-3xl bg-card border border-border relative z-10"
            >
              <Layers className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-bold text-foreground">Repositorio</h3>
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
                      <div className="inline-block backdrop-blur-md px-3 py-1 rounded-full text-foreground text-[10px] font-bold tracking-wide mb-3 border border-border shadow-sm" style={i === 0 ? { backgroundColor: 'var(--blue-50)', color: 'var(--blue-700)' } : undefined}>
                        {session.session_data?.grado || "General"}
                      </div>
                      <h4 className="text-xl font-bold mb-1 text-foreground leading-tight group-hover:text-primary transition-colors">
                        {session.session_data?.titulo || session.session_data?.tema || "Sin título"}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium mb-2">
                        {session.session_data?.tema || "Tema no especificado"}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--emerald-500)' }}>
                      ✓ Publicado
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-8 flex justify-start relative z-10">
            <Button onClick={onEnterRepositoryPreview} className="rounded-full font-bold px-8 py-2 text-sm shadow-lg transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: 'var(--blue-500)', color: 'var(--white)' }}>
              {t("exploreRepo")}
            </Button>
          </div>

          <img
            src="/pinguinos/pinguino_chill.png"
            className="absolute -bottom-16 -right-10 w-64 h-64 opacity-15 z-0 pointer-events-none object-contain"
            alt=""
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
            className="p-10 flex flex-col justify-between h-[450px] relative overflow-hidden group cursor-pointer"
            style={{ background: "var(--blue-50)", border: "1px solid var(--blue-100)", borderRadius: "var(--ds-radius-xl)" }}
          >
            <div className="relative z-10">
              <h2 className="mb-4" style={{ font: "var(--text-display-2)", color: "var(--ink-900)" }}>{lt.teacherTools}</h2>
              <p className="font-medium text-sm max-w-xs leading-relaxed" style={{ color: "var(--ink-500)" }}>
                {lt.teacherToolsDesc}
              </p>
            </div>

            <div className="relative z-10">
              <Button onClick={onEnterGeneratorPreview} className="rounded-[var(--ds-radius-pill)] font-bold px-6 py-2 text-sm transition-transform group-hover:scale-105" style={{ backgroundColor: 'var(--blue-500)', color: 'var(--white)', boxShadow: 'var(--shadow-sm)' }}>
                {t("newSession")}
              </Button>
            </div>

            <img
              src="/pinguinos/pinguino_mostrando.png"
              className="absolute right-0 bottom-0 w-64 h-64 translate-x-12 translate-y-12 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-300 object-contain"
              alt=""
            />
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
             <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={springUp}
                className="p-8 flex flex-col justify-between h-[450px] relative group cursor-pointer transition-shadow hover:shadow-[var(--shadow-md)]"
                style={{ background: "var(--white)", border: "1px solid var(--border-subtle)", borderRadius: "var(--ds-radius-xl)", boxShadow: "var(--shadow-sm)" }}
             >
                <div className="absolute top-4 left-4 z-10">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--blue-50)" }}>
                    <Sparkles className="w-6 h-6" style={{ color: "var(--blue-600)" }} />
                  </div>
                </div>

                <div className="flex items-center justify-center flex-1 py-6">
                  <img
                    src="/innovacion.jpg"
                    alt={lt.pedagogicInnovation}
                    className="w-52 h-52 object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 leading-tight" style={{ color: "var(--ink-900)" }}>{lt.pedagogicInnovation}</h3>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: "var(--ink-500)" }}>{lt.pedagogicInnovationDesc}</p>
                </div>
             </motion.div>

             <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={springUp}
                className="p-8 flex flex-col justify-between h-[450px] relative group cursor-pointer transition-shadow hover:shadow-[var(--shadow-md)]"
                style={{ background: "var(--white)", border: "1px solid var(--border-subtle)", borderRadius: "var(--ds-radius-xl)", boxShadow: "var(--shadow-sm)" }}
             >
                <div className="absolute top-4 left-4 z-10">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--emerald-50)" }}>
                    <BookOpen className="w-6 h-6" style={{ color: "var(--emerald-700)" }} />
                  </div>
                </div>

                <div className="flex items-center justify-center flex-1 py-6">
                  <img
                    src="/sesion_ap_doc.png"
                    alt={lt.officialDownload}
                    className="w-52 h-52 object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 leading-tight" style={{ color: "var(--ink-900)" }}>{lt.officialDownload}</h3>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: "var(--ink-500)" }}>{lt.officialDownloadDesc}</p>
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
           <img
             src="/pinguinos/pinguino_like.png"
             className="w-24 h-24 mb-4 object-contain"
             alt=""
           />
           <h2 className="mb-2" style={{ font: "var(--text-display-3)", color: "var(--ink-900)" }}>{t("planificationDesc")}</h2>
           <p className="text-sm mb-6" style={{ color: "var(--ink-500)" }}>{t("formInstructions")}</p>

           <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-xs max-w-2xl border-t pt-6" style={{ color: "var(--ink-500)", borderColor: "var(--border-subtle)" }}>
             <a href="/legal/aviso_legal.txt" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--blue-500)] transition-colors hover:underline">
               Aviso Legal
             </a>
             <a href="/legal/politica_privacidad.txt" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--blue-500)] transition-colors hover:underline">
               Política de Privacidad
             </a>
             <a href="/legal/politica_cookies.txt" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--blue-500)] transition-colors hover:underline">
               Política de Cookies
             </a>
             <a href="/legal/politica_proteccion_datos.txt" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--blue-500)] transition-colors hover:underline">
               Protección de Datos
             </a>
             <a href="/legal/politica_seguridad_encriptacion.txt" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--blue-500)] transition-colors hover:underline">
               Seguridad y Encriptación
             </a>
             <a href="/legal/terminos_y_condiciones.txt" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--blue-500)] transition-colors hover:underline">
               Términos y Condiciones
             </a>
             <Link href="/libro-de-reclamaciones" className="hover:text-[var(--blue-500)] transition-colors hover:underline font-bold text-amber-600 flex items-center gap-1">
               📖 Libro de Reclamaciones
             </Link>
           </div>
           <p className="text-[10px] text-muted-foreground/60 mt-6 font-mono">
             © {new Date().getFullYear()} Educa +. Todos los derechos reservados.
           </p>
         </motion.div>
       </footer>
    </div>
  )
}
