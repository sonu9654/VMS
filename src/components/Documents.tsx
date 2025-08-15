import React, { useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { getDocumentStatus, formatDate } from '../utils';
import { FileText, Search, Filter, Download, Eye, AlertTriangle, CheckCircle, Clock, Calendar } from 'lucide-react';

interface DocumentsProps {
  vehicles: Vehicle[];
}

export const Documents: React.FC<DocumentsProps> = ({ vehicles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'rc' | 'pollution' | 'insurance'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'expiring' | 'expired'>('all');

  const allDocuments = useMemo(() => {
    const docs: Array<{
      id: string;
      vehicleNumber: string;
      vehicleBrand: string;
      vehicleModel: string;
      documentType: 'rc' | 'pollution' | 'insurance';
      documentNumber: string;
      issueDate: string;
      expiryDate: string;
      status: 'expired' | 'expiring' | 'valid';
      daysUntilExpiry: number;
    }> = [];

    vehicles.forEach(vehicle => {
      Object.entries(vehicle.documents).forEach(([type, doc]) => {
        if (doc) {
          const status = getDocumentStatus(doc.expiryDate);
          const today = new Date();
          const expiry = new Date(doc.expiryDate);
          const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

          docs.push({
            id: doc.id,
            vehicleNumber: vehicle.vehicleNumber,
            vehicleBrand: vehicle.brand,
            vehicleModel: vehicle.model,
            documentType: type as 'rc' | 'pollution' | 'insurance',
            documentNumber: doc.documentNumber,
            issueDate: doc.issueDate,
            expiryDate: doc.expiryDate,
            status,
            daysUntilExpiry
          });
        }
      });
    });

    return docs;
  }, [vehicles]);

  const filteredDocuments = useMemo(() => {
    let filtered = allDocuments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by document type
    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.documentType === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(doc => doc.status === filterStatus);
    }

    return filtered.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  }, [allDocuments, searchTerm, filterType, filterStatus]);

  const getStatusInfo = (status: string, daysUntilExpiry: number) => {
    switch (status) {
      case 'expired':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: AlertTriangle,
          text: `Expired ${Math.abs(daysUntilExpiry)} days ago`
        };
      case 'expiring':
        return {
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          icon: Clock,
          text: `Expires in ${daysUntilExpiry} days`
        };
      case 'valid':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle,
          text: `Valid for ${daysUntilExpiry} days`
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: FileText,
          text: 'Unknown status'
        };
    }
  };

  const getDocumentTypeInfo = (type: string) => {
    switch (type) {
      case 'rc':
        return { label: 'Registration Certificate', color: 'bg-blue-500' };
      case 'pollution':
        return { label: 'Pollution Certificate', color: 'bg-green-500' };
      case 'insurance':
        return { label: 'Insurance Certificate', color: 'bg-purple-500' };
      default:
        return { label: type, color: 'bg-gray-500' };
    }
  };

  const statusCounts = {
    all: allDocuments.length,
    valid: allDocuments.filter(d => d.status === 'valid').length,
    expiring: allDocuments.filter(d => d.status === 'expiring').length,
    expired: allDocuments.filter(d => d.status === 'expired').length
  };

  const typeCounts = {
    all: allDocuments.length,
    rc: allDocuments.filter(d => d.documentType === 'rc').length,
    pollution: allDocuments.filter(d => d.documentType === 'pollution').length,
    insurance: allDocuments.filter(d => d.documentType === 'insurance').length
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
        <p className="text-gray-600">Manage and track all your vehicle documents in one place</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Documents</p>
              <p className="text-3xl font-bold">{statusCounts.all}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Valid Documents</p>
              <p className="text-3xl font-bold">{statusCounts.valid}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Expiring Soon</p>
              <p className="text-3xl font-bold">{statusCounts.expiring}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Expired</p>
              <p className="text-3xl font-bold">{statusCounts.expired}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Document Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All', count: typeCounts.all },
                  { key: 'rc', label: 'RC', count: typeCounts.rc },
                  { key: 'pollution', label: 'Pollution', count: typeCounts.pollution },
                  { key: 'insurance', label: 'Insurance', count: typeCounts.insurance }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilterType(key as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterType === key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All', count: statusCounts.all },
                  { key: 'valid', label: 'Valid', count: statusCounts.valid },
                  { key: 'expiring', label: 'Expiring', count: statusCounts.expiring },
                  { key: 'expired', label: 'Expired', count: statusCounts.expired }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilterStatus(key as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === key
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full lg:w-80"
            />
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Add some vehicles to see their documents here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle & Document
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => {
                  const statusInfo = getStatusInfo(doc.status, doc.daysUntilExpiry);
                  const typeInfo = getDocumentTypeInfo(doc.documentType);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${typeInfo.color} rounded-lg flex items-center justify-center`}>
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{doc.vehicleNumber}</div>
                            <div className="text-sm text-gray-500">{doc.vehicleBrand} {doc.vehicleModel}</div>
                            <div className="text-xs text-gray-400">{typeInfo.label}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{doc.documentNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(doc.issueDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(doc.expiryDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusInfo.text}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1 rounded">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};