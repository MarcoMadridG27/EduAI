"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Users, Sparkles, ArrowRight, Zap, Target, Layers } from "lucide-react"

interface LoginScreenProps {
  onLogin: (userData: { name: string; email: string }) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [googleReady, setGoogleReady] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const googleButtonRef = useRef<HTMLDivElement>(null)

  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "https://eduai-auth-1.onrender.com"
  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  // Maneja respuesta de Google Identity
  async function handleCredentialResponse(response: any) {
    const id_token = response?.credential
    if (!id_token) return

    try {
      const res = await fetch(`${AUTH_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token }),
      })
      if (!res.ok) throw new Error("Autenticación con backend fallida")
      const tokenData = await res.json()
      const accessToken = tokenData?.access_token
      if (!accessToken) throw new Error("No se recibió access_token")
      localStorage.setItem("access_token", accessToken)
      const meRes = await fetch(`${AUTH_URL}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!meRes.ok) throw new Error("No se pudo obtener perfil de usuario")
      const user = await meRes.json()
      onLogin({ name: user.full_name || user.email, email: user.email })
    } catch (err) {
      console.error("Google login error:", err)
      alert("Error en el login con Google. Revisa la consola.")
    }
  }

  // Cargar Google Identity al montar o al mostrar login
  useEffect(() => {
    if (!CLIENT_ID || typeof window === "undefined" || !showLogin || !googleButtonRef.current) return

    const initGoogle = () => {
      try {
        ;(window as any).google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
        })
        
        ;(window as any).google.accounts.id.renderButton(googleButtonRef.current, {
          width: 320,
          type: "standard",
          theme: "outline",
          size: "large",
        })
        
        setGoogleReady(true)
      } catch (e) {
        console.error("Google Identity init failed:", e)
      }
    }

    if (!(window as any).google) {
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.onload = initGoogle
      document.head.appendChild(script)
    } else {
      initGoogle()
    }
  }, [CLIENT_ID, showLogin])


  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-4 lg:p-8 font-sans">
      
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-indigo-200 rounded-full blur-[100px] opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-emerald-200 rounded-full blur-[100px] opacity-40 animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column - Landing Presentation */}
        <div className="space-y-8 animate-in slide-in-from-left-8 duration-1000 fade-in">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm shadow-sm border border-blue-200">
              <Sparkles className="h-4 w-4" />
              <span>Plataforma Docente Inteligente</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Diseña con <br/>
              <span className="text-blue-600">Sesión </span>
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-2xl shadow-lg shadow-indigo-600/30">+</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Genera sesiones de aprendizaje de Matemática alineadas al CNEB en segundos. Adapta contextos, criterios y secuencias didácticas con Inteligencia Artificial.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex gap-4 items-start p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">CNEB Integrado</h3>
                <p className="text-sm text-slate-500 mt-1">Competencias y capacidades oficiales pre-cargadas.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Contexto Local</h3>
                <p className="text-sm text-slate-500 mt-1">Adaptación automática a la realidad de tus estudiantes.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">IA Generativa</h3>
                <p className="text-sm text-slate-500 mt-1">Estructura, secuencias y rúbricas creadas en segundos.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Todo en Uno</h3>
                <p className="text-sm text-slate-500 mt-1">Exporta tus sesiones e historial en un solo lugar.</p>
              </div>
            </div>
          </div>
          
          {!showLogin && (
            <div className="pt-4">
              <Button 
                onClick={() => setShowLogin(true)}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 rounded-xl text-lg font-bold shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                Comenzar ahora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Login Card */}
        <div className="relative flex justify-center lg:justify-end">
          {showLogin ? (
            <div className="w-full max-w-md animate-in slide-in-from-right-8 fade-in duration-700">
              <Card className="bg-white/80 backdrop-blur-xl border-slate-200 shadow-2xl rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>
                <CardHeader className="text-center pt-10 pb-6">
                  <div className="mx-auto bg-blue-50 w-20 h-20 flex items-center justify-center rounded-full mb-4 shadow-inner border border-blue-100">
                    <Brain className="h-10 w-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold text-slate-800">Acceso Docente</CardTitle>
                  <CardDescription className="text-base text-slate-500 mt-2">
                    Inicia sesión de forma segura para guardar y gestionar tus sesiones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pb-10">
                  <div
                    ref={googleButtonRef}
                    className="flex justify-center min-h-[50px]"
                  />

                  {!googleReady && CLIENT_ID && (
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                      Conectando con Google...
                    </div>
                  )}
                  
                  {!CLIENT_ID && (
                    <p className="text-xs text-red-600 text-center font-medium bg-red-50 p-3 rounded-lg">
                      ⚠️ NEXT_PUBLIC_GOOGLE_CLIENT_ID no configurado
                    </p>
                  )}
                </CardContent>
                <div className="bg-slate-50 py-4 text-center border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold">
                    Protegido por Google Identity Services
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            <div className="hidden lg:flex justify-center w-full max-w-md relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-blue-100 to-indigo-50 rounded-3xl border-8 border-white shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center">
                <Zap className="h-24 w-24 text-blue-500 mb-6 drop-shadow-md" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Tu tiempo es valioso</h3>
                <p className="text-slate-600">Automatiza la planificación y concéntrate en enseñar. Haz clic en "Comenzar ahora" para acceder.</p>
                
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-400 rounded-full blur-2xl opacity-40"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500 rounded-full blur-2xl opacity-40"></div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
