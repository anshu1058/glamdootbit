import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { chunk } from 'lodash';
import TextAnalyticsLAyout from '../layout/CommonFrame';
import { useTranslation } from 'react-i18next';

const AzureModerator = () => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [summarizedtext, setSummarizedText] = useState([]);
  const [textLoading, setTextLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);

  const [summary, setSummary] = useState([]);
  const [file, setselectedfile] = useState('');
  const [mode, setMode] = useState(t('moderation'));
  const [model, setModel] = useState("text-davinci-003");
  const [temperature, setTemperature] = useState(0.5);
  const [maxLength, setMaxLength] = useState(60);
  const [topP, setTopP] = useState(1.0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.8);
  const [presencePenalty, setPresencePenalty] = useState(0.0);
  const [fileExtension,setFileExtension]=useState('')

  const serviceName='contentmoderatorglam';
  const apiKey='e5484c4a39604b08846a8710e2a9832d';
  const tokenLimit=parseInt(1000, 10)
//   const serviceName = process.env.REACT_APP_AZURE_MODERATOR_SVCNAME;
//   const azureEndpoint = `https://${serviceName}.cognitiveservices.azure.com/`;
//   const apiKey = process.env.REACT_APP_AZURE_MODERATOR_API; // Replace with your actual API key
//   const tokenLimit = parseInt(process.env.REACT_APP_TOKEN_LIMIT, 10); // Modify this value as needed

  // Function to handle Slider changes and update the corresponding state values

  const saveResponseToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const getResponseFromLocalStorage = (key) => {
    try {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return null;
    }
  };

  // useEffect to initialize state from local storage
  useEffect(() => {
    const storedText = localStorage.getItem('text');

    const fileExtension=localStorage.getItem('fileExtension');

    if(fileExtension){
      setFileExtension(fileExtension);
    }
    
    if (storedText) {
      setText(storedText);
    }
    const storedSummarizedText = getResponseFromLocalStorage('moderationResponse');
    if (storedSummarizedText) {
      setSummarizedText(storedSummarizedText);
    }

    const storedDocumentText = localStorage.getItem('documenttext');
    if (storedDocumentText) {
      setDocumentText(storedDocumentText);
    }


    const storedSummary = getResponseFromLocalStorage('documentModerationResponse');
    if (storedSummary) {
      setSummary(storedSummary);
    }

    const storedfILE = localStorage.getItem('File');
    if (storedfILE) {
      setselectedfile(storedfILE);
    }
  }, []); // empty dependency array to run once on mount

  const handleTemperatureChange = (event, newValue) => {
    setTemperature(newValue);
  };

  const handleMaxLengthChange = (event, newValue) => {
    setMaxLength(newValue);
  };

  const handleTopPChange = (event, newValue) => {
    setTopP(newValue);
  };

  const handleFrequencyPenaltyChange = (event, newValue) => {
    setFrequencyPenalty(newValue);
  };

  const handlePresencePenaltyChange = (event, newValue) => {
    setPresencePenalty(newValue);
  };

  const handleInput = (text) => {
    setText(text);
    saveResponseToLocalStorage('text', text); // Save input text to local storage
  };

  const handleFile = (File) => {
    setselectedfile(File);
    localStorage.setItem('File', File);
    const fileExtension = extractExtensionFromURL(File);
    setFileExtension(fileExtension)
    localStorage.setItem("fileExtension",fileExtension)

  };

  const processModerationResult = (moderationResult) => {
    return moderationResult.text || '';
  };

  const HandleSubmit = async () => {
    setTextLoading(true);
    setSummarizedText('');

    const url = `${azureEndpoint}/contentmoderator/moderate/v1.0/ProcessText/Screen?autocorrect=True&PII=True&classify=True`;
    const words = text.split(/\s+/);

    try {
      for (let i = 0; i < words.length; i += tokenLimit) {
        let chunk = words.slice(i, i + tokenLimit).join(' ');

        while (chunk.length > tokenLimit) {
          const smallerChunk = chunk.slice(0, tokenLimit);
          chunk = chunk.slice(tokenLimit);

          const response = await axios.post(
            url,
            smallerChunk,
            {
              headers: {
                'Content-Type': 'text/plain',
                'Ocp-Apim-Subscription-Key': apiKey,
              },
            }
          );

          const moderationResult = response.data;
          const formattedResult = formatObjectContent(moderationResult);

          setSummarizedText((prevSummary) => prevSummary + formattedResult);
          saveResponseToLocalStorage('moderationResponse', moderationResult);
        }

        if (chunk.length > 0) {
          const response = await axios.post(
            url,
            chunk,
            {
              headers: {
                'Content-Type': 'text/plain',
                'Ocp-Apim-Subscription-Key': apiKey,
              },
            }
          );

          const moderationResult = response.data;
          const formattedResult = formatObjectContent(moderationResult);

          setSummarizedText(moderationResult );
          saveResponseToLocalStorage('moderationResponse', moderationResult);
        }
      }

      setTextLoading(false);
    } catch (error) {
      console.error('Error moderating content:', error);
      setTextLoading(false);
    }
  };

  const [documentText, setDocumentText] = useState('');

  const handleDocument = async (File) => {
    setDocumentText(File);
    localStorage.setItem('documenttext',File)
    try {
      const response = await axios.get(File);
      const content = response.data;
      setDocumentText(content);
      await handleSummarizeDocument(content);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const extractExtensionFromURL = (url) => {
    const urlWithoutParams = url.split('?')[0];
    const filename = urlWithoutParams.split('/').pop();
    const extension = filename.split('.').pop();
    return extension;
  };

  const handleSummarizeDocument = async () => {
    setDocumentLoading(true);
    setSummary('');
  

    const url = `${azureEndpoint}/contentmoderator/moderate/v1.0/ProcessText/Screen?autocorrect=True&PII=True&classify=True`;
    const words = documentText.split(/\s+/);

    try {
      for (let i = 0; i < words.length; i += tokenLimit) {
        let chunk = words.slice(i, i + tokenLimit).join(' ');

        while (chunk.length > tokenLimit) {
          const smallerChunk = chunk.slice(0, tokenLimit);
          chunk = chunk.slice(tokenLimit);

          const response = await axios.post(
            url,
            smallerChunk,
            {
              headers: {
                'Content-Type': 'text/plain',
                'Ocp-Apim-Subscription-Key': apiKey,
              },
            }
          );

          const moderationResult = response.data;
          const formattedResult = formatObjectContent(moderationResult);

          setSummary( moderationResult );
          saveResponseToLocalStorage('documentModerationResponse', moderationResult);
        }

        if (chunk.length > 0) {
          const response = await axios.post(
            url,
            chunk,
            {
              headers: {
                'Content-Type': 'text/plain',
                'Ocp-Apim-Subscription-Key': apiKey,
              },
            }
          );

          const moderationResult = response.data;
          const formattedResult = formatObjectContent(moderationResult);

          setSummary((prevSummary) => prevSummary +  moderationResult );
          saveResponseToLocalStorage('documentModerationResponse', moderationResult);
        }
      }

      setDocumentLoading(false);
    } catch (error) {
      console.error('Error moderating content:', error);
      setDocumentLoading(false);
    }
  };

  const formatObjectContent = (obj, depth = 0) => {
    let formattedText = '';
    const indentation = '  '.repeat(depth);
    const boldMarker = '**';

    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        formattedText += `${indentation}${boldMarker}${key}${boldMarker}:\n`;

        if (typeof value === 'object' && value !== null) {
          formattedText += `${formatObjectContent(value, depth + 1)}\n`;
        } else if (Array.isArray(value)) {
          formattedText += `${indentation}  ${value.join(', ')}\n`;
        } else {
          formattedText += `${indentation}  ${value}\n`;
        }
      }
    }

    return formattedText;
  };

  const handleTextClear = () => {
    localStorage.removeItem('text');
    localStorage.removeItem('moderationResponse');
    setText('');
    setSummarizedText('');
    setTextLoading(false);
  };

  const handleDocClear = () => {
    localStorage.removeItem('documentText');
    localStorage.removeItem('documentModerationResponse');
    localStorage.removeItem('fileExtension');
    // localStorage.removeItem('extractedText')
    setSummary('');
    setDocumentText('');
    setselectedfile('');
    setDocumentLoading(false);
    setFileExtension('')
  };

  return (
    <>
      <TextAnalyticsLAyout
        onTextExtracted={handleDocument}
        inputText={handleInput}
        text={text}
        File={handleFile}
        selectedfile={file}
        outputplaceholder={t('generated_data')}
        inputplaceholder={t('Enter-Text')}
        handleSubmit={HandleSubmit}
        generatedResponse={summarizedtext}
        label="Moderated Content"
        buttonLabel="Moderate"
        textLoading={textLoading}
        documentLoading={documentLoading}
        documentUpload={handleSummarizeDocument}
        generatedResponseofDocs={summary}
        textclear={handleTextClear}
        docclear={handleDocClear}
        model={model}
        mode={mode}
        temp={temperature}
        maxLength={maxLength}
        topP={topP}
        frequencyPenalty={frequencyPenalty}
        presencePenalty={presencePenalty}
        onTemperatureChange={handleTemperatureChange}
        onMaxLengthChange={handleMaxLengthChange}
        onTopPChange={handleTopPChange}
        onFrequencyPenaltyChange={handleFrequencyPenaltyChange}
        onPresencePenaltyChange={handlePresencePenaltyChange}
        fileExtension={fileExtension}
      />
    </>
  );
};

export default AzureModerator;
