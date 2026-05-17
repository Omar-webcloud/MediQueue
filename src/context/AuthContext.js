"use client";

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // We are currently mocking the Google auth initialization.
  // In a real application, you would configure Firebase here.

  useEffect(() => {
    // Check if user is stored in localStorage to persist login
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to login");
      
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token); // Store token for future requests
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, photo) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, photo }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to register");
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async () => {
    // Mocking Firebase popup response
    try {
      // Assuming successful Firebase Google Auth returns this:
      const mockGoogleUser = {
        name: "Google User",
        email: "googleuser@example.com",
        photo: "https://via.placeholder.com/150",
        googleId: "google-123456"
      };

      const res = await fetch(`${API_URL}/api/auth/googleAuth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockGoogleUser),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to authenticate with Google");
      
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
