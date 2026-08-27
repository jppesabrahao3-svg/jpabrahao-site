import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gestor: demonstração",
  description: "Demonstração do app Gestor de finanças pessoais e MEI, com dados fictícios.",
}

export default function GestorDemoIndexPage() {
  redirect("/demo/gestor/painel")
}
