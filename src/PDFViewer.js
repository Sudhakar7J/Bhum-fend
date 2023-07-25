import React, { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
const PDFViewer = () => {
  const [pdfData, setPdfData] = useState(null)
  const [pdfView, setPdfView] = useState(null)

  const loadPDF = async () => {
    const pdfFile = await pdfDoc.save()

    setPdfData(pdfFile)

    const modifiedPdfBlob = new Blob([pdfFile], {
      type: "application/pdf",
    })

    setPdfView(URL.createObjectURL(modifiedPdfBlob))
  }

  const savePDF = async () => {
    if (!pdfData) {
      return
    }
    const pdfDocUpdated = await PDFDocument.load(pdfData)

    const formData = await pdfDocUpdated.getForm()

    const formFields = formData.getFields()

    const fileToBeUploaded = await pdfDocUpdated.save()
  }

  return (
    <div>
      <button style={{ margin: 20 }} onClick={loadPDF}>
        Load PDF
      </button>
      <button onClick={savePDF}>Save PDF</button>
      <div>
        {pdfData && (
          <Document file={pdfView}>
            <Page renderAnnotationLayer renderForms pageNumber={1} />
          </Document>
        )}
      </div>
    </div>
  )
}

export default PDFViewer
