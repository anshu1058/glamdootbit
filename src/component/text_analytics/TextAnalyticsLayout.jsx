
// Text alanytics layout calling all the comoponent summary,translate,QnA,Textinsight and also showing data prepare
import React, { useState, useEffect, useContext } from 'react';
import { Button, Box, Typography, Hidden } from '@mui/material';
import { styled } from '@mui/system';
import SummaryIcon from '@mui/icons-material/Summarize';
import Header from '../header/Header';
import SummaryAzureopenAi from './summary/Summary';
import ToggleComponent from '../common/ToggleComponent';
import TextInsightAzureOpenAi from './text_insight/TextInsight';
import { Delete } from '@mui/icons-material';
import { Snackbar, Container, TextField, InputAdornment } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import DocTable from '../data_prepare/DocTable';
import '../data_prepare/dataprepare.css';
import ConfirmationDialog from '../data_prepare/ConfirmationDialog';
import textinsight from "../../assets/img2.png";
import translate from "../../assets/img3.png";
import qna from "../../assets/img1.png";
import summary from '../../assets/summaryimg.png';
import { useFetchContainersAndBlobs, deleteBlobFromContainer, fetchContainersAndBlobs } from '../data_prepare/azure-blob-stoage';
import DocumentTranslation from './translate/DocumentTranslation';
import DeployedQndA from './qna/QnA';
import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Routess } from '../../routes';
import { handleSelectAllHelper, handleDeleteAllHelper } from './helper';
import env from '../../../config';
import runIndexer from '../data_prepare/datapreparehelper';
import { ThemeContext } from '../header/ThemeContext';
import ErrorModal from './ErrorModal';
import { useSelector, useDispatch } from "react-redux";

// import other components here

const darkMode = false; // Change this to enable or disable dark mode

// Custom button styling
// const CustomButton = styled(Button)(({ theme, selected }) => ({
//   color: selected ? 'blue' : '#666666',
//   fontSize: '12px',
//   fontWeight: '700',
//   padding: "3px 12px",
//   textTransform: "capitalize",
//   borderRadius: "8px",
//   boxShadow: '1px 1px 1px 1px #c7c7c757',
//   backgroundColor: darkMode ? '#84848491' : 'white', // Use dark background
//   border: selected ? 'none' : 'none',
//   width: "calc(5vw + 100px)",
//   '&:hover': {
//     backgroundColor: darkMode ? '#555555' : '#f5f5f5',
//   },
//   '& img': {
//     filter: selected ? 'invert(35%) sepia(65%) saturate(7462%) hue-rotate(201deg) brightness(92%) contrast(100%)' : 'none',
//   },
// }));

// Custom container styling
const CustomContainer = styled(Box)({
  backgroundColor: darkMode ? '#84848491' : '#ffffff',
  color: darkMode ? '#ffffff' : '#000000',
  boxShadow: '0 4px 8px rgba(199, 199, 199, 1)',
  padding: '0.3em 0.9em',
  borderRadius: '15px',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  boxSizing: 'border-box',
});

const Container1 = styled('div')(({ theme }) => ({
  marginTop: '10px',
  backgroundColor: darkMode ? '#444444' : 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '15px',
}));

const BtnContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  marginTop: '8px',
  marginBottom: "5px",
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
  height: "5vh",
  boxShadow: '0px 2px 4px #c7c7c7',
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
  height: "5vh",
  border: 'none',
  borderRadius: "8px",
  padding: "1px 14px",
  display: "flex",
  justifyContent: 'center',
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
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    '& .css-19qh8xo-MuiInputBase-input-MuiOutlinedInput-input': {
      // padding:'4px 8px',
      // border:"2px solid red"
    },
    '& .css-1pysi21-MuiFormLabel-root-MuiInputLabel-root': {
      position: 'absolute',
      left: '0px',
      top: '-5px'
    },
    '& .css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root': {
      paddingRight: '0px'
    }
  },
}));

const FileInputField = styled(TextField)(({ theme }) => ({
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  border: 'none',
  // padding: '0px 12px',
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "5vh",
  borderRadius: '8px',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
  },

  [theme.breakpoints.down('md')]: {
    '& .css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
      padding: '1px 12px',
      border: "2px solid red"
    },
    // border:"1px solid red",
  },
  [theme.breakpoints.down('sm')]: {
    '& .css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
      padding: '-1px 12px',
    },
    width: '100%',
    marginBottom: '5px',
  },
  '& .css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
    padding: '4px 14px',
    display: "flex",
    justifyContent: "center",
    alignItem: "center"
  }
}));
const DContainer = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    marginTop: "50px",
  },
}));
const TextAnalyticsLayout = () => {
  const [view, setView] = useState('dataprepare');
  const { containersWithBlobs, loading, error, uploadFileToBlob } = useFetchContainersAndBlobs();
  const accessibleContainers = containersWithBlobs.map(container => container.container);
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
  const [openModal, setOpenModal] = useState(false); // Modal visibility state
  const AccountInfo = useSelector((state) => state.accountInfo);
  const userEmail = AccountInfo?.account?.userName;
  const userName = userEmail?.split('@')[0];
  console.log("username", userName)
  const allowedFileTypes = ['.doc', '.docx', '.pdf', '.csv', '.txt', '.xls', '.xlsx', '.ppt', '.pptx'];


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
    const files = Array.from(event.target.files);
    const invalidFiles = files.filter(file => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      return !allowedFileTypes.includes(`.${fileExtension}`);
    });

    if (invalidFiles.length > 0) {
      const errorMessage = `Invalid file type: ${invalidFiles.map(f => f.name).join(', ')}. Only doc, docx, pdf, csv, txt, xls, xlsx, ppt, pptx files are allowed.`;
      setFileError(errorMessage);
      setFileSelected([]);  // Clear selected files
      setOpenModal(true);   // Show modal with error message
    } else {
      setFileError('');
      setFileSelected(files); // Valid files are selected
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const onFileUpload = async () => {
    if (fileSelected && fileSelected.length > 0) {
      setUploading(true);

      // Filter containers with blobs
      const accessibleContainers = containersWithBlobs
        .filter(container => container.blobs.length > 0)
        .map(container => container.container);

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

      await handleDeleteindex(documentUrl);
    } catch (error) {
      console.error("Error deleting document:", documentName, error);
    }
  };

  const handleDeleteindex = async (documentUrl) => {
    try {
      const urlObj = new URL(documentUrl);
      const cleanDocumentUrl = `${urlObj.pathname}`;
      const filename = cleanDocumentUrl.replace("/glamfilecontainer/", "");
      await encodeAndSendToBackend(filename);
    } catch (error) {
      console.error("Error deleting document from index:", documentUrl, error);
    }
  };

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
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredDocs = blobList.filter((doc) => {
      return (
        doc.type.toLowerCase().includes(query.toLowerCase()) ||
        doc.date.toLowerCase().includes(query) ||
        doc.time.toLowerCase().includes(query) ||
        doc.name.toLowerCase().includes(query.toLowerCase()) ||
        doc.size.toString().toLowerCase().includes(query)
      );
    });

    setSearchResults(filteredDocs);
  };


  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes('dataprepare')) {
      setView('dataprepare');
    } else if (location.pathname.includes('textanalysis')) {
      setView('textanalysis');
    }
  }, [location]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
      if (newView === 'dataprepare') {
        navigate(Routess.DataPrepare);
      } else {
        navigate(Routess.Summary); // Default navigation
      }
    }
  };

  const { theme } = useContext(ThemeContext);
  const backgroundColor = theme === "dark" ? "#333" : "#fff";
  const color = theme === "dark" ? "#fff" : "";
  const tabscolor = theme === "dark" ? "white" : "#666666";
  const img = theme === "dark" ? "invert(1)" : "none";

  const CustomButton = styled(Button)(({ theme, selected }) => ({
    color: selected ? 'blue' : tabscolor,
    fontSize: '12px',
    fontWeight: '700',
    padding: "3px 12px",
    textTransform: "capitalize",
    borderRadius: "8px",
    boxShadow: '1px 1px 1px 1px #c7c7c757',
    backgroundColor: backgroundColor, // Use dark background
    border: selected ? 'none' : 'none',
    width: "calc(5vw + 100px)",
    '&:hover': {
      backgroundColor: darkMode ? '#555555' : '#f5f5f5',
    },
    '& img': {
      filter: selected ? 'invert(35%) sepia(65%) saturate(7462%) hue-rotate(201deg) brightness(92%) contrast(100%)' : img,
    },
  }));
  const toggleOptions = [
    { value: 'dataprepare', label: t('data-prepare') },
    { value: 'textanalysis', label: t('text-analytics') }
  ];
  const renderMainComponent = () => {
    if (view === 'dataprepare') {
      return (
        <>
          {/* <DataPrepare /> */}
          <DContainer >
            <Header />
            <CustomContainer style={{ background: backgroundColor }}>
              <ToggleComponent view={view} handleViewChange={handleViewChange} options={toggleOptions} />
              <BtnContainer>
                <div>
                  <FileInputField
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
                  />
                  {/* {fileError && <div style={{ color: 'red', marginTop: '5px' }}>{fileError}</div>} */}

                </div>
                {/* </StyledButton> */}

                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={onFileUpload}
                  disabled={!fileSelected.length}
                  startIcon={<CloudUploadIcon />}
                  style={{
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                    // color: "black",
                  }}
                >
                  {uploading ? "Uploading..." : t('upload')}
                </StyledButton>

                <SearchField
                  // label={t('search')}
                  placeholder={t('search')}
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <StyledButton
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
                    borderRadius: "8px"
                    // color: "black",
                  }}
                >
                  {t('delete')}
                </StyledButton>
              </BtnContainer>
            </CustomContainer>
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
              handleClose={handleClose}
              handleAgree={handleDeleteAll}
            />
            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
              message={t('success_message')}
            />
            {/* </Container> */}
            <ErrorModal open={openModal} onClose={handleCloseModal} message={fileError} />
          </DContainer>

        </>
      );
    } else if ((view === 'textanalysis')) {
      return (
        <>
          <CustomContainer style={{ background: backgroundColor }}>
            <ToggleComponent view={view} handleViewChange={handleViewChange} options={toggleOptions} />
            <Hidden mdDown>
              <Box sx={{ display: 'flex', mt: 1, gap: 1, mb: 0 }}>
              { (userName !== 'user1' && userName !== 'user2') && (
                <CustomButton
                  style={{ background: backgroundColor }}
                  variant="contained"
                  component={Link}
                  to={Routess.Summary}
                  selected={location.pathname === Routess.Summary}
                >
                  <img className='icons' src={summary} alt="Logo" />
                  {t('summary')}
                </CustomButton>
              )}
                {/* Render QnA button only if userName is 'user1' or for all other users */}
                {(userName === 'user1' || (userName !== 'user1' && userName !== 'user2')) && (
                  <CustomButton
                    style={{ background: backgroundColor }}
                    variant="contained"
                    component={Link}
                    to={Routess.QndA}
                    selected={location.pathname === Routess.QndA}
                  >
                    <img className='icons' src={qna} alt="Logo" />
                    {t('QndA')}
                  </CustomButton>
                )}

                {/* Render Text Insight button only if userName is 'user2' or for all other users */}
                {(userName === 'user2' || (userName !== 'user1' && userName !== 'user2')) && (
                  <CustomButton
                    style={{ background: backgroundColor }}
                    variant="contained"
                    component={Link}
                    to={Routess.TextInsight}
                    selected={location.pathname === Routess.TextInsight}
                  >
                    <img className='icons' src={textinsight} alt="Logo" />
                    {t('text-insight')}
                  </CustomButton>
                )}
                { (userName !== 'user1' && userName !== 'user2') && (
                <CustomButton
                  style={{ background: backgroundColor }}
                  variant="contained"
                  component={Link}
                  to={Routess.Translate}
                  selected={location.pathname === Routess.Translate}
                >
                  <img className='icons' src={translate} alt="Logo" />
                  {t('translate')}
                </CustomButton>
                )}
              </Box>
            </Hidden>

          </CustomContainer>
          <Box sx={{ mt: 3, width: '100%' }}>
            {/* Conditionally render components based on userName */}
            {(userName === 'user1' || (userName !== 'user1' && userName !== 'user2')) && location.pathname === Routess.QndA && <DeployedQndA />}
            {(userName === 'user2' || (userName !== 'user1' && userName !== 'user2')) && location.pathname === Routess.TextInsight && <TextInsightAzureOpenAi />}
            {  (userName !== 'user1' && userName !== 'user2') && location.pathname === Routess.Summary && <SummaryAzureopenAi />}
            {  (userName !== 'user1' && userName !== 'user2') && location.pathname === Routess.Translate && <DocumentTranslation />}
          </Box>
        </>
      );
    }
  };

  return (
    <>
      {/* component rendering for dataprepare and textanslysis */}
      <Header />
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 8, ml: 2.5, mr: 2.5, mb: 1, flexGrow: 1 }}>
        {renderMainComponent()}
      </Box>
    </>
  );
};

export default TextAnalyticsLayout;
