import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faInfoCircle, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { CustomerViewProps } from '@/types/customer/types';

const CustomerBasicInfo: React.FC<CustomerViewProps> = ({ customerData = {} }) => {
  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: 'Active', color: 'bg-green-100 text-green-700' },
    1: { text: 'Inactive', color: 'bg-gray-100 text-gray-700' },
    2: { text: 'Banned', color: 'bg-red-100 text-red-700' },
  };

  const getStatus = (status: number) =>
    statusMap[status] ?? { text: 'N/A', color: 'bg-gray-100 text-gray-700' };

  return (
    <div className="bg-white border-gray-100">
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Name Section */}
          <div className="group p-4 rounded-xl transition-colors">
            <div className="flex items-center mb-2">
              <div className="bg-blue-50 rounded-lg p-2">
                <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-500">Customer Name</h3>
            </div>
            <p className="text-lg font-medium text-gray-900 ml-11">
              {customerData.firstName || 'N/A'} {customerData.lastName || ''}
            </p>
          </div>

          {/* Email Section */}
          <div className="group p-4 rounded-xl transition-colors">
            <div className="flex items-center mb-2">
              <div className="bg-purple-50 rounded-lg p-2">
                <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-500">Email Address</h3>
            </div>
            <p className="text-lg font-medium text-gray-900 ml-11">
              {customerData.email || 'N/A'}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Phone Section */}
          <div className="group p-4 rounded-xl transition-colors">
            <div className="flex items-center mb-2">
              <div className="bg-green-50 rounded-lg p-2">
                <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-500">Phone Number</h3>
            </div>
            <div className="ml-11">
              <p className="text-lg font-medium text-gray-900">
                {customerData.countryCode + ' ' + customerData.phone || 'N/A'}
              </p>
            </div>
          </div>

          {/* Status Section */}
          <div className="group p-4 rounded-xl transition-colors">
            <div className="flex items-center mb-2">
              <div className="bg-orange-50 rounded-lg p-2">
                <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-500">Account Status</h3>
            </div>
            <div className="ml-11">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatus(customerData.status || 0).color}`}>
                  {getStatus(customerData.status || 0).text}
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBasicInfo;
