import React, { useState, useEffect } from 'react';
import { Button, Snackbar, Container, TextField, InputAdornment } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import { useFetchContainersAndBlobs, deleteBlobFromContainer, fetchContainersAndBlobs } from './azure-blob-stoage';
import { useTranslation } from 'react-i18next';
import DocTable from './DocTable';
import ConfirmationDialog from './ConfirmationDialog';
import env from '../../../config';
import Header from '../header/Header';
import { Delete } from '@mui/icons-material';
import './dataprepare.css';
import runIndexer from './datapreparehelper';

const Container1 = styled('div')(({ theme }) => ({
  marginTop: '15px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '15px',
}));

const BtnContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  marginTop: '1em',
  padding: '0 1em',
  [theme.breakpoints.down('xs')]: {
    display: 'flex-wrap',
    flexWrap: "wrap",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: '0 10px',
  borderRadius: "10px",
  fontSize: "12px",
  paddingLeft: "15px",
  paddingRight: "15px",
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  [theme.breakpoints.down('md')]: {
    fontSize: "0",
    width: '20%',
    paddingRight: '7px',
    borderRadius: "10px",
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: "0",
    width: '20%',
    paddingRight: '7px',
    borderRadius: "10px",
    marginTop: "8px",
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  width: '35%',
  marginRight: "10px",
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  [theme.breakpoints.down('md')]: {
    width: '50%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
    marginBottom: "5px",
  },
}));

const DContainer = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    marginTop: "50px",
  },
}));

const DataPrepare = () => {
  const { containersWithBlobs, loading, error, uploadFileToBlob } = useFetchContainersAndBlobs();
  // const accessibleContainers = containersWithBlobs.map(container => container.container);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [blobList, setBlobList] = useState([]);
  const [fileSelected, setFileSelected] = useState([]);
  const [fileUploaded, setFileUploaded] = useState('');
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fileError, setFileError] = useState('');

  // Filter containers with blobs
  const accessibleContainers = containersWithBlobs
    .filter(container => container.blobs.length > 0)
    .map(container => container.container);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedDocuments([]);
    setOpen(false);
  };

  useEffect(() => {
    const filteredDocs = containersWithBlobs.flatMap(container =>
      container.blobs.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const list = containersWithBlobs.flatMap(container => container.blobs)
    setBlobList(list);
    setSearchResults(filteredDocs);
  }, [containersWithBlobs, searchQuery]);

  const onFileChange = (event) => {
    const files = event.target.files;
    setFileError('');
    setFileSelected(Array.from(files));
  };

  const onFileUpload = async () => {
    if (fileSelected && fileSelected.length > 0) {
      setUploading(true);

      for (const file of fileSelected) {
        for (const containerName of accessibleContainers) {
          await uploadFileToBlob(file, containerName);
        }
      }

      setFileSelected([]);
      setFileUploaded(fileSelected[fileSelected.length - 1]);
      setUploading(false);
      setInputKey(Math.random().toString(36));
      setOpenSnackbar(true);

      // Update blobList state after upload
      const updatedBlobList = await fetchContainersAndBlobs();
      const updatedFile = updatedBlobList.flatMap(container => container.blobs); // Implement this function to get updated list
      setBlobList(updatedFile);

      // Run indexers for filtered containers
      for (const containerName of accessibleContainers) {
        let indexerName;
        if (containerName === "finance") {
          indexerName = "glamfinanceindexexhvector";
        } else if (containerName === "humanresource") {
          indexerName = "glamhumanresourceindexexhvector";
        } else if (containerName === "glamfilecontainer") {
          indexerName = "newglamindexexhvector";
        }
        await runIndexer(indexerName);
      }
    } else {
      console.error("No files selected.");
    }
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      const allFileNames = blobList.map((item) => item.name);
      setSelectedDocuments(allFileNames);
    } else {
      setSelectedDocuments([]);
    }
    setSelectAll((prevSelectAll) => !prevSelectAll);
  };

  const handleDocumentChange = (fileName) => {
    setSelectedDocuments(fileName);
  };
  const handleDelete = async (documentName) => {
    const document = blobList.find(doc => doc.name === documentName);
    if (!document) {
      console.error("Document not found in search results:", documentName);
      return;
    }

    const documentUrl = document.url;
    try {
      await deleteBlobFromContainer(documentUrl);

      const updatedDocList = blobList.filter((item) => item.name !== documentName);
      setBlobList(updatedDocList);

      setSelectedDocuments((prevSelected) =>
        prevSelected.filter((item) => item !== documentName)
      );
      for (const containerName of accessibleContainers) {
        await handleDeleteindex(documentUrl, containerName);
      }


    } catch (error) {
      console.error("Error deleting document:", documentName, error);
    }
  };

// deleting index with while deleting the blob or file from blob

  const handleDeleteindex = async (documentUrl, containerName) => {
    try {
      const urlObj = new URL(documentUrl);
      const cleanDocumentUrl = `${urlObj.pathname}`;
      const filename = cleanDocumentUrl.replace(`/${containerName}/`, "");
      await encodeAndSendToBackend(filename);
    } catch (error) {
      console.error("Error deleting document from index:", documentUrl, error);
    }
  };

  // fetch the urkl from the encoded value
  const encodeAndSendToBackend = async (url) => {
    try {
      const response = await fetch(`${env.api}/deleteFromSearchIndex`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ DocumentName: url }),
      });
      if (response.ok) {
        console.log('Encoded URL sent to backend successfully');
      } else {
        console.error('Failed to send encoded URL to backend');
      }
    } catch (error) {
      console.error('Error sending encoded URL to backend:', error);
    }
  };

  //  Delete all selected file
  const handleDeleteAll = async () => {
    handleClose();
    const selectedDocNames = selectedDocuments.slice();
    setSelectedDocuments([]);
    setSelectAll(false);
    for (const docName of selectedDocNames) {
      try {
        await deleteBlobFromContainer(docName);
      } catch (error) {
        console.error("Error deleting document:", docName, error);
      }
    }
    const updatedDocList = blobList.filter((item) => !selectedDocNames.includes(item.id));
    setBlobList(updatedDocList);
    setSuccessMessage('Documents deleted successfully!');
    // Run indexers for filtered containers
    for (const containerName of accessibleContainers) {
      let indexerName;
      if (containerName === "finance") {
        indexerName = "glamfinanceindexexhvector";
      } else if (containerName === "humanresource") {
        indexerName = "glamhumanresourceindexexhvector";
      } else if (containerName === "glamfilecontainer") {
        indexerName = "newglamindexexhvector";
      }
      await runIndexer(indexerName);
    }
    // handleRefresh();
  };

  const handleRefresh = async () => {
    window.location.reload();
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filteredDocs = blobList.filter((doc) =>
      doc.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredDocs);
  };

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <DContainer>
      <Header />

      <div style={{ padding: '0 1em', marginTop: '4em' }}>
        <TextField
          variant="outlined"
          size="small"
          type="file"
          fullWidth
          id="browseField"
          multiple
          onChange={onFileChange}
          key={inputKey || ''}
          inputProps={{
            multiple: true,
            accept: '.doc, .docx, .pdf, .csv, .txt, .xls, .xlsx, .ppt, .pptx'
          }}
          style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}
        />
        {fileError && <div style={{ color: 'red', }}>{fileError}</div>}

      </div>
      <BtnContainer>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={onFileUpload}
          disabled={!fileSelected.length}
          startIcon={<CloudUploadIcon />}
        >
          {uploading ? "Uploading..." : t('upload')}
        </StyledButton>

        <SearchField
          label={t('search')}
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          color="secondary"
          size="small"
          id="deleteBtn"
          disabled={selectedDocuments.length <= 0}
          onClick={handleClickOpen}
          variant="contained"
          startIcon={<Delete style={{ fontSize: '0.9rem' }} />}
          style={{
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            borderRadius: "8px"
          }}
        >
          {t('delete')}
        </Button>
      </BtnContainer>
      {/* {uploading && <p>{t('uploading_message')}</p>} */}
      <Container1>
        <DocTable
          docList={searchQuery ? searchResults : blobList}
          selectedDocuments={selectedDocuments}
          handleDocumentChange={handleDocumentChange}
          handleSelectAll={handleSelectAll}
          handleDelete={handleDelete}
        />
      </Container1>
      <ConfirmationDialog
        open={open}
        onClose={handleClose}
        handleAgree={handleDeleteAll}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={t('success_message')}
      />
    </DContainer>
  );
};

export default DataPrepare;
