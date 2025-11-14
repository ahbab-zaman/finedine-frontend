import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  isLoading: true, // start loading until we verify auth
  setLoading: (loading) => set({ isLoading: loading }),

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  async initializeAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      if (result.success) {
        set({ user: result.user, token });
      } else {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      }
    } catch (err) {
      console.error("Auth restore failed:", err);
      localStorage.removeItem("token");
      set({ user: null, token: null });
    } finally {
      set({ isLoading: false });
    }
  },

  async register(data) {
    const { setLoading, setAuth } = get();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
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
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const result = await res.json();
      setLoading(false);
      if (result.success) setAuth(result.user, result.token);
      return result;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  },

  isAuthenticated: () => !!get().token && !!get().user,
}));
