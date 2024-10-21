import React from 'react';
import { Worker, Viewer,Spinner} from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const TestDoc = ({ documentUrl, docheight }) => {
  const pageLayout = {
    transformSize: ({ size }) => ({
        height: size.height + 30,
        width: size.width + 30,
        // marginTop:"12px"
    }),
    // margin:"50px"
};
  return (
    <div style={{ padding: '0px', borderRadius: '5px',docheight:{docheight},width:"100%"}}>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <Viewer fileUrl={documentUrl}
        // defaultScale={SpecialZoomLevel.PageFit}
          // initialPage={2}
        //   renderLoader={(percentages) => (
        //     <div style={{ width: '240px' }}>
        //         <Spinner progress={Math.round(percentages)} />
        //     </div>
        // )}
          pageLayout={pageLayout} 
        />
      </Worker>
    </div>
  );
};

export default TestDoc;
