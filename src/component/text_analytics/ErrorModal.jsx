import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/material/styles';

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '15px',
    padding: theme.spacing(2),
    backgroundColor: '#ffffff', // White background
    width: 'auto', // Adjusted width for better fitting
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  color: '#ff1744', // Bright red color for the icon
}));

const ErrorModal = ({ open, onClose,message }) => {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
    >
      <DialogContent>
        <IconContainer>
          <ErrorOutlineIcon style={{ fontSize: '50px' }} />
        </IconContainer>
        <Typography variant="h6" component="div" style={{ textAlign: 'center', color: '#333' }}>
          Invalid Doc Type!
        </Typography>
        <Typography variant="body2" style={{ textAlign: 'center', marginTop: '10px' }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button onClick={onClose} variant="contained" style={{ backgroundColor: 'blue', color: 'white' }}>
          Ok
        </Button>
      </DialogActions>
    </CustomDialog>
  );
};

export default ErrorModal;
