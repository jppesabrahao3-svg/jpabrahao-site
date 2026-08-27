import type { Metadata } from "next"

// Pagina client (useState) nao pode exportar metadata direto — precisa
// desse layout server ao lado. Nao e publica, entao fica fora do indice.
export const metadata: Metadata = {
  title: "Calculadora interna",
  description: "Ferramenta interna de orcamento, uso pessoal, nao publica.",
  robots: { index: false, follow: false },
}

export default function CalculadoraLayout({ children }: { children: React.ReactNode }) {
  return children
}
