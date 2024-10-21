import React, { useState } from "react";
import { Button } from "@mui/material";
import { DownloadDoneOutlined } from "@mui/icons-material"; 
import { PDFDownloadLink, Document, Page, View } from "@react-pdf/renderer";
import ModeratedResponse from "../text_analytics/moderation/ModerateResponse";
import { useTranslation } from "react-i18next";

// show the refine view of the moderated content
const DownloadModeratedResponsePdf = ({ response, filename }) => {
  const { t } = useTranslation();
  const [isDisabled, setIsDisabled] = useState(!response);

  const handleSavePDF = () => {
    if (!response) {
      return null; // Return null if response is empty
    }

    const MyDoc = () => (
      <Document>
        <Page size="A4">
          <View>
            <ModeratedResponse response={response} />
          </View>
        </Page>
      </Document>
    );

    return <MyDoc />;
  };

  const handleDownloadClick = () => {
    setIsDisabled(true); // Disable the button onClick
  };

  return (
    <>
      <PDFDownloadLink
        document={handleSavePDF()}
        fileName={filename}
        onClick={handleDownloadClick}
      >
        {({ loading }) =>
          loading ? (
            ""
          ) : (
            <Button
              style={{
                color: "black",
                margin: "7px",
                backgroundColor: "white",
                borderRadius: "15px",
                fontSize: "12px",
                padding: "6px 12px",
                transition: "background-color 0.3s, color 0.3s",
              }}
              startIcon={<DownloadDoneOutlined />}
              disabled={isDisabled}
            >
              {t("download")}
            </Button>
          )
        }
      </PDFDownloadLink>
      {isDisabled && (
        <Button
          disabled
          style={{
            opacity: 1,
            pointerEvents: "none",
            backgroundColor: "white",
            borderRadius: "15px",
            margin: "6px",
          }}
          startIcon={<DownloadDoneOutlined  />}
        >
          {t("download")}
        </Button>
      )}
    </>
  );
};

export default DownloadModeratedResponsePdf;
