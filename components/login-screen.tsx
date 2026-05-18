"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface LoginScreenProps {
  onLogin: (userData: { name: string; email: string }) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [googleReady, setGoogleReady] = useState(false)
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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

  // Cargar Google Identity
  useEffect(() => {
    if (!CLIENT_ID || typeof window === "undefined" || !googleButtonRef.current) return

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
  }, [CLIENT_ID])


  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4 lg:p-8 font-sans selection:bg-primary selection:text-primary-foreground">
      
      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 left-6 z-50"
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push("/")}
          className="text-muted-foreground hover:text-foreground font-semibold flex items-center gap-2 rounded-full px-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </Button>
      </motion.div>

      {/* Background Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] opacity-50 animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md z-10 relative">
        
        {/* Animated Mascot */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.2 }}
          className="absolute -top-24 -right-8 z-20 pointer-events-none"
        >
          <motion.img 
            animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            src="/pinguinos/pinguino_celebrando.png" 
            className="w-40 h-40 object-contain drop-shadow-xl"
            alt="Pingüino saludando"
          />
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        >
          <Card className="bg-card/90 backdrop-blur-xl border-border shadow-2xl rounded-3xl overflow-hidden relative z-10">
            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
            
            <CardHeader className="text-center pt-10 pb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.6, delay: 0.4 }}
                className="mx-auto flex items-center justify-center mb-6"
              >
                <img src="/sesion_+.png" alt="Sesión + Logo" className="h-40 w-auto object-contain drop-shadow-sm" />
              </motion.div>
              
              <CardTitle className="text-3xl font-extrabold text-foreground">¡Hola de nuevo!</CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-2">
                Inicia sesión de forma segura para continuar donde lo dejaste.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 px-8 pb-10">
              <div className="flex justify-center min-h-[50px] relative">
                <div ref={googleButtonRef} className="z-10" />
                
                {!googleReady && CLIENT_ID && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground z-0">
                    <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    Conectando...
                  </div>
                )}
              </div>
              
              {!CLIENT_ID && (
                <p className="text-xs text-destructive text-center font-medium bg-destructive/10 p-3 rounded-lg">
                  ⚠️ NEXT_PUBLIC_GOOGLE_CLIENT_ID no configurado
                </p>
              )}
            </CardContent>
            
            <div className="bg-muted/50 py-4 text-center border-t border-border flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground font-semibold">
                Protegido por Google Identity Services
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
