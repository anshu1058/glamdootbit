// Document translation component using azure translator services

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../textanalysis.css";
import {
  Typography,
  Box,
  IconButton,
  Button,
  Grid,
  ButtonGroup,
  Snackbar,
  CircularProgress,
  Alert
} from "@mui/material";
import SelectDocs from "../../common/SelectDocs";
import { useTranslation } from "react-i18next";
import { BlobServiceClient } from "@azure/storage-blob";
import languages from "./language";
import DownloadPdf from "../../common/Downloadpdf";
import AzureTranslator from "./AzureTranslator";
import DocumentViewer from "../document_viewer/DocumentViewer";
import DocViewfortranslaton from "./DocViewerforTranslation";
import ToggleButtonforcomponent from "../../common/ToggleButton";
import ResetButton from "../../common/ResetButton";
import "../layout/layout.css";
import { ThemeContext } from "../../header/ThemeContext";
import Select from 'react-select';
import Slider from 'react-slick';
import SimpleSlider from "./TranslationCarousel";


const DocumentTranslation = () => {
  const { t } = useTranslation();
  const [textLoading, setTextLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentSearchLoading, setSearchDocumentLoading] = useState(false);
  const [to, setTo] = useState("en");
  const [toText, setToText] = useState("en");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fileExtension, setFileExtension] = useState('');
  const [showhide, setShowhide] = useState("text");
  const [selectedFile, setselectedFile] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [translatedDocurl, setTranslatedDocurl] = useState("");
  const [url, setUrl] = useState('')
  const { theme } = useContext(ThemeContext);
  const backgroundColor = theme === "dark" ? "#333" : "#fff";
  const color = theme === "dark" ? "white" : "black";
  const [docExist, setDocExist] = useState(false)
  const [selecteddocexist, setTranslatedDocExist] = useState(false);
  const [docexistmsg, setmsg] = useState("Translated Docs")
  const [langlabel, setlanglabel] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  // Add more models if needed

  const storageAccountName = 'glamblobstorage'
  const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/?sp=racwdli&st=2023-11-21T06:43:14Z&se=2024-10-25T14:43:14Z&sv=2022-11-02&sr=c&sig=CEYktttOh1XVlzm48giWTSyaUuiTrVeoAZ8c8jdgx2c%3D`;
  
  const handlePreviewClick = (doc) => {
    setSelectedDoc(doc);
    setExpanded(true);
  };

  const handleClosePreview = () => {
    setExpanded(false);
  };


  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  

  // Function to handle Slider changes and update the corresponding state values





  const translate = async () => {
    setTextLoading(true);
    const translated = await AzureTranslator({ to, input });
    if (translated) {
      setOutput(translated);
    }
    setTextLoading(false);
  }

  const handleClear = () => {
    localStorage.removeItem('selectedLanguage')
    setInput("");
    setOutput("");
    setTo('en')
    setTextLoading(false)


  };

  const handleClearDoc = async () => {
    localStorage.removeItem('cachedInputurl')
    localStorage.removeItem('cachedURL')
    localStorage.removeItem('selectedDocLanguage')
    localStorage.removeItem('fileExtensiontranslation')
    // await deleteAllFilesFromTargetStorage();
    setselectedFile("");
    setToText('en')
    setTranslatedDocurl("")
    setDocumentLoading(false)
    setFileExtension('')
    setTranslatedVersions([])
    setTranslatedDocExist(flase)
    setmsg("Translated Docs")

    translatedVersions = [];
  };




  const extractExtensionFromURL = (url) => {
    const urlWithoutParams = url.split('?')[0]; // Extract URL part before the query parameters
    const filename = urlWithoutParams.split('/').pop(); // Extract the filename from the URL
    const extension = filename.split('.').pop(); // Get the extension from the filename
    return extension;
  };


  let [translatedVersions, setTranslatedVersions] = useState([])
  const handleDocument = async (File) => {
    const filename = File.name
    setDocumentText(File.name);
    setselectedFile(File.url);
    const fileNameWithoutExtension = File.name;
    const translations = await getTranslatedVersions(fileNameWithoutExtension);
    // Store translated versions in state
    setTranslatedVersions(translations);
    const fileExten = extractExtensionFromURL(File.url);
    setFileExtension(fileExten)
    localStorage.setItem('fileExtensiontranslation', fileExten);
    localStorage.setItem("cachedInputurl", File.url);
    localStorage.setItem('file', filename);
    localStorage.removeItem('cachedURL')
    setDocumentLoading(false)
  };


  const getTranslatedVersions = async (fileName) => {
    const blobService = new BlobServiceClient(uploadUrl);
    const containerClient = blobService.getContainerClient("translayedfiles");
    let translatedVersions = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      if (blob.name.startsWith(fileName)) {
        // Extract language from blob name if it's part of your naming convention
        const languageCode = blob.name.split('_').pop().split('.')[0]; // Assumes the language code is between `_` and `.` in the file name
        const blobUrl = `https://glamblobstorage.blob.core.windows.net/translayedfiles/${blob.name}?sp=racwdli&st=2023-11-21T06:43:14Z&se=2024-10-25T14:43:14Z&sv=2022-11-02&sr=c&sig=CEYktttOh1XVlzm48giWTSyaUuiTrVeoAZ8c8jdgx2c%3D`;
        translatedVersions.push({ languageCode, url: blobUrl });
      }
    }

    return translatedVersions;
  };


  const deleteAllFilesFromTargetStorage = async () => {

    const blobService = new BlobServiceClient(uploadUrl);
    const containerClient = blobService.getContainerClient("translayedfiles"); // Replace with your target container name

    // Iterate over all blobs in the container and delete them
    for await (const blob of containerClient.listBlobsFlat()) {
      const blobClient = containerClient.getBlobClient(blob.name);
      await blobClient.deleteIfExists();
    }
  };




  const [targetName, setTargetName] = useState('')

  const handleTranslateDocument = async () => {
    setDocumentLoading(true);
    setUrl('');
    setTargetName('');
    localStorage.removeItem('targetfile');
    setTranslatedDocurl('');

    const targetBlobName = `${documentText}_${langlabel}.${fileExtension}`;

    // Step 1: Check if the document already exists in the blob storage
    const exists = await getBlobsInContainer(targetBlobName);

    if (!exists) {
      // Step 2: If the document does not exist, proceed to call the translation API
      let svcname = process.env.REACT_APP_TRANSLATOR_SVCNAME;
      let endpoint = `https://${svcname}.cognitiveservices.azure.com/translator/text/batch/v1.1`;
      let route = '/batches';
      let key = process.env.REACT_APP_AZURE_TRANSLATOR_API;
      const targetURl = `https://glamblobstorage.blob.core.windows.net/translayedfiles/${targetBlobName}?sp=racwdli&st=2023-11-21T06:43:14Z&se=2024-10-25T14:43:14Z&sv=2022-11-02&sr=c&sig=CEYktttOh1XVlzm48giWTSyaUuiTrVeoAZ8c8jdgx2c%3D`;

      let data = JSON.stringify({
        "inputs": [
          {
            "storageType": "File",
            "source": {
              "sourceUrl": selectedFile,
              "storageSource": "AzureBlob",
            },
            "targets": [
              {
                "targetUrl": targetURl,
                "storageSource": "AzureBlob",
                "language": toText
              }
            ]
          }
        ]
      });

      let config = {
        method: 'post',
        baseURL: endpoint,
        url: route,
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Content-Type': 'application/json'
        },
        data: data
      };

      try {
        const response = await axios(config);
        console.log("response", response.status)
        if (response.status === 202) {
          setTargetName(targetBlobName);
          setDocExist(true)
          // Wait for the document to be available in the blob storage after translation
          await getBlobsInContainer(targetBlobName);
          // waitForDocumentPreview();
        }
      } catch (error) {
        console.log(error);
        setDocumentLoading(false);
      }
    }
  };





  useEffect(() => {
    if (docExist) {
      const pollBotResponses = () => {
        getBlobsInContainer(targetName);
      };
      // Polling every 5 seconds
      if (url === '') {
        const pollIntervalId = setInterval(pollBotResponses, 5000);
        return () => clearInterval(pollIntervalId);

      }
    }
  }, [url, documentText, toText, fileExtension, docExist, targetName]);

  const getBlobsInContainer = async (targetBlobName) => {
    const blobService = new BlobServiceClient(uploadUrl);
    const containerClient = blobService.getContainerClient("translayedfiles");
    for await (const blob of containerClient.listBlobsFlat()) {
      const blobClient = containerClient.getBlobClient(blob.name);
      const properties = await blobClient.getProperties();

      if (blob.name === targetBlobName) {
        console.log("blob",blob.name,targetBlobName)
        const blobUrl = `https://glamblobstorage.blob.core.windows.net/translayedfiles/${blob.name}?sp=racwdli&st=2023-11-21T06:43:14Z&se=2024-10-25T14:43:14Z&sv=2022-11-02&sr=c&sig=CEYktttOh1XVlzm48giWTSyaUuiTrVeoAZ8c8jdgx2c%3D`;
        setUrl(blobUrl);
        setTranslatedDocurl(blobUrl);
        localStorage.setItem("cachedURL", blobUrl)
        setDocumentLoading(false);
        return true;  // Found the document, no need to proceed further
      }
    }

    return false; // Document not found in the blob storage
  };


  useEffect(() => {
    const fetchInitialValues = async () => {
      const cachedInput = localStorage.getItem("cachedInput");
      const cachedOutput = localStorage.getItem("cachedOutput");
      const cachedto = localStorage.getItem("cachedto");
      const file = localStorage.getItem("file");
      const targetfile = localStorage.getItem("targetfile")
      const fileExtensiontranslation = localStorage.getItem('fileExtensiontranslation');

      if (cachedInput) {
        setInput(cachedInput);
      }
      if (fileExtensiontranslation) {
        setFileExtension(fileExtensiontranslation);
      }
      if (targetfile) {
        setTargetName(targetfile);
      }

      if (cachedOutput) {
        setOutput(cachedOutput);
      }

      if (cachedto) {
        setTo(cachedto);
      }
      if (file) {
        setDocumentText(file);
        const translations = await getTranslatedVersions(file);
        setTranslatedVersions(translations);
      }
      const cachedInputurl = localStorage.getItem("cachedInputurl");
      const cachedURL = localStorage.getItem("cachedURL");
      const cacheddocto = localStorage.getItem("cacheddocto");

      if (cachedInputurl) {
        setselectedFile(cachedInputurl);
      }

      if (cachedURL) {
        setTranslatedDocurl(cachedURL);
      }
      if (cacheddocto) {
        setToText(cacheddocto);
      }
    };

    fetchInitialValues();
  }, []);

  useEffect(() => {
    localStorage.setItem("cachedInput", input);
  }, [input]);

  //   useEffect(() => {
  //   localStorage.setItem('fileExtension',fileExtension);
  // }, [fileExtension]);
  useEffect(() => {
    localStorage.setItem("cachedOutput", output);
  }, [output]);

  useEffect(() => {
    localStorage.setItem("cachedto", to);
  }, [to]);



  const handleLanguageChange = (value) => {

    setTo(value);
    localStorage.setItem('selectedLanguage', value);
    localStorage.removeItem('cachedURL')
    localStorage.removeItem('fileExtensiontranslation')
  };

  const handleLanguageChangeDoc = async (value) => {
    console.log("value", value)
    setToText(value.value);
    setlanglabel(value.label)
    setSearchDocumentLoading(true)
    localStorage.setItem('selectedDocLanguage', value.value);
    localStorage.removeItem('cachedURL');
    localStorage.removeItem('fileExtensiontranslation');
    setTranslatedDocurl('');
    setTranslatedDocExist(false); // Reset existence check


    // Assuming `selectedFile` is the document identifier
    const targetBlobName = `${documentText}_${value.value}.${fileExtension}`;

    // Check if the document exists in the blob storage
    const exists = await getBlobsInContainer(targetBlobName);
    if (exists === false) {
      setTranslatedDocExist(true)
      setSearchDocumentLoading(false)
      // Set the URL for preview
      // setTranslatedDocurl(`https://glamblobstorage.blob.core.windows.net/translayedfiles/${targetBlobName}?sp=racwdli&st=2023-11-21T06:43:14Z&se=2024-10-25T14:43:14Z&sv=2022-11-02&sr=c&sig=CEYktttOh1XVlzm48giWTSyaUuiTrVeoAZ8c8jdgx2c%3D`);
      // setDocumentLoading(false); // No need to translate
    } else {
      setTranslatedDocExist(true); // Document exists, disable translation
      setmsg("Already exist")
    }
  };


  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      setTo(storedLanguage);
    }
  }, []);

  useEffect(() => {
    const storedDocLanguage = localStorage.getItem('selectedDocLanguage');
    if (storedDocLanguage) {
      setToText(storedDocLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cacheddocto", toText);
  }, [toText]);



  const handleSave = async () => {
    if (translatedDocurl) {
      const blobService = new BlobServiceClient(uploadUrl);
      const containerClient = blobService.getContainerClient("translayedfiles");

      // Define a unique name for the saved file (you may use the translated document's name or generate a unique name)
      const fileName = `translated_${Date.now()}.pdf`; // Example: "translated_1638837738172.pdf"

      try {
        const blobClient = containerClient.getBlockBlobClient(fileName);

        // Fetch the translatedDocurl content
        const response = await fetch(translatedDocurl);
        const fileBlob = await response.blob();

        // Set the content type if known; otherwise, it may default to 'application/octet-stream'
        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        const options = { blobHTTPHeaders: { blobContentType: contentType } };

        // Upload the file blob to Azure Blob Storage
        await blobClient.uploadData(fileBlob, options);
        setSnackbarMessage(`File ${fileName} has been saved successfully.`);
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error saving file to blob storage:", error);
        setSnackbarMessage('Error occurred while saving the file.');
        setSnackbarOpen(true);
      }
    } else {
      console.error("No translated document available to save.");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const languageOptions = languages.map((opt) => ({
    value: opt.code,
    label: opt.name,
  }));
  const [menuIsOpen, setMenuIsOpen] = useState(true);

  return (
    <>
      {/* <PdfViewer url={translatedDocurl}/> */}
      <div className={`${showhide === "text" ? "maincontent2" : "maincontent2"}`}>
        <div className={`${showhide === "text" ? "text-analysis-container" : "text-analysis-container"}`}>
          <Grid container>
            <Grid item xs={11.5} lg={11.5} md={11.5} sm={11.5}>
              <Grid container style={{ position: "relative", top: "2px", zIndex: 10 }}>
                <Grid item xs={12} sm={12} lg={6} md={6}>
                  <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <div className="curveborder" style={{ background: backgroundColor, color: color }} >
                      <ToggleButtonforcomponent showhide={showhide} setShowhide={setShowhide} />
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                {showhide === "text" && (
                  <>
                    <Grid item
                      xs={12}
                      sm={12}
                      lg={6}
                      md={6}
                      sx={{
                        marginBottom: { xs: '31px', sm: '31px', md: '0', lg: '0' }
                      }}
                    >
                      <div>
                        <Box className="iocontainer" style={{ height: "69.2vh" }}>
                          <textarea
                            style={{ marginBottom: "40.5px", background: backgroundColor, color: color }}
                            className="text"
                            type="text"
                            value={input}
                            onInput={(e) => setInput(e.target.value)}
                            maxLength={5000}
                            placeholder={t("translate_text")}
                          />
                          <Box style={{ boreder: "2px solid red", display: "flex", width: "100%", justifyContent: "center", marginTop: "-41.4px", background: "none" }}>
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
                              <Box>
                                <ResetButton docclear={handleClear}></ResetButton>
                              </Box>
                            </Box>
                          </Box>
                          <Box>
                          </Box>
                        </Box>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={6} md={6}>
                      <Box className='translaotorheader'>
                        <div className="curveborder" style={{ background: backgroundColor, color: color, display: 'flex' }}>
                          {/* <select className="select-custom"
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            value={to}
                            style={{ background: backgroundColor, color: color }}
                          >
                            {languages.map((opt) => (
                              <option key={opt.code} value={opt.code}>
                                {opt.name}
                              </option>
                            ))}
                          </select> */}
                          <Select
                            className="select-custom"
                            options={languageOptions}
                            value={languageOptions.find(option => option.value === to)}
                            onChange={(selectedOption) => handleLanguageChange(selectedOption.value)}
                            styles={{
                              width: '38px',
                            }}
                            placeholder="Select language..."
                            isSearchable
                          />

                          {textLoading ? <CircularProgress style={{ color: 'blue', width: '20px', height: '20px', marginBottom: "-10px", }} /> : (
                            <Button
                              // className="btn"
                              variant="contained"
                              color="primary"
                              onClick={translate}
                              disabled={input === ""}
                              style={{ background: backgroundColor, boxShadow: "1px 5px 7px 0px #aeaaaa", width: "calc(2vw + 100px)", color: color }}
                            >
                              {t("translate")}
                            </Button>
                          )}
                        </div>
                        {/* </Box> */}
                      </Box>
                      <Box className="iocontainer">
                        <textarea
                          // style={{ minHeight: "350px" }}
                          className="text"
                          type="text"
                          value={output}
                          maxLength={5000}
                          // placeholder={t("translatedText1")}
                          style={{ background: backgroundColor, color: color }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "-1px" }}>
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
                            <DownloadPdf output={output} filename="Translation file" style={{ background: backgroundColor, color: color }} />
                          </Box>
                        </Box>
                      </Box>

                      {/* </div> */}
                    </Grid>
                  </>
                )}
                {showhide === "document" && (
                  <>
                    <Grid item xs={12} sm={12} lg={6} md={6}>
                      <Box className="iocontainerD">
                        <div className="text" style={{ background: backgroundColor, color: color }} >
                          <div style={{ display: 'flex', alignItems: 'center', boxShadow: 'rgb(174, 170, 170) 0px 1px 10px 0px', borderRadius: "15px", marginTop: "0px", marginBottom: "10px" }}>
                            <SelectDocs onSelectFile={handleDocument} />
                          </div>
                          {selectedFile && (
                            <>
                              {/* <Typography>Preview</Typography> */}
                              <div className="previewDoc">
                                {selectedFile && (
                                  <>
                                    <DocumentViewer documentUrl={selectedFile} />
                                  </>)}
                              </div>
                            </>
                          )}
                        </div>
                      </Box>

                      <Box style={{ boreder: "2px solid red", display: "flex", width: "100%", justifyContent: "center", background: "none" }}>
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
                            position: "relative",
                            top: '-1px',
                            backgroundColor: backgroundColor
                          }}>
                          <Box>
                            <ResetButton docclear={handleClearDoc}></ResetButton>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={6} md={6}>
                      <Box className='translaotorheader'>
                        {/* <div className="curveborder" style={{ background: backgroundColor, color: color }}> */}
                        <div className="curveborder" style={{ background: backgroundColor, color: color, display: 'flex' }}>
                          {/* <select
                            className="select-custom"
                            onChange={(e) => handleLanguageChangeDoc(e.target.value)}
                            value={toText}
                            style={{ background: backgroundColor, color: color }}
                          >
                            {languages.map((opt) => (
                              <option key={opt.code} value={opt.code}>
                                {opt.name}
                              </option>
                            ))}
                          </select> */}
                          <Select
                            className="select-custom"
                            options={languageOptions}
                            value={languageOptions.find(option => option.value === toText)}
                            onChange={(selectedOption) => handleLanguageChangeDoc(selectedOption)}
                            styles={{
                              width: '38px',
                            }}
                            placeholder="Select language..."
                            isSearchable
                          />
                          {documentLoading ? <CircularProgress style={{ color: 'blue', width: '20px', height: '20px', marginBottom: "-8px", }} /> : (
                            <Button
                              variant="contained"
                              onClick={handleTranslateDocument}
                              disabled={!selecteddocexist || selectedFile === ""}
                              style={{ background: backgroundColor, boxShadow: "1px 5px 7px 0px #aeaaaa", width: "calc(2vw + 100px)", color: color }}
                            >
                              {t('translate')}
                            </Button>
                          )
                          }
                        </div>
                      </Box>
                      <Box className="iocontainerD">
                        <div className="textDoc" style={{ background: backgroundColor, color: color }}>
                          <div style={{ display: 'flex', alignItems: 'center', boxShadow: 'rgb(174, 170, 170) 0px 1px 10px 0px', borderRadius: "18px", margin: '12px 12px 12px 12px ' }}>
                            {translatedVersions.length > 0 ? (
                           <SimpleSlider translateddocs={translatedVersions} setTranslatedDocurl={setTranslatedDocurl}/>
                            //  <Select
                            //     id="selecttranslateddoc"
                            //     options={translatedVersions.map((version) => ({
                            //       value: version.url,
                            //       label: `Preview in ${version.languageCode}`,
                            //     }))}
                            //     onChange={(option) => setTranslatedDocurl(option.value)}
                            //     placeholder="Select a translated version..."
                            //     styles={{
                            //       width: "100%",
                            //       control: (provided) => ({
                            //         ...provided,
                            //         // Full width for the select component
                            //         borderRadius: '18px',
                            //         // borderColor: 'transparent',
                            //         // boxShadow: 'rgb(174, 170, 170) 0px 1px 10px 0px',
                            //         height: '35px ',
                            //         display: 'flex',
                            //         justifyContent: 'center',
                            //         alignItems: 'center',
                            //         backgroundColor: backgroundColor,
                            //         cursor: 'pointer',
                            //         color: 'black',
                            //         minHeight: "35px",

                            //       }),
                            //       singleValue: (provided) => ({
                            //         ...provided,
                            //         color: 'black', // Text color inside the button
                            //       }),
                            //       placeholder: (provided) => ({
                            //         ...provided,
                            //         color: 'black',
                            //       }),
                            //       indicatorSeparator: () => ({
                            //         display: 'none', // Remove the vertical line between input and dropdown icon
                            //       }),
                            //       dropdownIndicator: (provided) => ({
                            //         ...provided,
                            //         display: 'none', // Remove the dropdown arrow
                            //       }),
                            //       menu: (provided) => ({
                            //         ...provided,
                            //         width: '100%', // Full width for the dropdown menu
                            //       }),
                            //     }}
                            //   />
                            ) :
                              ( 
                                 <Button variant="disabled" style={{ width: '100%', height: '35px', textAlign: 'center', color: "black", fontSize: '12px', cursor: 'auto', borderRadius: "18px" }}>{docexistmsg}
                              </Button>
                              )
                            } 
                          </div>

                          {translatedDocurl && (
                            <>
                              <DocViewfortranslaton documentUrl={translatedDocurl} />
                            </>
                          )}
                        </div>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "-8.5px" }}>
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
                            position: "relative",
                            top: '7.5px',
                            backgroundColor: backgroundColor
                          }}
                        >
                          <a href={translatedDocurl || undefined} download="document.pdf">
                            <Button
                              className="btn"
                              variant="contained"
                              color="primary"
                              // onClick={handleSave}
                              disabled={!translatedDocurl}
                              style={{ background: backgroundColor, boxShadow: "1px 5px 7px 0px #aeaaaa" }}

                            >
                              {/* {t('save')} */}
                              Download
                            </Button>
                          </a>
                        </Box>
                        {/* <DownloadPdf output={output} /> */}
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbarMessage.includes('successfully') ? 'success' : 'error'}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </>
  );
};

export default DocumentTranslation;
