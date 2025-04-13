import React, { memo, useMemo } from 'react';
import { Gauge, Thermometer, Zap, Clock } from 'lucide-react';
import { SpindleParametersProps, MachineData } from '../types';

const SpindleParameters: React.FC<SpindleParametersProps> = memo(({ data, machineId }) => {
  // Memoize the latest data point for the selected machine
  const latestData = useMemo(() => {
    if (!machineId || !data.length) return null;
    return data.find(d => d.machineId === machineId) || null;
  }, [data, machineId]);

  // Memoize the parameter cards to prevent unnecessary re-renders
  const parameterCards = useMemo(() => {
    if (!latestData) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Temperature</h3>
            <Thermometer className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {latestData.temperature.toFixed(1)}
            </span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">°C</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  latestData.temperature > 35
                    ? 'bg-red-500'
                    : latestData.temperature > 30
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((latestData.temperature / 42) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Speed</h3>
            <Gauge className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {latestData.speed.toFixed(0)}
            </span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">RPM</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  latestData.speed > 5500
                    ? 'bg-red-500'
                    : latestData.speed > 4500
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((latestData.speed / 6500) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Load</h3>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {latestData.load.toFixed(1)}
            </span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">Load</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  latestData.load > 140
                    ? 'bg-red-500'
                    : latestData.load > 100
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((latestData.load / 168) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time to Failure</h3>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          {latestData.timeToFailure > 0 ? (
            <>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {latestData.timeToFailure.toFixed(1)}
                </span>
                <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">days</span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      latestData.timeToFailure < 150
                        ? 'bg-red-500'
                        : latestData.timeToFailure < 170
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((latestData.timeToFailure / 195) * 100, 100)}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {latestData.timeToFailure < 150
                    ? 'Critical - Immediate attention required'
                    : latestData.timeToFailure < 170
                    ? 'Warning - Schedule maintenance soon'
                    : 'Normal - Regular operation'}
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              Time to failure will be calculated when load exceeds 140%
            </div>
          )}
        </div>
      </div>
    );
  }, [latestData]);

  if (!machineId) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Please select a machine to view spindle parameters
        </p>
      </div>
    );
  }

  if (!latestData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No data available for the selected machine
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Spindle Parameters - {machineId}
      </h2>
      {parameterCards}
    </div>
  );
});

export default SpindleParameters; 