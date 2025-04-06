import React, { memo } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { KPICardProps } from '../types';

const KPICard: React.FC<KPICardProps> = memo(({ title, value, icon, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
    <div className="flex justify-between">
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</div>
        <div className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</div>
      </div>
      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-500 bg-opacity-20">{icon}</div>
    </div>
    <div className="mt-3 flex items-center text-xs">
      {trend > 0 ? (
        <ArrowUpRight size={14} className="text-emerald-500 mr-1" />
      ) : (
        <ArrowDownRight size={14} className="text-red-500 mr-1" />
      )}
      <span className={trend > 0 ? 'text-emerald-500' : 'text-red-500'}>{Math.abs(trend)}%</span>
      <span className="text-gray-500 dark:text-gray-400 ml-1">vs last week</span>
    </div>
  </div>
));

export default KPICard; 