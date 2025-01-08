import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { VedaProvider } from './context/VedaContext';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/Common/ErrorBoundary';
import './App.css';

// Create a client for react-query
const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <VedaProvider>
          <Layout />
        </VedaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;