import React, { memo } from 'react';
import { HardDrive } from 'lucide-react';
import { MachineStatusProps } from '../types';
import { useDashboard } from '../context/DashboardContext';

const MachineStatus: React.FC<MachineStatusProps> = memo(({ onSelectMachine }) => {
  const { machineList, setSelectedMachine } = useDashboard();

  // Helper function to determine machine status based on data
  const getMachineStatus = (machineId: string) => {
    // In a real application, you would determine this based on actual data
    // For now, we'll randomize for demonstration
    const statuses = ['Running', 'Idle', 'Warning', 'Maintenance'];
    const randomIndex = Math.floor(machineId.charCodeAt(machineId.length - 1) % 4);
    return statuses[randomIndex] as 'Running' | 'Idle' | 'Warning' | 'Maintenance';
  };

  // Helper function to generate health percentage
  const getMachineHealth = (machineId: string) => {
    // Hash the machine ID to get a consistent random value
    const hash = machineId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 50 + (hash % 50); // Value between 50% and 99%
  };

  // Helper function to generate last maintenance date
  const getLastMaintenance = (machineId: string) => {
    const hash = machineId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const daysAgo = hash % 60; // Between 0 and 59 days ago
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString();
  };

  const handleMachineClick = (machineId: string) => {
    if (onSelectMachine) {
      onSelectMachine(machineId);
    } else {
      setSelectedMachine(machineId);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Machine Status</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Machine
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Health
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Maintenance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {machineList.map((machineId) => {
              const status = getMachineStatus(machineId);
              const health = getMachineHealth(machineId);
              const lastMaintenance = getLastMaintenance(machineId);
              
              return (
                <tr 
                  key={machineId} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleMachineClick(machineId)}
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <HardDrive size={16} className="text-blue-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{machineId}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Machine ID: {machineId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        status === 'Running'
                          ? 'bg-emerald-500 bg-opacity-20 text-emerald-500'
                          : status === 'Idle'
                          ? 'bg-blue-500 bg-opacity-20 text-blue-500'
                          : status === 'Warning'
                          ? 'bg-yellow-500 bg-opacity-20 text-yellow-500'
                          : 'bg-gray-500 bg-opacity-20 text-gray-500'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            health >= 90
                              ? 'bg-emerald-500'
                              : health >= 75
                              ? 'bg-blue-500'
                              : health >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${health}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{health}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {lastMaintenance}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default MachineStatus; 