import React, { useState, useEffect } from 'react';
import { Info, ChevronDown, ChevronRight } from 'lucide-react';
import { fetchThematicAnalysis } from '../../services/api';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const RelationshipsTab = ({ mandala, hymn }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTheme, setExpandedTheme] = useState(null);

  useEffect(() => {
    if (mandala && hymn) {
      loadAnalysis();
    }
  }, [mandala, hymn]);

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const result = await fetchThematicAnalysis(mandala, hymn);
      setAnalysis(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching thematic analysis:', err);
      setError('Failed to load analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = (themeId) => {
    setExpandedTheme(expandedTheme === themeId ? null : themeId);
  };

  if (!mandala || !hymn) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Info size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Please select a mandala and hymn to view relationships</p>
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

  if (!analysis) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Info size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">No analysis data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Theme Analysis Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Thematic Relationships
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysis.themes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="theme" />
              <YAxis />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 shadow-lg rounded-lg border">
                        <p className="font-medium">{payload[0].payload.theme}</p>
                        <p className="text-sm text-gray-600">
                          Strength: {payload[0].value}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {payload[0].payload.description}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar 
                dataKey="strength" 
                fill="#2196F3" 
                name="Theme Strength"
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Distribution of major themes and their relative strengths in the hymn.
          </p>
        </div>
      </div>

      {/* Theme Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Theme Details
        </h3>
        <div className="space-y-4">
          {analysis.themes.map((theme) => (
            <div key={theme.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleTheme(theme.id)}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.color || '#2196F3' }}
                  />
                  <span className="font-medium text-gray-800">{theme.theme}</span>
                  <span className="text-sm text-gray-500">
                    ({theme.strength.toFixed(1)}% strength)
                  </span>
                </div>
                {expandedTheme === theme.id ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </button>
              
              {expandedTheme === theme.id && (
                <div className="p-4 space-y-4">
                  <p className="text-gray-600">
                    {theme.description}
                  </p>
                  {theme.relatedVerses && theme.relatedVerses.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Related Verses
                      </h4>
                      <div className="space-y-2">
                        {theme.relatedVerses.map((verse) => (
                          <div 
                            key={verse.id} 
                            className="p-3 bg-gray-50 rounded text-sm text-gray-600"
                          >
                            {verse.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {theme.connections && theme.connections.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Thematic Connections
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {theme.connections.map((connection, index) => (
                          <div 
                            key={index}
                            className="p-2 bg-blue-50 rounded-lg text-sm text-blue-600"
                          >
                            {connection}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelationshipsTab;