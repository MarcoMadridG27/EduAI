"use client"
import { useState, useRef } from "react"
import { Edit3, Check, ImagePlus, Trash2 } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────
export type Block =
  | { id: string; type: "text"; title: string; content: string }
  | { id: string; type: "image"; title: string; src: string }

export function makeId() {
  if (globalThis.window !== undefined && globalThis.crypto) {
    if (globalThis.crypto.randomUUID) {
      return globalThis.crypto.randomUUID().slice(0, 8)
    }
    const array = new Uint32Array(1)
    globalThis.crypto.getRandomValues(array)
    return array[0].toString(36).slice(0, 8)
  }
  return Date.now().toString(36).slice(-8)
}

// ── Editable inline field ─────────────────────────────────────────────────────
export function EditableField({
  value, onChange, multiline = false, cls = "", placeholder = "—vacío—",
}: Readonly<{ value: string; onChange: (v: string) => void; multiline?: boolean; cls?: string; placeholder?: string }>) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const confirm = () => { onChange(draft); setEditing(false) }
  if (editing)
    return (
      <span className="inline-flex items-start gap-1 w-full">
        {multiline
          ? <textarea autoFocus rows={4} className={`border border-blue-400 rounded px-1 text-inherit font-inherit w-full resize-y bg-blue-50 outline-none ${cls}`} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Escape" && setEditing(false)} />
          : <input autoFocus className={`border border-blue-400 rounded px-1 text-inherit font-inherit w-full bg-blue-50 outline-none ${cls}`} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => {
              if (e.key === "Enter") {
                confirm();
              }
              if (e.key === "Escape") {
                setEditing(false);
              }
            }} />}
        <button onClick={confirm} className="flex-shrink-0 mt-0.5 text-emerald-600 hover:text-emerald-800"><Check className="h-4 w-4" /></button>
      </span>
    )
  return (
    <button
      type="button"
      className={`group relative cursor-pointer hover:bg-blue-50 hover:outline hover:outline-1 hover:outline-blue-300 rounded px-0.5 transition-all text-left bg-transparent border-0 p-0 font-inherit ${cls}`}
      onClick={() => { setDraft(value); setEditing(true) }}
      title="Clic para editar"
    >
      {value || <span className="text-slate-300 italic text-xs">{placeholder}</span>}
      <Edit3 className="absolute -top-1 -right-1 h-3 w-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}

// ── Dynamic block renderer (app style) ───────────────────────────────────────
export function BlockCard({ block, onUpdate, onRemove }: Readonly<{
  block: Block
  onUpdate: (b: Block) => void
  onRemove: () => void
}>) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onUpdate({ ...block, src: ev.target?.result as string } as Block)
    reader.readAsDataURL(file)
  }

  return (
    <div className="relative group/block bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all mt-3">
      {/* Controls */}
      <div className="absolute -top-3 right-2 flex items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity z-10">
        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {block.type === "text" ? "Texto" : "Imagen"}
        </span>
        <button onClick={onRemove} className="bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5" title="Eliminar bloque">
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      <div className="p-4">
        {/* Title */}
        <h4 className="font-bold text-blue-700 text-sm mb-2 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-600 rounded-full inline-block flex-shrink-0" />
          <EditableField value={block.title} onChange={v => onUpdate({ ...block, title: v })} placeholder="Título del bloque" cls="font-bold text-blue-700" />
        </h4>

        {block.type === "text" && (
          <p className="text-sm text-slate-700 leading-relaxed">
            <EditableField value={block.content} onChange={v => onUpdate({ ...block, content: v })} multiline placeholder="Escribe el contenido aquí..." />
          </p>
        )}

        {block.type === "image" && (
          <div className="flex flex-col items-center gap-2">
            {block.src ? (
              <div className="relative w-full">
                <img src={block.src} alt={block.title} className="w-full max-h-56 object-contain rounded-lg border border-slate-200" />
                <button onClick={() => fileRef.current?.click()} className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded-lg shadow">
                  Cambiar imagen
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="w-full h-32 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center gap-2 text-blue-500 hover:bg-blue-50 transition-colors">
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm font-medium">Clic para subir imagen</span>
                <span className="text-xs text-slate-400">PNG, JPG, GIF</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Add block toolbar ─────────────────────────────────────────────────────────
export function AddBlockBar({ onAdd }: Readonly<{ onAdd: (b: Block) => void }>) {
  return (
    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-dashed border-slate-300">
      <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Añadir bloque:</span>
      {/* Botón de agregar texto eliminado según petición del usuario */}
      {/* Botón de imagen eliminado */}
    </div>
  )
}
