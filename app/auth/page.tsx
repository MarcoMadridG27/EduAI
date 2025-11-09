"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginScreen } from "@/components/login-screen"

export default function AuthPage() {
  const router = useRouter()

  // Si ya hay sesión activa, redirigir a home
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token")
    const user = localStorage.getItem("user")
    
    if (accessToken && user) {
      router.push("/")
    }
  }, [router])

  const handleLogin = (userData: { name: string; email: string }) => {
    localStorage.setItem("user", JSON.stringify(userData))
    router.push("/")
  }

  return <LoginScreen onLogin={handleLogin} />
}
