import React, { useContext } from 'react'; // Import React and useContext hook
import { Button } from "@mui/material"; // Import Button component from Material UI
import { useTranslation } from 'react-i18next'; // Import translation hook for internationalization
import { Refresh } from '@mui/icons-material'; // Import Material UI icon (not used here but make sure you have it if needed)
import '../text_analytics/layout/layout.css'; // Import external CSS for custom styling
import { ThemeContext } from '../header/ThemeContext'; // Import custom ThemeContext for theme-based styling

// ResetButton component used for clearing or resetting data
const ResetButton = (props) => {
  const { t } = useTranslation(); // Translation hook to support different languages
  const { theme } = useContext(ThemeContext); // Access current theme (dark or light) from ThemeContext
  
  // Define background and text color based on the current theme
  const backgroundColor = theme === "dark" ? "#333" : "#fff"; // Dark theme: dark background, Light theme: white background
  const color = theme === "dark" ? "white" : ""; // Dark theme: white text, Light theme: default color

  return (
    <Button
      className='resetbtn' // Custom class for additional styling via external CSS
      onClick={props.docclear} // Calls the `docclear` function when the button is clicked (provided via props)
      style={{ background: backgroundColor, color: color }} // Inline style to apply dynamic theme-based styling
    >
      {t("reset")} {/* Text label for the button, translated using the `t` function */}
    </Button>
  );
};

export default ResetButton;
