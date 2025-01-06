import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const InterpretationTab = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ height: '100%', overflowY: 'auto' }}>
        <Typography variant="body1">No interpretations available.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      {data.map((interpretation, index) => (
        <Paper key={index} elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Verse {interpretation.original_verse.number}</Typography>
          <Typography variant="body2" paragraph>
            <strong>Original:</strong> {interpretation.original_verse.translation}
          </Typography>
          <Typography variant="body1">
            <strong>Modern Interpretation:</strong> {interpretation.modern_interpretation}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default InterpretationTab;