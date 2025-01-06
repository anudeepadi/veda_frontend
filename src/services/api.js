import { axiosClient } from './axiosClient';

// Core Hymn APIs
export const getAllHymns = async (mandala) => {
  try {
    const response = await axiosClient.get(mandala ? `/hymns/${mandala}` : '/hymns');
    return response.data.hymns; // Extract hymns array from response
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
    const response = await axiosClient.get(`/search`, {
      params: { query: searchTerm }
    });
    return response.data.results; // Extract results array from response
  } catch (error) {
    console.error('Error searching hymns:', error);
    throw error;
  }
};

// Error handling wrapper
const withErrorHandling = (apiCall) => async (...args) => {
  try {
    const response = await apiCall(...args);
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    }
    throw error;
  }
};

// Export wrapped versions of all APIs
export const safeApis = {
  getAllHymns: withErrorHandling(getAllHymns),
  getHymnDetails: withErrorHandling(getHymnDetails),
  searchHymns: withErrorHandling(searchHymns)
};