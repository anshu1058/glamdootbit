// just a function for the text translator using the azure text translator services and called by the document tranlator component

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import env from '../../../../config';

const AzureTranslator = async ({ to, input }) => {
  const key = env.azureTranslatorApi;
  const endpoint = env.azureTranslatorEndpoint;
  const location = env.azureTranslatorLocation;

  const params = new URLSearchParams();
  params.append("api-version", "3.0");
  params.append("to", to);

  try {
    const response = await axios.post(
      `${endpoint}/translate`,
      [{
        'text': input
      }],
      {
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Ocp-Apim-Subscription-Region': location,
          'Content-type': 'application/json',
          'X-ClientTraceId': uuidv4().toString()
        },
        params: params,
        responseType: 'json'
      }
    );

    const translatedData = response.data;
    if (translatedData && translatedData[0] && translatedData[0].translations && translatedData[0].translations[0]) {
      return translatedData[0].translations[0].text;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle error state here
    return null; // Return null or handle the error as required
  }
};

export default AzureTranslator;
