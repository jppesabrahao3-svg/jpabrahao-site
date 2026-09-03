"use client"

import { useState } from "react"
import { useCountUp } from "./useCountUp"

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

const ENCARGOS = 1.8

// Mesmo percentual de redução de tempo operacional usado e defendido no case
// de Automação Comercial (seção de Cases da home): 6h -> 1,5h por dia = -75%.
const REDUCAO_TEMPO_OPERACIONAL = 0.75

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

export default function ImpactCalculator({ colors: C }: { colors: Colors }) {
  const [people, setPeople] = useState(3)
  const [salary, setSalary] = useState(2800)

  // Custo hoje: o que a equipe atual custa por mês (salário + encargos), não o
  // que seria "economizado" — o serviço não substitui a equipe inteira.
  const monthlyCost = people * salary * ENCARGOS
  const annualCost = monthlyCost * 12

  // Economia estimada: fração desse custo recuperada com o sistema/automação,
  // usando o mesmo percentual do case de Automação Comercial.
  const monthlySavings = monthlyCost * REDUCAO_TEMPO_OPERACIONAL
  const annualSavings = monthlySavings * 12

  const monthlyCostDisplay = useCountUp(monthlyCost, 500)
  const annualCostDisplay = useCountUp(annualCost, 500)
  const monthlyDisplay = useCountUp(monthlySavings, 700)
  const annualDisplay = useCountUp(annualSavings, 700)

  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "26px 26px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
        Calculadora de impacto
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 13, color: C.text, marginBottom: 10 }}>
          <span>Quantas pessoas fazem esse trabalho hoje?</span>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", color: C.green, fontWeight: 700, fontSize: 16 }}>{people}</span>
        </div>
        <input
          type="range"
          min={2}
          max={8}
          step={1}
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
          style={{ width: "100%", accentColor: C.green }}
          aria-label="Número de pessoas"
        />
      </div>

      <div>
        <div style={{ fontSize: 13, color: C.text, marginBottom: 10 }}>Salário médio mensal</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", backgroundColor: C.bg }}>
          <span style={{ color: C.muted, fontSize: 14 }}>R$</span>
          <input
            type="number"
            min={0}
            step={100}
            value={salary}
            onChange={(e) => setSalary(Math.max(0, Number(e.target.value) || 0))}
            style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 15, fontWeight: 600 }}
            aria-label="Salário médio mensal"
          />
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: C.border }} />

      <div>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Custo hoje</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" as const }}>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, fontWeight: 600, color: C.muted }}>
            {formatBRL(monthlyCostDisplay)} <span style={{ fontWeight: 400 }}>/mês</span>
          </span>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, fontWeight: 600, color: C.muted }}>
            {formatBRL(annualCostDisplay)} <span style={{ fontWeight: 400 }}>/ano</span>
          </span>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Economia mensal</div>
        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 20, fontWeight: 700, color: C.text }}>{formatBRL(monthlyDisplay)}</div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Economia anual</div>
        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "clamp(30px, 4vw, 42px)", fontWeight: 700, color: C.green, letterSpacing: "-0.02em", lineHeight: 1 }}>
          {formatBRL(annualDisplay)}
        </div>
      </div>

      <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7 }}>
        Estimativa baseada em 75% do tempo operacional recuperado, sobre o custo total (salário + encargos) da equipe atual.
      </p>
    </div>
  )
}
