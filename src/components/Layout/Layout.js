import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useVeda } from '../../context/VedaContext';
import HymnViewer from '../HymnViewer/HymnViewer';
import Sidebar from '../Sidebar/Sidebar';
import MeditationGuide from '../Meditation/MeditationGuide';
import { Spinner } from '../Common/Spinner';
import { ErrorAlert } from '../Common/ErrorAlert';

const Layout = () => {
  const { loading, error } = useVeda();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorAlert message={error} />
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      Welcome to Veda Explorer
                    </h1>
                    <p className="text-lg text-gray-600">
                      Select a Mandala and Hymn from the sidebar to begin exploring.
                    </p>
                  </div>
                }
              />
              <Route path="/hymn/:mandala/:hymn" element={<HymnViewer />} />
              <Route path="/meditation" element={<MeditationGuide />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;