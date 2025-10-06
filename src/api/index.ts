import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderPayload } from '../types'; 

// Helper function jo har API call ko log karegi
const logApiCall = (endpoint: string) => {
  console.log(`API ===>>> ${endpoint} Fetched`);
};

// Backend ka base URL
const API = axios.create({
  baseURL: 'http://192.168.1.7:5050/api',
  timeout: 10000,
});

// Interceptor to attach JWT automatically
API.interceptors.request.use(async config => {
  // Har request ke saath token automatically attach ho jayega
  const token = await AsyncStorage.getItem('token');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- AUTH APIs ---
export const login = (email: string, password: string) => {
  logApiCall('/auth/login');
  return API.post('/auth/login', { email, password });
};

export const register = (name: string, email: string, password: string, role: string) => {
  logApiCall('/auth/register');
  return API.post('/auth/register', { name, email, password, role });
};

// --- EVENT APIs ---
export const fetchEvents = () => {
  logApiCall('/events');
  return API.get('/events');
};

export const fetchEventById = (id: string) => {
  logApiCall(`/events/${id}`);
  return API.get(`/events/${id}`);
};

export const addVendorToEvent = (eventId: string, vendorId: string) => {
  logApiCall(`/events/${eventId}/vendors`);
  return API.post(`/events/${eventId}/vendors`, { vendorId });
};

// --- MENU APIs ---
export const fetchMenusByEvent = (eventId: string) => {
  logApiCall(`/menus/event/${eventId}`);
  return API.get(`/menus/event/${eventId}`);
};

export const fetchMenuById = (menuId: string) => {
  logApiCall(`/menus/${menuId}`);
  return API.get(`/menus/${menuId}`);
};

// --- ORDER APIs ---
export const createOrder = (payload: OrderPayload) => {
  logApiCall('/orders');
  return API.post('/orders', payload);
};

export const fetchOrderById = (id: string) => {
  logApiCall(`/orders/${id}`);
  return API.get(`/orders/${id}`).then(res => res.data); 
};

export const markOrderAsPaid = (orderId: string, paymentIntentId: string) => {
  logApiCall(`/orders/${orderId}/pay`);
  return API.post(`/orders/${orderId}/pay`, { paymentIntentId });
};


export const verifyQr = (orderId: string, token: string) => {
  logApiCall(`/orders/${orderId}/verify-qr`);
  return API.post(`/orders/${orderId}/verify-qr`, { token });
};

// --- PAYMENT APIs ---
export const createPaymentIntent = (amount: number, currency = 'usd') => {
  logApiCall('/payments/create-intent');
  return API.post('/payments/create-intent', { amount, currency });
};

// --- ANALYTICS APIs ---
export const fetchEventAnalytics = (eventId: string) => {
  logApiCall(`/analytics/event/${eventId}`);
  return API.get(`/analytics/event/${eventId}`);
};

// --- VENDOR APIs ---
export const fetchPopularVendors = () => {
  logApiCall('/vendors?sort=popular');
  return API.get('/vendors?sort=popular');
};

export default API;