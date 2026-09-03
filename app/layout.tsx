import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import GoogleAnalytics from "./components/GoogleAnalytics"
import MicrosoftClarity from "./components/MicrosoftClarity"
import AvisoCookies from "./components/AvisoCookies"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

export const metadata: Metadata = {
  title: {
    default: "JP Abrahão | Sistemas, Automação com IA e Marketing para Pequenas e Médias Empresas",
    template: "%s | JP Abrahão",
  },
  description: "Sistemas internos, automação de processos com IA e marketing de conteúdo para empresas que querem reduzir custo sem contratar mais gente. Diagnóstico gratuito.",
  openGraph: {
    title: "JP Abrahão",
    description: "Sua empresa não precisa de uma software house. Precisa de resultado.",
    url: "https://jpabrahao.com.br",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        {children}
        <GoogleAnalytics />
        <MicrosoftClarity />
        <AvisoCookies />
      </body>
    </html>
  )
}
