import type { Metadata } from "next"

// Pagina client (useState de abas) nao pode exportar metadata direto —
// precisa desse layout server ao lado.
export const metadata: Metadata = {
  title: "Hub de Marketing: demonstração",
  description: "Demonstração interativa do Hub de Marketing, com dashboard, kanban de tarefas, parcerias e calendário, usando dados fictícios.",
}

export default function HubMarketingLayout({ children }: { children: React.ReactNode }) {
  return children
}
