import type { SessionData } from "@/app/page"

// Colores Corporativos
const AZUL_HEADER = "1565C0" // Azul Oscuro Títulos
const AZUL_MED = "1976D2"    // Azul Medio
const AZUL_PALIDO = "E3F2FD" // Azul Muy Claro Fondo
const GRIS_LINEA = "90A4AE"  // Gris para bordes
const NEGRO = "212121"
const BLANCO = "FFFFFF"

export async function exportToExcel(data: SessionData) {
  // Carga dinámica de exceljs en el cliente para evitar problemas de SSR
  const ExcelJS = (await import("exceljs")).default
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Sesión de Aprendizaje")

  // Configuración de vista
  worksheet.views = [{ showGridLines: true }]

  // 1. Configuración de Columnas (Cuadrícula base de A a F)
  worksheet.columns = [
    { key: "colA", width: 22 },
    { key: "colB", width: 20 },
    { key: "colC", width: 22 },
    { key: "colD", width: 20 },
    { key: "colE", width: 20 },
    { key: "colF", width: 22 },
  ]

  // Helpers de Estilos
  function styleCell(
    cell: any,
    options: {
      font?: { size?: number; bold?: boolean; color?: string; italic?: boolean }
      fillColor?: string
      align?: "left" | "center" | "right" | "justify"
      valign?: "top" | "middle" | "bottom"
      wrapText?: boolean
      border?: boolean | { top?: boolean; bottom?: boolean; left?: boolean; right?: boolean }
    }
  ) {
    if (options.font) {
      cell.font = {
        name: "Arial",
        size: options.font.size ?? 9,
        bold: !!options.font.bold,
        italic: !!options.font.italic,
        color: options.font.color ? { argb: "FF" + options.font.color } : undefined,
      }
    } else {
      cell.font = { name: "Arial", size: 9 }
    }

    if (options.fillColor) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF" + options.fillColor },
      }
    }

    cell.alignment = {
      horizontal: options.align ?? "left",
      vertical: options.valign ?? "middle",
      wrapText: options.wrapText !== false,
    }

    const thinBorder = { style: "thin" as const, color: { argb: "FF" + GRIS_LINEA } }
    if (options.border === true) {
      cell.border = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder }
    } else if (typeof options.border === "object") {
      cell.border = {
        top: options.border.top ? thinBorder : undefined,
        bottom: options.border.bottom ? thinBorder : undefined,
        left: options.border.left ? thinBorder : undefined,
        right: options.border.right ? thinBorder : undefined,
      }
    }
  }

  function styleRange(worksheet: any, rangeStr: string, options: Parameters<typeof styleCell>[1]) {
    const [start, end] = rangeStr.split(":")
    const startCol = start.charCodeAt(0) - 64
    const startRow = parseInt(start.substring(1), 10)
    const endCol = end.charCodeAt(0) - 64
    const endRow = parseInt(end.substring(1), 10)

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const cell = worksheet.getCell(r, c)
        styleCell(cell, options)
      }
    }
    worksheet.mergeCells(rangeStr)
  }

  // Desestructuración y preparación de datos
  const dg = data.datosGenerales || {}
  const sm = data.secuenciaMetodologica || { inicio: "", desarrollo: "", cierre: "" }

  const inferActividadesPrevias = (sess: SessionData): string[] => {
    const ap = sess.actividades_previas
    if (Array.isArray(ap) && ap.length > 0) return ap
    if (typeof ap === "string" && ap.trim()) {
      return ap.split("\n").map(s => s.trim()).filter(Boolean)
    }
    const inicio = sess.secuenciaMetodologica?.inicio || ""
    if (inicio && typeof inicio === "string") {
      const items = inicio.split(/\n|\.|\s*\d+\.\s*/).map(s => s.trim()).filter(Boolean)
      if (items.length > 0) return items.slice(0, 3)
    }
    return []
  }

  const actPrev = inferActividadesPrevias(data)
  const recMat: string[] = Array.isArray(data.materialesDidacticosSugeridos)
    ? data.materialesDidacticosSugeridos
    : data.materialesDidacticosSugeridos
    ? [String(data.materialesDidacticosSugeridos)]
    : data.materialesDisponibles
    ? [String(data.materialesDisponibles)]
    : []

  const comps: string[] = Array.isArray(data.competenciasSeleccionadas) ? data.competenciasSeleccionadas : []
  const caps: string[] = Array.isArray(data.capacidades) ? data.capacidades : []

  // -------------------------------------------------------------
  // ─── 1. ENCABEZADO PRINCIPAL ───
  // -------------------------------------------------------------
  styleRange(worksheet, "A1:F1", {
    font: { size: 14, bold: true, color: AZUL_HEADER },
    align: "center",
  })
  worksheet.getCell("A1").value = "SESIÓN DE APRENDIZAJE"
  worksheet.getRow(1).height = 25

  styleRange(worksheet, "A2:F2", {
    font: { size: 10, bold: true, color: AZUL_MED },
    align: "center",
    border: { bottom: true },
  })
  worksheet.getCell("A2").value = `Área: ${dg.area || data.tema || "Matemática"}   ·   Unidad: ${dg.unidad || "—"}   ·   Sesión+`
  worksheet.getRow(2).height = 20

  let currentRow = 4

  // -------------------------------------------------------------
  // ─── BLOQUE I: DATOS DE LA SESIÓN ───
  // -------------------------------------------------------------
  styleRange(worksheet, `A${currentRow}:F${currentRow}`, {
    font: { size: 10, bold: true, color: BLANCO },
    fillColor: AZUL_HEADER,
    align: "left",
  })
  worksheet.getCell(`A${currentRow}`).value = " I.  DATOS DE LA SESIÓN"
  worksheet.getRow(currentRow).height = 20
  currentRow++

  const tableFields = [
    ["I.E.:", dg.ie || "—", "UGEL:", dg.ugel || "—"],
    ["DOCENTE:", dg.docente || "—", "FECHA:", dg.fecha || "—"],
    ["GRADO/CICLO:", `${dg.grado || "—"}  —  ${dg.ciclo || data.ciclo || "—"}`, "SECCIÓN:", dg.seccion || "—"],
    ["DURACIÓN:", dg.duracion || `${data.horasClase || "—"} h`, "LUGAR:", dg.lugar || "—"],
  ]

  tableFields.forEach((rowFields, index) => {
    const isEven = index % 2 === 0
    const rowBg = isEven ? BLANCO : "F5F5F5"

    // Col 1: Label
    styleCell(worksheet.getCell(currentRow, 1), {
      font: { bold: true, color: AZUL_HEADER },
      fillColor: rowBg,
      border: true,
    })
    worksheet.getCell(currentRow, 1).value = ` ${rowFields[0]}`

    // Col 2-3: Value (Merged)
    styleRange(worksheet, `B${currentRow}:C${currentRow}`, {
      font: { color: NEGRO },
      fillColor: rowBg,
      border: true,
    })
    worksheet.getCell(currentRow, 2).value = rowFields[1]

    // Col 4: Label
    styleCell(worksheet.getCell(currentRow, 4), {
      font: { bold: true, color: AZUL_HEADER },
      fillColor: rowBg,
      border: true,
    })
    worksheet.getCell(currentRow, 4).value = ` ${rowFields[2]}`

    // Col 5-6: Value (Merged)
    styleRange(worksheet, `E${currentRow}:F${currentRow}`, {
      font: { color: NEGRO },
      fillColor: rowBg,
      border: true,
    })
    worksheet.getCell(currentRow, 5).value = rowFields[3]

    worksheet.getRow(currentRow).height = 18
    currentRow++
  })

  currentRow++ // Espaciador

  // -------------------------------------------------------------
  // ─── BLOQUE II: PREPARACIÓN DE LA SESIÓN ───
  // -------------------------------------------------------------
  styleRange(worksheet, `A${currentRow}:F${currentRow}`, {
    font: { size: 10, bold: true, color: BLANCO },
    fillColor: AZUL_HEADER,
    align: "left",
  })
  worksheet.getCell(`A${currentRow}`).value = " II.  PREPARACIÓN DE LA SESIÓN"
  worksheet.getRow(currentRow).height = 20
  currentRow++

  // Sub-encabezados
  styleRange(worksheet, `A${currentRow}:C${currentRow}`, {
    font: { size: 9, bold: true, color: BLANCO },
    fillColor: AZUL_MED,
    align: "center",
    border: true,
  })
  worksheet.getCell(`A${currentRow}`).value = "¿QUÉ ACTIVIDADES HACER ANTES?"

  styleRange(worksheet, `D${currentRow}:F${currentRow}`, {
    font: { size: 9, bold: true, color: BLANCO },
    fillColor: AZUL_MED,
    align: "center",
    border: true,
  })
  worksheet.getCell(`D${currentRow}`).value = "¿QUÉ RECURSOS O MATERIALES?"
  worksheet.getRow(currentRow).height = 18
  currentRow++

  // Contenido de Preparación
  const antesText = actPrev.length > 0 ? actPrev.map(item => `• ${item}`).join("\n") : "—"
  const recursosText = recMat.length > 0 ? recMat.map(item => `• ${item}`).join("\n") : "—"

  // Actividades Antes
  styleRange(worksheet, `A${currentRow}:C${currentRow + 3}`, {
    font: { color: NEGRO },
    fillColor: AZUL_PALIDO,
    align: "left",
    valign: "top",
    border: true,
  })
  worksheet.getCell(`A${currentRow}`).value = antesText

  // Recursos
  styleRange(worksheet, `D${currentRow}:F${currentRow + 3}`, {
    font: { color: NEGRO },
    fillColor: AZUL_PALIDO,
    align: "left",
    valign: "top",
    border: true,
  })
  worksheet.getCell(`D${currentRow}`).value = recursosText

  // Ajustar altura del bloque de preparación
  for (let r = 0; r <= 3; r++) {
    worksheet.getRow(currentRow + r).height = 20
  }
  currentRow += 4

  currentRow++ // Espaciador

  // -------------------------------------------------------------
  // ─── TÍTULO Y PROPÓSITO DE LA SESIÓN ───
  // -------------------------------------------------------------
  // Título
  styleCell(worksheet.getCell(currentRow, 1), {
    font: { bold: true, color: AZUL_HEADER },
    fillColor: AZUL_PALIDO,
    border: { top: true, bottom: true, left: true },
  })
  worksheet.getCell(currentRow, 1).value = " TÍTULO DE LA SESIÓN:"

  styleRange(worksheet, `B${currentRow}:F${currentRow}`, {
    font: { size: 10, bold: true, color: NEGRO },
    fillColor: AZUL_PALIDO,
    align: "center",
    border: { top: true, bottom: true, right: true },
  })
  worksheet.getCell(`B${currentRow}`).value = (dg.titulo || data.tema || "—").toUpperCase()
  worksheet.getRow(currentRow).height = 24
  currentRow++

  // Propósito
  styleCell(worksheet.getCell(currentRow, 1), {
    font: { bold: true, color: AZUL_HEADER },
    fillColor: BLANCO,
    border: { top: true, bottom: true, left: true },
  })
  worksheet.getCell(currentRow, 1).value = " PROPÓSITO:"

  styleRange(worksheet, `B${currentRow}:F${currentRow + 1}`, {
    font: { color: NEGRO },
    fillColor: BLANCO,
    align: "justify",
    valign: "middle",
    border: { top: true, bottom: true, right: true },
  })
  worksheet.getCell(`B${currentRow}`).value = data.propositoSesion || "—"
  worksheet.getRow(currentRow).height = 18
  worksheet.getRow(currentRow + 1).height = 18
  currentRow += 2

  currentRow++ // Espaciador

  // -------------------------------------------------------------
  // ─── BLOQUE III: PROPÓSITOS DE APRENDIZAJE Y EVIDENCIAS ───
  // -------------------------------------------------------------
  styleRange(worksheet, `A${currentRow}:F${currentRow}`, {
    font: { size: 10, bold: true, color: BLANCO },
    fillColor: AZUL_HEADER,
    align: "left",
  })
  worksheet.getCell(`A${currentRow}`).value = " III.  PROPÓSITOS DE APRENDIZAJE Y EVIDENCIAS"
  worksheet.getRow(currentRow).height = 20
  currentRow++

  // Encabezados
  const propHeaders = [
    ["A:B", "COMPETENCIAS Y CAPACIDADES"],
    ["C:C", "DESEMPEÑOS"],
    ["D:D", "CRITERIOS DE EVALUACIÓN"],
    ["E:F", "EVIDENCIA Y INSTRUMENTO"],
  ]
  propHeaders.forEach(ph => {
    const range = ph[0].replace(/[A-Z]/g, (m) => `${m}${currentRow}`)
    styleRange(worksheet, range, {
      font: { size: 8.5, bold: true, color: BLANCO },
      fillColor: AZUL_MED,
      align: "center",
      border: true,
    })
    worksheet.getCell(range.split(":")[0]).value = ph[1]
  })
  worksheet.getRow(currentRow).height = 22
  currentRow++

  // Cargar contenidos
  const compBody = []
  if (comps.length > 0) {
    compBody.push(comps[0])
  }
  caps.forEach(cap => compBody.push(`• ${cap}`))
  const compBodyText = compBody.join("\n")

  const desempText = data.competenciaDescripcion || "—"
  const critText = data.criteriosEvaluacion || "—"
  const evidText = `${data.evidenciasAprendizaje || "—"}\n\nInstrumento:\n${data.recursosAdicionales?.instrumentoEvaluacionGenerado?.tipo_instrumento || "Lista de cotejo"}`

  // Celdas de contenido
  // Competencias y Capacidades (A-B)
  styleRange(worksheet, `A${currentRow}:B${currentRow + 4}`, {
    font: { color: NEGRO },
    fillColor: AZUL_PALIDO,
    align: "left",
    valign: "top",
    border: true,
  })
  worksheet.getCell(`A${currentRow}`).value = compBodyText

  // Desempeños (C)
  styleRange(worksheet, `C${currentRow}:C${currentRow + 4}`, {
    font: { color: NEGRO },
    fillColor: AZUL_PALIDO,
    align: "left",
    valign: "top",
    border: true,
  })
  worksheet.getCell(`C${currentRow}`).value = desempText

  // Criterios (D)
  styleRange(worksheet, `D${currentRow}:D${currentRow + 4}`, {
    font: { color: NEGRO },
    fillColor: AZUL_PALIDO,
    align: "left",
    valign: "top",
    border: true,
  })
  worksheet.getCell(`D${currentRow}`).value = critText

  // Evidencias (E-F)
  styleRange(worksheet, `E${currentRow}:F${currentRow + 4}`, {
    font: { color: NEGRO },
    fillColor: AZUL_PALIDO,
    align: "left",
    valign: "top",
    border: true,
  })
  worksheet.getCell(`E${currentRow}`).value = evidText

  for (let r = 0; r <= 4; r++) {
    worksheet.getRow(currentRow + r).height = 20
  }
  currentRow += 5

  // Enfoque Transversal y Actitudes
  styleRange(worksheet, `A${currentRow}:B${currentRow}`, {
    font: { size: 9, bold: true, color: BLANCO },
    fillColor: AZUL_MED,
    align: "center",
    border: true,
  })
  worksheet.getCell(`A${currentRow}`).value = "ENFOQUE TRANSVERSAL"

  styleRange(worksheet, `C${currentRow}:F${currentRow}`, {
    font: { size: 9, bold: true, color: BLANCO },
    fillColor: AZUL_MED,
    align: "center",
    border: true,
  })
  worksheet.getCell(`C${currentRow}`).value = "ACTITUDES O ACCIONES OBSERVABLES"
  worksheet.getRow(currentRow).height = 18
  currentRow++

  styleRange(worksheet, `A${currentRow}:B${currentRow + 1}`, {
    font: { bold: true, color: NEGRO },
    fillColor: BLANCO,
    align: "center",
    valign: "middle",
    border: true,
  })
  worksheet.getCell(`A${currentRow}`).value = data.enfoqueTransversal || "—"

  styleRange(worksheet, `C${currentRow}:F${currentRow + 1}`, {
    font: { color: NEGRO },
    fillColor: BLANCO,
    align: "justify",
    valign: "middle",
    border: true,
  })
  worksheet.getCell(`C${currentRow}`).value = data.actitudes_observables || data.competenciaTransversal || "—"

  worksheet.getRow(currentRow).height = 18
  worksheet.getRow(currentRow + 1).height = 18
  currentRow += 2

  currentRow++ // Espaciador

  // -------------------------------------------------------------
  // ─── BLOQUE IV: SECUENCIA DIDÁCTICA ───
  // -------------------------------------------------------------
  styleRange(worksheet, `A${currentRow}:F${currentRow}`, {
    font: { size: 10, bold: true, color: BLANCO },
    fillColor: AZUL_HEADER,
    align: "left",
  })
  worksheet.getCell(`A${currentRow}`).value = " IV.  SECUENCIA DIDÁCTICA (MOMENTOS DE LA SESIÓN)"
  worksheet.getRow(currentRow).height = 20
  currentRow++

  const momentos = [
    { label: "INICIO", duracion: data.duracion_inicio || "15 min", color: AZUL_HEADER, content: sm.inicio || "—" },
    { label: "DESARROLLO", duracion: data.duracion_desarrollo || "60 min", color: AZUL_MED, content: sm.desarrollo || "—" },
    { label: "CIERRE", duracion: data.duracion_cierre || "15 min", color: "0D47A1", content: sm.cierre || "—" },
  ]

  momentos.forEach(mom => {
    // Encabezado del momento
    styleRange(worksheet, `A${currentRow}:F${currentRow}`, {
      font: { size: 9, bold: true, color: BLANCO },
      fillColor: mom.color,
      align: "left",
      border: true,
    })
    worksheet.getCell(`A${currentRow}`).value = `  ${mom.label} (${mom.duracion})`
    worksheet.getRow(currentRow).height = 18
    currentRow++

    // Contenido del momento
    styleRange(worksheet, `A${currentRow}:F${currentRow + 4}`, {
      font: { color: NEGRO },
      fillColor: BLANCO,
      align: "justify",
      valign: "top",
      border: true,
    })
    worksheet.getCell(`A${currentRow}`).value = mom.content

    for (let r = 0; r <= 4; r++) {
      worksheet.getRow(currentRow + r).height = 20
    }
    currentRow += 5
    currentRow++ // Pequeño espaciador
  })

  // -------------------------------------------------------------
  // ─── BLOQUE V: EXTENSIÓN (TAREA) ───
  // -------------------------------------------------------------
  styleCell(worksheet.getCell(currentRow, 1), {
    font: { bold: true, color: AZUL_HEADER },
    fillColor: AZUL_PALIDO,
    border: { top: true, bottom: true, left: true },
  })
  worksheet.getCell(currentRow, 1).value = " V.  EXTENSIÓN (TAREA):"

  styleRange(worksheet, `B${currentRow}:F${currentRow + 1}`, {
    font: { color: NEGRO },
    fillColor: AZUL_PALIDO,
    align: "justify",
    valign: "middle",
    border: { top: true, bottom: true, right: true },
  })
  worksheet.getCell(`B${currentRow}`).value = data.extension || "—"

  worksheet.getRow(currentRow).height = 18
  worksheet.getRow(currentRow + 1).height = 18
  currentRow += 2

  currentRow++ // Espaciador

  // -------------------------------------------------------------
  // ─── BLOQUE VI: INSTRUMENTO DE EVALUACIÓN ───
  // -------------------------------------------------------------
  const inst = data.recursosAdicionales?.instrumentoEvaluacionGenerado
  if (inst) {
    const tipoInst = (inst.tipo_instrumento || "INSTRUMENTO").toUpperCase()
    const criterios = inst.criterios_o_items || []
    const escalas = inst.escalas_o_niveles || []

    styleRange(worksheet, `A${currentRow}:F${currentRow}`, {
      font: { size: 10, bold: true, color: BLANCO },
      fillColor: AZUL_HEADER,
      align: "left",
    })
    worksheet.getCell(`A${currentRow}`).value = ` VI.  INSTRUMENTO DE EVALUACIÓN: ${tipoInst}`
    worksheet.getRow(currentRow).height = 20
    currentRow++

    if (criterios.length > 0) {
      // Dibujar cabecera de la tabla del instrumento
      // Columnas A-C para criterios (combinadas)
      styleRange(worksheet, `A${currentRow}:C${currentRow}`, {
        font: { size: 8.5, bold: true, color: BLANCO },
        fillColor: AZUL_MED,
        align: "center",
        border: true,
      })
      worksheet.getCell(`A${currentRow}`).value = "CRITERIOS / ÍTEMS A EVALUAR"

      // Columnas D, E, F para escalas
      const numEscalas = escalas.length
      if (numEscalas === 2) {
        // Combinamos la última si son 2 para cubrir las columnas D-F
        styleRange(worksheet, `D${currentRow}:D${currentRow}`, {
          font: { size: 8.5, bold: true, color: BLANCO },
          fillColor: AZUL_MED,
          align: "center",
          border: true,
        })
        worksheet.getCell(`D${currentRow}`).value = escalas[0]

        styleRange(worksheet, `E${currentRow}:F${currentRow}`, {
          font: { size: 8.5, bold: true, color: BLANCO },
          fillColor: AZUL_MED,
          align: "center",
          border: true,
        })
        worksheet.getCell(`E${currentRow}`).value = escalas[1]
      } else if (numEscalas === 3) {
        styleCell(worksheet.getCell(currentRow, 4), {
          font: { size: 8.5, bold: true, color: BLANCO },
          fillColor: AZUL_MED,
          align: "center",
          border: true,
        })
        worksheet.getCell(currentRow, 4).value = escalas[0]

        styleCell(worksheet.getCell(currentRow, 5), {
          font: { size: 8.5, bold: true, color: BLANCO },
          fillColor: AZUL_MED,
          align: "center",
          border: true,
        })
        worksheet.getCell(currentRow, 5).value = escalas[1]

        styleCell(worksheet.getCell(currentRow, 6), {
          font: { size: 8.5, bold: true, color: BLANCO },
          fillColor: AZUL_MED,
          align: "center",
          border: true,
        })
        worksheet.getCell(currentRow, 6).value = escalas[2]
      } else {
        // En caso de que no haya escalas o sean diferentes, distribuimos
        styleRange(worksheet, `D${currentRow}:F${currentRow}`, {
          font: { size: 8.5, bold: true, color: BLANCO },
          fillColor: AZUL_MED,
          align: "center",
          border: true,
        })
        worksheet.getCell(`D${currentRow}`).value = escalas.join(" / ")
      }

      worksheet.getRow(currentRow).height = 20
      currentRow++

      // Filas de criterios
      criterios.forEach((crit: string, i: number) => {
        const isEven = i % 2 === 0
        const critBg = isEven ? BLANCO : AZUL_PALIDO

        // Criterio (A-C)
        styleRange(worksheet, `A${currentRow}:C${currentRow + 1}`, {
          font: { color: NEGRO },
          fillColor: critBg,
          align: "left",
          valign: "middle",
          border: true,
        })
        worksheet.getCell(`A${currentRow}`).value = ` • ${crit}`

        // Celdas vacías para escalas con bordes
        if (numEscalas === 2) {
          styleRange(worksheet, `D${currentRow}:D${currentRow + 1}`, { fillColor: BLANCO, border: true })
          styleRange(worksheet, `E${currentRow}:F${currentRow + 1}`, { fillColor: BLANCO, border: true })
        } else if (numEscalas === 3) {
          styleRange(worksheet, `D${currentRow}:D${currentRow + 1}`, { fillColor: BLANCO, border: true })
          styleRange(worksheet, `E${currentRow}:E${currentRow + 1}`, { fillColor: BLANCO, border: true })
          styleRange(worksheet, `F${currentRow}:F${currentRow + 1}`, { fillColor: BLANCO, border: true })
        } else {
          styleRange(worksheet, `D${currentRow}:F${currentRow + 1}`, { fillColor: BLANCO, border: true })
        }

        worksheet.getRow(currentRow).height = 18
        worksheet.getRow(currentRow + 1).height = 18
        currentRow += 2
      })
    }
    currentRow++ // Espaciador
  }

  // -------------------------------------------------------------
  // ─── FIRMAS DE AUTORIZACIÓN ───
  // -------------------------------------------------------------
  currentRow += 2 // Un poco de espacio antes de las firmas
  const firmaDocenteRow = currentRow + 3

  // Línea docente
  styleRange(worksheet, `A${firmaDocenteRow}:C${firmaDocenteRow}`, {
    font: { size: 9, bold: true, color: NEGRO },
    align: "center",
    border: { top: true }, // Línea horizontal de firma
  })
  worksheet.getCell(`A${firmaDocenteRow}`).value = dg.docente || "Docente del Área"

  styleRange(worksheet, `A${firmaDocenteRow + 1}:C${firmaDocenteRow + 1}`, {
    font: { size: 8, italic: true, color: GRIS_LINEA },
    align: "center",
  })
  worksheet.getCell(`A${firmaDocenteRow + 1}`).value = "Firma Docente"

  // Línea director(a)
  styleRange(worksheet, `D${firmaDocenteRow}:F${firmaDocenteRow}`, {
    font: { size: 9, bold: true, color: NEGRO },
    align: "center",
    border: { top: true },
  })
  worksheet.getCell(`D${firmaDocenteRow}`).value = "V°B° Director(a)"

  styleRange(worksheet, `D${firmaDocenteRow + 1}:F${firmaDocenteRow + 1}`, {
    font: { size: 8, italic: true, color: GRIS_LINEA },
    align: "center",
  })
  worksheet.getCell(`D${firmaDocenteRow + 1}`).value = "Dirección I.E."

  worksheet.getRow(firmaDocenteRow).height = 20
  worksheet.getRow(firmaDocenteRow + 1).height = 16

  currentRow = firmaDocenteRow + 3

  // -------------------------------------------------------------
  // ─── PIE DE PÁGINA ───
  // -------------------------------------------------------------
  styleRange(worksheet, `A${currentRow}:F${currentRow}`, {
    font: { size: 8, color: GRIS_LINEA },
    align: "center",
    border: { top: true },
  })
  worksheet.getCell(`A${currentRow}`).value = `Generado con EduMath IA   ·   Alineado al CNEB 2016 (RM 649-2016-MINEDU)   ·   ${dg.fecha || new Date().toLocaleDateString("es-PE")}`
  worksheet.getRow(currentRow).height = 20

  // -------------------------------------------------------------
  // ─── GENERACIÓN Y DESCARGA ───
  // -------------------------------------------------------------
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = globalThis.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `sesion-${(data.tema || "eduai").substring(0, 20)}-${new Date().toISOString().split("T")[0]}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  globalThis.URL.revokeObjectURL(url)
}
