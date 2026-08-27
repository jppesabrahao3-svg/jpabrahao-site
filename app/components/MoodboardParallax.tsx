"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type MoodboardItem = { src: string; type: "image" | "video"; width: number; height: number }

type Colors = {
  bg: string
  border: string
  green: string
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 999.123) * 10000
  return x - Math.floor(x)
}

// Math.sin pode divergir no ultimo digito entre o V8 do servidor e do navegador,
// o que quebra a hidratacao se o valor cru for usado no style. Arredondar corta essa diferenca.
function round(n: number, decimals = 2) {
  const f = 10 ** decimals
  return Math.round(n * f) / f
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function shuffleDeterministic<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const r = round(seededRandom(i * 12.9898 + 3), 6)
    const j = Math.floor(r * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

type CellLayout = { left: number; top: number; rotation: number; depth: number; z: number }

// Cada card recebe uma posicao ancorada numa celula de grade (sem colisao entre celulas),
// com jitter pequeno e rotacao leve dentro da propria celula para manter o ar organico.
function getCellLayout(cellIndex: number, cols: number, rows: number): CellLayout {
  const col = cellIndex % cols
  const row = Math.floor(cellIndex / cols)
  const cellW = 100 / cols
  const cellH = 100 / rows
  const baseLeft = (col + 0.5) * cellW
  const baseTop = (row + 0.5) * cellH
  const jitterX = (seededRandom(cellIndex * 3.17 + 1) - 0.5) * cellW * 0.55
  const jitterY = (seededRandom(cellIndex * 7.71 + 2) - 0.5) * cellH * 0.55
  const rotation = -6 + seededRandom(cellIndex * 5.31 + 3) * 14
  const depth = 0.35 + seededRandom(cellIndex * 2.27 + 5) * 1.15

  // depth vai de 0.35 a 1.5 -> normaliza pra um z-index de imagem entre 1 e 10.
  const z = 1 + Math.round(((depth - 0.35) / (1.5 - 0.35)) * 9)

  return {
    left: round(baseLeft + jitterX),
    top: round(baseTop + jitterY),
    rotation: round(rotation),
    depth: round(depth, 3),
    z,
  }
}

// Videos sempre por cima de qualquer imagem, mesmo que uma imagem vizinha
// invada visualmente a borda da celula do video.
const VIDEO_Z_BASE = 20

const IMAGE_WIDTH_MIN = 140
const IMAGE_WIDTH_MAX = 260
const VIDEO_WIDTH = 230

function widthFor(item: MoodboardItem): number {
  if (item.type === "video") return VIDEO_WIDTH
  const roll = seededRandom(hashString(item.src) * 0.0001 + 7)
  return Math.round(IMAGE_WIDTH_MIN + roll * (IMAGE_WIDTH_MAX - IMAGE_WIDTH_MIN))
}

function gridDimsFor(total: number) {
  const cols = total >= 32 ? 8 : total >= 18 ? 5 : 4
  const rows = Math.max(1, Math.ceil(total / cols))
  return { cols, rows }
}

// Distribui os itens embaralhados pelas celulas da grade; os videos ficam presos
// a duas celulas nao-adjacentes proximas do centro, cada um na sua propria celula.
function useMoodboardLayout(items: MoodboardItem[]) {
  return useMemo(() => {
    const total = items.length
    const { cols, rows } = gridDimsFor(total)

    const images = items.filter((it) => it.type === "image")
    const videos = items.filter((it) => it.type === "video")
    const shuffledImages = shuffleDeterministic(images)

    const midRow = Math.floor(rows / 2)
    const colA = Math.max(0, Math.floor(cols / 2) - 1)
    const colB = Math.min(cols - 1, Math.floor(cols / 2) + 1)
    const reservedCells = [midRow * cols + colA, midRow * cols + colB].slice(0, videos.length)
    const reservedSet = new Set(reservedCells)

    const laidOut: { item: MoodboardItem; layout: CellLayout; w: number }[] = []
    let imgPtr = 0
    let vidPtr = 0

    for (let cell = 0; cell < rows * cols; cell++) {
      let item: MoodboardItem | undefined
      let isVideo = false
      if (reservedSet.has(cell) && vidPtr < videos.length) {
        item = videos[vidPtr++]
        isVideo = true
      } else if (imgPtr < shuffledImages.length) {
        item = shuffledImages[imgPtr++]
      }
      if (!item) continue
      const layout = getCellLayout(cell, cols, rows)
      if (isVideo) layout.z = VIDEO_Z_BASE + vidPtr
      laidOut.push({ item, layout, w: widthFor(item) })
    }

    const rowHeightPx = 200
    const containerHeight = rows * rowHeightPx + 100

    return { laidOut, cols, rows, containerHeight }
  }, [items])
}

export default function MoodboardParallax({ items, colors: C }: { items: MoodboardItem[]; colors: Colors }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef<{ x: number; y: number }[]>([])
  const rafRef = useRef<number | null>(null)

  const [reduced, setReduced] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const { laidOut, containerHeight } = useMoodboardLayout(items)

  useEffect(() => {
    currentRef.current = laidOut.map(() => ({ x: 0, y: 0 }))
  }, [laidOut])

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightboxIndex])

  useEffect(() => {
    if (reduced) return
    const el = containerRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      targetRef.current = { x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) }
    }
    const onLeave = () => {
      targetRef.current = { x: 0, y: 0 }
    }

    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const maxOffset = 30

    const tick = () => {
      const target = targetRef.current
      laidOut.forEach(({ layout }, i) => {
        const cur = currentRef.current[i] ?? { x: 0, y: 0 }
        const tx = target.x * maxOffset * layout.depth
        const ty = target.y * maxOffset * layout.depth
        cur.x += (tx - cur.x) * 0.07
        cur.y += (ty - cur.y) * 0.07
        currentRef.current[i] = cur
        const node = itemRefs.current[i]
        if (node) {
          node.style.transform = `translate(-50%, -50%) translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0) rotate(${layout.rotation}deg)`
        }
      })
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [reduced, laidOut])

  const active = lightboxIndex !== null ? laidOut[lightboxIndex]?.item ?? null : null

  if (reduced) {
    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, padding: "0 20px 60px" }}>
          {laidOut.map(({ item }, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setLightboxIndex(i)}
              style={{
                position: "relative", padding: 0, cursor: "pointer", border: `1px solid ${C.border}`,
                borderRadius: 10, overflow: "hidden", backgroundColor: C.bg,
                aspectRatio: `${item.width} / ${item.height}`,
              }}
            >
              {item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.src} alt="Exemplo de arte para redes sociais criada com IA" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <video src={item.src} muted loop autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              )}
            </button>
          ))}
        </div>
        {active && (
          <Lightbox item={active} colors={C} onClose={() => setLightboxIndex(null)} />
        )}
      </>
    )
  }

  return (
    <>
      <div ref={containerRef} style={{ position: "relative", height: containerHeight, maxWidth: 1180, margin: "0 auto", marginBottom: 24 }}>
        {laidOut.map(({ item, layout, w }, i) => (
          <div
            key={item.src}
            style={{
              position: "absolute",
              left: `${layout.left}%`,
              top: `${layout.top}%`,
              width: w,
              zIndex: layout.z,
            }}
          >
            <div
              ref={(node) => { itemRefs.current[i] = node }}
              style={{
                width: "100%",
                aspectRatio: `${item.width} / ${item.height}`,
                transform: `translate(-50%, -50%) rotate(${layout.rotation}deg)`,
                willChange: "transform",
              }}
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                style={{
                  width: "100%", height: "100%", padding: 0, cursor: "pointer",
                  border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden",
                  backgroundColor: C.bg, boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
                }}
              >
                {item.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.src} alt="Exemplo de arte para redes sociais criada com IA" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <video src={item.src} muted loop autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <Lightbox item={active} colors={C} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  )
}

function Lightbox({ item, colors: C, onClose }: { item: MoodboardItem; colors: Colors; onClose: () => void }) {
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(4,6,3,0.85)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", maxWidth: "min(92vw, 640px)", maxHeight: "88vh" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          style={{ position: "absolute", top: -14, right: -14, width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.border}`, backgroundColor: C.bg, color: "#fff", cursor: "pointer", fontSize: 18, lineHeight: 1, zIndex: 1 }}
        >
          ×
        </button>
        {item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.src} alt="Exemplo de arte para redes sociais criada com IA" style={{ display: "block", width: "100%", maxHeight: "88vh", objectFit: "contain", borderRadius: 10, border: `1px solid ${C.border}` }} />
        ) : (
          <video src={item.src} controls autoPlay loop playsInline style={{ display: "block", width: "100%", maxHeight: "88vh", borderRadius: 10, border: `1px solid ${C.border}` }} />
        )}
      </div>
    </div>
  )
}
