// --------------------------------------
// 👤 USER TYPES
// --------------------------------------
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "attendee" | "organizer" | "vendor" | "staff" | "admin";
  dietaryPreferences?: string[];
  allergies?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// --------------------------------------
// 🏛️ VENUE
// --------------------------------------
export interface Venue {
  name: string;
  address: string;
  capacity?: number;
}

// --------------------------------------
// 🕒 MEAL SLOT
// --------------------------------------
export interface MealSlot {
  id: string;
  name: string; // "Breakfast", "Lunch", "Dinner"
  startTime: string; // ISO string
  endTime: string;   // ISO string
}

// --------------------------------------
// 🎟️ EVENT
// --------------------------------------
export interface Event {
  _id: string;
  title: string;
  description: string;
  venue: Venue;
  startDate: string;
  endDate: string;
  mealSlots: MealSlot[];
  vendorIds: string[];
  imageUrl?: string;
  organizerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --------------------------------------
// 🧑‍🍳 VENDOR
// --------------------------------------
export interface Vendor {
  _id: string;
  name: string;
  cuisine?: string; // e.g., 'Italian', 'Vegan'
  logoUrl?: string;
  rating: number;
  menuItems?: MenuItem[];
  description?: string;
}

// --------------------------------------
// 🍽️ MENU ITEM
// --------------------------------------
export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  vendorId: string;
  eventId: string;
}

// --------------------------------------
// 🧾 ORDER
// --------------------------------------
export interface Order {
  _id: string;
  userId: string;
  eventId: string;
  vendorId: string;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "pending" | "paid" | "cancelled";
  paymentIntentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --------------------------------------
// 💳 PAYMENT INTENT (Stripe)
// --------------------------------------
export interface PaymentIntentResponse {
  clientSecret: string;
}

// --------------------------------------
// 📊 ANALYTICS DATA
// --------------------------------------
export interface EventAnalytics {
  totalRevenue: number;
  totalOrders: number;
  topVendors: {
    vendorName: string;
    revenue: number;
  }[];
  totalAttendees: number;
}

// --------------------------------------
// ✅ GENERAL API RESPONSE WRAPPERS
// --------------------------------------
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
