// its a funtion for extracting data from the document exapt pdf for the summarization, insight and moderation.

import PizZip from 'pizzip';
import { DOMParser } from '@xmldom/xmldom';

function str2xml(str) {
  if (str.charCodeAt(0) === 65279) {
    str = str.substr(1);
  }
  return new DOMParser().parseFromString(str, 'text/xml');
}

// Function to extract paragraphs from the document content
export async function extractDocxParagraphs(docxUrl) {
  try {
    const response = await fetch(docxUrl);
    const content = await response.arrayBuffer();

    const zip = new PizZip(content);
    const documentXml = zip.file('word/document.xml');

    if (!documentXml) {
      throw new Error('Document XML not found in the provided .docx file.');
    }

    const xml = str2xml(documentXml.asText());
    const paragraphsXml = xml.getElementsByTagName('w:p');
    const paragraphs = [];

    for (let i = 0, len = paragraphsXml.length; i < len; i++) {
      let fullText = '';
      const textsXml = paragraphsXml[i].getElementsByTagName('w:t');
      for (let j = 0, len2 = textsXml.length; j < len2; j++) {
        const textXml = textsXml[j];
        if (textXml.childNodes && textXml.childNodes.length > 0) {
          const nodeValue = textXml.childNodes[0].nodeValue;
          fullText += nodeValue !== null ? nodeValue : '';
        }
      }
      if (fullText) {
        paragraphs.push(fullText);
      }
    }

    return paragraphs;
  } catch (error) {
    console.error('Error fetching or processing document:', error);
    return []; // Return an empty array if there's an error
  }
}
