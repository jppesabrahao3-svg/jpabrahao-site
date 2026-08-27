import Link from "next/link"
import { Suspense } from "react"
import { NavegacaoTopo, NavegacaoInferior } from "../../components/gestor-demo/NavegacaoGestorDemo"
import SeletorContextoDemo from "../../components/gestor-demo/SeletorContextoDemo"

// Copiado de src/app/app/layout.tsx do Gestor real: mesmo header sticky, mesma
// nav de topo/rodape, mesma posicao do seletor de contexto. Sem sincronizar,
// ajustes, sair e assistente flutuante — sao acoes ligadas a conta e IA real,
// nao fazem sentido numa demo.
export default function GestorDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B110E] text-[#E9F0EB]" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <div className="border-b border-[#22332A] bg-[#0B110E] px-4 sm:px-6 py-2 text-xs text-[#8DA396] flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#E9F0EB]">
          <span aria-hidden>←</span> Voltar ao site
        </Link>
        <span className="italic">Demonstracao com dados ficticios</span>
      </div>

      <header className="sticky top-0 z-30 border-b border-[#22332A] bg-[#0B110E]/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-6 min-w-0">
            <Link href="/demo/gestor/painel" className="font-semibold tracking-tight shrink-0">
              Gestor
            </Link>
            <NavegacaoTopo />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Suspense fallback={null}>
              <SeletorContextoDemo />
            </Suspense>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">{children}</main>

      <NavegacaoInferior />
    </div>
  )
}
