"use client"

import { CSSProperties, useEffect } from "react"
import { getCalApi } from "@calcom/embed-react"

const CAL_NAMESPACE = "diagnostico-gratuito-30-min"
const CAL_LINK = "joao-pedro-pestana-abrahao-jkpavw/diagnostico-gratuito-30-min"
const CAL_CONFIG = JSON.stringify({ layout: "month_view", theme: "dark" })

export default function AgendarModal({ children, style, className }: { children: React.ReactNode; style?: CSSProperties; className?: string }) {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE })
      cal("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#2FA36B" } },
        layout: "month_view",
      })
    })()
  }, [])

  return (
    <button
      type="button"
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-link={CAL_LINK}
      data-cal-config={CAL_CONFIG}
      className={className}
      style={style}
    >
      {children}
    </button>
  )
}
