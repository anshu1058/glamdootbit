import React from 'react'; // Importing React library
import { ToggleButton, ToggleButtonGroup } from '@mui/material'; // Importing ToggleButton and ToggleButtonGroup components from Material UI

// ToggleComponent handles toggling between different views, with options passed as props
const ToggleComponent = ({ view, options, handleViewChange, ...props }) => {
  
  // Function to handle the change of view when a toggle button is clicked
  const handleChange = (event, newView) => {
    handleViewChange(event, newView); // Call the passed-in handler to manage view change
  };

  return (
    <ToggleButtonGroup
      color="primary" // Sets the color theme for the toggle buttons
      value={view} // Current selected view
      exclusive // Ensures only one option can be selected at a time
      onChange={handleChange} // Event handler for when the selected view changes
      aria-label="view toggle" // Accessibility label for screen readers
      {...props} // Spread operator to pass additional props such as styling or classNames
      sx={{
        // Custom styling for the ToggleButtonGroup
        '& .MuiToggleButtonGroup-grouped:not(:last-of-type)': {
          borderRadius: '8px 0 0 8px', // Rounds the left side of the first button
          fontSize: "12px", // Font size for the button text
          padding: "5px", // Padding inside the button
        },
        '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
          borderRadius: '0 8px 8px 0', // Rounds the right side of the last button
          fontSize: "12px", // Font size for the button text
          padding: "5px", // Padding inside the button
        },
        '& .MuiToggleButtonGroup-grouped': {
          boxShadow: '1px 1px 1px 1px #c7c7c757', // Box shadow to add a subtle effect
          '&.Mui-selected': {
            borderColor: 'rgba(0, 0, 0, 0.12)', // Border color when selected
            fontSize: "12px", // Font size when selected
            padding: "5px", // Padding when selected
            color: "blue", // Text color when selected
          },
        },
      }}
    >
      {/* Mapping over options to dynamically generate toggle buttons */}
      {options.map(option => (
        <ToggleButton 
          key={option.value} // Unique key for each option
          value={option.value} // Value associated with the button
          sx={{ 
            fontWeight: '700', // Bold text
            '&.Mui-selected': {
              color: 'black', // Text color when selected
              backgroundColor: 'white', // Background color when selected
            },
            '&:hover': {
              backgroundColor: 'WHITE', // Background color when hovered
            }
          }}
        >
          {option.label} {/* Display the label for each toggle button */}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ToggleComponent;
