"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Users, Sparkles } from "lucide-react"

interface LoginScreenProps {
  onLogin: (userData: { name: string; email: string }) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [googleReady, setGoogleReady] = useState(false)
  const googleButtonRef = useRef<HTMLDivElement>(null)

  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "https://eduai-auth.onrender.com"
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

  // Cargar Google Identity al montar
  useEffect(() => {
    if (!CLIENT_ID || typeof window === "undefined" || !googleButtonRef.current) return

    const initGoogle = () => {
      try {
        ;(window as any).google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
        })
        
        // Renderizar el botón de Google directamente
        ;(window as any).google.accounts.id.renderButton(googleButtonRef.current, {
          width: 300,
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
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 gradient-primary rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 gradient-secondary rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 gradient-accent rounded-full blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo y título */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="gradient-primary rounded-3xl p-6 glow-primary">
              <Brain className="h-16 w-16 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              EduAI Matemática
            </h1>
            <p className="text-muted-foreground text-balance text-lg">
              Genera sesiones de aprendizaje personalizadas
            </p>
            <div className="flex items-center justify-center gap-2 text-accent">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Potenciado por Inteligencia Artificial</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Características principales */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-effect rounded-2xl p-4 text-center space-y-3 hover:glow-primary transition-all duration-300 group">
            <BookOpen className="h-10 w-10 text-primary mx-auto group-hover:scale-110 transition-transform" />
            <p className="text-sm text-muted-foreground font-medium">Currículo Nacional</p>
          </div>
          <div className="glass-effect rounded-2xl p-4 text-center space-y-3 hover:glow-secondary transition-all duration-300 group">
            <Brain className="h-10 w-10 text-secondary mx-auto group-hover:scale-110 transition-transform" />
            <p className="text-sm text-muted-foreground font-medium">IA Educativa</p>
          </div>
          <div className="glass-effect rounded-2xl p-4 text-center space-y-3 hover:glow-accent transition-all duration-300 group">
            <Users className="h-10 w-10 text-accent mx-auto group-hover:scale-110 transition-transform" />
            <p className="text-sm text-muted-foreground font-medium">Contexto Local</p>
          </div>
        </div>

        {/* Formulario de login */}
        <Card className="glass-effect border-0 glow-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Acceso Docente</CardTitle>
            <CardDescription className="text-base">Ingresa tus datos para comenzar a generar sesiones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Button - renderizado por Google Identity */}
            <div
              ref={googleButtonRef}
              className="flex justify-center"
            />

            {!googleReady && CLIENT_ID && (
              <p className="text-xs text-yellow-600 text-center">Google está cargando...</p>
            )}
            {!CLIENT_ID && (
              <p className="text-xs text-red-600 text-center">
                ⚠️ NEXT_PUBLIC_GOOGLE_CLIENT_ID no configurado
              </p>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground/80 font-medium">
          Diseñado especialmente para docentes de Matemática de todo el Perú
        </p>
      </div>
    </div>
  )
}
