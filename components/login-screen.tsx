"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Users, Sparkles } from "lucide-react"

interface LoginScreenProps {
  onLogin: (userData: { name: string; email: string }) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && name) {
      onLogin({ name, email })
    }
  }

  const handleGoogleLogin = () => {
    // Simulamos login con Google
    onLogin({
      name: "Prof. María González",
      email: "maria.gonzalez@edu.pe",
    })
  }

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
              Genera sesiones de aprendizaje personalizadas para Virú
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
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full glass-effect border-primary/20 hover:glow-primary hover:border-primary/40 transition-all duration-300 h-12 bg-transparent"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground font-medium">O con tu correo</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="correo@edu.pe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 glass-effect border-border/50 focus:border-primary focus:glow-primary transition-all duration-300"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 gradient-primary glow-primary hover:scale-105 transition-all duration-300 font-semibold text-lg"
              >
                Acceder
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground/80 font-medium">
          Diseñado especialmente para docentes de Matemática en Virú, La Libertad
        </p>
      </div>
    </div>
  )
}
