import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Update the base URL if necessary

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }, // No API key or additional headers
});

export const fetchMandalas = async () => {
  const response = await api.get('/api/hymns');
  return [...new Set(response.data.map((hymn) => hymn.mandala))];
};

export const fetchHymns = async (mandala) => {
  const response = await api.get(`/api/hymns/${mandala}`);
  return response.data;
};

export const fetchVerses = async (mandala, hymn) => {
  const response = await api.get(`/api/hymns/${mandala}/${hymn}`);
  return response.data;
};

export const searchVerses = async (query) => {
  const response = await api.get('/api/search', { params: { query } });
  return response.data.flatMap((hymn) => hymn.verses);
};

export const fetchThematicAnalysis = async (mandala, hymn) => {
  const response = await api.get(`/thematic-analysis/${mandala}/${hymn}`);
  return response.data;
};

export const fetchModernInterpretation = async (mandala, hymn) => {
  const response = await api.get(`/modern-interpretation/${mandala}/${hymn}`);
  return response.data;
};

export const fetchSentiment = async (mandala, hymn) => {
  const response = await api.get(`/sentiment/${mandala}/${hymn}`);
  return response.data;
};

export const fetchWordFrequency = async (mandala, hymn) => {
  const response = await api.get(`/visualize/word-frequency/${mandala}/${hymn}`);
  return response.data;
};

export const fetchExplanation = async (mandala, hymn) => {
  const response = await api.get(`/explain/${mandala}/${hymn}`);
  return response.data;
};

export const fetchAudio = async (mandala, hymn) => {
  try {
    const response = await api.get(`/audio/${mandala}/${hymn}`);
    return response.data.audio_url;
  } catch (error) {
    console.error('Error fetching audio:', error);
    throw error;
  }
};

const pollTaskStatus = async (taskId) => {
  let status = 'pending';
  while (status === 'pending') {
    const response = await api.get(`/task/${taskId}`);
    status = response.data.status;
    if (status === 'completed') {
      return response.data.result;
    } else if (status === 'failed') {
      throw new Error(response.data.result.error);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before polling again
  }
};

export const fetchVedicQuiz = async () => {
  const response = await api.get('/vedic-quiz');
  return pollTaskStatus(response.data.task_id);
};

export const fetchComparativeAnalysis = async (mandala1, hymn1, mandala2, hymn2) => {
  const response = await api.get('/comparative-analysis', {
    params: { mandala1, hymn1, mandala2, hymn2 },
  });
  return pollTaskStatus(response.data.task_id);
};

export const generateMeditation = async (mandala, hymn, duration) => {
  const response = await api.get('/generate-meditation', { params: { mandala, hymn, duration } });
  return pollTaskStatus(response.data.task_id);
};

export const askQuestion = async (question) => {
  const response = await api.get('/ask-question', { params: { question } });
  return response.data;
};
