import React, { useState, useEffect, useContext } from 'react'; // Importing necessary React hooks and context
import { useNavigate, useLocation } from 'react-router-dom'; // Importing hooks for navigation and location
import ToggleComponent from '../common/ToggleComponent'; // Importing custom toggle component
import LogServer from './LogServer'; // Importing LogServer component
import JobStat from './JobStat'; // Importing JobStat component
import { Routess } from '../../routes'; // Importing route paths
import { Box } from '@mui/material'; // Importing MUI Box component for layout
import Header from '../header/Header'; // Importing Header component
import { styled } from '@mui/system'; // Importing styled for custom styling
import { useTranslation } from 'react-i18next'; // Importing translation hook for internationalization
import { ThemeContext } from "../header/ThemeContext"; // Importing ThemeContext for theme management

const MonitoringTab = () => {
  const [view, setView] = useState('logserver'); // State to manage current view ('logserver' or 'jobstat')
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook for location
  const { t } = useTranslation(); // Hook for translation
  const { theme } = useContext(ThemeContext); // Accessing theme from ThemeContext
  
  // Deriving background and text color based on the theme
  const backgroundColor = theme === "dark" ? "#333" : "#fff";
  const color = theme === "dark" ? "white" : "";

  // Custom container styling based on the theme
  const CustomContainer = styled(Box)({
    backgroundColor: backgroundColor,
    padding: '0.3em 0.9em',
    borderRadius: '30px',
    display: 'flex',
    flexDirection: 'column',
    marginTop: "5em",
    marginLeft: "3em"
  });

  // Effect to update view based on URL path
  useEffect(() => {
    if (location.pathname.includes('logserver')) {
      setView('logserver');
    } else if (location.pathname.includes('jobstat')) {
      setView('jobstat');
    }
  }, [location]);

  // Handler for changing the view
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
      if (newView === 'logserver') {
        navigate(Routess.LogServer); // Navigate to LogServer route
      } else {
        navigate(Routess.JobStat); // Navigate to JobStat route
      }
    }
  };

  // Options for the ToggleComponent
  const toggleOptions = [
    { value: 'logserver', label: t('logserver') },
    { value: 'jobstat', label: t('job_stat') }
  ];

  return (
    <div>
      <Header /> {/* Render the Header component */}
      <CustomContainer>
        {/* Render the ToggleComponent with current view and options */}
        <ToggleComponent
          view={view}
          options={toggleOptions}
          handleViewChange={handleViewChange}
        />
      </CustomContainer>
      <Box sx={{ mt: 3 }}>
        {/* Conditionally render LogServer or JobStat based on the current view */}
        {view === 'logserver' && location.pathname.includes('logserver') && <LogServer />}
        {view === 'jobstat' && location.pathname.includes('jobstat') && <JobStat />}
      </Box>
    </div>
  );
};

export default MonitoringTab;
