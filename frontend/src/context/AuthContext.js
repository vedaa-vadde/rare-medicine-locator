import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    const { data } = await loginUser({ email, password });
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    setLoading(false);
    return data;
  };

  const register = async (formData) => {
    setLoading(true);
    const { data } = await registerUser(formData);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    setLoading(false);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
