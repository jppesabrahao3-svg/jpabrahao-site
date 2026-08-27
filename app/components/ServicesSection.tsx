import Link from "next/link"

type ServiceItem = { tag: string; title: string; desc: string }

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

export default function ServicesSection({ services, colors: C }: { services: ServiceItem[]; colors: Colors }) {
  return (
    <div className="services-grid">
      {services.map((s) =>
        s.tag === "CONTEUDO" ? (
          <Link
            key={s.tag}
            href="/marketing-com-ia"
            className="case-card"
            style={{
              textAlign: "left" as const, backgroundColor: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 8, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 14,
              color: "inherit", textDecoration: "none",
            }}
          >
            <span style={{ fontFamily: "var(--font-syne), sans-serif", display: "inline-block", alignSelf: "flex-start", fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: "0.08em", backgroundColor: C.greenFaint, padding: "4px 10px", borderRadius: 4 }}>{s.tag}</span>
            <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, fontSize: 17, color: C.text, lineHeight: 1.3 }}>{s.title}</h3>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7 }}>{s.desc}</p>
            <div style={{ fontSize: 12, color: C.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginTop: "auto" }}>
              Ver resultados <span aria-hidden>→</span>
            </div>
          </Link>
        ) : (
          <div key={s.tag} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ fontFamily: "var(--font-syne), sans-serif", display: "inline-block", alignSelf: "flex-start", fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: "0.08em", backgroundColor: C.greenFaint, padding: "4px 10px", borderRadius: 4 }}>{s.tag}</span>
            <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, fontSize: 17, color: C.text, lineHeight: 1.3 }}>{s.title}</h3>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7 }}>{s.desc}</p>
          </div>
        )
      )}
    </div>
  )
}
