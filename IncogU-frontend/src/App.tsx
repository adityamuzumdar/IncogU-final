import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Auth/Signup';
import VerifyEmail from './pages/Auth/Verify';
import CompleteSignup from './pages/Auth/CompleteSignup';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import { AuthProvider } from './AuthProvider';
import ProtectedRoute from './ProtectedRoute';
import Post from './pages/Post';
import Header from './components/Header';
import University from './pages/University';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/complete-signup" element={<CompleteSignup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/post/:id"
              element={
                <ProtectedRoute>
                  <Post />
                </ProtectedRoute>
              }
            />
            <Route
              path="/university"
              element={
                <ProtectedRoute>
                  <University/>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;