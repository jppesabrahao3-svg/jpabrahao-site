import type { Metadata } from "next"

const C = {
  bg:         "#0C1009",
  card:       "#172014",
  border:     "#1E2E18",
  green:      "#2FA36B",
  text:       "#E8EDE6",
  muted:      "#9DB096",
  red:        "#C2544A",
  redFaint:   "#2A1714",
} as const

export const metadata: Metadata = {
  title: "Área interna",
  description: "Acesso restrito, não público.",
  robots: { index: false, follow: false },
}

export default async function InternoLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const font = { fontFamily: "var(--font-inter), system-ui, sans-serif" }
  const titleFont = { fontFamily: "var(--font-inter), sans-serif" }

  return (
    <main style={{ ...font, backgroundColor: C.bg, color: C.text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 360, backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "36px 32px" }}>
        <h1 style={{ ...titleFont, fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em", marginBottom: 8 }}>Área interna</h1>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 24 }}>Acesso restrito. Digite a senha pra continuar.</p>

        <form action="/api/interno-login" method="POST" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label htmlFor="senha" style={{ fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 8, display: "block" }}>Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoFocus
              required
              style={{
                width: "100%", border: `1px solid ${C.border}`, borderRadius: 8, backgroundColor: C.bg,
                padding: "10px 14px", color: C.text, fontSize: 15, outline: "none",
              }}
            />
          </div>

          {error && (
            <div style={{ fontSize: 13, color: C.red, backgroundColor: C.redFaint, border: `1px solid ${C.red}`, borderRadius: 8, padding: "10px 12px" }}>
              Senha incorreta. Tente de novo.
            </div>
          )}

          <button
            type="submit"
            style={{
              ...titleFont, fontSize: 14, fontWeight: 700, padding: "12px 10px", borderRadius: 8, cursor: "pointer",
              border: "none", backgroundColor: C.green, color: "#0C1009", marginTop: 6,
            }}
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}
