// Citation component called from the QNA component.

import React, { useState } from 'react';
import DocumentViewer from '../document_viewer/DocumentViewer';
import { Typography } from '@mui/material';

const Citations = ({ citations, response }) => {
    // show the document and the chunk data of the answer
    const [activeTab, setActiveTab] = useState('preview'); // State to manage active tab

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const tabStyle = {
        padding: '5px 16px',
        // marginRight: '10px',
        border: '1px solid #ccc',
        cursor: 'pointer',
    };

    const activeTabStyle = {
        backgroundColor: '#167bf5',
        color: 'white',
    };

    const roundedLeftStyle = {
        ...tabStyle,
        borderTopLeftRadius: '4px',
        borderBottomLeftRadius: '4px',
    };

    const roundedRightStyle = {
        ...tabStyle,
        borderTopRightRadius: '4px',
        borderBottomRightRadius: '4px',
    };
    const extractAndDecode = (text) => {
        const startPattern = 'aHR';
        const endPattern = /\d$/; // Regex to match the last numeric digit at the end
        const startIndex = text.indexOf(startPattern);
        const endIndexMatch = text.match(endPattern);
        if (startIndex !== -1 && endIndexMatch) {
            const endIndex = endIndexMatch.index + endIndexMatch[0].length;
            const encodedContent = text.substring(startIndex, endIndex);
            const trimmedEncodedContent = encodedContent.replace(/\d$/, '');
            const decodedContent = trimmedEncodedContent ? atob(trimmedEncodedContent) : null;
            return decodedContent;
        }

        return null;
    };

    const extractExtensionFromURL = (url) => {
        const urlWithoutParams = url.split('?')[0]; // Extract URL part before the query parameters
        const filename = urlWithoutParams.split('/').pop(); // Extract the filename from the URL
        const extension = filename.split('.').pop(); // Get the extension from the filename
        return extension;
    };

    const renderDocumentPreview = (url,extension) => {
        if (extension === 'pdf') {
            return (
                <iframe
                    title={`Document Preview`}
                    src={`${url}#toolbar=0`}
                    style={{ width: '100%', height: '100%' }}
                />
            );
        } else {
            return (
                <DocumentViewer documentUrl={url}  />
            );
        }
    };


    const extractReferences = (content) => {
        const referenceRegex = /https?:\/\/\S+/g;
        const references = content.match(referenceRegex) || [];

        // Adding decoding of encoded data
        // const decodedData = extractAndDecode(content);

        return references.map((reference, refIndex) => ({
            id: refIndex + 1,
            url: reference,
        }));
    };

    const parseCitationResponse = (citationResponse) => {
        const citations = citationResponse.citations || [];
        // console.log("citation",citations)
        return citations.map((citation, index) => {
            const references = extractReferences(citation.content);
            const decodedData = extractAndDecode(citation.content);
            return {
                index: index + 1,
                content: citation.content,
                references: references,
                decodedurl: decodedData,
            };
        });
    };

    const containsResponse = (text, response) => {
        const sentencesInText = text.split(/[\.\?!]\s+/).map(sentence => sentence.trim());
        const sentencesInResponse = response.split(/[\.\?!]\s+/).map(sentence => sentence.trim());
        for (const sentenceInText of sentencesInText) {
            for (const sentenceInResponse of sentencesInResponse) {
                if (sentenceInText.includes(sentenceInResponse)) {
                    console.log("Matching sentence found:", sentenceInText);
                    return true;
                }
            }
        }

        console.log("No matching sentence found.");

        return false;
    };


    const renderStyledContent = (content, response) => {
        const withoutTags = content.replace(/<\/?[a-z0-9]+>/gi, '');
        const elements = withoutTags.split('\n');
    
        return elements.map((text, i) => {
            if (text.trim() === '') {
                return null;
            }
    
            if (text.startsWith('h2')) {
                return <span key={i} style={{ fontWeight: 'bold', display: 'block', margin: '10px 0' }}>{text.slice(3)}</span>;
            }
    
            const escapedResponse = response.replace(/\[doc\d+\]/g, '');
    
            // Remove the unwanted part of the content that matches the pattern starting with "aHR0"
            const cleanedText = text.replace(/aHR0\S*?$/, '');
    
            const highlightedText = cleanedText.split(escapedResponse).map((part, index) => (
                <React.Fragment key={index}>
                    {containsResponse(part, escapedResponse) ? (
                        <span key={index} style={{ background: "yellow" }}>{part}</span>
                    ) : (
                        <span key={index}>{part}</span>
                    )}
                </React.Fragment>
            ));
    
            return <span key={i} style={{ fontSize: '1rem', display: 'block', margin: '5px 0' }}>{highlightedText}</span>;
        }).filter(Boolean);
    };
    

    const parsedCitations = parseCitationResponse({ citations });

    return (
        <div>
            <div>
                <button
                    style={activeTab === 'preview' ? { ...activeTabStyle, ...roundedLeftStyle } : roundedLeftStyle  }
                    onClick={() => handleTabChange('preview')}
                >
                    Document Preview
                </button>
                <button
                    style={activeTab === 'chunk' ? { ...activeTabStyle, ...roundedRightStyle } : roundedRightStyle}
                    onClick={() => handleTabChange('chunk')}
                >
                    Chunk Content
                </button>

            </div>

            {parsedCitations.map((parsedCitation) => (
                <div key={parsedCitation.index} style={{ marginTop: '4px' }}>
                    {activeTab === 'preview' && (
                        <div>
                            <div style={{ padding: '1px', border: '1px solid #ccc', borderRadius: '5px',height:"57vh" }}>
                                    {renderDocumentPreview(parsedCitation.decodedurl, extractExtensionFromURL(parsedCitation.decodedurl))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'chunk' && (
                       
                            <div style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px',height:"57vh",overflowY:"auto",background:"#001b4b",color:"white"}}>
                               <Typography component='p' varient='body2'>{renderStyledContent(parsedCitation.content, response)}</Typography> 
                            </div>
                       
                    )}
                </div>
            ))}
        </div>
    );
};

export default Citations;