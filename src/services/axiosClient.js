import axios from 'axios';

// Update port to 8080 to match FastAPI server
export const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});