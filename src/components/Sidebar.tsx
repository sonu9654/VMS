import React from 'react';
import { Home, Car, FileText, Plus, Bell, Settings, LogOut, LayoutDashboard as Dashboard, List } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  notificationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  onLogout, 
  notificationCount 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Dashboard },
    { id: 'vehicles', label: 'All Vehicles', icon: List },
    { id: 'add-vehicle', label: 'Add Vehicle', icon: Plus },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notificationCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen p-4 shadow-xl">
      <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-700">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Car className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Vehicle Manager</h2>
          <p className="text-slate-400 text-sm">Admin Panel</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-400 shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};