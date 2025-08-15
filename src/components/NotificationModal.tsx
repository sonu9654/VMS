import React from 'react';
import { NotificationData } from '../types';
import { formatDate } from '../utils';
import { X, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface NotificationModalProps {
  notifications: NotificationData[];
  isOpen: boolean;
  onClose: () => void;
  onRemindTomorrow: (notification: NotificationData) => void;
  onRenewalDone: (notification: NotificationData) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  isOpen,
  onClose,
  onRemindTomorrow,
  onRenewalDone,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Document Expiry Alert</h2>
                <p className="text-red-100">Some of your documents need attention</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={index} className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        {notification.daysUntilExpiry < 0 ? (
                          <AlertTriangle className="w-4 h-4 text-white" />
                        ) : (
                          <Clock className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {notification.vehicleNumber} - {notification.documentType}
                        </h3>
                        <p className="text-sm text-red-600">
                          {notification.daysUntilExpiry < 0 
                            ? `Expired ${Math.abs(notification.daysUntilExpiry)} days ago`
                            : `Expires in ${notification.daysUntilExpiry} days`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-10">
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Expiry Date:</span> {formatDate(notification.expiryDate)}
                      </p>
                      
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {notifications.length} document(s) need your attention
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};