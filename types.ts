
export enum UserRole {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER' // Resident
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  flatId?: string; // If resident
}

export enum FlatType {
  BHK2 = '2 BHK',
  BHK3 = '3 BHK',
  BHK4 = '4 BHK'
}

export interface Flat {
  id: string; // e.g., "A-101"
  ownerName: string;
  type: FlatType;
  sqFt: number;
  maintenanceRate: number; // calculated based on type
}

export interface Payment {
  id: string;
  flatId: string;
  amount: number;
  date: string; // ISO date
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  month: string; // "2023-10"
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface Facility {
  id: string;
  name: string;
  status: 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'CLOSED';
  lastServiced: string;
}

export interface Suggestion {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  date: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  upvotes: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'LEGAL' | 'FINANCIAL' | 'NOTICE';
  uploadDate: string;
  pages: string[]; // Array of image URLs representing pages
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'URGENT' | 'INFO' | 'EVENT';
  postedBy: string;
}

export interface ElectricityBill {
  id: string;
  flatId: string;
  month: string; // "October 2023"
  readingDate: string;
  unitsConsumed: number;
  ratePerUnit: number;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'UNPAID';
}
