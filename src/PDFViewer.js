import React, { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString()

const PDFViewer = () => {
  const [pdfData, setPdfData] = useState(null)
  const [pdfView, setPdfView] = useState(null)

  const [formValues, setFormValues] = useState({})

  const { getInitialFormValues, fetchPDF, updatePDF } = usePDFViewer()

  const initializeFormValues = (fields) => {
    const initialFormValues = { ...getInitialFormValues(fields) }

    setFormValues({ ...initialFormValues })
  }

  const loadPDF = async () => {
    const pdfDoc = await fetchPDF()

    initializeFormValues(pdfDoc.getForm().getFields())

    const pdfFile = await pdfDoc.save()

    setPdfData(pdfFile)

    const modifiedPdfBlob = new Blob([pdfFile], {
      type: "application/pdf",
    })

    setPdfView(URL.createObjectURL(modifiedPdfBlob))
  }

  // Function to set the value of a field based on its type
  const setFieldValue = (field) => {
    const newFieldValue = formValues[field.getName()]
    if (FIELD_TYPE_MAP[field.constructor.name] === "text") {
      field.setText(newFieldValue)
    } else {
      field.select(newFieldValue)
    }
  }

  const savePDF = async () => {
    if (!pdfData) {
      return
    }
    const pdfDocUpdated = await PDFDocument.load(pdfData)

    const formData = await pdfDocUpdated.getForm()

    const formFields = formData.getFields()

    formFields.forEach((field) => {
      setFieldValue(field)
    })

    const fileToBeUploaded = await pdfDocUpdated.save()

    void updatePDF(fileToBeUploaded)
  }

  const onTextChange = (event) => {
    // This is a hacky if block as the value returned by the
    // onInput event is wrong for this field. It is supposed
    // to be one of 'parttime' or 'fulltime' but it only returns
    // 'on'. Also the displayed option and the exported value
    // is different for the radio group in the second row
    if (event.target.name.includes("time")) {
      if (formValues[event.target.name] === "fulltime") {
        setFormValues((prev) => ({
          ...prev,
          [event.target.name]: "parttime",
        }))

        return
      }

      setFormValues((prev) => ({
        ...prev,
        [event.target.name]: "fulltime",
      }))
      return
    }

    setFormValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
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
            <Page
              renderAnnotationLayer
              renderForms
              pageNumber={1}
              onInput={onTextChange}
            />
          </Document>
        )}
      </div>
    </div>
  )
}

export default PDFViewer
