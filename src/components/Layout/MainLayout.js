import React, { useState, useEffect } from 'react';
import { Search, Settings, ChevronRight } from 'lucide-react';
import { searchVerses } from '../../services/api';
import Sidebar from '../Sidebar/Sidebar';
import TabLayout from '../Tabs/TabLayout';
import VerseTab from '../Tabs/VerseTab';
import WordCloudTab from '../Tabs/WordCloudTab';
import RelationshipsTab from '../Tabs/RelationshipsTab';
import AnalysisTab from '../Tabs/AnalysisTab';
import MeditationTab from '../Tabs/MeditationTab';

const MainLayout = () => {
  const [selectedTab, setSelectedTab] = useState('VERSES');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMandala, setSelectedMandala] = useState(null);
  const [selectedHymn, setSelectedHymn] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const results = await searchVerses(searchQuery);
        setSearchResults(results);
        setError(null);
      } catch (error) {
        console.error('Search error:', error);
        setError('Search failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleMandalaSelect = (mandala) => {
    setSelectedMandala(mandala);
    setSelectedHymn(null);
    setSearchResults([]);
    setError(null);
  };

  const handleHymnSelect = (hymn) => {
    setSelectedHymn(hymn);
    setSearchResults([]);
    setError(null);
  };

  const renderTabContent = () => {
    const commonProps = {
      selectedMandala,
      selectedHymn,
      loading,
      searchResults
    };

    switch (selectedTab) {
      case 'VERSES':
        return <VerseTab {...commonProps} />;
      case 'WORD_CLOUD':
        return <WordCloudTab {...commonProps} />;
      case 'RELATIONSHIPS':
        return <RelationshipsTab {...commonProps} />;
      case 'ANALYSIS':
        return <AnalysisTab {...commonProps} />;
      case 'MEDITATION':
        return <MeditationTab {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Vedic Explorer</h1>
        </div>
        <Sidebar 
          onMandalaSelect={handleMandalaSelect}
          onHymnSelect={handleHymnSelect}
          selectedMandala={selectedMandala}
          selectedHymn={selectedHymn}
        />
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
                    placeholder="Search verses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>

              {/* Settings */}
              <div className="ml-4 flex items-center">
                <Settings className="text-gray-600 cursor-pointer" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Notice */}
        {searchQuery && (
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {error ? error : `Showing results for "${searchQuery}"`}
              </p>
              {searchResults.length > 10 && !error && (
                <a href="#" className="text-sm text-blue-500 hover:text-blue-600 flex items-center">
                  View all results
                  <ChevronRight size={16} className="ml-1" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Tabs and Content */}
        <div className="flex-1 overflow-hidden">
          <TabLayout
            tabs={[
              { id: 'VERSES', label: 'Verses' },
              { id: 'WORD_CLOUD', label: 'Word Cloud' },
              { id: 'RELATIONSHIPS', label: 'Relationships' },
              { id: 'ANALYSIS', label: 'Analysis' },
              { id: 'MEDITATION', label: 'Meditation' }
            ]}
            activeTab={selectedTab}
            onTabChange={setSelectedTab}
          />

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
              {error ? (
                <div className="text-red-500 text-center">
                  {error}
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;