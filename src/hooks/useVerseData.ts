import { useState, useEffect } from 'react';
import axios from 'axios';

interface Verse {
  path: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
}

interface UseVerseDataReturn {
  verses: Verse[];
  isLoading: boolean;
  error: string | null;
  searchVerses: (query: string) => Promise<void>;
  loadVerseByPath: (path: string) => Promise<void>;
}

export const useVerseData = (): UseVerseDataReturn => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVerses = async (query: string) => {
    if (!query) {
      setVerses([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`/api/verses/search?q=${encodeURIComponent(query)}`);
      setVerses(response.data.