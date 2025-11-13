import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
  // Actions
  async sendOTP(phone) {
    const { setLoading } = get();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  },
  async verifyOTP(phone, otp) {
    const { setLoading, setAuth } = get();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) setAuth(data.user, data.token);
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  },
  async register(data) {
    const { setLoading, setAuth } = get();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setLoading(false);
      if (result.success) setAuth(result.user, result.token);
      return result;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  },
  async login(email, password) {
    const { setLoading, setAuth } = get();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      setLoading(false);
      if (result.success) setAuth(result.user, result.token);
      return result;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  },
}));
