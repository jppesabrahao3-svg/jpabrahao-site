"use client"

// Copiado de src/components/NavegacaoApp.tsx do projeto Gestor real, so com
// os hrefs redirecionados para as sub-rotas de /demo/gestor.

import Link from "next/link"
import { usePathname } from "next/navigation"

const DESTINOS = [
  { href: "/demo/gestor/painel", rotulo: "Painel", curto: "Painel", icone: "painel" },
  { href: "/demo/gestor/fluxo-caixa", rotulo: "Fluxo de Caixa", curto: "Fluxo", icone: "fluxo" },
  { href: "/demo/gestor/compromissos", rotulo: "Compromissos", curto: "A pagar", icone: "compromissos" },
  { href: "/demo/gestor/investimentos", rotulo: "Investimentos", curto: "Investir", icone: "investimentos" },
] as const

function Icone({ nome, className }: { nome: string; className?: string }) {
  const comum = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }
  switch (nome) {
    case "painel":
      return (
        <svg {...comum}>
          <path d="M3 13h4v8H3zM10 3h4v18h-4zM17 9h4v12h-4z" />
        </svg>
      )
    case "fluxo":
      return (
        <svg {...comum}>
          <path d="M3 7h13M3 7l3-3M3 7l3 3" />
          <path d="M21 17H8m13 0-3-3m3 3-3 3" />
        </svg>
      )
    case "compromissos":
      return (
        <svg {...comum}>
          <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
          <path d="M2.5 10h19" />
        </svg>
      )
    case "investimentos":
      return (
        <svg {...comum}>
          <path d="M3 17l5.5-5.5 3.5 3.5L21 6" />
          <path d="M21 11V6h-5" />
        </svg>
      )
    default:
      return null
  }
}

function ativo(pathname: string, href: string) {
  return pathname.startsWith(href)
}

export function NavegacaoTopo() {
  const pathname = usePathname()
  return (
    <nav className="hidden md:flex gap-1">
      {DESTINOS.map((d) => {
        const eh = ativo(pathname, d.href)
        return (
          <Link
            key={d.href}
            href={d.href}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              eh ? "bg-[#1B6B47]/20 text-[#7FD4A2] font-medium" : "text-[#8DA396] hover:bg-[#121C17] hover:text-[#E9F0EB]"
            }`}
          >
            {d.rotulo}
          </Link>
        )
      })}
    </nav>
  )
}

export function NavegacaoInferior() {
  const pathname = usePathname()
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#22332A] bg-[#0B110E]/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-4">
        {DESTINOS.map((d) => {
          const eh = ativo(pathname, d.href)
          return (
            <Link
              key={d.href}
              href={d.href}
              className={`flex flex-col items-center gap-1 py-2.5 transition ${eh ? "text-[#7FD4A2]" : "text-[#8DA396]"}`}
            >
              <Icone nome={d.icone} className="w-5 h-5" />
              <span className="text-[10px] leading-none">{d.curto}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
