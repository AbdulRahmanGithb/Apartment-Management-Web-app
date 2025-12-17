
import { Flat, FlatType, Payment, User, UserRole, Facility, Expense, Suggestion, DocumentItem, Notice, ElectricityBill } from './types';

// Maintenance Rates
export const RATES = {
  [FlatType.BHK2]: 500, // $500/mo
  [FlatType.BHK3]: 750, // $750/mo
  [FlatType.BHK4]: 1000 // $1000/mo
};

// Mock Users
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin Alice', email: 'admin@skyline.com', role: UserRole.ADMIN },
  { id: 'u2', name: 'Mohammed Ali', email: 'mohammed@skyline.com', role: UserRole.VIEWER, flatId: 'A-101' },
];

const RESIDENT_NAMES = [
  "Mohammed Ali", "Fatima Begum", "Ibrahim Khan", "Aisha Siddiqui", "Yusuf Ahmed",
  "Zainab Khan", "Omar Farooq", "Maryam Bibi", "Bilal Hussain", "Sana Shaikh",
  "Hamza Malik", "Khadija Ansari", "Mustafa Sayed", "Hina Parveen", "Rashid Khan",
  "Sarah Khan", "Tariq Aziz", "Amira Shah", "Salman Khan", "Zoya Khan"
];

// Society Images
export const BUILDING_IMAGES = [
  { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop", title: "Skyline Heights Exterior" },
  { url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2000&auto=format&fit=crop", title: "Infinity Pool" },
  { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop", title: "Grand Lobby" },
  { url: "https://images.unsplash.com/photo-1585320806287-979410f252f9?q=80&w=2000&auto=format&fit=crop", title: "Community Garden" }
];

// Mock Flats - Generated for 5 Floors, 4 Flats per floor
export const MOCK_FLATS: Flat[] = [];
const FLOORS = 5;
const FLATS_PER_FLOOR = 4;
let nameIndex = 0;

for (let floor = 1; floor <= FLOORS; floor++) {
  for (let flatNum = 1; flatNum <= FLATS_PER_FLOOR; flatNum++) {
    // Determine type: Top floor is penthouses, corners are 3BHK, middle are 2BHK
    let type = FlatType.BHK2;
    if (floor === 5) type = FlatType.BHK4;
    else if (flatNum === 1 || flatNum === 4) type = FlatType.BHK3;

    MOCK_FLATS.push({
      id: `A-${floor}0${flatNum}`,
      ownerName: RESIDENT_NAMES[nameIndex % RESIDENT_NAMES.length],
      type,
      sqFt: type === FlatType.BHK2 ? 1200 : type === FlatType.BHK3 ? 1600 : 2200,
      maintenanceRate: RATES[type]
    });
    nameIndex++;
  }
}

// Mock Facilities
export const MOCK_FACILITIES: Facility[] = [
  { id: 'f1', name: 'Swimming Pool', status: 'OPERATIONAL', lastServiced: '2023-10-15' },
  { id: 'f2', name: 'Gymnasium', status: 'UNDER_MAINTENANCE', lastServiced: '2023-10-20' },
  { id: 'f3', name: 'Main Elevator A', status: 'OPERATIONAL', lastServiced: '2023-10-01' },
  { id: 'f4', name: 'Club House', status: 'CLOSED', lastServiced: '2023-09-10' },
];

// Mock Expenses
export const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', category: 'Utilities', amount: 4500, date: '2023-10-05', description: 'Electricity Bill' },
  { id: 'e2', category: 'Maintenance', amount: 1200, date: '2023-10-12', description: 'Elevator Repair' },
  { id: 'e3', category: 'Staff', amount: 8000, date: '2023-10-01', description: 'Security & Cleaning Salary' },
  { id: 'e4', category: 'Garden', amount: 300, date: '2023-10-18', description: 'New plants' },
];

// Mock Documents (Using real-looking document images)
export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'd1',
    title: 'Land Deed & Property Title',
    category: 'LEGAL',
    uploadDate: '2022-01-15',
    pages: [
        'https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=1000&auto=format&fit=crop', // Text paper
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop'  // Legal document
    ]
  },
  {
    id: 'd2',
    title: 'Fire Safety Compliance Certificate',
    category: 'LEGAL',
    uploadDate: '2023-05-20',
    pages: ['https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=1000&auto=format&fit=crop'] // Official seal/paper
  },
  {
    id: 'd3',
    title: 'AGM Minutes - Annual Meeting 2023',
    category: 'NOTICE',
    uploadDate: '2023-09-30',
    pages: ['https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=1000&auto=format&fit=crop'] // Text heavy
  },
  {
      id: 'd4',
      title: 'Financial Audit Report 2023',
      category: 'FINANCIAL',
      uploadDate: '2023-04-10',
      pages: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop'] // Calculator and paper
  },
  {
      id: 'd5',
      title: 'Society Bye-Laws',
      category: 'LEGAL',
      uploadDate: '2021-06-01',
      pages: ['https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop'] // Signing contract
  }
];

// Mock Suggestions
export const MOCK_SUGGESTIONS: Suggestion[] = [
  { id: 's1', userId: 'u2', userName: 'Mohammed Ali', title: 'Gym AC Issue', description: 'The AC in the gym is making a loud noise.', date: '2023-10-22', status: 'OPEN', upvotes: 5 },
  { id: 's2', userId: 'u3', userName: 'Ibrahim Khan', title: 'Pool Cleaning', description: 'Pool needs more frequent cleaning.', date: '2023-10-20', status: 'RESOLVED', upvotes: 12 }
];

// Mock Notices
export const MOCK_NOTICES: Notice[] = [
  { id: 'n1', title: 'Main Gate Closure', message: 'Today gate will closed at 12:00 for maintenance works.', date: '2023-10-26', type: 'URGENT', postedBy: 'Admin Alice' },
  { id: 'n2', title: 'Parking Notice', message: 'Park your vehicle outside for two days due to driveway repaving.', date: '2023-10-26', type: 'INFO', postedBy: 'Admin Alice' },
  { id: 'n3', title: 'Terrace Occupied', message: 'Terrace is occupied by Imran resident for a private function tonight.', date: '2023-10-26', type: 'EVENT', postedBy: 'Admin Alice' },
];

// Generate payment history
export const MOCK_PAYMENTS: Payment[] = [];
MOCK_FLATS.forEach(flat => {
  // Generate data for last 3 months
  const months = ['2023-08', '2023-09', '2023-10'];
  
  months.forEach((month, idx) => {
    // Randomize status: older months mostly paid, current month (last one) might be pending
    let status: 'PAID' | 'PENDING' | 'OVERDUE' = 'PAID';
    
    if (idx === months.length - 1) {
        // Current month
        status = Math.random() > 0.3 ? 'PAID' : 'PENDING';
    } else {
        // Past months
        status = Math.random() > 0.9 ? 'OVERDUE' : 'PAID';
    }

    MOCK_PAYMENTS.push({
      id: `p-${flat.id}-${month}`,
      flatId: flat.id,
      amount: flat.maintenanceRate,
      date: `${month}-05`,
      status,
      month: month
    });
  });
});

// Generate Electricity Bills
export const MOCK_ELECTRICITY_BILLS: ElectricityBill[] = [];
MOCK_FLATS.forEach(flat => {
  // Generate random usage
  const units = Math.floor(Math.random() * (450 - 150) + 150); // Between 150 and 450 units
  const rate = 8.5; // Rs per unit
  const amount = Math.floor(units * rate);
  
  MOCK_ELECTRICITY_BILLS.push({
    id: `eb-${flat.id}`,
    flatId: flat.id,
    month: "October 2023",
    readingDate: "2023-10-24",
    unitsConsumed: units,
    ratePerUnit: rate,
    amount: amount,
    dueDate: "2023-11-10",
    status: Math.random() > 0.2 ? 'PAID' : 'UNPAID'
  });
});
