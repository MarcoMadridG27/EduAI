import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "sonner"
// @ts-ignore: Allow importing global css without type declarations
import "./globals.css"

export const metadata: Metadata = {
  title: "Sesion +",
  description: "Software educativo con IA para docentes de Matemática en Perú",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}
