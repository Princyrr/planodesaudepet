import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PetProvider } from './contexts/PetContext';
import { AppointmentProvider } from './contexts/AppointmentContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AppointmentScheduling from './pages/AppointmentScheduling';
import SubscriptionManagement from './pages/SubscriptionManagement';
import PetProfile from './pages/PetProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PetProvider>
          <SubscriptionProvider>
            <AppointmentProvider>
              <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/schedule-appointment" element={
                      <ProtectedRoute>
                        <AppointmentScheduling />
                      </ProtectedRoute>
                    } />
                    <Route path="/subscription" element={
                      <ProtectedRoute>
                        <SubscriptionManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/pet-profile" element={
                      <ProtectedRoute>
                        <PetProfile />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
                <Footer />
              </div>
            </AppointmentProvider>
          </SubscriptionProvider>
        </PetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;