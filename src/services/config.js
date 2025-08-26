import axios from "axios"
//get the base url from the enf file
const baseURL = import.meta.env.VITE_BASE_URL

//create an axios instance

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});