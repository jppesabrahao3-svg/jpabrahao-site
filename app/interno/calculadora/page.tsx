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
  { key: "automacao", label: "Automação com IA" },
  { key: "marketing", label: "Marketing com IA" },
  { key: "site",      label: "Site institucional" },
]

const PRESETS: Record<"sistemas" | "automacao" | "site", { simples: number; medio: number; complexo: number }> = {
  site:      { simples: 25, medio: 40, complexo: 60 },
  sistemas:  { simples: 50, medio: 80, complexo: 125 },
  automacao: { simples: 27, medio: 47, complexo: 70 },
}

const RETENTOR_CONFIG: Record<"sistemas" | "automacao" | "site", { sugestao: number; toggleLabel: string; campoLabel: string; resultLabel: string }> = {
  sistemas:  { sugestao: 400, toggleLabel: "Incluir retentor mensal de ajuste?", campoLabel: "Valor do retentor mensal", resultLabel: "retentor mensal de" },
  automacao: { sugestao: 300, toggleLabel: "Incluir retentor mensal de ajuste?", campoLabel: "Valor do retentor mensal", resultLabel: "retentor mensal de" },
  site:      { sugestao: 150, toggleLabel: "Incluir mensalidade de manutenção?", campoLabel: "Valor da mensalidade", resultLabel: "mensalidade de" },
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
  const titleFont = { fontFamily: "var(--font-inter), sans-serif" }

  const [service, setService] = useState<Service>("sistemas")
  const [taxaBase, setTaxaBase] = useState(180)
  const [horas, setHoras] = useState(80)
  const [urgente, setUrgente] = useState(false)
  const [retentor, setRetentor] = useState(false)
  const [valorRetentor, setValorRetentor] = useState(400)
  const [posts, setPosts] = useState(8)

  const [descricaoIA, setDescricaoIA] = useState("")
  const [refinandoIA, setRefinandoIA] = useState(false)
  const [erroIA, setErroIA] = useState("")
  const [sugestaoIA, setSugestaoIA] = useState<{ horas: number; complexidade: string; justificativa: string } | null>(null)

  useEffect(() => {
    if (service === "sistemas" || service === "automacao" || service === "site") {
      setHoras(PRESETS[service].medio)
      setValorRetentor(RETENTOR_CONFIG[service].sugestao)
    }
    if (service === "marketing") {
      setRetentor(false)
    }
    setSugestaoIA(null)
    setErroIA("")
  }, [service])

  async function refinarComIA() {
    if (!descricaoIA.trim() || refinandoIA) return
    setRefinandoIA(true)
    setErroIA("")
    try {
      const servicoLabel = SERVICES.find((s) => s.key === service)?.label ?? service
      const res = await fetch("/api/refinar-orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: descricaoIA, servico: servicoLabel }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Não foi possível refinar a estimativa.")
      }
      setHoras(data.horasSugeridas)
      setSugestaoIA({ horas: data.horasSugeridas, complexidade: data.complexidade, justificativa: data.justificativa })
    } catch (err) {
      setErroIA(err instanceof Error ? err.message : "Não foi possível refinar a estimativa.")
    } finally {
      setRefinandoIA(false)
    }
  }

  const isMarketing = service === "marketing"
  const showRetentor = service === "sistemas" || service === "automacao" || service === "site"

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
          ⚠ Calculadora interna, uso pessoal, não é pública
        </div>

        <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 32 }}>

          <div>
            <h1 style={{ ...titleFont, fontWeight: 700, fontSize: 26, letterSpacing: "-0.02em", marginBottom: 8 }}>Calculadora de orçamento</h1>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>Estimativa rápida por serviço. Não grava nada, só calcula na hora.</p>
          </div>

          {/* SERVIÇO */}
          <div>
            <span style={label}>Serviço</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
              {SERVICES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setService(s.key)}
                  style={{
                    ...titleFont, fontSize: 13, fontWeight: 700, padding: "12px 10px", borderRadius: 8, cursor: "pointer",
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
              {/* REFINAMENTO VIA IA */}
              <div>
                <span style={label}>Descreva o que o cliente pediu (cole aqui o resumo do diagnóstico)</span>
                <textarea
                  value={descricaoIA}
                  onChange={(e) => setDescricaoIA(e.target.value)}
                  rows={4}
                  placeholder="Ex: cliente quer um sistema com dashboard, cadastro de produtos e integração com WhatsApp..."
                  style={{
                    width: "100%", ...fieldBox, padding: "10px 14px", color: C.text, fontSize: 14,
                    outline: "none", resize: "vertical" as const, fontFamily: "inherit", marginBottom: 10,
                  }}
                />
                <button
                  type="button"
                  onClick={refinarComIA}
                  disabled={!descricaoIA.trim() || refinandoIA}
                  style={{
                    ...titleFont, fontSize: 13, fontWeight: 700, padding: "10px 16px", borderRadius: 8,
                    cursor: !descricaoIA.trim() || refinandoIA ? "not-allowed" : "pointer",
                    border: `1px solid ${C.green}`, backgroundColor: C.greenFaint, color: C.green,
                    opacity: !descricaoIA.trim() || refinandoIA ? 0.6 : 1,
                  }}
                >
                  {refinandoIA ? "Refinando..." : "Refinar estimativa com IA"}
                </button>
                {erroIA && (
                  <div style={{ fontSize: 12.5, color: "#C2544A", marginTop: 10, lineHeight: 1.5 }}>{erroIA}</div>
                )}
              </div>

              {/* HORAS */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <span style={{ ...label, marginBottom: 0 }}>Horas estimadas</span>
                  <span style={{ ...titleFont, color: C.green, fontWeight: 700, fontSize: 16 }}>{horas}h</span>
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
                {sugestaoIA && (
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 10, lineHeight: 1.5 }}>
                    <span style={{ color: C.green, fontWeight: 600 }}>Sugestão da IA ({sugestaoIA.complexidade}):</span> {sugestaoIA.justificativa}
                  </div>
                )}
              </div>

              {/* URGENTE */}
              <Toggle checked={urgente} onChange={setUrgente} label="Urgente? (+20% no preço final)" />

              {/* RETENTOR */}
              {showRetentor && (
                <div>
                  <Toggle checked={retentor} onChange={setRetentor} label={RETENTOR_CONFIG[service as "sistemas" | "automacao" | "site"].toggleLabel} />
                  {retentor && (
                    <div style={{ marginTop: 14 }}>
                      <span style={label}>{RETENTOR_CONFIG[service as "sistemas" | "automacao" | "site"].campoLabel}</span>
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
                <span style={{ ...label, marginBottom: 0 }}>Posts por mês</span>
                <span style={{ ...titleFont, color: C.green, fontWeight: 700, fontSize: 16 }}>{posts}</span>
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
                  <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontWeight: 600, marginBottom: 6 }}>Preço estimado</div>
                  <div style={{ ...titleFont, fontWeight: 700, fontSize: "clamp(26px, 4vw, 36px)", color: C.text, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    {formatBRL(precoBase)} <span style={{ color: C.muted, fontWeight: 500, fontSize: "0.55em" }}>a</span> {formatBRL(precoTeto)}
                  </div>
                </div>

                {retentor && showRetentor && (
                  <div style={{ fontSize: 15, color: C.text }}>
                    + {RETENTOR_CONFIG[service as "sistemas" | "automacao" | "site"].resultLabel} <span style={{ color: C.green, fontWeight: 700 }}>{formatBRL(valorRetentor)}</span>
                  </div>
                )}

                <div>
                  <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontWeight: 600, marginBottom: 6 }}>Prazo estimado</div>
                  <div style={{ ...titleFont, fontWeight: 700, fontSize: 24, color: C.green }}>{prazoSemanas} semana{prazoSemanas > 1 ? "s" : ""}</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontWeight: 600, marginBottom: 6 }}>Setup</div>
                  <div style={{ ...titleFont, fontWeight: 700, fontSize: "clamp(26px, 4vw, 36px)", color: C.text, letterSpacing: "-0.02em" }}>{formatBRL(setup)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontWeight: 600, marginBottom: 6 }}>Mensalidade</div>
                  <div style={{ ...titleFont, fontWeight: 700, fontSize: "clamp(26px, 4vw, 36px)", color: C.green, letterSpacing: "-0.02em" }}>{formatBRL(mensalidade)}</div>
                </div>
                <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.7 }}>Prazo de início: recorrente, a partir da próxima semana útil.</div>
              </>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
