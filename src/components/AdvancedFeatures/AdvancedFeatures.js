import React, { useState } from 'react';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import { Compass, Layers, Brain, HelpCircle } from 'lucide-react';
import { fetchVedicQuiz, fetchComparativeAnalysis, generateMeditation, askQuestion } from '../../api/rigVedaApi';

const AdvancedFeatures = ({ mandala, hymn, onResult }) => {
  const [loading, setLoading] = useState(false);

  const handleVedicQuiz = async () => {
    setLoading(true);
    try {
      const result = await fetchVedicQuiz();
      onResult('Vedic Quiz', JSON.stringify(result.quiz_questions));
    } catch (error) {
      onResult('Error', 'Failed to generate Vedic Quiz. Please try again.');
    }
    setLoading(false);
  };

  const handleComparativeAnalysis = async () => {
    setLoading(true);
    try {
      const result = await fetchComparativeAnalysis(mandala, hymn, mandala, Number(hymn) + 1);
      onResult('Comparative Analysis', result.comparative_analysis);
    } catch (error) {
      onResult('Error', 'Failed to perform Comparative Analysis. Please try again.');
    }
    setLoading(false);
  };

  const handleGenerateMeditation = async () => {
    setLoading(true);
    try {
      const result = await generateMeditation(mandala, hymn, 10);
      onResult('Meditation Script', result.meditation_script);
    } catch (error) {
      onResult('Error', 'Failed to generate Meditation Script. Please try again.');
    }
    setLoading(false);
  };

  const handleAskQuestion = async () => {
    setLoading(true);
    try {
      const question = "What is the significance of Agni in the Rig Veda?";
      const result = await askQuestion(question);
      onResult('Answer', result.answer);
    } catch (error) {
      onResult('Error', 'Failed to get an answer. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Box>
      <Button
        fullWidth
        variant="outlined"
        startIcon={loading ? <CircularProgress size={20} /> : <Compass />}
        onClick={handleVedicQuiz}
        disabled={loading}
        sx={{ mb: 1 }}
      >
        Vedic Quiz
      </Button>
      <Button
        fullWidth
        variant="outlined"
        startIcon={loading ? <CircularProgress size={20} /> : <Layers />}
        onClick={handleComparativeAnalysis}
        disabled={loading}
        sx={{ mb: 1 }}
      >
        Comparative Analysis
      </Button>
      <Button
        fullWidth
        variant="outlined"
        startIcon={loading ? <CircularProgress size={20} /> : <Brain />}
        onClick={handleGenerateMeditation}
        disabled={loading}
        sx={{ mb: 1 }}
      >
        Generate Meditation
      </Button>
      <Button
        fullWidth
        variant="outlined"
        startIcon={loading ? <CircularProgress size={20} /> : <HelpCircle />}
        onClick={handleAskQuestion}
        disabled={loading}
      >
        Ask a Question
      </Button>
      {loading && (
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Processing request...
        </Typography>
      )}
    </Box>
  );
};

export default AdvancedFeatures; 