import type { CSSProperties } from "react"

function brl(valor: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
}

// Mesmo componente do Gestor real, sem o PrivacidadeProvider (nao ha valor
// real a esconder numa demo com dado ficticio).
export default function ValorMonetario({
  valor,
  className,
  style,
}: {
  valor: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <span className={className} style={style}>
      {brl(valor)}
    </span>
  )
}
