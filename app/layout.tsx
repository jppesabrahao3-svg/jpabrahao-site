import type { Metadata } from "next"
import { Syne, Inter } from "next/font/google"
import "./globals.css"

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" })
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
    <html lang="pt-BR" className={`${syne.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
