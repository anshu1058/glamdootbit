import React, { useState, useEffect } from 'react'; // Importing React and hooks for managing state and side effects
import { Box, Button, Typography } from '@mui/material'; // Importing MUI components for layout and styling
import { BlobServiceClient } from '@azure/storage-blob'; // Importing Azure Blob Service Client for interacting with Azure Blob Storage
import { useTranslation } from 'react-i18next'; // Importing translation hook for internationalization

const LogServer = () => {
  const [logs, setLogs] = useState([]); // State to store logs
  const [showLogs, setShowLogs] = useState(false); // State to control visibility of logs
  const { t } = useTranslation(); // Translation hook for internationalization

  useEffect(() => {
    // Save original console methods
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    // Override console methods to capture logs
    console.log = (...args) => {
      const logEntry = { type: 'log', message: formatConsoleOutput(args), timestamp: new Date() };
      setLogs((prevLogs) => [...prevLogs, logEntry]); // Update logs state
      originalConsoleLog(...args); // Call original console method
    };

    console.warn = (...args) => {
      const warnEntry = { type: 'warn', message: formatConsoleOutput(args), timestamp: new Date() };
      setLogs((prevLogs) => [...prevLogs, warnEntry]); // Update logs state
      originalConsoleWarn(...args); // Call original console method
    };

    console.error = (...args) => {
      const errorEntry = { type: 'error', message: formatConsoleOutput(args), timestamp: new Date() };
      setLogs((prevLogs) => [...prevLogs, errorEntry]); // Update logs state
      originalConsoleError(...args); // Call original console method
    };

    // Cleanup function to restore original console methods
    return () => {
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
    };
  }, []);

  // Format console output for better readability
  const formatConsoleOutput = (args) => {
    return args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
  };

  const timestamp = new Date().toISOString().replace(/:/g, '-'); // Generate a timestamp for blob file names

  // Function to store logs in Azure Blob Storage
  const storeLogsInBlobContainer = async () => {
    const storageAccountName = process.env.REACT_APP_STORAGE_ACCOUNT_NAME; // Storage account name from environment variables
    const sasToken = process.env.REACT_APP_STORAGE_SAS_TOKEN; // SAS token from environment variables
    const containerName = process.env.REACT_APP_BLOB_CONTAINER_NAME; // Blob container name from environment variables

    // Convert log timestamps to ISO format
    const logsWithTimestamp = logs.map((log) => ({
      ...log,
      timestamp: log.timestamp.toISOString(),
    }));

    const logsJson = JSON.stringify(logsWithTimestamp); // Convert logs to JSON

    // URL to access Azure Blob Storage
    const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}?${sasToken}`;
    const blobServiceClient = new BlobServiceClient(uploadUrl);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Generate blob name with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const blobName = `logs-${timestamp}.json`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      await blockBlobClient.upload(logsJson, logsJson.length); // Upload logs to blob storage
      console.log('Logs stored in Blob container successfully.');
    } catch (error) {
      console.error('Failed to store logs in Blob container:', error);
    }
  };

  // Determine color based on log type
  const getColor = (type) => {
    if (type === 'error') {
      return 'red';
    } else if (type === 'warn') {
      return 'yellow';
    } else {
      return 'white';
    }
  };

  // Toggle visibility of logs
  const toggleLogsVisibility = () => {
    setShowLogs((prevShowLogs) => !prevShowLogs);
  };

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* Button to show/hide logs */}
        <Button
          color="primary"
          className='btn'
          onClick={toggleLogsVisibility}
          style={{ margin: "0.1em 5em", background: "white" }}
        >
          {showLogs ? t('hideLogs') : t('showLogs')}
        </Button>
        {showLogs ? (
          <Typography style={{ color: "black" }}>{t('savelogs')}</Typography>
        ) : ""}
      </Box>
      {showLogs && (
        <div className="console" style={{ backgroundColor: 'black', color: 'white', fontFamily: 'monospace', padding: '10px' }}>
          <span>{timestamp}</span>
          {logs.map((log, index) => (
            <div key={index} className={log.type} style={{ color: getColor(log.type) }}>
              <span>{log.message}</span>
            </div>
          ))}

          {/* Button to store logs in Blob Storage */}
          <Button variant="contained" color="primary" onClick={storeLogsInBlobContainer}>
            {t('storeLogs')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LogServer;
