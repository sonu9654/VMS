import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import api from '../api';
import { Car, FileText, AlertTriangle, TrendingUp, BarChart3, Activity } from 'lucide-react';

interface DashboardProps {
  vehicles: Vehicle[];
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  vehicles, 
  onEditVehicle, 
  onDeleteVehicle 
}) => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalDocuments: 0,
    expiringSoon: 0,
    expired: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      icon: Car,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Documents',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSoon,
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Expired',
      value: stats.expired,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600">Quick insights into your vehicle management</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
           Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-xl p-6 animate-pulse">
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-1/4 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : (
          statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`bg-white rounded-xl p-6 border border-gray-100 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className={`text-3xl font-bold text-gray-800`}>{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Vehicles Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Recent Vehicles</h2>
          </div>
          {vehicles.length > 0 && (
            <span className="text-sm text-gray-500">Showing latest {Math.min(6, vehicles.length)} vehicles</span>
          )}
        </div>

        {vehicles.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles added yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first vehicle to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.slice(0, 6).map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={onEditVehicle}
                onDelete={onDeleteVehicle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};