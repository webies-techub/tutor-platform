import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import LessonUpload from './pages/LessonUpload';
import Users from './pages/Users';
import Tutors from './pages/Tutors';
import Bookings from './pages/Bookings';
import GroupSessions from './pages/GroupSessions';
import Payments from './pages/Payments';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId/lessons" element={<LessonUpload />} />
            <Route path="/users" element={<Users />} />
            <Route path="/tutors" element={<Tutors />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/group-sessions" element={<GroupSessions />} />
            <Route path="/payments" element={<Payments />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
