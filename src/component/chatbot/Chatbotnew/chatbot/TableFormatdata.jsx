import React from 'react';
import { Box, Typography, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { marked } from 'marked';

export const formatData = (text) => {
  // Check if the text has a table format
  const lines = text.trim().split('\n');
  const hasTableFormat = lines.length > 2 && lines[1].includes('|');

  if (hasTableFormat) {
    // Generate table from formatted data
    return (
      <Table data={lines} />
    );
  } else {
    // Convert to HTML using marked
    return (
      <div dangerouslySetInnerHTML={{ __html: marked(text, { breaks: true }) }} />
    );
  }
};

const Table = ({ data }) => {
  const headers = data[2].split('|').map(header => header.trim()).filter(Boolean);
  const rows = data.slice(3).map(line => line.split('|').map(item => item.trim()).filter(Boolean));

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} style={{ border: '1px solid black', padding: '8px' }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} style={{ border: '1px solid black', padding: '8px' }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const MessageDisplay = ({ msg }) => {
  return (
    <Box >
          <formatData text={msg}/>
    </Box>
  );
};


export default MessageDisplay
