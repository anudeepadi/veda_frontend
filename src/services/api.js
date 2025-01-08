import { axiosClient } from './axiosClient';

// Core Hymn APIs
export const getAllHymns = async (mandala) => {
  try {
    const response = await axiosClient.get(`/hymns${mandala ? `/${mandala}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hymns:', error);
    throw error;
  }
};

export const getHymnDetails = async (mandala, hymn) => {
  try {
    const response = await axiosClient.get(`/hymns/${mandala}/${hymn}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hymn details:', error);
    throw error;
  }
};

export const searchHymns = async (searchTerm) => {
  try {
    const response = await axiosClient.get(`/search?query=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching hymns:', error);
    throw error;
  }
};

// NLP Service APIs
export const analyzeVerse = async (verse) => {
  try {
    const response = await axiosClient.post('/nlp/analyze-verse', verse);
    return response.data.analysis;
  } catch (error) {
    console.error('Error analyzing verse:', error);
    throw error;
  }
};

export const semanticSearch = async (query) => {
  try {
    const response = await axiosClient.post('/nlp/semantic-search', { query });
    return response.data.results;
  } catch (error) {
    console.error('Error in semantic search:', error);
    throw error;
  }
};

export const getVerseRecommendations = async (verse, allVerses) => {
  try {
    const response = await axiosClient.post('/nlp/get-recommendations', {
      current_verse: verse,
      verses: allVerses
    });
    return response.data.recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

export const getThematicAnalysis = async (verses) => {
  try {
    const response = await axiosClient.post('/nlp/thematic-analysis', { verses });
    return response.data.analysis;
  } catch (error) {
    console.error('Error getting thematic analysis:', error);
    throw error;
  }
};

// Error handling wrapper
const withErrorHandling = (apiCall) => async (...args) => {
  try {
    const response = await apiCall(...args);
    return response;
  } catch (error) {
    console.error(`API Error:`, error);
    throw error;
  }
};

// Export wrapped versions of all APIs
export const safeApis = {
  getAllHymns: withErrorHandling(getAllHymns),
  getHymnDetails: withErrorHandling(getHymnDetails),
  searchHymns: withErrorHandling(searchHymns),
  analyzeVerse: withErrorHandling(analyzeVerse),
  semanticSearch: withErrorHandling(semanticSearch),
  getVerseRecommendations: withErrorHandling(getVerseRecommendations),
  getThematicAnalysis: withErrorHandling(getThematicAnalysis)
};