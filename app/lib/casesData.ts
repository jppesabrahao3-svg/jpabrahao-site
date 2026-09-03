export type DashboardKPI = { label: string; valor: number }
export type PrazoItem = { titulo: string; data: string }
export type CampanhaRecente = { nome: string; gasto: number; total: number; status: string }
export type ImpressoesAlcanceMes = { mes: string; impressoes: number; alcance: number }
export type SeguidoresMes = { mes: string; seguidores: number }

export type TarefaCard = { id: string; titulo: string; coluna: string; tag: string }
export type ParceriaCard = {
  id: string
  handle: string
  seguidores: number
  coluna: string
  contrato?: number
  custoView?: number
}
export type CalendarioEvento = { dia: number; titulo: string }

export type MarketingHubDemoData = {
  dashboard: {
    kpis: DashboardKPI[]
    proximosPrazos: PrazoItem[]
    orcamento: { gasto: number; total: number }
    campanhasRecentes: CampanhaRecente[]
    graficoImpressoesAlcance: ImpressoesAlcanceMes[]
    graficoSeguidores: SeguidoresMes[]
  }
  tarefas: { colunas: string[]; cards: TarefaCard[] }
  parcerias: { colunas: string[]; cards: ParceriaCard[] }
  calendario: { mes: string; eventos: CalendarioEvento[] }
}

export const marketHubDemoData: MarketingHubDemoData = {
  dashboard: {
    kpis: [
      { label: "Tarefas Pendentes", valor: 5 },
      { label: "Campanhas Ativas", valor: 2 },
      { label: "Posts Agendados", valor: 12 },
      { label: "Parcerias Ativas", valor: 6 },
    ],
    proximosPrazos: [
      { titulo: "Lançamento linha verão", data: "15 dez" },
      { titulo: "Vídeo institucional", data: "20 dez" },
    ],
    orcamento: { gasto: 8400, total: 15000 },
    campanhasRecentes: [
      { nome: "Parceria Loja Y", gasto: 3000, total: 5000, status: "Em andamento" },
      { nome: "Campanha Dia das Mães", gasto: 4000, total: 4000, status: "Concluída" },
    ],
    graficoImpressoesAlcance: [
      { mes: "Jan", impressoes: 180000, alcance: 95000 },
      { mes: "Fev", impressoes: 210000, alcance: 110000 },
      { mes: "Mar", impressoes: 260000, alcance: 140000 },
      { mes: "Abr", impressoes: 300000, alcance: 165000 },
      { mes: "Mai", impressoes: 275000, alcance: 150000 },
      { mes: "Jun", impressoes: 240000, alcance: 130000 },
      { mes: "Jul", impressoes: 260000, alcance: 145000 },
    ],
    graficoSeguidores: [
      { mes: "Jan", seguidores: 6800 },
      { mes: "Fev", seguidores: 7100 },
      { mes: "Mar", seguidores: 7400 },
      { mes: "Abr", seguidores: 7650 },
      { mes: "Mai", seguidores: 7900 },
      { mes: "Jun", seguidores: 8100 },
      { mes: "Jul", seguidores: 8240 },
    ],
  },

  tarefas: {
    colunas: ["Backlog", "A Fazer", "Em Progresso", "Revisão", "Concluído"],
    cards: [
      { id: "1", titulo: "Post dia do cliente", coluna: "Backlog", tag: "Feed" },
      { id: "2", titulo: "Reel bastidores", coluna: "Backlog", tag: "Video" },
      { id: "3", titulo: "Carrossel comparativo produtos", coluna: "A Fazer", tag: "Feed" },
      { id: "4", titulo: "Banner promoção verão", coluna: "A Fazer", tag: "Banner" },
      { id: "5", titulo: "Legenda campanha parceria", coluna: "A Fazer", tag: "Briefing" },
      { id: "6", titulo: "Vídeo institucional", coluna: "Em Progresso", tag: "Video" },
      { id: "7", titulo: "Post lançamento linha nova", coluna: "Revisão", tag: "Feed" },
      { id: "8", titulo: "Post boas-vindas seguidores", coluna: "Concluído", tag: "Feed" },
    ],
  },

  parcerias: {
    colunas: ["Prospecção", "Negociação", "Ativo", "Pausado"],
    cards: [
      { id: "1", handle: "@vidapratica.oficial", seguidores: 150000, coluna: "Prospecção" },
      { id: "2", handle: "@estilocasa.br", seguidores: 90000, coluna: "Prospecção" },
      { id: "3", handle: "@beleza.consciente", seguidores: 60000, contrato: 500, custoView: 0.08, coluna: "Negociação" },
      { id: "4", handle: "@rotina.pratica", seguidores: 320000, contrato: 1800, custoView: 0.015, coluna: "Ativo" },
      { id: "5", handle: "@casa.organizada", seguidores: 180000, contrato: 700, custoView: 0.02, coluna: "Ativo" },
      { id: "6", handle: "@lifestyle.simples", seguidores: 95000, contrato: 400, custoView: 0.03, coluna: "Pausado" },
    ],
  },

  calendario: {
    mes: "Setembro 2026",
    eventos: [
      { dia: 3, titulo: "Post lançamento" },
      { dia: 10, titulo: "Reel parceria" },
      { dia: 17, titulo: "Carrossel comparativo" },
      { dia: 24, titulo: "Campanha Setembro" },
    ],
  },
}

export type GestorPessoalMes = { mes: string; pessoal: number; mei: number }
export type GestorPessoalConciliacao = {
  saldoInicio: number
  entradas: number
  saidas: number
  investido: number
  saldoHoje: number
}
export type GestorPessoalTetoMEI = { faturado: number; limite: number }

export type GestorPessoalCategoria = { nome: string; valor: number }
export type GestorPessoalGrupo = { grupo: string; valor: number; categorias: GestorPessoalCategoria[] }

export type GestorPessoalDemoData = {
  meses: GestorPessoalMes[]
  conciliacao: GestorPessoalConciliacao
  tetoMEI: GestorPessoalTetoMEI
  despesasPorGrupo: GestorPessoalGrupo[]
}

export const gestorPessoalDemoData: GestorPessoalDemoData = {
  meses: [
    { mes: "Mar", pessoal: 3200, mei: 4800 },
    { mes: "Abr", pessoal: 2900, mei: 5100 },
    { mes: "Mai", pessoal: 3400, mei: 4400 },
    { mes: "Jun", pessoal: 3100, mei: 5800 },
    { mes: "Jul", pessoal: 3600, mei: 6200 },
    { mes: "Ago", pessoal: 3300, mei: 5500 },
  ],
  conciliacao: {
    saldoInicio: 2180.40,
    entradas: 8900.00,
    saidas: 6420.30,
    investido: 800.00,
    saldoHoje: 3860.10,
  },
  tetoMEI: { faturado: 42000, limite: 81000 },
  despesasPorGrupo: [
    { grupo: "Moradia", valor: 1800, categorias: [
      { nome: "Aluguel", valor: 1400 },
      { nome: "Condomínio", valor: 400 },
    ]},
    { grupo: "Alimentação", valor: 1200, categorias: [
      { nome: "Mercado", valor: 700 },
      { nome: "Restaurante", valor: 500 },
    ]},
    { grupo: "Transporte", valor: 650, categorias: [
      { nome: "Combustível", valor: 400 },
      { nome: "App de transporte", valor: 250 },
    ]},
    { grupo: "Assinaturas", valor: 210, categorias: [
      { nome: "Streaming", valor: 90 },
      { nome: "Academia", valor: 120 },
    ]},
    { grupo: "Saúde", valor: 480, categorias: [
      { nome: "Plano de saúde", valor: 380 },
      { nome: "Farmácia", valor: 100 },
    ]},
    { grupo: "Lazer", valor: 390, categorias: [
      { nome: "Saídas", valor: 250 },
      { nome: "Hobbies", valor: 140 },
    ]},
    { grupo: "Compras", valor: 620, categorias: [
      { nome: "Roupas", valor: 300 },
      { nome: "Casa", valor: 320 },
    ]},
    { grupo: "Educação", valor: 350, categorias: [
      { nome: "Curso online", valor: 350 },
    ]},
    { grupo: "Outros", valor: 220, categorias: [
      { nome: "Diversos", valor: 220 },
    ]},
  ],
}

export type HubComercialMesMetaFaturamento = { mes: string; meta: number; faturamento: number }
export type HubComercialVendedor = { vendedor: string; rede: string; meta: number; valor: number; percentual: string }
export type HubComercialProduto = { produto: string; valor: number }
export type HubComercialRepresentanteInadimplencia = { nome: string; valor: number; percentual: string }
export type HubComercialClienteInadimplencia = { nome: string; valor: number; percentual: string }
export type HubComercialTituloCliente = { titulo: string; vencimento: string; valor: number; numeroNF: string }
export type HubComercialTituloRepresentante = { cliente: string; vencimento: string; valor: number; numeroNF: string }

export type HubComercialDemoData = {
  biVendas: {
    positivacao: string
    velocidadeDia: string
    meta: number
    carteira: number
    valor: number
    atingido: string
    graficoMetaFaturamento: HubComercialMesMetaFaturamento[]
    rankingVendedores: HubComercialVendedor[]
    rankingProdutos: HubComercialProduto[]
  }
  clientesInadimplentes: {
    totalInadimplencia: number
    porRepresentante: HubComercialRepresentanteInadimplencia[]
    porCliente: HubComercialClienteInadimplencia[]
    detalhePorCliente: Record<string, HubComercialTituloCliente[]>
    detalhePorRepresentante: Record<string, HubComercialTituloRepresentante[]>
  }
  contratosComerciais: HubComercialContrato[]
  saldoEntregas: HubComercialEntrega[]
  analiseVendas: { meses: string[]; redes: HubComercialAnaliseRede[] }
}

export type ProdutoFicticio = { id: string; nome: string; linha: string; precoUnitario: number }

// Catálogo fictício de uma distribuidora de alimentos e bebidas, sem
// nenhuma semelhança com o ramo real de produtos clorados.
export const produtosFicticios: ProdutoFicticio[] = [
  { id: "1", nome: "Suco Natural Laranja 1L", linha: "Sucos", precoUnitario: 8.9 },
  { id: "2", nome: "Suco Natural Uva 1L", linha: "Sucos", precoUnitario: 8.9 },
  { id: "3", nome: "Água de Coco 500ml", linha: "Bebidas", precoUnitario: 6.5 },
  { id: "4", nome: "Refrigerante Guaraná 2L", linha: "Bebidas", precoUnitario: 9.9 },
  { id: "5", nome: "Barra de Cereal Cx 12un", linha: "Snacks", precoUnitario: 42.0 },
  { id: "6", nome: "Biscoito Integral Cx 24un", linha: "Snacks", precoUnitario: 58.0 },
]

export type HubComercialContrato = {
  rede: string
  associado: string
  cliente: string
  dataInicio: string
  dataVencimento: string
  porcentagem: string
  valor: number
  link: string
}

export type HubComercialEntrega = {
  dataCadastro: string
  cliente: string
  cnpj: string
  numeroPedido: string
  produto: string
  quantidadePendente: number
}

export type HubComercialAnaliseRede = {
  rede: string
  percentualTotal: string
  valoresMensais: number[]
  totalGeral: number
}

// Todos os nomes, valores e percentuais abaixo são fictícios, sem nenhuma
// relação com empresa, CNPJ, vendedor ou faturamento real.
export const hubComercialDemoData: HubComercialDemoData = {
  biVendas: {
    positivacao: "31,4%",
    velocidadeDia: "68,2%",
    meta: 1850000,
    carteira: 612000,
    valor: 980000,
    atingido: "53,0%",
    graficoMetaFaturamento: [
      { mes: "Mar", meta: 280000, faturamento: 240000 },
      { mes: "Abr", meta: 290000, faturamento: 265000 },
      { mes: "Mai", meta: 300000, faturamento: 310000 },
      { mes: "Jun", meta: 310000, faturamento: 295000 },
      { mes: "Jul", meta: 320000, faturamento: 340000 },
      { mes: "Ago", meta: 330000, faturamento: 305000 },
    ],
    rankingVendedores: [
      { vendedor: "Vendedor A", rede: "Rede Central", meta: 62000, valor: 71000, percentual: "114%" },
      { vendedor: "Vendedor B", rede: "Distribuidora Norte", meta: 58000, valor: 54000, percentual: "93%" },
      { vendedor: "Vendedor C", rede: "Atacado Sul", meta: 51000, valor: 49500, percentual: "97%" },
      { vendedor: "Vendedor D", rede: "Mercado Leste", meta: 47000, valor: 52000, percentual: "111%" },
      { vendedor: "Vendedor E", rede: "Rede Oeste", meta: 44000, valor: 39000, percentual: "89%" },
    ],
    rankingProdutos: [
      { produto: "Suco Natural Laranja 1L", valor: 142000 },
      { produto: "Água de Coco 500ml", valor: 118000 },
      { produto: "Refrigerante Guaraná 2L", valor: 96000 },
      { produto: "Barra de Cereal Cx 12un", valor: 74000 },
      { produto: "Biscoito Integral Cx 24un", valor: 58000 },
      { produto: "Suco Natural Uva 1L", valor: 51000 },
    ],
  },
  clientesInadimplentes: {
    totalInadimplencia: 38500,
    porRepresentante: [
      { nome: "Vendedor A", valor: 15200, percentual: "39%" },
      { nome: "Vendedor B", valor: 9800, percentual: "25%" },
      { nome: "Vendedor C", valor: 7100, percentual: "18%" },
      { nome: "Vendedor D", valor: 6400, percentual: "18%" },
    ],
    porCliente: [
      { nome: "Distribuidora Exemplo Ltda", valor: 9800, percentual: "25%" },
      { nome: "Comercial Ficticia S.A.", valor: 7600, percentual: "20%" },
      { nome: "Atacadista Modelo Eireli", valor: 6200, percentual: "16%" },
      { nome: "Mercado Referencia Ltda", valor: 5100, percentual: "13%" },
      { nome: "Rede Exemplo Comercio", valor: 4300, percentual: "11%" },
    ],
    detalhePorCliente: {
      "Distribuidora Exemplo Ltda": [
        { titulo: "NF 4021", vencimento: "05/07/2026", valor: 4200, numeroNF: "004021" },
        { titulo: "NF 4088", vencimento: "18/07/2026", valor: 5600, numeroNF: "004088" },
      ],
      "Comercial Ficticia S.A.": [
        { titulo: "NF 3987", vencimento: "22/06/2026", valor: 7600, numeroNF: "003987" },
      ],
      "Atacadista Modelo Eireli": [
        { titulo: "NF 4102", vencimento: "30/06/2026", valor: 6200, numeroNF: "004102" },
      ],
      "Mercado Referencia Ltda": [
        { titulo: "NF 4150", vencimento: "10/07/2026", valor: 5100, numeroNF: "004150" },
      ],
      "Rede Exemplo Comercio": [
        { titulo: "NF 4200", vencimento: "12/07/2026", valor: 4300, numeroNF: "004200" },
      ],
    },
    detalhePorRepresentante: {
      "Vendedor A": [
        { cliente: "Distribuidora Exemplo Ltda", vencimento: "05/07/2026", valor: 4200, numeroNF: "004021" },
        { cliente: "Rede Exemplo Comercio", vencimento: "12/07/2026", valor: 11000, numeroNF: "004055" },
      ],
      "Vendedor B": [
        { cliente: "Atacadista Modelo Eireli", vencimento: "30/06/2026", valor: 6200, numeroNF: "004102" },
        { cliente: "Mercado Referencia Ltda", vencimento: "10/07/2026", valor: 3600, numeroNF: "004151" },
      ],
      "Vendedor C": [
        { cliente: "Comercial Ficticia S.A.", vencimento: "22/06/2026", valor: 7100, numeroNF: "003988" },
      ],
      "Vendedor D": [
        { cliente: "Mercado Referencia Ltda", vencimento: "15/07/2026", valor: 6400, numeroNF: "004160" },
      ],
    },
  },
  contratosComerciais: [
    { rede: "Rede Central", associado: "Vendedor A", cliente: "Distribuidora Exemplo Ltda", dataInicio: "01/01/2026", dataVencimento: "31/12/2026", porcentagem: "3,5%", valor: 180000, link: "Ver documento" },
    { rede: "Distribuidora Norte", associado: "Vendedor B", cliente: "Comercial Ficticia S.A.", dataInicio: "15/02/2026", dataVencimento: "14/02/2027", porcentagem: "4,0%", valor: 220000, link: "Ver documento" },
    { rede: "Atacado Sul", associado: "Vendedor C", cliente: "Atacadista Modelo Eireli", dataInicio: "01/03/2026", dataVencimento: "28/02/2027", porcentagem: "3,0%", valor: 150000, link: "Ver documento" },
    { rede: "Mercado Leste", associado: "Vendedor D", cliente: "Mercado Referencia Ltda", dataInicio: "10/04/2026", dataVencimento: "09/04/2027", porcentagem: "3,8%", valor: 195000, link: "Ver documento" },
    { rede: "Rede Oeste", associado: "Vendedor E", cliente: "Rede Exemplo Comercio", dataInicio: "20/05/2026", dataVencimento: "19/05/2027", porcentagem: "4,2%", valor: 168000, link: "Ver documento" },
  ],
  saldoEntregas: [
    { dataCadastro: "02/07/2026", cliente: "Distribuidora Exemplo Ltda", cnpj: "12.345.678/0001-90", numeroPedido: "PED-1001", produto: "Suco Natural Laranja 1L", quantidadePendente: 120 },
    { dataCadastro: "05/07/2026", cliente: "Comercial Ficticia S.A.", cnpj: "23.456.789/0001-01", numeroPedido: "PED-1002", produto: "Água de Coco 500ml", quantidadePendente: 80 },
    { dataCadastro: "08/07/2026", cliente: "Atacadista Modelo Eireli", cnpj: "34.567.890/0001-12", numeroPedido: "PED-1003", produto: "Refrigerante Guaraná 2L", quantidadePendente: 200 },
    { dataCadastro: "11/07/2026", cliente: "Mercado Referencia Ltda", cnpj: "45.678.901/0001-23", numeroPedido: "PED-1004", produto: "Barra de Cereal Cx 12un", quantidadePendente: 45 },
    { dataCadastro: "14/07/2026", cliente: "Rede Exemplo Comercio", cnpj: "56.789.012/0001-34", numeroPedido: "PED-1005", produto: "Biscoito Integral Cx 24un", quantidadePendente: 60 },
    { dataCadastro: "17/07/2026", cliente: "Distribuidora Exemplo Ltda", cnpj: "12.345.678/0001-90", numeroPedido: "PED-1006", produto: "Suco Natural Uva 1L", quantidadePendente: 90 },
    { dataCadastro: "20/07/2026", cliente: "Comercial Ficticia S.A.", cnpj: "23.456.789/0001-01", numeroPedido: "PED-1007", produto: "Suco Natural Laranja 1L", quantidadePendente: 150 },
  ],
  analiseVendas: {
    meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
    redes: [
      { rede: "Rede Central", percentualTotal: "26,5%", valoresMensais: [28000, 30000, 32000, 31000, 33000, 34000, 36000, 35000], totalGeral: 259000 },
      { rede: "Distribuidora Norte", percentualTotal: "20,3%", valoresMensais: [22000, 23000, 24000, 25000, 24000, 26000, 27000, 28000], totalGeral: 199000 },
      { rede: "Atacado Sul", percentualTotal: "16,5%", valoresMensais: [18000, 19000, 20000, 19500, 21000, 20500, 22000, 21500], totalGeral: 161500 },
      { rede: "Mercado Leste", percentualTotal: "14,5%", valoresMensais: [16000, 16500, 17000, 17500, 18000, 18500, 19000, 19500], totalGeral: 142000 },
      { rede: "Rede Oeste", percentualTotal: "12,6%", valoresMensais: [14000, 14500, 15000, 15500, 15000, 16000, 16500, 17000], totalGeral: 123500 },
      { rede: "Rede Nordeste", percentualTotal: "9,6%", valoresMensais: [10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500], totalGeral: 94000 },
    ],
  },
}
