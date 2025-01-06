import React, { createContext, useContext, useState } from 'react';

const VedaContext = createContext(null);

export const VedaProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    loading,
    error,
    setLoading,
    setError
  };

  return <VedaContext.Provider value={value}>{children}</VedaContext.Provider>;
};

export const useVeda = () => {
  const context = useContext(VedaContext);
  if (!context) {
    throw new Error('useVeda must be used within a VedaProvider');
  }
  return context;
};