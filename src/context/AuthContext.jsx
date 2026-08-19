import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import account from '../data/account';

// oxlint-disable-next-line react/only-export-components
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

  const login = useCallback((username, password) => {
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
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({ currentUser, isLoggedIn: !!currentUser, login, logout }),
    [currentUser, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}