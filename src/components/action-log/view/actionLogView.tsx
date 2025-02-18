import React from 'react';
import { ActionLogViewProps } from '@/types/action-log/types';
import moment from 'moment';

const ActionLogView: React.FC<ActionLogViewProps> = ({ actionLogData = {} }) => {
  const { id, timestamp, action, details, isError, user } = actionLogData;

  const formattedTimestamp = timestamp ? moment(timestamp).format('MM-DD-YYYY HH:mm:ss') : '-';

  let formattedDetails: string = '';
  if (details) {
    try {
      const parsedDetails = JSON.parse(details);
      formattedDetails = JSON.stringify(parsedDetails, null, 2);
    } catch {
      formattedDetails = details;
    }
  }

  return (
    <div className="bg-gray-50 w-full rounded-2xl">
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">ID:</span>
            <span className="text-gray-800">{id ?? '-'}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">User:</span>
            <span className="text-gray-800">{`${user?.username} (${user?.email})` || '-'}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Role:</span>
            <span className="text-gray-800">{user?.role?.name || '-'}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Timestamp:</span>
            <span className="text-gray-800">{formattedTimestamp}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Action:</span>
            <span className="text-gray-800">{action || '-'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Is Error:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isError
                  ? 'bg-red-200 text-red-800'
                  : 'bg-green-200 text-green-800'
              }`}
            >
              {isError ? 'Yes' : 'No'}
            </span>
          </div>

          {details && (
            <div>
              <span className="font-medium text-gray-600">Details:</span>
              <pre className="mt-2 p-3 bg-gray-100 rounded-2xl text-sm text-gray-700 overflow-x-auto">
                {formattedDetails}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionLogView;
