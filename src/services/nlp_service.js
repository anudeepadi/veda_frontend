import { axiosClient } from './axiosClient';

export const analyzeVerse = async (verse) => {
  try {
    const response = await axiosClient.post(`/nlp/analyze-verse`, {
      sanskrit: verse.sanskrit,
      translation: verse.translation
    });
    return response.data.analysis;
  } catch (error) {
    console.error('Error analyzing verse:', error);
    throw error;
  }
};

export const semanticSearch = async (query, verses) => {
  try {
    const response = await axiosClient.post(`/nlp/semantic-search`, {
      query,
      verses
    });
    return response.data.results;
  } catch (error) {
    console.error('Error performing semantic search:', error);
    throw error;
  }
};

export const getRecommendations = async (currentVerse, verses) => {
  try {
    const response = await axiosClient.post(`/nlp/get-recommendations`, {
      current_verse: currentVerse,
      verses
    });
    return response.data.recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

export const getThematicAnalysis = async (verses) => {
  try {
    const response = await axiosClient.post(`/nlp/thematic-analysis`, {
      verses
    });
    return response.data.analysis;
  } catch (error) {
    console.error('Error getting thematic analysis:', error);
    throw error;
  }
};