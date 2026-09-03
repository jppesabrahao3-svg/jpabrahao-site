import type { Metadata } from "next"

// Pagina client (abas Parcelas/Faturas) nao pode exportar metadata direto —
// precisa desse layout server ao lado.
export const metadata: Metadata = {
  title: "Compromissos do Gestor",
  description: "Parcelamentos, assinaturas e faturas de cartão em uma demonstração do Gestor com dados fictícios.",
  alternates: {
    canonical: "/demo/gestor/compromissos",
  },
}

export default function CompromissosLayout({ children }: { children: React.ReactNode }) {
  return children
}
