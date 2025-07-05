import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ChatBot } from './components/chat/ChatBot';
import { HomePage } from './pages/HomePage';
import { PropertyListingsPage } from './pages/PropertyListingsPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { AgentDashboardPage } from './pages/AgentDashboardPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/properties" element={<PropertyListingsPage />} />
                  <Route path="/properties/:id" element={<PropertyDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/agent/dashboard"
                    element={
                      <ProtectedRoute role="agent">
                        <AgentDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/buyer/dashboard"
                    element={
                      <ProtectedRoute role="buyer">
                        <BuyerDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <ChatBot />
            </div>
          </Router>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;