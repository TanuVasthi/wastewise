export type WasteRecord = {
  id: string;
  wasteType: 'Organic' | 'Plastic' | 'E-Waste' | 'Paper' | 'Glass' | 'Metal';
  quantity: number;
  location: string;
  date: Date;
  collectorId: string;
  truckId?: string;
};

export type User = {
  id: string;
  name: string;
  role: 'Admin' | 'Data Collector';
  email: string;
};

export type Bin = {
  id: string;
  location: string;
  capacity: number;
  lastEmptied: Date;
};

export const wasteTypes = ['Organic', 'Plastic', 'E-Waste', 'Paper', 'Glass', 'Metal'] as const;

export const locations = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];

export const mockWasteRecords: WasteRecord[] = [
  { id: '1', wasteType: 'Organic', quantity: 120, location: 'Zone A', date: new Date('2024-07-20T08:00:00Z'), collectorId: 'C001' },
  { id: '2', wasteType: 'Plastic', quantity: 55, location: 'Zone B', date: new Date('2024-07-20T09:30:00Z'), collectorId: 'C002', truckId: 'T01' },
  { id: '3', wasteType: 'Paper', quantity: 80, location: 'Zone A', date: new Date('2024-07-21T08:15:00Z'), collectorId: 'C001' },
  { id: '4', wasteType: 'E-Waste', quantity: 15, location: 'Zone C', date: new Date('2024-07-21T11:00:00Z'), collectorId: 'C003', truckId: 'T02' },
  { id: '5', wasteType: 'Glass', quantity: 40, location: 'Zone B', date: new Date('2024-07-22T10:00:00Z'), collectorId: 'C002' },
  { id: '6', wasteType: 'Organic', quantity: 150, location: 'Zone D', date: new Date('2024-07-22T14:00:00Z'), collectorId: 'C004', truckId: 'T03' },
  { id: '7', wasteType: 'Plastic', quantity: 70, location: 'Zone A', date: new Date('2024-07-23T08:45:00Z'), collectorId: 'C001' },
  { id: '8', wasteType: 'Metal', quantity: 25, location: 'Zone C', date: new Date('2024-07-23T12:30:00Z'), collectorId: 'C003' },
];

export const mockUsers: User[] = [
    { id: '1', name: 'Admin User', role: 'Admin', email: 'admin@wastewise.com' },
    { id: '2', name: 'John Doe', role: 'Data Collector', email: 'john.doe@wastewise.com' },
    { id: '3', name: 'Jane Smith', role: 'Data Collector', email: 'jane.smith@wastewise.com' },
];

export const mockBins: Bin[] = [
    { id: 'B001', location: 'Zone A - Market', capacity: 1000, lastEmptied: new Date('2024-07-22T06:00:00Z')},
    { id: 'B002', location: 'Zone B - Park', capacity: 500, lastEmptied: new Date('2024-07-23T07:00:00Z')},
    { id: 'B003', location: 'Zone C - Residential', capacity: 750, lastEmptied: new Date('2024-07-21T09:00:00Z')},
];
