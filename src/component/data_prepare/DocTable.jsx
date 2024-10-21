import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import { IconButton } from "@mui/material";
import Refresh from "@mui/icons-material/Refresh";
import './doctable.css';
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../header/ThemeContext";

const ITEM_HEIGHT = 48;

const DocTable = (props) => {
  const { t } = useTranslation(); // Translation hook for multi-language support
  const [currentPage, setCurrentPage] = useState(1); // State for current page number
  const [currentData, setCurrentData] = useState([]); // State for the current page's data
  const [pageSize, setPageSize] = useState(10); // State for page size (number of items per page)
  const totalItems = props.docList.length; // Total number of documents
  const totalPages = Math.ceil(totalItems / pageSize); // Total number of pages based on page size
  const [selected, setSelected] = useState({}); // State for selected rows/documents
  const gridRef = useRef(null); // Ref to access the grid
  const { theme } = useContext(ThemeContext); // Get the current theme (dark or light) from the context
  const backgroundColor = theme === "dark" ? "#333" : "#fff"; // Set background color based on the theme

  // Handle selection change of rows in the grid
  const onSelectionChange = useCallback(({ selected }) => {
    setSelected(selected); // Update selected rows
    const keysObj = selected === true ? dataMap : selected;
    props.handleDocumentChange(Object.keys(keysObj)); // Handle document selection change
  }, [props.handleDocumentChange]);

  const dataMap = gridRef.current?.dataMap || null;
  const startIndex = (currentPage - 1) * pageSize; // Calculate start index for current page
  const endIndex = Math.min(startIndex + pageSize, totalItems); // Calculate end index for current page
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl); // Control anchor element for dropdown menus

  // Handle opening the dropdown
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Define the columns for the data grid
  const columns = [
    { name: "name", header: "File Name", defaultWidth: 300, defaultFlex: 1, filterEditor: "text" },
    { name: "size", header: "Size(in MB)", defaultWidth: 200, resizable: false },
    { name: "type", header: "Type", defaultWidth: 200, defaultFlex: 1 },
    { name: "date", header: "Date", minWidth: 100, defaultFlex: 1 },
    { name: "time", header: "Time", minWidth: 100, defaultFlex: 1, resizable: false },
  ];

  // Update current data whenever page or document list changes
  useEffect(() => {
    const slicedData = props.docList.slice(startIndex, endIndex);
    setCurrentData(slicedData);
  }, [currentPage, startIndex, endIndex, props.docList]);

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setCurrentPage(1); // Reset to first page
    setPageSize(Number(size)); // Update page size
  };

  // Handle refreshing the document list with random shuffle
  const handleRefresh = () => {
    const shuffledData = [...props.docList].sort(() => Math.random() - 0.5);
    const slicedData = shuffledData.slice(startIndex, endIndex);
    setCurrentData(slicedData);
  };

  return (
    <div className="table-container" style={{ background: backgroundColor }}>
      <ReactDataGrid
        columns={columns} // Columns configuration
        dataSource={currentData} // Data to be displayed
        checkboxColumn // Enable checkbox for row selection
        onSelectionChange={onSelectionChange} // Handle row selection changes
        idProperty="id"
        rowHeight={40}
        handle={(ref) => (gridRef.current = ref ? ref.current : null)} // Reference to the grid
        selected={selected} // Selected rows
        id='grid'
        className="data-grid"
        style={{ background: backgroundColor }}
      />
      
      {/* Pagination and controls section */}
      <div className="pagination-controls">
        <div className="pagination-arrows">
          <button
            className="pagination-button"
            onClick={() =>
              setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)) // Handle previous page
            }
            disabled={currentPage === 1} // Disable button if on first page
          >
            {"<"}
          </button>
          <span
            className="pagenumber"
            style={{ fontSize: "14px", margin: "0 10px" }}
          >
            {t('page')}: {currentPage} of {totalPages} {/* Show current page number */}
          </span>
          <button
            className="pagination-button"
            onClick={() =>
              setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages)) // Handle next page
            }
            disabled={currentPage === totalPages} // Disable button if on last page
          >
            {">"}
          </button>
        </div>

        {/* Page size selector */}
        <div className="results-per-page">
          <span className="resultppText">Results per page: </span>
          <select onChange={(e) => handlePageSizeChange(e.target.value)}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        {/* Show number of displayed items */}
        <div className="showing-pages">
          <IconButton
            className="dtrefreshButton"
            aria-label="refresh"
            onClick={handleRefresh} // Handle refreshing data
          >
            {/* <Refresh /> */}
          </IconButton>
          {t('showing')} {startIndex + 1} - {endIndex} of {totalItems} {/* Show number of documents */}
        </div>

        {/* Show number of selected rows */}
        <div className="selectedpages">
          {t('selectedrows')}: {props.selectedDocuments.length}
        </div>
      </div>
    </div>
  );
};

export default DocTable;
