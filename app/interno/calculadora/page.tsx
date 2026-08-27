"use client"

import { useEffect, useState } from "react"

const C = {
  bg:         "#0C1009",
  surface:    "#131A0F",
  card:       "#172014",
  border:     "#1E2E18",
  green:      "#2FA36B",
  greenDim:   "#1A5C3C",
  greenFaint: "#0D2318",
  text:       "#E8EDE6",
  muted:      "#9DB096",
  amber:      "#E0A93A",
  amberFaint: "#2E230D",
} as const

type Service = "sistemas" | "automacao" | "marketing" | "site"

const SERVICES: { key: Service; label: string }[] = [
  { key: "sistemas",  label: "Sistemas internos" },
  { key: "automacao", label: "Automacao com IA" },
  { key: "marketing", label: "Marketing com IA" },
  { key: "site",      label: "Site institucional" },
]

const PRESETS: Record<"sistemas" | "automacao" | "site", { simples: number; medio: number; complexo: number }> = {
  site:      { simples: 25, medio: 40, complexo: 60 },
  sistemas:  { simples: 50, medio: 80, complexo: 125 },
  automacao: { simples: 27, medio: 47, complexo: 70 },
}

const RETENTOR_SUGESTAO: Record<"sistemas" | "automacao", number> = {
  sistemas: 400,
  automacao: 300,
}

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", padding: 0 }}
    >
      <span
        style={{
          width: 40, height: 22, borderRadius: 11, position: "relative",
          backgroundColor: checked ? C.green : C.border,
          transition: "background-color 0.2s ease", flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute", top: 2, left: checked ? 20 : 2, width: 18, height: 18, borderRadius: "50%",
            backgroundColor: C.text, transition: "left 0.2s ease",
          }}
        />
      </span>
      <span style={{ fontSize: 15, color: C.text, lineHeight: 1.4, textAlign: "left" as const }}>{label}</span>
    </button>
  )
}

export default function CalculadoraInternaPage() {
  const font = { fontFamily: "var(--font-inter), system-ui, sans-serif" }
  const syne = { fontFamily: "var(--font-syne), sans-serif" }

  const [service, setService] = useState<Service>("sistemas")
  const [taxaBase, setTaxaBase] = useState(180)
  const [horas, setHoras] = useState(80)
  const [urgente, setUrgente] = useState(false)
  const [retentor, setRetentor] = useState(false)
  const [valorRetentor, setValorRetentor] = useState(400)
  const [posts, setPosts] = useState(8)

  useEffect(() => {
    if (service === "sistemas" || service === "automacao" || service === "site") {
      setHoras(PRESETS[service].medio)
    }
    if (service === "sistemas" || service === "automacao") {
      setValorRetentor(RETENTOR_SUGESTAO[service])
    }
    if (service === "site" || service === "marketing") {
      setRetentor(false)
    }
  }, [service])

  const isMarketing = service === "marketing"
  const showRetentor = service === "sistemas" || service === "automacao"

  const precoBase = horas * taxaBase
  const precoFinal = urgente ? precoBase * 1.2 : precoBase
  const precoTeto = precoFinal * 1.15
  const prazoSemanas = Math.max(2, Math.ceil(horas / 15))

  const setup = 700 + posts * 40
  const mensalidade = 1000 + posts * 70

  const label = { fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 10, display: "block" as const }
  const fieldBox = { border: `1px solid ${C.border}`, borderRadius: 8, backgroundColor: C.bg }

  return (
    <main style={{ ...font, backgroundColor: C.bg, color: C.text, minHeight: "100vh", padding: "56px 20px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: C.amberFaint, border: `1px solid ${C.amber}`, color: C.amber, borderRadius: 999, padding: "8px 16px", fontSize: 13, fontWeight: 600, marginBottom: 32 }}>
          ⚠ Calculadora interna, uso pessoal, nao e publica
        </div>

        <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 32 }}>

          <div>
            <h1 style={{ ...syne, fontWeight: 800, fontSize: 26, letterSpacing: "-0.02em", marginBottom: 8 }}>Calculadora de orcamento</h1>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>Estimativa rapida por servico. Nao grava nada, so calcula na hora.</p>
          </div>

          {/* SERVICO */}
          <div>
            <span style={label}>Servico</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
              {SERVICES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setService(s.key)}
                  style={{
                    ...syne, fontSize: 13, fontWeight: 700, padding: "12px 10px", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${service === s.key ? C.green : C.border}`,
                    backgroundColor: service === s.key ? C.greenFaint : C.bg,
                    color: service === s.key ? C.green : C.muted,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAXA BASE */}
          <div>
            <span style={label}>Taxa-base (R$/hora)</span>
            <div style={{ ...fieldBox, display: "flex", alignItems: "center", gap: 6, padding: "10px 14px" }}>
              <span style={{ color: C.muted, fontSize: 14 }}>R$</span>
              <input
                type="number"
                min={0}
                step={10}
                value={taxaBase}
                onChange={(e) => setTaxaBase(Math.max(0, Number(e.target.value) || 0))}
                style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 15, fontWeight: 600 }}
              />
            </div>
          </div>

          {!isMarketing && (
            <>
              {/* HORAS */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <span style={{ ...label, marginBottom: 0 }}>Horas estimadas</span>
                  <span style={{ ...syne, color: C.green, fontWeight: 700, fontSize: 16 }}>{horas}h</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={200}
                  step={1}
                  value={horas}
                  onChange={(e) => setHoras(Number(e.target.value))}
                  style={{ width: "100%", accentColor: C.green, marginBottom: 12 }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  {(["simples", "medio", "complexo"] as const).map((nivel) => (
                    <button
                      key={nivel}
                      type="button"
                      onClick={() => setHoras(PRESETS[service as "sistemas" | "automacao" | "site"][nivel])}
                      style={{
                        flex: 1, fontSize: 12, fontWeight: 600, padding: "8px 6px", borderRadius: 6, cursor: "pointer",
                        border: `1px solid ${C.border}`, backgroundColor: C.bg, color: C.muted, textTransform: "capitalize" as const,
                      }}
                    >
                      {nivel}
                    </button>
                  ))}
                </div>
              </div>

              {/* URGENTE */}
              <Toggle checked={urgente} onChange={setUrgente} label="Urgente? (+20% no preco final)" />

              {/* RETENTOR */}
              {showRetentor && (
                <div>
                  <Toggle checked={retentor} onChange={setRetentor} label="Incluir retentor mensal de ajuste?" />
                  {retentor && (
                    <div style={{ marginTop: 14 }}>
                      <span style={label}>Valor do retentor mensal</span>
                      <div style={{ ...fieldBox, display: "flex", alignItems: "center", gap: 6, padding: "10px 14px" }}>
                        <span style={{ color: C.muted, fontSize: 14 }}>R$</span>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          value={valorRetentor}
                          onChange={(e) => setValorRetentor(Math.max(0, Number(e.target.value) || 0))}
                          style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 15, fontWeight: 600 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {isMarketing && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ ...label, marginBottom: 0 }}>Posts por mes</span>
                <span style={{ ...syne, color: C.green, fontWeight: 700, fontSize: 16 }}>{posts}</span>
              </div>
              <input
                type="range"
                min={4}
                max={20}
                step={1}
                value={posts}
                onChange={(e) => setPosts(Number(e.target.value))}
                style={{ width: "100%", accentColor: C.green }}
              />
            </div>
          )}

          {/* RESULTADO */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 28, display: "flex", flexDirection: "column", gap: 20 }}>
            {!isMarketing ? (
              <>
                <div>
                  <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontWeight: 600, marginBottom: 6 }}>Preco estimado</div>
                  <div style={{ ...syne, fontWeight: 800, fontSize: "clamp(26px, 4vw, 36px)", color: C.text, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    {formatBRL(precoBase)} <span style={{ color: C.muted, fontWeight: 500, fontSize: "0.55em" }}>a</span> {formatBRL(precoTeto)}
                  </div>
                </div>

                {retentor && showRetentor && (
                  <div style={{ fontSize: 15, color: C.text }}>
                    + retentor mensal de <span style={{ color: C.green, fontWeight: 700 }}>{formatBRL(valorRetentor)}</span>
                  </div>
                )}

                <div>
                  <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontWeight: 600, marginBottom: 6 }}>Prazo estimado</div>
                  <div style={{ ...syne, fontWeight: 800, fontSize: 24, color: C.green }}>{prazoSemanas} semana{prazoSemanas > 1 ? "s" : ""}</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontWeight: 600, marginBottom: 6 }}>Setup</div>
                  <div style={{ ...syne, fontWeight: 800, fontSize: "clamp(26px, 4vw, 36px)", color: C.text, letterSpacing: "-0.02em" }}>{formatBRL(setup)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontWeight: 600, marginBottom: 6 }}>Mensalidade</div>
                  <div style={{ ...syne, fontWeight: 800, fontSize: "clamp(26px, 4vw, 36px)", color: C.green, letterSpacing: "-0.02em" }}>{formatBRL(mensalidade)}</div>
                </div>
                <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.7 }}>Prazo de inicio: recorrente, a partir da proxima semana util.</div>
              </>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
