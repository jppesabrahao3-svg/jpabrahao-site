// Dados e helpers ficticios de apoio ao /demo/gestor, espelhando as estruturas
// reais de app/app/(investimentos|compromissos) do projeto Gestor, sem nenhuma
// dependencia de Supabase. Os tipos e funcoes puras (agrupar/porTipo/etc, a
// paleta de investimentos) sao copiados literalmente do projeto real.
// Contexto pessoa fisica + MEI (nao empresa).

// ───────────────────────────── Contas (Painel > OverviewContas) ─────────────

export type ContaOverview = {
  id: string
  name: string
  kind: string
  context: string
  saldo: number
  faturaAberta?: number
  limite?: number | null
  limiteUsado?: number
  fechamento?: number | null
  vencimento?: number | null
  periodoFatura?: string
}

export const contasBancariasDemo: ContaOverview[] = [
  { id: "cc1", name: "Conta Corrente", kind: "corrente", context: "pessoal", saldo: 2860.1 },
  { id: "cc2", name: "Conta MEI", kind: "corrente", context: "negocio", saldo: 1000.0 },
]

export const cartoesDemo: ContaOverview[] = [
  {
    id: "cartao1",
    name: "Cartao de Credito",
    kind: "cartao",
    context: "pessoal",
    saldo: 0,
    faturaAberta: 1420.5,
    limiteUsado: 1420.5,
    limite: 5000,
    fechamento: 22,
    vencimento: 29,
    periodoFatura: "23 ago - 22 set",
  },
]

// ───────────────────────────── Investimentos ─────────────────────────────

export type Posicao = {
  id: string
  type: string
  subtype: string
  status: string
  name: string
  issuer: string | null
  balance: number
  amount_original: number | null
  amount_profit: number | null
  due_date: string | null
  last_month_rate: number | null
  last_twelve_months_rate: number | null
  annual_rate: number | null
  taxa: string | null
}

export const posicoesDemo: Posicao[] = [
  { id: "p1", type: "FIXED_INCOME", subtype: "CDB", status: "ATIVO", name: "CDB Liquidez Diaria", issuer: "Banco Alfa", balance: 6800, amount_original: 6250, amount_profit: 550, due_date: null, last_month_rate: 0.9, last_twelve_months_rate: 11.8, annual_rate: 11.8, taxa: "110% do CDI" },
  { id: "p2", type: "FIXED_INCOME", subtype: "Tesouro", status: "ATIVO", name: "Tesouro Selic 2029", issuer: "Tesouro Nacional", balance: 3000, amount_original: 2750, amount_profit: 250, due_date: "2029-03-01", last_month_rate: 0.88, last_twelve_months_rate: 12.1, annual_rate: 12.1, taxa: "Selic + 0,05%" },
  { id: "p3", type: "FUND", subtype: "Fundo Multimercado", status: "ATIVO", name: "Fundo Multimercado XP", issuer: "Gestora Beta", balance: 4500, amount_original: 4100, amount_profit: 400, due_date: null, last_month_rate: 0.5, last_twelve_months_rate: 9.1, annual_rate: 9.1, taxa: null },
]

export const snapshotsDemo: { snapshot_month: string; total_balance: number }[] = [
  { snapshot_month: "2026-03-01", total_balance: 11200 },
  { snapshot_month: "2026-04-01", total_balance: 11800 },
  { snapshot_month: "2026-05-01", total_balance: 12300 },
  { snapshot_month: "2026-06-01", total_balance: 12900 },
  { snapshot_month: "2026-07-01", total_balance: 13600 },
  { snapshot_month: "2026-08-01", total_balance: 14300 },
]

/** Cor deterministica por rotulo, mesma paleta e hash do investimentos.ts real. */
const PALETA_INVEST = [
  "#2FA36B", "#7FD4A2", "#6BA8D9", "#D9A03C", "#B98BD9",
  "#4FC1B0", "#D97A7A", "#C9C24A", "#8DA396", "#D98BB0",
]

export function corDoGrupoInvest(rotulo: string): string {
  let hash = 0
  for (let i = 0; i < rotulo.length; i++) hash = (hash * 31 + rotulo.charCodeAt(i)) | 0
  return PALETA_INVEST[Math.abs(hash) % PALETA_INVEST.length]
}

export type GrupoInvest = { rotulo: string; valor: number; quantidade: number; participacao: number }

function agrupar(posicoes: Posicao[], chave: (p: Posicao) => string): GrupoInvest[] {
  const total = posicoes.reduce((s, p) => s + p.balance, 0)
  const mapa = new Map<string, { valor: number; qtd: number }>()
  for (const p of posicoes) {
    const k = chave(p)
    const atual = mapa.get(k) ?? { valor: 0, qtd: 0 }
    atual.valor += p.balance
    atual.qtd += 1
    mapa.set(k, atual)
  }
  return [...mapa.entries()]
    .map(([rotulo, v]) => ({ rotulo, valor: v.valor, quantidade: v.qtd, participacao: total ? (v.valor / total) * 100 : 0 }))
    .sort((a, b) => b.valor - a.valor)
}

export function porTipoInvest(posicoes: Posicao[]) {
  const rotulo = (t: string) => (t === "FIXED_INCOME" ? "Renda fixa" : t === "FUND" ? "Fundo" : t)
  return agrupar(posicoes, (p) => rotulo(p.type))
}
export function porSubtipoInvest(posicoes: Posicao[]) {
  return agrupar(posicoes, (p) => p.subtype)
}
export function porEmissorInvest(posicoes: Posicao[]) {
  return agrupar(posicoes, (p) => p.issuer?.trim() || "Nao informado")
}

export function resumirInvest(posicoes: Posicao[]) {
  const total = posicoes.reduce((s, p) => s + p.balance, 0)
  const lucro = posicoes.reduce((s, p) => s + (p.amount_profit ?? 0), 0)
  const aplicado = posicoes.reduce((s, p) => s + (p.amount_original ?? p.balance - (p.amount_profit ?? 0)), 0)
  let somaPeso = 0
  let somaRent = 0
  for (const p of posicoes) {
    const r = p.last_twelve_months_rate ?? p.annual_rate
    if (r == null) continue
    somaPeso += p.balance
    somaRent += r * p.balance
  }
  return {
    total,
    aplicado,
    lucro,
    rentabilidade: aplicado > 0 ? (lucro / aplicado) * 100 : null,
    ativos: posicoes.length,
    rentabilidade12m: somaPeso > 0 ? somaRent / somaPeso : null,
  }
}

export function diasAteVencimentoDemo(dueDate: string | null): number | null {
  if (!dueDate) return null
  const hoje = new Date("2026-08-23T00:00:00")
  const venc = new Date(dueDate.slice(0, 10) + "T00:00:00")
  return Math.round((venc.getTime() - hoje.getTime()) / 86400000)
}

// ───────────────────────────── Compromissos ─────────────────────────────

export type ParcelaVista = { numero: number; valor: number; faturaMes: string | null; data: string }

export type ParcelamentoDemo = {
  chave: string
  descricao: string
  contaId: string | null
  categoria: string
  context: string
  valorParcela: number
  totalParcelas: number
  parcelaAtual: number
  valorTotal: number
  jaPago: number
  falta: number
  primeiraFatura: string | null
  ultimaFatura: string | null
  quitado: boolean
  estimado: boolean
  parcelasVistas: ParcelaVista[]
}

export const parcelamentosDemo: ParcelamentoDemo[] = [
  {
    chave: "notebook-novo", descricao: "Notebook novo", contaId: "cartao1", categoria: "Compras", context: "pessoal",
    valorParcela: 280, totalParcelas: 12, parcelaAtual: 5, valorTotal: 3360, jaPago: 1400, falta: 1960,
    primeiraFatura: "2026-04-01", ultimaFatura: "2027-03-01", quitado: false, estimado: false,
    parcelasVistas: [
      { numero: 3, valor: 280, faturaMes: "2026-06-01", data: "2026-06-05" },
      { numero: 4, valor: 280, faturaMes: "2026-07-01", data: "2026-07-05" },
      { numero: 5, valor: 280, faturaMes: "2026-08-01", data: "2026-08-05" },
    ],
  },
  {
    chave: "celular", descricao: "Celular", contaId: "cartao1", categoria: "Compras", context: "pessoal",
    valorParcela: 190, totalParcelas: 10, parcelaAtual: 2, valorTotal: 1900, jaPago: 380, falta: 1520,
    primeiraFatura: "2026-07-01", ultimaFatura: "2027-04-01", quitado: false, estimado: false,
    parcelasVistas: [
      { numero: 1, valor: 190, faturaMes: "2026-07-01", data: "2026-07-10" },
      { numero: 2, valor: 190, faturaMes: "2026-08-01", data: "2026-08-10" },
    ],
  },
]

export type AssinaturaDemo = {
  chave: string
  descricao: string
  categoria: string
  valor: number
  variacao: number
  periodicidade: "mensal" | "anual"
  cobrancas: number
  primeiraCobranca: string
  ultimaCobranca: string
  proximaCobranca: string
  ativa: boolean
  confirmadaPelaIA: boolean
  totalPago: number
  cobrancasVistas: { data: string; valor: number }[]
  intervaloDias: number
}

export const assinaturasDemo: AssinaturaDemo[] = [
  {
    chave: "streaming-video", descricao: "Streaming de video", categoria: "Assinaturas", valor: 45, variacao: 0,
    periodicidade: "mensal", cobrancas: 8, primeiraCobranca: "2026-01-08", ultimaCobranca: "2026-08-08", proximaCobranca: "2026-09-08",
    ativa: true, confirmadaPelaIA: true, totalPago: 360,
    cobrancasVistas: [
      { data: "2026-06-08", valor: 45 }, { data: "2026-07-08", valor: 45 }, { data: "2026-08-08", valor: 45 },
    ],
    intervaloDias: 30,
  },
  {
    chave: "academia", descricao: "Academia", categoria: "Saude", valor: 120, variacao: 0,
    periodicidade: "mensal", cobrancas: 8, primeiraCobranca: "2026-01-15", ultimaCobranca: "2026-08-15", proximaCobranca: "2026-09-15",
    ativa: true, confirmadaPelaIA: true, totalPago: 960,
    cobrancasVistas: [
      { data: "2026-06-15", valor: 120 }, { data: "2026-07-15", valor: 120 }, { data: "2026-08-15", valor: 120 },
    ],
    intervaloDias: 30,
  },
  {
    chave: "curso-ingles", descricao: "Curso de ingles", categoria: "Educacao", valor: 90, variacao: 0,
    periodicidade: "mensal", cobrancas: 6, primeiraCobranca: "2026-03-20", ultimaCobranca: "2026-08-20", proximaCobranca: "2026-09-20",
    ativa: true, confirmadaPelaIA: true, totalPago: 540,
    cobrancasVistas: [
      { data: "2026-06-20", valor: 90 }, { data: "2026-07-20", valor: 90 }, { data: "2026-08-20", valor: 90 },
    ],
    intervaloDias: 30,
  },
]

// Itens da fatura aberta do cartao ficticio (soma = faturaAberta em cartoesDemo).
export type ItemFaturaDemo = { id: string; descricao: string; categoria: string; data: string; valor: number }

export const itensFaturaDemo: ItemFaturaDemo[] = [
  { id: "f1", descricao: "Notebook novo (parcela 5/12)", categoria: "Compras", data: "2026-09-05", valor: 280 },
  { id: "f2", descricao: "Celular (parcela 2/10)", categoria: "Compras", data: "2026-09-10", valor: 190 },
  { id: "f3", descricao: "Streaming de video", categoria: "Assinaturas", data: "2026-09-08", valor: 45 },
  { id: "f4", descricao: "Academia", categoria: "Saude", data: "2026-09-15", valor: 120 },
  { id: "f5", descricao: "Curso de ingles", categoria: "Educacao", data: "2026-09-20", valor: 90 },
  { id: "f6", descricao: "Farmacia", categoria: "Saude", data: "2026-09-12", valor: 100 },
  { id: "f7", descricao: "Restaurante", categoria: "Alimentacao", data: "2026-09-18", valor: 250 },
  { id: "f8", descricao: "Loja de roupas", categoria: "Compras", data: "2026-09-22", valor: 345.5 },
]
