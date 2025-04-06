import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { productivityData } from '../../data/mockData';

const ProductivityChart: React.FC = memo(() => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Productivity</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={productivityData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
            <Legend wrapperStyle={{ color: '#6B7280' }} />
            <Bar dataKey="actual" name="Actual" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" name="Target" fill="#6B7280" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default ProductivityChart; 