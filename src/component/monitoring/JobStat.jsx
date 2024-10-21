import React, { useEffect, useState,useContext } from "react";
import axios from 'axios';
import { Table, TableContainer, TableBody, TableRow, TableCell, Container, Typography, Button, Grid, Box, ButtonGroup } from "@mui/material";
import { TableChartOutlined,InsertChartOutlined, Padding } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import { api } from "../../config";
import JobstatTable from "./JobstatTable";
import { ThemeContext } from "../header/ThemeContext"


const JobStat = () => {
  const [logs, setLogs] = useState([]);
  const [showTabular, setShowTabular] = useState(true);
  const [showGraphical, setShowGraphical] = useState(false);
  const [showhide, setShowhide] = useState('Tabular Representation');
  const [chartDataPie, setChartDataPie] = useState([]);
  const [themecolor, setselectedTheme] = useState(localStorage.getItem('selectedTheme') || 'light');
  const [colortheme, setcolor] = useState();
  const [background, setbackground] = useState();
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { theme } = useContext(ThemeContext); 
  const backgroundColor = theme === "dark" ? "#333" : "#fff"; 
  const color = theme === "dark" ? "white" : "black"; 

  useEffect(() => {
    fetchData();
    setselectedTheme(localStorage.getItem('selectedTheme') || 'light');
  }, []);

  useEffect(() => {
    // Update the color state based on the theme
    if (theme === 'dark') {
      setcolor('white');
      setbackground('#333')
      localStorage.setItem('color', 'white');
    } else {
      setcolor('black');
      setbackground('none')
      localStorage.setItem('color', 'black');
    }
  }, [theme]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${api}/get-data`);
      const data = response.data;
      
      const currentDate = new Date();
      const previousDate = new Date();
      previousDate.setDate(currentDate.getDate() - 7); // Set previous date 7 days ago
  
      const fetchedLogs = data
        .map(item => ({
          usage: {
            prompt_tokens: item.prompttoken,
            completion_tokens: item.completiontoken,
            total_tokens: item.totaltoken,
          },
          data: {
            id: item.prompt_id,
            created: new Date(item.created), // Add the appropriate value if available
            model: item.model,
          },
          status: item.status,
          headers: {
            cacheControl: item.cachecontrol,
            contentType: item.contenttype,
          },
        }))
        .filter(log => {
          // Filter logs based on created date
          if (log.data.created instanceof Date && !isNaN(log.data.created)) {
            return log.data.created >= previousDate && log.data.created <= currentDate;
          }
          return false;
        });
  
      setLogs(fetchedLogs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleTabularClick = () => {
    setShowTabular(true);
    setShowGraphical(false);
  };

  const handleGraphicalClick = () => {
    setShowTabular(false);
    setShowGraphical(true);
  };

  const [chartDataLine, setChartDataLine] = useState([]);
  const [chartDataBar, setChartDataBar] = useState([]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#F9BF3B", "#0088AA"];
  const costPerToken = 0.05;

  useEffect(() => {
    // Update chartDataLine and chartDataBar whenever logs change
    const chartDataLine = logs.map(log => ({
      date: log.data.created.toLocaleDateString(),
      totalTokens: log.usage.total_tokens,
      cost: log.usage.total_tokens * costPerToken, // Calculate the cost by multiplying totalTokens with costPerToken
    }));
    setChartDataLine(chartDataLine);

    setChartDataLine(chartDataLine);

    const chartDataBar = logs.map(log => ({
      model: log.data.model, // Modify this to use the appropriate property for your BarChart
      totalTokens: log.usage.total_tokens,
    }));

    setChartDataBar(chartDataBar);

    const totalTokensSum = chartDataBar.reduce((sum, data) => sum + data.totalTokens, 0);
    const chartDataPie = chartDataBar.map((data, index) => ({
      name: data.model,
      value: (data.totalTokens / totalTokensSum) * 100,
      fill: COLORS[index % COLORS.length], // Assign a color to each segment
    }));
    setChartDataPie(chartDataPie);
  }, [logs]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", margin: "10px 4em", justifyContent: "center", alignItems: "center"}}>
        <Grid container>
          <Box sx={{ display: 'flex',alignItems: "center", width: "100%",boxShadow: '0 4px 8px rgba(199, 199, 199, 1)',padding:"10px"}}>
            <Typography style={{ fontWeight: "bold", marginRight: "12px", width: "100%", textAlign: "center", color:color }} variant="h6">
              {t('report')}
            </Typography>
            <Box>
              <ButtonGroup aria-label="show-hide">
                <Button
                  variant={showhide === 'Tabular Representation' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setShowhide('Tabular Representation')}
                >
                  <TableChartOutlined/>
                </Button>
                <Button
                  variant={showhide === 'Graphical Representation' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setShowhide('Graphical Representation')}
                >
                  <InsertChartOutlined />
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
          <Grid item xs={12}>
            {showhide === 'Tabular Representation' && (
              <JobstatTable log={logs} page={page} rowsPerPage={rowsPerPage}  />
            )}
            {showhide === 'Graphical Representation' && (
              <div className="mainContent" style={{ height: "calc(100vh - 150px)", overflowY: "scroll", width: "auto",marginTop:"5em" }}>
                <Container component="main" maxWidth="lg">
                  <Grid container >
                    <Grid item xs={6}>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartDataLine}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis dataKey="cost" yAxisId="left" />
                          <YAxis dataKey="totalTokens" yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="cost" name="Cost of Tokens" stroke="#FF8042" yAxisId="left" />
                          <Line type="monotone" dataKey="totalTokens" name="Total Tokens" stroke="#8884d8" yAxisId="right" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Grid>
                    <Grid item xs={6}>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartDataBar}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="model" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="totalTokens" name="Total Tokens" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Grid>
                  </Grid>
                </Container>
              </div>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default JobStat;
