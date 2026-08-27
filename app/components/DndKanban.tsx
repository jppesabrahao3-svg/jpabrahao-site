"use client"

import { ReactNode, useState } from "react"
import { DndContext, DragEndEvent, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

type Colors = { surface: string; card: string; border: string; green: string; muted: string }

export default function DndKanban<T extends { id: string }>({
  columns, cards, getColumn, renderCard, colors: C,
}: {
  columns: string[]
  cards: T[]
  getColumn: (item: T) => string
  renderCard: (item: T) => ReactNode
  colors: Colors
}) {
  const [colOf, setColOf] = useState<Record<string, string>>(() =>
    Object.fromEntries(cards.map((c) => [c.id, getColumn(c)]))
  )

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const onDragEnd = (e: DragEndEvent) => {
    const overId = e.over?.id
    if (!overId) return
    setColOf((prev) => ({ ...prev, [String(e.active.id)]: String(overId) }))
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, minmax(190px, 1fr))`, gap: 12, overflowX: "auto" as const }}>
        {columns.map((col) => (
          <Column key={col} id={col} label={col} colors={C}>
            {cards.filter((c) => colOf[c.id] === col).map((c) => (
              <DraggableCard key={c.id} id={c.id}>{renderCard(c)}</DraggableCard>
            ))}
          </Column>
        ))}
      </div>
    </DndContext>
  )
}

function Column({ id, label, children, colors: C }: { id: string; label: string; children: ReactNode; colors: Colors }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${isOver ? C.green : C.border}`,
        borderRadius: 10,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minHeight: 220,
        transition: "border-color 120ms ease",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: C.muted, textTransform: "uppercase" as const, padding: "4px 4px 6px" }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function DraggableCard({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    touchAction: "none",
    zIndex: isDragging ? 10 : "auto" as const,
    position: "relative" as const,
  }
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  )
}
