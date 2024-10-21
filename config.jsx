// src/config.js
const env = {
    openaiApiKey: process.env.REACT_APP_OPENAI_API_KEY,
    api: process.env.REACT_APP_API,
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
  
    azureModeratorSvcName: process.env.REACT_APP_AZURE_MODERATOR_SVCNAME,
    azureModeratorEndpoint: process.env.REACT_APP_AZURE_MODERATOR_ENDPOINT,
    azureModeratorApi: process.env.REACT_APP_AZURE_MODERATOR_API,
    tokenLimit: process.env.REACT_APP_TOKEN_LIMIT,
  
    azureTranslatorEndpoint: process.env.REACT_APP_AZURE_TRANSLATOR_ENDPOINT,
    azureTranslatorApi: process.env.REACT_APP_AZURE_TRANSLATOR_API,
    azureTranslatorLocation: process.env.REACT_APP_AZURE_TRANSLATOR_LOCATION,
  
    chatBotDirectLineToken: process.env.REACT_APP_CHAT_BOT_DIRECT_LINE_TOKEN,
    chatbot:process.env.REACT_APP_TOKEN_CHATBOT,
    directLineToken: process.env.REACT_APP_DIRECT_LINE_TOKEN,
    bankBotToken: process.env.REACT_APP_BANK_BOT_TOKEN,
  
    qnaApiUrl: process.env.REACT_APP_QNA_API_URL,
    qnaAzureSvcName: process.env.REACT_APP_QNA_AZURE_SVCNAME,
    qnaAzureOpenaiChatgptKey: process.env.REACT_APP_QNA_AZURE_OPENAI_CHATGPT_KEY,
    qnaAzureOpenaiUserAgent: process.env.REACT_APP_QNA_AZURE_OPENAI_USER_AGENT,
  
    azureSearchEndpoint: process.env.REACT_APP_AZURE_SEARCH_ENDPOINT,
    azureSearchSvcName: process.env.REACT_APP_AZURE_SEARCH_SVCNAME,
    azureSearchKey: process.env.REACT_APP_AZURE_SEARCH_KEY,
    azureSearchIndexName: process.env.REACT_APP_AZURE_SEARCH_INDEX_NAME,
  
    storageAccountName: process.env.REACT_APP_STORAGE_ACCOUNT_NAME,
    translatorSvcName: process.env.REACT_APP_TRANSLATOR_SVCNAME,
    translatorEndpoint: process.env.REACT_APP_TRANSLATOR_ENDPOINT,
    translatorApiKey: process.env.REACT_APP_TRANSLATOR_API_KEY,
  
    qndaSearchServiceUrl: process.env.REACT_APP_QNDA_SEARCH_SERVICE_URL,
    qndaSearchSvcName: process.env.REACT_APP_QNDA_SEARCH_SVCNAME,
    qndaSearchServiceApiKey: process.env.REACT_APP_QNDA_SEARCH_SERVICE_API_KEY,
    qndaOpenaiApiKey: process.env.REACT_APP_QNDA_OPENAI_API_KEY,
  
    textAnalyticsOpenaiApiKey: process.env.REACT_APP_TEXT_ANALYTICS_OPENAI_API_KEY,
    textAnalyticsSvcName: process.env.REACT_APP_TEXT_ANALYTICS_SVCNAME,
  
    textInsightSvcName: process.env.REACT_APP_TEXT_INSIGHT_SVCNAME,
    textInsightSubscriptionKey: process.env.REACT_APP_TEXT_INSIGHT_SUBSCRIPTION_KEY,
    textInsightEndpoint: process.env.REACT_APP_TEXT_INSIGHT_ENDPOINT,
  
    translateAzureSearchSvcName: process.env.REACT_APP_TRANSLATE_AZURE_SEARCH_SVCNAME,
    translateAzureSearchApiKey: process.env.REACT_APP_TRANSLATE_AZURE_SEARCH_API_KEY,
    translateAzureSearchEndpoint: process.env.REACT_APP_TRANSLATE_AZURE_SEARCH_ENDPOINT,
  
    storageSasToken: process.env.REACT_APP_STORAGE_SAS_TOKEN,
    blobContainerName: process.env.REACT_APP_BLOB_CONTAINER_NAME,
  
    dpOpenaiApiKey: process.env.REACT_APP_DP_OPENAI_API_KEY,
    dpApiUrl: process.env.REACT_APP_DP_API_URL,
  
    blobStorageAccountName: process.env.REACT_APP_BLOB_STORAGE_ACCOUNT_NAME,
    blobStorageSasToken: process.env.REACT_APP_BLOB_STORAGE_SAS_TOKEN,
    blobAzureContainerName: process.env.REACT_APP_BLOB_AZURE_CONTAINER_NAME,
  
    clientId: process.env.REACT_APP_CLIENT_ID,
    tenantId: process.env.REACT_APP_TENANT_ID,
    redirectUri: process.env.REACT_APP_REDIRECTURI,
  };
  
  export default env;
  