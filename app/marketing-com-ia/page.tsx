import Link from "next/link"
import type { Metadata } from "next"
import { getMoodboardItems } from "../lib/marketingGallery"
import MarketingComIASection from "../components/MarketingComIASection"

export const metadata: Metadata = {
  title: "Marketing com IA: resultados",
  description: "Veja como planejamento, arte e legenda gerados com inteligência artificial, mais relatório de métrica, substituem uma agência de marketing tradicional.",
}

const C = {
  bg:         "#0C1009",
  border:     "#1E2E18",
  green:      "#2FA36B",
  greenFaint: "#0D2318",
  text:       "#E8EDE6",
  muted:      "#9DB096",
} as const

export default function MarketingComIAPage() {
  const items = getMoodboardItems()

  return (
    <main style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", backgroundColor: C.bg, color: C.text, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 4px" }}>
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: C.muted, textDecoration: "none", marginBottom: 22 }}
        >
          <span aria-hidden>←</span> Voltar
        </Link>

        <div style={{ marginBottom: 4 }}>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: C.green, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontWeight: 700 }}>
            Marketing com IA
          </span>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: "clamp(24px, 3.6vw, 34px)", letterSpacing: "-0.01em", color: C.text, marginTop: 8, marginBottom: 18 }}>
            Resultado de um mes de operacao
          </h1>
        </div>
      </div>

      <MarketingComIASection items={items} colors={{ bg: C.bg, border: C.border, green: C.green, muted: C.muted }} />
    </main>
  )
}
