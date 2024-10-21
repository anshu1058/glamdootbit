// Setting.js
import React, { useContext } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Button,
  Grid,
  Typography,
  Select,
  FormControl,
  InputLabel,
  Divider,
  styled,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { ThemeContext } from './ThemeContext'; // Import ThemeContext
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

// Styling for the dialog component
const useStyles = styled({
  dialog: {
    "& .MuiDialog-paper": {
      width: "74vw",
      height: "50vh",
      maxWidth: "600px"
    }
  },
  select: {
    minWidth: 150,
  },
});

// Settings component handles user settings like theme and language
const Setting = ({ open, handleClose }) => {
  const classes = useStyles();
  const { theme, setTheme } = useContext(ThemeContext); // Access theme and setTheme from context
  const [language, setLanguage] = React.useState("en");
  
  // Change language based on user selection
  const handleClick = (e) => {
    setLanguage(e.target.value);
    i18next.changeLanguage(e.target.value);
  };

  // Toggle between dark and light theme
  const handleThemeChange = (event) => {
    const newTheme = event.target.checked ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const isDarkMode = theme === 'dark'; // Deriving isDarkMode based on the current theme
  const { t } = useTranslation();

  return (
    <Dialog
      className={classes.dialog}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t('settings')}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          <Grid container spacing={1}>
            {/* Theme Selection */}
            <Grid item xs={12} sm={6}>
              <Typography style={{ display: "flex", marginTop: '11px' }}>{t('theme')}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDarkMode}
                    onChange={handleThemeChange}
                    color="primary"
                    name="themeToggle"
                  />
                }
                label={isDarkMode ? t('Dark Mode') : t('Light Mode')}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* Language Selection */}
            <Grid item xs={12} sm={6}>
              <InputLabel id="language-select-label">{t('language')}</InputLabel>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.select}>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  value={language}
                  onChange={(e) => handleClick(e)}
                >
                  <MenuItem value={'en'}>English</MenuItem>
                  <MenuItem value={'hi'}>Hindi</MenuItem>
                  <MenuItem value={'ko'}>Korean</MenuItem>
                  <MenuItem value={'chi'}>Chinese</MenuItem>
                  <MenuItem value={'fre'}>French</MenuItem>
                  <MenuItem value={'iti'}>Italian</MenuItem>
                  <MenuItem value={'kan'}>Kannada</MenuItem>
                  <MenuItem value={'mar'}>Marathi</MenuItem>
                  <MenuItem value={'pun'}>Punjabi</MenuItem>
                  <MenuItem value={'spa'}>Spanish</MenuItem>
                  <MenuItem value={'tel'}>Telugu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Setting;
