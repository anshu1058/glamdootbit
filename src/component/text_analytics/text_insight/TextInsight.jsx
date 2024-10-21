// text insight component to extract insight from the text using azure text analytics services and using the common the frame 
// component for passing the props or values

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import TextAnalyticsLAyout from '../layout/CommonFrame';
import env from '../../../../config';



const TextInsightAzureOpenAi = () => {
  const [text, setText] = useState('');
  const [summarizedtext, setSummarizedText] = useState([]);
  const [summary, setSummary] = useState([]);
  const { t } = useTranslation();
  const [documentText, setDocumentText] = useState('');
  const [file, setselectedfile] = useState('');
  const [textLoading, setTextLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [fileExtension, setFileExtension] = useState('');
  const [entities, setEntities] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storeText = localStorage.getItem('Text');
    const storedSummarizeText = localStorage.getItem('TextInsight');
    const fileExtension = localStorage.getItem('fileExtension');

    if (fileExtension) {
      setFileExtension(fileExtension);
    }


    if (storeText) {
      setText(storeText);
    }

    if (storedSummarizeText) {
      try {
        const parsedSummarizedText = JSON.parse(storedSummarizeText);
        setSummarizedText(parsedSummarizedText);
      } catch (error) {
        console.error('Error parsing stored summarized text:', error);
        // Handle the error or set default value for summarizedText
        setSummarizedText([]);
      }
    }
    const storedDocumentTex = localStorage.getItem('docText');
    const storeinsight = localStorage.getItem('insight');
    const documentText = localStorage.getItem('extractedText');

    if (documentText) {
      setDocumentText(documentText);
    }
    if (storedDocumentTex) {
      setselectedfile(storedDocumentTex);
    }

    if (storeinsight) {
      // setSummary(storeinsight);
      try {
        const parsedSummarizedText = JSON.parse(storeinsight);
        setSummary(parsedSummarizedText);
      } catch (error) {
        console.error('Error parsing stored summarized text:', error);
        // Handle the error or set default value for summarizedText
        setSummary([]);
      }
    }
  }, []);
  // Function to handle Slider changes and update the corresponding state values

  const handleInput = (text) => {
    setText(text);
    localStorage.setItem('Text', text);
  };

  const handleFile = (File) => {
    setselectedfile(File);
    localStorage.setItem('docText', File);
    const fileExtension = extractExtensionFromURL(File);
    setFileExtension(fileExtension)
    localStorage.setItem("fileExtension", fileExtension)
  };

  const handleDocument = (File) => {
    setDocumentText(File);
    localStorage.setItem('extractedText', File);

  };

  const handleSubmit = () => {
    if (text.trim() !== '') {
      extractEntities();
    }
  };

  const extractExtensionFromURL = (url) => {
    const urlWithoutParams = url.split('?')[0];
    const filename = urlWithoutParams.split('/').pop();
    const extension = filename.split('.').pop();
    return extension;
  };

  const extractEntities = async () => {
    setTextLoading(true);
    setSummarizedText([])
    try {
      const response = await axios.post(
        'https://c679-2405-201-4055-301c-fdff-bf43-f3ab-8995.ngrok-free.app/send_data',
        { data: text }
      );
      const chunks = response.data.data.chunks;
      setChunks(chunks); // Save the chunks
      await fetchAllEntitiesoftext(chunks); // Fetch entities for all chunks
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setTextLoading(false);
    }

  };

  // Function to fetch entity data for each chunk and merge results
  const fetchAllEntitiesoftext = async (chunkIds) => {
    const allEntities = [];
    try {
      for (const chunkId of chunkIds) {
        console.log("chunkId", chunkId)
        const response = await axios.post(
          'https://c679-2405-201-4055-301c-fdff-bf43-f3ab-8995.ngrok-free.app/get_data',
          { chunk_uid: chunkId }
        );
        allEntities.push(response.data.data); // Add each chunk's data to the list
      }
      setSummarizedText(allEntities); // Save the combined entity data
      localStorage.setItem('TextInsight', JSON.stringify(allEntities));
    } catch (err) {
      setError('Failed to fetch entities');
    }
  };


  const handleSummarizeDocument = async () => {
    setDocumentLoading(true);
    setSummary([]); // Clear the summary before processing chunks

    try {
      const apiUrl = `https://c679-2405-201-4055-301c-fdff-bf43-f3ab-8995.ngrok-free.app/send_data`;
      // Process each chunk separately

      const response = await axios.post(
        apiUrl,
        { data: documentText }
      );
      const chunks = response.data.data.chunks;
      setChunks(chunks); // Save the chunks
      await fetchAllEntities(chunks); // Fetch entities for all chunks
      setDocumentLoading(false);
    } catch (error) {
      console.error('Error extracting entities from document text:', error);
      setDocumentLoading(false);
      // Handle the error condition
    }
  };


  // Function to fetch entity data for each chunk and merge results
  const fetchAllEntities = async (chunkIds) => {
    const allEntities = [];
    try {
      for (const chunkId of chunkIds) {
        console.log("chunkId", chunkId)
        const response = await axios.post(
          'https://c679-2405-201-4055-301c-fdff-bf43-f3ab-8995.ngrok-free.app/get_data',
          { chunk_uid: chunkId }
        );
        allEntities.push(response.data.data); // Add each chunk's data to the list
      }
      // setEntities(allEntities); // Save the combined entity data
      setSummary(allEntities);
      localStorage.setItem('insight', JSON.stringify(allEntities));
    } catch (err) {
      setError('Failed to fetch entities');
    }
  };

  console.log("entity", entities)
  const handleTextClear = () => {
    localStorage.removeItem('Text');
    localStorage.removeItem('TextInsight');
    setText('');
    setSummarizedText([]);
    setselectedfile('');
    setTextLoading(false);
  };
  const handleDocClear = () => {
    localStorage.removeItem('documentText');
    localStorage.removeItem('summary')
    localStorage.removeItem('fileExtension')
    setSummary([]);
    setDocumentText('');
    setselectedfile('');
    setDocumentLoading(false)
    setFileExtension('')
  };

  return (
    <>
      <TextAnalyticsLAyout
        onTextExtracted={handleDocument}
        inputText={handleInput}
        File={handleFile}
        text={text}
        selectedfile={file}
        outputplaceholder={t('generated_data')}
        inputplaceholder={t('enter_text')}
        handleSubmit={handleSubmit}
        generatedResponse={summarizedtext}
        buttonLabel={t('generate')}
        label='Keywords'
        textLoading={textLoading}
        documentLoading={documentLoading}
        documentUpload={handleSummarizeDocument}
        generatedResponseofDocs={summary}
        textclear={handleTextClear}
        docclear={handleDocClear}
        documentText={documentText}
        fileExtension={fileExtension}
      />
    </>
  );
};

export default TextInsightAzureOpenAi;
