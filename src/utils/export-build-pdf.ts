import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface BuildPdfRow {
    type: string
    name: string
    qty: number
    unitPrice: number | null
}

const loadImageAsDataUrl = (url: string): Promise<string> =>
    new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            const ctx = canvas.getContext('2d')!
            ctx.drawImage(img, 0, 0)
            resolve(canvas.toDataURL('image/png'))
        }
        img.onerror = reject
        img.src = url
    })

export const exportBuildPdf = async ({
    buildName,
    buildPurpose,
    budget,
    logoUrl,
    rows,
    total,
}: {
    buildName: string
    buildPurpose: string
    budget: string
    logoUrl: string
    rows: BuildPdfRow[]
    total: number
}) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    let logoDataUrl: string | null = null
    try {
        logoDataUrl = await loadImageAsDataUrl(logoUrl)
    } catch {
        // logo unavailable — skip it
    }

    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    const ml = 15
    const mr = 15

    // ── Header ───────────────────────────────────────────────
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(20, 20, 20)
    doc.text(buildName, ml, 22)

    if (logoDataUrl) {
        // Fit logo into a 44 × 14 mm box on the right
        const logoW = 44
        const logoH = 14
        doc.addImage(logoDataUrl, 'PNG', pageW - mr - logoW, 11, logoW, logoH)
    }

    // Sub-line: purpose · date
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(110, 110, 110)
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const metaParts = [`Purpose: ${buildPurpose}`]
    if (budget) metaParts.push(`Budget: $${Number(budget).toLocaleString()}`)
    metaParts.push(`Date: ${dateStr}`)
    doc.text(metaParts.join('   ·   '), ml, 30)

    // Divider
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.4)
    doc.line(ml, 34, pageW - mr, 34)

    // ── Table ─────────────────────────────────────────────────
    let srNum = 1
    const tableBody = rows.map((r) => {
        const lineTotal = r.unitPrice !== null ? r.unitPrice * r.qty : null
        return [
            String(srNum++),
            r.type,
            r.name,
            String(r.qty),
            r.unitPrice !== null ? `$${r.unitPrice.toLocaleString()}` : 'N/A',
            lineTotal !== null ? `$${lineTotal.toLocaleString()}` : 'N/A',
        ]
    })

    autoTable(doc, {
        startY: 38,
        head: [['SR#', 'Type', 'Component', 'Qty', 'Unit Price', 'Total']],
        body: tableBody,
        margin: { left: ml, right: mr },
        headStyles: {
            fillColor: [30, 30, 40],
            textColor: [255, 255, 255],
            fontSize: 8.5,
            fontStyle: 'bold',
            cellPadding: 3.5,
        },
        bodyStyles: {
            fontSize: 8.5,
            textColor: [35, 35, 35],
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: [247, 247, 250],
        },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 26 },
            2: { cellWidth: 'auto' },
            3: { cellWidth: 12, halign: 'center' },
            4: { cellWidth: 24, halign: 'right' },
            5: { cellWidth: 24, halign: 'right' },
        },
        styles: {
            overflow: 'linebreak',
            lineColor: [230, 230, 230],
            lineWidth: 0.2,
        },
        tableLineColor: [200, 200, 200],
        tableLineWidth: 0.3,
    })

    // ── Total ─────────────────────────────────────────────────
    const afterTable = (doc as any).lastAutoTable.finalY as number
    const totalY = afterTable + 8

    // Thin rule above total
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(ml, totalY - 3, pageW - mr, totalY - 3)

    // "Gross Total" label
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('Gross Total', pageW - mr - 48, totalY + 1)

    // Amount box (mimicking the invoice style)
    const boxX = pageW - mr - 30
    const boxY = totalY - 4
    doc.setDrawColor(180, 180, 180)
    doc.setLineWidth(0.3)
    doc.rect(boxX, boxY, 30, 8)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(20, 20, 20)
    doc.text(`$${total.toLocaleString()}`, pageW - mr - 2, totalY + 1.5, { align: 'right' })

    // Second "Total" row (like the invoice)
    const totalY2 = totalY + 9
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('Total', pageW - mr - 48, totalY2 + 1)

    doc.setDrawColor(180, 180, 180)
    doc.setLineWidth(0.3)
    doc.rect(boxX, totalY2 - 4, 30, 8)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(20, 20, 20)
    doc.text(`$${total.toLocaleString()}`, pageW - mr - 2, totalY2 + 1.5, { align: 'right' })

    // ── Footer ────────────────────────────────────────────────
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(170, 170, 170)
    doc.text('Generated by Buildera', pageW / 2, pageH - 8, { align: 'center' })

    // ── Save ──────────────────────────────────────────────────
    const slug = buildName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    doc.save(`${slug}_build.pdf`)
}
