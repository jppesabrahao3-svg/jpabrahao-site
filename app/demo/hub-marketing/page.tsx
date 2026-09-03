"use client"

import { CSSProperties, useEffect, useState } from "react"
import Link from "next/link"
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { marketHubDemoData as D, TarefaCard, ParceriaCard } from "../../lib/casesData"
import { useCountUp } from "../../components/useCountUp"
import DndKanban from "../../components/DndKanban"

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

const titleFont = { fontFamily: "var(--font-inter), sans-serif" }

const TABS = ["Dashboard", "Tarefas", "Parcerias", "Calendário"] as const
type Tab = (typeof TABS)[number]

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

function formatNum(v: number) {
  return v.toLocaleString("pt-BR")
}

const cardStyle: CSSProperties = {
  backgroundColor: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: "20px 20px",
}

const sectionTitle: CSSProperties = {
  ...titleFont,
  fontWeight: 700,
  fontSize: 15,
  color: C.text,
  marginBottom: 14,
}

export default function HubMarketingDemoPage() {
  const [tab, setTab] = useState<Tab>("Dashboard")

  return (
    <main style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", backgroundColor: C.bg, color: C.text, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 24px 64px" }}>
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: C.muted, textDecoration: "none", marginBottom: 26 }}
        >
          <span aria-hidden>←</span> Voltar
        </Link>

        <h1 style={{ ...titleFont, fontWeight: 700, fontSize: "clamp(22px, 3.2vw, 30px)", letterSpacing: "-0.02em", marginBottom: 8 }}>
          Hub de Marketing, demonstração com dados fictícios
        </h1>
        <p style={{ fontSize: 13, color: C.muted, fontStyle: "italic", marginBottom: 28 }}>
          Todos os números, nomes e handles desta página são ilustrativos, sem relação com nenhum cliente real.
        </p>

        <div
          style={{
            display: "flex", gap: 6, backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: 5, marginBottom: 32, overflowX: "auto" as const, width: "fit-content",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              style={{
                ...titleFont, fontSize: 13, fontWeight: 700, padding: "9px 18px", borderRadius: 7, border: "none",
                cursor: "pointer", whiteSpace: "nowrap" as const,
                backgroundColor: tab === t ? C.green : "transparent",
                color: tab === t ? C.bg : C.muted,
                transition: "background-color 150ms ease, color 150ms ease",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Dashboard" && <DashboardTab />}
        {tab === "Tarefas" && <TarefasTab />}
        {tab === "Parcerias" && <ParceriasTab />}
        {tab === "Calendário" && <CalendarioTab />}
      </div>
    </main>
  )
}

/* ---------- Dashboard ---------- */

function KpiCard({ label, valor }: { label: string; valor: number }) {
  const [target, setTarget] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setTarget(valor), 150)
    return () => clearTimeout(t)
  }, [valor])
  const display = useCountUp(target, 900)

  return (
    <div style={{ ...cardStyle, borderTop: `2px solid ${C.green}` }}>
      <div style={{ ...titleFont, fontWeight: 700, fontSize: "clamp(26px, 3vw, 34px)", color: C.text, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 8 }}>
        {Math.round(display)}
      </div>
      <div style={{ fontSize: 13, color: C.muted }}>{label}</div>
    </div>
  )
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", fontSize: 12 }}>
      <div style={{ color: C.muted, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {formatNum(p.value)}</div>
      ))}
    </div>
  )
}

function DashboardTab() {
  const { kpis, proximosPrazos, orcamento, campanhasRecentes, graficoImpressoesAlcance, graficoSeguidores } = D.dashboard
  const orcamentoPct = Math.min(100, Math.round((orcamento.gasto / orcamento.total) * 100))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        {kpis.map((k) => <KpiCard key={k.label} label={k.label} valor={k.valor} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Próximos prazos</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {proximosPrazos.map((p) => (
              <div key={p.titulo} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, backgroundColor: C.surface, borderRadius: 6, padding: "10px 12px" }}>
                <span style={{ fontSize: 14, color: C.text }}>{p.titulo}</span>
                <span style={{ ...titleFont, fontSize: 12, fontWeight: 700, color: C.green, backgroundColor: C.greenFaint, padding: "3px 9px", borderRadius: 4, whiteSpace: "nowrap" as const }}>{p.data}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitle}>Orçamento do mês</h2>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.muted, marginBottom: 8 }}>
            <span>{formatBRL(orcamento.gasto)} gasto</span>
            <span>{formatBRL(orcamento.total)} total</span>
          </div>
          <div style={{ height: 10, borderRadius: 5, backgroundColor: C.surface, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${orcamentoPct}%`, backgroundColor: C.green, borderRadius: 5, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>{orcamentoPct}% do orçamento utilizado</div>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitle}>Campanhas recentes</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {campanhasRecentes.map((c) => {
            const pct = Math.min(100, Math.round((c.gasto / c.total) * 100))
            const isDone = c.status.toLowerCase().includes("conclu")
            return (
              <div key={c.nome} style={{ backgroundColor: C.surface, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{c.nome}</span>
                  <span
                    style={{
                      ...titleFont, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, whiteSpace: "nowrap" as const,
                      color: isDone ? C.green : C.amber,
                      backgroundColor: isDone ? C.greenFaint : C.amberFaint,
                    }}
                  >
                    {c.status}
                  </span>
                </div>
                <div style={{ height: 7, borderRadius: 4, backgroundColor: C.card, overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ height: "100%", width: `${pct}%`, backgroundColor: isDone ? C.green : C.amber, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>{formatBRL(c.gasto)} de {formatBRL(c.total)}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Impressões x alcance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={graficoImpressoesAlcance} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" stroke={C.muted} fontSize={11} tickLine={false} axisLine={{ stroke: C.border }} />
              <YAxis stroke={C.muted} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="impressoes" name="Impressões" stroke={C.green} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="alcance" name="Alcance" stroke={C.amber} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitle}>Crescimento de seguidores</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={graficoSeguidores} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="seguidoresFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.green} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={C.green} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" stroke={C.muted} fontSize={11} tickLine={false} axisLine={{ stroke: C.border }} />
              <YAxis stroke={C.muted} fontSize={11} tickLine={false} axisLine={false} domain={["dataMin - 300", "dataMax + 300"]} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="seguidores" name="Seguidores" stroke={C.green} strokeWidth={2} fill="url(#seguidoresFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

/* ---------- Tarefas ---------- */

function TarefaCardView({ card }: { card: TarefaCard }) {
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ ...titleFont, fontSize: 10, fontWeight: 700, color: C.green, backgroundColor: C.greenFaint, padding: "2px 8px", borderRadius: 4, alignSelf: "flex-start" }}>{card.tag}</span>
      <span style={{ fontSize: 13, color: C.text, lineHeight: 1.4 }}>{card.titulo}</span>
    </div>
  )
}

function TarefasTab() {
  return (
    <DndKanban
      columns={D.tarefas.colunas}
      cards={D.tarefas.cards}
      getColumn={(c) => c.coluna}
      renderCard={(c) => <TarefaCardView card={c} />}
      colors={C}
    />
  )
}

/* ---------- Parcerias ---------- */

function ParceriaCardView({ card }: { card: ParceriaCard }) {
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ ...titleFont, fontSize: 13, fontWeight: 700, color: C.text }}>{card.handle}</span>
      <span style={{ fontSize: 12, color: C.muted }}>{formatNum(card.seguidores)} seguidores</span>
      {card.contrato !== undefined && (
        <span style={{ fontSize: 11, color: C.green }}>
          {formatBRL(card.contrato)}/mês · {formatBRL(card.custoView ?? 0)}/view
        </span>
      )}
    </div>
  )
}

function ParceriasTab() {
  return (
    <DndKanban
      columns={D.parcerias.colunas}
      cards={D.parcerias.cards}
      getColumn={(c) => c.coluna}
      renderCard={(c) => <ParceriaCardView card={c} />}
      colors={C}
    />
  )
}

/* ---------- Calendário ---------- */

const CALENDAR_CELLS = 35 // 5 semanas x 7 dias, só visual fixo

function CalendarioTab() {
  const { mes, eventos } = D.calendario
  const eventByDay = new Map(eventos.map((e) => [e.dia, e.titulo]))
  const cells = Array.from({ length: CALENDAR_CELLS }, (_, i) => i + 1)
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

  return (
    <div style={cardStyle}>
      <h2 style={sectionTitle}>{mes}</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 8 }}>
        {weekDays.map((w) => (
          <div key={w} style={{ fontSize: 10, color: C.muted, textAlign: "center" as const, fontWeight: 600, letterSpacing: "0.04em" }}>{w}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 24 }}>
        {cells.map((d) => {
          const valido = d <= 30
          const evento = valido ? eventByDay.get(d) : undefined
          return (
            <div
              key={d}
              style={{
                aspectRatio: "1 / 1", borderRadius: 7, padding: 6,
                display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 4,
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                opacity: valido ? 1 : 0.25,
              }}
            >
              <span style={{ fontSize: 12, color: evento ? C.text : C.muted }}>{valido ? d : ""}</span>
              {evento && (
                <span
                  title={evento}
                  style={{
                    ...titleFont, fontSize: 9, fontWeight: 700, color: C.bg, backgroundColor: C.green,
                    borderRadius: 999, padding: "2px 6px", lineHeight: 1.3,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                  }}
                >
                  {evento}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <h2 style={sectionTitle}>Eventos do mês</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {eventos.map((e) => (
          <div key={e.dia} style={{ display: "flex", alignItems: "center", gap: 12, backgroundColor: C.surface, borderRadius: 6, padding: "10px 12px" }}>
            <span style={{ ...titleFont, fontSize: 12, fontWeight: 700, color: C.green, backgroundColor: C.greenFaint, padding: "3px 9px", borderRadius: 4 }}>Dia {e.dia}</span>
            <span style={{ fontSize: 13, color: C.text }}>{e.titulo}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
