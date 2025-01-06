import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { safeApis } from '../../services/api';
import { Spinner } from '../Common/Spinner';
import { ErrorAlert } from '../Common/ErrorAlert';

const HymnViewer = () => {
  const { mandala, hymn } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hymnData, setHymnData] = useState(null);

  useEffect(() => {
    const fetchHymnData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await safeApis.getHymnDetails(mandala, hymn);
        setHymnData(data);
      } catch (err) {
        console.error('Error fetching hymn:', err);
        setError(err.message || 'Failed to load hymn');
      } finally {
        setLoading(false);
      }
    };

    if (mandala && hymn) {
      fetchHymnData();
    }
  }, [mandala, hymn]);

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!hymnData) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {hymnData.title || `Mandala ${mandala}, Hymn ${hymn}`}
          </h1>
        </div>

        {/* Verses */}
        <div className="space-y-8">
          {hymnData.verses && hymnData.verses.map((verse, index) => (
            <div key={verse.number} className="border-b border-gray-200 pb-6 last:border-b-0">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Verse {verse.number}
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Sanskrit Text */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">Sanskrit</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-lg font-sanskrit leading-relaxed whitespace-pre-wrap">
                      {verse.sanskrit}
                    </p>
                  </div>
                </div>

                {/* Transliteration */}
                {verse.transliteration && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">Transliteration</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {verse.transliteration}
                      </p>
                    </div>
                  </div>
                )}

                {/* Translation */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">English Translation</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                      {verse.translation}
                    </p>
                  </div>
                </div>

                {/* Commentary */}
                {verse.commentary && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">Commentary</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {verse.commentary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HymnViewer;