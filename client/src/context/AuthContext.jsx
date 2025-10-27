import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  // 3. Get user from localStorage (for persistence)
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('worktrackr-user')) || null
  );

  // 4. Create login/logout functions

  // Call this when user logs in successfully
  const login = (userData) => {
    localStorage.setItem('worktrackr-user', JSON.stringify(userData));
    setUser(userData);
  };

  // Call this to log the user out
  const logout = () => {
    localStorage.removeItem('worktrackr-user');
    setUser(null);
  };

  // 5. Provide the user and functions to the app
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6. Create a custom hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};