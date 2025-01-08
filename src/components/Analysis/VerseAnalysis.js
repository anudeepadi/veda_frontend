import React from 'react';
import { useQuery } from 'react-query';
import { analyzeVerse, getRecommendations } from '../../services/nlp_service';

const VerseAnalysis = ({ verse, allVerses }) => {
  const { data: analysis, isLoading: analysisLoading, error: analysisError } = useQuery(
    ['verseAnalysis', verse?.number],
    () => analyzeVerse(verse),
    {
      enabled: !!verse,
      staleTime: 600000, // Cache for 10 minutes
      retry: false, // Don't retry on failure
      onError: (error) => {
        console.error('Analysis error:', error);
      }
    }
  );

  const { data: recommendations, isLoading: recsLoading, error: recsError } = useQuery(
    ['recommendations', verse?.number],
    () => getRecommendations(verse, allVerses),
    {
      enabled: !!verse && !!allVerses?.length,
      staleTime: 600000,
      retry: false,
      onError: (error) => {
        console.error('Recommendations error:', error);
      }
    }
  );

  if (!verse) return null;

  return (
    <div className="space-y-8">
      {/* Verse Details */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Current Verse</h3>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="prose max-w-none">
            <div className="text-gray-500 text-sm mb-2">Sanskrit</div>
            <div className="font-sanskrit mb-4">{verse.sanskrit}</div>
            <div className="text-gray-500 text-sm mb-2">Translation</div>
            <div>{verse.translation}</div>
          </div>
        </div>
      </div>

      {/* Analysis Section - Only show if available */}
      {!analysisError && analysis && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Analysis</h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            {analysisLoading ? (
              <div className="text-gray-500">Analyzing verse...</div>
            ) : (
              <div className="space-y-4">
                {analysis.themes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Main Themes</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {analysis.themes.map((theme, index) => (
                        <li key={index} className="text-gray-700">{theme}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.cultural_context && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Cultural Context</h4>
                    <p className="text-gray-700">{analysis.cultural_context}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations Section - Only show if available */}
      {!recsError && recommendations && recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Related Verses</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recsLoading ? (
              <div className="px-6 py-4 text-gray-500">Loading recommendations...</div>
            ) : (
              recommendations.map((rec, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="text-sm text-gray-500 mb-2">
                    Mandala {rec.verse.mandala}, Hymn {rec.verse.hymn_number},
                    Verse {rec.verse.verse_number}
                  </div>
                  <div className="text-gray-900 mb-2">{rec.verse.translation}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerseAnalysis;