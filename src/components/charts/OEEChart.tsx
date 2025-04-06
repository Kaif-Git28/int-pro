import React, { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { OEEChartProps } from '../../types';

const OEEChart: React.FC<OEEChartProps> = memo(({ oeeValue }) => {
  const data = [
    { name: 'OEE', value: oeeValue },
    { name: 'Remaining', value: 100 - oeeValue },
  ];
  const COLORS = ['#3b82f6', '#e5e7eb'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Equipment Effectiveness</h2>
      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{oeeValue.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">OEE Score</div>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm text-gray-600 dark:text-gray-300">Target: 95%</div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {oeeValue >= 95 ? 'Excellent Performance' : oeeValue >= 85 ? 'Good Performance' : 'Needs Improvement'}
        </div>
      </div>
    </div>
  );
});

export default OEEChart; 