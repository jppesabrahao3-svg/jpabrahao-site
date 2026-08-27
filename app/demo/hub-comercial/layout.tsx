import type { Metadata } from "next"

// Pagina client (modais e toggle de modal) nao pode exportar metadata direto —
// precisa desse layout server ao lado.
export const metadata: Metadata = {
  title: "Hub Comercial: demonstração",
  description: "Demonstração da Central de Decisão do Hub Comercial, com BI de vendas e painel de clientes inadimplentes, usando dados fictícios.",
}

export default function HubComercialLayout({ children }: { children: React.ReactNode }) {
  return children
}
