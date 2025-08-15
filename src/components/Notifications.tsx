import React, { useState, useEffect } from 'react';
import { Vehicle, NotificationData } from '../types';
import { getExpiringDocuments, formatDate } from '../utils';
import { Bell, AlertTriangle, Clock, CheckCircle, Filter, Search, Calendar } from 'lucide-react';

interface NotificationsProps {
  vehicles: Vehicle[];
  onRemindTomorrow: (notification: NotificationData) => void;
  onRenewalDone: (notification: NotificationData) => void;
  dismissedNotifications: string[];
}

export const Notifications: React.FC<NotificationsProps> = ({
  vehicles,
  onRemindTomorrow,
  onRenewalDone,
  dismissedNotifications
}) => {
  const [filter, setFilter] = useState<'all' | 'expired' | 'expiring'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    const allNotifications = getExpiringDocuments(vehicles);
    let filtered = allNotifications;

    // Apply status filter
    if (filter === 'expired') {
      filtered = filtered.filter(n => n.daysUntilExpiry < 0);
    } else if (filter === 'expiring') {
      filtered = filtered.filter(n => n.daysUntilExpiry >= 0 && n.daysUntilExpiry <= 30);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.documentType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setNotifications(filtered);
  }, [vehicles, filter, searchTerm]);

  const getStatusInfo = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) {
      return {
        status: 'expired',
        text: `Expired ${Math.abs(daysUntilExpiry)} days ago`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertTriangle
      };
    } else if (daysUntilExpiry <= 7) {
      return {
        status: 'critical',
        text: `Expires in ${daysUntilExpiry} days`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertTriangle
      };
    } else if (daysUntilExpiry <= 30) {
      return {
        status: 'warning',
        text: `Expires in ${daysUntilExpiry} days`,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: Clock
      };
    } else {
      return {
        status: 'valid',
        text: `Expires in ${daysUntilExpiry} days`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle
      };
    }
  };

  const filterCounts = {
    all: getExpiringDocuments(vehicles).length,
    expired: getExpiringDocuments(vehicles).filter(n => n.daysUntilExpiry < 0).length,
    expiring: getExpiringDocuments(vehicles).filter(n => n.daysUntilExpiry >= 0 && n.daysUntilExpiry <= 30).length
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated on your vehicle document expiry dates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Expired Documents</p>
              <p className="text-3xl font-bold">{filterCounts.expired}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Expiring Soon</p>
              <p className="text-3xl font-bold">{filterCounts.expiring}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Notifications</p>
              <p className="text-3xl font-bold">{filterCounts.all}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All', count: filterCounts.all },
                { key: 'expired', label: 'Expired', count: filterCounts.expired },
                { key: 'expiring', label: 'Expiring', count: filterCounts.expiring }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by vehicle number or document type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'All your documents are up to date!'}
            </p>
          </div>
        ) : (
          notifications.map((notification, index) => {
            const statusInfo = getStatusInfo(notification.daysUntilExpiry);
            const StatusIcon = statusInfo.icon;
            const notificationId = `${notification.vehicleNumber}-${notification.documentType}-${notification.expiryDate}`;
            const isDismissed = dismissedNotifications.includes(notificationId);

            return (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg border ${statusInfo.borderColor} p-6 ${
                  isDismissed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
                      <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {notification.vehicleNumber}
                        </h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          {notification.documentType}
                        </span>
                      </div>
                      
                      <p className={`text-sm font-medium mb-2 ${statusInfo.color}`}>
                        {statusInfo.text}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Expiry: {formatDate(notification.expiryDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!isDismissed && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onRemindTomorrow(notification)}
                        className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-1"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Remind Tomorrow</span>
                      </button>
                      
                      <button
                        onClick={() => onRenewalDone(notification)}
                        className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Renewal Done</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {isDismissed && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      ✓ This notification has been dismissed
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};