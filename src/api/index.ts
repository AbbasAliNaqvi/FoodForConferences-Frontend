// /api/index.ts (FINAL CORRECTED VERSION)

import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import all necessary types for explicit typing
import { 
  OrderPayload, 
  Order, 
  PaymentIntentResponse, 
  ApiResponse, 
  Event, 
  MenuItem, 
  EventAnalytics, 
  Vendor 
} from '../types'; 

// Helper function to log API calls cleanly
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
  const token = await AsyncStorage.getItem('token');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- AUTH APIs ---
export const login = (email: string, password: string): Promise<AxiosResponse<any>> => {
  logApiCall('/auth/login');
  return API.post('/auth/login', { email, password });
};

export const register = (name: string, email: string, password: string, role: string): Promise<AxiosResponse<any>> => {
  logApiCall('/auth/register');
  return API.post('/auth/register', { name, email, password, role });
};

// --- EVENT APIs ---
export const fetchEvents = (): Promise<AxiosResponse<ApiResponse<Event[]>>> => {
  logApiCall('/events');
  return API.get('/events');
};

export const fetchEventById = (id: string): Promise<AxiosResponse<ApiResponse<Event>>> => {
  logApiCall(`/events/${id}`);
  return API.get(`/events/${id}`);
};

export const addVendorToEvent = (eventId: string, vendorId: string): Promise<AxiosResponse<ApiResponse<Event>>> => {
  logApiCall(`/events/${eventId}/vendors`);
  return API.post(`/events/${eventId}/vendors`, { vendorId });
};

// --- MENU APIs ---
export const fetchMenusByEvent = (eventId: string): Promise<AxiosResponse<ApiResponse<MenuItem[]>>> => {
  logApiCall(`/menus/event/${eventId}`);
  return API.get(`/menus/event/${eventId}`);
};

export const fetchMenuById = (menuId: string): Promise<AxiosResponse<ApiResponse<MenuItem>>> => {
  logApiCall(`/menus/${menuId}`);
  return API.get(`/menus/${menuId}`);
};

// --- ORDER APIs ---
export const createOrder = (payload: OrderPayload): Promise<AxiosResponse<ApiResponse<Order>>> => {
  logApiCall('/orders');
  return API.post('/orders', payload);
};

/**
 * CRITICAL FIX: Returns the raw data object (Promise<Order>) because the 
 * consuming screens (like OrderDetails) expect the plain data, not the full Axios wrapper.
 */
export const fetchOrderById = (id: string): Promise<Order> => {
  logApiCall(`/orders/${id}`);
  return API.get<Order>(`/orders/${id}`).then(res => res.data); 
};

export const markOrderAsPaid = (orderId: string, paymentIntentId: string): Promise<AxiosResponse<ApiResponse<Order>>> => {
  logApiCall(`/orders/${orderId}/pay`);
  return API.post(`/orders/${orderId}/pay`, { paymentIntentId });
};

// Generic response for verification endpoint
export const verifyQr = (orderId: string, token: string): Promise<AxiosResponse<ApiResponse<any>>> => {
  logApiCall(`/orders/${orderId}/verify-qr`);
  return API.post(`/orders/${orderId}/verify-qr`, { token });
};

// --- PAYMENT APIs ---
// Explicitly typing the Payment Intent response
export const createPaymentIntent = (amount: number, currency = 'usd'): Promise<AxiosResponse<ApiResponse<PaymentIntentResponse>>> => {
  logApiCall('/payments/create-intent');
  return API.post('/payments/create-intent', { amount, currency });
};

// --- ANALYTICS APIs ---
export const fetchEventAnalytics = (eventId: string): Promise<AxiosResponse<ApiResponse<EventAnalytics>>> => {
  logApiCall(`/analytics/event/${eventId}`);
  return API.get(`/analytics/event/${eventId}`);
};

// --- VENDOR APIs ---
export const fetchPopularVendors = (): Promise<AxiosResponse<ApiResponse<Vendor[]>>> => {
  logApiCall('/vendors?sort=popular');
  return API.get('/vendors?sort=popular');
};

export default API;