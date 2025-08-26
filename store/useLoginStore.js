// store/useLoginStore.js
import { create } from "zustand";
import { adminLogin } from "../src/services/login";
import { persist } from "zustand/middleware";

const useLoginStore = create(
  persist((set) => ({
    user: null,
    loading: false,
    error: null,
    successMessage: null,

    // Login action
    loginUser: async (fullName, ID) => {
      set({ loading: true, error: null, successMessage: null });
      try {
        const payload = { fullName, ID };
        const response = await adminLogin(payload);

        set({
          user: response.data, // store returned user data
          loading: false,
          successMessage: "Login successful.",
        });

        return response.data; // return user for further checks
      } catch (err) {
        set({
          error:
            err.response?.data?.message || "Login failed. Please try again.",
          loading: false,
        });
        return null;
      }
    },

    // Logout action
    logoutUser: () => {
      set({
        user: null,
        successMessage: "Logged out successfully.",
      });
    },
  })),
  {
    name: "login-storage", // localStorage key
    getStorage: () => localStorage,
  }
);

export default useLoginStore;
