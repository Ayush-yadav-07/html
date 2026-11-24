export type EventType = 
  | 'Wedding' 
  | 'Birthday' 
  | 'Corporate Event' 
  | 'Conference' 
  | 'Anniversary' 
  | 'Concert' 
  | 'Gala Dinner'
  | 'Other';

export type EventStatus = 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';

export interface EventItem {
  id: string;
  name: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  venue: string;
  expectedGuests: number;
  budget: number;
  description: string;
  status: EventStatus;
  createdAt: string;
}

export type RSVPStatus = 'Confirmed' | 'Pending' | 'Declined';

export type GuestCategory = 
  | 'VIP' 
  | 'Family' 
  | 'Bride Side' 
  | 'Groom Side' 
  | 'Colleague' 
  | 'Friend' 
  | 'General';

export interface Guest {
  id: string;
  eventId: string; // Linked event
  name: string;
  phone: string;
  email: string;
  category: GuestCategory;
  plusGuests: number; // Additional guests/party size (1 means just guest, +N)
  rsvpStatus: RSVPStatus;
  tableId?: string; // Assigned seating table
  dietaryPreference?: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain' | 'None';
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory = 
  | 'Venue' 
  | 'Catering' 
  | 'Decoration' 
  | 'Photography' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Other';

export type PaymentStatus = 'Paid' | 'Pending' | 'Partial';

export interface Expense {
  id: string;
  eventId: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  vendorName: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export type VendorCategory = 
  | 'Catering' 
  | 'Photography & Video' 
  | 'Venue' 
  | 'Floral & Decor' 
  | 'Sound & DJ' 
  | 'Makeup & Styling' 
  | 'Transport & Logistics' 
  | 'Invitations & Gifts'
  | 'Other';

export type VendorStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export interface Vendor {
  id: string;
  eventId: string;
  name: string;
  category: VendorCategory;
  contactPerson: string;
  phone: string;
  email: string;
  cost: number;
  status: VendorStatus;
  notes?: string;
  rating?: number;
  createdAt: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  eventId: string;
  name: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  createdAt: string;
}

export interface SeatingTable {
  id: string;
  eventId: string;
  name: string; // e.g. "Table 1 (VIP)", "Table 2 (Family)"
  capacity: number;
  shape: 'Round' | 'Rectangular' | 'Long Banquet';
  zone?: string; // e.g., "Front Stage", "Garden Area", "Main Hall"
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  linkTab?: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  type: 'event' | 'guest' | 'expense' | 'vendor' | 'task' | 'seating';
  timestamp: string;
  eventId?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
