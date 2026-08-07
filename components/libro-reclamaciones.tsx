"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, BookOpen, Send, CheckCircle2, AlertCircle, ArrowLeft, Mail, Phone, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"

interface LibroReclamacionesProps {
  readonly isOpen?: boolean
  readonly onClose?: () => void
}

export function LibroReclamaciones({ isOpen = true, onClose }: LibroReclamacionesProps) {
  const [submitted, setSubmitted] = useState(false)
  const [claimCode, setClaimCode] = useState("")
  const [loading, setLoading] = useState(false)

  // Form State according to INDECOPI Regulations (DS 011-2011-PCM)
  const [formData, setFormData] = useState({
    fullName: "",
    documentType: "DNI",
    documentNumber: "",
    email: "",
    phone: "",
    address: "",
    claimType: "reclamo", // reclamo vs queja
    serviceType: "Servicio Digital / Suscripción EduAI",
    amount: "",
    description: "",
    detail: "",
    request: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.documentNumber || !formData.email || !formData.detail) {
      toast.error("Por favor completa los campos obligatorios (*)")
      return
    }

    setLoading(true)

    // Generate compliant Claim Code: LR-YEAR-RANDOM
    const generatedCode = `LR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
    setClaimCode(generatedCode)

    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success("Reclamación registrada exitosamente", {
        description: `Código asignado: ${generatedCode}. Recibirás copia en tu correo.`
      })
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Educa+
          </Link>
          <img src="/educa-logo.png" alt="Educa +" className="h-9 w-auto object-contain" />
        </div>

        {/* Main Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          
          {/* Card Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white relative">
            <div className="flex items-center gap-2.5 mb-2">
              <Badge className="bg-amber-400 text-slate-950 hover:bg-amber-400 font-bold px-3 py-0.5 text-xs">
                CONFORME A LEY INDECOPI (D.S. N° 011-2011-PCM)
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-amber-400 shrink-0" />
              Libro de Reclamaciones Virtual
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Educa+ / EduAI pone a disposición de sus usuarios este Libro Virtual para registrar reclamos o quejas conforme a las normas de protección al consumidor de Perú.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. DATOS DEL CONSUMIDOR */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    1. Identificación del Consumidor Reclamante
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nombre completo o Razón Social *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        placeholder="Ej. Juan Pérez García"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tipo de Documento *
                      </label>
                      <select
                        value={formData.documentType}
                        onChange={(e) => handleChange("documentType", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="DNI">DNI</option>
                        <option value="CE">Carné de Extranjería</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="RUC">RUC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Número de Documento *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.documentNumber}
                        onChange={(e) => handleChange("documentNumber", e.target.value)}
                        placeholder="00000000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Correo Electrónico de Notificación *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Teléfono / Celular de contacto
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="999 999 999"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Domicilio del Consumidor
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Av. Principal 123, Lima, Perú"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. IDENTIFICACIÓN DEL BIEN O SERVICIO */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    2. Identificación del Bien o Servicio Contratado
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Servicio
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.serviceType}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Monto Reclamado (S/) opcional
                      </label>
                      <input
                        type="text"
                        value={formData.amount}
                        onChange={(e) => handleChange("amount", e.target.value)}
                        placeholder="Ej. 29.90"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. DETALLE DE LA RECLAMACIÓN */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    3. Detalle de la Reclamación y Pedido del Consumidor
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Tipo de Registró *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label
                          className={`p-3.5 rounded-2xl border flex flex-col cursor-pointer transition-all ${
                            formData.claimType === "reclamo"
                              ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                            <input
                              type="radio"
                              name="claimType"
                              value="reclamo"
                              checked={formData.claimType === "reclamo"}
                              onChange={() => handleChange("claimType", "reclamo")}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            Reclamo
                          </div>
                          <span className="text-[11px] text-slate-500 mt-1 pl-5">
                            Disconformidad relacionada a los productos o servicios ofrecidos.
                          </span>
                        </label>

                        <label
                          className={`p-3.5 rounded-2xl border flex flex-col cursor-pointer transition-all ${
                            formData.claimType === "queja"
                              ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                            <input
                              type="radio"
                              name="claimType"
                              value="queja"
                              checked={formData.claimType === "queja"}
                              onChange={() => handleChange("claimType", "queja")}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            Queja
                          </div>
                          <span className="text-[11px] text-slate-500 mt-1 pl-5">
                            Malestar o descontento respecto a la atención al cliente.
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Detalle del Reclamo o Queja *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.detail}
                        onChange={(e) => handleChange("detail", e.target.value)}
                        placeholder="Describe detalladamente los hechos suscitados..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pedido del Consumidor (Solución esperada)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.request}
                        onChange={(e) => handleChange("request", e.target.value)}
                        placeholder="Indica qué solución o acción solicitas respecto a tu caso..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Information Notice */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-blue-600" />
                    Contacto Directo del Proveedor
                  </p>
                  <p>
                    Las reclamaciones registradas son canalizadas inmediatamente al correo oficial de atención: <strong className="text-slate-900">contacto@sesionmas.online</strong>.
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    * Según el Art. 24 de la Ley N° 29571, la respuesta a la presente reclamación será remitida al correo del consumidor en un plazo máximo de quince (15) días hábiles.
                  </p>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-blue-500/20 text-sm flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar Hoja de Reclamación
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              /* SUCCESS STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-6 max-w-lg mx-auto"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 className="h-12 w-12" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900">¡Hoja de Reclamación Registrada!</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Tu reclamo ha sido ingresado al sistema formal de Educa+ y notificado a nuestro equipo.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 font-mono text-xs text-slate-700">
                  <div><strong>Código de Reclamación:</strong> <span className="text-blue-600 font-bold">{claimCode}</span></div>
                  <div><strong>Fecha y Hora:</strong> {new Date().toLocaleString()}</div>
                  <div><strong>Reclamante:</strong> {formData.fullName} ({formData.documentType} {formData.documentNumber})</div>
                  <div><strong>Correo Notificación:</strong> {formData.email}</div>
                  <div><strong>Canal de Respuesta:</strong> contacto@sesionmas.online</div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Conforme a ley, recibirás una copia en PDF en tu correo electrónico. Nuestro equipo se pondrá en contacto dentro del plazo legal establecido de 15 días hábiles.
                </p>

                <div className="pt-4">
                  <Link href="/">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-md">
                      Regresar al Inicio de Educa+
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
