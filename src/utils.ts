import { Vehicle, NotificationData } from './types';

export const calculateDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const timeDifference = expiry.getTime() - today.getTime();
  return Math.ceil(timeDifference / (1000 * 3600 * 24));
};

export const getDocumentStatus = (expiryDate: string): 'expired' | 'expiring' | 'valid' => {
  const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate);
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring';
  return 'valid';
};

export const getExpiringDocuments = (vehicles: Vehicle[]): NotificationData[] => {
  const expiringDocs: NotificationData[] = [];
  
  vehicles.forEach(vehicle => {
    Object.entries(vehicle.documents).forEach(([type, doc]) => {
      if (doc) {
        const status = getDocumentStatus(doc.expiryDate);
        if (status === 'expiring' || status === 'expired') {
          expiringDocs.push({
            vehicleNumber: vehicle.vehicleNumber,
            documentType: type.toUpperCase(),
            expiryDate: doc.expiryDate,
            daysUntilExpiry: calculateDaysUntilExpiry(doc.expiryDate)
          });
        }
      }
    });
  });
  
  return expiringDocs;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};