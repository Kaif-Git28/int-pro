import React, { memo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AlertsProps } from '../types';

const Alerts: React.FC<AlertsProps> = memo(({ alerts }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Alerts</h2>
      </div>
      {alerts.length > 0 ? (
        <div className="overflow-y-auto max-h-80">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start space-x-3 p-3 mb-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
            >
              <div
                className={`p-1.5 rounded-full ${
                  alert.severity === 'critical' ? 'bg-red-500 bg-opacity-20' : 'bg-yellow-500 bg-opacity-20'
                }`}
              >
                <AlertTriangle
                  size={16}
                  className={alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{alert.type}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Machine: {alert.machine}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-gray-500 dark:text-gray-400">
          <AlertTriangle size={24} className="mx-auto mb-2 opacity-50" />
          <p>No active alerts at this time</p>
        </div>
      )}
    </div>
  );
});

export default Alerts; 