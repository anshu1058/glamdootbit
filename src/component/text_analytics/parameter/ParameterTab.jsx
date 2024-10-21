// Summary parameter for web view tab providing different modals of gpt with the more features to see the variation in the generated summary.

import React, { useState, useEffect, useContext } from "react";
import { Box, Grid, IconButton, Slider, TextField, Tooltip, Typography, Popover, Paper, Select, MenuItem, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { BsInfoCircle } from "react-icons/bs";
import { styled } from "@mui/system";
import "../textanalysis.css";
import "./parameter.css"
import { ThemeContext } from "../../header/ThemeContext";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    fontSize: "11px",
    color: "#02457a",
    height: "7px",
    marginTop: "5px",
    padding: "8px",
  },
  '& .MuiInputBase-input[type="number"]': {
    '-moz-appearance': 'textfield', /* Firefox */
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
}));


const CustomSlider = styled(Slider)({
  color: 'white', // Color of the filled part
  height: 4,
  // border:"2px solid red",
  boxShadow: '1px 1px 1px 1px grey',
  padding: "0px",
  '& .MuiSlider-root': {
    padding: "0px",
    border: "2px solid red"
  },
  '& .MuiSlider-thumb': {
    backgroundColor: '#167bf5', // Color of the thumb
    border: '2px solid black',
    height: 8,
    width: 8,
  },
  '& .MuiSlider-rail': {
    color: 'white', // Color of the unfilled part
    opacity: 1,
    height: 4,
    boxShadow: "inset 0 2px 19px #00000000,  inset 0 2px 18px #00000000,  inset 2px 0 5px #00000000,  inset -2px 0 5px #00000000",
    // border: "1px solid grey"
  },
  '& .MuiSlider-track': {
    color: 'white', // Color of the track
    height: 4,
    // border: "0.5px solid #167bf5",
    boxShadow: "inset 0 2px 19px #167bf521,  inset 0 2px 18px #167bf521,  inset 2px 0 5px #167bf521,  inset -2px 0 5px #167bf521",
    padding: "0px"
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: 'blue', // Background color of the value label
  },
  '& .MuiSlider-thumb:hover, & .MuiSlider-thumb.Mui-focusVisible, & .MuiSlider-thumb.Mui-active': {
    boxShadow: '0px 0px 0px 8px rgba(0, 0, 255, 0.16)', // Effect on hover/focus/active
  },
  '@media (pointer: coarse)': {
    padding: '2px', // Remove padding for touch devices
  },
  //  ' @media (pointer: coarse)': {
  //     .css-mq7ho7-MuiSlider-root {
  //         padding: 2px;
  //     }
  // }
});
const useStyles = styled((theme) => ({
  parameterTab: {
    backgroundColor: "#d6e8ee",
    // padding: "1vw",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  box: {
    height: "71.5vh",
    overflow: "auto",
    [theme.breakpoints.down('md')]: {
      height: "77vh",
      overflow: "auto",
      // padding: '0 0 0 19px',
    },
  },
  parameterTabheading: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#02457a",
  },
  tooltip: {
    fontSize: "14px",
  },
  iconbutton: {
    padding: "0px",
    marginLeft: "5px",
    color: "#02457a",
    fontSize: "14px",
  },
  popover: {
    width: "28vw",
    fontSize: "12px"
  },
  popoverContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: theme.spacing(2),
  },
  closeButton: {
    alignSelf: "flex-end",
    marginRight: -theme.spacing(1),
    height: "12px",
    width: "12px",
    color: "#02457a",
  },
}));

const ParameterTab = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [temperatureInput, setTemperatureInput] = useState(props.temperature);
  const [maxLengthInput, setMaxLengthInput] = useState(props.maxLength);
  const [topPInput, setTopPInput] = useState(props.topP);
  const [frequencyPenalty, setFrequencyPenalty] = useState(props.frequencyPenalty);
  const [presencePenalty, setPresencePenalty] = useState(props.presencePenalty);
  const [infoAnchorEl, setInfoAnchorEl] = useState(null);
  const [popoverId, setPopoverId] = useState(null);
  const { theme } = useContext(ThemeContext);
  const backgroundColor = theme === "dark" ? "#333" : "#fff";
  const color = theme === "dark" ? 'white' : "";
  const [showError, setShowError] = useState(false);


  useEffect(() => {
    setTemperatureInput(props.temperature);
    setMaxLengthInput(props.maxLength);
    setTopPInput(props.topP);
    setFrequencyPenalty(props.frequencyPenalty);
    setPresencePenalty(props.presencePenalty);
  }, [props.temperature, props.maxLength, props.topP, props.presencePenalty, props.frequencyPenalty]);

  const handleTemperatureInputChange = (event) => {
    const value = event.target.value;
    setTemperatureInput(value);
    props.onTemperatureChange(value);
  };

  const handleSliderTempInput = (value) => {
    setTemperatureInput(value);
    props.onTemperatureChange(value);
  };

  const handleMaxLengthInputChange = (event) => {
    const value = event.target.value;
    setMaxLengthInput(value);

    if (value >= 50) {
      props.onMaxLengthChange(value);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const handleTopPInputChange = (event) => {
    const value = event.target.value;
    setTopPInput(value);
    props.onTopPChange(value);
  };

  const handleSliderTopPInput = (value) => {
    setTopPInput(value);
    props.onTopPChange(value);
  };

  const handleTemperatureInputBlur = () => {
    props.onTemperatureChange(Number(temperatureInput));
  };

  const handleMaxLengthInputBlur = () => {
    props.onMaxLengthChange(maxLengthInput);
  };

  const handleSliderInput = (value) => {
    setMaxLengthInput(value);
    props.onMaxLengthChange(value);
  };

  const handleTopPInputBlur = () => {
    props.onTopPChange(Number(topPInput));
  };

  const handleInfoClick = (event, popoverId) => {
    setInfoAnchorEl(event.currentTarget);
    setPopoverId(popoverId);
  };

  const handleInfoClose = () => {
    setInfoAnchorEl(null);
    setPopoverId(null);
  };

  const temperaturePopoverOpen = Boolean(infoAnchorEl) && popoverId === 'temperature-popover';
  const maxLengthPopoverOpen = Boolean(infoAnchorEl) && popoverId === 'maxLength-popover';
  const topPPopoverOpen = Boolean(infoAnchorEl) && popoverId === 'topP-popover';
  const precenscePopoverOpen = Boolean(infoAnchorEl) && popoverId === 'prenceP-popover';
  const frequency_penaltyPopoverOpen = Boolean(infoAnchorEl) && popoverId === 'frequency_penalty';

  const handleModelChange = (event) => {
    const selectedModel = event.target.value;
    props.onModelChange(selectedModel);
  };

  const handleSliderPresenceInput = (value) => {
    setPresencePenalty(value);
    props.onPresencePenaltyChange(value);
  };

  const handleSliderFrequencyInput = (value) => {
    setFrequencyPenalty(value);
    props.onFrequencyPenaltyChange(value);
  };

  return (
    <Box className='parametervalues' style={{ background: backgroundColor, color: color }}>
      <Box sx={{ background: backgroundColor, margin: "10px", padding: "5px" }}>
        <Grid container spacing={2} style={{ position: "relative" }}>
          {/* <Grid item xs={12}>
            <Box sx={{ background: backgroundColor, color: color, borderRadius: "10px", boxShadow: '0px 2px 4px 0px rgba(199, 199, 199, 0.9)', padding: "5px" }}>
              <Typography style={{ fontWeight: "700", fontSize: "12px" }}>
                {t("mode")}
              </Typography>
              <Typography component='p' variant="body2">
                {props.mode}
              </Typography>
            </Box>
          </Grid> */}
          <Grid item xs={12}>
            <Box sx={{ background: backgroundColor, color: color, borderRadius: "10px", boxShadow: '0px 2px 4px 0px rgba(199, 199, 199, 0.9)', padding: "5px" }}>
              <Typography style={{ fontWeight: "700", fontSize: "12px" }}>
                {t("model")}
              </Typography>
              <Select value={props.model} onChange={handleModelChange} fullWidth style={{ height: "25px" }}>
                {props.modelsList && props.modelsList.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ background: backgroundColor, color: color, borderRadius: "10px", boxShadow: '0px 2px 4px 0px rgba(199, 199, 199, 0.9)', padding: "5px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", height: "20px", padding: "1px 1px" }}>
                <Typography style={{ fontWeight: "700", fontSize: "12px" }}>
                  {t("temperature")}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton className='parametericon' onClick={(event) => handleInfoClick(event, 'temperature-popover')} style={{ fontSize: "11px" }}>
                    <BsInfoCircle />
                  </IconButton>
                  <Popover
                    id="temperature-popover"
                    open={temperaturePopoverOpen}
                    anchorEl={infoAnchorEl}
                    onClose={handleInfoClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    style={{ border: "1px solid #167bf5", boxShadow: 'none' }}
                  >
                    <Paper className='popover' >
                      <Box className='popoverContent'>
                        <Typography variant="body2" component="p">
                          {t('tempratureinfo')}
                        </Typography>
                        <Button onClick={handleInfoClose} className='closeButton'>
                          {t('close')}
                        </Button>
                      </Box>
                    </Paper>
                  </Popover>
                </Box>
              </Box>

              <Grid container spacing={1} style={{ borderRadius: "5px", alignItems: "center", }}>
                <Grid item xs={8} sm={8} md={7} lg={7.5}>
                  <Box className='boxparameter'>
                    <CustomSlider
                      min={0}
                      max={1}
                      step={0.01}
                      value={Number(temperatureInput)}
                      onChange={(event, value) => handleSliderTempInput(value)}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Grid>
                <Grid item xs={4} sm={4} md={5} lg={4.5}>
                  <CustomTextField
                    variant="outlined"
                    size="small"
                    onBlur={handleTemperatureInputBlur}
                    onChange={handleTemperatureInputChange}
                    value={temperatureInput}
                    fullWidth
                    inputProps={{ min: 0, max: 1, type: 'number', step: 0.01 }}
                    style={{ color: color }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ background: backgroundColor, color: color, borderRadius: "10px", boxShadow: '0px 2px 4px 0px rgba(199, 199, 199, 0.9)', padding: "5px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", height: "20px", padding: "1px 1px" }}>
                <Typography style={{ fontWeight: "700", fontSize: "12px" }}>
                  {t("maxlength")}
                </Typography>
                <IconButton className='parametericon' onClick={(event) => handleInfoClick(event, 'maxLength-popover')} style={{ fontSize: "11px" }}>
                  <BsInfoCircle />
                </IconButton>
                <Popover
                  id="maxLength-popover"
                  open={maxLengthPopoverOpen}
                  anchorEl={infoAnchorEl}
                  onClose={handleInfoClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  <Paper className='popover'>
                    <Box className='popoverContent'>
                      <Typography variant="body2" component="p">
                        {t('maxlengthinfo')}
                      </Typography>
                      <Button onClick={handleInfoClose} className='closeButton'>
                        {t('close')}
                      </Button>
                    </Box>
                  </Paper>
                </Popover>

              </Box>
              <Grid container spacing={1} style={{ borderRadius: "5px", alignItems: "center", }}>
                <Grid item xs={8} sm={8} md={7} lg={7.5}>
                  <Box className='boxparameter'>
                    <CustomSlider
                      min={50}
                      max={2000}
                      value={Number(maxLengthInput)}
                      onChange={(event, value) => handleSliderInput(value)}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Grid>
                <Grid item xs={4} sm={4} md={5} lg={4.5}>
                  <CustomTextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    onBlur={handleMaxLengthInputBlur}
                    onChange={handleMaxLengthInputChange}
                    value={maxLengthInput}
                    inputProps={{ min: 50, max: props.maxToken, type: "number" }}
                  />
                </Grid>
                {showError && (
                  <Grid item xs={12}>
                    <p style={{ color: 'red' }}>value should be greater than 50.</p>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ background: backgroundColor, color: color, borderRadius: "10px", boxShadow: '0px 2px 4px 0px rgba(199, 199, 199, 0.9)', padding: "5px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", height: "20px", padding: "1px 1px" }}>
                <Typography style={{ fontWeight: "700", fontSize: "12px", }}>
                  {t("topP")}
                </Typography>
                <IconButton className='parametericon' onClick={(event) => handleInfoClick(event, 'topP-popover')} style={{ fontSize: "11px" }}>
                  <BsInfoCircle />
                </IconButton>
                <Popover
                  id="topP-popover"
                  open={topPPopoverOpen}
                  anchorEl={infoAnchorEl}
                  onClose={handleInfoClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  <Paper className='popover'>
                    <Box className='popoverContent'>
                      <Typography variant="body2" component="p">
                        {t('topPinfo')}
                      </Typography>
                      <Button onClick={handleInfoClose} className='closeButton'>
                        {t('close')}
                      </Button>
                    </Box>
                  </Paper>
                </Popover>
              </Box>
              <Grid container spacing={1} style={{ borderRadius: "5px", alignItems: "center" }}>
                <Grid item xs={8} sm={8} md={7} lg={7.5}>
                  <Box className='boxparameter'>
                    <CustomSlider
                      min={0}
                      max={1}
                      step={0.01}
                      value={topPInput}
                      onChange={(event, value) => handleSliderTopPInput(value)}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Grid>
                <Grid item xs={4} sm={4} md={5} lg={4.5}>
                  <CustomTextField
                    variant="outlined"
                    size="small"
                    onBlur={handleTopPInputBlur}
                    onChange={handleTopPInputChange}
                    value={topPInput}
                    className={classes.text}
                    fullWidth
                    inputProps={{ min: 0, max: 1, type: "number", step: 0.01 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ background: backgroundColor, color: color, borderRadius: "10px", boxShadow: '0px 2px 4px 0px rgba(199, 199, 199, 0.9)', padding: "5px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", height: "20px", padding: "0px 1px" }}>
                <Typography style={{ fontWeight: "700", fontSize: "12px", }}>
                  {t("presencepenalty")}
                </Typography>
                {/* <Tooltip title={t('perenceinfo')}> */}
                <IconButton className='parametericon' onClick={(event) => handleInfoClick(event, 'prenceP-popover')} style={{ fontSize: "11px" }}>
                  <BsInfoCircle />
                </IconButton>
                {/* </Tooltip> */}
                <Popover
                  id="prenceP-popover"
                  open={precenscePopoverOpen}
                  anchorEl={infoAnchorEl}
                  onClose={handleInfoClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  <Paper className='popover'>
                    <Box className='popoverContent'>
                      <Typography variant="body2" component="p">
                        {t('perenceinfo')}
                      </Typography>
                      <Button onClick={handleInfoClose} className='closeButton'>
                        {t('close')}
                      </Button>
                    </Box>
                  </Paper>
                </Popover>
              </Box>
              <Grid container spacing={1} style={{ borderRadius: "5px", alignItems: "center" }}>
                <Grid item xs={8} sm={8} md={7} lg={7.5}>
                  <Box className='boxparameter'>
                    <CustomSlider
                      min={0}
                      max={1}
                      step={0.1}
                      value={presencePenalty}
                      onChange={(event, value) => handleSliderPresenceInput(value)}
                      // style={{ marginTop: "5px" }}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Grid>
                <Grid item xs={4} sm={4} md={5} lg={4.5}>
                  <CustomTextField
                    variant="outlined"
                    size="small"
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setPresencePenalty(value);
                      props.onPresencePenaltyChange(value);
                    }}
                    value={presencePenalty}
                    className={classes.text}
                    fullWidth
                    inputProps={{ min: -2, max: 2, type: "number", step: 0.1 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ background: backgroundColor, color: color, borderRadius: "10px", boxShadow: '0px 2px 4px 0px rgba(199, 199, 199, 0.9)', padding: "5px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", height: "20px", padding: "1px 1px" }}>
                <Typography style={{ fontWeight: "700", fontSize: "11.5px", }}>
                  {t("frequency_penalty")}
                </Typography>
                {/* <Tooltip title={t('fpinfo')}> */}
                <IconButton className='parametericon' onClick={(event) => handleInfoClick(event, 'frequency_penalty')} style={{ fontSize: "11px" }}>
                  <BsInfoCircle />
                </IconButton>
                {/* </Tooltip> */}
                <Popover
                  id="frequency_penalty"
                  open={frequency_penaltyPopoverOpen}
                  anchorEl={infoAnchorEl}
                  onClose={handleInfoClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  <Paper className='popover'>
                    <Box className='popoverContent'>
                      <Typography variant="body2" component="p">
                        {t('fpinfo')}
                      </Typography>
                      <Button onClick={handleInfoClose} className='closeButton'>
                        {t('close')}
                      </Button>
                    </Box>
                  </Paper>
                </Popover>
              </Box>
              <Grid container spacing={1} style={{ borderRadius: "5px", alignItems: "center" }}>
                <Grid item xs={8} sm={8} md={7} lg={7.5}>
                  <Box className='boxparameter'>
                    <CustomSlider
                      min={0}
                      max={1}
                      step={0.1}
                      value={frequencyPenalty}
                      onChange={(event, value) => handleSliderFrequencyInput(value)}
                      // style={{ marginTop: "5px" }}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Grid>
                <Grid item xs={4} sm={4} md={5} lg={4.5}>
                  <CustomTextField
                    variant="outlined"
                    size="small"
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setFrequencyPenalty(value);
                      props.onFrequencyPenaltyChange(value);
                    }}
                    value={frequencyPenalty}
                    className={classes.text}
                    fullWidth
                    inputProps={{ min: -2, max: 2, type: "number", step: 0.1 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ParameterTab;
