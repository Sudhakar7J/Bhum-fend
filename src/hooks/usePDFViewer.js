import { PDFDocument } from "pdf-lib"
import { FIELD_TYPE_MAP } from "../utils"

const usePDFViewer = () => {
  const domain = process.env.REACT_APP_API_URL
  const url = `${domain}/example.pdf`

  // Function to get the value of a form field based on its type
  const getFieldValueBasedOnType = (field, type) => {
    switch (FIELD_TYPE_MAP[type]) {
      case "text":
        return field.getText()

      case "dropdown":
        return field.getSelected()

      case "radio":
        return field.getSelected()

      default:
        return ""
    }
  }

  // Function to get initial form field values from the PDF
  const getInitialFormValues = (fields) => {
    const initialFormValues = {}

    fields.forEach((field) => {
      const fieldName = field.getName()
      const fieldType = field.constructor.name
      initialFormValues[fieldName] = getFieldValueBasedOnType(field, fieldType)
    })

    return initialFormValues
  }

  // Function to fetch the PDF document from the server
  const fetchPDF = async () => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        console.error("Failed to fetch PDF")
        return
      }

      const pdfBytes = await response.arrayBuffer()
      const pdfData = new Uint8Array(pdfBytes)
      const pdfDoc = await PDFDocument.load(pdfData)

      return pdfDoc
    } catch (error) {
      console.error("Error loading PDF:", error)
    }
  }

  // Function to update and save the modified PDF to the server
  const updatePDF = async (fileToBeUploaded) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({ pdfData: [...fileToBeUploaded] }), // Replace [] with the actual PDF data in Uint8Array format.
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        console.log("PDF saved successfully")
      } else {
        console.error("Failed to save PDF")
      }
    } catch (error) {
      console.error("Error saving PDF:", error)
    }
  }

  // Return the functions as an object to be used in the main component
  return {
    getFieldValueBasedOnType,
    getInitialFormValues,
    fetchPDF,
    updatePDF,
  }
}

export default usePDFViewer
