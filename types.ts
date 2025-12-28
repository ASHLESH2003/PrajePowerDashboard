export enum Role {
  Administrator = 'Administrator',
  Resolver = 'Resolver',
  Viewer = 'Viewer',
  Citizen = 'Citizen'
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum Status {
  New = 'New',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed'
}

// --- 👇 THIS WAS MISSING. ADDING IT FIXES THE CRASH 👇 ---
export type Category = 'Pothole' | 'Streetlight Out' | 'Trash' | string;

export interface User {
  id: string;
  username: string; // Needed for the Login logic
  name: string;
  role: Role;
  email: string;
  contact: string;
  password?: string; 
  avatar?: string;  
}

// ... (keep your Enums at the top)

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  reportedAt: Date;
  // CHANGED: Now stores the raw object instead of a string
  location: { lat: number; lng: number } | null; 
  imageUrl?: string;
  resolution?: string;
  resolutionPhoto?: string;
  reporter: {
    id: string;
    name: string;
    email: string;
    contact: string;
    role: string;
  };
}