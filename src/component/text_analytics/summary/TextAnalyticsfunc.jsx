// CommonSummarizer.js function calling from from the summary component to passs the value of the differnt modal and text with the prompt.

import axios from 'axios';
import env from '../../../../config';


export const commonDocumentSummarizer = async ({ prompt, documentText, maxLength, temperature, model, mode, setDocumentLoading, selectedmodel,topP,frequencyPenalty,presencePenalty,tokenLimit }) => {
  setDocumentLoading(true);
  try{
    const userToken = localStorage.getItem('accessToken');
    const response = await axios.post(`${env.api}/openai/summarize`, {
    prompt: prompt,
    documentText:documentText,
    temperature: temperature,
    mode:mode,
    selectedmodel:selectedmodel,
    topP:topP,
    frequencyPenalty:frequencyPenalty,
    presencePenalty:presencePenalty,
    tokenLimit: tokenLimit,
  }, {
    headers: {
      Authorization: `Bearer ${userToken}`, // Replace with your token
    }
  });
  console.log("Response Data:", response);
      
      if (response.status === 200) {
        return response.data.summary.trim();
      } else {
        throw new Error(`Unexpected response: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error summarizing text:', error);
      return null;  // Return `null` or handle the error response as needed
    } finally {
      setDocumentLoading(false);
    }
};

export const commontextSummarizer = async ({ 
  prompt, documentText, maxLength, temperature, model, mode, setTextLoading, selectedmodel, topP, frequencyPenalty, presencePenalty ,tokenLimit
}) => {
  setTextLoading(true); 
try{
  const userToken = localStorage.getItem('accessToken');
  const response = await axios.post(`${env.api}/openai/summarize`, {
  prompt: prompt,
  documentText:documentText,
  temperature: temperature,
  mode:mode,
  selectedmodel:selectedmodel,
  topP:topP,
  frequencyPenalty:frequencyPenalty,
  presencePenalty:presencePenalty,
  tokenLimit: tokenLimit,
}, {
  headers: {
    Authorization: `Bearer ${userToken}`, // Replace with your token
  }
});

    
    if (response.status === 200) {
      return response.data.summary.trim();
    } else {
      throw new Error(`Unexpected response: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error summarizing text:', error);
    return null;  // Return `null` or handle the error response as needed
  } finally {
    setTextLoading(false);
  }
}