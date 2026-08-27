"use client"

import { useState } from "react"
import MarketingMetrics from "./MarketingMetrics"
import MoodboardParallax from "./MoodboardParallax"

type MoodboardItem = { src: string; type: "image" | "video"; width: number; height: number }
type Colors = { bg: string; border: string; green: string; muted: string }

// Altura inicial usada antes da primeira medicao real (evita flash sem padding).
const HEADER_HEIGHT_FALLBACK = 160

export default function MarketingComIASection({ items, colors: C }: { items: MoodboardItem[]; colors: Colors }) {
  const [headerHeight, setHeaderHeight] = useState(HEADER_HEIGHT_FALLBACK)

  return (
    <>
      <MarketingMetrics colors={C} onHeightChange={setHeaderHeight} />
      <div style={{ paddingTop: headerHeight }}>
        <MoodboardParallax items={items} colors={C} />
      </div>
    </>
  )
}
