"use client"

import { CSSProperties, useEffect, useState } from "react"
import Link from "next/link"
import { AlertTriangle, Clock, Zap } from "lucide-react"
import { useCountUp } from "./useCountUp"

type CaseItem = { company: string; project: string; tag: string; before: string; after: string }

// Cases com página de demonstração própria viram link em vez de modal.
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

/* ---------- Demo: Automação Comercial ---------- */

const RESUMO_AUTOMATICO =
  "Bom dia! Resumo de ontem: faturamento R$ 49.200 (+8% vs média do mês). Destaque: Rede Central cresceu 12%. Atenção: Comercial Zona Sul segue em queda pelo 3º mês. Relatório completo no Hub Comercial."

const PASSOS_ANTES = [
  { texto: "Abrir as 3 planilhas do dia", minutos: 20 },
  { texto: "Copiar dados de vendas de cada rede", minutos: 90 },
  { texto: "Cruzar os números e conferir divergências", minutos: 105 },
  { texto: "Montar o texto do resumo manualmente", minutos: 75 },
  { texto: "Revisar antes de enviar, torcendo pra não ter erro", minutos: 45 },
  { texto: "Enviar pro grupo e responder dúvida de quem não entendeu", minutos: 25 },
]

const TOTAL_MINUTOS_ANTES = PASSOS_ANTES.reduce((soma, p) => soma + p.minutos, 0)

function formatDuracao(minutos: number) {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h${m}`
}

const AMBER = "#D9A03C"
const AMBER_FAINT = "#2E230D"
const AMBER_DIM = "#5C481E"
const ANTES_BG = "#1D1712"
const ANTES_BORDER = "#463A26"
const ANTES_ITEM_BG = "#2A2015"

const ALERTA_TEXTO = "Atenção: Comercial Zona Sul segue em queda pelo 3º mês."
const ALERTA_INICIO = RESUMO_AUTOMATICO.indexOf(ALERTA_TEXTO)
const ALERTA_FIM = ALERTA_INICIO + ALERTA_TEXTO.length

// Custo total (salário + encargos CLT) de um Coordenador Comercial no Rio de Janeiro,
// salário nominal ~R$8.200 (R$/h).
const TAXA_HORA = 85
const DIAS_UTEIS_MES = 22
const HORAS_ANTES_DIA = 6
const HORAS_DEPOIS_DIA = 1.5
const HORAS_ECONOMIZADAS_DIA = HORAS_ANTES_DIA - HORAS_DEPOIS_DIA
const HORAS_ECONOMIZADAS_MES = HORAS_ECONOMIZADAS_DIA * DIAS_UTEIS_MES
const VALOR_ECONOMIZADO_MES = HORAS_ECONOMIZADAS_MES * TAXA_HORA
const VALOR_ECONOMIZADO_ANO = VALOR_ECONOMIZADO_MES * 12

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex"]
const BARRA_ALTURA_MAX = 46

function formatBRLInt(v: number) {
  return `R$ ${Math.round(v).toLocaleString("pt-BR")}`
}

function useTypewriter(text: string, speed: number, startDelay: number) {
  const [output, setOutput] = useState("")

  useEffect(() => {
    let i = 0
    let interval: ReturnType<typeof setInterval> | null = null

    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        i += 1
        setOutput(text.slice(0, i))
        if (i >= text.length && interval) {
          clearInterval(interval)
          interval = null
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(startTimer)
      if (interval) clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return output
}

const COUNTER_DURATION = 1500
const COUNTER_START_DELAY = 250
const BADGE_DELAY = COUNTER_START_DELAY + COUNTER_DURATION + 150
const MONEY_START_DELAY = BADGE_DELAY
const MONEY_DURATION = 1200
const WEEK_START_DELAY = BADGE_DELAY + 300
const TYPING_START_DELAY = COUNTER_START_DELAY + COUNTER_DURATION + 300
const TYPING_SPEED = 16

function AutomacaoComercialDemo({ colors: C }: { colors: Colors }) {
  const [target, setTarget] = useState(6)
  const [showBadge, setShowBadge] = useState(false)
  const [moneyStarted, setMoneyStarted] = useState(false)
  const [weekVisible, setWeekVisible] = useState(false)

  useEffect(() => {
    const startAnim = setTimeout(() => setTarget(1.5), COUNTER_START_DELAY)
    const badgeTimer = setTimeout(() => setShowBadge(true), BADGE_DELAY)
    const moneyTimer = setTimeout(() => setMoneyStarted(true), MONEY_START_DELAY)
    const weekTimer = setTimeout(() => setWeekVisible(true), WEEK_START_DELAY)
    return () => {
      clearTimeout(startAnim)
      clearTimeout(badgeTimer)
      clearTimeout(moneyTimer)
      clearTimeout(weekTimer)
    }
  }, [])

  const display = useCountUp(target, COUNTER_DURATION)
  const horasMes = useCountUp(moneyStarted ? HORAS_ECONOMIZADAS_MES : 0, MONEY_DURATION)
  const valorMes = useCountUp(moneyStarted ? VALOR_ECONOMIZADO_MES : 0, MONEY_DURATION)
  const valorAno = useCountUp(moneyStarted ? VALOR_ECONOMIZADO_ANO : 0, MONEY_DURATION)
  const typed = useTypewriter(RESUMO_AUTOMATICO, TYPING_SPEED, TYPING_START_DELAY)
  const digitando = typed.length > 0 && typed.length < RESUMO_AUTOMATICO.length

  const alertaVisivel = typed.length > ALERTA_INICIO ? typed.slice(ALERTA_INICIO, Math.min(typed.length, ALERTA_FIM)) : ""
  const antesDoAlerta = typed.slice(0, Math.min(typed.length, ALERTA_INICIO))
  const depoisDoAlerta = typed.length > ALERTA_FIM ? typed.slice(ALERTA_FIM) : ""

  return (
    <div>
      {/* BLOCO DE IMPACTO - contador, badge e valor em dinheiro unificados */}
      <div style={{ backgroundColor: C.greenFaint, border: `1px solid ${C.greenDim}`, borderRadius: 12, padding: "22px 24px 18px" }}>
        <div style={{ textAlign: "center" as const }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 700, fontSize: 48, color: target === 6 ? C.text : C.green, letterSpacing: "-0.02em", transition: "color 0.4s ease" }}>
              {display.toFixed(1).replace(".", ",")}h
            </div>
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 700, color: "#0C1009",
                backgroundColor: C.green, borderRadius: 999,
                padding: "4px 10px", opacity: showBadge ? 1 : 0,
                transform: showBadge ? "translateY(0) scale(1)" : "translateY(4px) scale(0.85)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              -75%
            </span>
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>
            Tempo diário gasto montando o relatório comercial
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.greenDim}` }}>
          <div style={{ textAlign: "center" as const }}>
            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 700, fontSize: 22, color: C.green }}>
              {Math.round(horasMes)}h
            </div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4, lineHeight: 1.4 }}>Horas livres por mês</div>
          </div>
          <div style={{ textAlign: "center" as const, borderLeft: `1px solid ${C.greenDim}`, borderRight: `1px solid ${C.greenDim}` }}>
            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 700, fontSize: 22, color: C.green }}>
              {formatBRLInt(valorMes)}
            </div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4, lineHeight: 1.4 }}>Valor por mês</div>
          </div>
          <div style={{ textAlign: "center" as const }}>
            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 700, fontSize: 22, color: C.green }}>
              {formatBRLInt(valorAno)}
            </div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4, lineHeight: 1.4 }}>Valor por ano</div>
          </div>
        </div>

        <div style={{ fontSize: 10, color: C.muted, textAlign: "center" as const, lineHeight: 1.5, marginTop: 12 }}>
          Baseado no custo total (salário + encargos) de um coordenador comercial no Rio de Janeiro, valor equivalente ao tempo de uma pessoa recuperado para outras tarefas.
        </div>
      </div>

      {/* LINHA 1 - ANTES, largura total, com peso visual (o "vilão") */}
      <div style={{ backgroundColor: ANTES_BG, border: `1px solid ${ANTES_BORDER}`, borderRadius: 12, padding: "20px 22px 18px", marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Clock size={24} color={AMBER} strokeWidth={1.8} />
          <span style={{ fontSize: 15, fontWeight: 800, color: AMBER, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Antes</span>
        </div>

        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {PASSOS_ANTES.map((passo) => (
            <li
              key={passo.texto}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                backgroundColor: ANTES_ITEM_BG, border: `1px solid ${AMBER_DIM}`, borderRadius: 7,
                padding: "10px 14px",
              }}
            >
              <span style={{ fontSize: 13, color: C.text, lineHeight: 1.4 }}>{passo.texto}</span>
              <span
                style={{
                  flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#0C1009", backgroundColor: AMBER,
                  borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap" as const,
                }}
              >
                {formatDuracao(passo.minutos)}
              </span>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${AMBER_DIM}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Total</span>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 20, fontWeight: 700, color: AMBER }}>
            {formatDuracao(TOTAL_MINUTOS_ANTES)}
          </span>
        </div>
      </div>

      {/* LINHA 2 - DEPOIS e linha do tempo semanal, lado a lado, leves (a "resolução") */}
      <div className="automacao-secundario" style={{ marginTop: 18 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Zap size={14} color={C.green} strokeWidth={2} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Depois</span>
          </div>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: AMBER,
              backgroundColor: AMBER_FAINT, border: `1px solid ${AMBER_DIM}`, borderRadius: 6,
              padding: "5px 7px", marginBottom: 6, lineHeight: 1.35,
            }}
          >
            <AlertTriangle size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
            Além do resumo, o sistema avisa o que merece atenção.
          </div>
          <div
            style={{
              backgroundColor: C.greenFaint, border: `1px solid ${C.greenDim}`, borderRadius: 8,
              padding: "8px 10px", fontSize: 12, color: C.text, lineHeight: 1.55, minHeight: 150,
            }}
          >
            {antesDoAlerta}
            {alertaVisivel && (
              <span style={{ backgroundColor: AMBER_FAINT, color: AMBER, borderRadius: 3, padding: "0 2px", fontWeight: 600 }}>
                {alertaVisivel}
              </span>
            )}
            {depoisDoAlerta}
            {digitando && <span className="typing-cursor">|</span>}
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>
            Gerado e enviado automaticamente às 07h00, todos os dias
          </div>
        </div>

        {/* linha do tempo semanal (compacta) */}
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.text, marginBottom: 8 }}>Isso se repete toda semana</div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: C.muted }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, backgroundColor: AMBER, display: "inline-block" }} />
              6h antes
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: C.muted }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, backgroundColor: C.green, display: "inline-block" }} />
              1,5h depois
            </span>
          </div>

          <div
            style={{
              display: "flex", justifyContent: "space-between", gap: 6,
              backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: "12px 10px 8px",
            }}
          >
            {DIAS_SEMANA.map((dia, i) => {
              const delay = i * 0.1
              return (
                <div key={dia} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: BARRA_ALTURA_MAX }}>
                    <div
                      title={`${HORAS_ANTES_DIA}h antes`}
                      style={{
                        width: 8, borderRadius: "3px 3px 0 0", backgroundColor: AMBER,
                        height: weekVisible ? BARRA_ALTURA_MAX : 0,
                        transition: `height 0.5s ease ${delay}s`,
                      }}
                    />
                    <div
                      title={`${HORAS_DEPOIS_DIA}h depois`}
                      style={{
                        width: 8, borderRadius: "3px 3px 0 0", backgroundColor: C.green,
                        height: weekVisible ? (HORAS_DEPOIS_DIA / HORAS_ANTES_DIA) * BARRA_ALTURA_MAX : 0,
                        transition: `height 0.5s ease ${delay + 0.05}s`,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 9.5, color: C.muted }}>{dia}</div>
                </div>
              )
            })}
          </div>

          <div style={{ fontSize: 10.5, color: C.muted, marginTop: 8, lineHeight: 1.55 }}>
            4,5h livres por dia, todo dia útil. Isso é quase um dia inteiro de trabalho (22,5h) recuperado por semana.
          </div>
        </div>
      </div>
    </div>
  )
}

function CaseDemo({ colors }: { colors: Colors }) {
  return <AutomacaoComercialDemo colors={colors} />
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
                    <div style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 700, fontSize: 16, color: C.text }}>{c.project}</div>
                  </div>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: C.green, backgroundColor: C.greenFaint, padding: "4px 10px", borderRadius: 4, whiteSpace: "nowrap" as const }}>
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
                  Ver demonstração <span aria-hidden>→</span>
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
            className="modal-panel automacao-modal-scroll"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 12, maxWidth: "min(880px, 95vw)", width: "100%", maxHeight: "88vh", overflowY: "auto" as const, padding: "28px 28px 32px", position: "relative" as const }}
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
            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 700, fontSize: 20, color: C.text, marginBottom: 20, paddingRight: 40 }}>{active.project}</div>

            <CaseDemo colors={C} />

            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7, marginTop: 22 }}>{active.after}</p>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 12, fontStyle: "italic" as const }}>
              Demonstração com dados fictícios, para ilustrar a capacidade técnica.
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
