"use client"

import { CSSProperties, useEffect, useState } from "react"
import Link from "next/link"
import { useCountUp } from "./useCountUp"

type CaseItem = { company: string; project: string; tag: string; before: string; after: string }

// Cases com pagina de demonstracao propria viram link em vez de modal.
const CASE_DEMO_LINKS: Record<string, string> = {
  "Hub de Marketing": "/demo/hub-marketing",
  "Gestor: App Financeiro": "/demo/gestor",
  "Hub Comercial": "/demo/hub-comercial",
}

type Colors = {
  bg: string
  surface: string
  card: string
  border: string
  green: string
  greenDim: string
  greenFaint: string
  text: string
  muted: string
}

/* ---------- Demo: Automacao Comercial ---------- */

function AutomacaoDemo({ colors: C }: { colors: Colors }) {
  const [target, setTarget] = useState(6)
  useEffect(() => {
    const t = setTimeout(() => setTarget(1.5), 350)
    return () => clearTimeout(t)
  }, [])
  const display = useCountUp(target, 1200)

  return (
    <div style={{ textAlign: "center" as const, padding: "12px 0 4px" }}>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
        Tempo gasto no relatorio diario
      </div>
      <div style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: 48, color: target === 6 ? C.text : C.green, letterSpacing: "-0.02em", transition: "color 0.4s ease" }}>
        {display.toFixed(1).replace(".", ",")}h
        <span style={{ fontSize: 18, fontWeight: 500, color: C.muted }}>/dia</span>
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>Antes: 6h/dia preenchendo relatorio na mao</div>
    </div>
  )
}

function CaseDemo({ colors }: { colors: Colors }) {
  return <AutomacaoDemo colors={colors} />
}

/* ---------- Section + grid + modal ---------- */

export default function CasesSection({
  cases, colors: C, wrap, label, h2,
}: {
  cases: CaseItem[]
  colors: Colors
  wrap: CSSProperties
  label: CSSProperties
  h2: CSSProperties
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [openIndex])

  const active = openIndex !== null ? cases[openIndex] : null

  return (
    <section
      style={{
        backgroundColor: C.surface,
        backgroundImage: `radial-gradient(circle at 15% 0%, ${C.greenFaint} 0%, transparent 55%)`,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={{ ...wrap, padding: "112px 24px" }}>
        <div style={{ marginBottom: 56 }}>
          <span style={label}>Cases</span>
          <h2 style={h2}>Problemas resolvidos</h2>
        </div>

        <div className="cases-grid">
          {cases.map((c, i) => {
            const demoHref = CASE_DEMO_LINKS[c.project]
            const cardContent = (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: "0.04em" }}>{c.company}</div>
                    <div style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, fontSize: 16, color: C.text }}>{c.project}</div>
                  </div>
                  <span style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: C.green, backgroundColor: C.greenFaint, padding: "4px 10px", borderRadius: 4, whiteSpace: "nowrap" as const }}>
                    {c.tag}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ backgroundColor: C.surface, borderRadius: 6, padding: "12px 14px", borderLeft: "3px solid #2E3E2E" }}>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6, fontWeight: 600 }}>Antes</div>
                    <div style={{ fontSize: 16, color: C.muted, lineHeight: 1.7 }}>{c.before}</div>
                  </div>
                  <div style={{ textAlign: "center" as const, color: C.green, fontSize: 18, lineHeight: 1 }}>↓</div>
                  <div style={{ backgroundColor: C.greenFaint, borderRadius: 6, padding: "12px 14px", borderLeft: `3px solid ${C.green}` }}>
                    <div style={{ fontSize: 10, color: C.green, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6, fontWeight: 600 }}>Depois</div>
                    <div style={{ fontSize: 16, color: C.text, lineHeight: 1.7 }}>{c.after}</div>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: C.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  Ver demonstracao <span aria-hidden>→</span>
                </div>
              </>
            )

            const cardStyle: CSSProperties = {
              textAlign: "left" as const, backgroundColor: C.card, border: `1px solid ${C.border}`,
              borderRadius: 8, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 20,
              font: "inherit", color: "inherit", width: "100%", textDecoration: "none",
            }

            return demoHref ? (
              <Link key={c.project} href={demoHref} className="case-card" style={cardStyle}>
                {cardContent}
              </Link>
            ) : (
              <button key={c.project} type="button" className="case-card" onClick={() => setOpenIndex(i)} style={cardStyle}>
                {cardContent}
              </button>
            )
          })}
        </div>
      </div>

      {active && (
        <div
          className="modal-overlay"
          onClick={() => setOpenIndex(null)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(4,6,3,0.72)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div
            className="modal-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 12, maxWidth: 560, width: "100%", maxHeight: "88vh", overflowY: "auto" as const, padding: "28px 28px 32px", position: "relative" as const }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Fechar"
              style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, backgroundColor: C.surface, color: C.muted, cursor: "pointer", fontSize: 18, lineHeight: 1 }}
            >
              ×
            </button>
            <div style={{ marginBottom: 4, fontSize: 11, color: C.muted, paddingRight: 40 }}>{active.company}</div>
            <div style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, fontSize: 20, color: C.text, marginBottom: 20, paddingRight: 40 }}>{active.project}</div>

            <CaseDemo colors={C} />

            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7, marginTop: 22 }}>{active.after}</p>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 12, fontStyle: "italic" as const }}>
              Demonstracao com dados ficticios, para ilustrar a capacidade tecnica.
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
