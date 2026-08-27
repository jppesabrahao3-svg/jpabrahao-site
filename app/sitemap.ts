import type { MetadataRoute } from "next"

const BASE_URL = "https://jpabrahao.com.br"

export default function sitemap(): MetadataRoute.Sitemap {
  const rotas = [
    { path: "", priority: 1 },
    { path: "/marketing-com-ia", priority: 0.7 },
    { path: "/demo/hub-marketing", priority: 0.7 },
    { path: "/demo/hub-comercial", priority: 0.7 },
    { path: "/demo/gestor/painel", priority: 0.7 },
    { path: "/demo/gestor/fluxo-caixa", priority: 0.6 },
    { path: "/demo/gestor/compromissos", priority: 0.6 },
    { path: "/demo/gestor/investimentos", priority: 0.6 },
  ]

  return rotas.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date(),
    priority: r.priority,
  }))
}
