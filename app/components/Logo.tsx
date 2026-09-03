import Simbolo from "./Simbolo"

type Props = {
  textOnly?: boolean
  className?: string
}

export default function Logo({ textOnly = false, className }: Props) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {!textOnly && (
        <span style={{ display: "inline-flex", color: "#2FA36B" }}>
          <Simbolo size={28} />
        </span>
      )}
      <span className="logo-name" style={{ fontFamily: "var(--font-sora), sans-serif", whiteSpace: "nowrap" as const }}>
        <span style={{ fontWeight: 700, color: "#2FA36B" }}>JP</span>{" "}
        <span style={{ fontWeight: 300, color: "#E8EDE6" }}>Abrahão</span>
      </span>
    </span>
  )
}
