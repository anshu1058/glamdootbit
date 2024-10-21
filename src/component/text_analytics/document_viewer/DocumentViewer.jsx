// document viewer for the summary and textinsight document.

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import './documentviewer.css'

const DocumentViewer = ({ documentUrl }) => {
  const location = useLocation();
  const isQndAPath = location.pathname.includes('/textanalysis/QndA');
  const extractExtensionFromURL = (url) => {
    const urlWithoutParams = url.split('?')[0];
    const filename = urlWithoutParams.split('/').pop();
    const extension = filename.split('.').pop();
    return extension;
  };


  const fileExtension = extractExtensionFromURL(documentUrl);
  const documentArray = [{ uri: documentUrl, fileType: fileExtension }];

  const containerStyle = {
    position: 'relative',
    width: isQndAPath ? '100%' : '100%', // Change the width as needed
    margin: '',
    height: isQndAPath ? '64vh' : '55vh', // Change the height as needed
    overflowY:"scroll",
    marginTop:"12px"
  };

  const docViewerStyle = {
    height: isQndAPath ? '62vh' : '100%',
    // position: "absolute"
  };

  useEffect(() => {
    // Set the zoom level to fit the entire page when the component mounts
    const viewerIframe = document.getElementById('msdoc-iframe');
    if (viewerIframe) {
      viewerIframe.addEventListener('load', () => {
        const iframeDocument = viewerIframe.contentDocument || viewerIframe.contentWindow.document;
        iframeDocument.body.style.zoom = '50%'; // Adjust zoom level to fit the page
      });
    }
  }, [documentUrl, fileExtension]);



  return (
    <>
      {fileExtension !== "pdf" ?
        <div key={documentUrl} className="previewDoc" style={containerStyle}>
          <DocViewer
            id="react-doc-viewer"
            key={documentUrl}
            documents={documentArray}
            pluginRenderers={DocViewerRenderers}
            prefetchMethod="GET"
            theme={{
              primary: '#5296d8',
              secondary: '#ffffff',
              tertiary: '#5296d899',
              textPrimary: '#ffffff',
              textSecondary: '#5296d8',
              textTertiary: '#00000099',
              disableThemeScrollbar: true,
            }}
            style={docViewerStyle}
          />
        </div>
        : (<iframe
          src={`${documentUrl}#toolbar=0`}
          // title="Document Preview"
          // id="iframedocpreview"
          frameBorder="0"
          // #toolbar="0"
           border="0"
           
          style={{ width: "100%", height: "100%",border:"none" }}
        ></iframe>)
      }
    </>
  );
};

export default DocumentViewer;
