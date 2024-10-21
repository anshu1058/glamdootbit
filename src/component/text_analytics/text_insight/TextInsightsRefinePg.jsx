// component that is refining the text insight and showing them in a formated way and called by commin frame compoenent

import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AzureTextAnalyticsExample = () => {
  const {t}=useTranslation();
  const [text, setText] = useState('');
  const [entities, setEntities] = useState([]);

  const subscriptionKey = 'f05dc82fa67e423f9b7c315a8fa76c11';
  const endpoint = 'https://textanalyticsvach.cognitiveservices.azure.com/';

  const extractEntities = async () => {
    try {
      const apiUrl = `${endpoint}/text/analytics/v3.1/entities/recognition/general`;

      const headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      };

      const requestBody = {
        documents: [
          {
            id: '1',
            text: text,
          },
        ],
      };

      const response = await axios.post(apiUrl, requestBody, { headers });

      // Extract entities from the response
      if (response.data && response.data.documents && response.data.documents.length > 0) {
        setEntities(response.data.documents[0].entities);
      } else {
        setEntities([]);
      }
    } catch (error) {
      console.error('Error fetching entities:', error);
      // Handle error state
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleEntityExtraction = () => {
    if (text.trim() !== '') {
      extractEntities();
    }
  };

  return (
    <div>
      <h1>Azure Text Analytics - Entity Extraction</h1>
      <textarea rows="4" cols="50" value={text} onChange={handleTextChange}></textarea>
      <br />
      <button onClick={handleEntityExtraction}>Extract Entities</button>

      <h2>{t('entities')}:</h2>
      <ul>
        {entities.map((entity, index) => (
          <li key={index}>
            {entity.category} -  {entity.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AzureTextAnalyticsExample;
