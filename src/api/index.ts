// src/api/index.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
  timeout: 5000,
});

// request interceptor: attach token automatically
API.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth APIs
export const login = (email: string, password: string) =>
  API.post('/auth/login', { email, password });

export const register = (name: string, email: string, password: string) =>
  API.post('/auth/register', { name, email, password });

// Event APIs
export const fetchEvents = () => API.get('/events');
export const fetchEventById = (id: string) => API.get(`/events/${id}`);

// Menu APIs
export const fetchMenusByEvent = (eventId: string) =>
  API.get(`/menus/event/${eventId}`);

// Order APIs
export const createOrder = (payload: any) => API.post('/orders', payload);
export const fetchOrderById = (id: string) => API.get(`/orders/${id}`);
export const verifyQr = (orderId: string, token: string) =>
  API.post(`/orders/${orderId}/verify-qr`, { token });

export default API;
