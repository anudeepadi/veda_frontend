import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { generateWordCloud } from '../../services/api';
import { ResponsiveContainer, Treemap } from 'recharts';

const COLOR_RANGE = [
  '#E3F2FD',
  '#BBDEFB',
  '#90CAF9',
  '#64B5F6',
  '#42A5F5',
  '#2196F3',
  '#1E88E5',
  '#1976D2',
  '#1565C0',
  '#0D47A1'
];

const WordCloudTab = ({ mandala, hymn }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mandala && hymn) {
      loadWordCloud();
    }
  }, [mandala, hymn]);

  const loadWordCloud = async () => {
    setLoading(true);
    try {
      const result = await generateWordCloud(mandala, hymn);
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error generating word cloud:', err);
      setError('Failed to generate word cloud. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CustomizedContent = ({ root, depth, x, y, width, height, index, name, value }) => {
    const fontSize = Math.min(width / name.length * 1.5, height / 2);
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={COLOR_RANGE[Math.min(depth, COLOR_RANGE.length - 1)]}
          stroke="#fff"
        />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#fff"
          fontSize={fontSize}
          fontWeight={depth === 1 ? 'bold' : 'normal'}
        >
          {name}
        </text>
      </g>
    );
  };

  if (!mandala || !hymn) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Info size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Please select a mandala and hymn to generate a word cloud</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  if (!data || !data.words || data.words.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Info size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">No word frequency data available</p>
        </div>
      </div>
    );
  }

  const treeMapData = {
    name: 'Words',
    children: data.words.map(({ word, frequency }) => ({
      name: word,
      value: frequency
    }))
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Word Frequency Analysis
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treeMapData}
              dataKey="value"
              aspectRatio={4 / 3}
              stroke="#fff"
              content={<CustomizedContent />}
            />
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Most frequently occurring words in the selected hymn. Size indicates frequency.
          </p>
        </div>
      </div>

      {/* Word List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Top Words
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.words.slice(0, 15).map(({ word, frequency }, index) => (
            <div
              key={word}
              className="flex justify-between items-center p-3 rounded-lg bg-gray-50"
            >
              <span className="font-medium text-gray-700">{word}</span>
              <span className="text-sm text-gray-500">{frequency}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordCloudTab;