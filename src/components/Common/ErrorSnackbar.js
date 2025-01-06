import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const ErrorSnackbar = ({ error, onClose }) => {
  return (
    <Snackbar open={!!error} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;