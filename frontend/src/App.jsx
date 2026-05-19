import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Global contexts
import { AuthProvider } from './context/AuthContext.jsx';
import { ApplicationProvider } from './context/ApplicationContext.jsx';

// Shared Components
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Exactly 4 Pages
import UserLogin from './pages/UserLogin.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

function App() {
  return (
    <AuthProvider>
      <ApplicationProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<UserLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Logged Customer Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<UserDashboard />} />
                </Route>

                {/* Administrator Protected Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Routes>
            </main>
          </div>
        </Router>
      </ApplicationProvider>
    </AuthProvider>
  );
}

export default App;
