import React, { useState, useEffect } from 'react';
import { Vehicle, User, NotificationData } from './types';
import { getExpiringDocuments } from './utils';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AddVehicle } from './components/AddVehicle';
import { VehicleList } from './components/VehicleList';
import { Documents } from './components/Documents';
import { Notifications } from './components/Notifications';
import { Settings } from './components/Settings';
import { NotificationModal } from './components/NotificationModal';

const STORAGE_KEYS = {
  VEHICLES: 'vm_vehicles',
  USER: 'vm_user',
  DISMISSED_NOTIFICATIONS: 'vm_dismissed_notifications'
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const savedVehicles = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    const savedDismissed = localStorage.getItem(STORAGE_KEYS.DISMISSED_NOTIFICATIONS);
    const savedTheme = localStorage.getItem('vm_theme') as 'light' | 'dark' || 'light';

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    }
    if (savedDismissed) {
      setDismissedNotifications(JSON.parse(savedDismissed));
    }
    setTheme(savedTheme);
  }, []);

  // Save vehicles to localStorage
  useEffect(() => {
    if (vehicles.length > 0) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    }
  }, [vehicles]);

  // Check for expiring documents and show notifications
  useEffect(() => {
    if (vehicles.length > 0 && user) {
      const expiringDocs = getExpiringDocuments(vehicles);
      const newNotifications = expiringDocs.filter(doc => {
        const notificationId = `${doc.vehicleNumber}-${doc.documentType}-${doc.expiryDate}`;
        return !dismissedNotifications.includes(notificationId);
      });

      if (newNotifications.length > 0) {
        setShowNotificationModal(true);
      }
    }
  }, [vehicles, user, dismissedNotifications]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setVehicles([]);
    setDismissedNotifications([]);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.DISMISSED_NOTIFICATIONS);
  };

  const handleSaveVehicle = (vehicle: Vehicle) => {
    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
    } else {
      setVehicles(prev => [...prev, vehicle]);
    }
    setEditingVehicle(null);
    setActiveView('dashboard');
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setActiveView('add-vehicle');
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (view === 'add-vehicle') {
      setEditingVehicle(null);
    }
  };

  const handleRemindTomorrow = (notification: NotificationData) => {
    const notificationId = `${notification.vehicleNumber}-${notification.documentType}-${notification.expiryDate}`;
    const newDismissed = [...dismissedNotifications, notificationId];
    setDismissedNotifications(newDismissed);
    localStorage.setItem(STORAGE_KEYS.DISMISSED_NOTIFICATIONS, JSON.stringify(newDismissed));
    
    // Set a reminder for tomorrow (in a real app, you'd use a proper notification system)
    setTimeout(() => {
      setDismissedNotifications(prev => prev.filter(id => id !== notificationId));
      localStorage.setItem(STORAGE_KEYS.DISMISSED_NOTIFICATIONS, 
        JSON.stringify(dismissedNotifications.filter(id => id !== notificationId))
      );
    }, 24 * 60 * 60 * 1000); // 24 hours
  };

  const handleRenewalDone = (notification: NotificationData) => {
    const notificationId = `${notification.vehicleNumber}-${notification.documentType}-${notification.expiryDate}`;
    const newDismissed = [...dismissedNotifications, notificationId];
    setDismissedNotifications(newDismissed);
    localStorage.setItem(STORAGE_KEYS.DISMISSED_NOTIFICATIONS, JSON.stringify(newDismissed));
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('vm_theme', newTheme);
  };

  const getNotificationCount = () => {
    if (vehicles.length === 0) return 0;
    const expiringDocs = getExpiringDocuments(vehicles);
    return expiringDocs.filter(doc => {
      const notificationId = `${doc.vehicleNumber}-${doc.documentType}-${doc.expiryDate}`;
      return !dismissedNotifications.includes(notificationId);
    }).length;
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const currentNotifications = getExpiringDocuments(vehicles).filter(doc => {
    const notificationId = `${doc.vehicleNumber}-${doc.documentType}-${doc.expiryDate}`;
    return !dismissedNotifications.includes(notificationId);
  });

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
        notificationCount={getNotificationCount()}
      />
      
      <div className="flex-1 overflow-hidden">
        {activeView === 'dashboard' && (
          <Dashboard
            vehicles={vehicles}
            onEditVehicle={handleEditVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        )}
        
        {activeView === 'add-vehicle' && (
          <AddVehicle
            vehicle={editingVehicle}
            onSave={handleSaveVehicle}
            onCancel={() => setActiveView('dashboard')}
          />
        )}

        {activeView === 'vehicles' && (
          <VehicleList
            vehicles={vehicles}
            onEditVehicle={handleEditVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onAddVehicle={() => setActiveView('add-vehicle')}
          />
        )}

        {activeView === 'documents' && (
          <Documents vehicles={vehicles} />
        )}

        {activeView === 'notifications' && (
          <Notifications
            vehicles={vehicles}
            onRemindTomorrow={handleRemindTomorrow}
            onRenewalDone={handleRenewalDone}
            dismissedNotifications={dismissedNotifications}
          />
        )}

        {activeView === 'settings' && (
          <Settings
            onThemeChange={handleThemeChange}
            currentTheme={theme}
          />
        )}
      </div>

      <NotificationModal
        notifications={currentNotifications}
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onRemindTomorrow={handleRemindTomorrow}
        onRenewalDone={handleRenewalDone}
      />
    </div>
    </div>
  );
}

export default App;