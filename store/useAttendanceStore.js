import { create } from "zustand";
import {
  getAllAttendance,
  getAllAttendee,
  postAttendanceIn,
  postAttendanceOut,
  createAttendee,
} from "../src/services/attendance";

const useAttendanceStore = create((set, get) => ({
  attendances: [], // All attendance records
  attendees: [], // All attendee records
  loading: false,
  error: null,
  successMessage: null,

  // Fetch all attendance records with optional force reload
  fetchAllAttendance: async (force = false) => {
    const { attendances } = get();

    if (!force && attendances.length > 0) {
      // Skip fetching if not forced and data already loaded
      return;
    }

    set({ loading: true, error: null, successMessage: null });
    try {
      const res = await getAllAttendance();
      set({ attendances: res.data.attendance.reverse() });
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Fetch all attendees with optional force reload
  fetchAllAttendees: async (force = false) => {
    const { attendees } = get();

    if (!force && attendees.length > 0) {
      return;
    }

    set({ loading: true, error: null, successMessage: null });
    try {
      const res = await getAllAttendee();
      set({ attendees: res.data.attendance.reverse() });
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  checkInAttendance: async (formData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const res = await postAttendanceIn(formData);

      // Assuming backend returns the new record
      const newRecord = res.data.attendance;

      // Instantly update store
      set((state) => ({
        successMessage: "Check-in successful.",
        attendances: [newRecord, ...state.attendances], // newest first
      }));

      // Background sync
      get().fetchAllAttendance(true);
    } catch (error) {
      set({
        error: error.response?.data?.message || "Check-in failed.",
      });
    } finally {
      set({ loading: false });
    }
  },

  checkOutAttendance: async (staffID) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const res = await postAttendanceOut({ ID: staffID });

      // Assuming backend returns updated record
      const updatedRecord = res.data.attendance;

      // Instantly update matching record
      set((state) => ({
        successMessage: "Check-out successful.",
        attendances: state.attendances.map((att) =>
          att._id === updatedRecord._id ? updatedRecord : att
        ),
      }));

      // Background sync
      get().fetchAllAttendance(true);
    } catch (error) {
      set({
        error: error.response?.data?.message || "Check-out failed.",
      });
    } finally {
      set({ loading: false });
    }
  },

  // Register a new attendee
  registerAttendee: async (payload) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await createAttendee(payload);
      set({ successMessage: "Attendee registered successfully." });
      // Force refresh attendee list after registration
      await get().fetchAllAttendees(true);
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to register attendee.",
      });
    } finally {
      set({ loading: false });
    }
  },

  // Reset error/success messages
  resetStatus: () => {
    set({ error: null, successMessage: null });
  },
}));


export default useAttendanceStore;
