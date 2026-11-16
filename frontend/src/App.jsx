import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProblemSolver from './components/solver/ProblemSolver';

const App = () => {
  const { token } = useContext(AuthContext);

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/contest/:id"
        element={
          <PrivateRoute>
            <ProblemSolver />
          </PrivateRoute>
        }
      />
      <Route
        path="/problem/:id"
        element={
          <PrivateRoute>
            <ProblemSolver />
          </PrivateRoute>
        }
      />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
