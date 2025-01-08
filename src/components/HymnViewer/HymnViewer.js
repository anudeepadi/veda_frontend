import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { safeApis } from '../../services/api';
import { Spinner } from '../Common/Spinner';
import { ErrorAlert } from '../Common/ErrorAlert';
import VerseAnalysis from '../Analysis/VerseAnalysis';

const HymnViewer = () => {
  const { mandala, hymn } = useParams();
  const [selectedVerse, setSelectedVerse] = useState(null);
  
  const { data: hymnData, isLoading, error } = useQuery(
    ['hymn', mandala, hymn],
    () => safeApis.getHymnDetails(mandala, hymn),
    {
      onSuccess: (data) => {
        // Select first verse by default
        if (data?.verses?.length > 0 && !selectedVerse) {
          setSelectedVerse(data.verses[0]);
        }
      }
    }
  );

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="p-8"><ErrorAlert message={error.message} /></div>;
  if (!hymnData) return <div className="p-8">No hymn data available</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Hymn Content */}
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {hymnData.title || `Mandala ${mandala}, Hymn ${hymn}`}
            </h1>
          </div>

          {/* Verses */}
          <div className="space-y-6">
            {hymnData.verses?.map((verse) => (
              <div
                key={verse.number}
                className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-colors ${
                  selectedVerse?.number === verse.number
                    ? 'ring-2 ring-indigo-500'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedVerse(verse)}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Verse {verse.number}
                    </h3>
                  </div>

                  {/* Sanskrit Text */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">Sanskrit</h4>
                    <p className="text-lg font-sanskrit leading-relaxed whitespace-pre-wrap">
                      {verse.sanskrit}
                    </p>
                  </div>

                  {/* Transliteration */}
                  {verse.transliteration && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">
                        Transliteration
                      </h4>
                      <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {verse.transliteration}
                      </p>
                    </div>
                  )}

                  {/* Translation */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">
                      English Translation
                    </h4>
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                      {verse.translation}
                    </p>
                  </div>

                  {/* Commentary */}
                  {verse.commentary && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">
                        Commentary
                      </h4>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {verse.commentary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Analysis */}
        <div className="lg:sticky lg:top-8">
          {selectedVerse && (
            <VerseAnalysis 
              verse={selectedVerse} 
              allVerses={hymnData.verses || []} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HymnViewer;