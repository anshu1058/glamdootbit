
// component to show the translator documnet using the library '@cyntler/react-doc-viewer' and called by document translator.
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import '../document_viewer/documentviewer.css';
import TestDoc from './testtranslation';

const DocViewfortranslaton = ({ documentUrl, docheight ,overflowdoc}) => {
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

  const getContainerStyle = () => {
    const isMobile = window.innerWidth <= 1300; // Example mobile width breakpoint
    const height = isQndAPath ? (isMobile ? '50vh' : '60vh') : (isMobile ? '36vh' : '50vh');
    return {
      position: 'relative',
      width: '100%',
      marginTop: '10px',
      height: height,
      overflowY: overflowdoc || 'scroll',
      boxSizing: 'border-box',
    };
  };

  const [containerStyle, setContainerStyle] = useState(getContainerStyle());

  useEffect(() => {
    const handleResize = () => {
      setContainerStyle(getContainerStyle());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isQndAPath]);

  const docViewerStyle = {
    height: isQndAPath ? '62vh' : '100%',
  };

  const [destroyTask, setDestroyTask] = useState(null);

  useEffect(() => {
    return () => {
      if (destroyTask) {
        destroyTask.destroy().catch((error) => {
          console.error('Failed to destroy PDF worker:', error);
        });
      }
    };
  }, [destroyTask]);

  const handleDocumentLoadSuccess = (task) => {
    if (destroyTask) {
      destroyTask.destroy().catch((error) => {
        console.error('Failed to destroy previous PDF worker:', error);
      });
    }
    setDestroyTask(task);
  };
  return (
    <>
    <div style={containerStyle}>
    {fileExtension !== "pdf" ?
      <DocViewer
        id="react-doc-viewer"
        documents={documentArray}
        pluginRenderers={DocViewerRenderers}
        prefetchMethod="GET"
        config={{
          pdfVerticalScrollByDefault: true,
          pdfZoom: {
            defaultZoom: 1.1,
            zoomJump: 0.2,
          },
        }}
        style={docViewerStyle}
        onDocumentLoadSuccess={handleDocumentLoadSuccess}
      />
     : (<TestDoc documentUrl={documentUrl} docheight={docheight}/>)
  }
    </div>
  </>
  );
};

export default DocViewfortranslaton;
