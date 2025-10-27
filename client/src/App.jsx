import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Header /> {}
      <div className="container" style={{ padding: '2rem' }}>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute> {}
                <Dashboard />
              </ProtectedRoute>
              } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
