import React, { useState, useEffect } from 'react';
import { Vehicle, Document } from '../types';
import { generateId } from '../utils';
import { Car, Save, X, FileText, Calendar, Hash } from 'lucide-react';

interface AddVehicleProps {
  vehicle?: Vehicle | null;
  onSave: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

export const AddVehicle: React.FC<AddVehicleProps> = ({ vehicle, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
  });

  const [documents, setDocuments] = useState({
    rc: null as Document | null,
    pollution: null as Document | null,
    insurance: null as Document | null,
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.vehicleType,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
      });
      setDocuments(vehicle.documents);
    }
  }, [vehicle]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentChange = (
    docType: keyof typeof documents,
    field: string,
    value: string
  ) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: prev[docType] 
        ? { ...prev[docType]!, [field]: value }
        : {
            id: generateId(),
            type: docType,
            documentNumber: field === 'documentNumber' ? value : '',
            issueDate: field === 'issueDate' ? value : '',
            expiryDate: field === 'expiryDate' ? value : '',
          }
    }));
  };

  const removeDocument = (docType: keyof typeof documents) => {
    setDocuments(prev => ({ ...prev, [docType]: null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vehicleData: Vehicle = {
      id: vehicle?.id || generateId(),
      ...formData,
      documents,
      createdAt: vehicle?.createdAt || new Date().toISOString(),
    };

    onSave(vehicleData);
  };

  const documentTypes = [
    { key: 'rc' as const, label: 'Registration Certificate (RC)', color: 'blue' },
    { key: 'pollution' as const, label: 'Pollution Certificate', color: 'green' },
    { key: 'insurance' as const, label: 'Insurance Certificate', color: 'purple' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h1>
          <p className="text-gray-600">
            {vehicle ? 'Update vehicle information and documents' : 'Fill in the details to add a new vehicle'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Vehicle Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Vehicle Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange('vehicleNumber', e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., MH12AB1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type *
                </label>
                <select
                  required
                  value={formData.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Type</option>
                  <option value="Car">Car</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Truck">Truck</option>
                  <option value="Bus">Bus</option>
                  <option value="Auto">Auto Rickshaw</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Honda, Maruti, Toyota"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., City, Swift, Camry"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  required
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Documents</h2>
            </div>

            <div className="space-y-6">
              {documentTypes.map(({ key, label, color }) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">{label}</h3>
                    {documents[key] && (
                      <button
                        type="button"
                        onClick={() => removeDocument(key)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {!documents[key] ? (
                    <button
                      type="button"
                      onClick={() => handleDocumentChange(key, 'documentNumber', '')}
                      className={`w-full p-4 border-2 border-dashed border-${color}-300 text-${color}-600 rounded-lg hover:bg-${color}-50 transition-colors flex items-center justify-center space-x-2`}
                    >
                      <FileText className="w-5 h-5" />
                      <span>Add {label}</span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Document Number
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={documents[key]?.documentNumber || ''}
                            onChange={(e) => handleDocumentChange(key, 'documentNumber', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Issue Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="date"
                            value={documents[key]?.issueDate || ''}
                            onChange={(e) => handleDocumentChange(key, 'issueDate', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="date"
                            value={documents[key]?.expiryDate || ''}
                            onChange={(e) => handleDocumentChange(key, 'expiryDate', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{vehicle ? 'Update Vehicle' : 'Save Vehicle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};