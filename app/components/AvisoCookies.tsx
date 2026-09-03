"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "cookies-aceitos"

export default function AvisoCookies() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const aceitou = localStorage.getItem(STORAGE_KEY)
    if (!aceitou) setVisivel(true)
  }, [])

  function aceitar() {
    localStorage.setItem(STORAGE_KEY, "true")
    setVisivel(false)
  }

  if (!visivel) return null

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "14px 20px",
        backgroundColor: "#141911",
        borderTop: "1px solid #26301F",
      }}
    >
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#B7C0B3", maxWidth: 560 }}>
        Usamos cookies para entender como você navega pelo site e melhorar sua experiência.
      </p>
      <button
        onClick={aceitar}
        style={{
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 600,
          color: "#0C1009",
          backgroundColor: "#2FA36B",
          border: "none",
          borderRadius: 6,
          padding: "8px 18px",
          cursor: "pointer",
        }}
      >
        Entendi
      </button>
    </div>
  )
}
