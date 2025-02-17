import React from 'react';
import { CustomerViewProps } from '@/types/customer/types';
import { GET_CUSTOMER_POINT } from '@/graphql/Customer/queries';
import { useQuery } from '@apollo/client';
import LoadingComponent from '@/components/common/loadingComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCoins } from '@fortawesome/free-solid-svg-icons';


const CustomerPoints: React.FC<CustomerViewProps> = ({ customerData = {} }) => {
  const { data, loading, error } = useQuery(GET_CUSTOMER_POINT, {
    variables: { id: customerData.id },
  });

  if (loading) return <LoadingComponent />;
  if (error) return <p>Error: {error.message}</p>;

  const points = data?.customer.customerPoints || {};

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-gray-900">Points Summary</h2>
          <div className="bg-blue-50 rounded-lg p-2">
            <FontAwesomeIcon icon={faCoins} className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Points */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faCoins} className="h-4 w-4 text-blue-600 mr-2" />
              <p className="text-sm font-medium text-gray-500">Current Points</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {points.currentPoints?.toLocaleString() || '0'}
            </p>
          </div>

          {/* Accumulated Points */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-blue-600 mr-2" />
              <p className="text-sm font-medium text-gray-500">Period Points</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {points.accumulatedPoints?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        {/* Total Points */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Accumulated Points</p>
              <p className="text-2xl font-semibold text-blue-900 mt-1">
                {points.totalAccumulatedPoints?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <FontAwesomeIcon icon={faChartLine} className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPoints;
