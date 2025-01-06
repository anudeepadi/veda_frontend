import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import { Card } from '../Common/Card';
import { Spinner } from '../Common/Spinner';
import { ErrorAlert } from '../Common/ErrorAlert';
import { useThematicAnalysis } from '../../hooks/useApi';

const ThematicAnalysis = ({ mandala, hymn }) => {
  const { data, loading, error } = useThematicAnalysis(mandala, hymn);

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!data) return null;

  const { themes, keywords, sentiment } = data;

  // Format data for word cloud
  const words = keywords.map(({ word, weight }) => ({
    text: word,
    value: weight * 100
  }));

  // WordCloud options
  const options = {
    rotations: 2,
    rotationAngles: [0, 90],
    fontSizes: [20, 60],
    padding: 5,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
  };

  return (
    <div className="space-y-6">
      {/* Themes Section */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Key Themes
          </h3>
          <div className="space-y-4">
            {themes.map((theme, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                    {index + 1}
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">{theme.name}</h4>
                  <p className="mt-1 text-sm text-gray-500">{theme.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Word Cloud */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Keyword Analysis
          </h3>
          <div className="h-64 w-full">
            <ReactWordcloud words={words} options={options} />
          </div>
        </div>
      </Card>

      {/* Sentiment Analysis */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Sentiment Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 w-24">Overall:</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-indigo-600 rounded-full"
                  style={{ width: `${sentiment.overall * 100}%` }}
                />
              </div>
              <span className="ml-4 text-sm text-gray-600">
                {Math.round(sentiment.overall * 100)}%
              </span>
            </div>
            {Object.entries(sentiment.aspects).map(([aspect, score]) => (
              <div key={aspect} className="flex items-center">
                <span className="text-sm font-medium text-gray-700 w-24">
                  {aspect}:
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-indigo-600 rounded-full"
                    style={{ width: `${score * 100}%` }}
                  />
                </div>
                <span className="ml-4 text-sm text-gray-600">
                  {Math.round(score * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ThematicAnalysis;