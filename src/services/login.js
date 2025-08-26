import { apiClient } from "./config"

// service for Admin login
export const adminLogin = async(payload)=>{
  return apiClient.post("/login-attendee", payload);
}