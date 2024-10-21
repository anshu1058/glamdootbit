import React, { useContext } from 'react'; // Importing React and useContext hook
import { ToggleButton, ToggleButtonGroup } from '@mui/material'; // Importing ToggleButton and ToggleButtonGroup components from Material UI
import { useTranslation } from "react-i18next"; // Importing translation hook
import { ThemeContext } from '../header/ThemeContext'; // Importing custom ThemeContext for theme management

// Component to render a toggle button group for switching between "document" and "text"
const ToggleButtonforcomponent = ({ showhide, setShowhide }) => {
  const { t } = useTranslation(); // Hook to handle translations
  const { theme } = useContext(ThemeContext); // Access the current theme from the ThemeContext

  // Define background and text colors based on the theme (dark or light)
  const backgroundColor = theme === "dark" ? "#333" : "#fff"; 
  const color = theme === "dark" ? "white" : "blue"; 
  const hovercolor = theme === "dark" ? "grey" : "white"; // Hover color based on theme

  return (
    <ToggleButtonGroup
      value={showhide} // Current value of the toggle (either "document" or "text")
      exclusive // Ensures that only one option can be selected at a time
      aria-label="show-hide" // Accessibility label
      sx={{
        // Styling for the ToggleButton component
        '& .MuiToggleButton-root': {
          borderRadius: '7px', // Rounded corners
          width: '9vw', // Set width to be responsive based on viewport width
          height: '2vh', // Set height to be responsive
          fontWeight: '700', // Bold text
          padding: "18px", // Padding for the button
          boxShadow: '1px 5px 14px 0px #c4c0c0', // Shadow effect
          backgroundColor: backgroundColor, // Background color based on the theme
          '&.Mui-selected': {
            fontWeight: '700', // Keep bold text when selected
            color: "blue", // Text color when selected
            backgroundColor: backgroundColor, // Background color when selected
          },
          '&:hover': {
            backgroundColor: hovercolor, // Change background color on hover
            height: '2vh' // Maintain height on hover
          },
          // Media query for small screens (max width 600px)
          '@media (max-width: 600px)': {
            width: '90%', // Adjust width to 90% for small screens
          },
          // Media query for medium screens (min-width 600px and max-width 960px)
          '@media (min-width: 600px) and (max-width: 960px)': {
            width: '70%', // Adjust width to 70% for medium screens
            height: '2vh' // Maintain height for medium screens
          },
        },
        // Adjust border radius for grouped buttons
        '& .MuiToggleButtonGroup-grouped:not(:last-of-type)': {
          borderRadius: '7px 0 0 7px', // Left button gets rounded on the left side
        },
        '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
          borderRadius: '0 7px 7px 0', // Right button gets rounded on the right side
        }
      }}
    >
      {/* Toggle button for "document" */}
      <ToggleButton
        value="document" // Value for this toggle option
        onClick={() => setShowhide("document")} // Set showhide state to "document" on click
      >
        {t('document')} {/* Translated label for "document" */}
      </ToggleButton>

      {/* Toggle button for "text" */}
      <ToggleButton
        value="text" // Value for this toggle option
        onClick={() => setShowhide("text")} // Set showhide state to "text" on click
      >
        {t('text')} {/* Translated label for "text" */}
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleButtonforcomponent;
