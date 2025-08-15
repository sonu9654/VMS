import React, { useState } from 'react';
import { Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import { getDocumentStatus, formatDate } from '../utils';
import { Car, Search, Filter, Grid, List, Plus, SortAsc, SortDesc } from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  onAddVehicle: () => void;
}

export const VehicleList: React.FC<VehicleListProps> = ({ 
  vehicles, 
  onEditVehicle, 
  onDeleteVehicle,
  onAddVehicle 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Car' | 'Motorcycle' | 'Truck' | 'Bus' | 'Auto'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'year' | 'created'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAndSortedVehicles = React.useMemo(() => {
    let filtered = vehicles;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.vehicleType === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.vehicleNumber;
          bValue = b.vehicleNumber;
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [vehicles, searchTerm, filterType, sortBy, sortOrder]);

  const vehicleTypeCounts = React.useMemo(() => {
    const counts = { all: vehicles.length };
    vehicles.forEach(vehicle => {
      const type = vehicle.vehicleType as keyof typeof counts;
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [vehicles]);

  const getDocumentStatusSummary = (vehicle: Vehicle) => {
    const docs = Object.values(vehicle.documents).filter(doc => doc !== null);
    if (docs.length === 0) return { total: 0, expired: 0, expiring: 0, valid: 0 };

    const summary = { total: docs.length, expired: 0, expiring: 0, valid: 0 };
    docs.forEach(doc => {
      if (doc) {
        const status = getDocumentStatus(doc.expiryDate);
        summary[status as keyof typeof summary]++;
      }
    });
    return summary;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Vehicles</h1>
            <p className="text-gray-600">Complete list of your registered vehicles</p>
          </div>
          <button
            onClick={onAddVehicle}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Vehicles</p>
                <p className="text-2xl font-bold">{vehicles.length}</p>
              </div>
              <Car className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Cars</p>
                <p className="text-2xl font-bold">{vehicleTypeCounts.Car || 0}</p>
              </div>
              <Car className="w-8 h-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Motorcycles</p>
                <p className="text-2xl font-bold">{vehicleTypeCounts.Motorcycle || 0}</p>
              </div>
              <Car className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Others</p>
                <p className="text-2xl font-bold">
                  {vehicles.length - (vehicleTypeCounts.Car || 0) - (vehicleTypeCounts.Motorcycle || 0)}
                </p>
              </div>
              <Car className="w-8 h-8 text-amber-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types ({vehicleTypeCounts.all})</option>
                <option value="Car">Cars ({vehicleTypeCounts.Car || 0})</option>
                <option value="Motorcycle">Motorcycles ({vehicleTypeCounts.Motorcycle || 0})</option>
                <option value="Truck">Trucks ({vehicleTypeCounts.Truck || 0})</option>
                <option value="Bus">Buses ({vehicleTypeCounts.Bus || 0})</option>
                <option value="Auto">Auto Rickshaws ({vehicleTypeCounts.Auto || 0})</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="created">Sort by Date Added</option>
                <option value="name">Sort by Vehicle Number</option>
                <option value="year">Sort by Year</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Display */}
      {filteredAndSortedVehicles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterType !== 'all' ? 'No vehicles found' : 'No vehicles added yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start by adding your first vehicle to get started'
            }
          </p>
          {(!searchTerm && filterType === 'all') && (
            <button
              onClick={onAddVehicle}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Add Vehicle
            </button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onEdit={onEditVehicle}
                  onDelete={onDeleteVehicle}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type & Year
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documents
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Added
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedVehicles.map((vehicle) => {
                      const docSummary = getDocumentStatusSummary(vehicle);
                      return (
                        <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Car className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{vehicle.vehicleNumber}</div>
                                <div className="text-sm text-gray-500">{vehicle.brand} {vehicle.model}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{vehicle.vehicleType}</div>
                            <div className="text-sm text-gray-500">{vehicle.year}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-1">
                              {docSummary.valid > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {docSummary.valid} Valid
                                </span>
                              )}
                              {docSummary.expiring > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  {docSummary.expiring} Expiring
                                </span>
                              )}
                              {docSummary.expired > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {docSummary.expired} Expired
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(vehicle.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => onEditVehicle(vehicle)}
                                className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => onDeleteVehicle(vehicle.id)}
                                className="text-red-600 hover:text-red-900 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};