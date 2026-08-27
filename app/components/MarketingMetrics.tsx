"use client"

import { CSSProperties, useEffect, useRef, useState } from "react"
import { useCountUp } from "./useCountUp"

type Colors = { bg: string; border: string; green: string; muted: string }

const COLLAPSE_THRESHOLD = 70

export default function MarketingMetrics({ colors: C, onHeightChange }: { colors: Colors; onHeightChange?: (height: number) => void }) {
  const [targets, setTargets] = useState({ alcance: 0, engajamento: 0, seguidores: 0 })
  const [collapsed, setCollapsed] = useState(false)
  const barRef = useRef<HTMLDivElement | null>(null)

  // Mede a altura real do header (varia com a animacao de colapso) e repassa
  // pro pai, que usa isso como padding-top do moodboard pra nunca cobrir os cards.
  useEffect(() => {
    const el = barRef.current
    if (!el || !onHeightChange) return
    const report = () => onHeightChange(el.offsetHeight)
    report()
    const observer = new ResizeObserver(report)
    observer.observe(el)
    return () => observer.disconnect()
  }, [onHeightChange])

  useEffect(() => {
    const t = setTimeout(() => setTargets({ alcance: 48200, engajamento: 32, seguidores: 1140 }), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let ticking = false
    const getScrollY = () => window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = getScrollY()
        setCollapsed(y > COLLAPSE_THRESHOLD)
        ticking = false
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("scroll", onScroll)
    }
  }, [])

  const alcance = useCountUp(targets.alcance, 1300)
  const engajamento = useCountUp(targets.engajamento, 1000)
  const seguidores = useCountUp(targets.seguidores, 1300)

  const stats = [
    { value: `${Math.round(alcance).toLocaleString("pt-BR")}`, full: "Alcance mensal", short: "Alcance" },
    { value: `+${Math.round(engajamento)}%`, full: "Engajamento", short: "Engajamento" },
    { value: `${Math.round(seguidores).toLocaleString("pt-BR")}`, full: "Seguidores ganhos no periodo", short: "Seguidores" },
  ]

  const barStyle: CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 40,
    backgroundColor: C.bg,
    borderBottom: `1px solid ${collapsed ? C.border : "transparent"}`,
    padding: collapsed ? "10px 24px" : "26px 24px 22px",
    transition: "padding 180ms ease, border-color 180ms ease",
  }

  const wrapStyle: CSSProperties = { maxWidth: 1180, margin: "0 auto" }

  const rowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: collapsed ? "center" : "flex-start",
    justifyContent: collapsed ? "center" : "flex-start",
    gap: collapsed ? 28 : 32,
    transition: "gap 180ms ease",
  }

  return (
    <div ref={barRef} style={barStyle}>
      <div style={wrapStyle}>
        <div style={rowStyle}>
          {stats.map((s) => (
            <div
              key={s.full}
              style={{
                display: "flex",
                flexDirection: collapsed ? "row" : "column",
                alignItems: collapsed ? "baseline" : "flex-start",
                gap: collapsed ? 7 : 4,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontWeight: 800,
                  color: C.green,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  fontSize: collapsed ? 18 : "clamp(26px, 4vw, 38px)",
                  transition: "font-size 180ms ease",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: collapsed ? 11 : 12,
                  color: C.muted,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  transition: "font-size 180ms ease",
                }}
              >
                {collapsed ? s.short : s.full}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            maxHeight: collapsed ? 0 : 36,
            opacity: collapsed ? 0 : 1,
            overflow: "hidden",
            marginTop: collapsed ? 0 : 12,
            fontSize: 12,
            color: C.muted,
            fontStyle: "italic",
            transition: "max-height 180ms ease, opacity 150ms ease, margin-top 180ms ease",
          }}
        >
          Numeros ilustrativos de um cenario tipico, nao de um cliente especifico.
        </div>
      </div>
    </div>
  )
}
