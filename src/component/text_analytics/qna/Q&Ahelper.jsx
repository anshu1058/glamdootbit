// QnA helper its functin used by the QNA component for generating the response of the asked question.

// import env from "../../../../config";
// import axios from 'axios';
// import { addTrackingData } from '../../Redux/Store/Store';
// import {marked} from 'marked';

// const serviceName =env.qndaSearchSvcName;
// const chatGptKey = env.qnaAzureOpenaiChatgptKey;
// const openAiUserAgent =env.qnaAzureOpenaiUserAgent;
// const searchKey = env.azureSearchKey;
// const searchServiceName = env.azureSearchSvcName;
// const apiUrl = `https://openai-dpxjzr3ghqbg4.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview`;
 
 
// export const initializeSearch = async () => {
//     try {
//       // const response = await fetch('http://localhost:5000/initializeSearch', {
//       const response = await fetch(`${env.api}/initializeSearch`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // You can pass any required data in the body
//         body: JSON.stringify({
//           // serviceName: "glamsearchservice",
//           // indexName: "galmfinanceindexvector1",
//           // sourceType: "azureblob",
//           // dataSourceName: "glamfinancedatasource",
//           // containerName: "finance",
//           // indexerName: "glamfinanceindexexhvector",
//           // targetIndexName: "galmfinanceindexvector1",
//           // skillsetName: "newglamfinanceskillvector",
//           serviceName: "glamsearchservice",
//           indexName: "glamhumanresourceindexvector",
//           sourceType: "azureblob",
//           dataSourceName: "glamhumanreourcedatasource",
//           containerName: "humanresource",
//           indexerName: "glamhumanresourceindexexhvector",
//           targetIndexName: "glamhumanresourceindexvector",
//           skillsetName: "glamhumanresourceskillvector",
//         }),
//       });
 
//       if (response.ok) {
//         const result = await response.json();
//         // console.log('Initialization successful:', result);
//       } else {
//         const errorResult = await response.json();
//         console.error("Initialization failed:", errorResult.error);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };
 
 
//   const sendUserInputToBackend = async (input) => {
//     try {
//       const response = await axios.get(`${env.api}/api/feedback`, {
//         params: {
//           question: input
//         }
//       });
//       return response; // Return the data received from the backend
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         console.log('No data found in the database, proceeding to API call...');
//         return null; // Indicate that no data was found
//       } else {
//         console.error('Error sending user input to backend:', error);
//         throw new Error('Failed to send user input to backend');
//       }
//     }
//   };
 
//   const stripMarkdown = (markdownContent) => {
//     // Replace basic Markdown symbols and handle newlines
//     return markdownContent
//       .replace(/[*_~`#>!\[\]\(\)]/g, '') // Removes basic Markdown symbols
//       .replace(/\n+/g, ' '); // Replaces multiple newlines with a space
//   };
 
//   export const fetchBotResponse = async (input, dispatch, indexName, abortController) => {
//     try {
//       let botContent, botCitation;
  
//       // Database Query
//       const dbResponse = await sendUserInputToBackend(input);
//       if (dbResponse && dbResponse.data.length > 0) {
//         // Extract content from the database response
//         botContent = dbResponse.data[0].content;
//         botCitation = dbResponse.data[0].citation;
//       }
  
//       // Use the provided AbortController if it's passed in, otherwise create a new one
//       const signal = abortController ? abortController.signal : (new AbortController()).signal;
  
//       // If no response from the database or no valid content, proceed with API call
//       if (!botContent) {
//         const headers = {
//           "Content-Type": "application/json",
//           "api-key": '27368afa08a94bdd95781bedae4c060a',
//           chatgpt_url: `https://openai-dpxjzr3ghqbg4.openai.azure.com/openai/deployments/gpt-4o`,
//           chatgpt_key: '27368afa08a94bdd95781bedae4c060a',
//           "x-ms-useragent": openAiUserAgent,
//         };
  
//         const response = await axios.post(
//           apiUrl,
//           {
//             messages: [
//               { role: "user", content: "where do the boy live?" },
//               { role: "assistant", content: "The boy lived at the river bank." },
//               { role: "user", content: input },
//             ],
//             temperature: 0.7,
//             max_tokens: 600,
//             top_p: 0.5,
//             data_sources: [
//               {
//                 type: "AzureCognitiveSearch",
//                 parameters: {
//                   endpoint: `https://glamsearchservice.search.windows.net`,
//                   key: "",
//                   indexName: indexName,
//                   fieldsMapping: {
//                     contentField: "content",
//                     titleField: "title",
//                     urlField: "url",
//                     filepathField: "filepath",
//                   },
//                   inScope: "false",
//                   topNDocuments: "1",
//                   queryType: "semantic",
//                   roleInformation: "You are an AI assistant programmed to answer user queries based solely on the provided context or data chunks. <<<INSTRUCTIONS>>> Provide answers sourced directly from the given information. If unable to deduce an answer, reply with 'Sorry, I don't know.' Do not create new answers. Do not mention the source of information when answering. <<<END OF INSTRUCTIONS>>>",
//                   semanticConfiguration: "my-semantic-config",
//                 },
//               },
//             ],
//           },
//           { headers, signal }
//         );
  
//         // Extract content from the API response
//         botContent = response.data.choices[0].message.content.replace(/\[doc\d+\]/g, "");
//         botCitation = response.data.choices[0].message.context.citations;
//       }
  
//       // Example event data for tracking successful response
//       const eventData = { event: 'ApiResponse', status: 'Success', source: botContent ? 'Database' : 'API' };
//       dispatch(addTrackingData(eventData));
  
//       const htmlText = marked(botContent);
//       return [htmlText, botCitation];
  
//     } catch (error) {
//       if (abortController && abortController.signal.aborted) {
//         console.log("Fetch aborted");
//       } else {
//         const eventData = { event: 'ApiResponse', status: 'Failure', errorMessage: error.message };
//         dispatch(addTrackingData(eventData));
//         throw new Error("Failed to fetch bot response");
//       }
//     }
//   };
import env from "../../../../config";
import axios from 'axios';
import { addTrackingData } from '../../Redux/Store/Store';
import { marked } from 'marked';



export const initializeSearch = async () => {
  try {
    const response = await fetch(`${env.api}/initializeSearch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceName: "glamsearchservice",
        indexName: "glamhumanresourceindexvector",
        sourceType: "azureblob",
        dataSourceName: "glamhumanreourcedatasource",
        containerName: "humanresource",
        indexerName: "glamhumanresourceindexexhvector",
        targetIndexName: "glamhumanresourceindexvector",
        skillsetName: "glamhumanresourceskillvector",
      }),
    });

    if (response.ok) {
      const result = await response.json();
    } else {
      const errorResult = await response.json();
      console.error("Initialization failed:", errorResult.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const sendUserInputToBackend = async (input) => {
  try {
    const response = await axios.get(`${env.api}/api/feedback`, {
      params: {
        question: input,
      },
    });
    return response; // Return the data received from the backend
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('No data found in the database, proceeding to API call...');
      return null; // Indicate that no data was found
    } else {
      console.error('Error sending user input to backend:', error);
      throw new Error('Failed to send user input to backend');
    }
  }
};

const stripMarkdown = (markdownContent) => {
  return markdownContent
    .replace(/[*_~`#>!\[\]\(\)]/g, '') // Removes basic Markdown symbols
    .replace(/\n+/g, ' '); // Replaces multiple newlines with a space
};

// Declare currentAbortController in a scope accessible to both functions
let currentAbortController = null;



export const fetchBotResponse = async (input, dispatch, indexName) => {
  try {
    const userToken = localStorage.getItem('accessToken');
    // Create a new AbortController for each request
    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;

    let botContent, botCitation;

    // Database Query
    const dbResponse = await sendUserInputToBackend(input);
    if (dbResponse && dbResponse.data.length > 0) {
      botContent = dbResponse.data[0].content;
      botCitation = dbResponse.data[0].citation;
    }

    if (!botContent) {
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };

      const response = await axios.post(
        `${env.api}/qna/fetch-bot-response`,
        {
           "input":input,
           "indexName":indexName
        },
        { headers, signal }
      );
      botContent = response.data.choices[0].message.content.replace(/\[doc\d+\]/g, "");
      botCitation = response.data.choices[0].message.context.citations;
    }

    const eventData = { event: 'ApiResponse', status: 'Success', source: botContent ? 'Database' : 'API' };
    dispatch(addTrackingData(eventData));

    const htmlText = marked(botContent);
    return [htmlText, botCitation];

  } catch (error) {
    if (currentAbortController && currentAbortController.signal.aborted) {
      console.log("Fetch aborted");
    } else {
      const eventData = { event: 'ApiResponse', status: 'Failure', errorMessage: error.message };
      dispatch(addTrackingData(eventData));
      throw new Error("Failed to fetch bot response");
    }
  }
};

// New function to cancel the ongoing request
export const cancelBotResponseRequest = () => {
  if (currentAbortController instanceof AbortController) {
    currentAbortController.abort();
    console.log("API call aborted.");
  } else {
    console.error("currentAbortController is not an instance of AbortController.");
  }
};

