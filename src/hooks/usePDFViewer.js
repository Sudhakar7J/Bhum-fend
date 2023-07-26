import { PDFDocument } from "pdf-lib";
import { FIELD_TYPE_MAP } from "../utils";

const usePDFViewer = () => {
  const domain = process.env.REACT_APP_API_URL;
  const url = `${domain}/example.pdf`;

  const getFieldValueBasedOnType = (field, type) => {
    switch (FIELD_TYPE_MAP[type]) {
      case "text":
        return field.getText();

      case "dropdown":
        return field.getSelected();

      case "radio":
        return field.getSelected();

      default:
        return "";
    }
  };

  const getInitialFormValues = (fields) => {
    const initialFormValues = {};

    fields.forEach((field) => {
      const fieldName = field.getName();
      const fieldType = field.constructor.name;
      initialFormValues[fieldName] = getFieldValueBasedOnType(field, fieldType);
    });

    return initialFormValues;
  };

  const fetchPDF = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Failed to fetch PDF");
        return;
      }

      const pdfBytes = await response.arrayBuffer();
      const pdfData = new Uint8Array(pdfBytes);
      const pdfDoc = await PDFDocument.load(pdfData);

      return pdfDoc;
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  };

  const updatePDF = async (fileToBeUploaded) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({ pdfData: [...fileToBeUploaded] }), // Replace [] with the actual PDF data in Uint8Array format.
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("PDF saved successfully");
      } else {
        console.error("Failed to save PDF");
      }
    } catch (error) {
      console.error("Error saving PDF:", error);
    }
  };

  return {
    getFieldValueBasedOnType,
    getInitialFormValues,
    fetchPDF,
    updatePDF,
  };
};

export default usePDFViewer;
