import React, { useState, useEffect, useCallback } from 'react';
import { Search, BookOpen, Cloud, Network, ChartLine, Settings, Info, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { debounce } from 'lodash';

// Lazy-load components
const Sidebar = React.lazy(() => import('./Sidebar/Sidebar'));
const AudioPlayer = React.lazy(() => import('./AudioPlayer/AudioPlayer'));
const TabLayout = React.lazy(() => import('./Tabs/TabLayout'));

const TABS = {
  VERSES: 'VERSES',
  WORD_CLOUD: 'WORD_CLOUD',
  RELATIONSHIPS: 'RELATIONSHIPS',
  ANALYSIS: 'ANALYSIS',
};

interface Verse {
  id: number;
  text: string;
  translation: string;
  transliteration: string;
  path: string;
}

const MandalaViewer: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(TABS.VERSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) return;
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/search`, {
          params: { query: encodeURIComponent(query) },
        });
        setSearchResults(response.data.results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    handleSearch(searchQuery);
    return () => handleSearch.cancel();
  }, [searchQuery, handleSearch]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">siva.sh</h1>
        </div>
        <React.Suspense fallback={<div>Loading Sidebar...</div>}>
          <Sidebar />
        </React.Suspense>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Search Bar */}
              <div className="flex-1 max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>

              {/* Blog Title */}
              <div className="ml-4 flex items-center">
                <span className="text-gray-600">Latest blog: The Siva-Tandava Stotra</span>
                <Settings className="ml-4 text-gray-600 cursor-pointer" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Notice */}
        {searchQuery && (
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <p className="text-sm text-gray-600">Free search is limited to top 10 results.</p>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-600 flex items-center">
                Upgrade now to access more features and search results
                <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        )}

        {/* Tabs and Content */}
        <div className="flex-1 overflow-hidden">
          <React.Suspense fallback={<div>Loading Tabs...</div>}>
            <TabLayout
              tabs={[
                { id: TABS.VERSES, icon: BookOpen, label: 'Verses' },
                { id: TABS.WORD_CLOUD, icon: Cloud, label: 'Word Cloud' },
                { id: TABS.RELATIONSHIPS, icon: Network, label: 'Relationships' },
                { id: TABS.ANALYSIS, icon: ChartLine, label: 'Analysis' },
              ]}
              activeTab={selectedTab}
              onTabChange={setSelectedTab}
            />
          </React.Suspense>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-6">
                  {searchResults.map((verse) => (
                    <div key={verse.id} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                      <div className="text-sm text-gray-500">{verse.path}</div>
                      <div className="space-y-3">
                        <p className="text-lg font-sanskrit">{verse.text}</p>
                        <p className="text-gray-600">{verse.transliteration}</p>
                        <p className="text-gray-800">{verse.translation}</p>
                      </div>
                      <React.Suspense fallback={<div>Loading Audio Player...</div>}>
                        <AudioPlayer verseId={verse.id} />
                      </React.Suspense>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-20">
                  <Info size={48} className="mx-auto mb-4" />
                  <p className="text-lg">
                    {searchQuery ? 'No results found' : 'Enter a search query to find verses'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandalaViewer;
