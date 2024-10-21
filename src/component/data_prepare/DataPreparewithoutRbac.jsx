import React, { useState, useEffect } from 'react';
import './dataprepare.css';
import { Button, Snackbar, Container, TextField, InputAdornment } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import uploadFileToBlob, { isStorageConfigured, getBlobsInContainer, deleteBlobFromContainer } from './azure-blob-stoage';
import { useTranslation } from 'react-i18next';
import DocTable from './DocTable';
import ConfirmationDialog from './ConfirmationDialog';
import axios from 'axios';
import { api } from '../../config';
import Header from '../header/Header';
import { Delete } from '@mui/icons-material';
import ToggleComponent from '../common/ToggleComponent';

const storageConfigured = isStorageConfigured();

const Container1 = styled('div')(({ theme }) => ({
  marginTop: '15px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '15px',
}));

const BtnContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  // justifyContent: 'center',
  margin: '10px 0',
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
  marginRight:"10px",
  // marginLeft: '30vh',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  [theme.breakpoints.down('md')]: {
    width: '50%',
    // marginLeft: '5px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
    // marginLeft: '5px',
    marginBottom: "5px",
  },
}));

const DContainer = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    marginTop: "50px",
  },
}));

const DataPrepare = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [blobList, setBlobList] = useState([]);
  const [docList, setDocList] = useState();
  const [fileSelected, setFileSelected] = useState([]);
  const [fileUploaded, setFileUploaded] = useState('');
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fileError, setFileError] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedDocuments([]);
    setOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getBlobsInContainer()
      .then((list) => {
        setBlobList(list);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error retrieving document list:', error);
      });
  }, [fileUploaded]);

  useEffect(() => {
    const filteredDocs = blobList.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredDocs);
  }, [blobList, searchQuery]);

  const runIndexer = () => {
    axios.post(
      `https://glamsearchservice.search.windows.net/indexers/vector-1700513300497-indexer/run?api-version=2023-07-01-Preview`,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_AZURE_SEARCH_KEY,
        },
      }
    )
      .then(response => {
        console.log('Indexer is running...');
      })
      .catch(error => {
        console.error('Error running indexer:', error);
      });
  };

  const onFileChange = (event) => {
    const files = event.target.files;
    setFileError('');
    setFileSelected(Array.from(files));
  };

  const onFileUpload = async () => {
    if (fileSelected && fileSelected.length > 0) {
      setUploading(true);
      for (const file of fileSelected) {
        await uploadFileToBlob(file);
      }
      setFileSelected([]);
      setFileUploaded(fileSelected[fileSelected.length - 1]);
      setUploading(false);
      setInputKey(Math.random().toString(36));
      setOpenSnackbar(true);
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
    const updatedDocList = blobList.filter((item) => item.name !== documentName);
    setBlobList(updatedDocList);
    await deleteBlobFromContainer(documentName);
    setSelectedDocuments((prevSelected) =>
      prevSelected.filter((item) => item !== documentName)
    );
    await handleDeleteindex();
  };

  const handleDeleteindex = async () => {
    const documentUrl = selectedDocuments;
    const urlObj = new URL(documentUrl);
    const cleanDocumentUrl = `${urlObj.pathname}`;
    const filename = cleanDocumentUrl.replace("/glamfilecontainer/", "");
    await encodeAndSendToBackend(filename);
  };

  const encodeAndSendToBackend = async (url) => {
    try {
      const truncatedUrl = url;
      const response = await fetch(`${api}/deleteFromSearchIndex`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ DocumentName: truncatedUrl }),
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

  const handleDeleteAll = async () => {
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
    handleRefresh();
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

      <BtnContainer>
      
        <div>
          <TextField
            variant="outlined"
            size="small"
            type="file"
            id="browseField"
            multiple
            onChange={onFileChange}
            key={inputKey || ''}
            inputProps={{
              multiple: true,
              accept: '.doc, .docx, .pdf, .csv, .txt, .xls, .xlsx, .ppt, .pptx'
            }}
            style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'}}
          />
          {fileError && <div style={{ color: 'red', marginTop: '5px' }}>{fileError}</div>}

        </div>
        {/* </StyledButton> */}

        <StyledButton
          variant="contained"
          color="primary"
          onClick={onFileUpload}
          disabled={!fileSelected.length}
          startIcon={<CloudUploadIcon/>}
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
            // onClick={handleDeleteAll}
            variant="contained"
            startIcon={<Delete style={{ fontSize: '0.9rem' }} />}
            // className={classes.button}
            style={{
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              borderRadius:"8px"
              // color: "black",
            }}
          >
            {t('delete')}
          </Button>
      </BtnContainer>
      {uploading && <p>{t('uploading_message')}</p>}
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
      {/* </Container> */}
    </DContainer>
  );
};

export default DataPrepare;