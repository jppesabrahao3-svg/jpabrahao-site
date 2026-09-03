import type { Metadata } from "next"
import { gestorPessoalDemoData } from "../../../lib/casesData"
import GestorDemoPainel from "../../../components/GestorDemoPainel"

export const metadata: Metadata = {
  title: "Painel do Gestor",
  description: "Entradas, saídas, conciliação bancária e termômetro do teto MEI em uma demonstração do Gestor com dados fictícios.",
  alternates: {
    canonical: "/demo/gestor/painel",
  },
}

export default async function PainelDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ ctx?: string }>
}) {
  const { ctx } = await searchParams
  const modo = ctx === "pessoal" || ctx === "negocio" ? ctx : ""

  return <GestorDemoPainel data={gestorPessoalDemoData} ctx={modo} />
}
