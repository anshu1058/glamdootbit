// Summary component for the summarization using dis=ffernt modal of azure.
//  using utils for switching between different modals.
//  using common frame component for the layout.


import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextAnalyticsLAyout from '../layout/CommonFrame';
import { commonDocumentSummarizer,commontextSummarizer } from './TextAnalyticsfunc';
import { getModelParameters } from '../utils';

const SummaryAzureopenAi = () => {
  const [text, setText] = useState('');
  const [summarizedtext, setSummarizedText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [documentText, setDocumentText] = useState('');
  const [mode, setMode] = useState(t('summary'));
  const [model, setModel] = useState("gpt-4o-mini"); // Set a default model
  const [temperature, setTemperature] = useState(0.2);
  const [maxLength, setMaxLength] = useState(150);
  const [topP, setTopP] = useState(1.0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
  const [presencePenalty, setPresencePenalty] = useState(0.0);
  const [file, setselectedfile] = useState('');
  const [selectedmodel,setSelectedModel]=useState('gpt-4o-mini')
  const modelsList = ["gpt-4o", "gpt-35-turbo","gpt-4o-mini"]; // Add more models if needed
  const [textLoading, setTextLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [fileExtension,setFileExtension]=useState('')
  const [tokenLimit,setTokenLimit]=useState('22000')
  
  useEffect(() => {
    const storedText = localStorage.getItem('summaryText');
    const storedSummarizedText = localStorage.getItem('summarizedText');
    const fileExtension=localStorage.getItem('fileExtension');
    
    if(fileExtension){
      setFileExtension(fileExtension);
    }
    
    if (storedText) {
      setText(storedText);
    }
    
    if (storedSummarizedText) {
      setSummarizedText(storedSummarizedText);
    }
    const storedDocumentText = localStorage.getItem('documentText');
    const storedSummary = localStorage.getItem('summary');
    const extractedText = localStorage.getItem('extractedText');
    if(extractedText){
      setDocumentText(extractedText);
    }

    if (storedDocumentText) {
      setselectedfile(storedDocumentText);
    }

    if (storedSummary) {
      setSummary(storedSummary);
    }
  }, [documentText]);
  // Function to handle Slider changes and update the corresponding state values
  const handleTemperatureChange = (newValue) => {
    setTemperature(newValue);
  };

  const handleMaxLengthChange = (newValue) => {
    setMaxLength(parseInt(newValue));
  };

  const handleTopPChange = (newValue) => {
    setTopP(newValue);
  };

  const handleFrequencyPenaltyChange = (newValue) => {
    setFrequencyPenalty(newValue);
  };

  const handlePresencePenaltyChange = (newValue) => {
    setPresencePenalty(newValue);
  };

  const handleInput = (text) => {
    setText(text);
    localStorage.setItem('summaryText', text);
  };
 
  const handleFile = (File) => {
    setselectedfile(File);
    localStorage.setItem('documentText', File);
    
    const fileExtension = extractExtensionFromURL(File);
    setFileExtension(fileExtension)
    localStorage.setItem("fileExtension",fileExtension)
  };
  
  const handleDocument = (File) => {
    setDocumentText(File);
    localStorage.setItem('extractedText', File);  
  };



  const extractExtensionFromURL = (url) => {
    const urlWithoutParams = url.split('?')[0];
    const filename = urlWithoutParams.split('/').pop();
    const extension = filename.split('.').pop();
    return extension;
  };

  
  // Function to handle model changes
  const handleModelChange = (selectedModel) => {
    localStorage.setItem('selectedModel', selectedModel);
    const updatedParameters = getModelParameters(selectedModel);
    // Update state with the selected model and its parameters
    setModel(selectedModel);
    setSelectedModel(updatedParameters.model)
    setTemperature(updatedParameters.temperature);
    setMaxLength(updatedParameters.maxLength);
    setTopP(updatedParameters.topP);
    setFrequencyPenalty(updatedParameters.frequencyPenalty);
    setPresencePenalty(updatedParameters.presencePenalty);
    setTokenLimit(updatedParameters.tokenlimit)
  };
  

  const handleSubmit = async () => {
    setSummarizedText('')
    // const prompt = generatePrompt(text);
    const  documentText=text;
    const prompt = `Summarize the following text in the same language, ensuring the summary is concise, well-structured, and written in proper paragraphs with the bullet points. The summary should be exactly ${maxLength} words long or less. Do not include any additional content beyond the summary. Ensure the output only contains the summary in the 'content'.<<<TEXT>>>`;
    const maxTokens = 50;
    const summary = await commontextSummarizer({ prompt, documentText, maxLength, temperature, model,setTextLoading,selectedmodel,topP,frequencyPenalty,presencePenalty,tokenLimit});
    setSummarizedText(summary);
    localStorage.setItem('summarizedText', summary);
    
  };

  const handleSummarizeDocument = async () => {
    setSummary('');
    const prompt = `Summarize the following text in the same language, ensuring the summary is concise, well-structured, and written in proper paragraphs with the bullet points. The summary should be exactly ${maxLength} words long or less. Do not include any additional content beyond the summary. Ensure the output only contains the summary in the 'content'.<<<TEXT>>>`;
    const maxTokens = 1000;
    const summary = await commonDocumentSummarizer({ prompt, documentText,  maxLength, temperature, model,setDocumentLoading,selectedmodel,topP,frequencyPenalty,presencePenalty,tokenLimit});
    setSummary(summary);
    localStorage.setItem('summary', summary);
  };

 

  const handleTextClear = () => {
    localStorage.removeItem('summaryText');
    localStorage.removeItem('summarizedText');
    setText('');
    setSummarizedText(''); 
    setselectedfile('');
    setTextLoading(false);
  };
  const handleDocClear = () => {
    localStorage.removeItem('documentText');
    localStorage.removeItem('summary')
    localStorage.removeItem('fileExtension')
    localStorage.removeItem('extractedText')
    setSummary('');
    setDocumentText('');
    setselectedfile('');
    setDocumentLoading(false)
    setFileExtension('')
  };

 
// all the summary related functionality is here
  return (
    <>
      <TextAnalyticsLAyout
        onTextExtracted={handleDocument}
        inputText={handleInput}
        File={handleFile}
        text={text}
        selectedfile={file}
        // outputplaceholder={t('Summarized-Data')}
        inputplaceholder={t('inputText')}
        handleSubmit={handleSubmit}
        generatedResponse={summarizedtext}
        buttonLabel={t('summarize')}
        textLoading={textLoading}
        documentLoading={documentLoading}
        documentUpload={handleSummarizeDocument}
        generatedResponseofDocs={summary}
        textclear={handleTextClear}
        docclear={handleDocClear}
        modelsList={modelsList}
        model={model}
        mode={mode}
        temp={temperature}
        topP={topP}
        maxLength={maxLength}
        frequencyPenalty={frequencyPenalty}
        presencePenalty={presencePenalty}
        onModelChange={handleModelChange}
        onTemperatureChange={handleTemperatureChange}
        onMaxLengthChange={handleMaxLengthChange}
        onTopPChange={handleTopPChange}
        onFrequencyPenaltyChange={handleFrequencyPenaltyChange}
        onPresencePenaltyChange={handlePresencePenaltyChange}
        selectedModel={selectedmodel}
        label={t('summary')}
        documentText={documentText}
        fileExtension={fileExtension}
      />
    </>
  );
};

export default SummaryAzureopenAi;
