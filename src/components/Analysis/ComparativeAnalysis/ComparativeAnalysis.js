import React, { useState } from 'react';
import { useComparativeAnalysis } from '../../../hooks/useApi';
import { Card } from '../../Common/Card';
import { Spinner } from '../../Common/Spinner';
import { ErrorAlert } from '../../Common/ErrorAlert';
import ComparisonChart from './ComparisonChart';
import ThemeComparison from './ThemeComparison';

const ComparativeAnalysis = ({ hymn1, hymn2 }) => {
  const [activeTab, setActiveTab] = useState('themes');
  const { data: comparison, loading, error } = useComparativeAnalysis(hymn1, hymn2);

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!comparison) return null;

  const tabs = [
    { id: 'themes', label: 'Thematic Analysis' },
    { id: 'language', label: 'Language Comparison' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'context', label: 'Historical Context' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-8">
            Comparative Analysis
          </h2>

          {/* Hymn Information */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                Hymn 1: Mandala {hymn1.mandala}, Hymn {hymn1.number}
              </h3>
              <p className="text-sm text-gray-600">{hymn1.title}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                Hymn 2: Mandala {hymn2.mandala}, Hymn {hymn2.number}
              </h3>
              <p className="text-sm text-gray-600">{hymn2.title}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'themes' && (
              <ThemeComparison themes={comparison.thematicAnalysis} />
            )}

            {activeTab === 'language' && (
              <div className="space-y-6">
                <Card>
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-4">Language Patterns</h3>
                    <ComparisonChart
                      data={comparison.languageAnalysis}
                      category1={`Hymn ${hymn1.number}`}
                      category2={`Hymn ${hymn2.number}`}
                    />
                  </div>
                </Card>

                {/* Vocabulary Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Unique Words in Hymn {hymn1.number}</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {comparison.languageAnalysis.uniqueWords1.map((word, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-white rounded m-1 text-sm">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Unique Words in Hymn {hymn2.number}</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {comparison.languageAnalysis.uniqueWords2.map((word, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-white rounded m-1 text-sm">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                {/* Metrics Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  {comparison.metrics.map((metric, index) => (
                    <Card key={index}>
                      <div className="p-4">
                        <h4 className="font-medium mb-2">{metric.name}</h4>
                        <div className="flex justify-between">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">
                              {metric.hymn1Value}
                            </div>
                            <div className="text-sm text-gray-600">Hymn {hymn1.number}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">
                              {metric.hymn2Value}
                            </div>
                            <div className="text-sm text-gray-600">Hymn {hymn2.number}</div>
                          </div>
                        </div>
                        {metric.analysis && (
                          <p className="mt-2 text-sm text-gray-600">{metric.analysis}</p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'context' && (
              <div className="space-y-6">
                <div className="prose max-w-none">
                  <h3>Historical Context</h3>
                  <p>{comparison.historicalContext.overview}</p>

                  <h4>Time Period</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="font-medium">Hymn {hymn1.number}</p>
                      <p className="text-sm text-gray-600">{comparison.historicalContext.hymn1Period}</p>
                    </div>
                    <div>
                      <p className="font-medium">Hymn {hymn2.number}</p>
                      <p className="text-sm text-gray-600">{comparison.historicalContext.hymn2Period}</p>
                    </div>
                  </div>

                  <h4>Cultural Significance</h4>
                  <p>{comparison.historicalContext.culturalSignificance}</p>

                  <h4>Shared Elements</h4>
                  <ul>
                    {comparison.historicalContext.sharedElements.map((element, index) => (
                      <li key={index}>{element}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ComparativeAnalysis;