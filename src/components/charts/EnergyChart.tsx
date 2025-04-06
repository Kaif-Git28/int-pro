import React, { memo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { energyConsumptionData } from '../../data/mockData';

const EnergyChart: React.FC = memo(() => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Energy Consumption</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={energyConsumptionData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
            <YAxis tick={{ fill: '#6B7280' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                borderColor: '#374151',
                color: '#F9FAFB',
              }}
              itemStyle={{ color: '#F9FAFB' }}
            />
            <Area
              type="monotone"
              dataKey="consumption"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.2}
              name="kWh"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default EnergyChart; 