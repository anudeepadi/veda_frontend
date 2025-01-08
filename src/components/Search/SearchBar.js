import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { semanticSearch } from '../../services/nlp_service';
import { Spinner } from '../Common/Spinner';

const SearchBar = ({ onResultSelect }) => {
  const [query, setQuery] = useState('');
  const [verses, setVerses] = useState([]);

  const { data: searchResults, isLoading, error } = useQuery(
    ['semanticSearch', query],
    () => semanticSearch(query, verses),
    {
      enabled: query.length > 2, // Only search when query is longer than 2 chars
      staleTime: 30000, // Cache results for 30 seconds
    }
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim().length > 2) {
      // Search will be triggered by useQuery
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verses semantically..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {isLoading && (
            <div className="absolute right-3 top-2">
              <Spinner size="small" />
            </div>
          )}
        </div>
      </form>

      {error && (
        <div className="text-red-600 mb-4">
          Error performing search: {error.message}
        </div>
      )}

      {searchResults && searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {searchResults.map((result, index) => (
              <li
                key={index}
                className="px-4 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => onResultSelect(result.verse)}
              >
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Mandala {result.verse.mandala}, Hymn {result.verse.hymn_number}, 
                    Verse {result.verse.verse_number}
                  </div>
                  <div className="text-gray-900">{result.verse.translation}</div>
                  {result.explanation && (
                    <div className="text-sm text-indigo-600">
                      {result.explanation}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;