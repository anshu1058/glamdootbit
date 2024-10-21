import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'; // Import MUI components
import { useTranslation } from 'react-i18next'; // Import translation hook

const ConfirmationDialog = ({ open, handleClose, handleAgree }) => {
  const { t } = useTranslation(); // Initialize translation hook for multi-language support

  return (
    <Dialog
      open={open} // Control whether the dialog is open based on the `open` prop
      onClose={handleClose} // Function to handle closing the dialog
      aria-labelledby="alert-dialog-title" // Accessibility label for the dialog title
      aria-describedby="alert-dialog-description" // Accessibility description for the dialog content
    >
      {/* Dialog title */}
      <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>

      {/* Dialog content containing confirmation message */}
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('confirmation')} {/* Translation of the confirmation text */}
        </DialogContentText>
      </DialogContent>

      {/* Dialog actions containing Cancel and Delete buttons */}
      <DialogActions>
        <Button onClick={handleClose} color="primary"> {/* Cancel button */}
          {t('cancel')} {/* Translation of 'Cancel' */}
        </Button>
        <Button onClick={handleAgree} color="primary" autoFocus> {/* Delete button */}
          {t('delete')} {/* Translation of 'Delete' */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
