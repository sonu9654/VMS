import React, { useState, useEffect } from 'react';
import { NotificationData } from '../types';
import { formatDate } from '../utils';
import { Bell, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface NotificationsProps {
  notifications: NotificationData[];
  onMarkAsRead: (id: string) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onMarkAsRead,
}) => {

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated on your vehicle document expiry dates</p>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No new notifications</h3>
            <p className="text-gray-500">All your documents are up to date!</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const isExpired = new Date(notification.expiryDate) < new Date();

            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-lg border p-6 ${
                  isExpired ? 'border-red-200' : 'border-amber-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                     <div className={`w-12 h-12 ${isExpired ? 'bg-red-50' : 'bg-amber-50'} rounded-full flex items-center justify-center`}>
                      {isExpired ? (
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-lg font-bold text-gray-900 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                         <span>Expires on: {formatDate(notification.expiryDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Mark as Read</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};