import { apiClient } from "./config";

// Get all attendance records
export const getAllAttendance = async () => {
  return apiClient.get("/attendance");
};

// get todays Attendance
export const getTodayAttendance = async()=>{
  return apiClient.get("/attendance-today");
}

// Get all Attendee records
export const getAllAttendee = async () =>{
    return apiClient.get("/attendee");
} 
// Post check-in attendance
export const postAttendanceIn = async (formData) => {
  return  apiClient.post("/attendance", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// Post check-out attendance
export const postAttendanceOut = async (payload) => {
  return apiClient.post("/attendance-out", payload);
};
// Register a new attendee
export const createAttendee = async (payload) => {
  return apiClient.post('/attendee', payload);
};
