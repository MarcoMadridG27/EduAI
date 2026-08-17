import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Newsreader } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { LanguageProvider } from "@/lib/LanguageContext"
// @ts-ignore: Allow importing global css without type declarations
import "./globals.css"

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["500", "600"],
  display: "swap",
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: "Educa +",
  description: "Software educativo con IA para docentes de Matemática en Perú",
  generator: "v0.app",
  icons: {
    icon: "/icon-educamas.png",
    shortcut: "/icon-educamas.png",
    apple: "/icon-educamas.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable} ${newsreader.variable}`}>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${newsreader.variable} antialiased`}>
        <LanguageProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster position="top-center" richColors />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}

