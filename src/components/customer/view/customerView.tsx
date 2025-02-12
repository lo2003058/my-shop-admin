import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faGlobe,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { CustomerViewProps } from '@/types/customer/types';

const statusMap: Record<number, string> = {
  0: 'Active',
  1: 'Inactive',
  2: 'Banned',
};

const CustomerView: React.FC<CustomerViewProps> = ({ customerData = {} }) => {

  const getStatusText = (status: number): string =>
    statusMap[status] ?? 'N/A';

  return (
    <div className="lg:col-start-3 lg:row-end-1">
      <h2 className="sr-only">Customer Details</h2>
      <dl className="p-6 space-y-4">
        {/* Full Name */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-gray-400 mr-2" />
          <div>
            <dt className="text-sm font-semibold text-gray-900">Name</dt>
            <dd className="mt-1 text-base text-gray-900">
              {customerData.firstName || 'N/A'} {customerData.lastName || ''}
            </dd>
          </div>
        </div>
        {/* Email */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-gray-400 mr-2" />
          <div>
            <dt className="text-sm font-semibold text-gray-900">Email</dt>
            <dd className="mt-1 text-base text-gray-900">
              {customerData.email || 'N/A'}
            </dd>
          </div>
        </div>
        {/* Country Code */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faGlobe} className="h-6 w-6 text-gray-400 mr-2" />
          <div>
            <dt className="text-sm font-semibold text-gray-900">Country Code</dt>
            <dd className="mt-1 text-base text-gray-900">
              {customerData.countryCode || 'N/A'}
            </dd>
          </div>
        </div>
        {/* Phone */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faPhone} className="h-6 w-6 text-gray-400 mr-2" />
          <div>
            <dt className="text-sm font-semibold text-gray-900">Phone</dt>
            <dd className="mt-1 text-base text-gray-900">
              {customerData.phone || 'N/A'}
            </dd>
          </div>
        </div>
        {/* Status */}
        <div className="flex items-center">
          <FontAwesomeIcon icon={faInfoCircle} className="h-6 w-6 text-gray-400 mr-2" />
          <div>
            <dt className="text-sm font-semibold text-gray-900">Status</dt>
            <dd className="mt-1 text-base text-gray-900">
              {getStatusText(customerData.status || 0)}
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
};

export default CustomerView;
