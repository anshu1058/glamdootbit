import React from "react";
import { jsPDF } from "jspdf";

const DownloadTextAsPDF = () => {
  // Base64 encoded font (NotoSans-Regular.ttf in this example)
  const notoSansFont = `
  AAABAAAAJIAAIAAAAAEQAQAAFgAAACAAAAgBGRlRNAAIAbAAAAHgAAAAk
  T1MvMgAAAfQAAABgAAAAYGNtYXAAAP8AAAABAAAAAwAAAAb2d3ZtAAAOJ
  AAAAeAAAAHgAAAAWbG9jYQAAC5AAAAMcAAAADGRtYXhwAAAJFAAAABQAA
  AAFGdHBncgAAAB4AAADUAAAAJGhlYQAADyAAAC4AAAAIiGhlYQADJEAAA
  .... (your full Base64 encoded string here) ....
  `;

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add the custom font to the document
    doc.addFileToVFS("NotoSans-Regular.ttf", notoSansFont);
    doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
    doc.setFont("NotoSans");

    // Add multilingual text
    doc.text("This is English text", 10, 10);
    doc.text("यह हिंदी में पाठ है", 10, 20); // Hindi text
    doc.text("یہ اردو میں متن ہے", 10, 30); // Urdu text

    // Save the generated PDF
    doc.save("multilingual_text.pdf");
  };

  return (
    <center>
      <h1>Download Multilingual PDF Example</h1>
      <button onClick={generatePDF}>Download PDF</button>
    </center>
  );
};

export default DownloadTextAsPDF;
