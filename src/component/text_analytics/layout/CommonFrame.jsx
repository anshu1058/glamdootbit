// its common layout for the summary,insight, and moderation 

import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  Button,
  Grid,
  Box,
  Hidden,
} from "@mui/material";
import SelectDocs from "../../common/SelectDocs";
import { useTranslation } from "react-i18next";
import ParameterTab from "../parameter/ParameterTab";
import { getDocument } from "pdfjs-dist";
import DownloadPdf from "../../common/Downloadpdf";
import DownloadModeratedResponsePdf from "../../common/ModerationPdf";
import DocumentViewer from "../document_viewer/DocumentViewer";
import { extractDocxParagraphs } from "./ExtractData";
import MobileParameterTab from "../parameter/MobileParameterTab";
import ModeratedResponse from "../moderation/ModerateResponse";
import './layout.css'
import ResetButton from "../../common/ResetButton";
import "../textanalysis.css";
import ToggleButtonforcomponent from "../../common/ToggleButton";
import { ThemeContext } from "../../header/ThemeContext";
import ReactMarkdown from 'react-markdown';
import { marked } from 'marked';

import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import Parameters from "../parameter/UpdatedParameterTab";

// For Vite with dynamic URL or relative path
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).href;

// Or using a CDN (fallback)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const TextAnalyticsLAyout = (props) => {

  const [text, setText] = useState("");
  const [file, selectedFile] = useState();
  const [fileurl, selectedFileUrl] = useState();
  const [extractedText, setExtractedText] = useState("");
  const { t } = useTranslation();
  const [fileContent, setFileContent] = useState('');
  const [filename, setfilename] = useState('');
  const { theme } = useContext(ThemeContext);
  const backgroundColor = theme === "dark" ? "#333" : "#fff";
  const color = theme === "dark" ? 'white' : "";
  const [showhide, setShowhide] = useState("text");


  const handleInputText = (e) => {
    setText(e.target.value.toUpperCase());
    props.inputText(e.target.value);
  };

  const handleFile = (File) => {
    selectedFile(File);
    selectedFileUrl(File.url);
    setfilename(File.name)
    props.File(File.url);
  };

  useEffect(() => {
    const extractTextFromPDF = async () => {
      try {
        const doc = await pdfjsLib.getDocument(fileurl).promise;
        const numPages = doc.numPages;
        let text = "";

        for (let i = 1; i <= numPages; i++) {
          const page = await doc.getPage(i);
          const pageTextContent = await page.getTextContent();
          const pageText = pageTextContent.items.map((item) => item.str).join(" ");
          text += pageText;
        }

        setExtractedText(text);
        props.onTextExtracted(text);
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
        // Handle the error, e.g., display a user-friendly message
      }
    };

    if (fileurl && props.fileExtension === 'pdf') {
      extractTextFromPDF();
    } else if (fileurl && props.fileExtension !== 'pdf') {
      fetchData(fileurl);
    }
  }, [fileurl, fileContent, props.fileExtension]);



  const fetchData = async (fileurl) => {

    try {
      const extractedParagraphs = await extractDocxParagraphs(fileurl);
      const documentText = extractedParagraphs.join('\n');
      setExtractedText(documentText);
      props.onTextExtracted(documentText);
    } catch (error) {
      console.error('Error fetching or processing document:', error);
    }

  };


  const aggregateDataForKeywords = (data) => {
    const aggregatedData = {};

    data.forEach(item => {
      const { category, text } = item;

      if (!aggregatedData[category]) {
        aggregatedData[category] = [];
      }

      if (!aggregatedData[category].includes(text)) {
        aggregatedData[category].push(text);
      }
    });
    const removeSimilarWords = (words) => {
      const uniqueWords = [];
    
      words.forEach((word) => {
        // Normalize the word (lowercase and trimmed)
        const normalizedWord = word.trim().toLowerCase();
    
        // Check if any existing word is a substring or similar (like plural forms)
        const isSimilar = uniqueWords.some(existingWord => {
          const singularExistingWord = existingWord.replace(/s\b/, ''); // Remove plural 's'
          const singularNewWord = normalizedWord.replace(/s\b/, '');    // Remove plural 's'
          
          return (
            singularExistingWord.includes(singularNewWord) ||
            singularNewWord.includes(singularExistingWord)
          );
        });
    
        // If no similar word exists, or the new word is longer, add it
        if (!isSimilar) {
          uniqueWords.push(normalizedWord);
        } else {
          // Replace shorter words with longer phrases for better descriptions
          uniqueWords.forEach((existingWord, index) => {
            const singularExistingWord = existingWord.replace(/s\b/, '');
            const singularNewWord = normalizedWord.replace(/s\b/, '');
            
            if (
              singularNewWord.includes(singularExistingWord) &&
              normalizedWord.length > existingWord.length
            ) {
              uniqueWords[index] = normalizedWord;
            }
          });
        }
      });
    
      return uniqueWords;
    };
    
    const formattedData = Object.entries(aggregatedData).map(([category, values]) => {
      // First, remove case-insensitive and trimmed duplicates
      const uniqueValues = [...new Set(values.map(value => value.trim().toLowerCase()))];
    
      // Then, remove similar words (like "deployment" and "deployments")
      const filteredValues = removeSimilarWords(uniqueValues);
    
      return (
        <li key={category} style={{ color: color }}>
          <strong>{category}</strong>
          <ul>
            {filteredValues.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </li>
      );
    });
    
    return formattedData;
    
  }
    
  return (
    <>
      {/* layout of the summary , text insight, and moderation module */}
      <div className={`${props.label === "Moderated Content" ? "maincontent2" : props.label === "Keywords" ? "maincontent2" : "mainContent"}`}>
        <div className={`${props.label === "Moderated Content" || props.label === "Keywords" ? "text-analysis-containerx" : "text-analysis-container"}`}>
          <div className={`${props.label === "Moderated Content" || props.label === "Keywords" ? "content1" : "content1"}`}>
            <Hidden mdUp>
              {props.label !== "Moderated Content" && props.label !== "Keywords" ? (
                < MobileParameterTab
                  // mode={props.mode}
                  model={props.model}
                  temperature={props.temp}
                  topP={props.topP}
                  modelsList={props.modelsList}
                  selectedModel={props.selectedModel}
                  onModelChange={props.onModelChange}
                  maxLength={props.maxLength}
                  frequencyPenalty={props.frequencyPenalty}
                  presencePenalty={props.presencePenalty}
                  onTemperatureChange={props.onTemperatureChange}
                  onMaxLengthChange={props.onMaxLengthChange}
                  onTopPChange={props.onTopPChange}
                  onFrequencyPenaltyChange={props.onFrequencyPenaltyChange}
                  onPresencePenaltyChange={props.onPresencePenaltyChange}
                />
              ) : ("")}
            </Hidden>
          </div>

          <Grid container spacing={props.label === "Moderated Content" || props.label === "Keywords" ? 0 : 3} >
            <Hidden mdDown>
              {props.label !== "Moderated Content" && props.label !== "Keywords" ? (
                <Grid item xs={3} sm={3} md={2.7} lg={2}>
                  <ParameterTab
                    // mode={props.mode}
                    model={props.model}
                    temperature={props.temp}
                    topP={props.topP}
                    modelsList={props.modelsList}
                    selectedModel={props.selectedModel}
                    onModelChange={props.onModelChange}
                    maxLength={props.maxLength}
                    frequencyPenalty={props.frequencyPenalty}
                    presencePenalty={props.presencePenalty}
                    onTemperatureChange={props.onTemperatureChange}
                    onMaxLengthChange={props.onMaxLengthChange}
                    onTopPChange={props.onTopPChange}
                    onFrequencyPenaltyChange={props.onFrequencyPenaltyChange}
                    onPresencePenaltyChange={props.onPresencePenaltyChange}
                  />
                </Grid>
              //   <Grid item xs={3} sm={3} md={1} lg={1}>
              //     <Parameters
              //       mode={props.mode}
              //       model={props.model}
              //       temperature={props.temp}
              //       topP={props.topP}
              //       modelsList={props.modelsList}
              //       selectedModel={props.selectedModel}
              //       onModelChange={props.onModelChange}
              //       maxLength={props.maxLength}
              //       frequencyPenalty={props.frequencyPenalty}
              //       presencePenalty={props.presencePenalty}
              //       onTemperatureChange={props.onTemperatureChange}
              //       onMaxLengthChange={props.onMaxLengthChange}
              //       onTopPChange={props.onTopPChange}
              //       onFrequencyPenaltyChange={props.onFrequencyPenaltyChange}
              //       onPresencePenaltyChange={props.onPresencePenaltyChange}
              //     />
              //   </Grid>
             ) : ("")}
            </Hidden>
            {/* end of parameter tab */}
            <Grid item xs={12} lg={props.label === "Moderated Content" || props.label === "Keywords" ? 11.5 : 9.5} sm={12} md={props.label === "Moderated Content" || props.label === "Keywords" ? 11.5 : 8.8}>
              <Grid container style={{ position: "relative", top: "2px", zIndex: 10 }}>
                <Grid item xs={12} sm={12} lg={6} md={6}>
                  <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <div className="curveborder" style={{ background: backgroundColor }}>
                      <ToggleButtonforcomponent showhide={showhide} setShowhide={setShowhide} />
                    </div>
                  </div>
                </Grid>
                <Hidden mdDown>
                  <Grid item xs={12} sm={12} lg={6} md={6}>
                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                      <div className="curveborder" style={{ background: backgroundColor,color:color}}>
                        <Box sx={{ width: '8em', borderRadius: "8px", boxShadow: '1px 5px 14px 0px #c4c0c0', padding: "8px", display: "flex", justifyContent: "center", alignItems: "center", }}>
                          <Typography
                            style={{
                              color: color,
                              fontWeight: "700",
                              fontSize: "14px",
                              textTransform:"uppercase"
                            }}
                          >
                            {props.label}
                          </Typography>
                        </Box>
                      </div>
                    </div>
                  </Grid>
                </Hidden>
              </Grid>
              <Grid container spacing={3}>
                {showhide === "text" && (
                  <>
                    <Grid item xs={12} sm={12} lg={6} md={6}  >
                      <Box className="iocontainer" style={{ height: "68.9vh" }}>
                        <textarea
                          className="text"
                          type="text"
                          placeholder={props.inputplaceholder}
                          value={props.text}
                          onChange={handleInputText}
                          style={{ backgroundColor: backgroundColor, color: color }}
                        />

                        <Box style={{ margin: "0px", display: "flex", width: "100%", justifyContent: "center", marginTop: "-0.5px", background: "none" }}>
                          <Box
                            sx={{
                              display: "flex",
                              borderTop: "none",
                              padding: "5px",
                              borderRadius: "0px 0px 10px 10px",
                              background: backgroundColor,
                              borderLeft: "1px solid rgb(209, 202, 202)",
                              borderRight: "1px solid rgb(209, 202, 202)",
                              borderBottom: "1px solid rgb(209, 202, 202)",
                            }}>
                            <Box>
                              <ResetButton docclear={props.textclear} ></ResetButton>
                            </Box>
                            <Button
                              className="btn"
                              onClick={props.handleSubmit}
                              disabled={props.text === ""}
                              style={{ backgroundColor: backgroundColor, color: color }}
                            >
                              {props.textLoading ? t("loading...") : props.buttonLabel}
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    <Hidden mdUp>
                      <Grid item xs={12} sm={12} lg={6} md={6} style={{ paddingTop: "18px" }}>
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", position: "Relative", top: "26px", zIndex: '10' }}>
                          <div className="curveborder" style={{ backgroundColor: backgroundColor, color: color }}>
                            <Box sx={{ width: '8em', borderRadius: "8px", boxShadow: '1px 5px 14px 0px #c4c0c0', padding: "8px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "-16px" }}>
                              <Typography
                                style={{
                                  color: "black",
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  textTransform: "uppercase"
                                }}
                              >
                                {props.label}
                              </Typography>
                            </Box>
                          </div>
                        </div>
                      </Grid>
                    </Hidden>
                    <Grid item xs={12} sm={12} lg={6} md={6}>
                      <Box className="iocontainer" >
                        {props.label === 'Keywords' ?
                          (
                            <div className="textinsight" style={{ marginBottom: "43px", paddingTop: "16px", background: backgroundColor, color: color }}>
                              {/* {aggregateDataForKeywords(props.generatedResponse).map((element) => element)} */}
                              {/* {props.generatedResponse} */}
                              {props.generatedResponse.map((item, index) => (
        <div key={index} className="data-item">
          {Object.entries(item).map(([key, value], idx) => (
            <div key={idx} className="data-entry">
              <strong>{key}:</strong>
              {/* Check if the value is an array, string, or URL */}
              {Array.isArray(value) ? (
                <ul>
                  {value.map((val, i) => (
                    <li key={i}>{val}</li>
                  ))}
                </ul>
              ) : typeof value === 'string' && value.startsWith('http') ? (
                <a href={value} target="_blank" rel="noopener noreferrer">
                  {value}
                </a>
              ) : (
                <span> {value}</span>
              )}
            </div>
          ))}
        </div>
      ))}
                            </div>
                          ) : props.label === 'Moderated Content' ?
                            (
                              <div className="textinsight" style={{ marginBottom: "32px", paddingTop: "0px" }}>
                                <ModeratedResponse response={props.generatedResponse} />
                              </div>
                            ) : (
                              <>
                                <div className="text" style={{ marginBottom: "0", paddingTop: "0px", overflowY: "auto", background: backgroundColor, color: color }}>
                                  <div dangerouslySetInnerHTML={{ __html: marked(props.generatedResponse?.trim()) }} />
                                </div>
                                {/* <textarea
                                className="text"
                                type="text"
                                maxLength={5000}
                                placeholder={props.outputplaceholder}
                                value={props.generatedResponse?.trim()}
                                readOnly
                                style={{backgroundColor:backgroundColor,color:color}}
                              /> */}
                              </>
                            )}
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "-0.5px" }}>
                          {props.label === 'Keywords' ? (
                            ''
                          ) : props.label === 'Moderated Content' ? (
                            ''
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                borderTop: "none",
                                padding: "5px",
                                borderRadius: "0px 0px 10px 10px",
                                background: backgroundColor,
                                borderLeft: "1px solid rgb(209, 202, 202)",
                                borderRight: "1px solid rgb(209, 202, 202)",
                                borderBottom: "1px solid rgb(209, 202, 202)",
                              }}>
                              <DownloadPdf output={props.generatedResponse} filename="Text Generated Response" />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}
                {showhide === "document" && (
                  <>
                    <Grid item xs={12} sm={12} lg={6} md={6}>
                      <Box className="iocontainerD" style={{ backgroundColor: backgroundColor, color: color }}>
                        <Box className="textDoc">
                          <div style={{ display: 'flex', alignItems: 'center', boxShadow: 'rgb(174, 170, 170) 0px 1px 10px 0px', borderRadius: "15px", margin: "3px" }}>
                            <SelectDocs onSelectFile={handleFile} />
                          </div>
                          {props.selectedfile && (
                            <>
                              <div className="previewDoc">
                                <DocumentViewer documentUrl={props.selectedfile} />
                              </div>
                            </>

                          )}
                        </Box>
                      </Box>
                      <Box style={{ margin: "0px", display: "flex", width: "100%", justifyContent: "center", background: "none" }}>
                        <Box
                          sx={{
                            display: "flex",
                            borderTop: "none",
                            padding: "5px",
                            borderRadius: "0px 0px 10px 10px",
                            background: "white",
                            borderLeft: "1px solid rgb(209, 202, 202)",
                            borderRight: "1px solid rgb(209, 202, 202)",
                            borderBottom: "1px solid rgb(209, 202, 202)",
                            position: "relative",
                            top: '-1px'
                          }}
                          style={{ backgroundColor: backgroundColor, color: color }}>
                          <ResetButton docclear={props.docclear}></ResetButton>
                          <Button
                            className="btn"
                            onClick={props.documentUpload}
                            disabled={extractedText === "" && props.documentText === ""}
                            style={{ backgroundColor: backgroundColor, color: color }}
                          >
                            {props.documentLoading ? t("loading...") : props.buttonLabel}
                            {t("")}
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                    <Hidden mdUp>
                      <Grid item xs={12} sm={12} lg={6} md={6}>
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", position: "Relative", top: "26px", zIndex: "10" }}>
                          <div className="curveborder" style={{ backgroundColor: backgroundColor, color: color }}>
                            <Box sx={{ width: '8em', borderRadius: "8px", boxShadow: '1px 5px 14px 0px #c4c0c0', padding: "8px", display: "flex", justifyContent: "center", alignItems: "center", }}>
                              <Typography
                                style={{
                                  color: "black",
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  textTransform:"uppercase"
                                }}
                              >
                                {props.label}
                              </Typography>
                            </Box>
                          </div>
                        </div>
                      </Grid>
                    </Hidden>
                    <Grid item xs={12} sm={12} lg={6} md={6}>
                      <Box className="iocontainer">
                        {props.label === 'Keywords' ?
                          (
                            <div className="textinsight" style={{ marginBottom: "43.5px", paddingTop: "16px", backgroundColor: backgroundColor, color: color }}>
                              {/* {aggregateDataForKeywords(props.generatedResponseofDocs).map((element) => element)} */}
                              {props.generatedResponseofDocs.map((item, index) => (
        <div key={index} className="data-item">
          {Object.entries(item).map(([key, value], idx) => (
            <div key={idx} className="data-entry">
              <strong>{key}:</strong>
              {/* Check if the value is an array, string, or URL */}
              {Array.isArray(value) ? (
                <ul>
                  {value.map((val, i) => (
                    <li key={i}>{val}</li>
                  ))}
                </ul>
              ) : typeof value === 'string' && value.startsWith('http') ? (
                <a href={value} target="_blank" rel="noopener noreferrer">
                  {value}
                </a>
              ) : (
                <span> {value}</span>
              )}
            </div>
          ))}
        </div>
      ))}

                            </div>
                          ) : props.label === 'Moderated Content' ?
                            (
                              <div className="textinsight" style={{ marginBottom: "35px", }}>
                                <ModeratedResponse response={props.generatedResponseofDocs} filename="Moderation Response" />
                              </div>
                            ) : (
                              <>
                                <div className="textinsight" style={{ marginBottom: "0", paddingTop: "0px", background: backgroundColor, color: color }}>
                                  <div dangerouslySetInnerHTML={{ __html: marked(props.generatedResponseofDocs?.trim()) }} />
                                </div>
                                {/* <textarea
                                className="text"
                                type="text"
                                maxLength={5000}
                                placeholder={props.outputplaceholder}
                                value={props.generatedResponseofDocs?.trim()}
                                readOnly
                                style={{backgroundColor:backgroundColor,color:color}}
                              /> */}
                              </>
                            )
                        }

                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "-1px" }}>
                          {props.label === 'Keywords' ? (
                            ''
                          ) :
                            props.label === 'Moderated Content' ? (
                              ''
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  // border: "1px solid #aeaaaa ",
                                  borderTop: "none",
                                  padding: "5px",
                                  borderRadius: "0px 0px 10px 10px",
                                  background: "white",
                                  borderLeft: "1px solid rgb(209, 202, 202)",
                                  borderRight: "1px solid rgb(209, 202, 202)",
                                  borderBottom: "1px solid rgb(209, 202, 202)",
                                  backgroundColor: backgroundColor
                                }}>
                                <DownloadPdf output={props.generatedResponseofDocs} filename={filename} />
                              </Box>
                            )
                          }
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default TextAnalyticsLAyout;
