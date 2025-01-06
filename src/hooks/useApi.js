import { useState, useCallback } from 'react';
import { safeApis } from '../services/api';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
    setError,
  };
};

// Pre-configured hooks for API calls
export const useHymns = () => useApi(safeApis.getAllHymns);
export const useHymn = () => useApi(safeApis.getHymn);
export const useHymnAudio = () => useApi(safeApis.getHymnAudio);
export const useVedicQuiz = () => useApi(safeApis.getVedicQuiz);
export const useThematicAnalysis = () => useApi(safeApis.getHymnWithDetails);
export const useComparativeAnalysis = () => useApi(safeApis.getComparativeAnalysis);
export const useMeditationGuide = () => useApi(safeApis.getMeditationGuide);