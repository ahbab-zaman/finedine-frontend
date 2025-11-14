import { create } from "zustand";
import axios from "axios";

export const useMenuStore = create((set) => ({
  menus: [],
  loading: false,

  fetchMenus: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("http://localhost:5000/api/menus");
      console.log(res.data.data)

      // Axios puts the response body in res.data
      set({
        menus: Array.isArray(res.data.data) ? res.data.data : [],
        loading: false,
      });
    } catch (error) {
      console.log("Menu fetch error:", error);
      set({ loading: false });
    }
  },
}));
