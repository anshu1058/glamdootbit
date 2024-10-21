import React, { useState, useEffect } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";

const MyFileDataGrid = ({ columns, allData }) => {
  // State to keep track of the current page number
  const [currentPage, setCurrentPage] = useState(1);
  // State to store the data for the current page
  const [currentData, setCurrentData] = useState([]);
  const pageSize = 8; // Number of items per page
  const totalItems = allData.length; // Total number of data items
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / pageSize);
  // State to control if only rows with checkboxes can be selected
  const [checkboxOnlyRowSelect, setCheckboxOnlyRowSelect] = useState(true);

  // Calculate the starting and ending index for the current page's data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Update the currentData whenever currentPage, startIndex, endIndex, or allData changes
  useEffect(() => {
    const slicedData = allData.slice(startIndex, endIndex);
    setCurrentData(slicedData);
  }, [currentPage, startIndex, endIndex, allData]);

  // Handle changes in page size and reset to the first page
  const handlePageSizeChange = (size) => {
    setCurrentPage(1);
  };

  // Shuffle and refresh the data when the refresh button is clicked
  const handleRefresh = () => {
    const shuffledData = [...allData].sort(() => Math.random() - 0.5);
    const slicedData = shuffledData.slice(startIndex, endIndex);
    setCurrentData(slicedData);
  };

  return (
    <div className="table-container">
      {/* Data grid to display the current data with columns */}
      <ReactDataGrid
        columns={columns}
        dataSource={currentData}
        checkboxOnlyRowSelect={checkboxOnlyRowSelect}
        rowHeight={40}
        className="data-grid"
      />
      <div className="pagination-controls">
        <div className="pagination-arrows">
          {/* Pagination controls: Previous button */}
          <button
            className="pagination-button"
            onClick={() =>
              setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
            }
            disabled={currentPage === 1} // Disable if on the first page
          >
            {"<"}
          </button>
          {/* Display the current page number and total pages */}
          <span style={{ fontSize: "14px", margin: "0 10px" }}>
            Page: {currentPage} of {totalPages}
          </span>
          {/* Pagination controls: Next button */}
          <button
            className="pagination-button"
            onClick={() =>
              setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
            }
            disabled={currentPage === totalPages} // Disable if on the last page
          >
            {">"}
          </button>
        </div>
        <div className="results-per-page">
          {/* Dropdown for selecting results per page */}
          Results per page:
          <select onChange={(e) => handlePageSizeChange(e.target.value)}>
            <option value="8">8</option>
            {/* Add more options for different page sizes */}
          </select>
        </div>
        {/* Refresh button to shuffle the data */}
        <IconButton
          aria-label="refresh"
          onClick={handleRefresh}
          style={{ padding: '8px', fontSize: '16px' }}
        >
          <RefreshIcon />
        </IconButton>
        {/* Displaying the current range of items being shown */}
        <div className="showing-pages">
          Showing {startIndex + 1} - {endIndex} of {totalItems}
        </div>
      </div>
    </div>
  );
};

export default MyFileDataGrid;
