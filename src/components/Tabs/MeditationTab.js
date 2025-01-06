import React, { useState, useEffect } from 'react';
import { PlayCircle, PauseCircle, Settings } from 'lucide-react';
import { generateMeditation } from '../../services/api';

const MeditationTab = ({ mandala, hymn }) => {
  const [meditation, setMeditation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(10);
  const [showSettings, setShowSettings] = useState(false);
  const [focus, setFocus] = useState('peace');
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (mandala && hymn) {
      loadMeditation();
    }
  }, [mandala, hymn]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((time) => {
          if (time >= duration * 60) {
            setIsPlaying(false);
            return 0;
          }
          return time + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const loadMeditation = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateMeditation({
        mandala,
        hymn,
        duration,
        focus
      });
      setMeditation(result);
    } catch (error) {
      console.error('Error generating meditation:', error);
      setError('Failed to generate meditation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (currentTime >= duration * 60) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    setCurrentTime(0);
    loadMeditation();
  };

  const handleFocusChange = (newFocus) => {
    setFocus(newFocus);
    setCurrentTime(0);
    loadMeditation();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mandala || !hymn) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please select a mandala and hymn to generate a meditation.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Guided Meditation</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Settings className="text-gray-600" size={20} />
        </button>
      </div>

      {showSettings && (
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <select
              value={duration}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={20}>20 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Focus
            </label>
            <select
              value={focus}
              onChange={(e) => handleFocusChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="peace">Peace</option>
              <option value="wisdom">Wisdom</option>
              <option value="energy">Energy</option>
              <option value="healing">Healing</option>
            </select>
          </div>
        </div>
      )}

      {meditation && (
        <div className="bg-white rounded-lg shadow-sm">
          {/* Meditation Player */}
          <div className="p-6 space-y-6">
            <div className="flex justify-center">
              <button
                onClick={togglePlay}
                className="p-4 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isPlaying ? (
                  <PauseCircle className="w-16 h-16 text-blue-500" />
                ) : (
                  <PlayCircle className="w-16 h-16 text-blue-500" />
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000"
                  style={{ width: `${(currentTime / (duration * 60)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration * 60)}</span>
              </div>
            </div>

            {/* Meditation Text */}
            <div className="prose max-w-none">
              <h3 className="text-xl font-medium text-gray-800 mb-4">
                {meditation.title}
              </h3>
              <div className="text-gray-600 space-y-4">
                {meditation.instructions.map((instruction, index) => (
                  <p key={index}>{instruction}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeditationTab;