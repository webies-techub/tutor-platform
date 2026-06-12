import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import TutorDirectory from './pages/TutorDirectory';
import TutorProfilePage from './pages/TutorProfile';
import Pricing from './pages/Pricing';
import BecomeATutor from './pages/BecomeATutor';
import Login from './pages/Login';
import Register from './pages/Register';
import SimulatedCheckout from './pages/SimulatedCheckout';
import GroupClasses from './pages/GroupClasses';

import StudentOverview from './pages/student/Overview';
import MyCourses from './pages/student/MyCourses';
import WatchLesson from './pages/student/WatchLesson';
import MyBookings from './pages/student/MyBookings';
import MySessions from './pages/student/MySessions';

import TutorOverview from './pages/tutor/Overview';
import TutorBookings from './pages/tutor/Bookings';
import TutorGroupSessions from './pages/tutor/GroupSessions';
import TutorProfile from './pages/tutor/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/tutors" element={<TutorDirectory />} />
          <Route path="/tutors/:id" element={<TutorProfilePage />} />
          <Route path="/group-classes" element={<GroupClasses />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/become-a-tutor" element={<BecomeATutor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Checkout */}
          <Route
            path="/checkout/:courseId"
            element={
              <ProtectedRoute role="student">
                <SimulatedCheckout />
              </ProtectedRoute>
            }
          />

          {/* Student Dashboard */}
          <Route path="/student" element={<ProtectedRoute role="student" />}>
            <Route path="overview" element={<StudentOverview />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="watch/:lessonId" element={<WatchLesson />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="my-sessions" element={<MySessions />} />
          </Route>

          {/* Tutor Dashboard */}
          <Route path="/tutor" element={<ProtectedRoute role="tutor" />}>
            <Route path="overview" element={<TutorOverview />} />
            <Route path="bookings" element={<TutorBookings />} />
            <Route path="group-sessions" element={<TutorGroupSessions />} />
            <Route path="profile" element={<TutorProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
