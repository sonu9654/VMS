import React from 'react';
import { Vehicle } from '../types';
import { getDocumentStatus, formatDate } from '../utils';
import { Car, Edit, Trash2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired': return 'text-red-500 bg-red-50';
      case 'expiring': return 'text-amber-600 bg-amber-50';
      case 'valid': return 'text-green-600 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      case 'expiring': return <Clock className="w-4 h-4" />;
      case 'valid': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const documents = [
    { key: 'rc', label: 'RC', doc: vehicle.documents.rc },
    { key: 'pollution', label: 'Pollution', doc: vehicle.documents.pollution },
    { key: 'insurance', label: 'Insurance', doc: vehicle.documents.insurance },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{vehicle.vehicleNumber}</h3>
              <p className="text-blue-100 text-sm">{vehicle.brand} {vehicle.model}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(vehicle)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Edit className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => onDelete(vehicle.id)}
              className="p-2 bg-white/20 rounded-lg hover:bg-red-500/50 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Vehicle Type:</span>
            <span className="font-medium text-gray-900">{vehicle.vehicleType}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Year:</span>
            <span className="font-medium text-gray-900">{vehicle.year}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Document Status</h4>
          <div className="space-y-2">
            {documents.map(({ key, label, doc }) => {
              if (!doc) {
                return (
                  <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded">
                      Not Added
                    </span>
                  </div>
                );
              }

              const status = getDocumentStatus(doc.expiryDate);
              return (
                <div key={key} className="flex items-center justify-between p-2 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <p className="text-xs text-gray-500">Expires: {formatDate(doc.expiryDate)}</p>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    <span className="capitalize">{status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};