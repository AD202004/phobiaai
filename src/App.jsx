import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import PatientDashboard from './pages/PatientDashboard.jsx'
import TherapistDashboard from './pages/TherapistDashboard.jsx'
import TestDashboard from './pages/TestDashboard.jsx'
import { AuthProvider, useAuth } from './auth/AuthContext.jsx'

function PrivateRoute({ children, roles }) {
  const { user, role, loading } = useAuth()
  if (loading) return <div className="p-8">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && role && !roles.includes(role)) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Test route - no auth required */}
        <Route path="/test" element={<TestDashboard />} />

        <Route
          path="/dashboard/patient"
          element={
            <PrivateRoute roles={["patient"]}>
              <PatientDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/therapist"
          element={
            <PrivateRoute roles={["therapist"]}>
              <TherapistDashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
  

/*import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import SignUp from './/./pages/signup';
import PatientDashboard from './/pages/PatientDashboard';
import TherapistDashboard from './/pages/TherapistDashboard';
import ProtectedRoute from './/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        
        <Route 
          path="/dashboard/patient" 
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/therapist" 
          element={
            <ProtectedRoute allowedRole="therapist">
              <TherapistDashboard />
            </ProtectedRoute>
          } 
        />
        
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
/*
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './/pages/login';
import SignUp from './/pages/signup';
import PatientDashboard from './/pages/PatientDashboard';
import TherapistDashboard from './/pages/TherapistDashboard';
import ProtectedRoute from './/ProtectedRoute';

function App() {
  return (
    <Routes>
      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      
      <Route 
        path="/dashboard/patient" 
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/therapist" 
        element={
          <ProtectedRoute allowedRole="therapist">
            <TherapistDashboard />
          </ProtectedRoute>
        } 
      />
      
      
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

*/
