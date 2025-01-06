import { useState, useEffect } from 'react';
import * as api from '../services/api';

const useRigVedaData = () => {
  const [mandalas, setMandalas] = useState([]);
  const [hymns, setHymns] = useState([]);
  const [selectedMandala, setSelectedMandala] = useState(null);
  const [selectedHymn, setSelectedHymn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial mandalas
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const mandalaNumbers = await api.fetchMandalas();
        setMandalas(mandalaNumbers.sort((a, b) => a - b));
      } catch (error) {
        setError(error.message);
        console.error('Error fetching mandalas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch hymns when mandala is selected
  useEffect(() => {
    const fetchHymns = async () => {
      if (!selectedMandala) return;

      try {
        setLoading(true);
        setError(null);
        const hymnData = await api.fetchHymns(selectedMandala);
        setHymns(hymnData);
      } catch (error) {
        setError(error.message);
        console.error(`Error fetching hymns for mandala ${selectedMandala}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchHymns();
  }, [selectedMandala]);

  // Handle mandala selection
  const handleMandalaSelect = async (mandalaId) => {
    setSelectedMandala(mandalaId);
    setSelectedHymn(null); // Reset selected hymn
    setHymns([]); // Clear current hymns
  };

  // Handle hymn selection
  const handleHymnSelect = async (hymn) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedHymn(hymn);
      
      // Fetch detailed hymn data including verses
      const hymnDetails = await api.getHymnDetails(selectedMandala, hymn);
      
      // Update the hymns array with the detailed data
      setHymns(current => 
        current.map(h => 
          h.id === hymn ? { ...h, ...hymnDetails } : h
        )
      );
    } catch (error) {
      setError(error.message);
      console.error('Error selecting hymn:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const searchVerses = async (query) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const results = await api.searchVerses(query);
      return results;
    } catch (error) {
      setError(error.message);
      console.error('Error searching verses:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Reset state
  const reset = () => {
    setSelectedMandala(null);
    setSelectedHymn(null);
    setHymns([]);
    setError(null);
  };

  return {
    mandalas,
    hymns,
    selectedMandala,
    selectedHymn,
    loading,
    error,
    handleMandalaSelect,
    handleHymnSelect,
    searchVerses,
    reset
  };
};

export default useRigVedaData;