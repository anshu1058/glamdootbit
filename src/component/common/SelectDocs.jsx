import React, { useState, useEffect } from 'react'; // Importing required React hooks
import {
  Checkbox,
  ListItemText,
  MenuItem,
  Popover,
  Button,
  styled,
} from '@mui/material'; // Importing Material UI components
import { useFetchContainersAndBlobs } from '../data_prepare/azure-blob-stoage'; // Custom hook to fetch data from Azure Blob Storage
import { useTranslation } from 'react-i18next'; // Hook for handling translations (i18n)

// Styled Material UI Button component with custom styles
const CustomButton = styled(Button)`
  height: 35px;
  width: 100%;
  font-size: 12px;
  color: black;
  border-radius: 18px;
  background-color: white;
  padding: 2.5px 12px;
  box-sizing: border-box;
  font-weight: 700;
`;

// Styled Popover component to control the appearance of the pop-up list
const CustomPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    maxWidth: '100%',
    maxHeight: '50%',
    overflowY: 'auto',
    overflowX: 'auto',
  },
}));

// Styled MenuItem component to display individual blob items with custom styles
const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: '2px 8px',
  border: '1px solid #ccc',
  borderRadius:'18px' ,
  '& .MuiCheckbox-root': {
    fontSize: '12px',
    padding: '6px',
    width: '18px',
    height: '18px',
  },
  '& .MuiTypography-body1': {
    fontSize: '12px',
  },
  '&:hover': {
    backgroundColor: 'lightgrey',
  },
}));

// Main component to select and display documents
const SelectDocs = (props) => {
  const { containersWithBlobs } = useFetchContainersAndBlobs(); // Fetching blob data from Azure
  const [anchorEl, setAnchorEl] = useState(null); // State to control the popover's anchor element
  const [selectedOptions, setSelectedOptions] = useState([]); // State to store selected documents
  const [blobList, setBlobList] = useState([]); // State to store filtered blobs
  const { t } = useTranslation(); // Translation hook
  const [searchTerm, setSearchTerm] = useState(''); // State to store the search term

  // Effect to fetch and filter blob data when the component mounts or the blob data changes
  useEffect(() => {
    async function fetchBlobs() {
      const fetchedBlobs = containersWithBlobs.flatMap(container => container.blobs); // Flatten blob data from all containers
      const filteredBlobs = filterBlobsForPage(fetchedBlobs); // Filter blobs based on the current page
      setBlobList(filteredBlobs); // Update the state with the filtered blobs
    }
    fetchBlobs();
  }, [containersWithBlobs]); // Dependency array to rerun effect when containersWithBlobs changes

  // Function to get the current page URL
  const getCurrentPageURL = () => {
    return window.location.pathname;
  };

  // Function to filter blobs based on the current page and exclude certain file types/locations
  const filterBlobsForPage = (blobs) => {
    const currentPageURL = getCurrentPageURL();
    const excludedExtensions = ['.pptx', '.doc', '.txt', '.xls', '.xlsx', '.ppt', '.csv']; // Excluded file extensions
    const excludedLocations = ['summary', 'text-insight', 'moderation']; // Excluded locations

    // Conditional filtering based on the current page URL
    if (
      currentPageURL.includes('/app/textanalysis/summary') ||
      currentPageURL.includes('/app/textanalysis/Moderation') ||
      currentPageURL.includes('/app/textanalysis/textinsight')
    ) {
      return blobs.filter((blob) => {
        const fileExtension = blob.name.split('.').pop().toLowerCase(); // Extract file extension
        const fileLocation = blob.location;

        return (
          !excludedExtensions.includes(`.${fileExtension}`) && // Exclude certain file extensions
          !excludedLocations.includes(fileLocation) // Exclude certain locations
        );
      });
    } else {
      return blobs; // If no filtering is needed, return all blobs
    }
  };

  // Function to open the popover
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to close the popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to handle toggling the selected document
  const handleOptionToggle = (option) => {
    const newSelectedOption = option.name;

    setSelectedOptions([newSelectedOption]); // Update selected options

    if (newSelectedOption) {
      props.onSelectFile(option); // Pass the selected file to the parent component
      localStorage.removeItem('cachedURL'); // Clear cached URL if a file is selected
    } else {
      props.onSelectFile(null); // Clear selection if no file is selected
    }

    handleClose(); // Close the popover
  };

  const open = Boolean(anchorEl); // Boolean flag to check if the popover is open

  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter the blob list based on the search term
  const filteredBlobList = blobList.filter((blob) => {
    return blob.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ width: "100%" }}>
      <CustomButton onClick={handleOpen} fullWidth>
        {t('select-document')} {/* Button label with translation */}
      </CustomButton>
      <CustomPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ margin: '8px', padding: '8px', width: '90%' }} // Search input with inline styles
          />
        </div>
        {filteredBlobList.map((option) => (
          <CustomMenuItem key={option.name} onClick={() => handleOptionToggle(option)}>
            <Checkbox checked={selectedOptions.includes(option.name)} />
            <ListItemText primary={option.name} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginLeft: '5px' }} />
          </CustomMenuItem>
        ))}
      </CustomPopover>
    </div>
  );
};

export default SelectDocs;
