export interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  documents: {
    rc: Document | null;
    pollution: Document | null;
    insurance: Document | null;
  };
  createdAt: string;
}

export interface Document {
  id: string;
  type: 'rc' | 'pollution' | 'insurance';
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  fileName?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface NotificationData {
  vehicleNumber: string;
  documentType: string;
  expiryDate: string;
  daysUntilExpiry: number;
}