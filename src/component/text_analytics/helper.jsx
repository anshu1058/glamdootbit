
// helper compoent calling from the textAnalytics layout
export const handleSelectAllHelper = (selectAll, blobList, setSelectedDocuments, setSelectAll) => {
    if (!selectAll) {
      const allFileNames = blobList.map((item) => item.name);
      setSelectedDocuments(allFileNames);
    } else {
      setSelectedDocuments([]);
    }
    setSelectAll((prevSelectAll) => !prevSelectAll);
  };
  

  

  
  export const handleDeleteAllHelper = async (selectedDocuments, setSelectedDocuments, setSelectAll, deleteBlobFromContainer, blobList, setBlobList, setSuccessMessage, api, handleClose) => {
    handleClose();
    const selectedDocNames = selectedDocuments.slice();
    setSelectedDocuments([]);
    setSelectAll(false);
    for (const docName of selectedDocNames) {
      await deleteBlobFromContainer(docName);
    }
    const updatedDocList = blobList.filter((item) => !selectedDocNames.includes(item.id));
    setBlobList(updatedDocList);
    setSuccessMessage('Documents deleted successfully!');
    try {
      const response = await fetch(`${api}/api/run-indexer`, {
        method: 'POST',
      });
      if (response.ok) {
        console.log('Indexer run initiated successfully');
      } else {
        console.error('Failed to initiate indexer');
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
    // handleRefresh();
  };
  