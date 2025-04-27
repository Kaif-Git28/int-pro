import React, { memo } from 'react';
import { HardDrive, Clock, RotateCcw, Calendar } from 'lucide-react';
import { MachineStatusProps } from '../types';
import { useDashboard } from '../context/DashboardContext';

const MachineStatus: React.FC<MachineStatusProps> = memo(({ onSelectMachine }) => {
  const { machineList, setSelectedMachine, dashboardData, resetMachineFailure } = useDashboard();

  const handleMachineClick = (machineId: string) => {
    if (onSelectMachine) {
      onSelectMachine(machineId);
    } else {
      setSelectedMachine(machineId);
    }
  };

  // Get failure time for a machine from the persistent storage
  const getTimeToFailure = (machineId: string) => {
    // First check the persistent storage
    if (dashboardData.machineFailureStatus[machineId]) {
      return dashboardData.machineFailureStatus[machineId];
    }
    
    // Fallback to current data if not in persistent storage
    const machineData = dashboardData.historicalData.find(data => data.machineId === machineId);
    return machineData ? machineData.timeToFailure : 0;
  };
  
  // Check if a machine was reset recently
  const getMachineResetInfo = (machineId: string) => {
    return dashboardData.resetMachines[machineId] || null;
  };
  
  // Get days since last reset
  const getDaysSinceReset = (resetTime: string) => {
    const resetDate = new Date(resetTime);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - resetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Reset failure prediction after maintenance is complete
  const handleResetFailurePrediction = (e: React.MouseEvent, machineId: string) => {
    e.stopPropagation(); // Prevent row click
    
    // Simple confirmation
    if (window.confirm(`Reset failure prediction for ${machineId}? This indicates maintenance has been completed.`)) {
      // Call the reset function from context
      resetMachineFailure(machineId);
      
      // Show confirmation message
      alert(`Maintenance completed for ${machineId}. Failure prediction reset.`);
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
                Time to Failure
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {machineList.map((machineId) => {
              const timeToFailure = getTimeToFailure(machineId);
              const resetInfo = getMachineResetInfo(machineId);
              
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
                    {timeToFailure > 0 ? (
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-purple-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {Math.round(timeToFailure)} days
                          </span>
                          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                            <div
                              className={`h-full ${
                                timeToFailure < 130
                                  ? 'bg-red-500'
                                  : timeToFailure < 170
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((timeToFailure / 200) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {timeToFailure < 130
                              ? 'Critical - Schedule maintenance'
                              : timeToFailure < 170
                              ? 'Warning - Monitor closely'
                              : 'Normal operation'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Not calculated
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {resetInfo ? (
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} className="text-green-500" />
                        <div>
                          <span className="text-xs text-green-500 font-medium">
                            Maintenance completed {getDaysSinceReset(resetInfo.resetTime)} days ago
                          </span>
                        </div>
                      </div>
                    ) : timeToFailure > 0 ? (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        timeToFailure < 130
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-400'
                          : timeToFailure < 170
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-400'
                      }`}>
                        {timeToFailure < 130
                          ? 'Maintenance Required'
                          : timeToFailure < 170
                          ? 'Monitoring Required'
                          : 'Normal Operation'}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {timeToFailure > 0 && (
                      <button
                        onClick={(e) => handleResetFailurePrediction(e, machineId)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        title="Reset after maintenance completed"
                      >
                        <RotateCcw size={16} className="mr-1" />
                        <span className="text-xs">Reset</span>
                      </button>
                    )}
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