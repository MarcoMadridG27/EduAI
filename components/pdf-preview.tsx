"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Download, Loader2 } from "lucide-react"
import type { SessionData } from "@/app/page"
import { toast } from "sonner"
import { EditableField, BlockCard, AddBlockBar, type Block } from "@/components/pdf-preview-blocks"

interface PdfPreviewProps {
  session: SessionData
  onClose: () => void
}

const BAR = "bg-[#1565C0] text-white font-bold text-[9pt] px-3 py-1.5 mt-4 mb-1"
const SUBH = "bg-[#1976D2] text-white text-[8.5pt] px-3 py-1 font-semibold"
const PAGE: React.CSSProperties = {
  width: "210mm", padding: "16mm 18mm 18mm 18mm",
  fontFamily: "Helvetica, Arial, sans-serif", fontSize: "9pt",
  color: "#212121", lineHeight: 1.4,
}

export function PdfPreview({ session, onClose }: Readonly<PdfPreviewProps>) {
  const [data, setData] = useState<SessionData>(session)
  const [isExporting, setIsExporting] = useState(false)
  const [page1Blocks, setPage1Blocks] = useState<Block[]>([])
  const [page2Blocks, setPage2Blocks] = useState<Block[]>([])

  const dg = data.datosGenerales || {}
  const sm = data.secuenciaMetodologica || { inicio: "", desarrollo: "", cierre: "" }
  const setDg = (k: string, v: string) => setData(p => ({ ...p, datosGenerales: { ...p.datosGenerales, [k]: v } }))
  const setSm = (k: "inicio" | "desarrollo" | "cierre", v: string) =>
    setData(p => ({ ...p, secuenciaMetodologica: { ...p.secuenciaMetodologica, [k]: v } }))

  const updateBlock = (list: Block[], setList: (b: Block[]) => void, id: string, updated: Block) =>
    setList(list.map(b => b.id === id ? updated : b))
  const removeBlock = (list: Block[], setList: (b: Block[]) => void, id: string) =>
    setList(list.filter(b => b.id !== id))

  const updateCriterio = (i: number, v: string, currentCriterios: string[]) => {
    const newCrits = [...currentCriterios]
    newCrits[i] = v
    setData(p => {
      const ra = p.recursosAdicionales
      if (!ra?.instrumentoEvaluacionGenerado) return p
      return {
        ...p,
        recursosAdicionales: {
          ...ra,
          instrumentoEvaluacionGenerado: {
            ...ra.instrumentoEvaluacionGenerado,
            criterios_o_items: newCrits
          }
        }
      }
    })
  }

  async function handleGeneratePDF() {
    setIsExporting(true)
    try {
      const url = process.env.NEXT_PUBLIC_PDF_URL || ""
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            datosGenerales: data.datosGenerales, tema: data.tema, ciclo: data.ciclo,
            horasClase: data.horasClase, competenciasSeleccionadas: data.competenciasSeleccionadas,
            capacidades: data.capacidades, materialesDisponibles: data.materialesDisponibles,
            actividades_previas: data.actividades_previas,
            enfoqueTransversal: data.enfoqueTransversal, competenciaTransversal: data.competenciaTransversal,
            competenciaDescripcion: data.competenciaDescripcion, propositoSesion: data.propositoSesion,
            criteriosEvaluacion: data.criteriosEvaluacion, evidenciasAprendizaje: data.evidenciasAprendizaje,
            secuenciaMetodologica: data.secuenciaMetodologica, distribucionHoras: data.distribucionHoras,
            materialesDidacticosSugeridos: data.materialesDidacticosSugeridos,
            recursosAdicionales: data.recursosAdicionales,
          }
        }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || `Error ${res.status}`) }
      const blob = await res.blob()
      const link = document.createElement("a")
      link.href = globalThis.URL.createObjectURL(blob)
      link.download = `sesion-${data.tema?.substring(0, 20) ?? "eduai"}-${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link); link.click(); link.remove()
      globalThis.URL.revokeObjectURL(link.href)
      toast.success("¡PDF descargado exitosamente!")
    } catch (err) {
      toast.error(`Error al generar PDF: ${err instanceof Error ? err.message : "Error desconocido"}`)
    } finally { setIsExporting(false) }
  }

  let mats: string[] = []
  if (Array.isArray(data.materialesDidacticosSugeridos)) {
    mats = data.materialesDidacticosSugeridos
  } else if (data.materialesDidacticosSugeridos) {
    mats = [String(data.materialesDidacticosSugeridos)]
  }
  
  const comps: string[] = Array.isArray(data.competenciasSeleccionadas) ? data.competenciasSeleccionadas : []
  const caps: string[] = Array.isArray(data.capacidades) ? data.capacidades : []

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm">

      {/* ── Toolbar ── */}
      <div className="flex-shrink-0 bg-[#1565C0] text-white flex items-center justify-between px-4 py-2 shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/pinguinos/pinguino_pensando.png" alt="Pingüino" className="h-10 w-10 object-contain drop-shadow-md" />
          <span className="font-bold text-sm">Vista Previa del PDF</span>
          <span className="hidden sm:inline text-xs bg-blue-700/60 text-blue-100 rounded px-2 py-0.5">
            Clic en texto para editar · botones + para añadir bloques
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleGeneratePDF} disabled={isExporting}
            className="bg-white text-[#1565C0] hover:bg-blue-50 font-bold h-9 px-4 text-sm shadow">
            {isExporting
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generando...</>
              : <><Download className="h-4 w-4 mr-2" />Generar PDF</>}
          </Button>
          <button onClick={onClose} className="ml-1 text-white hover:text-blue-200 transition-colors"><X className="h-5 w-5" /></button>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div className="flex-1 overflow-y-auto bg-slate-200 py-8 px-4 flex flex-col items-center gap-6">

        {/* ══ HOJA 1 ══ */}
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 self-start" style={{ marginLeft: "calc(50% - 105mm)" }}>
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Hoja 1 de 2</span>
            <span className="text-slate-500 text-xs">Datos generales · Preparación · Propósitos</span>
          </div>

          <div className="bg-white shadow-2xl rounded-sm" style={PAGE}>
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#1565C0] pb-2 mb-3">
              <div><img src="/sesion_+.png" alt="Sesión+" className="h-8 w-auto" /></div>
              <div className="text-center flex-1 px-4">
                <div className="text-[#1565C0] font-bold text-[12pt]">SESIÓN DE APRENDIZAJE</div>
                <div className="text-[#1976D2] text-[8.5pt]">
                  Área: <EditableField value={dg.area || data.tema || "Matemática"} onChange={v => setDg("area", v)} />
                  &nbsp;·&nbsp;Unidad: <EditableField value={dg.unidad || ""} onChange={v => setDg("unidad", v)} />
                  &nbsp;·&nbsp;<EditableField value={dg.sesion_num || ""} onChange={v => setDg("sesion_num", v)} />
                </div>
              </div>
              <div className="text-transparent">Sesión+</div>
            </div>

            {/* I. Datos */}
            <div className={BAR}>I.&nbsp;&nbsp;DATOS DE LA SESIÓN</div>
            <table className="w-full border-collapse text-[8.5pt]">
              {[
                ["I.E.:", <EditableField key="ie" value={dg.ie||""} onChange={v=>setDg("ie",v)}/>, "UGEL:", <EditableField key="ugel" value={dg.ugel||""} onChange={v=>setDg("ugel",v)}/>],
                ["DOCENTE:", <EditableField key="doc" value={dg.docente||""} onChange={v=>setDg("docente",v)}/>, "FECHA:", <EditableField key="fecha" value={dg.fecha||""} onChange={v=>setDg("fecha",v)}/>],
                ["GRADO/CICLO:", <span key="gc"><EditableField value={dg.grado||""} onChange={v=>setDg("grado",v)}/>&nbsp;—&nbsp;<EditableField value={dg.ciclo||data.ciclo||""} onChange={v=>setDg("ciclo",v)}/></span>, "SECCIÓN:", <EditableField key="sec" value={dg.seccion||""} onChange={v=>setDg("seccion",v)}/>],
                ["DURACIÓN:", <EditableField key="dur" value={dg.duracion||`${data.horasClase} h`} onChange={v=>setDg("duracion",v)}/>, "LUGAR:", <EditableField key="lug" value={dg.lugar||""} onChange={v=>setDg("lugar",v)}/>],
              ].map((r,i) => (
                <tr key={r[0] as string} className="border-b border-[#90A4AE]" style={{ background: i%2===0?"#fff":"#F5F5F5" }}>
                  <td className="py-1 px-2 font-bold text-[#1565C0] w-[24%]">{r[0]}</td>
                  <td className="py-1 px-2 w-[26%]">{r[1]}</td>
                  <td className="py-1 px-2 font-bold text-[#1565C0] w-[24%]">{r[2]}</td>
                  <td className="py-1 px-2 w-[26%]">{r[3]}</td>
                </tr>
              ))}
            </table>

            {/* II. Preparación */}
            <div className={BAR}>II.&nbsp;&nbsp;PREPARACIÓN DE LA SESIÓN</div>
            <div className="flex">
              <div className="flex-1 border border-[#90A4AE]">
                <div className={SUBH}>¿QUÉ ACTIVIDADES HACER ANTES?</div>
                <div className="p-2 bg-[#E3F2FD] min-h-[36px] text-[8.5pt]">
                  <EditableField value={data.actividades_previas||""} onChange={v=>setData(p=>({...p,actividades_previas:v}))} multiline />
                </div>
              </div>
              <div className="flex-1 border border-[#90A4AE] border-l-0">
                <div className={SUBH}>¿QUÉ RECURSOS O MATERIALES?</div>
                <div className="p-2 bg-[#E3F2FD] min-h-[36px] text-[8.5pt]">
                  {mats.length > 0
                    ? <ul>{mats.map((m)=><li key={m}>• {m}</li>)}</ul>
                    : <EditableField value={data.materialesDisponibles||""} onChange={v=>setData(p=>({...p,materialesDisponibles:v}))} multiline />}
                </div>
              </div>
            </div>

            {/* Título */}
            <div className="flex items-center border border-[#1565C0] bg-[#E3F2FD] mt-3 px-3 py-2">
              <span className="font-bold text-[#1565C0] mr-3 flex-shrink-0">TÍTULO:</span>
              <span className="font-bold text-[11pt] flex-1 text-center">
                <EditableField value={(dg.titulo||data.tema||"").toUpperCase()} onChange={v=>setDg("titulo",v)} />
              </span>
            </div>
            <div className="flex items-start border border-[#90A4AE] px-3 py-1.5 mt-1">
              <span className="font-bold text-[#1565C0] mr-2 flex-shrink-0">PROPÓSITO:</span>
              <span className="flex-1"><EditableField value={data.propositoSesion||""} onChange={v=>setData(p=>({...p,propositoSesion:v}))} multiline /></span>
            </div>

            {/* III. Propósitos */}
            <div className={BAR}>III.&nbsp;&nbsp;PROPÓSITOS DE APRENDIZAJE Y EVIDENCIAS</div>
            <table className="w-full border-collapse text-[8.5pt]">
              <thead>
                <tr className="bg-[#1976D2] text-white">
                  {["COMPETENCIAS Y CAPACIDADES","DESEMPEÑOS","CRITERIOS DE EVALUACIÓN","EVIDENCIA"].map(h=>(
                    <th key={h} className="py-1.5 px-2 font-semibold text-center border-r border-[#1565C0] last:border-r-0 text-[8pt]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#E3F2FD] align-top">
                  <td className="py-2 px-2 border border-[#90A4AE]">
                    {comps[0] && <div className="font-bold mb-1">{comps[0]}</div>}
                    {caps.map((c)=><div key={c}>• {c}</div>)}
                  </td>
                  <td className="py-2 px-2 border border-[#90A4AE]"><EditableField value={data.competenciaDescripcion||""} onChange={v=>setData(p=>({...p,competenciaDescripcion:v}))} multiline /></td>
                  <td className="py-2 px-2 border border-[#90A4AE]"><EditableField value={data.criteriosEvaluacion||""} onChange={v=>setData(p=>({...p,criteriosEvaluacion:v}))} multiline /></td>
                  <td className="py-2 px-2 border border-[#90A4AE]"><EditableField value={data.evidenciasAprendizaje||""} onChange={v=>setData(p=>({...p,evidenciasAprendizaje:v}))} multiline /></td>
                </tr>
              </tbody>
            </table>
            <div className="flex mt-1">
              <div className="border border-[#90A4AE]" style={{width:"30%"}}>
                <div className={SUBH}>ENFOQUE TRANSVERSAL</div>
                <div className="p-2 text-[8.5pt] font-bold"><EditableField value={data.enfoqueTransversal||""} onChange={v=>setData(p=>({...p,enfoqueTransversal:v}))} multiline /></div>
              </div>
              <div className="border border-[#90A4AE] border-l-0 flex-1">
                <div className={SUBH}>ACTITUDES OBSERVABLES</div>
                <div className="p-2 text-[8.5pt]"><EditableField value={data.actitudes_observables||data.competenciaTransversal||""} onChange={v=>setData(p=>({...p,competenciaTransversal:v}))} multiline /></div>
              </div>
            </div>

            {/* Dynamic blocks page 1 */}
            {page1Blocks.map(b => (
              <BlockCard key={b.id} block={b}
                onUpdate={updated => updateBlock(page1Blocks, setPage1Blocks, b.id, updated)}
                onRemove={() => removeBlock(page1Blocks, setPage1Blocks, b.id)} />
            ))}
            <AddBlockBar onAdd={b => setPage1Blocks(prev => [...prev, b])} />
          </div>
        </div>

        {/* ══ HOJA 2 ══ */}
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 self-start" style={{ marginLeft: "calc(50% - 105mm)" }}>
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Hoja 2 de 2</span>
            <span className="text-slate-500 text-xs">Secuencia didáctica · Extensión · Firmas</span>
          </div>

          <div className="bg-white shadow-2xl rounded-sm" style={PAGE}>
            {/* Mini-header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <div><img src="/sesion_icon.png" alt="Sesión+" className="h-4 w-auto" /></div>
              <div className="flex-1 text-center text-slate-500 text-[8pt]">
                Continuación · <span className="font-semibold text-slate-700">{dg.titulo||data.tema}</span>
              </div>
              <div className="text-slate-400 text-[8pt]">Pág. 2</div>
            </div>

            {/* IV. Secuencia */}
            <div className={BAR}>IV.&nbsp;&nbsp;SECUENCIA DIDÁCTICA</div>

            <div className="bg-blue-600 text-white font-bold text-[9pt] px-3 py-1 mt-2">
              INICIO <span className="font-normal text-[8pt]">
                (<EditableField value={data.duracion_inicio||"15 min"} onChange={v=>setData(p=>({...p,duracion_inicio:v}))} cls="text-white"/>)
              </span>
            </div>
            <div className="border border-[#90A4AE] p-3 text-[8.5pt] min-h-[56px]">
              <EditableField value={sm.inicio||""} onChange={v=>setSm("inicio",v)} multiline />
            </div>

            <div className="bg-[#1976D2] text-white font-bold text-[9pt] px-3 py-1 mt-2">
              DESARROLLO <span className="font-normal text-[8pt]">
                (<EditableField value={data.duracion_desarrollo||"60 min"} onChange={v=>setData(p=>({...p,duracion_desarrollo:v}))} cls="text-white"/>)
              </span>
            </div>
            <div className="border border-[#90A4AE] p-3 text-[8.5pt] min-h-[80px]">
              <EditableField value={sm.desarrollo||""} onChange={v=>setSm("desarrollo",v)} multiline />
            </div>

            <div className="bg-[#0D47A1] text-white font-bold text-[9pt] px-3 py-1 mt-2">
              CIERRE <span className="font-normal text-[8pt]">
                (<EditableField value={data.duracion_cierre||"15 min"} onChange={v=>setData(p=>({...p,duracion_cierre:v}))} cls="text-white"/>)
              </span>
            </div>
            <div className="border border-[#90A4AE] p-3 text-[8.5pt] min-h-[56px]">
              <EditableField value={sm.cierre||""} onChange={v=>setSm("cierre",v)} multiline />
            </div>

            {/* V. Extensión */}
            <div className="flex items-start border border-[#90A4AE] bg-[#E3F2FD] mt-4 px-3 py-2">
              <span className="font-bold text-[#1565C0] mr-2 flex-shrink-0 text-[8.5pt]">V.&nbsp;EXTENSIÓN (TAREA):</span>
              <span className="text-[8.5pt] flex-1"><EditableField value={data.extension||""} onChange={v=>setData(p=>({...p,extension:v}))} multiline /></span>
            </div>

            {/* VI. Instrumento de evaluación */}
            {(() => {
              const inst = data.recursosAdicionales?.instrumentoEvaluacionGenerado;
              if (!inst) return null;
              return (
                <div className="mt-4">
                  <div className={BAR}>VI.&nbsp;&nbsp;INSTRUMENTO DE EVALUACIÓN: {(inst.tipo_instrumento || "INSTRUMENTO").toUpperCase()}</div>
                  <table className="w-full border-collapse text-[8.5pt]">
                    <thead>
                      <tr className="bg-[#1976D2] text-white">
                        <th className="py-1.5 px-2 font-semibold text-center border-r border-[#1565C0] text-[8pt]">CRITERIOS / ÍTEMS A EVALUAR</th>
                        {(inst.escalas_o_niveles || []).map((e: string) => (
                          <th key={e} className="py-1.5 px-2 font-semibold text-center border-r border-[#1565C0] last:border-r-0 text-[8pt]">{e}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(inst.criterios_o_items || []).map((c: string, i: number) => (
                        <tr key={c} className="bg-[#E3F2FD] align-top border border-[#90A4AE]">
                          <td className="py-2 px-2 border-r border-[#90A4AE]">
                            <EditableField value={c} onChange={v => updateCriterio(i, v, inst.criterios_o_items || [])} multiline />
                          </td>
                          {(inst.escalas_o_niveles || []).map((scale: string) => (
                            <td key={scale} className="border-r border-[#90A4AE] last:border-r-0 bg-white min-w-[30px]"></td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            {/* Dynamic blocks page 2 */}
            {page2Blocks.map(b => (
              <BlockCard key={b.id} block={b}
                onUpdate={updated => updateBlock(page2Blocks, setPage2Blocks, b.id, updated)}
                onRemove={() => removeBlock(page2Blocks, setPage2Blocks, b.id)} />
            ))}
            <AddBlockBar onAdd={b => setPage2Blocks(prev => [...prev, b])} />

            {/* Firmas */}
            <div className="flex justify-around mt-10 text-center text-[8.5pt]">
              <div className="w-[40%]">
                <div className="border-t border-[#212121] mt-8 pt-1 font-bold">
                  <EditableField value={dg.docente||"Docente"} onChange={v=>setDg("docente",v)} />
                </div>
                <div className="text-[#90A4AE] text-[7.5pt]">Docente del Área</div>
              </div>
              <div className="w-[40%]">
                <div className="border-t border-[#212121] mt-8 pt-1 font-bold">V°B° Director(a)</div>
                <div className="text-[#90A4AE] text-[7.5pt]">Dirección I.E.</div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-2 border-t border-[#90A4AE] text-center text-[7.5pt] text-[#90A4AE]">
              Generado con Sesión + · Alineado al CNEB 2016 (RM 649-2016-MINEDU) · {dg.fecha||new Date().toLocaleDateString("es-PE")}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
