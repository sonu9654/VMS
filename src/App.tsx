import React, { useState, useEffect } from 'react';
import { Vehicle, User, NotificationData } from './types';
import api from './api';
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
  USER: 'vm_user',
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Check for user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
    const savedTheme = localStorage.getItem('vm_theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
  }, []);

  // Fetch data when user is logged in
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [vehiclesRes, notificationsRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/notifications'),
      ]);
      setVehicles(vehiclesRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
      // If token is invalid, logout user
      if ((error as any).response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setVehicles([]);
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setActiveView('dashboard');
  };

  const handleSaveVehicle = async (vehicleData) => {
    try {
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, vehicleData);
      } else {
        await api.post('/vehicles', vehicleData);
      }
      fetchData(); // Refetch all data to get the latest state
      setEditingVehicle(null);
      setActiveView('dashboard');
    } catch (error) {
      console.error('Failed to save vehicle', error);
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setActiveView('add-vehicle');
  };

  const handleDeleteVehicle = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchData(); // Refetch
      } catch (error) {
        console.error('Failed to delete vehicle', error);
      }
    }
  };

  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchData(); // Refetch
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (view === 'add-vehicle') {
      setEditingVehicle(null);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('vm_theme', newTheme);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          onLogout={handleLogout}
          notificationCount={notifications.length}
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
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
            />
          )}

          {activeView === 'settings' && (
             <Settings
                onThemeChange={handleThemeChange}
                currentTheme={theme}
             />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;