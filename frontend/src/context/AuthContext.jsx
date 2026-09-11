import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("expense_user")) || null;
    } catch {
      return null;
    }
  });

  const loginUser = (data) => {
    localStorage.setItem("expense_token", data.token);
    localStorage.setItem("expense_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("expense_token");
    localStorage.removeItem("expense_user");
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user && !!localStorage.getItem("expense_token"),
    loginUser,
    logout,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
