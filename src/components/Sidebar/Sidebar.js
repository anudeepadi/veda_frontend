import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { safeApis } from '../../services/api';
import { Spinner } from '../Common/Spinner';

const Sidebar = () => {
  const navigate = useNavigate();
  const [selectedMandala, setSelectedMandala] = useState('');
  const [selectedHymn, setSelectedHymn] = useState('');
  const [hymns, setHymns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Array of mandala numbers (1-10 for Rig Veda)
  const mandalas = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchHymns = async () => {
      if (selectedMandala) {
        try {
          setLoading(true);
          setError(null);
          const hymnsData = await safeApis.getAllHymns(selectedMandala);
          setHymns(hymnsData);
          setSelectedHymn('');
        } catch (error) {
          console.error('Error fetching hymns:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHymns();
  }, [selectedMandala]);

  const handleMandalaChange = (e) => {
    const mandala = e.target.value;
    setSelectedMandala(mandala);
    setSelectedHymn('');
    setError(null);
  };

  const handleHymnChange = (e) => {
    const hymn = e.target.value;
    setSelectedHymn(hymn);
    if (selectedMandala && hymn) {
      navigate(`/hymn/${selectedMandala}/${hymn}`);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Veda Explorer</h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Mandala Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Mandala
          </label>
          <select
            value={selectedMandala}
            onChange={handleMandalaChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Choose a Mandala</option>
            {mandalas.map((num) => (
              <option key={num} value={num}>
                Mandala {num}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {/* Hymn Selection */}
        {selectedMandala && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Hymn
            </label>
            {loading ? (
              <Spinner />
            ) : (
              <select
                value={selectedHymn}
                onChange={handleHymnChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Choose a Hymn</option>
                {Array.isArray(hymns) && hymns.map((hymn) => (
                  <option key={hymn.number} value={hymn.number}>
                    Hymn {hymn.number}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Navigation Links */}
        <nav className="mt-8">
          <div className="space-y-1">
            <button
              onClick={() => navigate('/')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/meditation')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
            >
              Meditation Guide
            </button>
          </div>
        </nav>
      </div>

      {/* Version Info */}
      <div className="mt-auto p-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">Version 0.1.0</p>
      </div>
    </div>
  );
};

export default Sidebar;