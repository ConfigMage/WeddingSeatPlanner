export interface Guest {
  id: string;
  name: string;
  table?: string;
  mealChoice?: 'Steak' | 'Chicken' | 'Veg';
  notes?: string;
}

export interface Table {
  id: string;
  name: string;
  seats: number;
  x: number;
  y: number;
  guests: Guest[];
}

export interface SeatingChart {
  id: string;
  name: string;
  tables: Table[];
  unassignedGuests: Guest[];
  createdAt: string;
  updatedAt: string;
}

export type AppMode = 'planning' | 'kiosk';

export interface CSVRow {
  Name: string;
  Table?: string;
  'Meal choice'?: string;
  Notes?: string;
}