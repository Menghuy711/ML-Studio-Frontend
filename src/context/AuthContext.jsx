import { createContext, useState, useEffect } from 'react';
import account from '../data/account';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Restore session from local storage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = (username, password) => {
    const validUser =
      username.trim().toLowerCase() === account.username.toLowerCase() &&
      password === account.password;

    if (!validUser) {
      return { success: false, error: 'Invalid username or password.' };
    }

    const user = {
      username: account.username,
      name: account.name,
      email: account.email,
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoggedIn: !!currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}