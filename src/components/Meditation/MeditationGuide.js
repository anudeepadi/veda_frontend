import React, { useState, useEffect } from 'react';
import { useMeditationGuide } from '../../hooks/useApi';
import { Card } from '../Common/Card';
import { Spinner } from '../Common/Spinner';
import { ErrorAlert } from '../Common/ErrorAlert';

const MeditationGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(null);
  const { data: meditation, loading, error } = useMeditationGuide();

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!meditation) return null;

  const handleStart = () => {
    setIsPlaying(true);
    const intervalId = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= meditation.steps.length - 1) {
          clearInterval(intervalId);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, meditation.stepDuration * 1000);
    setTimer(intervalId);
  };

  const handlePause = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsPlaying(false);
  };

  const handleReset = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const currentMeditationStep = meditation.steps[currentStep];
  const progress = ((currentStep + 1) / meditation.steps.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            {meditation.title}
          </h2>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Step {currentStep + 1} of {meditation.steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current Step */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              {currentMeditationStep.title}
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {currentMeditationStep.instruction}
            </p>
            {currentMeditationStep.mantra && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                <p className="text-lg font-sanskrit text-indigo-900">
                  {currentMeditationStep.mantra}
                </p>
                {currentMeditationStep.mantraMeaning && (
                  <p className="mt-2 text-sm text-indigo-600">
                    {currentMeditationStep.mantraMeaning}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!isPlaying ? (
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {currentStep === 0 ? 'Start Meditation' : 'Resume'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Pause
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>

          {/* Tips */}
          {meditation.tips && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Meditation Tips</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {meditation.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MeditationGuide;