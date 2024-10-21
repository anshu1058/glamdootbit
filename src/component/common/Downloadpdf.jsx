import React,{useContext} from "react";
import { Button } from "@mui/material";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import jsPDF from 'jspdf';
import { DownloadDoneOutlined } from "@mui/icons-material";
import '../text_analytics/layout/layout.css';
import { ThemeContext } from "../header/ThemeContext";


Font.register({
  family: 'Helvetica',
  fontStyle: 'normal',
  fontWeight: 400,
  // src: 'http://fonts.gstatic.com/s/hind/v6/nz5dxQAyXAGLFHmmJlZXFg.ttf'
});

const style = StyleSheet.create({
  page: { backgroundColor: 'tomato' },
  section: { color: 'white', textAlign: 'center', margin: 30 },
  text: { fontFamily: 'Helvetica', fontSize: 12 },
  header:{fontWeight:700,martginBottom:"15px",textAlign:'center',display:"flex",justifyContent:'center'}
});
const DownloadPdf = ({ output, filename }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext); 
  const backgroundColor = theme === "dark" ? "#333" : "#fff"; 
  const color = theme === "dark" ? "white" : "black"; 
 

  const handleSavePDF = () => {
    if (!output || output?.trim() === "") {
      return null; // Return null if output is empty
    }

    const MyDoc = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
           <Text style={style.header}>
             {filename}
            </Text>
            <Text style={style.text}>{output}</Text>
            <Text style={styles.note}>
              Powered by Onelogica.
            </Text>
          </View>
          {/* You can add more pages or sections here if needed */}
        </Page>
      </Document>
    );

    return <MyDoc />;
  };

  // Styles for the PDF content
  const styles = {
    page: {
      flexDirection: "row",
      backgroundColor: "white",
      color:color,
      paddingTop: 40,
      paddingLeft: 60,
      paddingRight: 60,
      paddingBottom: 40,
      lineHeight: 1.5,
    },
    section: {
      fontSize: 14,
      flexGrow: 1,
      textAlign: "justify",
    },
    note: {
      fontSize: 10,
      marginTop: 40,
      textAlign: "center",
      fontStyle: "italic",
    },
  };

  const isDisabled = !output || output.trim() === "";
  const downloadPDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Set font style and size
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Add text in different languages
    const text = 'Hello, こんにちは, مرحبا, नमस्ते, Здравствуйте!';
    doc.text(text, 15, 20);

    // Save the PDF
    doc.save('document.pdf');
  }
  return (
    <>
      <PDFDownloadLink document={handleSavePDF()} fileName={filename}>

        <>
          <Button
            className="btn"
            // startIcon={<DownloadDoneOutlined />}
            onClick={handleSavePDF}
            disabled={isDisabled}
            style={{background:backgroundColor,color:color}}
          >
            {t("download")}
          </Button>
        </>
      </PDFDownloadLink>
      {isDisabled && (
        <>
          <Button
            disabled
            className="btn"
            style={{background:backgroundColor,color:color}}
          // startIcon={<DownloadDoneOutlined />}
          >
            {t("download")}
          </Button>
        </>
      )}
    </>
  );
};

export default DownloadPdf;