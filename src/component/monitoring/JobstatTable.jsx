import React, { useState, useEffect, useContext } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import  "../data_prepare/doctable.css";
import { IconButton } from "@mui/material";
import Refresh from "@mui/icons-material/Refresh";
import { useTranslation } from 'react-i18next';
import { ThemeContext } from "../header/ThemeContext"

const checkboxColumn = {
  renderCheckbox: (checkboxProps, cellProps) => {
    const { onChange, checked } = checkboxProps;
    const rowData = cellProps.rowData;

    const background = !checked ? "white" : "#7986cb";
    const border =
      checked === false ? "2px solid #7C8792" : "2px solid #7986CB";

      

    return (
      <div
        style={{
          cursor: "pointer",
          background,
          borderRadius: "20%",
          height: "18px",
          width: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border,
          fontSize: 10,
          color: checked === false ? "inherit" : "Black",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onChange(!checked);
        }}
      >
        {checked === false ? "" : checked === true ? "✔" : "--"}
      </div>
    );
  },
};

const JobstatTable = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const {log} = props;
  const [checkboxOnlyRowSelect, setCheckboxOnlyRowSelect] = useState(false);
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(10);
  const { theme } = useContext(ThemeContext); 
  const backgroundColor = theme === "dark" ? "#333" : "#fff"; 
 

  const structuredData = log.map(log => ({
    id: log.data.id,
    created:new Date(log.data.created).toLocaleString(),
    model: log.data.model,
    prompt_tokens: log.usage.prompt_tokens,
    completion_tokens: log.usage.completion_tokens,
    total_tokens: log.usage.total_tokens,
    cache: log.headers.cacheControl,
    content_type: log.headers.contentType,
    status: log.status,
  }));
  const totalItems = structuredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  const columns = [
    { name: "id", header: t("id"), defaultWidth: 300, defaultFlex: 1 },
    { name: "created", header: t("created"), defaultWidth: 200 },
    { name: "model", header: t("model"), },
    { name: "prompt_tokens", header: t("promt_token") ,defaultWidth: 150 },
    { name: "completion_tokens", header: t("completion_token"),defaultWidth: 180 },
    { name: "total_tokens", header: t("total_token"),defaultWidth: 150 },
    // { name: "cache", header: t("cache"), defaultFlex: 1 },
    { name: "content_type", header: t("content_type"), defaultFlex: 1, },
  ];
  
  useEffect(() => {
    const slicedData =  structuredData.slice(startIndex, endIndex);
    setCurrentData(slicedData);
  }, [currentPage, startIndex, endIndex]);

 
  const handlePageSizeChange = (size) => {
    setCurrentPage(1);
    setPageSize(Number(size));
  };

  const handleRefresh = () => {
    const shuffledData = [...structuredData].sort(() => Math.random() - 0.5);
    const slicedData = shuffledData.slice(startIndex, endIndex);
    setCurrentData(slicedData);
  };

  return (
    <div>
      <ReactDataGrid
        columns={columns}
        dataSource={currentData}
        checkboxColumn={checkboxColumn}
        checkboxOnlyRowSelect={checkboxOnlyRowSelect}
        rowHeight={40}
        className="data-grid"
        style={{background:backgroundColor}}
      />
      <div className="pagination-controls">
        <div className="pagination-arrows">
          <button
            className="pagination-button"
            onClick={() =>
              setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
            }
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <span style={{ fontSize: "14px", margin: "0 10px" }}>
            {t('page')}: {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={() =>
              setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
        <div className="results-per-page">
          Results per page:
          <select onChange={(e) => handlePageSizeChange(e.target.value)}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="100">100</option>
          </select>
        </div>
        <IconButton
          aria-label="refresh"
          onClick={handleRefresh}
          style={{ padding: '8px', fontSize: '16px' }}
        >
          <Refresh/>
        </IconButton>
        <div className="showing-pages">
          {t("showing")} {startIndex + 1} - {endIndex} of {totalItems}
        </div>
      </div>
    </div>
  );
};

export default JobstatTable;
