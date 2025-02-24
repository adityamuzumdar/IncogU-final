import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Auth/Signup';
import VerifyEmail from './pages/Auth/Verify';
import CompleteSignup from './pages/Auth/CompleteSignup';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import { AuthProvider } from './AuthProvider';
import ProtectedRoute from './ProtectedRoute';
import Post from './pages/Post';

const App = () => {
  return (
    <AuthProvider>
      <Router>
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
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;