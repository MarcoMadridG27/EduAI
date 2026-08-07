"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  BookOpen,
  ArrowLeft,
  Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"

interface SubscriptionsSectionProps {
  readonly user?: { name: string; email: string } | null
  readonly onNavigateToGenerator?: () => void
  readonly onNavigateToRepo?: () => void
  readonly onBack?: () => void
}

export function SubscriptionsSection({
  user,
  onNavigateToGenerator,
  onNavigateToRepo,
  onBack
}: SubscriptionsSectionProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly" | "annual">("monthly")
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [showApiDocModal, setShowApiDocModal] = useState(false)
  const [openFaq1, setOpenFaq1] = useState(false)
  const [openFaq2, setOpenFaq2] = useState(false)
  
  // Checkout simulation states
  const [checkoutStep, setCheckoutStep] = useState<"form" | "processing" | "success">("form")
  const [payerEmail, setPayerEmail] = useState(user?.email || "docente.ejemplo@edu.pe")
  const [cardNumber, setCardNumber] = useState("4509 •••• •••• 8821")
  const [cardToken, setCardToken] = useState("TEST_CARD_TOKEN_992182")
  const [paymentStatus, setPaymentStatus] = useState<"authorized" | "processed" | "waiting for gateway" | "recycling">("authorized")

  const handleRealCheckout = () => {
    const baseUrl = process.env.NEXT_PUBLIC_PAYMENTS_API_URL || "https://api.sesionmas.online/payments"
    const checkoutUrl = `${baseUrl}/checkout/${billingCycle}`
    
    toast.loading("Redirigiendo a la pasarela segura de Mercado Pago...")
    window.location.href = checkoutUrl
  }

  const handleStartCheckout = () => {
    handleRealCheckout()
  }

  const handleSimulatePayment = () => {
    setCheckoutStep("processing")
    setTimeout(() => {
      setCheckoutStep("success")
      toast.success("¡Suscripción al Plan Docente Pro activada exitosamente!", {
        description: "Ahora cuentas con 20 sesiones de aprendizaje al mes y todas las funciones avanzadas."
      })
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack ? onBack : () => window.history.back()}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div className="h-6 w-px bg-slate-200" />
            <Link href="/" className="flex items-center group">
              <img
                src="/educa-logo.png"
                alt="Educa +"
                className="h-9 w-auto object-contain drop-shadow-sm group-hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateToRepo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateToRepo}
                className="text-slate-600 hover:text-blue-600 hidden md:flex items-center gap-1.5 font-medium"
              >
                <BookOpen className="h-4 w-4" />
                Repositorio
              </Button>
            )}
            {onNavigateToGenerator && (
              <Button
                size="sm"
                onClick={onNavigateToGenerator}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
              >
                Crear Sesión
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-3.5 py-1 text-xs font-semibold rounded-full mb-4 border border-blue-200">
            <Zap className="h-3.5 w-3.5 mr-1 text-blue-600 fill-blue-600" />
            Planes de Suscripción EduAI
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Diseñado para docentes que <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              transforman su enseñanza
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Genera sesiones de aprendizaje adaptadas al CNEB en segundos, descarga fichas de trabajo y ahorra horas de planificación semanal.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300 gap-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle("quarterly")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "quarterly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Trimestral
              <Badge className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 font-black uppercase">
                Ahorra 13%
              </Badge>
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Anual
              <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 font-black uppercase">
                Ahorra 47%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">

          {/* Plan Básico / Gratuito */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col bg-white">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Nivel Inicial
                  </span>
                  <Badge variant="outline" className="text-slate-600 border-slate-300">
                    Gratis
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-black text-slate-900">
                  Plan Inicial
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Ideal para probar las funciones básicas de la IA en tu planificación docente.
                </CardDescription>
                
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">S/ 0</span>
                  <span className="text-sm text-slate-500 font-medium">/ mes</span>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-4 flex-1">
                <div className="space-y-3.5 border-t border-slate-100 pt-6">
                  <div className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Hasta <strong>3 sesiones</strong> de aprendizaje al mes</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Acceso al Repositorio Público de la comunidad</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Alineación básica al CNEB</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-400">
                    <Check className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                    <span className="line-through">Fichas de trabajo diferenciadas</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-400">
                    <Check className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                    <span className="line-through">Exportación a formato oficial Word/PDF</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-8 pt-0">
                <Button
                  variant="outline"
                  onClick={onNavigateToGenerator}
                  className="w-full h-12 rounded-xl border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Usar Plan Gratuito
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Plan Docente Pro (FEATURED) */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black px-4 py-1 text-xs rounded-full shadow-lg shadow-blue-500/30 border-0 flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                MÁS POPULAR & RECOMENDADO
              </Badge>
            </div>

            <Card className="h-full border-2 border-blue-500/80 shadow-2xl shadow-blue-500/10 rounded-3xl overflow-hidden flex flex-col bg-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 fill-blue-600" />
                    Acceso Total
                  </span>
                  <Badge className="bg-blue-100 text-blue-700 font-bold border-0">
                    Suscripción Pro
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-black text-slate-900">
                  Plan Docente Pro
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  La solución completa para profesores exigentes que buscan máxima productividad pedagógica.
                </CardDescription>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">
                    {billingCycle === "monthly" && "S/ 29.90"}
                    {billingCycle === "quarterly" && "S/ 25.90"}
                    {billingCycle === "annual" && "S/ 15.90"}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    / mes {billingCycle === "quarterly" && "(cobrado S/ 77.70 cada 3 meses)"}
                    {billingCycle === "annual" && "(cobrado S/ 190.80 al año)"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-4 flex-1">
                <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-1">
                    <Zap className="h-4 w-4 text-blue-600 fill-blue-600" />
                    Capacidad Incluida:
                  </div>
                  <p className="text-xs text-blue-700 font-semibold leading-relaxed">
                    Genera hasta <strong className="text-blue-900 text-sm underline decoration-blue-400">20 sesiones de aprendizaje completas al mes</strong> con IA contextualizada al CNEB.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 text-sm text-slate-800 font-semibold">
                    <div className="bg-emerald-100 text-emerald-700 p-0.5 rounded-full mt-0.5">
                      <Check className="h-4 w-4" />
                    </div>
                    <span><strong>Hasta 20 sesiones al mes</strong> (renovación automática)</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="bg-emerald-100 text-emerald-700 p-0.5 rounded-full mt-0.5">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>Generación de fichas de trabajo adaptadas y diferenciadas</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="bg-emerald-100 text-emerald-700 p-0.5 rounded-full mt-0.5">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>Rúbricas, listas de cotejo y evaluación formativa</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="bg-emerald-100 text-emerald-700 p-0.5 rounded-full mt-0.5">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>Exportación directa a formato oficial Word y PDF</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="bg-emerald-100 text-emerald-700 p-0.5 rounded-full mt-0.5">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>Integración prioritaria con Asistente WhatsApp 24/7</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-8 pt-0 flex flex-col gap-3">
                <Button
                  onClick={handleStartCheckout}
                  className="w-full h-13 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Suscribirme al Plan Pro
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Pago seguro procesado por Mercado Pago
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

      </main>

      {/* CHECKOUT MODAL */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-slate-200 shadow-2xl rounded-3xl max-w-lg w-full overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
              <button
                onClick={() => { setShowCheckoutModal(false); setCheckoutStep("form") }}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 mb-3">
                <img src="/educa-logo.png" alt="Educa +" className="h-7 w-auto object-contain brightness-0 invert" />
              </div>
              <h3 className="text-xl font-bold">Suscripción Plan Docente Pro</h3>
              <p className="text-xs text-blue-100">
                Pago recurrente mensual · 20 sesiones al mes
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {checkoutStep === "form" && (
                <div className="space-y-4">
                  {/* Order summary */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-blue-900 text-sm">Plan Docente Pro</p>
                      <p className="text-xs text-blue-700 mt-0.5">20 sesiones de aprendizaje al mes · Renovación automática</p>
                    </div>
                    <span className="font-extrabold text-blue-900 text-lg">
                      {billingCycle === "monthly" ? "S/ 29.90" : "S/ 15.90"}
                      <span className="text-xs font-normal text-blue-700">/mes</span>
                    </span>
                  </div>

                  {/* Payer email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Correo electrónico de contacto
                    </label>
                    <input
                      type="email"
                      value={payerEmail}
                      onChange={(e) => setPayerEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Card fields */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Número de tarjeta
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <CreditCard className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Vencimiento</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength={5}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Security note */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Pago seguro procesado por <strong className="text-slate-700">Mercado Pago</strong>. Tus datos están encriptados y protegidos.</span>
                  </div>

                  <div className="pt-1 flex items-center justify-end gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => { setShowCheckoutModal(false); setCheckoutStep("form") }}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleRealCheckout}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-xl shadow-md"
                    >
                      Pagar con Mercado Pago →
                    </Button>
                  </div>
                </div>
              )}

              {checkoutStep === "processing" && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                  <h4 className="font-bold text-slate-800 text-base">Procesando tu pago...</h4>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Estamos verificando tu información de forma segura. Esto tomará solo un momento.
                  </p>
                </div>
              )}

              {checkoutStep === "success" && (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">¡Bienvenido al Plan Pro!</h4>
                  <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
                    Tu suscripción está activa. Ahora puedes generar hasta <strong>20 sesiones de aprendizaje al mes</strong> con todas las funciones avanzadas.
                  </p>
                  <div className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl text-left space-y-1">
                    <p className="text-xs text-blue-700"><span className="font-bold">Plan:</span> Docente Pro · 20 sesiones/mes</p>
                    <p className="text-xs text-blue-700"><span className="font-bold">Correo:</span> {payerEmail}</p>
                    <p className="text-xs text-blue-700"><span className="font-bold">Próxima renovación:</span> en 30 días</p>
                  </div>
                  <Button
                    onClick={() => {
                      setShowCheckoutModal(false)
                      setCheckoutStep("form")
                      if (onNavigateToGenerator) onNavigateToGenerator()
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-md mt-2"
                  >
                    Ir al Generador de Sesiones →
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      {/* Legal Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-slate-500 mb-3">
            © {new Date().getFullYear()} Educa+ / EduAI. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 font-medium">
            <a href="/legal/terminos_y_condiciones.txt" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors hover:underline">
              Términos y Condiciones
            </a>
            <a href="/legal/politica_privacidad.txt" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors hover:underline">
              Política de Privacidad
            </a>
            <a href="/legal/politica_proteccion_datos.txt" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors hover:underline">
              Protección de Datos (Ley N° 29733)
            </a>
            <a href="/legal/politica_seguridad_encriptacion.txt" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors hover:underline">
              Seguridad y Cifrado
            </a>
            <a href="/legal/aviso_legal.txt" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors hover:underline">
              Aviso Legal
            </a>
            <a href="/legal/politica_cookies.txt" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors hover:underline">
              Política de Cookies
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
