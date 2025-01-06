import React, { useState, useEffect } from 'react';
import { getHymnDetails } from '../../services/api';
import { Info, BookOpen, MessageSquare, BarChart as BarChartIcon } from 'lucide-react';
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart
} from 'recharts';




const COLORS = ['#2196F3', '#4CAF50', '#FFC107', '#F44336', '#9C27B0'];

const AnalysisTab = ({ mandala, hymn }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    if (mandala && hymn) {
      loadAnalysis();
    }
  }, [mandala, hymn]);

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const result = await getHymnDetails(mandala, hymn);
      setAnalysis(result);
      setError(null);
    } catch (err) {
      console.error('Error loading analysis:', err);
      setError('Failed to load analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTabs = () => (
    <div className="flex space-x-4 border-b border-gray-200 mb-6">
      {[
        { id: 'summary', icon: BarChartIcon, label: 'Summary' },
        { id: 'linguistics', icon: MessageSquare, label: 'Linguistic Analysis' },
        { id: 'contextual', icon: BookOpen, label: 'Contextual Analysis' }
      ].map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`
            flex items-center px-4 py-2 border-b-2 text-sm font-medium
            ${activeTab === id 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          `}
        >
          <Icon size={18} className="mr-2" />
          {label}
        </button>
      ))}
    </div>
  );

  if (!mandala || !hymn) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Info size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Please select a mandala and hymn to view analysis</p>
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
    <div>
      {renderTabs()}

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Overview</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Verses</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {analysis.verses.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Primary Themes</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {analysis.themes.map((theme, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm"
                    >
                      {theme.name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sentiment Distribution</p>
                <div className="h-48 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.sentimentDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        label
                      >
                        {analysis.sentimentDistribution.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Key Metrics
            </h4>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500">Verse Length Distribution</p>
                <div className="h-48 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={analysis.verseLengths}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="value" 
                        fill="#2196F3" 
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Complexity Score</p>
                <div className="mt-2">
                  <div 
                    className="h-2 bg-gray-200 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, #2196F3 ${analysis.complexityScore}%, transparent ${analysis.complexityScore}%)`
                    }}
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Simple</span>
                    <span>Complex</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Word Frequency Analysis
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={analysis.wordFrequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="word" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="frequency" 
                    fill="#2196F3" 
                    radius={[4, 4, 0, 0]} 
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'linguistics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Linguistic Analysis
            </h4>
            <div className="space-y-6">
              {analysis.linguistics.map((section, index) => (
                <div key={index} className="space-y-4">
                  <h5 className="font-medium text-gray-700">{section.title}</h5>
                  <p className="text-gray-600">{section.content}</p>
                  {section.examples && (
                    <div className="space-y-2">
                      {section.examples.map((example, i) => (
                        <div
                          key={i}
                          className="p-3 bg-gray-50 rounded text-sm text-gray-600"
                        >
                          {example}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contextual' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Historical Context
            </h4>
            <div className="prose max-w-none">
              {analysis.contextual.historical.map((section, index) => (
                <div key={index} className="mb-6">
                  <h5 className="text-gray-800 font-medium mb-2">
                    {section.title}
                  </h5>
                  <p className="text-gray-600">{section.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Cultural References
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.contextual.cultural.map((reference, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <h6 className="font-medium text-gray-700 mb-2">
                    {reference.term}
                  </h6>
                  <p className="text-sm text-gray-600">
                    {reference.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Related References
            </h4>
            <div className="space-y-4">
              {analysis.contextual.references.map((ref, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-700">{ref.source}</p>
                    <p className="text-sm text-gray-600 mt-1">{ref.context}</p>
                    {ref.verses && (
                      <div className="mt-2 text-sm text-gray-500">
                        {ref.verses.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisTab;